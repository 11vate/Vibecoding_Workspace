/**
 * Concept Interpreter
 * 
 * Transforms natural language descriptions into structured generation parameters.
 * This is the intelligence layer that understands game art requirements.
 */

import type { 
  EntityType, 
  VisualStyle, 
  Perspective, 
  AnimationAction, 
  GenerationParams,
  ConceptInterpretation 
} from '../types/index.js';

/**
 * Concept Interpreter
 * 
 * Parses user descriptions and extracts structured parameters for generation.
 */
export class ConceptInterpreter {
  private entityKeywords: Map<string, EntityType> = new Map([
    ['character', 'character'],
    ['hero', 'character'],
    ['player', 'character'],
    ['enemy', 'enemy'],
    ['monster', 'monster'],
    ['pet', 'pet'],
    ['creature', 'pet'],
    ['npc', 'npc'],
    ['boss', 'boss'],
    ['item', 'item'],
    ['equipment', 'equipment'],
    ['tile', 'tile'],
    ['ui', 'ui'],
    ['icon', 'ui'],
    ['effect', 'effect'],
    ['particle', 'particle'],
  ]);

  private styleKeywords: Map<string, VisualStyle> = new Map([
    ['pixel art', 'pixel-art'],
    ['pixel', 'pixel-art'],
    ['8-bit', 'pixel-art-8bit'],
    ['8bit', 'pixel-art-8bit'],
    ['16-bit', 'pixel-art-16bit'],
    ['16bit', 'pixel-art-16bit'],
    ['hd pixel', 'pixel-art-hd'],
    ['cartoon', 'cartoon'],
    ['hand drawn', 'hand-drawn'],
    ['hand-drawn', 'hand-drawn'],
    ['painterly', 'painterly'],
    ['fantasy', 'fantasy'],
    ['isometric', 'isometric'],
    ['iso', 'isometric'],
    ['3d', 'pseudo-3d'],
    ['3-d', 'pseudo-3d'],
  ]);

  private perspectiveKeywords: Map<string, Perspective> = new Map([
    ['side', 'side-view'],
    ['side view', 'side-view'],
    ['side-view', 'side-view'],
    ['profile', 'side-view'],
    ['top', 'top-down'],
    ['top down', 'top-down'],
    ['top-down', 'top-down'],
    ['overhead', 'top-down'],
    ['isometric', 'isometric'],
    ['iso', 'isometric'],
    ['front', 'front-view'],
    ['front view', 'front-view'],
    ['back', 'back-view'],
    ['back view', 'back-view'],
    ['diagonal', 'diagonal'],
  ]);

  private actionKeywords: Map<string, AnimationAction> = new Map([
    ['idle', 'idle'],
    ['standing', 'idle'],
    ['breathing', 'idle'],
    ['walk', 'walk'],
    ['walking', 'walk'],
    ['run', 'run'],
    ['running', 'run'],
    ['attack', 'attack'],
    ['attacking', 'attack'],
    ['cast', 'cast'],
    ['casting', 'cast'],
    ['spell', 'cast'],
    ['hit', 'hit'],
    ['hurt', 'hit'],
    ['damage', 'hit'],
    ['death', 'death'],
    ['dying', 'death'],
    ['dead', 'death'],
    ['jump', 'jump'],
    ['jumping', 'jump'],
    ['fall', 'fall'],
    ['falling', 'fall'],
  ]);

