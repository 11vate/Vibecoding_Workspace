/**
 * Dungeon Repository Implementation (IndexedDB)
 * Generates dungeons procedurally and caches them in IndexedDB
 */

import type { IDungeonRepository } from '@/domain/repositories/IDungeonRepository';
import { Dungeon, type MinionWave, type BossEncounter, type DungeonRewards, type StoneReward } from '@/domain/entities/Dungeon';
import type { DungeonId } from '@/shared/types/brands';
import { brandDungeonId } from '@/shared/types/brands';
import type { Rarity } from '@/shared/types/rarity';
import { Rarity as RarityEnum } from '@/shared/types/rarity';
import { StoneType } from '@/domain/entities/Stone';
import { openDatabase } from '../schema';
import { dungeonToDTO, dtoToDungeon } from '../mappers/DungeonMapper';
import type { IBasePetRepository } from '@/domain/repositories/IBasePetRepository';
import { BasePetRepository } from './BasePetRepository';
import type { BasePet } from '@/domain/entities/BasePet';

export class DungeonRepository implements IDungeonRepository {
  private basePetRepository: IBasePetRepository;

  constructor(basePetRepository?: IBasePetRepository) {
    this.basePetRepository = basePetRepository || new BasePetRepository();
  }

  async findById(id: DungeonId): Promise<Dungeon | null> {
    const db = await openDatabase();
    const dto = await db.get('dungeons', id);
    return dto ? dtoToDungeon(dto) : null;
  }

  async findAll(): Promise<Dungeon[]> {
    const db = await openDatabase();
    const dtos = await db.getAll('dungeons');
    return dtos.map(dtoToDungeon);
  }

  async findByFloorNumber(floorNumber: number): Promise<Dungeon | null> {
    const db = await openDatabase();
    const allDtos = await db.getAll('dungeons');
    const dto = allDtos.find((d) => d.floorNumber === floorNumber);
    return dto ? dtoToDungeon(dto) : null;
  }

  async findByTier(tier: number): Promise<Dungeon[]> {
    const db = await openDatabase();
    const allDtos = await db.getAll('dungeons');
    return allDtos.filter((d) => d.tier === tier).map(dtoToDungeon);
  }

  async save(dungeon: Dungeon): Promise<void> {
    const db = await openDatabase();
    const dto = dungeonToDTO(dungeon);
    await db.put('dungeons', dto);
  }

  async delete(id: DungeonId): Promise<void> {
    const db = await openDatabase();
    await db.delete('dungeons', id);
  }

  async exists(id: DungeonId): Promise<boolean> {
    const db = await openDatabase();
    const dto = await db.get('dungeons', id);
    return dto !== undefined;
  }

  async count(): Promise<number> {
    const db = await openDatabase();
    return db.count('dungeons');
  }

  /**
   * Generate or fetch a dungeon for a specific floor number
   * Caches generated dungeons in IndexedDB
   */
  async generateOrFetchDungeon(
    floorNumber: number,
    playerHighestRarity?: Rarity
  ): Promise<Dungeon> {
    // Check if dungeon already exists
    const existing = await this.findByFloorNumber(floorNumber);
    if (existing) {
      return existing;
    }

    // Generate new dungeon
    const dungeon = await this.generateDungeon(floorNumber, playerHighestRarity);
    await this.save(dungeon);
    return dungeon;
  }

