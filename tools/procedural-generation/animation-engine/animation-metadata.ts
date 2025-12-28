/**
 * Animation Metadata Generator - Generate JSON metadata for animations
 *
 * Purpose: Create metadata describing animation structure and timing
 * Authority: Tier 2 (Mandatory for animation generation)
 * Use: Animation playback, sprite sheet interpretation
 */

import { SpriteSheetMetadata, FrameMetadata } from './sprite-sheet-builder';

export interface AnimationMetadata {
  name: string;
  version: string;
  spriteSheet: SpriteSheetReference;
  animations: AnimationDefinition[];
  tags?: Record<string, any>;
}

export interface SpriteSheetReference {
  file: string;
  width: number;
  height: number;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
}

export interface AnimationDefinition {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
  speed?: number; // Frames per second (default: 10)
  tags?: string[];
}

export interface AnimationFrame {
  index: number; // Frame index in sprite sheet
  duration?: number; // Frame duration in ms (overrides speed)
  x: number; // Position in sprite sheet
  y: number; // Position in sprite sheet
  width: number;
  height: number;
}

/**
 * Generate animation metadata from sprite sheet metadata
 */
export function generateAnimationMetadata(
  name: string,
  spriteSheetFile: string,
  sheetMetadata: SpriteSheetMetadata,
  animations: Omit<AnimationDefinition, 'frames'>[] = []
): AnimationMetadata {
  // Build sprite sheet reference
  const spriteSheet: SpriteSheetReference = {
    file: spriteSheetFile,
    width: sheetMetadata.totalWidth,
    height: sheetMetadata.totalHeight,
    frameWidth: sheetMetadata.frameWidth,
    frameHeight: sheetMetadata.frameHeight,
    columns: sheetMetadata.columns,
    rows: sheetMetadata.rows
  };

  // Build animation definitions
  const animationDefs: AnimationDefinition[] = [];

  if (animations.length === 0) {
    // Default: single animation using all frames
    animationDefs.push({
      name: 'default',
      frames: sheetMetadata.frames.map(frameMeta => frameMetadataToAnimationFrame(frameMeta)),
      loop: true,
      speed: 10
    });
  } else {
    // Use provided animations, filling in frame data
    for (const anim of animations) {
      animationDefs.push({
        ...anim,
        frames: [] // Will be populated separately
      });
    }
  }

  return {
    name,
    version: '1.0',
    spriteSheet,
    animations: animationDefs,
    tags: {
      generator: 'procedural-animation-engine',
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Convert frame metadata to animation frame
 */
function frameMetadataToAnimationFrame(frameMeta: FrameMetadata): AnimationFrame {
  return {
    index: frameMeta.index,
    duration: frameMeta.duration,
    x: frameMeta.x,
    y: frameMeta.y,
    width: frameMeta.width,
    height: frameMeta.height
  };
}

/**
 * Create walk cycle animation definition
 */
export function createWalkCycleAnimation(
  startFrameIndex: number,
  frameCount: number = 4,
  speed: number = 8,
  sheetMetadata: SpriteSheetMetadata
): AnimationDefinition {
  const frames: AnimationFrame[] = [];

  for (let i = 0; i < frameCount; i++) {
    const frameIndex = startFrameIndex + i;
    const frameMeta = sheetMetadata.frames[frameIndex];

    if (frameMeta) {
      frames.push(frameMetadataToAnimationFrame(frameMeta));
    }
  }

  return {
    name: 'walk',
    frames,
    loop: true,
    speed,
    tags: ['movement', 'walk']
  };
}

/**
 * Create idle animation definition
 */
export function createIdleAnimation(
  startFrameIndex: number,
  frameCount: number = 6,
  speed: number = 4,
  sheetMetadata: SpriteSheetMetadata
): AnimationDefinition {
  const frames: AnimationFrame[] = [];

  for (let i = 0; i < frameCount; i++) {
    const frameIndex = startFrameIndex + i;
    const frameMeta = sheetMetadata.frames[frameIndex];

    if (frameMeta) {
      frames.push(frameMetadataToAnimationFrame(frameMeta));
    }
  }

  return {
    name: 'idle',
    frames,
    loop: true,
    speed,
    tags: ['idle', 'default']
  };
}

/**
 * Create attack animation definition
 */
export function createAttackAnimation(
  startFrameIndex: number,
  frameCount: number = 4,
  speed: number = 12,
  sheetMetadata: SpriteSheetMetadata
): AnimationDefinition {
  const frames: AnimationFrame[] = [];

  for (let i = 0; i < frameCount; i++) {
    const frameIndex = startFrameIndex + i;
    const frameMeta = sheetMetadata.frames[frameIndex];

    if (frameMeta) {
      frames.push(frameMetadataToAnimationFrame(frameMeta));
    }
  }

  return {
    name: 'attack',
    frames,
    loop: false, // Attack typically doesn't loop
    speed,
    tags: ['combat', 'attack']
  };
}

/**
 * Create complete character animation set
 */
export function createCharacterAnimationSet(
  sheetMetadata: SpriteSheetMetadata,
  layout: {
    idle: { start: number; count: number };
    walk: { start: number; count: number };
    attack?: { start: number; count: number };
    jump?: { start: number; count: number };
    hurt?: { start: number; count: number };
    death?: { start: number; count: number };
  }
): AnimationDefinition[] {
  const animations: AnimationDefinition[] = [];

  // Idle
  animations.push(createIdleAnimation(layout.idle.start, layout.idle.count, 4, sheetMetadata));

  // Walk
  animations.push(createWalkCycleAnimation(layout.walk.start, layout.walk.count, 8, sheetMetadata));

  // Attack (optional)
  if (layout.attack) {
    animations.push(createAttackAnimation(layout.attack.start, layout.attack.count, 12, sheetMetadata));
  }

  // Jump (optional)
  if (layout.jump) {
    animations.push({
      name: 'jump',
      frames: createFrameSequence(layout.jump.start, layout.jump.count, sheetMetadata),
      loop: false,
      speed: 10,
      tags: ['movement', 'jump']
    });
  }

  // Hurt (optional)
  if (layout.hurt) {
    animations.push({
      name: 'hurt',
      frames: createFrameSequence(layout.hurt.start, layout.hurt.count, sheetMetadata),
      loop: false,
      speed: 8,
      tags: ['combat', 'hurt']
    });
  }

  // Death (optional)
  if (layout.death) {
    animations.push({
      name: 'death',
      frames: createFrameSequence(layout.death.start, layout.death.count, sheetMetadata),
      loop: false,
      speed: 6,
      tags: ['combat', 'death']
    });
  }

  return animations;
}

/**
 * Helper: Create frame sequence
 */
function createFrameSequence(
  startIndex: number,
  count: number,
  sheetMetadata: SpriteSheetMetadata
): AnimationFrame[] {
  const frames: AnimationFrame[] = [];

  for (let i = 0; i < count; i++) {
    const frameIndex = startIndex + i;
    const frameMeta = sheetMetadata.frames[frameIndex];

    if (frameMeta) {
      frames.push(frameMetadataToAnimationFrame(frameMeta));
    }
  }

  return frames;
}

/**
 * Export metadata to JSON string
 */
export function exportMetadataToJSON(metadata: AnimationMetadata, pretty: boolean = true): string {
  return JSON.stringify(metadata, null, pretty ? 2 : 0);
}

/**
 * Import metadata from JSON string
 */
export function importMetadataFromJSON(json: string): AnimationMetadata {
  return JSON.parse(json);
}

/**
 * Validate animation metadata
 */
export function validateMetadata(metadata: AnimationMetadata): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (!metadata.name) errors.push('Missing name');
  if (!metadata.version) errors.push('Missing version');
  if (!metadata.spriteSheet) errors.push('Missing spriteSheet');
  if (!metadata.animations || metadata.animations.length === 0) {
    errors.push('Missing animations');
  }

  // Validate sprite sheet reference
  if (metadata.spriteSheet) {
    if (!metadata.spriteSheet.file) errors.push('Missing spriteSheet.file');
    if (metadata.spriteSheet.frameWidth <= 0) errors.push('Invalid spriteSheet.frameWidth');
    if (metadata.spriteSheet.frameHeight <= 0) errors.push('Invalid spriteSheet.frameHeight');
  }

  // Validate animations
  if (metadata.animations) {
    for (let i = 0; i < metadata.animations.length; i++) {
      const anim = metadata.animations[i];
      if (!anim.name) errors.push(`Animation ${i}: Missing name`);
      if (!anim.frames || anim.frames.length === 0) {
        errors.push(`Animation ${anim.name || i}: No frames`);
      }
      if (typeof anim.loop !== 'boolean') {
        errors.push(`Animation ${anim.name || i}: Missing loop property`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculate total animation duration in milliseconds
 */
export function calculateAnimationDuration(animation: AnimationDefinition): number {
  let totalDuration = 0;

  const defaultFrameDuration = animation.speed ? 1000 / animation.speed : 100;

  for (const frame of animation.frames) {
    totalDuration += frame.duration || defaultFrameDuration;
  }

  return totalDuration;
}

/**
 * Get frame at specific time in animation
 */
export function getFrameAtTime(animation: AnimationDefinition, timeMs: number, loop: boolean = true): AnimationFrame | null {
  if (animation.frames.length === 0) return null;

  const totalDuration = calculateAnimationDuration(animation);

  // Handle looping
  let effectiveTime = timeMs;
  if (loop) {
    effectiveTime = timeMs % totalDuration;
  } else if (timeMs >= totalDuration) {
    // Return last frame if not looping and past end
    return animation.frames[animation.frames.length - 1];
  }

  // Find frame at time
  let accumulatedTime = 0;
  const defaultFrameDuration = animation.speed ? 1000 / animation.speed : 100;

  for (const frame of animation.frames) {
    const frameDuration = frame.duration || defaultFrameDuration;
    accumulatedTime += frameDuration;

    if (effectiveTime < accumulatedTime) {
      return frame;
    }
  }

  return animation.frames[animation.frames.length - 1];
}
