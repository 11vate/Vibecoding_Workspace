/**
 * Player Entity
 * Represents the player's account and progression data
 */

import type { Rarity } from '@/shared/types/rarity';

export interface Team {
  id: string;
  name: string;
  petIds: string[];
  formation: ('front' | 'back')[];
}

/**
 * Player Entity
 */
export class Player {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly essence: Record<Rarity, number>,
    public readonly dataKeys: number,
    public readonly corruptedBytes: number,
    public readonly pityCounter: number,
    public readonly rank: number,
    public readonly teams: readonly Team[],
    public readonly completedDungeons: readonly string[],
    public readonly lastUpdated: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Player must have an ID');
    if (!this.username || this.username.trim().length === 0) {
      throw new Error('Player must have a username');
    }
    if (this.rank < 0) throw new Error('Player rank cannot be negative');
    if (this.lastUpdated < 0) throw new Error('Last updated timestamp cannot be negative');
  }

  /**
   * Get total essence count across all rarities
   */
  getTotalEssence(): number {
    return Object.values(this.essence).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Get essence count for a specific rarity
   */
  getEssence(rarity: Rarity): number {
    return this.essence[rarity] || 0;
  }

  /**
   * Check if player has enough essence for a summon
   */
  hasEnoughEssence(rarity: Rarity, cost: number): boolean {
    return this.getEssence(rarity) >= cost;
  }

  /**
   * Check if player has enough data keys
   */
  hasEnoughKeys(amount: number): boolean {
    return this.dataKeys >= amount;
  }

  /**
   * Check if player has enough corrupted bytes
   */
  hasEnoughBytes(amount: number): boolean {
    return this.corruptedBytes >= amount;
  }

  /**
   * Get team by ID
   */
  getTeam(teamId: string): Team | null {
    return this.teams.find((t) => t.id === teamId) || null;
  }

  /**
   * Check if dungeon is completed
   */
  hasCompletedDungeon(dungeonId: string): boolean {
    return this.completedDungeons.includes(dungeonId);
  }

  /**
   * Create updated player with new essence amounts
   */
  withEssence(essence: Record<Rarity, number>): Player {
    return new Player(
      this.id,
      this.username,
      essence,
      this.dataKeys,
      this.corruptedBytes,
      this.pityCounter,
      this.rank,
      this.teams,
      this.completedDungeons,
      Date.now()
    );
  }

  /**
   * Create updated player with new currency balances
   */
  withCurrencies(dataKeys: number, corruptedBytes: number): Player {
    return new Player(
      this.id,
      this.username,
      this.essence,
      dataKeys,
      corruptedBytes,
      this.pityCounter,
      this.rank,
      this.teams,
      this.completedDungeons,
      Date.now()
    );
  }

  /**
   * Create updated player with new pity counter
   */
  withPityCounter(counter: number): Player {
    return new Player(
      this.id,
      this.username,
      this.essence,
      this.dataKeys,
      this.corruptedBytes,
      counter,
      this.rank,
      this.teams,
      this.completedDungeons,
      Date.now()
    );
  }

  /**
   * Create updated player with new rank
   */
  withRank(rank: number): Player {
    return new Player(
      this.id,
      this.username,
      this.essence,
      this.dataKeys,
      this.corruptedBytes,
      this.pityCounter,
      rank,
      this.teams,
      this.completedDungeons,
      Date.now()
    );
  }

  /**
   * Create updated player with new teams
   */
  withTeams(teams: readonly Team[]): Player {
    return new Player(
      this.id,
      this.username,
      this.essence,
      this.dataKeys,
      this.corruptedBytes,
      this.pityCounter,
      this.rank,
      teams,
      this.completedDungeons,
      Date.now()
    );
  }

  /**
   * Create updated player with completed dungeon added
   */
  withCompletedDungeon(dungeonId: string): Player {
    if (this.hasCompletedDungeon(dungeonId)) {
      return this; // Already completed
    }
    return new Player(
      this.id,
      this.username,
      this.essence,
      this.dataKeys,
      this.corruptedBytes,
      this.pityCounter,
      this.rank,
      this.teams,
      [...this.completedDungeons, dungeonId],
      Date.now()
    );
  }
}
















