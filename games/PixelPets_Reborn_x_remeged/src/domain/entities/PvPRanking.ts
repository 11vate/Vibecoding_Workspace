/**
 * PvP Ranking Entity
 * Tracks player PvP performance and ELO rating
 */

import type { PetFamily } from '@/shared/types/family';

/**
 * PvP Divisions based on trophy count
 */
export enum Division {
  BRONZE = 'BRONZE',     // 0-999 trophies
  SILVER = 'SILVER',     // 1000-1999
  GOLD = 'GOLD',         // 2000-2999
  PLATINUM = 'PLATINUM', // 3000-3999
  DIAMOND = 'DIAMOND'    // 4000+
}

/**
 * Division metadata
 */
export const DIVISION_INFO: Record<Division, { min: number; max: number; color: string; icon: string }> = {
  [Division.BRONZE]: { min: 0, max: 999, color: '#CD7F32', icon: '🥉' },
  [Division.SILVER]: { min: 1000, max: 1999, color: '#C0C0C0', icon: '🥈' },
  [Division.GOLD]: { min: 2000, max: 2999, color: '#FFD700', icon: '🥇' },
  [Division.PLATINUM]: { min: 3000, max: 3999, color: '#E5E4E2', icon: '💎' },
  [Division.DIAMOND]: { min: 4000, max: Infinity, color: '#B9F2FF', icon: '👑' }
};

/**
 * PvP Ranking Entity
 */
export class PvPRanking {
  constructor(
    public readonly playerId: string,
    public readonly trophies: number,
    public readonly division: Division,
    public readonly wins: number,
    public readonly losses: number,
    public readonly draws: number,
    public readonly winStreak: number,
    public readonly bestWinStreak: number,
    public readonly lastMatchAt: number,
    public readonly favoredFamily: PetFamily | null // Most used family, gets bonuses
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.playerId) throw new Error('PvPRanking must have a playerId');
    if (this.trophies < 0) throw new Error('Trophies cannot be negative');
    if (this.wins < 0) throw new Error('Wins cannot be negative');
    if (this.losses < 0) throw new Error('Losses cannot be negative');
    if (this.draws < 0) throw new Error('Draws cannot be negative');
    if (this.winStreak < 0) throw new Error('Win streak cannot be negative');
    if (this.bestWinStreak < this.winStreak) {
      throw new Error('Best win streak cannot be less than current streak');
    }
  }

  /**
   * Calculate ELO change based on opponent rating and match result
   * Uses standard ELO formula with K-factor adjustment
   */
  calculateEloChange(opponentRating: number, won: boolean): number {
    // K-factor: higher for new players, lower for veterans
    const totalMatches = this.wins + this.losses + this.draws;
    let K = 32; // Default K-factor

    if (totalMatches < 10) {
      K = 40; // New players have higher volatility
    } else if (totalMatches > 100) {
      K = 24; // Veterans have lower volatility
    }

    // Expected score (probability of winning)
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - this.trophies) / 400));

    // Actual score
    const actualScore = won ? 1 : 0;

    // ELO change
    return Math.round(K * (actualScore - expectedScore));
  }

  /**
   * Get division based on trophy count
   */
  static getDivisionFromTrophies(trophies: number): Division {
    if (trophies >= 4000) return Division.DIAMOND;
    if (trophies >= 3000) return Division.PLATINUM;
    if (trophies >= 2000) return Division.GOLD;
    if (trophies >= 1000) return Division.SILVER;
    return Division.BRONZE;
  }

  /**
   * Calculate win rate
   */
  getWinRate(): number {
    const totalMatches = this.wins + this.losses + this.draws;
    if (totalMatches === 0) return 0;
    return this.wins / totalMatches;
  }

  /**
   * Get total matches played
   */
  getTotalMatches(): number {
    return this.wins + this.losses + this.draws;
  }

  /**
   * Check if player is on a win streak
   */
  isOnWinStreak(): boolean {
    return this.winStreak > 0;
  }

  /**
   * Get next division threshold
   */
  getTrophiesUntilNextDivision(): number | null {
    const divInfo = DIVISION_INFO[this.division];
    if (divInfo.max === Infinity) return null; // Already at max division
    return divInfo.max + 1 - this.trophies;
  }

  /**
   * Check if player is inactive (no matches in 7 days)
   */
  isInactive(): boolean {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return this.lastMatchAt < sevenDaysAgo;
  }
}
