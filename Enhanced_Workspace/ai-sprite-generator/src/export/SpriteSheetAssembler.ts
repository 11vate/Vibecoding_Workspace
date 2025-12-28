/**
 * Sprite Sheet Assembler
 * 
 * Assembles animation frames into sprite sheets.
 */

import sharp from 'sharp';
import type { GeneratedSprite, SpriteSheetMetadata, AnimationFrame } from '../types/index.js';

/**
 * Sprite Sheet Assembler
 * 
 * Creates sprite sheets from animation frames.
 */
export class SpriteSheetAssembler {
  /**
   * Assemble frames into sprite sheet
   */
  async assembleSheet(
    frames: GeneratedSprite[],
    frameWidth: number,
    frameHeight: number,
    spacing: number = 0
  ): Promise<{ sheet: Buffer; metadata: SpriteSheetMetadata }> {
    if (frames.length === 0) {
      throw new Error('Cannot create sprite sheet from empty frames');
    }

    // Calculate sheet dimensions
    const framesPerRow = Math.ceil(Math.sqrt(frames.length));
    const rows = Math.ceil(frames.length / framesPerRow);
    const sheetWidth = framesPerRow * (frameWidth + spacing) - spacing;
    const sheetHeight = rows * (frameHeight + spacing) - spacing;

    // Create sheet canvas
    const sheet = sharp({
      create: {
        width: sheetWidth,
        height: sheetHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });

    // Composite frames
    const composites = frames.map((frame, index) => {
      const row = Math.floor(index / framesPerRow);
      const col = index % framesPerRow;
      const x = col * (frameWidth + spacing);
      const y = row * (frameHeight + spacing);

      return {
        input: frame.data,
        left: x,
        top: y,
      };
    });

    const sheetBuffer = await sheet
      .composite(composites)
      .png()
      .toBuffer();

    // Create metadata
    const frameMetadata: AnimationFrame[] = frames.map((_frame, index) => {
      const row = Math.floor(index / framesPerRow);
      const col = index % framesPerRow;
      const x = col * (frameWidth + spacing);
      const y = row * (frameHeight + spacing);

      return {
        index,
        bounds: {
          x,
          y,
          width: frameWidth,
          height: frameHeight,
        },
      };
    });

    const metadata: SpriteSheetMetadata = {
      width: sheetWidth,
      height: sheetHeight,
      frameWidth,
      frameHeight,
      frames: frameMetadata,
    };

    return {
      sheet: sheetBuffer,
      metadata,
    };
  }
}

