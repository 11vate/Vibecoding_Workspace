/**
 * Sprite Sheet Builder - Pack animation frames into sprite sheets
 *
 * Purpose: Combine multiple frames into optimized sprite sheets
 * Authority: Tier 2 (Mandatory for animation generation)
 * Use: Character animations, UI animations, effects
 */

import { createCanvas, Canvas, Image } from 'canvas';

export interface Frame {
  image: Buffer; // PNG buffer
  duration?: number; // Frame duration in ms (optional)
  name?: string; // Frame name/label (optional)
}

export interface SpriteSheetConfig {
  frames: Frame[];
  frameWidth: number;
  frameHeight: number;
  layout?: 'horizontal' | 'vertical' | 'grid'; // Default: grid
  padding?: number; // Pixels between frames (default: 0)
  backgroundColor?: string; // Default: transparent
  maxWidth?: number; // Max sheet width (for grid layout)
  maxHeight?: number; // Max sheet height (for grid layout)
}

export interface SpriteSheetResult {
  image: Buffer; // Sprite sheet PNG
  metadata: SpriteSheetMetadata;
}

export interface SpriteSheetMetadata {
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  columns: number;
  rows: number;
  padding: number;
  totalWidth: number;
  totalHeight: number;
  frames: FrameMetadata[];
}

export interface FrameMetadata {
  index: number;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  duration?: number;
}

/**
 * Build sprite sheet from frames
 */
export async function buildSpriteSheet(config: SpriteSheetConfig): Promise<SpriteSheetResult> {
  const {
    frames,
    frameWidth,
    frameHeight,
    layout = 'grid',
    padding = 0,
    backgroundColor = 'transparent',
    maxWidth = 2048,
    maxHeight = 2048
  } = config;

  if (frames.length === 0) {
    throw new Error('Cannot build sprite sheet: no frames provided');
  }

  // Calculate layout dimensions
  const dimensions = calculateLayout(frames.length, frameWidth, frameHeight, layout, padding, maxWidth, maxHeight);

  // Create sprite sheet canvas
  const canvas = createCanvas(dimensions.totalWidth, dimensions.totalHeight);
  const ctx = canvas.getContext('2d');

  // Fill background if not transparent
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, dimensions.totalWidth, dimensions.totalHeight);
  }

  // Load and place each frame
  const frameMetadata: FrameMetadata[] = [];

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const position = calculateFramePosition(i, dimensions, frameWidth, frameHeight, padding);

    // Load frame image
    const img = new Image();
    img.src = frame.image;

    // Draw frame to sprite sheet
    ctx.drawImage(img, position.x, position.y, frameWidth, frameHeight);

    // Store metadata
    frameMetadata.push({
      index: i,
      name: frame.name,
      x: position.x,
      y: position.y,
      width: frameWidth,
      height: frameHeight,
      duration: frame.duration
    });
  }

  // Build metadata
  const metadata: SpriteSheetMetadata = {
    frameWidth,
    frameHeight,
    frameCount: frames.length,
    columns: dimensions.columns,
    rows: dimensions.rows,
    padding,
    totalWidth: dimensions.totalWidth,
    totalHeight: dimensions.totalHeight,
    frames: frameMetadata
  };

  return {
    image: canvas.toBuffer('image/png'),
    metadata
  };
}

/**
 * Calculate sprite sheet layout dimensions
 */
