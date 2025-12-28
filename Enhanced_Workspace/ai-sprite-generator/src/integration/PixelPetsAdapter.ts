/**
 * Pixel Pets Integration Adapter
 * 
 * Adapter to integrate AI Sprite Generator with Pixel Pets Reborn.
 * Maintains compatibility with existing SpriteGenerator interface.
 * 
 * Note: This adapter requires Pixel Pets types to be available.
 * For standalone use, create a wrapper that matches your Pet interface.
 */

import { AssetPipeline } from '../pipeline/AssetPipeline.js';

/**
 * Pet interface for Pixel Pets integration
 * This should match the Pet entity from Pixel Pets Reborn
 */
export interface PetLike {
  family: string;
  appearance: {
    visualTags: string[];
    colorMutation?: { r: number; g: number; b: number };
    glowColor?: string;
  };
  rarity: number;
}

/**
 * Pixel Pets Adapter
 * 
 * Adapts AI Sprite Generator to Pixel Pets SpriteGenerator interface.
 */
export class PixelPetsAdapter {
  private pipeline: AssetPipeline;

  constructor() {
    this.pipeline = new AssetPipeline();
  }

  /**
   * Generate sprite for a Pet entity
   * 
   * Compatible with Pixel Pets SpriteGenerator.generateSpriteForPet interface.
   */
  async generateSpriteForPet(pet: PetLike): Promise<string> {
    // Convert Pet to generation concept
    const concept = this.petToConcept(pet);

    // Generate sprite
    const result = await this.pipeline.execute(concept, {
      enablePostProcessing: true,
      enableValidation: true,
      enableExport: false, // Pixel Pets handles its own storage
    });

    if (!result.success || !result.sprite) {
      throw new Error(`Failed to generate sprite: ${result.errors.join(', ')}`);
    }

    // Convert buffer to data URL for Pixel Pets
    const base64 = result.sprite.data.toString('base64');
    return `data:image/png;base64,${base64}`;
  }

  /**
   * Generate all animation states for a pet
   */
  async generateAllAnimationStates(pet: PetLike): Promise<{
    idle?: string;
    attack?: string;
    hit?: string;
    ultimate?: string;
    death?: string;
  }> {
    const states: Array<'idle' | 'attack' | 'hit' | 'ultimate' | 'death'> = [
      'idle',
      'attack',
      'hit',
      'ultimate',
      'death',
    ];

    const animationStates: Record<string, string> = {};

    for (const state of states) {
      try {
        const concept = this.petToConcept(pet, state);
        const result = await this.pipeline.execute(concept, {
          enablePostProcessing: true,
          enableValidation: true,
          enableExport: false,
        });

        if (result.success && result.sprite) {
          const base64 = result.sprite.data.toString('base64');
          animationStates[state] = `data:image/png;base64,${base64}`;
        }
      } catch (error) {
        console.warn(`Failed to generate ${state} animation:`, error);
      }
    }

    return animationStates;
  }

  /**
   * Convert Pet entity to generation concept
   */
  private petToConcept(
    pet: PetLike,
    animationState?: 'idle' | 'attack' | 'hit' | 'ultimate' | 'death'
  ): string {
    const parts: string[] = [];

    // Style
    parts.push('pixel art');

    // Entity
    parts.push('pet');

    // Theme from visual tags
    if (pet.appearance.visualTags.length > 0) {
      parts.push(pet.appearance.visualTags.join(' '));
    }

    // Family
    parts.push(pet.family.toLowerCase().replace('_', ' '));

    // Animation state
    if (animationState) {
      parts.push(animationState);
      if (animationState === 'idle') {
        parts.push('animation');
      }
    }

    // Perspective
    parts.push('side view');

    return parts.join(' ');
  }
}

