/**
 * Animation Reasoner
 * 
 * Understands animation requirements and ensures pose continuity.
 */

import type { AnimationAction, GenerationParams } from '../types/index.js';

/**
 * Animation reasoning result
 */
export interface AnimationReasoning {
  frameCount: number;
  loopable: boolean;
  poseContinuity: boolean;
  timing: number; // frames per second
  reasoning: string[];
}

/**
 * Animation Reasoner
 * 
 * Reasons about animation requirements.
 */
export class AnimationReasoner {
  /**
   * Reason about animation requirements
   */
  reason(params: GenerationParams): AnimationReasoning {
    const reasoning: string[] = [];
    
    if (!params.action) {
      return {
        frameCount: 1,
        loopable: false,
        poseContinuity: false,
        timing: 0,
        reasoning: ['No animation action specified'],
      };
    }

    // Determine frame count
    const frameCount = params.frameCount || this.getDefaultFrameCount(params.action, reasoning);
    
    // Determine if loopable
    const loopable = params.loopable ?? this.isLoopableAction(params.action, reasoning);
    
    // Determine pose continuity requirement
    const poseContinuity = this.requiresPoseContinuity(params.action, reasoning);
    
    // Determine timing
    const timing = this.getTiming(params.action, reasoning);

    return {
      frameCount,
      loopable,
      poseContinuity,
      timing,
      reasoning,
    };
  }

  /**
   * Get default frame count for action
   */
  private getDefaultFrameCount(
    action: AnimationAction,
    reasoning: string[]
  ): number {
    const defaults: Record<AnimationAction, number> = {
      idle: 8,
      walk: 6,
      run: 8,
      attack: 4,
      cast: 6,
      hit: 3,
      death: 5,
      jump: 6,
      fall: 4,
    };

    const count = defaults[action];
    reasoning.push(`Default frame count for ${action}: ${count}`);
    return count;
  }

  /**
   * Check if action is loopable
   */
  private isLoopableAction(
    action: AnimationAction,
    reasoning: string[]
  ): boolean {
    const loopableActions: AnimationAction[] = ['idle', 'walk', 'run'];
    const loopable = loopableActions.includes(action);
    
    reasoning.push(`${action} is ${loopable ? 'loopable' : 'not loopable'}`);
    return loopable;
  }

  /**
   * Check if action requires pose continuity
   */
  private requiresPoseContinuity(
    action: AnimationAction,
    reasoning: string[]
  ): boolean {
    const continuityActions: AnimationAction[] = ['walk', 'run', 'attack', 'cast'];
    const requires = continuityActions.includes(action);
    
    reasoning.push(`${action} ${requires ? 'requires' : 'does not require'} pose continuity`);
    return requires;
  }

  /**
   * Get timing (frames per second) for action
   */
  private getTiming(
    action: AnimationAction,
    reasoning: string[]
  ): number {
    const timings: Record<AnimationAction, number> = {
      idle: 8, // Slow, subtle
      walk: 12, // Medium
      run: 15, // Fast
      attack: 10, // Medium-fast
      cast: 8, // Slow
      hit: 12, // Fast
      death: 8, // Slow
      jump: 12, // Medium
      fall: 10, // Medium
    };

    const timing = timings[action];
    reasoning.push(`Frame rate for ${action}: ${timing} fps`);
    return timing;
  }
}