  /**
   * Interpret a natural language concept into structured parameters
   */
  interpret(concept: string): ConceptInterpretation {
    const lowerConcept = concept.toLowerCase();
    const reasoning: string[] = [];
    
    // Extract entity type
    const entity = this.extractEntity(lowerConcept, reasoning);
    
    // Extract visual style
    const style = this.extractStyle(lowerConcept, reasoning);
    
    // Extract perspective
    const perspective = this.extractPerspective(lowerConcept, reasoning);
    
    // Extract animation action
    const action = this.extractAction(lowerConcept, reasoning);
    
    // Extract theme/description
    const theme = this.extractTheme(lowerConcept, entity, action, reasoning);
    
    // Determine frame count for animations
    const frameCount = this.determineFrameCount(action, lowerConcept, reasoning);
    
    // Determine resolution based on style and entity
    const resolution = this.determineResolution(style, entity, reasoning);
    
    // Determine if loopable
    const loopable = this.determineLoopable(action, reasoning);
    
    // Determine post-processing requirements
    const postProcessing = this.determinePostProcessing(style, entity, reasoning);
    
    // Build parameters
    const params: GenerationParams = {
      entity,
      style,
      theme,
      action,
      frameCount,
      perspective,
      resolution,
      loopable,
      postProcessing,
    };
    
    // Calculate confidence based on how many parameters we successfully extracted
    const confidence = this.calculateConfidence(params, reasoning);
    
    return {
      params,
      confidence,
      reasoning,
    };
  }

  /**
   * Extract entity type from concept
   */
  private extractEntity(concept: string, reasoning: string[]): EntityType {
    for (const [keyword, entityType] of this.entityKeywords.entries()) {
      if (concept.includes(keyword)) {
        reasoning.push(`Detected entity type: ${entityType} (from keyword: ${keyword})`);
        return entityType;
      }
    }
    
    // Default to character if no entity detected
    reasoning.push('No entity type detected, defaulting to character');
    return 'character';
  }

  /**
   * Extract visual style from concept
   */
  private extractStyle(concept: string, reasoning: string[]): VisualStyle {
    for (const [keyword, style] of this.styleKeywords.entries()) {
      if (concept.includes(keyword)) {
        reasoning.push(`Detected style: ${style} (from keyword: ${keyword})`);
        return style;
      }
    }
    
    // Default to pixel-art if no style detected
    reasoning.push('No style detected, defaulting to pixel-art');
    return 'pixel-art';
  }

  /**
   * Extract perspective from concept
   */
  private extractPerspective(concept: string, reasoning: string[]): Perspective {
    for (const [keyword, perspective] of this.perspectiveKeywords.entries()) {
      if (concept.includes(keyword)) {
        reasoning.push(`Detected perspective: ${perspective} (from keyword: ${keyword})`);
        return perspective;
      }
    }
    
    // Default to side-view for characters/pets, top-down for others
    reasoning.push('No perspective detected, defaulting to side-view');
    return 'side-view';
  }

  /**
   * Extract animation action from concept
   */
  private extractAction(concept: string, reasoning: string[]): AnimationAction | undefined {
    for (const [keyword, action] of this.actionKeywords.entries()) {
      if (concept.includes(keyword)) {
        reasoning.push(`Detected action: ${action} (from keyword: ${keyword})`);
        return action;
      }
    }
    
    // Check for animation keywords
    if (concept.includes('animation') || concept.includes('animate')) {
      reasoning.push('Animation detected but no specific action, defaulting to idle');
      return 'idle';
    }
    
    return undefined;
  }

  /**
   * Extract theme/description from concept
   */
  private extractTheme(
    concept: string, 
    _entity: EntityType,
    action: AnimationAction | undefined,
    reasoning: string[]
  ): string | undefined {
    // Remove known keywords to extract theme
    let theme = concept;
    
    // Remove entity keywords
    for (const keyword of this.entityKeywords.keys()) {
      theme = theme.replace(new RegExp(keyword, 'gi'), '');
    }
    
    // Remove style keywords
    for (const keyword of this.styleKeywords.keys()) {
      theme = theme.replace(new RegExp(keyword, 'gi'), '');
    }
    
    // Remove perspective keywords
    for (const keyword of this.perspectiveKeywords.keys()) {
      theme = theme.replace(new RegExp(keyword, 'gi'), '');
    }
    
    // Remove action keywords
    if (action) {
      for (const keyword of this.actionKeywords.keys()) {
        theme = theme.replace(new RegExp(keyword, 'gi'), '');
      }
    }
    
    // Remove common words
    theme = theme
      .replace(/\b(animation|sprite|character|view|art)\b/gi, '')
      .trim();
    
    if (theme.length > 0) {
      reasoning.push(`Extracted theme: ${theme}`);
      return theme;
    }
    
    return undefined;
  }

