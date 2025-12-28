/**
 * Perlin Noise Generator
 *
 * Purpose: Generate natural-looking textures using Perlin noise algorithm
 * Authority: Tier 2 (Mandatory for texture generation)
 * Use: Backgrounds, tiles, terrain, organic textures
 */

import { createCanvas } from 'canvas';
import { Color } from '../geometric-engine/canvas-renderer';

export interface NoiseConfig {
  width: number;
  height: number;
  scale: number; // Lower = more zoomed in, higher = more zoomed out
  octaves?: number; // Number of noise layers (default: 4)
  persistence?: number; // How much each octave contributes (default: 0.5)
  seed: number;
}

export interface TextureConfig extends NoiseConfig {
  colorMap: (value: number) => string; // Maps noise value (0-1) to color
}

/**
 * Perlin Noise implementation (simplified for deterministic generation)
 */
class PerlinNoise {
  private permutation: number[];

  constructor(seed: number) {
    // Generate permutation table from seed
    this.permutation = this.generatePermutation(seed);
  }

  /**
   * Generate permutation table deterministically from seed
   */
  private generatePermutation(seed: number): number[] {
    const p: number[] = [];

    // Initialize with 0-255
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }

    // Shuffle using seed-based LCG
    let state = seed;
    for (let i = 255; i > 0; i--) {
      state = (state * 1664525 + 1013904223) % 4294967296;
      const j = Math.floor((state / 4294967296) * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }

    // Duplicate for overflow handling
    return [...p, ...p];
  }

  /**
   * Fade function for smooth interpolation
   */
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Linear interpolation
   */
  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  /**
   * Gradient function
   */
  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * Get 2D Perlin noise value at (x, y)
   * Returns value between -1 and 1
   */
  public noise2D(x: number, y: number): number {
    // Find unit square coordinates
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    // Find relative x, y in square
    x -= Math.floor(x);
    y -= Math.floor(y);

    // Compute fade curves
    const u = this.fade(x);
    const v = this.fade(y);

    // Hash coordinates of square corners
    const p = this.permutation;
    const a = p[X] + Y;
    const b = p[X + 1] + Y;

    // Blend results from 4 corners
    return this.lerp(
      this.lerp(this.grad(p[a], x, y), this.grad(p[b], x - 1, y), u),
      this.lerp(this.grad(p[a + 1], x, y - 1), this.grad(p[b + 1], x - 1, y - 1), u),
      v
    );
  }

  /**
   * Get octave noise (layered for more detail)
   */
  public octaveNoise2D(
    x: number,
    y: number,
    octaves: number = 4,
    persistence: number = 0.5
  ): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;

      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return total / maxValue;
  }
}

/**
 * Generate noise-based texture
 */
export function generateNoiseTexture(config: TextureConfig): Buffer {
  const { width, height, scale, octaves = 4, persistence = 0.5, seed, colorMap } = config;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const noise = new PerlinNoise(seed);
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Get noise value at this position
      const noiseValue = noise.octaveNoise2D(x / scale, y / scale, octaves, persistence);

      // Normalize to 0-1
      const normalized = (noiseValue + 1) / 2;

      // Map to color
      const colorHex = colorMap(normalized);
      const color = hexToColor(colorHex);

      const index = (y * width + x) * 4;
      data[index] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toBuffer('image/png');
}

/**
 * Predefined color maps for common textures
 */
export const COLOR_MAPS = {
  grayscale: (v: number) => {
    const gray = Math.floor(v * 255);
    return `#${gray.toString(16).padStart(2, '0')}`.repeat(3);
  },

  grass: (v: number) => {
    if (v < 0.3) return '#1b5e20';
    if (v < 0.5) return '#2e7d32';
    if (v < 0.7) return '#388e3c';
    if (v < 0.9) return '#4caf50';
    return '#66bb6a';
  },

  stone: (v: number) => {
    if (v < 0.25) return '#3e2723';
    if (v < 0.5) return '#5d4037';
    if (v < 0.75) return '#6d4c41';
    return '#8d6e63';
  },

  water: (v: number) => {
    if (v < 0.3) return '#01579b';
    if (v < 0.6) return '#0277bd';
    if (v < 0.8) return '#0288d1';
    return '#03a9f4';
  },

  sand: (v: number) => {
    if (v < 0.3) return '#d7ccc8';
    if (v < 0.6) return '#e0d4c8';
    if (v < 0.8) return '#efebe9';
    return '#f5f5f1';
  },

  lava: (v: number) => {
    if (v < 0.25) return '#3d0814';
    if (v < 0.5) return '#a4243b';
    if (v < 0.75) return '#d8572a';
    return '#f99d1c';
  }
};

/**
 * Generate grass tile texture
 */
export function generateGrassTile(width: number, height: number, seed: number): Buffer {
  return generateNoiseTexture({
    width,
    height,
    scale: 20,
    octaves: 4,
    persistence: 0.5,
    seed,
    colorMap: COLOR_MAPS.grass
  });
}

/**
 * Generate stone tile texture
 */
export function generateStoneTile(width: number, height: number, seed: number): Buffer {
  return generateNoiseTexture({
    width,
    height,
    scale: 15,
    octaves: 5,
    persistence: 0.6,
    seed,
    colorMap: COLOR_MAPS.stone
  });
}

/**
 * Generate water tile texture
 */
export function generateWaterTile(width: number, height: number, seed: number): Buffer {
  return generateNoiseTexture({
    width,
    height,
    scale: 30,
    octaves: 3,
    persistence: 0.4,
    seed,
    colorMap: COLOR_MAPS.water
  });
}

// Helper
function hexToColor(hex: string): Color {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b, a: 1 };
}
