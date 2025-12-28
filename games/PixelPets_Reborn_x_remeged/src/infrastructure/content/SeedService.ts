/**
 * Seed Service
 * Initializes the database with base pets, abilities, and initial player data
 */

import { openDatabase } from '../persistence/schema';
import { BasePetRepository } from '../persistence/repositories/BasePetRepository';
import { AbilityRepository } from '../persistence/repositories/AbilityRepository';
import { PlayerRepository } from '../persistence/repositories/PlayerRepository';
import { StoneRepository } from '@/infrastructure/persistence/repositories/StoneRepository';
import { StoneGenerator } from '@/domain/services/StoneGenerator';
import type { Ability } from '@/domain/entities/Ability';
import { Rarity } from '@/shared/types/rarity';
import { StoneType, StoneTier } from '@/domain/entities/Stone';
import { ALL_BASE_PETS } from '../persistence/seedData/basePets';
import { ALL_REMAINING_PETS } from '../persistence/seedData/basePetsRemaining';
import { ALL_PASSIVE_ABILITIES, ALL_ACTIVE_ABILITIES } from '../persistence/seedData/abilities';

const SEED_VERSION_KEY = 'seed_version';
const CURRENT_SEED_VERSION = 1;

/**
 * Check if database needs seeding
 */
export async function needsSeeding(): Promise<boolean> {
  try {
    const db = await openDatabase();
    const storedVersion = await db.get('sprites', SEED_VERSION_KEY);
    
    // If no version stored, needs seeding
    if (!storedVersion) {
      return true;
    }
    
    // Check if version matches
    const version = (storedVersion as any)?.seedVersion;
    if (version !== CURRENT_SEED_VERSION) {
      return true;
    }
    
    // Check if we have base pets and abilities
    const basePetCount = await db.count('basePets');
    const abilityCount = await db.count('abilities');
    
    // Need at least some base pets and abilities
    return basePetCount === 0 || abilityCount === 0;
  } catch (error) {
    console.error('[SeedService] Error checking if seeding needed:', error);
    return true;
  }
}

/**
 * Seed all abilities from seed data
 */
async function seedAbilities(): Promise<Map<string, Ability>> {
  console.log('[SeedService] Seeding abilities...');
  const abilityRepository = new AbilityRepository();
  const abilityMap = new Map<string, Ability>();

  // Seed passive abilities from seed data
  for (const ability of ALL_PASSIVE_ABILITIES) {
    try {
      await abilityRepository.save(ability);
      abilityMap.set(ability.id, ability);
    } catch (error) {
      console.warn(`[SeedService] Failed to save passive ability ${ability.name}:`, error);
    }
  }

  // Seed active abilities from seed data
  for (const ability of ALL_ACTIVE_ABILITIES) {
    try {
      await abilityRepository.save(ability);
      abilityMap.set(ability.id, ability);
    } catch (error) {
      console.warn(`[SeedService] Failed to save active ability ${ability.name}:`, error);
    }
  }

  console.log(`[SeedService] Seeded ${abilityMap.size} abilities from seed data`);
  return abilityMap;
}

/**
 * Seed base pets from pre-designed seed data
 */
async function seedBasePets(abilityMap: Map<string, Ability>): Promise<void> {
  console.log('[SeedService] Seeding base pets...');
  const basePetRepository = new BasePetRepository();
  
  // Combine all base pets from seed data
  const allBasePets = [...ALL_BASE_PETS, ...ALL_REMAINING_PETS];
  
  // Get passive ability IDs by element/category
  const passiveAbilitiesByType = new Map<string, string[]>();
  abilityMap.forEach((ability, id) => {
    if (ability.type === 'passive' && ability.element) {
      if (!passiveAbilitiesByType.has(ability.element)) {
        passiveAbilitiesByType.set(ability.element, []);
      }
      passiveAbilitiesByType.get(ability.element)!.push(id);
    }
  });
  
  // Save all base pets
  for (const basePet of allBasePets) {
    try {
      // Try to map the starter abilities and passives to actual ability IDs
      // For now, we'll save them as-is since the design uses ability names
      await basePetRepository.save(basePet);
    } catch (error) {
      console.warn(`[SeedService] Failed to save base pet ${basePet.name}:`, error);
    }
  }
  
  console.log(`[SeedService] Seeded ${allBasePets.length} base pets`);
}

/**
 * Seed starter stones for the player
 */
async function seedStarterStones(): Promise<void> {
  console.log('[SeedService] Seeding starter stones...');
  const stoneRepository = new StoneRepository();
  
  const stoneTypes = Object.values(StoneType);
  const starterStones = [
    // Give player one of each stone type at Tier I
    ...stoneTypes.map(type => StoneGenerator.generateStone(type, StoneTier.I)),
    // Give a few Tier II stones
    StoneGenerator.generateStone(StoneType.RUBY, StoneTier.II),
    StoneGenerator.generateStone(StoneType.SAPPHIRE, StoneTier.II),
    StoneGenerator.generateStone(StoneType.EMERALD, StoneTier.II),
  ];
  
  for (const stone of starterStones) {
    await stoneRepository.save(stone);
  }
  
  console.log(`[SeedService] Seeded ${starterStones.length} starter stones`);
}

/**
 * Seed initial player data with starter essence
 */
async function seedPlayer(): Promise<void> {
  console.log('[SeedService] Seeding player data...');
  const playerRepository = new PlayerRepository();
  
  const playerExists = await playerRepository.exists('player_1');
  if (playerExists) {
    console.log('[SeedService] Player already exists, skipping player seed');
    return;
  }
  
  // Create player with starter essence
  const starterEssence: Record<Rarity, number> = {
    [Rarity.BASIC]: 100,
    [Rarity.RARE]: 50,
    [Rarity.SR]: 20,
    [Rarity.LEGENDARY]: 5,
    [Rarity.MYTHIC]: 0,
    [Rarity.PRISMATIC]: 0,
    [Rarity.OMEGA]: 0,
  };
  
  const { Player } = await import('@/domain/entities/Player');
  const defaultPlayer = new Player(
    'player_1',
    'Player',
    starterEssence,
    100, // dataKeys (new field)
    500, // corruptedBytes (new field)
    0,   // pityCounter (new field)
    1000, // Starting rank
    [], // teams
    [], // completedDungeons
    Date.now()
  );
  
  await playerRepository.save(defaultPlayer);
  console.log('[SeedService] Seeded player data');
}

/**
 * Main seed function
 */
export async function seedDatabase(): Promise<void> {
  try {
    console.log('[SeedService] Starting database seeding...');
    
    // Check if already seeded
    const needsSeed = await needsSeeding();
    if (!needsSeed) {
      console.log('[SeedService] Database already seeded, skipping');
      return;
    }
    
    // Seed abilities first (base pets need ability IDs)
    const abilityMap = await seedAbilities();
    
    // Seed base pets
    await seedBasePets(abilityMap);
    
    // Seed starter stones
    await seedStarterStones();
    
    // Seed player
    await seedPlayer();
    
    // Mark as seeded
    const db = await openDatabase();
    // Use sprites store to store seed version (it's just metadata)
    // In a real implementation, you might want a separate metadata store
    await db.put('sprites', { id: SEED_VERSION_KEY, seedVersion: CURRENT_SEED_VERSION, spriteData: '' } as any);
    
    console.log('[SeedService] Database seeding completed successfully!');
  } catch (error) {
    console.error('[SeedService] Error seeding database:', error);
    throw error;
  }
}
