/**
 * Stone Store (Zustand)
 * Manages stone collection state with repository integration
 */

import { create } from 'zustand';
import type { Stone } from '@/domain/entities/Stone';
import type { StoneId } from '@/shared/types/brands';
import type { StoneType, StoneTier } from '@/domain/entities/Stone';
import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';
import { StoneRepository } from '@/infrastructure/persistence/repositories/StoneRepository';

interface StoneStore {
  stones: Stone[];
  selectedStone: Stone | null;
  isLoading: boolean;
  error: string | null;

  // Repository instance
  repository: IStoneRepository;

  // Synchronous actions
  setStones: (stones: Stone[]) => void;
  selectStone: (stone: Stone | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Queries (computed from state)
  getStonesByType: (type: StoneType) => Stone[];
  getStonesByTier: (tier: StoneTier) => Stone[];
  getGlitchedStones: () => Stone[];
  getNormalStones: () => Stone[];

  // Async repository actions
  loadStones: () => Promise<void>;
  loadStone: (stoneId: StoneId) => Promise<Stone | null>;
  saveStone: (stone: Stone) => Promise<void>;
  deleteStone: (stoneId: StoneId) => Promise<void>;
  updateStone: (stone: Stone) => Promise<void>;
}

export const useStoneStore = create<StoneStore>((set, get) => ({
  stones: [],
  selectedStone: null,
  isLoading: false,
  error: null,
  repository: new StoneRepository(),

  setStones: (stones) => set({ stones }),
  selectStone: (stone) => set({ selectedStone: stone }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getStonesByType: (type) => get().stones.filter((s) => s.type === type),
  getStonesByTier: (tier) => get().stones.filter((s) => s.tier === tier),
  getGlitchedStones: () => get().stones.filter((s) => s.isGlitched),
  getNormalStones: () => get().stones.filter((s) => !s.isGlitched),

  loadStones: async () => {
    const { repository, setLoading, setError, setStones } = get();
    setLoading(true);
    setError(null);
    try {
      const stones = await repository.findAll();
      setStones(stones);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load stones';
      setError(errorMessage);
      console.error('Error loading stones:', error);
    } finally {
      setLoading(false);
    }
  },

  loadStone: async (stoneId: StoneId) => {
    const { repository, setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const stone = await repository.findById(stoneId);
      if (stone) {
        const { stones, setStones } = get();
        const updatedStones = stones.some((s) => s.id === stoneId)
          ? stones.map((s) => (s.id === stoneId ? stone : s))
          : [...stones, stone];
        setStones(updatedStones);
      }
      return stone;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load stone';
      setError(errorMessage);
      console.error('Error loading stone:', error);
      return null;
    } finally {
      setLoading(false);
    }
  },

  saveStone: async (stone: Stone) => {
    const { repository, setLoading, setError, stones, setStones } = get();
    setLoading(true);
    setError(null);
    try {
      await repository.save(stone);
      const updatedStones = stones.some((s) => s.id === stone.id)
        ? stones.map((s) => (s.id === stone.id ? stone : s))
        : [...stones, stone];
      setStones(updatedStones);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save stone';
      setError(errorMessage);
      console.error('Error saving stone:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  deleteStone: async (stoneId: StoneId) => {
    const { repository, setLoading, setError, stones, setStones, selectedStone } = get();
    setLoading(true);
    setError(null);
    try {
      await repository.delete(stoneId);
      setStones(stones.filter((s) => s.id !== stoneId));
      if (selectedStone?.id === stoneId) {
        set({ selectedStone: null });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete stone';
      setError(errorMessage);
      console.error('Error deleting stone:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  updateStone: async (stone: Stone) => {
    const { saveStone } = get();
    return saveStone(stone);
  },
}));







