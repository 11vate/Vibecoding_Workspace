import type { ThemeLogic, GameState } from '../types';

export const THEME_REGISTRY: Record<string, ThemeLogic> = {
  'NORMAL': {
    id: 'NORMAL',
    name: 'The Calm',
    description: 'A quiet world waiting to be shaped.',
    colors: {
      primary: '#64748b', // Slate-500
      secondary: '#94a3b8', // Slate-400
      bg: '#0f172a', // Slate-900
    },
    onTurnStart: (state) => ({}),
  },
  'WATER': {
    id: 'WATER',
    name: 'The Rising Tide',
    description: 'The ocean swells, flooding low ground.',
    colors: {
      primary: '#0284c7', // Sky-600
      secondary: '#38bdf8', // Sky-400
      bg: '#0c4a6e', // Sky-900
    },
    onTurnStart: (state) => {
      // Logic: Flood 1 random tile per turn
      return {};
    },
  },
  'FIRE': {
    id: 'FIRE',
    name: 'The Cinder Plains',
    description: 'Ash falls from a burning sky.',
    colors: {
      primary: '#ea580c', // Orange-600
      secondary: '#fb923c', // Orange-400
      bg: '#431407', // Orange-900
    },
    onTurnStart: (state) => ({}),
  },
};
