/**
 * Generic Parser
 * 
 * Fallback parser for projects without specific engine detection.
 * Uses pattern matching for common asset reference patterns.
 */

import type { AssetReference } from '../../../../cursor-enhancements/utils/asset-reference-scanner';
import { scanForAssetReferences } from '../../../../cursor-enhancements/utils/asset-reference-scanner';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Generic parser for unknown project types
 */
export class GenericParser {
  /**
   * Parse code for generic asset references
   */
  parse(code: string): AssetReference[] {
    // Use existing generic scanner
    return scanForAssetReferences(code);
  }

  /**
   * Parse entire project for asset references
   */
  async parseProject(projectPath: string): Promise<AssetReference[]> {
    const codeFiles = await this.findCodeFiles(projectPath);
    const references: AssetReference[] = [];

    for (const file of codeFiles) {
      try {
        const code = await fs.readFile(file, 'utf-8');
        references.push(...this.parse(code));
      } catch (error) {
        // Skip files we can't read
      }
    }

    return references;
  }

  /**
   * Find code files in project
   */
  private async findCodeFiles(projectPath: string): Promise<string[]> {
    const files: string[] = [];
    const ignoreDirs = ['node_modules', 'dist', 'build', '.git', '.next', '.vite'];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.lua', '.gd'];

    async function walkDir(dir: string): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
            await walkDir(fullPath);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch {
        // Skip directories we can't read
      }
    }

    await walkDir(projectPath);
    return files;
  }
}







