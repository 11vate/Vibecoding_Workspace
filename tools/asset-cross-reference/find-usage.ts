/**
 * Asset Usage Finder - Find where assets are used
 *
 * Purpose: Locate asset references in code and content
 * Authority: Tier 2 (Mandatory for asset management)
 * Use: Dependency tracking, impact analysis
 */

import * as fs from 'fs';
import * as path from 'path';

export interface UsageResult {
  assetPath: string;
  references: AssetReference[];
  totalReferences: number;
}

export interface AssetReference {
  file: string;
  line: number;
  column: number;
  context: string;
}

const WORKSPACE_ROOT = path.resolve(__dirname, '../..');

/**
 * Find all references to an asset
 */
export async function findAssetUsage(
  assetPath: string,
  searchDirs: string[] = ['src', 'content']
): Promise<UsageResult> {
  const references: AssetReference[] = [];

  // Normalize asset path
  const normalizedAssetPath = assetPath.replace(/\\/g, '/');

  // Search in specified directories
  for (const dir of searchDirs) {
    const fullDir = path.join(WORKSPACE_ROOT, dir);
    if (fs.existsSync(fullDir)) {
      findInDirectory(fullDir, normalizedAssetPath, references);
    }
  }

  return {
    assetPath: normalizedAssetPath,
    references,
    totalReferences: references.length
  };
}

/**
 * Recursively search directory for asset references
 */
function findInDirectory(
  dir: string,
  assetPath: string,
  references: AssetReference[]
): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }
      findInDirectory(fullPath, assetPath, references);
    } else if (entry.isFile()) {
      // Search in code files
      const ext = path.extname(entry.name).toLowerCase();
      if (['.ts', '.js', '.tsx', '.jsx', '.json', '.md'].includes(ext)) {
        searchFile(fullPath, assetPath, references);
      }
    }
  }
}

/**
 * Search file for asset references
 */
function searchFile(
  filePath: string,
  assetPath: string,
  references: AssetReference[]
): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const index = line.indexOf(assetPath);

      if (index !== -1) {
        references.push({
          file: path.relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/'),
          line: i + 1,
          column: index + 1,
          context: line.trim()
        });
      }
    }
  } catch (error) {
    // Skip files that can't be read
  }
}

/**
 * Build dependency graph
 */
export async function buildDependencyGraph(
  assetPaths: string[]
): Promise<Map<string, string[]>> {
  const graph = new Map<string, string[]>();

  for (const assetPath of assetPaths) {
    const usage = await findAssetUsage(assetPath);
    const dependents = usage.references.map(ref => ref.file);
    graph.set(assetPath, Array.from(new Set(dependents)));
  }

  return graph;
}

/**
 * Find assets with no references (unused)
 */
export async function findUnusedAssets(
  assetPaths: string[]
): Promise<string[]> {
  const unused: string[] = [];

  for (const assetPath of assetPaths) {
    const usage = await findAssetUsage(assetPath);
    if (usage.totalReferences === 0) {
      unused.push(assetPath);
    }
  }

  return unused;
}

/**
 * Analyze impact of removing an asset
 */
export async function analyzeRemovalImpact(
  assetPath: string
): Promise<{
  canRemove: boolean;
  affected: string[];
  warnings: string[];
}> {
  const usage = await findAssetUsage(assetPath);

  return {
    canRemove: usage.totalReferences === 0,
    affected: usage.references.map(ref => ref.file),
    warnings: usage.totalReferences > 0
      ? [`Asset is referenced in ${usage.totalReferences} location(s)`]
      : []
  };
}
