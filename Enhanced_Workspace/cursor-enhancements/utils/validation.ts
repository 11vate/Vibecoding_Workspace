/**
 * Validation utilities
 */

import { z } from 'zod';

/**
 * Validate data against Zod schema
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { valid: boolean; data?: T; errors?: z.ZodError } {
  try {
    const result = schema.parse(data);
    return {
      valid: true,
      data: result
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error
      };
    }
    throw error;
  }
}

/**
 * Safe parse with error handling
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Validate image buffer
 */
export function validateImageBuffer(buffer: Buffer): {
  valid: boolean;
  format?: string;
  error?: string;
} {
  // Check PNG signature
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return { valid: true, format: 'png' };
  }
  
  // Check JPEG signature
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    return { valid: true, format: 'jpeg' };
  }
  
  // Check WebP signature
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { valid: true, format: 'webp' };
  }
  
  return { valid: false, error: 'Unknown image format' };
}

/**
 * Validate dimensions
 */
export function validateDimensions(
  width: number,
  height: number,
  minWidth: number = 1,
  minHeight: number = 1,
  maxWidth: number = 10000,
  maxHeight: number = 10000
): { valid: boolean; error?: string } {
  if (width < minWidth || width > maxWidth) {
    return { valid: false, error: `Width must be between ${minWidth} and ${maxWidth}` };
  }
  
  if (height < minHeight || height > maxHeight) {
    return { valid: false, error: `Height must be between ${minHeight} and ${maxHeight}` };
  }
  
  return { valid: true };
}

/**
 * Validate color palette
 */
export function validateColorPalette(
  colors: string[],
  maxColors?: number
): { valid: boolean; error?: string; count?: number } {
  const count = colors.length;
  
  if (maxColors && count > maxColors) {
    return {
      valid: false,
      error: `Palette exceeds maximum of ${maxColors} colors`,
      count
    };
  }
  
  // Validate hex color format
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  for (const color of colors) {
    if (!hexColorRegex.test(color)) {
      return {
        valid: false,
        error: `Invalid color format: ${color}. Must be hex format (#RRGGBB or #RGB)`,
        count
      };
    }
  }
  
  return { valid: true, count };
}

/**
 * Validate file path
 */
export function validateFilePath(path: string): { valid: boolean; error?: string } {
  // Check for path traversal
  if (path.includes('..') || path.includes('//')) {
    return { valid: false, error: 'Invalid file path: path traversal detected' };
  }
  
  // Check for null bytes
  if (path.includes('\0')) {
    return { valid: false, error: 'Invalid file path: null byte detected' };
  }
  
  return { valid: true };
}









