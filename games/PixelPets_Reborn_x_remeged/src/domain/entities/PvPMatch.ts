/**
 * PvP Match Entity
 * Represents an async player-vs-player battle
 */

import type { PetId, PvPMatchId } from '@/shared/types/brands';
import type { Battle } from './Battle';

export type MatchStatus = 'pending' | 'in_progress' | 'completed' | 'expired' | 'cancelled';

export interface PvPRewards {
  winner: {
    dataKeys: number;
    trophies: number;
    contraband?: number; // Bonus contraband for wins
  };
  loser: {
    dataKeys: number; // Consolation prize
    trophies: number; // ELO loss
    contraband: number; // Consolation contraband bytes
  };
}

/**
 * PvP Match Entity
 */
export class PvPMatch {
  constructor(
    public readonly id: PvPMatchId,
    public readonly player1Id: string,
    public readonly player2Id: string,
    public readonly player1Team: readonly PetId[], // 4 pets max
    public readonly player2Team: readonly PetId[], // 4 pets max
    public readonly battleState: Battle | null, // Null until battle starts
    public readonly isAsynchronous: boolean, // True for async, false for real-time
    public readonly createdAt: number,
    public readonly expiresAt: number, // 24h for async
    public readonly status: MatchStatus,
    public readonly winnerId: string | null,
    public readonly rewards: PvPRewards | null
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('PvPMatch must have an ID');
    if (!this.player1Id) throw new Error('PvPMatch must have player1Id');
    if (!this.player2Id) throw new Error('PvPMatch must have player2Id');
    if (this.player1Id === this.player2Id) {
      throw new Error('Cannot match a player against themselves');
    }
    if (this.player1Team.length === 0 || this.player1Team.length > 4) {
      throw new Error('Player 1 team must have 1-4 pets');
    }
    if (this.player2Team.length === 0 || this.player2Team.length > 4) {
      throw new Error('Player 2 team must have 1-4 pets');
    }
    if (this.expiresAt <= this.createdAt) {
      throw new Error('Expiration time must be after creation time');
    }
  }

  /**
   * Check if match has expired
   */
  isExpired(): boolean {
    return Date.now() > this.expiresAt;
  }

  /**
   * Check if match is pending (waiting for opponent to respond)
   */
  isPending(): boolean {
    return this.status === 'pending';
  }

  /**
   * Check if match is in progress
   */
  isInProgress(): boolean {
    return this.status === 'in_progress';
  }

  /**
   * Check if match is completed
   */
  isCompleted(): boolean {
    return this.status === 'completed';
  }

  /**
   * Get winner's team
   */
  getWinnerTeam(): readonly PetId[] | null {
    if (!this.winnerId) return null;
    return this.winnerId === this.player1Id ? this.player1Team : this.player2Team;
  }

  /**
   * Get loser's team
   */
  getLoserTeam(): readonly PetId[] | null {
    if (!this.winnerId) return null;
    return this.winnerId === this.player1Id ? this.player2Team : this.player1Team;
  }

  /**
   * Get opponent's ID for a given player
   */
  getOpponentId(playerId: string): string | null {
    if (playerId === this.player1Id) return this.player2Id;
    if (playerId === this.player2Id) return this.player1Id;
    return null;
  }

  /**
   * Check if player is participant in this match
   */
  isParticipant(playerId: string): boolean {
    return playerId === this.player1Id || playerId === this.player2Id;
  }
}
