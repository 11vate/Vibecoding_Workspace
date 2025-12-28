/**
 * Quality Validator
 * 
 * Validates sprite quality against game-ready standards.
 */

import sharp from 'sharp';
import type { GeneratedSprite } from '../types/index.js';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-1
}

/**
 * Quality Validator
 * 
 * Validates sprites meet game-ready quality standards.
 */
export class QualityValidator {
  /**
   * Validate sprite quality
   */
  async validate(sprite: GeneratedSprite): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 1.0;

    try {
      const image = sharp(sprite.data);
      const metadata = await image.metadata();

      // Check dimensions
      if (!metadata.width || !metadata.height) {
        errors.push('Cannot determine sprite dimensions');
        score -= 0.3;
      } else {
        if (metadata.width !== sprite.width || metadata.height !== sprite.height) {
          warnings.push(`Metadata dimensions (${sprite.width}x${sprite.height}) don't match image dimensions (${metadata.width}x${metadata.height})`);
          score -= 0.1;
        }
      }

      // Check format
      if (sprite.format !== 'png') {
        warnings.push(`Format is ${sprite.format}, PNG recommended for transparency`);
        score -= 0.1;
      }

      // Check transparency (alpha channel)
      if (!metadata.hasAlpha) {
        warnings.push('Image does not have alpha channel (transparency)');
        score -= 0.2;
      }

      // Check file size (reasonable limits)
      if (sprite.data.length > 5 * 1024 * 1024) { // 5MB
        warnings.push('Sprite file size is very large (>5MB)');
        score -= 0.1;
      }

      // Check if image is too small
      if (metadata.width && metadata.width < 16) {
        warnings.push('Sprite width is very small (<16px)');
        score -= 0.1;
      }

      if (metadata.height && metadata.height < 16) {
        warnings.push('Sprite height is very small (<16px)');
        score -= 0.1;
      }

      score = Math.max(0, Math.min(1, score));

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        score,
      };
    } catch (error) {
      errors.push(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        valid: false,
        errors,
        warnings,
        score: 0,
      };
    }
  }
}







