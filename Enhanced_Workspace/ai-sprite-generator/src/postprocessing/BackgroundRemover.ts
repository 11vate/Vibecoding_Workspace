/**
 * Background Remover
 * 
 * Removes backgrounds from sprites to create transparent PNGs.
 * Uses Rembg (U²-Net) or alternative methods.
 */

import sharp from 'sharp';
import type { GeneratedSprite } from '../types/index.js';

/**
 * Background Remover
 * 
 * Removes backgrounds from sprite images.
 */
export class BackgroundRemover {
  /**
   * Remove background from sprite
   * 
   * Note: Full Rembg integration would require Python or a Node.js wrapper.
   * For now, we'll use Sharp's alpha channel manipulation as a fallback.
   */
  async removeBackground(sprite: GeneratedSprite): Promise<Buffer> {
    // In production, this would call Rembg API or Python script
    // For now, we'll use Sharp to attempt background removal
    
    try {
      // Try to use Sharp to make background transparent
      // This is a simplified approach - full implementation would use Rembg
      const image = sharp(sprite.data);
      const metadata = await image.metadata();
      
      // If image already has alpha channel, return as-is
      if (metadata.hasAlpha) {
        return sprite.data;
      }
      
      // For now, return the original image
      // Full implementation would:
      // 1. Call Rembg API/script to get mask
      // 2. Apply mask to create transparent background
      // 3. Return processed image
      
      console.warn('[BackgroundRemover] Full background removal requires Rembg. Returning original image.');
      return sprite.data;
    } catch (error) {
      console.error('[BackgroundRemover] Error removing background:', error);
      return sprite.data;
    }
  }

  /**
   * Check if background removal is available
   */
  async isAvailable(): Promise<boolean> {
    // Check if Rembg is available
    // For now, return false as we're using fallback
    return false;
  }
}







