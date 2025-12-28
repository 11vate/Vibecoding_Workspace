/**
 * Variant Generator
 * 
 * Generates color variants, equipment variations, and directional views.
 */

import type { GeneratedSprite, GenerationParams } from '../types/index.js';
import { AIGenerator } from '../generation/AIGenerator.js';
import sharp from 'sharp';

/**
 * Variant Generator
 */
export class VariantGenerator {
  private aiGenerator: AIGenerator;

  constructor() {
    this.aiGenerator = new AIGenerator();
  }

  /**
   * Generate color variants
   */
  async generateColorVariants(
    baseSprite: GeneratedSprite,
    colors: string[]
  ): Promise<GeneratedSprite[]> {
    const variants: GeneratedSprite[] = [];

    for (const color of colors) {
      // Use image processing to change colors
      // Placeholder: Would use more sophisticated color replacement
      const variant = await this.replaceColor(baseSprite, color);
      variants.push(variant);
    }

    return variants;
  }

  /**
   * Generate directional views
   */
  async generateDirectionalViews(
    baseSprite: GeneratedSprite,
    directions: string[]
  ): Promise<GeneratedSprite[]> {
    const views: GeneratedSprite[] = [];

    for (const direction of directions) {
      // Generate new sprite with direction hint
      const params: GenerationParams = {
        entity: baseSprite.metadata.entity,
        style: baseSprite.metadata.style,
        theme: baseSprite.metadata.theme,
        perspective: this.directionToPerspective(direction),
        resolution: [baseSprite.width, baseSprite.height],
        postProcessing: ['background-removal', 'normalization'],
      };

      const view = await this.aiGenerator.generate(params);
      views.push(view);
    }

    return views;
  }

  /**
   * Generate equipment variants
   */
  async generateEquipmentVariants(
    baseSprite: GeneratedSprite,
    equipment: string[]
  ): Promise<GeneratedSprite[]> {
    const variants: GeneratedSprite[] = [];

    for (const item of equipment) {
      // Generate sprite with equipment
      const params: GenerationParams = {
        entity: baseSprite.metadata.entity,
        style: baseSprite.metadata.style,
        theme: `${baseSprite.metadata.theme} with ${item}`,
        perspective: baseSprite.metadata.perspective,
        resolution: [baseSprite.width, baseSprite.height],
        postProcessing: ['background-removal', 'normalization'],
      };

      const variant = await this.aiGenerator.generate(params);
      variants.push(variant);
    }

    return variants;
  }

  /**
   * Replace color in sprite (placeholder)
   */
  private async replaceColor(
    sprite: GeneratedSprite,
    targetColor: string
  ): Promise<GeneratedSprite> {
    // Placeholder: Simple color replacement
    // Full implementation would use more sophisticated color mapping
    const image = sharp(sprite.data);
    const processed = await image
      .modulate({
        saturation: 1.2, // Increase saturation
      })
      .toBuffer();

    return {
      ...sprite,
      id: `${sprite.id}_${targetColor}`,
      data: processed,
    };
  }

  /**
   * Convert direction to perspective
   */
  private directionToPerspective(direction: string): 'side-view' | 'top-down' | 'isometric' | 'front-view' {
    const lower = direction.toLowerCase();
    if (['north', 'south'].includes(lower)) {
      return 'front-view';
    }
    if (['east', 'west'].includes(lower)) {
      return 'side-view';
    }
    if (['northeast', 'northwest', 'southeast', 'southwest'].includes(lower)) {
      return 'isometric';
    }
    return 'side-view';
  }
}

