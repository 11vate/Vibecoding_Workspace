/**
 * Frame Aligner
 * 
 * Aligns animation frames to consistent pivot points.
 */

import sharp from 'sharp';
import type { GeneratedSprite } from '../types/index.js';

/**
 * Frame Aligner
 * 
 * Aligns animation frames for consistent animation.
 */
export class FrameAligner {
  /**
   * Align frames to consistent pivot point
   */
  async alignFrames(
    frames: GeneratedSprite[],
    pivotX: number,
    pivotY: number
  ): Promise<GeneratedSprite[]> {
    if (frames.length === 0) {
      return frames;
    }

    // Get target dimensions (use first frame as reference)
    const targetWidth = frames[0].width;
    const targetHeight = frames[0].height;

    const alignedFrames: GeneratedSprite[] = [];

    for (const frame of frames) {
      // Center frame in canvas if needed
      const image = sharp(frame.data);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        alignedFrames.push(frame);
        continue;
      }

      // Calculate offset to align pivot
      const offsetX = pivotX - Math.floor(metadata.width / 2);
      const offsetY = pivotY - Math.floor(metadata.height / 2);

      // Create canvas and composite frame
      const canvas = sharp({
        create: {
          width: targetWidth,
          height: targetHeight,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      });

      const alignedData = await canvas
        .composite([{
          input: frame.data,
          left: Math.max(0, offsetX),
          top: Math.max(0, offsetY),
        }])
        .png()
        .toBuffer();

      alignedFrames.push({
        ...frame,
        data: alignedData,
      });
    }

    return alignedFrames;
  }

  /**
   * Detect pivot point from frame
   */
  async detectPivot(frame: GeneratedSprite): Promise<{ x: number; y: number }> {
    // Simple pivot detection: center of sprite
    // Full implementation would analyze sprite content
    return {
      x: Math.floor(frame.width / 2),
      y: Math.floor(frame.height / 2),
    };
  }
}

