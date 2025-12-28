/**
 * Pet Family system - 10 distinct families
 */

export enum PetFamily {
  PYRO_KIN = 'PYRO_KIN',
  AQUA_BORN = 'AQUA_BORN',
  TERRA_FORGED = 'TERRA_FORGED',
  VOLT_STREAM = 'VOLT_STREAM',
  SHADOW_VEIL = 'SHADOW_VEIL',
  LUMINA = 'LUMINA',
  STEEL_WORKS = 'STEEL_WORKS',
  ARCANE_RIFT = 'ARCANE_RIFT',
  AERO_FLIGHT = 'AERO_FLIGHT',
  WEIRDOS = 'WEIRDOS',
}

export interface FamilyConfig {
  id: PetFamily;
  name: string;
  description: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
    light: string;
  };
  themes: string[];
}

export const FAMILY_CONFIGS: Record<PetFamily, FamilyConfig> = {
  [PetFamily.PYRO_KIN]: {
    id: PetFamily.PYRO_KIN,
    name: 'Pyro-Kin',
    description: 'Fire-based creatures born from flames and embers',
    colorPalette: {
      primary: '#FF4400',
      secondary: '#FF8800',
      accent: '#FFCC00',
      dark: '#CC2200',
      light: '#FFAA44',
    },
    themes: ['Fire', 'Lava', 'Embers', 'Magma', 'Phoenix', 'Dragons'],
  },
  [PetFamily.AQUA_BORN]: {
    id: PetFamily.AQUA_BORN,
    name: 'Aqua-Born',
    description: 'Water spirits and aquatic beings',
    colorPalette: {
      primary: '#0088FF',
      secondary: '#00CCFF',
      accent: '#00FFFF',
      dark: '#0066CC',
      light: '#44AAFF',
    },
    themes: ['Water', 'Ice', 'Tides', 'Storms', 'Leviathans', 'Serpents'],
  },
  [PetFamily.TERRA_FORGED]: {
    id: PetFamily.TERRA_FORGED,
    name: 'Terra-Forged',
    description: 'Earth and stone guardians',
    colorPalette: {
      primary: '#8B6F47',
      secondary: '#90EE90',
      accent: '#D2B48C',
      dark: '#5C4A30',
      light: '#A9A9A9',
    },
    themes: ['Earth', 'Stone', 'Crystals', 'Mountains', 'Golems', 'Titans'],
  },
  [PetFamily.VOLT_STREAM]: {
    id: PetFamily.VOLT_STREAM,
    name: 'Volt-Stream',
    description: 'Lightning and electric energy',
    colorPalette: {
      primary: '#FFD700',
      secondary: '#00BFFF',
      accent: '#FF1493',
      dark: '#CC9900',
      light: '#FFFF44',
    },
    themes: ['Lightning', 'Electricity', 'Storms', 'Sparks', 'Thunder'],
  },
  [PetFamily.SHADOW_VEIL]: {
    id: PetFamily.SHADOW_VEIL,
    name: 'Shadow-Veil',
    description: 'Darkness and void creatures',
    colorPalette: {
      primary: '#6600AA',
      secondary: '#1a1a2e',
      accent: '#4B0082',
      dark: '#330055',
      light: '#8844CC',
    },
    themes: ['Shadow', 'Void', 'Night', 'Phantoms', 'Reapers'],
  },
  [PetFamily.LUMINA]: {
    id: PetFamily.LUMINA,
    name: 'Lumina',
    description: 'Light and divine beings',
    colorPalette: {
      primary: '#FFFFFF',
      secondary: '#FFD700',
      accent: '#FFFACD',
      dark: '#CCCCCC',
      light: '#FFFFE0',
    },
    themes: ['Light', 'Holy', 'Divine', 'Angels', 'Celestial'],
  },
  [PetFamily.STEEL_WORKS]: {
    id: PetFamily.STEEL_WORKS,
    name: 'Steel-Works',
    description: 'Metal and mechanical constructs',
    colorPalette: {
      primary: '#C0C0C0',
      secondary: '#708090',
      accent: '#4682B4',
      dark: '#808080',
      light: '#E0E0E0',
    },
    themes: ['Metal', 'Steel', 'Machines', 'Constructs', 'Golems'],
  },
  [PetFamily.ARCANE_RIFT]: {
    id: PetFamily.ARCANE_RIFT,
    name: 'Arcane-Rift',
    description: 'Magic and mystical forces',
    colorPalette: {
      primary: '#AA00FF',
      secondary: '#FF00FF',
      accent: '#FF69B4',
      dark: '#7700BB',
      light: '#CC44FF',
    },
    themes: ['Magic', 'Arcane', 'Runes', 'Spells', 'Mystical'],
  },
  [PetFamily.AERO_FLIGHT]: {
    id: PetFamily.AERO_FLIGHT,
    name: 'Aero-Flight',
    description: 'Air and sky creatures',
    colorPalette: {
      primary: '#87CEEB',
      secondary: '#B0E0E6',
      accent: '#E0F6FF',
      dark: '#5F9EA0',
      light: '#C0EFFF',
    },
    themes: ['Air', 'Wind', 'Sky', 'Clouds', 'Wings', 'Flight'],
  },
  [PetFamily.WEIRDOS]: {
    id: PetFamily.WEIRDOS,
    name: 'Weirdos',
    description: 'Chaos and unpredictable creatures',
    colorPalette: {
      primary: '#FF00FF',
      secondary: '#00FF00',
      accent: '#FF1493',
      dark: '#AA00AA',
      light: '#FF44FF',
    },
    themes: ['Chaos', 'Mutant', 'Unpredictable', 'Bizarre', 'Experimental'],
  },
};

export function getFamilyConfig(family: PetFamily): FamilyConfig {
  return FAMILY_CONFIGS[family];
}





















