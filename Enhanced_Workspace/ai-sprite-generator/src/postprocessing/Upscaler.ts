/**
 * Upscaler
 * 
 * Upscales sprites using Real-ESRGAN or pixel-perfect methods.
 */

import type { GeneratedSprite } from '../types/index.js';
import sharp from 'sharp';

/**
 * Upscaling method
 */
export type UpscaleMethod = 'real-esrgan' | 'pixel-perfect' | 'hqx';

/**
 * Upscaler
 */
export class Upscaler {
  /**
   * Upscale sprite
   */
  async upscale(
    sprite: GeneratedSprite,
    scale: number,
    method: UpscaleMethod = 'pixel-perfect'
  ): Promise<GeneratedSprite> {
    switch (method) {
      case 'pixel-perfect':
        return this.upscalePixelPerfect(sprite, scale);
      case 'real-esrgan':
        return this.upscaleRealESRGAN(sprite, scale);
      case 'hqx':
        return this.upscaleHQX(sprite, scale);
      default:
        return this.upscalePixelPerfect(sprite, scale);
    }
  }

  /**
   * Pixel-perfect upscaling (nearest neighbor)
   */
  private async upscalePixelPerfect(
    sprite: GeneratedSprite,
    scale: number
  ): Promise<GeneratedSprite> {
    const newWidth = sprite.width * scale;
    const newHeight = sprite.height * scale;

    const upscaled = await sharp(sprite.data)
      .resize(newWidth, newHeight, {
        kernel: 'nearest',
      })
      .toBuffer();

    return {
      ...sprite,
      id: `${sprite.id}_upscaled_${scale}x`,
      data: upscaled,
      width: newWidth,
      height: newHeight,
    };
  }

  /**
   * Real-ESRGAN upscaling (placeholder)
   */
  private async upscaleRealESRGAN(
    sprite: GeneratedSprite,
    scale: number
  ): Promise<GeneratedSprite> {
    // Placeholder: Would call Real-ESRGAN Python service
    // For now, fallback to pixel-perfect
    return this.upscalePixelPerfect(sprite, scale);
  }

  /**
   * HQX upscaling (placeholder)
   */
  private async upscaleHQX(
    sprite: GeneratedSprite,
    scale: number
  ): Promise<GeneratedSprite> {
    // Placeholder: Would use HQX algorithm
    // For now, fallback to pixel-perfect
    return this.upscalePixelPerfect(sprite, scale);
  }
}







