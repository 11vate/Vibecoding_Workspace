/**
 * Animator2D Client
 * 
 * Client for Animator2D model (HuggingFace: Loacky/Animator2D).
 * Generates pixel-art animations from text.
 */

import type { GeneratedSprite } from '../types/index.js';
import { AIGenerator } from './AIGenerator.js';

/**
 * Animator2D Client
 */
export class Animator2DClient {
  private baseUrl?: string;
  private available: boolean = false;
  private fallbackGenerator: AIGenerator;

  constructor(_baseUrl?: string) {
    this.fallbackGenerator = new AIGenerator();
    this.checkAvailability();
  }

  /**
   * Check if Animator2D is available
   */
  async checkAvailability(): Promise<boolean> {
    // Placeholder: Would check if Animator2D service is running
    // For now, assume not available and use fallback
    this.available = false;
    return false;
  }

  /**
   * Generate animation from text
   */
  async generateAnimation(
    _description: string,
    frames: number,
    _direction?: string
  ): Promise<GeneratedSprite[]> {
    if (!this.available) {
      // Fallback to frame-by-frame generation
      return this.fallbackGenerator.generateAnimation(
        {
          entity: 'character',
          style: 'pixel-art',
          perspective: 'side-view',
          resolution: [64, 64],
          frameCount: frames,
          postProcessing: ['background-removal', 'normalization'],
        },
        frames
      );
    }

    // Placeholder: Would call Animator2D API
    // const response = await fetch(`${this.baseUrl}/generate`, {
    //   method: 'POST',
    //   body: JSON.stringify({ description, frames, direction }),
    // });
    // return response.json();

    return this.fallbackGenerator.generateAnimation(
      {
        entity: 'character',
        style: 'pixel-art',
        perspective: 'side-view',
        resolution: [64, 64],
        frameCount: frames,
        postProcessing: ['background-removal', 'normalization'],
      },
      frames
    );
  }
}

