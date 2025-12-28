/**
 * Image Resizer - Intelligent image resizing
 *
 * Purpose: Resize images while maintaining quality
 * Authority: Tier 2 (Mandatory for asset optimization)
 * Use: Asset scaling, thumbnail generation
 */

import * as fs from 'fs';
import { createCanvas, Image } from 'canvas';

export interface ResizeOptions {
  width?: number;
  height?: number;
  maintainAspect?: boolean; // Default: true
  scaleMode?: 'fit' | 'fill' | 'stretch'; // Default: 'fit'
  algorithm?: 'nearest' | 'bilinear'; // Default: 'bilinear'
}

export interface ResizeResult {
  originalDimensions: { width: number; height: number };
  newDimensions: { width: number; height: number };
  outputPath: string;
}

/**
 * Resize image
 */
export async function resizeImage(
  inputPath: string,
  outputPath: string,
  options: ResizeOptions
): Promise<ResizeResult> {
  // Read original image
  const buffer = fs.readFileSync(inputPath);
  const img = new Image();
  img.src = buffer;

  const originalWidth = img.width;
  const originalHeight = img.height;

  // Calculate new dimensions
  const { width: newWidth, height: newHeight } = calculateDimensions(
    originalWidth,
    originalHeight,
    options
  );

  // Create canvas with new dimensions
  const canvas = createCanvas(newWidth, newHeight);
  const ctx = canvas.getContext('2d');

  // Set smoothing based on algorithm
  if (options.algorithm === 'nearest') {
    ctx.imageSmoothingEnabled = false;
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  // Handle scale modes
  let sx = 0, sy = 0, sw = originalWidth, sh = originalHeight;
  let dx = 0, dy = 0, dw = newWidth, dh = newHeight;

  if (options.scaleMode === 'fill') {
    // Fill: crop to fit, maintain aspect
    const scale = Math.max(newWidth / originalWidth, newHeight / originalHeight);
    sw = newWidth / scale;
    sh = newHeight / scale;
    sx = (originalWidth - sw) / 2;
    sy = (originalHeight - sh) / 2;
  } else if (options.scaleMode === 'fit') {
    // Fit: letterbox, maintain aspect
    const scale = Math.min(newWidth / originalWidth, newHeight / originalHeight);
    dw = originalWidth * scale;
    dh = originalHeight * scale;
    dx = (newWidth - dw) / 2;
    dy = (newHeight - dh) / 2;
  }
  // stretch: use calculated dimensions as-is

  // Draw resized image
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

  // Save
  const outputBuffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, outputBuffer);

  return {
    originalDimensions: { width: originalWidth, height: originalHeight },
    newDimensions: { width: newWidth, height: newHeight },
    outputPath
  };
}

/**
 * Calculate new dimensions based on options
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  options: ResizeOptions
): { width: number; height: number } {
  const { width, height, maintainAspect = true, scaleMode = 'fit' } = options;

  // If both dimensions specified and not maintaining aspect
  if (width && height && !maintainAspect) {
    return { width, height };
  }

  // If only width specified
  if (width && !height) {
    const scale = width / originalWidth;
    return {
      width,
      height: Math.round(originalHeight * scale)
    };
  }

  // If only height specified
  if (height && !width) {
    const scale = height / originalHeight;
    return {
      width: Math.round(originalWidth * scale),
      height
    };
  }

  // If both specified and maintaining aspect
  if (width && height) {
    if (scaleMode === 'fill') {
      // Scale to fill, crop excess
      return { width, height };
    } else {
      // Scale to fit, letterbox
      const widthScale = width / originalWidth;
      const heightScale = height / originalHeight;
      const scale = Math.min(widthScale, heightScale);

      return {
        width: Math.round(originalWidth * scale),
        height: Math.round(originalHeight * scale)
      };
    }
  }

  // No dimensions specified, return original
  return { width: originalWidth, height: originalHeight };
}

/**
 * Generate thumbnail
 */
export async function generateThumbnail(
  inputPath: string,
  outputPath: string,
  size: number = 128
): Promise<ResizeResult> {
  return resizeImage(inputPath, outputPath, {
    width: size,
    height: size,
    maintainAspect: true,
    scaleMode: 'fit'
  });
}

/**
 * Batch resize images
 */
export async function resizeImages(
  files: Array<{ input: string; output: string; options: ResizeOptions }>
): Promise<ResizeResult[]> {
  const results: ResizeResult[] = [];

  for (const file of files) {
    try {
      const result = await resizeImage(file.input, file.output, file.options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to resize ${file.input}:`, error);
    }
  }

  return results;
}

/**
 * Scale to power of 2 dimensions (common in game assets)
 */
export async function scaleToPowerOfTwo(
  inputPath: string,
  outputPath: string,
  maxSize: number = 1024
): Promise<ResizeResult> {
  // Read original dimensions
  const buffer = fs.readFileSync(inputPath);
  const img = new Image();
  img.src = buffer;

  const originalWidth = img.width;
  const originalHeight = img.height;

  // Find next power of 2
  const newWidth = nextPowerOfTwo(originalWidth, maxSize);
  const newHeight = nextPowerOfTwo(originalHeight, maxSize);

  return resizeImage(inputPath, outputPath, {
    width: newWidth,
    height: newHeight,
    maintainAspect: false, // Stretch to power-of-2 dimensions
    scaleMode: 'stretch'
  });
}

/**
 * Get next power of 2
 */
function nextPowerOfTwo(value: number, max: number): number {
  let power = 1;
  while (power < value && power < max) {
    power *= 2;
  }
  return Math.min(power, max);
}
