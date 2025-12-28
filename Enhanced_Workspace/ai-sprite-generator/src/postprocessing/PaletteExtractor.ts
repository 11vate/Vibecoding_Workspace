/**
 * Palette Extractor
 * 
 * Extracts color palettes from sprites for style consistency.
 */

import sharp from 'sharp';
import type { GeneratedSprite } from '../types/index.js';

/**
 * Color palette
 */
export interface ColorPalette {
  dominant: string[];
  all: string[];
  count: number;
  style: string;
}

/**
 * Palette Extractor
 * 
 * Extracts color palettes from sprite images.
 */
export class PaletteExtractor {
  /**
   * Extract color palette from sprite
   */
  async extractPalette(sprite: GeneratedSprite): Promise<ColorPalette> {
    const image = sharp(sprite.data);
    
    // Get image statistics
    const stats = await image.stats();
    
    // Extract dominant colors from channels
    const dominantColors: string[] = [];
    const allColors: string[] = [];
    
    // This is a simplified extraction
    // Full implementation would use color quantization algorithms
    if (stats.channels) {
      for (const channel of stats.channels) {
        if (channel.mean !== undefined) {
          const r = Math.round(channel.mean);
          const g = Math.round(stats.channels[1]?.mean || 0);
          const b = Math.round(stats.channels[2]?.mean || 0);
          const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          dominantColors.push(color);
        }
      }
    }

    return {
      dominant: dominantColors.slice(0, 5),
      all: allColors,
      count: dominantColors.length,
      style: 'extracted',
    };
  }

  /**
   * Quantize colors to palette
   */
  async quantizeToPalette(
    sprite: GeneratedSprite,
    maxColors: number
  ): Promise<Buffer> {
    const image = sharp(sprite.data);
    
    // Use Sharp's palette extraction and quantization
    // This is a simplified approach
    const quantized = await image
      .png({ palette: true, colors: maxColors })
      .toBuffer();

    return quantized;
  }
}