  /**
   * Generate a dungeon for a specific floor number with difficulty scaling
   */
  async generateDungeon(
    floorNumber: number,
    playerHighestRarity?: Rarity
  ): Promise<Dungeon> {
    // Calculate tier: floors 1-10 = tier 1, 11-20 = tier 2, etc.
    const tier = Math.floor((floorNumber - 1) / 10) + 1;
    const baseDifficulty = tier;

    // Generate minion waves (3-5 waves for regular floors, 5-7 for boss floors)
    const isBossFloor = floorNumber % 10 === 0;
    const waveCount = isBossFloor 
      ? 5 + Math.floor(Math.random() * 3) // 5-7 waves for boss floors
      : 3 + Math.floor(Math.random() * 3); // 3-5 waves for regular floors
    const minionWaves: MinionWave[] = [];

    for (let i = 0; i < waveCount; i++) {
      // Later waves have slightly higher difficulty
      const waveDifficulty = baseDifficulty + (i * 0.1);
      const wavePets = await this.generateMinionPets(
        Math.floor(waveDifficulty),
        2 + Math.floor(Math.random() * 3) // 2-4 pets per wave
      );
      minionWaves.push({
        pets: wavePets,
        difficulty: waveDifficulty,
      });
    }

    // Generate boss
    const bossRarity = this.getBossRarityForFloor(floorNumber);
    const bossPets = await this.basePetRepository.findByRarity(bossRarity);
    if (bossPets.length === 0) {
      throw new Error(`No base pets found for rarity ${bossRarity}`);
    }
    const bossPet = bossPets[Math.floor(Math.random() * bossPets.length)];

    // Calculate boss difficulty multiplier
    // Base: 1.5 + (floorNumber * 0.15) for better scaling
    // Boss floors (floor 10) get additional 0.5x multiplier
    // Note: isBossFloor already declared above
    let difficultyMultiplier = 1.5 + (floorNumber * 0.15);
    if (isBossFloor) {
      difficultyMultiplier += 0.5; // Boss floors are harder
    }
    
    // Scale up if player has higher rarity pets
    if (playerHighestRarity !== undefined && playerHighestRarity > bossRarity) {
      // Increase difficulty if player has pets of higher rarity than boss
      const rarityDiff = playerHighestRarity - bossRarity;
      difficultyMultiplier += rarityDiff * 0.25; // More aggressive scaling
    }
    
    // Cap difficulty multiplier at 3.0x to prevent impossible fights
    difficultyMultiplier = Math.min(3.0, difficultyMultiplier);

    const boss: BossEncounter = {
      pet: bossPet,
      specialAbilities: [], // Can be enhanced later
      difficultyMultiplier,
    };

    // Generate rewards
    const rewards: DungeonRewards = {
      essence: this.calculateFloorRewards(floorNumber),
      stones: this.generateStoneRewards(floorNumber),
    };

    // Generate dungeon name and description
    const tierNames = ['Basic', 'Rare', 'SR', 'Legendary', 'Mythic'];
    const tierName = tierNames[tier - 1] || 'Unknown';
    const name = `Floor ${floorNumber} - ${tierName} Tier`;
    const description = `A challenging dungeon floor in the ${tierName} tier. Face ${minionWaves.length} waves of minions and a powerful boss.`;

    return new Dungeon(
      brandDungeonId(`dungeon_floor_${floorNumber}`),
      floorNumber,
      tier,
      name,
      description,
      minionWaves,
      boss,
      rewards
    );
  }

  /**
   * Generate minion pets for a wave based on difficulty
   */
  private async generateMinionPets(difficulty: number, count: number): Promise<BasePet[]> {
    const pets: BasePet[] = [];
    const allBasePets = await this.basePetRepository.findAll();

    // Scale rarity based on difficulty (tier)
    // Tier 1 (Basic): max Rarity.BASIC
    // Tier 2 (Rare): max Rarity.RARE
    // Tier 3 (SR): max Rarity.SR
    // Tier 4 (Legendary): max Rarity.LEGENDARY
    // Tier 5 (Mythic): max Rarity.MYTHIC
    const maxRarity = Math.min(RarityEnum.MYTHIC, difficulty - 1);

    for (let i = 0; i < count; i++) {
      // Randomly select a rarity up to maxRarity
      const rarityRoll = Math.floor(Math.random() * (maxRarity + 1));
      const petsOfRarity = allBasePets.filter((p) => p.rarity === rarityRoll);

      if (petsOfRarity.length > 0) {
        const randomPet = petsOfRarity[Math.floor(Math.random() * petsOfRarity.length)];
        pets.push(randomPet);
      }
    }

    return pets;
  }

