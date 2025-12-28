/**
 * Player Initialization Service
 * Handles first-time player setup: starter pet selection, initial inventory, currency
 */

import { z } from 'zod';
import { PlayerRepository } from '../persistence/repositories/PlayerRepository';
import { PetRepository } from '../persistence/repositories/PetRepository';
import { StoneRepository } from '../persistence/repositories/StoneRepository';
import { AbilityRepository } from '../persistence/repositories/AbilityRepository';
import { STARTER_PETS, STARTER_STONES, STARTER_CURRENCY } from '../persistence/seedData/starterData';
import { Pet } from '../../domain/entities/Pet';
import { Player, type Team } from '../../domain/entities/Player';
import { Stats } from '../../domain/valueObjects/Stats';
import { Ability } from '../../domain/entities/Ability';
import { Stone, StoneType, StoneTier } from '../../domain/entities/Stone';
import { Rarity } from '@/shared/types/rarity';
import { brandPetId, brandBasePetId, brandStoneId } from '@/shared/types/brands';

/**
 * Schema for starter pet selection
 */
export const StarterSelectionSchema = z.object({
  selectedPetName: z.string(),
  playerName: z.string().min(1).max(20),
});

export type StarterSelection = z.infer<typeof StarterSelectionSchema>;

/**
 * Service for initializing new players
 */
export class PlayerInitializationService {
  constructor(
    private playerRepository: PlayerRepository,
    private petRepository: PetRepository,
    private stoneRepository: StoneRepository,
    private abilityRepository: AbilityRepository,
  ) {}

