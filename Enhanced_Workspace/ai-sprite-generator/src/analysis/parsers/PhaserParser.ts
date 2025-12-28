/**
 * Phaser Parser
 * 
 * Parses Phaser projects for asset references.
 * Extends existing asset-reference-scanner functionality.
 */

import type { AssetReference } from '../../../../cursor-enhancements/utils/asset-reference-scanner';
import { scanForAssetReferences } from '../../../../cursor-enhancements/utils/asset-reference-scanner';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Phaser-specific parser
 */
export class PhaserParser {
  /**
   * Parse code for Phaser asset references
   */
  parse(code: string): AssetReference[] {
    return scanForAssetReferences(code, 'phaser');
  }

  /**
   * Parse entire project for Phaser asset references
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
    const ignoreDirs = ['node_modules', 'dist', 'build', '.git'];
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];

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







