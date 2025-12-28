/**
 * Sprite Normalizer
 * 
 * Normalizes sprite sizes and aligns pivot points for consistent sprites.
 */

import sharp from 'sharp';
import type { GeneratedSprite } from '../types/index.js';

/**
 * Sprite Normalizer
 * 
 * Normalizes sprites to consistent sizes and pivot points.
 */
export class SpriteNormalizer {
  /**
   * Normalize sprite size and alignment
   */
  async normalize(
    sprite: GeneratedSprite,
    targetWidth: number,
    targetHeight: number
  ): Promise<Buffer> {
    const image = sharp(sprite.data);
    const metadata = await image.metadata();

    // If already correct size, return as-is
    if (metadata.width === targetWidth && metadata.height === targetHeight) {
      return sprite.data;
    }

    // Resize to target dimensions
    // Use nearest neighbor for pixel art, lanczos for other styles
    const resizeOptions: sharp.ResizeOptions = {
      width: targetWidth,
      height: targetHeight,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
    };

    // Check if pixel art style (would need to be passed in params)
    // For now, use lanczos
    const resized = await image
      .resize(resizeOptions)
      .png()
      .toBuffer();

    return resized;
  }

  /**
   * Center sprite in canvas
   */
  async centerSprite(
    sprite: GeneratedSprite,
    canvasWidth: number,
    canvasHeight: number
  ): Promise<Buffer> {
    const image = sharp(sprite.data);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Cannot get sprite dimensions');
    }

    // Calculate center position
    const x = Math.floor((canvasWidth - metadata.width) / 2);
    const y = Math.floor((canvasHeight - metadata.height) / 2);

    // Create new canvas and composite sprite in center
    const canvas = sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });

    const result = await canvas
      .composite([{
        input: sprite.data,
        left: x,
        top: y,
      }])
      .png()
      .toBuffer();

    return result;
  }

  /**
   * Align pivot point
   */
  async alignPivot(
    sprite: GeneratedSprite,
    _pivotX: number,
    _pivotY: number
  ): Promise<Buffer> {
    // This would align the sprite so the pivot point is at the specified position
    // For now, return as-is
    // Full implementation would calculate offset and shift sprite
    return sprite.data;
  }
}

