/**
 * Asset Scanner - Scan directories for unregistered assets
 *
 * Purpose: Find asset files that aren't in the registry
 * Authority: Tier 2 (Mandatory for registry management)
 * Use: Registry population, orphan detection
 */

import * as fs from 'fs';
import * as path from 'path';
import { searchRegistry } from '../autonomous-assets/auto-registrar';

export interface ScannedAsset {
  filePath: string; // Relative to workspace root
  absolutePath: string;
  fileName: string;
  extension: string;
  fileSize: number;
  dimensions?: { width: number; height: number };
  modifiedDate: Date;
  isRegistered: boolean;
}

export interface ScanResult {
  total: number;
  registered: number;
  unregistered: number;
  assets: ScannedAsset[];
}

const WORKSPACE_ROOT = path.resolve(__dirname, '../..');

/**
 * Scan directory for assets
 */
export async function scanAssets(
  dirPath: string,
  recursive: boolean = true
): Promise<ScanResult> {
  const scanned: ScannedAsset[] = [];

  // Get registered asset paths
  const registeredAssets = await searchRegistry({});
  const registeredPaths = new Set(registeredAssets.map(a => a.path));

  function scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && recursive) {
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        // Only scan image files
        const ext = path.extname(entry.name).toLowerCase();
        if (isAssetFile(ext)) {
          const relativePath = path.relative(WORKSPACE_ROOT, fullPath).replace(/\\/g, '/');
          const stats = fs.statSync(fullPath);

          // Try to read dimensions
          let dimensions: { width: number; height: number } | undefined;
          if (ext === '.png') {
            dimensions = readPNGDimensions(fullPath);
          }

          scanned.push({
            filePath: relativePath,
            absolutePath: fullPath,
            fileName: entry.name,
            extension: ext,
            fileSize: stats.size,
            dimensions,
            modifiedDate: stats.mtime,
            isRegistered: registeredPaths.has(relativePath)
          });
        }
      }
    }
  }

  scanDirectory(dirPath);

  const registered = scanned.filter(a => a.isRegistered).length;
  const unregistered = scanned.filter(a => !a.isRegistered).length;

  return {
    total: scanned.length,
    registered,
    unregistered,
    assets: scanned
  };
}

/**
 * Check if file extension is an asset type
 */
function isAssetFile(ext: string): boolean {
  return ['.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext.toLowerCase());
}

/**
 * Read PNG dimensions from file
 */
function readPNGDimensions(filePath: string): { width: number; height: number } | undefined {
  try {
    const buffer = fs.readFileSync(filePath);

    // Verify PNG signature
    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if (!buffer.slice(0, 8).equals(pngSignature)) {
      return undefined;
    }

    // Read dimensions from IHDR chunk
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);

    return { width, height };
  } catch {
    return undefined;
  }
}

/**
 * Find unregistered assets only
 */
export async function findUnregistered(
  dirPath: string,
  recursive: boolean = true
): Promise<ScannedAsset[]> {
  const result = await scanAssets(dirPath, recursive);
  return result.assets.filter(a => !a.isRegistered);
}

/**
 * Group scanned assets by criteria
 */
export function groupAssets(assets: ScannedAsset[]): {
  byExtension: Map<string, ScannedAsset[]>;
  bySize: { small: ScannedAsset[]; medium: ScannedAsset[]; large: ScannedAsset[] };
  byStatus: { registered: ScannedAsset[]; unregistered: ScannedAsset[] };
} {
  // By extension
  const byExtension = new Map<string, ScannedAsset[]>();
  for (const asset of assets) {
    if (!byExtension.has(asset.extension)) {
      byExtension.set(asset.extension, []);
    }
    byExtension.get(asset.extension)!.push(asset);
  }

  // By size (in KB)
  const small: ScannedAsset[] = [];
  const medium: ScannedAsset[] = [];
  const large: ScannedAsset[] = [];

  for (const asset of assets) {
    const sizeKB = asset.fileSize / 1024;
    if (sizeKB < 10) {
      small.push(asset);
    } else if (sizeKB < 100) {
      medium.push(asset);
    } else {
      large.push(asset);
    }
  }

  // By status
  const registered = assets.filter(a => a.isRegistered);
  const unregistered = assets.filter(a => !a.isRegistered);

  return {
    byExtension,
    bySize: { small, medium, large },
    byStatus: { registered, unregistered }
  };
}
