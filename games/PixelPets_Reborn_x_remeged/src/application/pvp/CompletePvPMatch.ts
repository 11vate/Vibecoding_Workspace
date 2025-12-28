/**
 * Complete PvP Match Use Case
 * Finalizes match, updates rankings, and distributes rewards
 */

import type { IPvPMatchRepository } from '@/infrastructure/persistence/PvPMatchRepository';
import type { IPvPRankingRepository } from '@/infrastructure/persistence/PvPRankingRepository';
import type { PvPMatchId } from '@/shared/types/brands';
import { PvPRanking, Division } from '@/domain/entities/PvPRanking';
import type { PvPRewards } from '@/domain/entities/PvPMatch';

export interface CompletePvPMatchInput {
  matchId: PvPMatchId;
  winnerId: string; // Player ID of winner
}

export interface CompletePvPMatchOutput {
  player1TrophyChange: number;
  player2TrophyChange: number;
  player1NewDivision: Division;
  player2NewDivision: Division;
  rewards: PvPRewards;
}

/**
 * Complete PvP Match Use Case
 */
export class CompletePvPMatch {
  constructor(
    private pvpMatchRepository: IPvPMatchRepository,
    private pvpRankingRepository: IPvPRankingRepository
  ) {}

  async execute(input: CompletePvPMatchInput): Promise<CompletePvPMatchOutput> {
    // Get match
    const match = await this.pvpMatchRepository.findById(input.matchId);
    if (!match) {
      throw new Error(`Match not found: ${input.matchId}`);
    }

    // Validate match state
    if (match.status === 'completed') {
      throw new Error('Match already completed');
    }

    if (match.status === 'expired') {
      throw new Error('Match has expired');
    }

    if (!match.isParticipant(input.winnerId)) {
      throw new Error('Winner must be a participant in the match');
    }

    // Get rankings
    let player1Ranking = await this.pvpRankingRepository.findByPlayerId(match.player1Id);
    let player2Ranking = await this.pvpRankingRepository.findByPlayerId(match.player2Id);

    // Initialize rankings if needed
    if (!player1Ranking) {
      player1Ranking = await this.pvpRankingRepository.initializePlayerRanking(match.player1Id);
    }
    if (!player2Ranking) {
      player2Ranking = await this.pvpRankingRepository.initializePlayerRanking(match.player2Id);
    }

    // Determine winner/loser
    const player1Won = input.winnerId === match.player1Id;
    // const loserId = player1Won ? match.player2Id : match.player1Id;

    // Calculate ELO changes
    const player1EloChange = player1Ranking.calculateEloChange(
      player2Ranking.trophies,
      player1Won
    );
    const player2EloChange = player2Ranking.calculateEloChange(
      player1Ranking.trophies,
      !player1Won
    );

    // Update rankings
    const player1NewTrophies = Math.max(0, player1Ranking.trophies + player1EloChange);
    const player2NewTrophies = Math.max(0, player2Ranking.trophies + player2EloChange);

    const player1NewDivision = PvPRanking.getDivisionFromTrophies(player1NewTrophies);
    const player2NewDivision = PvPRanking.getDivisionFromTrophies(player2NewTrophies);

    // Update win/loss records and streaks
    const updatedPlayer1 = this.updateRankingStats(
      player1Ranking,
      player1Won,
      player1NewTrophies,
      player1NewDivision
    );

    const updatedPlayer2 = this.updateRankingStats(
      player2Ranking,
      !player1Won,
      player2NewTrophies,
      player2NewDivision
    );

    // Calculate rewards
    const rewards = this.calculateRewards(
      player1Won ? player1Ranking : player2Ranking,
      player1Won ? player2Ranking : player1Ranking,
      Math.abs(player1Won ? player1EloChange : player2EloChange)
    );

    // Save updated rankings
    await this.pvpRankingRepository.save(updatedPlayer1);
    await this.pvpRankingRepository.save(updatedPlayer2);

    // Update match status
    const completedMatch = new (match.constructor as any)(
      match.id,
      match.player1Id,
      match.player2Id,
      match.player1Team,
      match.player2Team,
      match.battleState,
      match.isAsynchronous,
      match.createdAt,
      match.expiresAt,
      'completed',
      input.winnerId,
      rewards
    );

    await this.pvpMatchRepository.save(completedMatch);

    return {
      player1TrophyChange: player1EloChange,
      player2TrophyChange: player2EloChange,
      player1NewDivision,
      player2NewDivision,
      rewards
    };
  }

  /**
   * Update ranking stats after match
   */
  private updateRankingStats(
    ranking: PvPRanking,
    won: boolean,
    newTrophies: number,
    newDivision: Division
  ): PvPRanking {
    const newWins = won ? ranking.wins + 1 : ranking.wins;
    const newLosses = won ? ranking.losses : ranking.losses + 1;
    const newWinStreak = won ? ranking.winStreak + 1 : 0;
    const newBestStreak = Math.max(ranking.bestWinStreak, newWinStreak);

    return new PvPRanking(
      ranking.playerId,
      newTrophies,
      newDivision,
      newWins,
      newLosses,
      ranking.draws,
      newWinStreak,
      newBestStreak,
      Date.now(),
      ranking.favoredFamily
    );
  }

  /**
   * Calculate match rewards based on rankings and trophy change
   */
  private calculateRewards(
    winnerRanking: PvPRanking,
    loserRanking: PvPRanking,
    trophyGain: number
  ): PvPRewards {
    // Base rewards scale with division
    const winnerDivisionMultiplier = this.getDivisionMultiplier(winnerRanking.division);
    const loserDivisionMultiplier = this.getDivisionMultiplier(loserRanking.division);

    // Winner rewards
    const winnerDataKeys = Math.round(50 * winnerDivisionMultiplier + trophyGain * 2);
    const winnerContraband = Math.round(10 * winnerDivisionMultiplier + trophyGain * 0.5);

    // Loser consolation rewards
    const loserDataKeys = Math.round(10 * loserDivisionMultiplier);
    const loserContraband = Math.round(5 * loserDivisionMultiplier); // Consolation bytes

    return {
      winner: {
        dataKeys: winnerDataKeys,
        trophies: trophyGain,
        contraband: winnerContraband
      },
      loser: {
        dataKeys: loserDataKeys,
        trophies: -Math.abs(trophyGain), // Negative for loss
        contraband: loserContraband // Consolation prize
      }
    };
  }

  /**
   * Get reward multiplier for division
   */
  private getDivisionMultiplier(division: Division): number {
    switch (division) {
      case Division.BRONZE:
        return 1.0;
      case Division.SILVER:
        return 1.5;
      case Division.GOLD:
        return 2.0;
      case Division.PLATINUM:
        return 3.0;
      case Division.DIAMOND:
        return 5.0;
      default:
        return 1.0;
    }
  }
}
