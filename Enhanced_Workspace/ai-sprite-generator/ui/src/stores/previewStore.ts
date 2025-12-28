import { create } from 'zustand';

export interface PreviewSprite {
  id: string;
  url: string;
  thumbnailUrl?: string;
  metadata?: any;
  frames?: number;
}

interface PreviewState {
  sprites: PreviewSprite[];
  selectedSprite: string | null;
  setSelectedSprite: (id: string | null) => void;
  addSprite: (sprite: PreviewSprite) => void;
  removeSprite: (id: string) => void;
  clearSprites: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  sprites: [],
  selectedSprite: null,
  setSelectedSprite: (id) => set({ selectedSprite: id }),
  addSprite: (sprite) => set((state) => ({
    sprites: [...state.sprites, sprite],
  })),
  removeSprite: (id) => set((state) => ({
    sprites: state.sprites.filter((s) => s.id !== id),
  })),
  clearSprites: () => set({ sprites: [], selectedSprite: null }),
}));







