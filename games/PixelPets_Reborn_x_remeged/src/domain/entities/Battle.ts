/**
 * Battle Entity
 * Represents a battle state between two teams
 */

import type { BattleId, PetId } from '@/shared/types/brands';
import type { StatusEffect } from '@/shared/types/status';
import type { Pet } from './Pet';
import type { Ability } from './Ability';
import type { PetFamily } from '@/shared/types/family';

export type BattleTeam = 'team1' | 'team2' | 'draw';

export interface LineageModifier {
  type: string;
  value: number;
  sourceFamily: PetFamily;
}

export interface ActiveStatusEffect {
  type: StatusEffect;
  duration: number;
  value?: number;
  source?: PetId;
}

export interface Buff {
  type: 'attack' | 'defense' | 'speed' | 'shield' | 'haste';
  value: number;
  duration: number;
  source?: PetId;
}

export interface Debuff {
  type: 'attack' | 'defense' | 'speed' | 'slow';
  value: number;
  duration: number;
  source?: PetId;
}

export interface CombatPet {
  pet: Pet;
  currentHp: number;
  currentEnergy: number;
  statusEffects: readonly ActiveStatusEffect[];
  buffs: readonly Buff[];
  debuffs: readonly Debuff[];
  position: 'front' | 'back';
  domainBoosts?: Record<string, number>;
  domainVulnerability?: Record<string, number>;
  lineageModifiers?: readonly LineageModifier[];
}

export interface CombatAction {
  petId: PetId;
  ability: Ability;
  targetIds: readonly PetId[];
  timestamp: number;
}

export interface CombatActionResult {
  targetId: PetId;
  damage?: number;
  healing?: number;
  statusApplied?: StatusEffect;
  buffApplied?: Buff;
  debuffApplied?: Debuff;
  missed?: boolean;
  critical?: boolean;
}

export interface CombatLogEntry {
  turn: number;
  action: CombatAction;
  results: readonly CombatActionResult[];
  timestamp: number;
}

export interface DomainEffect {
  type: string;
  description: string;
  sourcePetId: PetId;
}

export class Battle {
  constructor(
    public readonly id: BattleId,
    public readonly team1: readonly CombatPet[],
    public readonly team2: readonly CombatPet[],
    public readonly currentTurn: number,
    public readonly turnOrder: readonly PetId[],
    public readonly currentActorIndex: number,
    public readonly log: readonly CombatLogEntry[],
    public readonly domainEffects: readonly DomainEffect[],
    public readonly isComplete: boolean,
    public readonly winner: BattleTeam | null,
    public readonly createdAt: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Battle must have an ID');
    // Validate team sizes (1-4 pets allowed)
    if (this.team1.length < 1 || this.team1.length > 4) {
      throw new Error('Team 1 must have between 1 and 4 pets');
    }
    if (this.team2.length < 1 || this.team2.length > 4) {
      throw new Error('Team 2 must have between 1 and 4 pets');
    }
    if (this.currentTurn < 1) throw new Error('Current turn must be at least 1');
    if (this.currentActorIndex < 0) {
      throw new Error('Current actor index cannot be negative');
    }
    // Turn order should match total number of pets (team1 + team2)
    const expectedTurnOrderLength = this.team1.length + this.team2.length;
    if (this.turnOrder.length !== expectedTurnOrderLength) {
      throw new Error(`Turn order must contain ${expectedTurnOrderLength} pet IDs (${this.team1.length} + ${this.team2.length})`);
    }
    if (this.isComplete && !this.winner) {
      throw new Error('Completed battle must have a winner');
    }
    if (!this.isComplete && this.winner !== null) {
      throw new Error('Incomplete battle cannot have a winner');
    }
  }

  /**
   * Get current actor (pet whose turn it is)
   */
  getCurrentActor(): CombatPet | null {
    if (this.isComplete) return null;
    const actorId = this.turnOrder[this.currentActorIndex];
    const allPets = [...this.team1, ...this.team2];
    return allPets.find((p) => p.pet.id === actorId) || null;
  }

  /**
   * Get all alive pets for a team
   */
  getAlivePets(team: 'team1' | 'team2'): readonly CombatPet[] {
    const teamPets = team === 'team1' ? this.team1 : this.team2;
    return teamPets.filter((p) => p.currentHp > 0);
  }

  /**
   * Check if a team has any alive pets
   */
  hasAlivePets(team: 'team1' | 'team2'): boolean {
    return this.getAlivePets(team).length > 0;
  }

  /**
   * Check if battle should be complete (one team eliminated or turn limit reached)
   */
  shouldBeComplete(): boolean {
    if (!this.hasAlivePets('team1')) return true;
    if (!this.hasAlivePets('team2')) return true;
    if (this.currentTurn >= 50) return true; // Turn limit
    return false;
  }
}















