/**
 * Generate Encounter Use Case
 * Converts dungeon waves/boss into combat-ready pet teams
 */

import type { Dungeon, MinionWave } from '@/domain/entities/Dungeon';
import { Pet } from '@/domain/entities/Pet';
import type { BasePet } from '@/domain/entities/BasePet';
import type { IAbilityRepository } from '@/domain/repositories/IAbilityRepository';
import { AbilityRepository } from '@/infrastructure/persistence/repositories/AbilityRepository';
import { Stats } from '@/domain/valueObjects/Stats';
import { generatePetId } from '@/shared/utils/idGenerator';
import { brandBasePetId } from '@/shared/types/brands';
import { Ability } from '@/domain/entities/Ability';
import { generateAbilityId } from '@/shared/utils/idGenerator';

export interface GenerateEncounterInput {
  dungeon: Dungeon;
  waveIndex: number;
  playerTeamSize: number; // Number of pets in player team (1-4)
}

export interface GenerateEncounterOutput {
  enemyPets: Pet[];
  isBoss: boolean;
}

/**
 * Generate Encounter Use Case
 */
export class GenerateEncounter {
  private abilityRepository: IAbilityRepository;

  constructor(abilityRepository?: IAbilityRepository) {
    this.abilityRepository = abilityRepository || new AbilityRepository();
  }

  async execute(input: GenerateEncounterInput): Promise<GenerateEncounterOutput> {
    const { dungeon, waveIndex, playerTeamSize } = input;

    // Validate player team size (1-4)
    if (playerTeamSize < 1 || playerTeamSize > 4) {
      throw new Error('Player team size must be between 1 and 4');
    }

    // Check if this is the boss encounter
    const isBoss = waveIndex >= dungeon.minionWaves.length;

    if (isBoss) {
      // Generate boss encounter - scale boss pets to match player team size
      const bossPets: Pet[] = [];
      for (let i = 0; i < playerTeamSize; i++) {
        const bossPet = await this.convertBasePetToPet(
          dungeon.boss.pet,
          dungeon.boss.difficultyMultiplier
        );
        bossPets.push(bossPet);
      }
      return {
        enemyPets: bossPets,
        isBoss: true,
      };
    } else {
      // Generate minion wave - use actual wave pets, limit to player team size
      const wave: MinionWave = dungeon.minionWaves[waveIndex];
      const enemyPets: Pet[] = [];

      // Use actual wave pets, but limit to player team size
      const wavePetsToUse = wave.pets.slice(0, Math.min(wave.pets.length, playerTeamSize));

      // Convert base pets to combat pets, applying difficulty scaling
      for (const basePet of wavePetsToUse) {
        const pet = await this.convertBasePetToPet(basePet, 1.0); // Minions use base stats
        enemyPets.push(pet);
      }

      // Don't fill with duplicates - use what's in the wave (1-4 pets based on player team size)
      return {
        enemyPets: enemyPets,
        isBoss: false,
      };
    }
  }

  /**
   * Convert a BasePet to a Pet entity for combat
   * Applies difficulty multiplier to stats
   */
  private async convertBasePetToPet(
    basePet: BasePet,
    difficultyMultiplier: number
  ): Promise<Pet> {
    // Calculate scaled stats
    const scaledHp = Math.round(basePet.baseStats.hp * difficultyMultiplier);
    const scaledAttack = Math.round(basePet.baseStats.attack * difficultyMultiplier);
    const scaledDefense = Math.round(basePet.baseStats.defense * difficultyMultiplier);
    // Speed typically doesn't scale with difficulty
    const speed = basePet.baseStats.speed;

    const stats = Stats.create(scaledHp, scaledHp, scaledAttack, scaledDefense, speed);

    // Load abilities from IDs
    const passiveAbilities = [];
    const activeAbilities = [];
    let ultimateAbility = null;

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

    if (activeAbilities.length === 0) {
      const fallbackAbility = new Ability(
        generateAbilityId(),
        'Basic Strike',
        'A simple attack that deals damage to a single enemy.',
        'active',
        20,
        0,
        0,
        [
          {
            type: 'damage',
            target: 'single-enemy',
            value: 1.0,
            scaling: 'attack',
          },
        ],
        [],
        null
      );
      activeAbilities.push(fallbackAbility);
    }

    // Create pet entity
    return new Pet(
      generatePetId(),
      'DUNGEON_ENEMY', // playerId
      brandBasePetId(basePet.id),
      basePet.name,
      null, // nickname
      basePet.family,
      basePet.rarity,
      stats,
      passiveAbilities,
      activeAbilities,
      ultimateAbility,
      [], // fusionHistory - dungeon enemies are not fused
      {
        visualTags: [...basePet.visualTags],
      },
      null, // battleStats - new combat instance
      Date.now(), // collectionDate
      false, // isHacked
      basePet.lore // lore from base pet
    );
  }
}
