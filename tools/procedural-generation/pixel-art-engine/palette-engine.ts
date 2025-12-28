/**
 * Palette Engine - Color palette management for pixel art
 *
 * Purpose: Generate and apply color palettes for consistent pixel art
 * Authority: Tier 2 (Mandatory for pixel art generation)
 */

export interface Palette {
  name: string;
  colors: string[];
  description?: string;
}

/**
 * Predefined color palettes for different styles
 */
export const PALETTES: Record<string, Palette> = {
  // Fantasy RPG palettes
  fantasy: {
    name: 'Fantasy',
    colors: ['#2d1b2e', '#5a3a5c', '#8b6d9c', '#c69fa5', '#ffffff'],
    description: 'Classic fantasy RPG colors'
  },

  dungeon: {
    name: 'Dungeon',
    colors: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560'],
    description: 'Dark dungeon atmosphere'
  },

  forest: {
    name: 'Forest',
    colors: ['#1b5e20', '#388e3c', '#66bb6a', '#a5d6a7', '#e8f5e9'],
    description: 'Forest and nature'
  },

  // Retro gaming palettes
  gameboy: {
    name: 'Game Boy',
    colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
    description: 'Classic Game Boy green'
  },

  nes: {
    name: 'NES',
    colors: ['#000000', '#fcfcfc', '#f8f8f8', '#bcbcbc', '#7c7c7c', '#a4e4fc', '#3cbcfc'],
    description: 'NES color palette'
  },

  // Modern styles
  cyberpunk: {
    name: 'Cyberpunk',
    colors: ['#0a0e27', '#663399', '#ff00ff', '#00ffff', '#ffffff'],
    description: 'Neon cyberpunk aesthetic'
  },

  pastel: {
    name: 'Pastel',
    colors: ['#ffd1dc', '#ffb3d9', '#c9a0dc', '#b39ddb', '#9fa8da'],
    description: 'Soft pastel colors'
  },

  // Monochrome
  grayscale: {
    name: 'Grayscale',
    colors: ['#000000', '#404040', '#808080', '#c0c0c0', '#ffffff'],
    description: 'Simple grayscale'
  },

  // Elements
  fire: {
    name: 'Fire',
    colors: ['#3d0814', '#a4243b', '#d8572a', '#f99d1c', '#ffcc40'],
    description: 'Fire and lava'
  },

  ice: {
    name: 'Ice',
    colors: ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'],
    description: 'Ice and snow'
  },

  poison: {
    name: 'Poison',
    colors: ['#1b4332', '#2d6a4f', '#40916c', '#52b788', '#b7e4c7'],
    description: 'Toxic and poison'
  }
};

/**
 * Generate a color palette based on a base color
 */
export function generatePaletteFromBase(baseColor: string, shades: number = 5): string[] {
  const palette: string[] = [];

  for (let i = 0; i < shades; i++) {
    const factor = (i / (shades - 1)) * 2 - 1; // -1 to 1
    if (factor < 0) {
      // Darken
      palette.push(darkenColor(baseColor, Math.abs(factor)));
    } else if (factor > 0) {
      // Lighten
      palette.push(lightenColor(baseColor, factor));
    } else {
      // Base color
      palette.push(baseColor);
    }
  }

  return palette;
}

/**
 * Generate complementary color palette
 */
export function generateComplementaryPalette(baseColor: string): string[] {
  const hsl = hexToHSL(baseColor);

  // Generate complementary (opposite on color wheel)
  const comp = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);

  return [
    darkenColor(baseColor, 0.3),
    baseColor,
    lightenColor(baseColor, 0.3),
    darkenColor(comp, 0.3),
    comp
  ];
}

/**
 * Generate analogous color palette
 */
export function generateAnalogousPalette(baseColor: string): string[] {
  const hsl = hexToHSL(baseColor);

  const color1 = hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);
  const color2 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);

  return [
    darkenColor(color1, 0.2),
    color1,
    baseColor,
    color2,
    lightenColor(color2, 0.2)
  ];
}

/**
 * Generate triadic color palette
 */
export function generateTriadicPalette(baseColor: string): string[] {
  const hsl = hexToHSL(baseColor);

  const color1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const color2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);

  return [baseColor, color1, color2, lightenColor(baseColor, 0.3), '#ffffff'];
}

/**
 * Get palette by name
 */
export function getPalette(name: string): string[] {
  return PALETTES[name]?.colors || PALETTES.fantasy.colors;
}

/**
 * List all available palettes
 */
export function listPalettes(): string[] {
  return Object.keys(PALETTES);
}

// Helper functions

function darkenColor(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - Math.floor(255 * amount));
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - Math.floor(255 * amount));
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - Math.floor(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function lightenColor(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + Math.floor(255 * amount));
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + Math.floor(255 * amount));
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + Math.floor(255 * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const hNorm = h / 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
