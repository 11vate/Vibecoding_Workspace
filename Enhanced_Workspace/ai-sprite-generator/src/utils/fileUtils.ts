/**
 * File Utilities
 * 
 * Utility functions for file operations.
 */

import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * Ensure directory exists
 */
export function ensureDir(path: string): void {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Generate unique filename
 */
export function generateFilename(prefix: string, extension: string = 'png'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}_${timestamp}_${random}.${extension}`;
}







