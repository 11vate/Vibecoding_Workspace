/**
 * Combat Store (Zustand)
 * Manages battle state with repository integration
 */

import { create } from 'zustand';
import type { Battle } from '@/domain/entities/Battle';
import type { BattleId } from '@/shared/types/brands';
import type { IBattleRepository } from '@/domain/repositories/IBattleRepository';
import { BattleRepository } from '@/infrastructure/persistence/repositories/BattleRepository';
import type { DungeonRun } from '@/application/dungeon/StartDungeonRun';

interface CombatStore {
  currentBattle: Battle | null;
  battleHistory: Battle[];
  isLoading: boolean;
  error: string | null;
  dungeonRun: DungeonRun | null; // Current dungeon run state

  // Repository instance
  repository: IBattleRepository;

  // Synchronous actions
  setCurrentBattle: (battle: Battle | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearBattle: () => void;
  setDungeonRun: (run: DungeonRun | null) => void;
  clearDungeonRun: () => void;

  // Async repository actions
  saveBattle: (battle: Battle) => Promise<void>;
  loadBattleHistory: (limit?: number) => Promise<void>;
  loadBattle: (battleId: BattleId) => Promise<Battle | null>;
}

export const useCombatStore = create<CombatStore>((set, get) => ({
  currentBattle: null,
  battleHistory: [],
  isLoading: false,
  error: null,
  dungeonRun: null,
  repository: new BattleRepository(),

  setCurrentBattle: (battle) => set({ currentBattle: battle }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearBattle: () => set({ currentBattle: null }),
  setDungeonRun: (run) => set({ dungeonRun: run }),
  clearDungeonRun: () => set({ dungeonRun: null }),

  saveBattle: async (battle: Battle) => {
    const { repository, setLoading, setError, setCurrentBattle, battleHistory } = get();
    setLoading(true);
    setError(null);
    try {
      await repository.save(battle);
      setCurrentBattle(battle);
      // Add to history if complete
      if (battle.isComplete) {
        set({ battleHistory: [battle, ...battleHistory] });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save battle';
      setError(errorMessage);
      console.error('Error saving battle:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  loadBattleHistory: async (limit: number = 50) => {
    const { repository, setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const battles = await repository.findAll();
      // Sort by creation date, newest first, and limit
      const sorted = battles
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
      set({ battleHistory: sorted });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load battle history';
      setError(errorMessage);
      console.error('Error loading battle history:', error);
    } finally {
      setLoading(false);
    }
  },

  loadBattle: async (battleId: BattleId) => {
    const { repository, setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const battle = await repository.findById(battleId);
      if (battle) {
        set({ currentBattle: battle });
      }
      return battle;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load battle';
      setError(errorMessage);
      console.error('Error loading battle:', error);
      return null;
    } finally {
      setLoading(false);
    }
  },
}));