  /**
   * Get boss rarity for a given floor number
   */
  private getBossRarityForFloor(floorNumber: number): Rarity {
    // Tier 1 (floors 1-10): BASIC
    if (floorNumber <= 10) return RarityEnum.BASIC;
    // Tier 2 (floors 11-20): RARE
    if (floorNumber <= 20) return RarityEnum.RARE;
    // Tier 3 (floors 21-30): SR
    if (floorNumber <= 30) return RarityEnum.SR;
    // Tier 4 (floors 31-40): LEGENDARY
    if (floorNumber <= 40) return RarityEnum.LEGENDARY;
    // Tier 5 (floors 41-50): MYTHIC
    return RarityEnum.MYTHIC;
  }

  /**
   * Calculate essence rewards for a floor
   * Boss floors (floor 10 of each tier) give essence rewards
   */
  private calculateFloorRewards(floorNumber: number): Record<Rarity, number> {
    const rewards: Record<Rarity, number> = {
      [RarityEnum.BASIC]: 0,
      [RarityEnum.RARE]: 0,
      [RarityEnum.SR]: 0,
      [RarityEnum.LEGENDARY]: 0,
      [RarityEnum.MYTHIC]: 0,
      [RarityEnum.PRISMATIC]: 0,
      [RarityEnum.OMEGA]: 0,
    };

    // Boss floors give essence rewards
    const isBossFloor = floorNumber % 10 === 0;
    if (!isBossFloor) {
      return rewards;
    }

    const bossRarity = this.getBossRarityForFloor(floorNumber);

    // Essence amounts per concept: Basic 8-12, Rare 5-8, SR 3-6, Legendary 2-4, Mythic 1-2
    switch (bossRarity) {
      case RarityEnum.BASIC:
        rewards[RarityEnum.BASIC] = 8 + Math.floor(Math.random() * 5); // 8-12
        break;
      case RarityEnum.RARE:
        rewards[RarityEnum.RARE] = 5 + Math.floor(Math.random() * 4); // 5-8
        break;
      case RarityEnum.SR:
        rewards[RarityEnum.SR] = 3 + Math.floor(Math.random() * 4); // 3-6
        break;
      case RarityEnum.LEGENDARY:
        rewards[RarityEnum.LEGENDARY] = 2 + Math.floor(Math.random() * 3); // 2-4
        break;
      case RarityEnum.MYTHIC:
        rewards[RarityEnum.MYTHIC] = 1 + Math.floor(Math.random() * 2); // 1-2
        break;
    }

    return rewards;
  }

  /**
   * Generate stone rewards for a floor
   */
  private generateStoneRewards(floorNumber: number): StoneReward[] {
    const rewards: StoneReward[] = [];
    const tier = Math.floor((floorNumber - 1) / 10) + 1;

    // Higher tier floors have better stone rewards
    // Tier 1: Tier I stones, 10% chance
    // Tier 2: Tier II stones, 15% chance
    // Tier 3: Tier III stones, 20% chance
    // Tier 4: Tier IV stones, 25% chance
    // Tier 5: Tier V stones, 30% chance
    const stoneTier = tier;
    const baseChance = 0.1 + (tier - 1) * 0.05;

    // Add stone reward for each stone type (matching StoneType enum)
    const stoneTypes = [
      StoneType.RUBY,
      StoneType.SAPPHIRE,
      StoneType.EMERALD,
      StoneType.TOPAZ,
      StoneType.AMETHYST,
      StoneType.PEARL,
      StoneType.ONYX,
      StoneType.OPAL,
    ];
    for (const type of stoneTypes) {
      rewards.push({
        type: type as string, // StoneReward expects string, but we use enum for type safety
        tier: stoneTier,
        chance: baseChance,
      });
    }

    return rewards;
  }
}