  /**
   * Initialize a new player after starter pet selection
   * @param selection - User's choice of starter pet and player name
   * @returns Newly initialized Player entity
   */
  async initializeNewPlayer(selection: StarterSelection): Promise<Player> {
    // Validate selection
    const validated = StarterSelectionSchema.parse(selection);

    // Find the selected starter pet design
    const starterPetDesign = STARTER_PETS.find(p => p?.name === validated.selectedPetName);
    if (!starterPetDesign) {
      throw new Error(`Starter pet not found: ${validated.selectedPetName}`);
    }

    // Initialize essence with zero essence for all rarities
    const initialEssence: Record<Rarity, number> = {
      [Rarity.BASIC]: 0,
      [Rarity.RARE]: 0,
      [Rarity.SR]: 0,
      [Rarity.LEGENDARY]: 0,
      [Rarity.MYTHIC]: 0,
      [Rarity.PRISMATIC]: 0,
      [Rarity.OMEGA]: 0,
    };

    // Create initial empty team
    const initialTeam: Team = {
      id: crypto.randomUUID(),
      name: 'Team 1',
      petIds: [], // Will add starter pet after creation
      formation: [],
    };

    // Create player instance
    const player = new Player(
      crypto.randomUUID(), // id
      validated.playerName, // username
      initialEssence, // essence
      STARTER_CURRENCY.dataKeys, // dataKeys (100)
      STARTER_CURRENCY.corruptedBytes, // corruptedBytes (0)
      0, // pityCounter
      0, // rank
      [initialTeam], // teams
      [], // completedDungeons
      Date.now(), // lastUpdated
    );

    // Save player
    await this.playerRepository.save(player);

    // Create and save starter pet instance (owned by player)
    // Create stats from base stats (start at max HP)
    const stats = Stats.create(
      starterPetDesign.baseStats.hp,
      starterPetDesign.baseStats.hp, // maxHp
      starterPetDesign.baseStats.attack,
      starterPetDesign.baseStats.defense,
      starterPetDesign.baseStats.speed
    );

    // Load abilities from IDs
    const passiveAbilities: Ability[] = [];
    const activeAbilities: Ability[] = [];
    let ultimateAbility: Ability | null = null;

    // Load passive abilities
    for (const abilityName of starterPetDesign.starterPassives) {
      const ability = await this.abilityRepository.findByName(abilityName);
      if (ability && ability.type === 'passive') {
        passiveAbilities.push(ability);
      }
    }

    // Load active abilities
    for (const abilityName of starterPetDesign.starterAbilities) {
      const ability = await this.abilityRepository.findByName(abilityName);
      if (ability) {
        if (ability.type === 'active') {
          activeAbilities.push(ability);
        } else if (ability.type === 'ultimate') {
          ultimateAbility = ability;
        }
      }
    }

    // Ensure at least one active ability
    if (activeAbilities.length === 0) {
      throw new Error(`Starter pet ${starterPetDesign.name} has no active abilities`);
    }

    // Create pet entity using positional parameters
    const starterPetInstance = new Pet(
      brandPetId(crypto.randomUUID()),
      player.id,
      brandBasePetId(starterPetDesign.id),
      starterPetDesign.name,
      null, // nickname
      starterPetDesign.family,
      starterPetDesign.rarity,
      stats,
      passiveAbilities,
      activeAbilities,
      ultimateAbility,
      [], // fusionHistory - base pets have no fusion history
      {
        visualTags: [...starterPetDesign.visualTags],
      },
      null, // battleStats - new pet
      Date.now(), // collectionDate
      false, // isHacked
      starterPetDesign.lore // lore from base pet
    );

    await this.petRepository.save(starterPetInstance);

    // Update team to include starter pet
    const updatedTeam: Team = {
      ...initialTeam,
      petIds: [starterPetInstance.id],
      formation: ['front'],
    };
    const playerWithTeam = player.withTeams([updatedTeam]);
    await this.playerRepository.save(playerWithTeam);

    // Map starter stone types to StoneType enum
    const stoneTypeMap: Record<string, StoneType> = {
      'Fire': StoneType.RUBY,
      'Water': StoneType.SAPPHIRE,
      'Earth': StoneType.EMERALD,
      'Lightning': StoneType.TOPAZ,
      'Shadow': StoneType.ONYX,
      'Air': StoneType.OPAL,
      'Magic': StoneType.AMETHYST,
      'Light': StoneType.PEARL,
    };

    // Add starter stones to player inventory
    for (const [index, stoneData] of STARTER_STONES.entries()) {
      const type = stoneTypeMap[stoneData.type] || StoneType.RUBY;
      const stone = new Stone(
        brandStoneId(`${player.id}-stone-${index}`),
        player.id,
        type,
        stoneData.tier as StoneTier,
        {}, // No initial stat bonuses for starter stones
        0, // No elemental power
        false, // Not glitched
        Date.now()
      );
      await this.stoneRepository.save(stone);
    }

    return playerWithTeam;
  }

  /**
   * Get available starter pets for selection
   * @returns Array of starter pet options
   */
  getStarterPetOptions() {
    return STARTER_PETS.map(pet => ({
      name: pet?.name,
      family: pet?.family,
      rarity: pet?.rarity,
      description: pet?.lore?.substring(0, 100) + '...', // First 100 chars of lore
    }));
  }

  /**
   * Check if a player has been initialized (has starter resources)
   * @param playerId - Player ID to check
   * @returns True if player has starter pet + stones
   */
  async isPlayerInitialized(playerId: string): Promise<boolean> {
    const pets = await this.petRepository.findByPlayerId(playerId);
    const stones = await this.stoneRepository.findByPlayerId(playerId);

    return pets.length > 0 && stones.length > 0;
  }
}

/**
 * Hook for initializing player on app startup
 * Use in App.tsx to check/initialize new players
 */
export async function usePlayerInitialization(
  playerId: string,
  playerInitService: PlayerInitializationService,
): Promise<{ isInitialized: boolean; player?: any }> {
  try {
    const isInitialized = await playerInitService.isPlayerInitialized(playerId);
    return { isInitialized };
  } catch (error) {
    console.error('Error checking player initialization:', error);
    return { isInitialized: false };
  }
}
