/**
 * Cellular Automata Pixel Art Generator
 *
 * Purpose: Generate organic-looking pixel art using cellular automata rules
 * Authority: Tier 2 (Mandatory for pixel art generation)
 * Method: Applies CA rules to create complex patterns from simple initial states
 */

import { createCanvas } from 'canvas';
import { Color } from '../geometric-engine/canvas-renderer';
import { NoiseLibrary } from '../noise';

export interface CAConfig {
  width: number;
  height: number;
  palette: string[];
  seed: number;
  iterations: number; // How many CA steps to run
  rule: CARule;
  initialDensity?: number; // 0-1, initial fill percentage
  noiseInfluence?: number; // 0-1, how much noise affects initial state
}

export type CARule = 'conway' | 'cave' | 'maze' | 'erosion';

/**
 * Generate pixel art using cellular automata
 */
export function generateCellularAutomata(config: CAConfig): Buffer {
  const { width, height, palette, seed, iterations, rule, initialDensity = 0.45, noiseInfluence = 0.0 } = config;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);

  // Initialize grid
  let grid = initializeGrid(width, height, initialDensity, seed, noiseInfluence);

  // Apply CA rules for specified iterations
  for (let i = 0; i < iterations; i++) {
    grid = applyRule(grid, width, height, rule);
  }

  // Convert grid to pixels with colors
  renderGridToCanvas(ctx, grid, width, height, palette, seed);

  return canvas.toBuffer('image/png');
}

/**
 * Initialize grid using NoiseLibrary for better organic distribution
 */
function initializeGrid(width: number, height: number, density: number, seed: number, noiseInfluence: number = 0.0): number[][] {
  const grid: number[][] = [];
  NoiseLibrary.seed(seed);

  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      let value = 0;
      
      // Mixed approach: Random + Noise
      const randomVal = Math.random();
      
      if (noiseInfluence > 0) {
        // Normalize noise from -1..1 to 0..1
        const noiseVal = (NoiseLibrary.perlin2D(x / 10, y / 10) + 1) / 2;
        // Blend random and noise based on influence
        const blendedVal = (randomVal * (1 - noiseInfluence)) + (noiseVal * noiseInfluence);
        value = blendedVal < density ? 1 : 0;
      } else {
        // Pure random (classic CA)
        value = randomVal < density ? 1 : 0;
      }
      
      grid[y][x] = value;
    }
  }

  return grid;
}

/**
 * Apply cellular automata rule
 */
function applyRule(
  grid: number[][],
  width: number,
  height: number,
  rule: CARule
): number[][] {
  switch (rule) {
    case 'conway':
      return applyConwayRule(grid, width, height);
    case 'cave':
      return applyCaveRule(grid, width, height);
    case 'maze':
      return applyMazeRule(grid, width, height);
    case 'erosion':
      return applyErosionRule(grid, width, height);
    default:
      return grid;
  }
}

/**
 * Conway's Game of Life rule
 * Creates organic, blob-like patterns
 */
function applyConwayRule(grid: number[][], width: number, height: number): number[][] {
  const newGrid: number[][] = [];

  for (let y = 0; y < height; y++) {
    newGrid[y] = [];
    for (let x = 0; x < width; x++) {
      const neighbors = countNeighbors(grid, x, y, width, height);
      const cell = grid[y][x];

      // Conway's rules
      if (cell === 1) {
        // Cell is alive
        newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        // Cell is dead
        newGrid[y][x] = neighbors === 3 ? 1 : 0;
      }
    }
  }

  return newGrid;
}

/**
 * Cave generation rule
 * Creates cave-like structures
 */
function applyCaveRule(grid: number[][], width: number, height: number): number[][] {
  const newGrid: number[][] = [];

  for (let y = 0; y < height; y++) {
    newGrid[y] = [];
    for (let x = 0; x < width; x++) {
      const neighbors = countNeighbors(grid, x, y, width, height);

      // Cave rule: keep wall if 5+ neighbors, else floor
      newGrid[y][x] = neighbors >= 5 ? 1 : 0;
    }
  }

  return newGrid;
}

/**
 * Maze generation rule
 * Creates maze-like patterns
 */
function applyMazeRule(grid: number[][], width: number, height: number): number[][] {
  const newGrid: number[][] = [];

  for (let y = 0; y < height; y++) {
    newGrid[y] = [];
    for (let x = 0; x < width; x++) {
      const neighbors = countNeighbors(grid, x, y, width, height);
      const cell = grid[y][x];

      // Maze rule: creates thin walls
      if (cell === 1) {
        newGrid[y][x] = neighbors <= 2 ? 0 : 1;
      } else {
        newGrid[y][x] = neighbors >= 6 ? 1 : 0;
      }
    }
  }

  return newGrid;
}

/**
 * Erosion rule
 * Smooths and erodes patterns
 */
function applyErosionRule(grid: number[][], width: number, height: number): number[][] {
  const newGrid: number[][] = [];

  for (let y = 0; y < height; y++) {
    newGrid[y] = [];
    for (let x = 0; x < width; x++) {
      const neighbors = countNeighbors(grid, x, y, width, height);

      // Erosion: cell dies if < 4 neighbors
      newGrid[y][x] = neighbors >= 4 ? 1 : 0;
    }
  }

  return newGrid;
}

/**
 * Count live neighbors (8-connected)
 */
function countNeighbors(
  grid: number[][],
  x: number,
  y: number,
  width: number,
  height: number
): number {
  let count = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      // Treat out-of-bounds as walls
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
        count++;
      } else if (grid[ny][nx] === 1) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Render grid to canvas with colors
 */
function renderGridToCanvas(
  ctx: CanvasRenderingContext2D,
  grid: number[][],
  width: number,
  height: number,
  palette: string[],
  seed: number
): void {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const rng = new LCG(seed);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 1) {
        // Pick color from palette
        const colorHex = palette[rng.nextInt(palette.length)];
        const color = hexToColor(colorHex);

        const index = (y * width + x) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255;
      }
      // else leave transparent (alpha = 0)
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Convert hex to Color
 */
function hexToColor(hex: string): Color {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b, a: 1 };
}

/**
 * Generate creature sprite using CA (organic look)
 */
export function generateCreatureSprite(
  width: number,
  height: number,
  palette: string[],
  seed: number
): Buffer {
  return generateCellularAutomata({
    width,
    height,
    palette,
    seed,
    iterations: 3,
    rule: 'conway',
    initialDensity: 0.5
  });
}

/**
 * Generate environment/terrain sprite
 */
export function generateTerrainSprite(
  width: number,
  height: number,
  palette: string[],
  seed: number
): Buffer {
  return generateCellularAutomata({
    width,
    height,
    palette,
    seed,
    iterations: 5,
    rule: 'cave',
    initialDensity: 0.45
  });
}
