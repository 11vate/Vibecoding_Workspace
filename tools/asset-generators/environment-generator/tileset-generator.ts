/**
 * Tileset Generator - Generate terrain and environment tiles
 *
 * Purpose: Create tileable terrain sprites for game environments
 * Authority: Tier 2 (Mandatory for environment generation)
 * Use: Terrain tiles, floors, walls, backgrounds
 */

import {
  generateGrassTile,
  generateStoneTile,
  generateWaterTile,
  generateNoiseTexture,
  COLOR_MAPS
} from '../../procedural-generation/texture-engine/perlin-noise';
import { buildSpriteSheet } from '../../procedural-generation/animation-engine/sprite-sheet-builder';

export type TileType = 'grass' | 'stone' | 'water' | 'sand' | 'dirt' | 'wood' | 'lava';
export type TileSize = 16 | 32 | 64;

export interface TilesetSpec {
  tileType: TileType;
  tileSize: TileSize;
  tileCount?: number; // Number of variations (default: 9)
  seed: number;
}

export interface TilesetGenerationResult {
  tiles: Buffer[]; // Individual tile variations
  tilesheet?: Buffer; // Combined sprite sheet
  spec: TilesetSpec;
  symbolName: string;
}

/**
 * Generate tileset
 */
export async function generateTileset(spec: TilesetSpec): Promise<TilesetGenerationResult> {
  const { tileType, tileSize, tileCount = 9, seed } = spec;

  const tiles: Buffer[] = [];

  // Generate tile variations
  for (let i = 0; i < tileCount; i++) {
    const tileSeed = seed + i * 1000;
    const tile = await generateTile(tileType, tileSize, tileSeed);
    tiles.push(tile);
  }

  // Build sprite sheet
  const tilesheet = await buildTilesheetFromTiles(tiles, tileSize);

  const symbolName = `tileset-${tileType}-${tileSize}x${tileSize}-${tileCount}tiles`;

  return {
    tiles,
    tilesheet,
    spec,
    symbolName
  };
}

/**
 * Generate single tile
 */
async function generateTile(tileType: TileType, size: TileSize, seed: number): Promise<Buffer> {
  switch (tileType) {
    case 'grass':
      return generateGrassTile(size, size, seed);
    case 'stone':
      return generateStoneTile(size, size, seed);
    case 'water':
      return generateWaterTile(size, size, seed);
    case 'sand':
      return generateNoiseTexture({
        width: size,
        height: size,
        scale: 20,
        octaves: 4,
        persistence: 0.5,
        seed,
        colorMap: COLOR_MAPS.sand
      });
    case 'dirt':
      return generateNoiseTexture({
        width: size,
        height: size,
        scale: 15,
        octaves: 5,
        persistence: 0.6,
        seed,
        colorMap: (v: number) => {
          if (v < 0.3) return '#5d4037';
          if (v < 0.6) return '#6d4c41';
          if (v < 0.8) return '#795548';
          return '#8d6e63';
        }
      });
    case 'wood':
      return generateNoiseTexture({
        width: size,
        height: size,
        scale: 25,
        octaves: 4,
        persistence: 0.7,
        seed,
        colorMap: (v: number) => {
          if (v < 0.25) return '#3e2723';
          if (v < 0.5) return '#4e342e';
          if (v < 0.75) return '#5d4037';
          return '#6d4c41';
        }
      });
    case 'lava':
      return generateNoiseTexture({
        width: size,
        height: size,
        scale: 30,
        octaves: 3,
        persistence: 0.4,
        seed,
        colorMap: COLOR_MAPS.lava
      });
    default:
      return generateGrassTile(size, size, seed);
  }
}

/**
 * Build tilesheet from individual tiles
 */
async function buildTilesheetFromTiles(tiles: Buffer[], tileSize: number): Promise<Buffer> {
  const result = await buildSpriteSheet({
    frames: tiles.map((tile, i) => ({ image: tile, name: `tile-${i}` })),
    frameWidth: tileSize,
    frameHeight: tileSize,
    layout: 'grid',
    padding: 0
  });

  return result.image;
}

/**
 * Generate complete environment tileset (multiple terrain types)
 */
export async function generateEnvironmentTileset(
  tileSize: TileSize = 32,
  seed: number = 12345
): Promise<Record<TileType, TilesetGenerationResult>> {
  const tileTypes: TileType[] = ['grass', 'stone', 'water', 'sand', 'dirt'];
  const results: Record<string, TilesetGenerationResult> = {};

  for (const tileType of tileTypes) {
    results[tileType] = await generateTileset({
      tileType,
      tileSize,
      tileCount: 4, // 4 variations of each type
      seed: seed + tileTypes.indexOf(tileType) * 10000
    });
  }

  return results as Record<TileType, TilesetGenerationResult>;
}
