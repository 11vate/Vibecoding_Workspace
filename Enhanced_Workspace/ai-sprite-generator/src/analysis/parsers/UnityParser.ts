/**
 * Unity Parser
 * 
 * Parses Unity projects for asset references from .meta, .prefab, and .unity files.
 */

import type { AssetReference } from '../../../../cursor-enhancements/utils/asset-reference-scanner';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Unity-specific parser
 */
export class UnityParser {
  /**
   * Parse .meta file for asset GUID and path
   */
  parseMeta(content: string, _filePath: string): AssetReference[] {
    const references: AssetReference[] = [];
    const lines = content.split('\n');

    // Extract GUID from meta file
    let guid: string | null = null;
    for (const line of lines) {
      const guidMatch = line.match(/^guid:\s*([a-f0-9]{32})$/i);
      if (guidMatch) {
        guid = guidMatch[1];
        break;
      }
    }

    // Extract asset path from file path
      const assetPath = _filePath.replace(/\.meta$/, '');
    const assetId = this.extractAssetId(assetPath);

    if (assetId && guid) {
      references.push({
        assetId,
        type: 'id',
        location: {
          line: 0,
          column: 0,
          context: `Unity asset: ${assetId} (GUID: ${guid})`
        }
      });
    }

    return references;
  }

  /**
   * Parse .prefab file for asset references
   */
  parsePrefab(content: string, _filePath: string): AssetReference[] {
    const references: AssetReference[] = [];
    const lines = content.split('\n');

    // Pattern: m_Sprite: {fileID: 12345, guid: abc123...}
    const spritePattern = /m_Sprite:\s*\{[^}]*guid:\s*([a-f0-9]{32})/gi;
    // Pattern: m_Texture: {fileID: 12345, guid: abc123...}
    const texturePattern = /m_Texture:\s*\{[^}]*guid:\s*([a-f0-9]{32})/gi;

    let lineNum = 0;
    for (const line of lines) {
      lineNum++;

      let match;
      while ((match = spritePattern.exec(line)) !== null) {
        const guid = match[1];
        references.push({
          assetId: guid,
          type: 'id',
          location: {
            line: lineNum,
            column: match.index,
            context: line.trim()
          }
        });
      }

      while ((match = texturePattern.exec(line)) !== null) {
        const guid = match[1];
        references.push({
          assetId: guid,
          type: 'id',
          location: {
            line: lineNum,
            column: match.index,
            context: line.trim()
          }
        });
      }
    }

    return references;
  }

  /**
   * Parse .unity scene file for asset references
   */
  parseUnityScene(content: string, _filePath: string): AssetReference[] {
    const references: AssetReference[] = [];
    const lines = content.split('\n');

    // Pattern: m_Sprite: {fileID: 12345, guid: abc123...}
    const spritePattern = /m_Sprite:\s*\{[^}]*guid:\s*([a-f0-9]{32})/gi;
    // Pattern: m_Texture: {fileID: 12345, guid: abc123...}
    const texturePattern = /m_Texture:\s*\{[^}]*guid:\s*([a-f0-9]{32})/gi;

    let lineNum = 0;
    for (const line of lines) {
      lineNum++;

      let match;
      while ((match = spritePattern.exec(line)) !== null) {
        const guid = match[1];
        references.push({
          assetId: guid,
          type: 'id',
          location: {
            line: lineNum,
            column: match.index,
            context: line.trim()
          }
        });
      }

      while ((match = texturePattern.exec(line)) !== null) {
        const guid = match[1];
        references.push({
          assetId: guid,
          type: 'id',
          location: {
            line: lineNum,
            column: match.index,
            context: line.trim()
          }
        });
      }
    }

    return references;
  }

  /**
   * Parse entire Unity project for asset references
   */
  async parseProject(projectPath: string): Promise<AssetReference[]> {
    const assetsPath = path.join(projectPath, 'Assets');
    if (!await this.pathExists(assetsPath)) {
      return [];
    }

    const references: AssetReference[] = [];
    
    // Parse .meta files
    const metaFiles = await this.findFiles(assetsPath, '.meta');
    for (const file of metaFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        references.push(...this.parseMeta(content, file));
      } catch {
        // Skip files we can't read
      }
    }

    // Parse .prefab files
    const prefabFiles = await this.findFiles(assetsPath, '.prefab');
    for (const file of prefabFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        references.push(...this.parsePrefab(content, file));
      } catch {
        // Skip files we can't read
      }
    }

    // Parse .unity scene files
    const unityFiles = await this.findFiles(assetsPath, '.unity');
    for (const file of unityFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        references.push(...this.parseUnityScene(content, file));
      } catch {
        // Skip files we can't read
      }
    }

    return references;
  }

  /**
   * Find files with specific extension
   */
  private async findFiles(dir: string, extension: string): Promise<string[]> {
    const files: string[] = [];
    const ignoreDirs = ['.git', 'Library', 'Temp', 'obj'];

    async function walkDir(currentDir: string): Promise<void> {
      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
            await walkDir(fullPath);
          } else if (entry.isFile() && entry.name.endsWith(extension)) {
            files.push(fullPath);
          }
        }
      } catch {
        // Skip directories we can't read
      }
    }

    await walkDir(dir);
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

  /**
   * Extract asset ID from file path
   */
  private extractAssetId(filePath: string): string | null {
    const filename = path.basename(filePath);
    const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
    return nameWithoutExt.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }
}

