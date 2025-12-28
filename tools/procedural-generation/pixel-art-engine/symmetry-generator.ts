/**
 * Symmetry-based Pixel Art Generator
 *
 * Purpose: Generate pixel art sprites using symmetry algorithms
 * Authority: Tier 2 (Mandatory for pixel art generation)
 * Method: Creates unique sprites through symmetrical patterns
 */

import { createCanvas } from 'canvas';
import { setPixel, Color, getPixelData, setPixelData } from '../geometric-engine/canvas-renderer';

export type SymmetryMode = 'none' | 'horizontal' | 'vertical' | 'quad';

export interface SymmetryConfig {
  width: number;
  height: number;
  palette: string[];
  symmetry: SymmetryMode;
  density: number; // 0-1, how filled the sprite is
  seed: number;
}

/**
 * Linear Congruential Generator for deterministic randomness
 */
class LCG {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  next(): number {
    this.state = (this.state * 1664525 + 1013904223) % 4294967296;
    return this.state / 4294967296;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
}

/**
 * Generate symmetrical pixel art sprite
 */
export function generateSymmetricalSprite(config: SymmetryConfig): Buffer {
  const { width, height, palette, symmetry, density, seed } = config;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Clear to transparent
  ctx.clearRect(0, 0, width, height);

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const rng = new LCG(seed);

  // Generate based on symmetry mode
  switch (symmetry) {
    case 'horizontal':
      generateHorizontalSymmetry(data, width, height, palette, density, rng);
      break;
    case 'vertical':
      generateVerticalSymmetry(data, width, height, palette, density, rng);
      break;
    case 'quad':
      generateQuadSymmetry(data, width, height, palette, density, rng);
      break;
    case 'none':
    default:
      generateNoSymmetry(data, width, height, palette, density, rng);
      break;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toBuffer('image/png');
}

/**
 * Generate with horizontal symmetry (left-right mirror)
 */
function generateHorizontalSymmetry(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  palette: string[],
  density: number,
  rng: LCG
): void {
  const halfWidth = Math.ceil(width / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < halfWidth; x++) {
      if (rng.next() < density) {
        const color = hexToColor(palette[rng.nextInt(palette.length)]);

        // Set pixel on left side
        setPixelInData(data, x, y, width, color);

        // Mirror to right side
        const mirrorX = width - 1 - x;
        setPixelInData(data, mirrorX, y, width, color);
      }
    }
  }
}

/**
 * Generate with vertical symmetry (top-bottom mirror)
 */
function generateVerticalSymmetry(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  palette: string[],
  density: number,
  rng: LCG
): void {
  const halfHeight = Math.ceil(height / 2);

  for (let y = 0; y < halfHeight; y++) {
    for (let x = 0; x < width; x++) {
      if (rng.next() < density) {
        const color = hexToColor(palette[rng.nextInt(palette.length)]);

        // Set pixel on top half
        setPixelInData(data, x, y, width, color);

        // Mirror to bottom half
        const mirrorY = height - 1 - y;
        setPixelInData(data, x, mirrorY, width, color);
      }
    }
  }
}

/**
 * Generate with quad symmetry (both horizontal and vertical)
 */
function generateQuadSymmetry(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  palette: string[],
  density: number,
  rng: LCG
): void {
  const halfWidth = Math.ceil(width / 2);
  const halfHeight = Math.ceil(height / 2);

  for (let y = 0; y < halfHeight; y++) {
    for (let x = 0; x < halfWidth; x++) {
      if (rng.next() < density) {
        const color = hexToColor(palette[rng.nextInt(palette.length)]);

        // Set in all 4 quadrants
        setPixelInData(data, x, y, width, color);
        setPixelInData(data, width - 1 - x, y, width, color);
        setPixelInData(data, x, height - 1 - y, width, color);
        setPixelInData(data, width - 1 - x, height - 1 - y, width, color);
      }
    }
  }
}

/**
 * Generate without symmetry (random)
 */
function generateNoSymmetry(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  palette: string[],
  density: number,
  rng: LCG
): void {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (rng.next() < density) {
        const color = hexToColor(palette[rng.nextInt(palette.length)]);
        setPixelInData(data, x, y, width, color);
      }
    }
  }
}

/**
 * Set pixel in image data array
 */
function setPixelInData(
  data: Uint8ClampedArray,
  x: number,
  y: number,
  width: number,
  color: Color
): void {
  const index = (y * width + x) * 4;
  data[index] = color.r;
  data[index + 1] = color.g;
  data[index + 2] = color.b;
  data[index + 3] = color.a !== undefined ? Math.floor(color.a * 255) : 255;
}

/**
 * Convert hex color to Color object
 */
function hexToColor(hex: string): Color {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b, a: 1 };
}

/**
 * Generate character sprite with humanoid proportions
 */
export function generateCharacterSprite(config: Omit<SymmetryConfig, 'symmetry'>): Buffer {
  // Force horizontal symmetry for characters
  return generateSymmetricalSprite({
    ...config,
    symmetry: 'horizontal'
  });
}

/**
 * Generate item sprite
 */
export function generateItemSprite(config: Omit<SymmetryConfig, 'symmetry' | 'density'>): Buffer {
  // Items often have quad symmetry and higher density
  return generateSymmetricalSprite({
    ...config,
    symmetry: 'quad',
    density: 0.7
  });
}
