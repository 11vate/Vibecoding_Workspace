/**
 * Frame Interpolator - Generate between-frames for smooth animation
 *
 * Purpose: Create intermediate frames to smooth animations
 * Authority: Tier 2 (Mandatory for animation generation)
 * Use: Character movement, UI transitions, effects
 */

import { createCanvas, Image } from 'canvas';

export interface InterpolationConfig {
  startFrame: Buffer; // Starting frame PNG
  endFrame: Buffer; // Ending frame PNG
  steps: number; // Number of intermediate frames to generate
  method?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'; // Default: linear
  frameWidth: number;
  frameHeight: number;
}

export type EasingFunction = (t: number) => number;

/**
 * Generate interpolated frames between two frames
 */
export async function interpolateFrames(config: InterpolationConfig): Promise<Buffer[]> {
  const { startFrame, endFrame, steps, method = 'linear', frameWidth, frameHeight } = config;

  if (steps < 1) {
    return [];
  }

  // Load start and end images
  const startImg = new Image();
  startImg.src = startFrame;

  const endImg = new Image();
  endImg.src = endFrame;

  // Get pixel data
  const startCanvas = createCanvas(frameWidth, frameHeight);
  const startCtx = startCanvas.getContext('2d');
  startCtx.drawImage(startImg, 0, 0, frameWidth, frameHeight);
  const startData = startCtx.getImageData(0, 0, frameWidth, frameHeight);

  const endCanvas = createCanvas(frameWidth, frameHeight);
  const endCtx = endCanvas.getContext('2d');
  endCtx.drawImage(endImg, 0, 0, frameWidth, frameHeight);
  const endData = endCtx.getImageData(0, 0, frameWidth, frameHeight);

  // Get easing function
  const easingFn = getEasingFunction(method);

  // Generate intermediate frames
  const frames: Buffer[] = [];

  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1); // 0 to 1 (exclusive of endpoints)
    const easedT = easingFn(t);

    const interpolatedFrame = interpolatePixelData(startData, endData, easedT, frameWidth, frameHeight);
    frames.push(interpolatedFrame);
  }

  return frames;
}

/**
 * Interpolate pixel data between two ImageData objects
 */
function interpolatePixelData(
  start: ImageData,
  end: ImageData,
  t: number,
  width: number,
  height: number
): Buffer {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const interpolated = ctx.createImageData(width, height);

  for (let i = 0; i < start.data.length; i += 4) {
    // Interpolate RGBA channels
    interpolated.data[i] = Math.round(start.data[i] * (1 - t) + end.data[i] * t); // R
    interpolated.data[i + 1] = Math.round(start.data[i + 1] * (1 - t) + end.data[i + 1] * t); // G
    interpolated.data[i + 2] = Math.round(start.data[i + 2] * (1 - t) + end.data[i + 2] * t); // B
    interpolated.data[i + 3] = Math.round(start.data[i + 3] * (1 - t) + end.data[i + 3] * t); // A
  }

  ctx.putImageData(interpolated, 0, 0);
  return canvas.toBuffer('image/png');
}

/**
 * Get easing function by method name
 */
function getEasingFunction(method: string): EasingFunction {
  switch (method) {
    case 'ease-in':
      return easeIn;
    case 'ease-out':
      return easeOut;
    case 'ease-in-out':
      return easeInOut;
    case 'linear':
    default:
      return linear;
  }
}

// Easing functions

function linear(t: number): number {
  return t;
}

function easeIn(t: number): number {
  return t * t;
}

