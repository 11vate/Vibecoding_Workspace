/**
 * PNG Compressor - Lossless PNG compression
 *
 * Purpose: Reduce PNG file sizes without quality loss
 * Authority: Tier 2 (Mandatory for asset optimization)
 * Use: Asset optimization, storage reduction
 */

import * as fs from 'fs';
import { createCanvas } from 'canvas';

export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  reduction: number; // Percentage
  savings: number; // Bytes saved
}

/**
 * Compress PNG file (simple optimization)
 */
export async function compressPNG(inputPath: string, outputPath?: string): Promise<CompressionResult> {
  const originalBuffer = fs.readFileSync(inputPath);
  const originalSize = originalBuffer.length;

  // Read PNG and re-encode
  // Note: In production, use a library like pngquant or optipng for better compression
  // This is a simplified version using canvas re-encoding
  const compressedBuffer = await reEncodePNG(originalBuffer);
  const compressedSize = compressedBuffer.length;

  // Save if output path specified
  if (outputPath) {
    fs.writeFileSync(outputPath, compressedBuffer);
  } else {
    // Overwrite original
    fs.writeFileSync(inputPath, compressedBuffer);
  }

  const savings = originalSize - compressedSize;
  const reduction = (savings / originalSize) * 100;

  return {
    originalSize,
    compressedSize,
    reduction,
    savings
  };
}

/**
 * Re-encode PNG through canvas (simple compression)
 */
async function reEncodePNG(buffer: Buffer): Promise<Buffer> {
  // This is a basic implementation
  // In production, use dedicated PNG optimization tools

  try {
    // Read dimensions
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);

    // Create canvas and load image
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Load image data
    const { Image } = await import('canvas');
    const img = new Image();
    img.src = buffer;

    // Draw to canvas
    ctx.drawImage(img, 0, 0);

    // Re-encode as PNG
    return canvas.toBuffer('image/png', { compressionLevel: 9 });
  } catch (error) {
    // If re-encoding fails, return original
    console.warn('PNG re-encoding failed, returning original:', error);
    return buffer;
  }
}

/**
 * Batch compress PNG files
 */
export async function compressPNGs(filePaths: string[]): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];

  for (const filePath of filePaths) {
    try {
      const result = await compressPNG(filePath);
      results.push(result);
    } catch (error) {
      console.error(`Failed to compress ${filePath}:`, error);
    }
  }

  return results;
}

/**
 * Optimize PNG directory
 */
export async function optimizeDirectory(
  dirPath: string,
  recursive: boolean = true
): Promise<{
  processed: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  totalSavings: number;
}> {
  const path = await import('path');
  const pngFiles: string[] = [];

  function scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && recursive) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        pngFiles.push(fullPath);
      }
    }
  }

  scanDirectory(dirPath);

  const results = await compressPNGs(pngFiles);

  const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalSavings = totalOriginalSize - totalCompressedSize;

  return {
    processed: results.length,
    totalOriginalSize,
    totalCompressedSize,
    totalSavings
  };
}
