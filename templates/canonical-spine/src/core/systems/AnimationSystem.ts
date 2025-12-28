/**
 * Animation System - Example System Implementation
 *
 * Purpose: Handle sprite animations
 * Priority: 50 (Mid-update cycle)
 */

import { BaseSystem } from './SystemManager';
import { store } from '../state/store';

export class AnimationSystem extends BaseSystem {
  private animations: Map<string, Animation> = new Map();

  constructor() {
    super('AnimationSystem', 50);
  }

  initialize(): void {
    console.log('[AnimationSystem] Initialized');
  }

  update(deltaTime: number): void {
    const state = store.getState();

    if (state.paused) {
      return;
    }

    // Update all active animations
    for (const [id, animation] of this.animations.entries()) {
      if (!animation.playing) {
        continue;
      }

      animation.currentTime += deltaTime;

      // Check if frame should advance
      if (animation.currentTime >= animation.frameDuration) {
        animation.currentTime -= animation.frameDuration;
        animation.currentFrame++;

        // Loop or stop animation
        if (animation.currentFrame >= animation.frameCount) {
          if (animation.loop) {
            animation.currentFrame = 0;
          } else {
            animation.currentFrame = animation.frameCount - 1;
            animation.playing = false;

            // Execute completion callback
            if (animation.onComplete) {
              animation.onComplete();
            }
          }
        }
      }
    }
  }

  cleanup(): void {
    this.animations.clear();
    console.log('[AnimationSystem] Cleaned up');
  }

  /**
   * Register new animation
   */
  registerAnimation(id: string, animation: Animation): void {
    this.animations.set(id, animation);
  }

  /**
   * Play animation
   */
  play(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.playing = true;
      animation.currentFrame = 0;
      animation.currentTime = 0;
    }
  }

  /**
   * Stop animation
   */
  stop(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.playing = false;
    }
  }

  /**
   * Get animation
   */
  getAnimation(id: string): Animation | undefined {
    return this.animations.get(id);
  }
}

export interface Animation {
  frameCount: number;
  frameDuration: number; // seconds
  currentFrame: number;
  currentTime: number;
  loop: boolean;
  playing: boolean;
  onComplete?: () => void;
}