  /**
   * Determine frame count for animations
   */
  private determineFrameCount(
    action: AnimationAction | undefined,
    concept: string,
    reasoning: string[]
  ): number | undefined {
    if (!action) {
      return undefined;
    }
    
    // Extract explicit frame count
    const frameMatch = concept.match(/(\d+)\s*frames?/i);
    if (frameMatch) {
      const count = parseInt(frameMatch[1], 10);
      reasoning.push(`Explicit frame count: ${count}`);
      return count;
    }
    
    // Default frame counts by action
    const defaultFrames: Record<AnimationAction, number> = {
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
    
    const count = defaultFrames[action];
    reasoning.push(`Default frame count for ${action}: ${count}`);
    return count;
  }

  /**
   * Determine resolution based on style and entity
   */
  private determineResolution(
    style: VisualStyle,
    entity: EntityType,
    reasoning: string[]
  ): [number, number] {
    // Pixel art resolutions
    if (style.startsWith('pixel-art')) {
      if (style === 'pixel-art-8bit') {
        reasoning.push('8-bit pixel art: using 32x32 resolution');
        return [32, 32];
      } else if (style === 'pixel-art-16bit') {
        reasoning.push('16-bit pixel art: using 64x64 resolution');
        return [64, 64];
      } else if (style === 'pixel-art-hd') {
        reasoning.push('HD pixel art: using 128x128 resolution');
        return [128, 128];
      } else {
        reasoning.push('Standard pixel art: using 64x64 resolution');
        return [64, 64];
      }
    }
    
    // Other styles
    if (entity === 'ui' || entity === 'item' || entity === 'equipment') {
      reasoning.push('UI/Item: using 32x32 resolution');
      return [32, 32];
    }
    
    reasoning.push('Default resolution: 128x128');
    return [128, 128];
  }

  /**
   * Determine if animation should be loopable
   */
  private determineLoopable(
    action: AnimationAction | undefined,
    reasoning: string[]
  ): boolean {
    if (!action) {
      return false;
    }
    
    const loopableActions: AnimationAction[] = ['idle', 'walk', 'run'];
    const loopable = loopableActions.includes(action);
    
    reasoning.push(`${action} is ${loopable ? 'loopable' : 'not loopable'}`);
    return loopable;
  }

  /**
   * Determine post-processing requirements
   */
  private determinePostProcessing(
    style: VisualStyle,
    _entity: EntityType,
    reasoning: string[]
  ): string[] {
    const processing: string[] = [];
    
    // Always remove background
    processing.push('background-removal');
    reasoning.push('Background removal required for game-ready assets');
    
    // Normalize size
    processing.push('normalize');
    reasoning.push('Size normalization required for consistent sprites');
    
    // Extract palette for pixel art
    if (style.startsWith('pixel-art')) {
      processing.push('palette-extract');
      reasoning.push('Palette extraction required for pixel art');
    }
    
    // Validate quality
    processing.push('validate');
    reasoning.push('Quality validation required');
    
    return processing;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    params: GenerationParams,
    reasoning: string[]
  ): number {
    let score = 0;
    let maxScore = 0;
    
    // Entity (required)
    maxScore += 1;
    if (reasoning.some(r => r.includes('Detected entity'))) {
      score += 1;
    } else if (params.entity === 'character') {
      score += 0.5; // Partial credit for default
    }
    
    // Style (required)
    maxScore += 1;
    if (params.style !== 'pixel-art' || reasoning.some(r => r.includes('Detected style'))) {
      score += 1;
    }
    
    // Perspective (required)
    maxScore += 1;
    if (reasoning.some(r => r.includes('Detected perspective'))) {
      score += 1;
    } else {
      score += 0.5; // Partial credit for default
    }
    
    // Theme (optional but good)
    maxScore += 1;
    if (params.theme) {
      score += 1;
    }
    
    // Action (optional)
    maxScore += 1;
    if (params.action) {
      score += 1;
    }
    
    return Math.min(1, score / maxScore);
  }
}