function calculateLayout(
  frameCount: number,
  frameWidth: number,
  frameHeight: number,
  layout: 'horizontal' | 'vertical' | 'grid',
  padding: number,
  maxWidth: number,
  maxHeight: number
): { columns: number; rows: number; totalWidth: number; totalHeight: number } {
  let columns: number;
  let rows: number;

  switch (layout) {
    case 'horizontal':
      columns = frameCount;
      rows = 1;
      break;

    case 'vertical':
      columns = 1;
      rows = frameCount;
      break;

    case 'grid':
    default:
      // Calculate optimal grid layout
      const maxColumns = Math.floor((maxWidth + padding) / (frameWidth + padding));
      const maxRows = Math.floor((maxHeight + padding) / (frameHeight + padding));

      // Try to make roughly square
      columns = Math.min(Math.ceil(Math.sqrt(frameCount)), maxColumns);
      rows = Math.ceil(frameCount / columns);

      // Adjust if exceeds max height
      while (rows > maxRows && columns < maxColumns) {
        columns++;
        rows = Math.ceil(frameCount / columns);
      }

      if (rows > maxRows) {
        throw new Error(`Cannot fit ${frameCount} frames in ${maxWidth}x${maxHeight} sheet`);
      }
      break;
  }

  const totalWidth = columns * frameWidth + (columns - 1) * padding;
  const totalHeight = rows * frameHeight + (rows - 1) * padding;

  return { columns, rows, totalWidth, totalHeight };
}

/**
 * Calculate position for a specific frame in the sheet
 */
function calculateFramePosition(
  index: number,
  dimensions: { columns: number; rows: number },
  frameWidth: number,
  frameHeight: number,
  padding: number
): { x: number; y: number } {
  const col = index % dimensions.columns;
  const row = Math.floor(index / dimensions.columns);

  const x = col * (frameWidth + padding);
  const y = row * (frameHeight + padding);

  return { x, y };
}

/**
 * Build horizontal sprite sheet (all frames in a row)
 */
export async function buildHorizontalSheet(
  frames: Frame[],
  frameWidth: number,
  frameHeight: number,
  padding: number = 0
): Promise<SpriteSheetResult> {
  return buildSpriteSheet({
    frames,
    frameWidth,
    frameHeight,
    layout: 'horizontal',
    padding
  });
}

/**
 * Build vertical sprite sheet (all frames in a column)
 */
export async function buildVerticalSheet(
  frames: Frame[],
  frameWidth: number,
  frameHeight: number,
  padding: number = 0
): Promise<SpriteSheetResult> {
  return buildSpriteSheet({
    frames,
    frameWidth,
    frameHeight,
    layout: 'vertical',
    padding
  });
}

/**
 * Build grid sprite sheet (optimal grid layout)
 */
export async function buildGridSheet(
  frames: Frame[],
  frameWidth: number,
  frameHeight: number,
  padding: number = 0,
  maxWidth: number = 2048
): Promise<SpriteSheetResult> {
  return buildSpriteSheet({
    frames,
    frameWidth,
    frameHeight,
    layout: 'grid',
    padding,
    maxWidth
  });
}

/**
 * Split a sprite sheet into individual frames
 */
export async function splitSpriteSheet(
  sheetBuffer: Buffer,
  metadata: SpriteSheetMetadata
): Promise<Buffer[]> {
  const img = new Image();
  img.src = sheetBuffer;

  const frames: Buffer[] = [];

  for (const frameMeta of metadata.frames) {
    const canvas = createCanvas(frameMeta.width, frameMeta.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      img,
      frameMeta.x,
      frameMeta.y,
      frameMeta.width,
      frameMeta.height,
      0,
      0,
      frameMeta.width,
      frameMeta.height
    );

    frames.push(canvas.toBuffer('image/png'));
  }

  return frames;
}

/**
 * Optimize sprite sheet by removing duplicate frames
 */
export async function optimizeSpriteSheet(config: SpriteSheetConfig): Promise<SpriteSheetResult> {
  const uniqueFrames: Frame[] = [];
  const frameHashes = new Map<string, number>();

  // Deduplicate frames by comparing buffer content
  for (const frame of config.frames) {
    const hash = frame.image.toString('base64').slice(0, 100); // Quick hash

    if (!frameHashes.has(hash)) {
      frameHashes.set(hash, uniqueFrames.length);
      uniqueFrames.push(frame);
    }
  }

  console.log(`Optimized: ${config.frames.length} frames → ${uniqueFrames.length} unique frames`);

  return buildSpriteSheet({
    ...config,
    frames: uniqueFrames
  });
}
