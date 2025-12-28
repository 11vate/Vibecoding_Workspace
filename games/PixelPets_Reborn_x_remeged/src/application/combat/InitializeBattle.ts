/**
 * Initialize Battle Use Case
 * Sets up a battle between two teams
 */

import type { Pet } from '@/domain/entities/Pet';
import { Battle, type DomainEffect } from '@/domain/entities/Battle';
import type { CombatPet } from '@/domain/entities/Battle';
import { generateBattleId } from '@/shared/utils/idGenerator';
import { DomainEffectService } from '@/domain/services/DomainEffectService';
import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';

export interface InitializeBattleInput {
  team1: Pet[];
  team2: Pet[];
}

/**
 * Initialize Battle Use Case
 */
export class InitializeBattle {
  constructor(private stoneRepository?: IStoneRepository) {}

  async execute(input: InitializeBattleInput): Promise<Battle> {
    // Validate team sizes (1-4 pets allowed)
    if (input.team1.length < 1 || input.team1.length > 4) {
      throw new Error('Team 1 must have between 1 and 4 pets');
    }
    if (input.team2.length < 1 || input.team2.length > 4) {
      throw new Error('Team 2 must have between 1 and 4 pets');
    }

    // Convert pets to combat pets
    const combatTeam1 = this.convertToCombatPets(input.team1);
    const combatTeam2 = this.convertToCombatPets(input.team2);

    // Calculate turn order by speed
    const allPets = [...combatTeam1, ...combatTeam2];
    const turnOrder = allPets
      .map((p) => p.pet.id)
      .sort((a, b) => {
        const petA = allPets.find((p) => p.pet.id === a)!;
        const petB = allPets.find((p) => p.pet.id === b)!;
        return this.calculateEffectiveSpeed(petB) - this.calculateEffectiveSpeed(petA);
      });

    // Detect domain effects from all pets
    const domainEffects: DomainEffect[] = [];
    if (this.stoneRepository) {
      for (const pet of [...input.team1, ...input.team2]) {
        const effects = await DomainEffectService.getDomainEffectsForPet(pet, this.stoneRepository);
        domainEffects.push(...effects);
      }
    }

    // Create battle
    return new Battle(
      generateBattleId(),
      combatTeam1,
      combatTeam2,
      1, // currentTurn
      turnOrder,
      0, // currentActorIndex
      [], // log
      domainEffects, // domainEffects
      false, // isComplete
      null, // winner
      Date.now() // createdAt
    );
  }

  private convertToCombatPets(pets: Pet[]): CombatPet[] {
    // Front row: first half (rounded up), Back row: remaining
    const frontRowCount = Math.ceil(pets.length / 2);
    return pets.map((pet, index) => ({
      pet,
      currentHp: pet.stats.hp,
      currentEnergy: 50,
      statusEffects: [],
      buffs: [],
      debuffs: [],
      position: index < frontRowCount ? ('front' as const) : ('back' as const),
      lineageModifiers: [],
    }));
  }

  private calculateEffectiveSpeed(pet: CombatPet): number {
    let speed = pet.pet.stats.speed;

    // Apply lineage speed modifiers
    if (pet.lineageModifiers) {
      for (const mod of pet.lineageModifiers) {
        if (mod.type === 'speed_boost') {
          speed *= (1 + mod.value);
        }
      }
    }

    return speed;
  }
}













