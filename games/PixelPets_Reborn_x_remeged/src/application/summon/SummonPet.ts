/**
 * Summon Pet Use Case
 * Summons a base pet with duplicate prevention
 */

import { Pet } from '@/domain/entities/Pet';
import type { BasePet } from '@/domain/entities/BasePet';
import type { IPetRepository } from '@/domain/repositories/IPetRepository';
import type { IBasePetRepository } from '@/domain/repositories/IBasePetRepository';
import type { IPlayerRepository } from '@/domain/repositories/IPlayerRepository';
import { generatePetId } from '@/shared/utils/idGenerator';
import { Stats } from '@/domain/valueObjects/Stats';
import type { Ability } from '@/domain/entities/Ability';
import type { IAbilityRepository } from '@/domain/repositories/IAbilityRepository';
import { RARITY_CONFIG } from '@/shared/types/rarity';

export interface SummonPetInput {
  basePetId: string;
  playerId: string;
}

export interface SummonPetOutput {
  pet: Pet;
  message: string;
}

/**
 * Summon Pet Use Case
 */
export class SummonPet {
  constructor(
    private petRepository: IPetRepository,
    private basePetRepository: IBasePetRepository,
    private abilityRepository: IAbilityRepository,
    private playerRepository: IPlayerRepository
  ) {}

  async execute(input: SummonPetInput): Promise<SummonPetOutput> {
    // Fetch base pet template
    const basePet = await this.basePetRepository.findById(input.basePetId as any);

    if (!basePet) {
      throw new Error(`Base pet not found: ${input.basePetId}`);
    }

    // Fetch player
    const player = await this.playerRepository.findById(input.playerId);
    if (!player) {
      throw new Error(`Player not found: ${input.playerId}`);
    }

    // Validate and consume essence
    const rarityConfig = RARITY_CONFIG[basePet.rarity];
    const requiredEssence = rarityConfig.summonCost;
    const currentEssence = player.essence[basePet.rarity];

    if (currentEssence < requiredEssence) {
      throw new Error(
        `Insufficient ${rarityConfig.name} essence. Required: ${requiredEssence}, Available: ${currentEssence}`
      );
    }

    // Check for duplicate - get all owned base pet IDs
    const ownedBasePetIds = await this.petRepository.getOwnedBasePetIds();

    if (ownedBasePetIds.has(basePet.id)) {
      // Duplicate detected - cannot summon
      // Throw error instead of returning invalid pet
      throw new Error(`You already own a ${basePet.name}. You must fuse it before you can summon another.`);
    }

    // Consume essence
    const newEssence = { ...player.essence };
    newEssence[basePet.rarity] = currentEssence - requiredEssence;
    const updatedPlayer = player.withEssence(newEssence);
    await this.playerRepository.save(updatedPlayer);

    // Create pet from base pet template
    const pet = await this.createPetFromBase(basePet, input.playerId);

    // Save pet
    await this.petRepository.save(pet);

    return {
      pet,
      message: `Successfully summoned ${basePet.name} for ${requiredEssence} ${rarityConfig.name} essence!`,
    };
  }

  /**
   * Create a pet instance from a base pet template
   */
  private async createPetFromBase(basePet: BasePet, playerId: string): Promise<Pet> {
    // Create stats from base stats (start at max HP)
    const stats = Stats.create(
      basePet.baseStats.hp,
      basePet.baseStats.hp, // maxHp
      basePet.baseStats.attack,
      basePet.baseStats.defense,
      basePet.baseStats.speed
    );

    // Load abilities from IDs
    const passiveAbilities: Ability[] = [];
    const activeAbilities: Ability[] = [];
    let ultimateAbility: Ability | null = null;

    // Load passive abilities
    for (const abilityId of basePet.starterPassives) {
      const ability = await this.abilityRepository.findById(abilityId as any);
      if (ability && ability.type === 'passive') {
        passiveAbilities.push(ability);
      }
    }

    // Load active abilities
    for (const abilityId of basePet.starterAbilities) {
      const ability = await this.abilityRepository.findById(abilityId as any);
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
      throw new Error(`Base pet ${basePet.name} has no active abilities`);
    }

    // Create pet entity
    return new Pet(
      generatePetId(),
      playerId,
      basePet.id, // basePetId - this is a base pet instance
      basePet.name,
      null, // nickname
      basePet.family,
      basePet.rarity,
      stats,
      passiveAbilities,
      activeAbilities,
      ultimateAbility,
      [], // fusionHistory - base pets have no fusion history
      {
        visualTags: [...basePet.visualTags],
      },
      null, // battleStats - new pet
      Date.now(), // collectionDate
      false, // isHacked
      basePet.lore // lore from base pet
    );
  }
}

