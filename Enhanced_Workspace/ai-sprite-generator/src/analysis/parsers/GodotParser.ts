/**
 * Godot Parser
 * 
 * Parses Godot projects for asset references from .tscn scene files.
 */

import type { AssetReference } from '../../../../cursor-enhancements/utils/asset-reference-scanner';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Godot-specific parser
 */
export class GodotParser {
  /**
   * Parse .tscn file for asset references
   */
  parseTscn(content: string, _filePath: string): AssetReference[] {
    const references: AssetReference[] = [];
    const lines = content.split('\n');

    // Pattern: texture = ExtResource("path/to/sprite.png")
    const texturePattern = /texture\s*=\s*ExtResource\(["']([^"']+)["']\)/g;
    // Pattern: texture = SubResource("path/to/sprite.png")
    const subResourcePattern = /texture\s*=\s*SubResource\(["']([^"']+)["']\)/g;
    // Pattern: frames = ExtResource("path/to/sprite_sheet.png")
    const framesPattern = /frames\s*=\s*ExtResource\(["']([^"']+)["']\)/g;
    // Pattern: sprite_frames = ExtResource("path/to/sprite_sheet.png")
    const spriteFramesPattern = /sprite_frames\s*=\s*ExtResource\(["']([^"']+)["']\)/g;

    let lineNum = 0;
    for (const line of lines) {
      lineNum++;
      
      // Check for texture references
      let match;
      while ((match = texturePattern.exec(line)) !== null) {
        const assetPath = match[1];
        const assetId = this.extractAssetId(assetPath);
        if (assetId) {
          references.push({
            assetId,
            type: 'path',
            location: {
              line: lineNum,
              column: match.index,
              context: line.trim()
            }
          });
        }
      }

      // Check for sub-resource references
      while ((match = subResourcePattern.exec(line)) !== null) {
        const assetPath = match[1];
        const assetId = this.extractAssetId(assetPath);
        if (assetId) {
          references.push({
            assetId,
            type: 'path',
            location: {
              line: lineNum,
              column: match.index,
              context: line.trim()
            }
          });
        }
      }

      // Check for sprite sheet references
      while ((match = framesPattern.exec(line)) !== null) {
        const assetPath = match[1];
        const assetId = this.extractAssetId(assetPath);
        if (assetId) {
          references.push({
            assetId,
            type: 'path',
            location: {
              line: lineNum,
              column: match.index,
              context: line.trim()
            }
          });
        }
      }

      while ((match = spriteFramesPattern.exec(line)) !== null) {
        const assetPath = match[1];
        const assetId = this.extractAssetId(assetPath);
        if (assetId) {
          references.push({
            assetId,
            type: 'path',
            location: {
              line: lineNum,
              column: match.index,
              context: line.trim()
            }
          });
        }
      }
    }

    return references;
  }

  /**
   * Parse entire project for Godot asset references
   */
  async parseProject(projectPath: string): Promise<AssetReference[]> {
    const sceneFiles = await this.findSceneFiles(projectPath);
    const references: AssetReference[] = [];

    for (const file of sceneFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        references.push(...this.parseTscn(content, file));
      } catch (error) {
        // Skip files we can't read
      }
    }

    return references;
  }

  /**
   * Find .tscn scene files in project
   */
  private async findSceneFiles(projectPath: string): Promise<string[]> {
    const files: string[] = [];
    const ignoreDirs = ['.git', 'node_modules'];

    async function walkDir(dir: string): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
            await walkDir(fullPath);
          } else if (entry.isFile() && entry.name.endsWith('.tscn')) {
            files.push(fullPath);
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
   * Extract asset ID from file path
   */
  private extractAssetId(filePath: string): string | null {
    const filename = path.basename(filePath);
    const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
    return nameWithoutExt.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }
}

