/**
 * Project Scanner
 * 
 * Detects game engine type and scans project structure for asset references.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { AssetReference } from '../../../cursor-enhancements/utils/asset-reference-scanner';

/**
 * Game engine type
 */
export type GameEngine = 'unity' | 'godot' | 'phaser' | 'pixi' | 'unknown';

/**
 * Project analysis result
 */
export interface ProjectAnalysis {
  engine: GameEngine;
  projectPath: string;
  assetReferences: AssetReference[];
  codeFiles: string[];
  warnings: string[];
}

/**
 * Project Scanner
 * 
 * Detects game engine and scans project for asset references.
 */
export class ProjectScanner {
  /**
   * Detect game engine from project structure
   */
  async detectEngine(projectPath: string): Promise<GameEngine> {
    try {
      // Check for Unity
      const assetsPath = path.join(projectPath, 'Assets');
      const projectSettingsPath = path.join(projectPath, 'ProjectSettings');
      if (await this.pathExists(assetsPath) && await this.pathExists(projectSettingsPath)) {
        return 'unity';
      }

      // Check for Godot
      const godotProject = path.join(projectPath, 'project.godot');
      if (await this.pathExists(godotProject)) {
        return 'godot';
      }

      // Check for Phaser
      const packageJson = path.join(projectPath, 'package.json');
      if (await this.pathExists(packageJson)) {
        try {
          const pkgContent = await fs.readFile(packageJson, 'utf-8');
          const pkg = JSON.parse(pkgContent);
          const deps = { ...pkg.dependencies, ...pkg.devDependencies };
          if (deps.phaser || deps['phaser-ce']) {
            return 'phaser';
          }
          if (deps.pixi || deps['pixi.js'] || deps['@pixi/core']) {
            return 'pixi';
          }
        } catch {
          // Invalid package.json, continue
        }
      }

      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Scan project for asset references
   */
  async scanProject(projectPath: string): Promise<ProjectAnalysis> {
    const engine = await this.detectEngine(projectPath);
    const codeFiles = await this.findCodeFiles(projectPath);
    const warnings: string[] = [];
    const assetReferences: AssetReference[] = [];

    // Import scanner dynamically to avoid circular dependencies
    const { scanForAssetReferences } = await import('../../../cursor-enhancements/utils/asset-reference-scanner');

    // Scan each code file
    for (const file of codeFiles) {
      try {
        const code = await fs.readFile(file, 'utf-8');
        const framework = engine === 'phaser' ? 'phaser' : engine === 'pixi' ? 'pixi' : undefined;
        const refs = scanForAssetReferences(code, framework);
        assetReferences.push(...refs);
      } catch (error) {
        warnings.push(`Failed to scan ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      engine,
      projectPath,
      assetReferences,
      codeFiles,
      warnings
    };
  }

  /**
   * Find all code files in project
   */
  async findCodeFiles(projectPath: string): Promise<string[]> {
    const files: string[] = [];
    const ignoreDirs = ['node_modules', 'dist', 'build', '.git', '.next', '.vite', 'coverage', '.nyc_output'];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.cs', '.gd', '.csx'];

    async function walkDir(dir: string): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          // Skip ignored directories
          if (entry.isDirectory()) {
            const dirName = entry.name;
            if (!ignoreDirs.includes(dirName) && !dirName.startsWith('.')) {
              await walkDir(fullPath);
            }
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

  /**
   * Check if path exists
   */
  private async pathExists(p: string): Promise<boolean> {
    try {
      await fs.access(p);
      return true;
    } catch {
      return false;
    }
  }
}

