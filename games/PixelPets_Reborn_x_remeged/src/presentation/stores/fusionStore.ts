/**
 * Fusion Store (Zustand)
 * Manages fusion state and selections
 */

import { create } from 'zustand';
import type { Pet } from '@/domain/entities/Pet';
import type { Stone } from '@/domain/entities/Stone';

interface FusionStore {
  selectedParent1: Pet | null;
  selectedParent2: Pet | null;
  selectedStone1: Stone | null;
  selectedStone2: Stone | null;
  fusionIntent: string;
  isFusing: boolean;
  error: string | null;

  // Actions
  selectParent1: (pet: Pet | null) => void;
  selectParent2: (pet: Pet | null) => void;
  selectStone1: (stone: Stone | null) => void;
  selectStone2: (stone: Stone | null) => void;
  setFusionIntent: (intent: string) => void;
  setFusing: (fusing: boolean) => void;
  setError: (error: string | null) => void;
  clearSelection: () => void;
}

export const useFusionStore = create<FusionStore>((set) => ({
  selectedParent1: null,
  selectedParent2: null,
  selectedStone1: null,
  selectedStone2: null,
  fusionIntent: '',
  isFusing: false,
  error: null,

  selectParent1: (pet) => set({ selectedParent1: pet }),
  selectParent2: (pet) => set({ selectedParent2: pet }),
  selectStone1: (stone) => set({ selectedStone1: stone }),
  selectStone2: (stone) => set({ selectedStone2: stone }),
  setFusionIntent: (intent) => set({ fusionIntent: intent }),
  setFusing: (fusing) => set({ isFusing: fusing }),
  setError: (error) => set({ error }),
  clearSelection: () => set({
    selectedParent1: null,
    selectedParent2: null,
    selectedStone1: null,
    selectedStone2: null,
    fusionIntent: '',
    error: null,
  }),
}));


