function easeOut(t: number): number {
  return t * (2 - t);
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Generate a complete animation sequence with interpolation
 */
export async function generateAnimationSequence(
  keyframes: Buffer[],
  frameWidth: number,
  frameHeight: number,
  stepsPerTransition: number = 2,
  method: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' = 'linear'
): Promise<Buffer[]> {
  if (keyframes.length < 2) {
    return keyframes;
  }

  const allFrames: Buffer[] = [];

  for (let i = 0; i < keyframes.length - 1; i++) {
    // Add keyframe
    allFrames.push(keyframes[i]);

    // Add interpolated frames
    const interpolated = await interpolateFrames({
      startFrame: keyframes[i],
      endFrame: keyframes[i + 1],
      steps: stepsPerTransition,
      method,
      frameWidth,
      frameHeight
    });

    allFrames.push(...interpolated);
  }

  // Add final keyframe
  allFrames.push(keyframes[keyframes.length - 1]);

  return allFrames;
}

/**
 * Generate walk cycle animation from single sprite
 * Uses mirroring and slight transformations
 */
export async function generateWalkCycle(
  baseSprite: Buffer,
  frameWidth: number,
  frameHeight: number,
  frames: number = 4
): Promise<Buffer[]> {
  const img = new Image();
  img.src = baseSprite;

  const walkFrames: Buffer[] = [];

  for (let i = 0; i < frames; i++) {
    const canvas = createCanvas(frameWidth, frameHeight);
    const ctx = canvas.getContext('2d');

    // Calculate animation phase
    const phase = (i / frames) * Math.PI * 2;

    // Apply slight vertical offset (bobbing)
    const bobOffset = Math.sin(phase) * 2;

    // Draw base sprite with transformation
    ctx.save();
    ctx.translate(0, bobOffset);
    ctx.drawImage(img, 0, 0, frameWidth, frameHeight);
    ctx.restore();

    walkFrames.push(canvas.toBuffer('image/png'));
  }

  return walkFrames;
}

/**
 * Generate idle animation from single sprite
 * Uses slight breathing/bobbing effect
 */
export async function generateIdleAnimation(
  baseSprite: Buffer,
  frameWidth: number,
  frameHeight: number,
  frames: number = 6,
  intensity: number = 1
): Promise<Buffer[]> {
  const img = new Image();
  img.src = baseSprite;

  const idleFrames: Buffer[] = [];

  for (let i = 0; i < frames; i++) {
    const canvas = createCanvas(frameWidth, frameHeight);
    const ctx = canvas.getContext('2d');

    // Calculate breathing phase
    const phase = (i / frames) * Math.PI * 2;
    const breathOffset = Math.sin(phase) * intensity;

    // Draw with slight scale variation
    ctx.save();
    ctx.translate(frameWidth / 2, frameHeight);
    ctx.scale(1, 1 + breathOffset * 0.02);
    ctx.translate(-frameWidth / 2, -frameHeight);
    ctx.drawImage(img, 0, 0, frameWidth, frameHeight);
    ctx.restore();

    idleFrames.push(canvas.toBuffer('image/png'));
  }

  return idleFrames;
}

/**
 * Generate rotation animation
 */
export async function generateRotationAnimation(
  baseSprite: Buffer,
  frameWidth: number,
  frameHeight: number,
  frames: number = 8,
  degrees: number = 360
): Promise<Buffer[]> {
  const img = new Image();
  img.src = baseSprite;

  const rotationFrames: Buffer[] = [];

  for (let i = 0; i < frames; i++) {
    const canvas = createCanvas(frameWidth, frameHeight);
    const ctx = canvas.getContext('2d');

    // Calculate rotation angle
    const angle = (i / frames) * degrees * (Math.PI / 180);

    // Rotate around center
    ctx.save();
    ctx.translate(frameWidth / 2, frameHeight / 2);
    ctx.rotate(angle);
    ctx.translate(-frameWidth / 2, -frameHeight / 2);
    ctx.drawImage(img, 0, 0, frameWidth, frameHeight);
    ctx.restore();

    rotationFrames.push(canvas.toBuffer('image/png'));
  }

  return rotationFrames;
}

/**
 * Generate fade animation
 */
export async function generateFadeAnimation(
  baseSprite: Buffer,
  frameWidth: number,
  frameHeight: number,
  frames: number = 10,
  fadeIn: boolean = true
): Promise<Buffer[]> {
  const img = new Image();
  img.src = baseSprite;

  const fadeFrames: Buffer[] = [];

  for (let i = 0; i < frames; i++) {
    const canvas = createCanvas(frameWidth, frameHeight);
    const ctx = canvas.getContext('2d');

    // Calculate alpha
    const t = i / (frames - 1);
    const alpha = fadeIn ? t : 1 - t;

    // Draw with alpha
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, 0, 0, frameWidth, frameHeight);

    fadeFrames.push(canvas.toBuffer('image/png'));
  }

  return fadeFrames;
}
