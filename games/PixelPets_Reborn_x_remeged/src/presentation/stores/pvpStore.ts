/**
 * PvP Store
 * Manages PvP state (matches, rankings, leaderboard)
 */

import { create } from 'zustand';
import type { PvPMatch } from '@/domain/entities/PvPMatch';
import type { PvPRanking } from '@/domain/entities/PvPRanking';
import type { PetId } from '@/shared/types/brands';
import { PvPMatchRepository } from '@/infrastructure/persistence/PvPMatchRepository';
import { PvPRankingRepository } from '@/infrastructure/persistence/PvPRankingRepository';
import { MatchmakingService } from '@/application/pvp/MatchmakingService';
import { CompletePvPMatch, type CompletePvPMatchOutput } from '@/application/pvp/CompletePvPMatch';

interface PvPState {
  // State
  currentMatch: PvPMatch | null;
  playerRanking: PvPRanking | null;
  leaderboard: PvPRanking[];
  matchHistory: PvPMatch[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadPlayerRanking: (playerId: string) => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  loadMatchHistory: (playerId: string) => Promise<void>;
  findMatch: (playerId: string, team: PetId[]) => Promise<void>;
  completeMatch: (matchId: string, winnerId: string) => Promise<CompletePvPMatchOutput | undefined>;
  clearError: () => void;
}

// Repositories and services
const pvpMatchRepository = new PvPMatchRepository();
const pvpRankingRepository = new PvPRankingRepository();
const matchmakingService = new MatchmakingService(pvpRankingRepository, pvpMatchRepository);
const completePvPMatchUseCase = new CompletePvPMatch(pvpMatchRepository, pvpRankingRepository);

export const usePvPStore = create<PvPState>((set, get) => ({
  // Initial state
  currentMatch: null,
  playerRanking: null,
  leaderboard: [],
  matchHistory: [],
  isLoading: false,
  error: null,

  /**
   * Load player's PvP ranking
   */
  loadPlayerRanking: async (playerId: string) => {
    set({ isLoading: true, error: null });
    try {
      let ranking = await pvpRankingRepository.findByPlayerId(playerId);

      // Initialize if player is new to PvP
      if (!ranking) {
        ranking = await pvpRankingRepository.initializePlayerRanking(playerId);
      }

      set({ playerRanking: ranking, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load ranking',
        isLoading: false
      });
    }
  },

  /**
   * Load global leaderboard
   */
  loadLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const leaderboard = await pvpRankingRepository.getLeaderboard(100);
      set({ leaderboard, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load leaderboard',
        isLoading: false
      });
    }
  },

  /**
   * Load player's match history
   */
  loadMatchHistory: async (playerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const allMatches = await pvpMatchRepository.findByPlayer(playerId);

      // Filter completed matches, sort by date descending
      const history = allMatches
        .filter(m => m.status === 'completed')
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 20); // Last 20 matches

      set({ matchHistory: history, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load match history',
        isLoading: false
      });
    }
  },

  /**
   * Find PvP match
   */
  findMatch: async (playerId: string, team: PetId[]) => {
    set({ isLoading: true, error: null });
    try {
      // Validate team
      if (team.length === 0 || team.length > 4) {
        throw new Error('Team must have 1-4 pets');
      }

      // Check for active match
      const activeMatch = await pvpMatchRepository.findActiveMatchForPlayer(playerId);
      if (activeMatch) {
        set({
          currentMatch: activeMatch,
          isLoading: false,
          error: 'You already have an active match'
        });
        return;
      }

      // Find opponent
      const matchResult = await matchmakingService.findOpponent(playerId);

      // Create match
      const match = await matchmakingService.createAsyncMatch(
        playerId,
        matchResult.opponentId,
        team
      );

      set({ currentMatch: match, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to find match',
        isLoading: false
      });
    }
  },

  /**
   * Complete PvP match
   */
  completeMatch: async (matchId: string, winnerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await completePvPMatchUseCase.execute({
        matchId: matchId as any,
        winnerId
      });

      // Reload player ranking to show updated trophies
      const state = get();
      if (state.playerRanking) {
        await get().loadPlayerRanking(state.playerRanking.playerId);
      }

      // Clear current match
      set({ currentMatch: null, isLoading: false });

      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to complete match',
        isLoading: false
      });
    }
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  }
}));
