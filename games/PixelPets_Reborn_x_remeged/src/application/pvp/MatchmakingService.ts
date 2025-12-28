/**
 * Matchmaking Service
 * Finds suitable PvP opponents based on ELO rating
 */

import type { IPvPRankingRepository } from '@/infrastructure/persistence/PvPRankingRepository';
import type { IPvPMatchRepository } from '@/infrastructure/persistence/PvPMatchRepository';
import { PvPMatch } from '@/domain/entities/PvPMatch';
import { PvPRanking } from '@/domain/entities/PvPRanking';
import type { PetId } from '@/shared/types/brands';
import { generatePvPMatchId } from '@/shared/utils/idGenerator';

export interface MatchmakingResult {
  opponentId: string;
  opponentRanking: PvPRanking;
  estimatedWinChance: number; // 0-100%
}

/**
 * Matchmaking Service
 */
export class MatchmakingService {
  constructor(
    private pvpRankingRepository: IPvPRankingRepository,
    private pvpMatchRepository: IPvPMatchRepository
  ) {}

  /**
   * Find suitable opponent for player
   */
  async findOpponent(playerId: string): Promise<MatchmakingResult> {
    // Get player's ranking
    let playerRanking = await this.pvpRankingRepository.findByPlayerId(playerId);

    // Initialize ranking if player is new to PvP
    if (!playerRanking) {
      playerRanking = await this.pvpRankingRepository.initializePlayerRanking(playerId);
    }

    // Define matchmaking range (±200 trophies, expanding if no matches found)
    let searchRadius = 200;
    let maxSearchRadius = 1000;
    let candidates: PvPRanking[] = [];

    while (candidates.length === 0 && searchRadius <= maxSearchRadius) {
      const minTrophies = Math.max(0, playerRanking.trophies - searchRadius);
      const maxTrophies = playerRanking.trophies + searchRadius;

      candidates = await this.pvpRankingRepository.findInTrophyRange(
        minTrophies,
        maxTrophies
      );

      // Filter out the player themselves and players with active matches
      candidates = await this.filterValidOpponents(candidates, playerId);

      if (candidates.length === 0) {
        searchRadius += 200; // Expand search
      }
    }

    // If still no candidates, matchmake against random opponent from entire pool
    if (candidates.length === 0) {
      const allRankings = await this.pvpRankingRepository.getAll();
      candidates = allRankings.filter(r => r.playerId !== playerId);

      if (candidates.length === 0) {
        throw new Error('No opponents available for matchmaking');
      }
    }

    // Select opponent (weighted by proximity to player's rating)
    const opponent = this.selectOpponent(candidates, playerRanking.trophies);

    // Calculate estimated win chance based on ELO difference
    const estimatedWinChance = this.calculateWinChance(
      playerRanking.trophies,
      opponent.trophies
    );

    return {
      opponentId: opponent.playerId,
      opponentRanking: opponent,
      estimatedWinChance
    };
  }

  /**
   * Filter valid opponents (no active matches)
   */
  private async filterValidOpponents(
    candidates: PvPRanking[],
    excludePlayerId: string
  ): Promise<PvPRanking[]> {
    const valid: PvPRanking[] = [];

    for (const candidate of candidates) {
      // Skip if it's the player themselves
      if (candidate.playerId === excludePlayerId) continue;

      // Check if opponent has active match
      const activeMatch = await this.pvpMatchRepository.findActiveMatchForPlayer(
        candidate.playerId
      );

      if (!activeMatch) {
        valid.push(candidate);
      }
    }

    return valid;
  }

  /**
   * Select opponent from candidates (weighted by rating proximity)
   */
  private selectOpponent(candidates: PvPRanking[], playerTrophies: number): PvPRanking {
    if (candidates.length === 1) return candidates[0];

    // Calculate weights based on trophy difference (closer = higher weight)
    const weights = candidates.map(c => {
      const diff = Math.abs(c.trophies - playerTrophies);
      // Weight decreases with distance (inverse exponential)
      return Math.exp(-diff / 200);
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    // Weighted random selection
    let random = Math.random() * totalWeight;
    for (let i = 0; i < candidates.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return candidates[i];
      }
    }

    // Fallback (shouldn't reach here)
    return candidates[0];
  }

  /**
   * Calculate estimated win chance based on ELO formula
   */
  private calculateWinChance(playerRating: number, opponentRating: number): number {
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    return Math.round(expectedScore * 100);
  }

  /**
   * Create async match
   */
  async createAsyncMatch(
    playerId: string,
    opponentId: string,
    playerTeam: PetId[]
  ): Promise<PvPMatch> {
    // Validate team size
    if (playerTeam.length === 0 || playerTeam.length > 4) {
      throw new Error('Team must have 1-4 pets');
    }

    // Get opponent's best team (AI-selected for async)
    const opponentTeam = await this.selectOpponentTeam(opponentId);

    // Create match (expires in 24 hours)
    const now = Date.now();
    const expiresAt = now + (24 * 60 * 60 * 1000);

    const match = new PvPMatch(
      generatePvPMatchId(),
      playerId,
      opponentId,
      playerTeam,
      opponentTeam,
      null, // Battle state created when match starts
      true, // isAsynchronous
      now,
      expiresAt,
      'pending',
      null, // winnerId
      null  // rewards
    );

    await this.pvpMatchRepository.save(match);

    return match;
  }

  /**
   * Select opponent's team (AI-selected for async matches)
   * In real implementation, would select opponent's actual team
   */
  private async selectOpponentTeam(_opponentId: string): Promise<PetId[]> {
    // TODO: Implement actual team selection from opponent's collection
    // For now, return placeholder
    // In production: query opponent's pets, select best 4 by stats/rarity
    return [] as PetId[];
  }
}
