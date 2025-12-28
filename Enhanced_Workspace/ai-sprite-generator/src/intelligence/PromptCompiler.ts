/**
 * Prompt Compiler
 * 
 * Compiles structured generation parameters into optimized prompts for AI models.
 */

import type { GenerationParams, CompiledPrompt } from '../types/index.js';
import { StyleAnalyzer } from './StyleAnalyzer.js';

/**
 * Prompt Compiler
 * 
 * Transforms structured parameters into optimized AI prompts.
 */
export class PromptCompiler {
  private styleAnalyzer: StyleAnalyzer;

  constructor() {
    this.styleAnalyzer = new StyleAnalyzer();
  }

  /**
   * Compile generation parameters into optimized prompt
   */
  compile(params: GenerationParams): CompiledPrompt {
    const modelConfig = this.styleAnalyzer.analyzeStyle(params);
    
    // Build positive prompt
    const positivePrompt = this.buildPositivePrompt(params, modelConfig);
    
    // Build negative prompt
    const negativePrompt = this.buildNegativePrompt(params);
    
    return {
      positivePrompt,
      negativePrompt,
      model: modelConfig.name,
      lora: modelConfig.lora,
      loraWeight: modelConfig.loraWeight,
      steps: modelConfig.steps,
      cfgScale: modelConfig.cfgScale,
    };
  }

  /**
   * Build positive prompt from parameters
   */
  private buildPositivePrompt(
    params: GenerationParams,
    _modelConfig: ReturnType<StyleAnalyzer['analyzeStyle']>
  ): string {
    const parts: string[] = [];
    
    // Style qualifiers
    parts.push(this.getStyleQualifier(params.style));
    
    // Entity description
    parts.push(this.getEntityDescription(params.entity, params.theme));
    
    // Perspective
    parts.push(this.getPerspectiveDescription(params.perspective));
    
    // Action/pose
    if (params.action) {
      parts.push(this.getActionDescription(params.action));
    }
    
    // Animation context
    if (params.frameCount && params.frameCount > 1) {
      parts.push(`frame ${params.frameCount > 1 ? 'sequence' : ''} of ${params.frameCount} frames`);
      if (params.loopable) {
        parts.push('loopable animation');
      }
    }
    
    // Technical requirements
    parts.push(`${params.resolution[0]}x${params.resolution[1]} pixels`);
    parts.push('transparent background');
    parts.push('game sprite');
    parts.push('clean silhouette');
    parts.push('no background');
    parts.push('centered');
    parts.push('high quality');
    
    return parts.join(', ');
  }

  /**
   * Build negative prompt
   */
  private buildNegativePrompt(params: GenerationParams): string {
    const parts: string[] = [
      'blurry',
      'low quality',
      'distorted',
      'deformed',
      'ugly',
      'bad anatomy',
      'extra limbs',
      'duplicate',
      'text',
      'watermark',
      'signature',
      'background',
      'solid background',
      'colored background',
    ];
    
    // Style-specific negatives
    if (params.style.startsWith('pixel-art')) {
      parts.push('smooth gradients');
      parts.push('anti-aliased');
      parts.push('blended colors');
    }
    
    return parts.join(', ');
  }

  /**
   * Get style qualifier for prompt
   */
  private getStyleQualifier(style: string): string {
    const qualifiers: Record<string, string> = {
      'pixel-art': 'pixel art, 8-bit style, retro game sprite',
      'pixel-art-8bit': 'pixel art, 8-bit style, retro game sprite, low resolution',
      'pixel-art-16bit': 'pixel art, 16-bit style, retro game sprite, medium resolution',
      'pixel-art-hd': 'pixel art, high definition pixel art, modern pixel art',
      'cartoon': 'cartoon style, hand-drawn cartoon, animated style',
      'hand-drawn': 'hand-drawn, sketch style, line art',
      'painterly': 'painterly style, artistic painting, brush strokes',
      'fantasy': 'fantasy art style, magical, mystical',
      'isometric': 'isometric view, isometric art, 3D isometric',
      'pseudo-3d': '3D rendered, pseudo-3D, depth, shading',
    };
    
    return qualifiers[style] || 'pixel art';
  }

  /**
   * Get entity description
   */
  private getEntityDescription(entity: string, theme?: string): string {
    const entityNames: Record<string, string> = {
      'character': 'character',
      'enemy': 'enemy character',
      'pet': 'pet creature',
      'monster': 'monster',
      'npc': 'NPC character',
      'boss': 'boss character',
      'item': 'item',
      'equipment': 'equipment item',
      'tile': 'tile',
      'ui': 'UI element',
      'icon': 'icon',
      'effect': 'visual effect',
      'particle': 'particle effect',
    };
    
    let description = entityNames[entity] || 'character';
    
    if (theme) {
      description = `${theme} ${description}`;
    }
    
    return description;
  }

  /**
   * Get perspective description
   */
  private getPerspectiveDescription(perspective: string): string {
    const descriptions: Record<string, string> = {
      'side-view': 'side view, profile view',
      'top-down': 'top-down view, overhead view',
      'isometric': 'isometric view, isometric angle',
      'front-view': 'front view, facing forward',
      'back-view': 'back view, facing away',
      'diagonal': 'diagonal view, angled view',
    };
    
    return descriptions[perspective] || 'side view';
  }

  /**
   * Get action description
   */
  private getActionDescription(action: string): string {
    const descriptions: Record<string, string> = {
      'idle': 'idle pose, standing, breathing animation',
      'walk': 'walking animation, walking cycle',
      'run': 'running animation, running cycle',
      'attack': 'attack pose, attacking, combat stance',
      'cast': 'casting spell, magic casting, spell animation',
      'hit': 'hit reaction, taking damage, hurt',
      'death': 'death animation, dying, defeated',
      'jump': 'jumping, jump animation',
      'fall': 'falling, fall animation',
    };
    
    return descriptions[action] || action;
  }
}

