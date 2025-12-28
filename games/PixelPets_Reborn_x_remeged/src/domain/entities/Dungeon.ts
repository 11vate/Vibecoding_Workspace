/**
 * Dungeon Entity
 * Represents a dungeon floor and its structure
 */

import type { DungeonId } from '@/shared/types/brands';
import type { Rarity } from '@/shared/types/rarity';
import type { BasePet } from './BasePet';

export interface MinionWave {
  pets: readonly BasePet[];
  difficulty: number;
}

export interface BossEncounter {
  pet: BasePet;
  specialAbilities: readonly string[];
  difficultyMultiplier: number;
}

export interface DungeonRewards {
  essence: Record<Rarity, number>;
  stones?: readonly StoneReward[];
}

export interface StoneReward {
  type: string;
  tier: number;
  chance: number;
}

export class Dungeon {
  constructor(
    public readonly id: DungeonId,
    public readonly floorNumber: number,
    public readonly tier: number,
    public readonly name: string,
    public readonly description: string,
    public readonly minionWaves: readonly MinionWave[],
    public readonly boss: BossEncounter,
    public readonly rewards: DungeonRewards
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Dungeon must have an ID');
    if (this.floorNumber < 1 || this.floorNumber > 50) {
      throw new Error('Floor number must be between 1 and 50');
    }
    if (this.tier < 1 || this.tier > 5) {
      throw new Error('Tier must be between 1 and 5');
    }
    if (!this.name) throw new Error('Dungeon must have a name');
    if (this.minionWaves.length === 0) {
      throw new Error('Dungeon must have at least one minion wave');
    }
    if (!this.boss) throw new Error('Dungeon must have a boss');
    if (!this.rewards) throw new Error('Dungeon must have rewards');
  }

  /**
   * Check if this is a boss floor (floor 10 of each tier)
   */
  isBossFloor(): boolean {
    return this.floorNumber % 10 === 0;
  }

  /**
   * Get total number of waves (minion waves + boss)
   */
  getTotalWaves(): number {
    return this.minionWaves.length + 1; // +1 for boss
  }

  /**
   * Get essence reward for this dungeon
   */
  getEssenceReward(): Record<Rarity, number> {
    return this.rewards.essence;
  }
}

