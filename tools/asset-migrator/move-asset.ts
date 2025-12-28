/**
 * Asset Migrator - Move/rename assets with registry updates
 *
 * Purpose: Safely move assets while maintaining registry integrity
 * Authority: Tier 2 (Mandatory for asset migration)
 * Use: Asset reorganization, refactoring
 */

import * as fs from 'fs';
import * as path from 'path';
import { searchRegistry, AssetRegistryEntry } from '../autonomous-assets/auto-registrar';

const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const REGISTRY_PATH = path.join(WORKSPACE_ROOT, 'asset-system', 'ASSET_REGISTRY.md');

export interface MigrationResult {
  success: boolean;
  oldPath: string;
  newPath: string;
  registryUpdated: boolean;
  error?: string;
}

/**
 * Move asset file and update registry
 */
export async function moveAsset(
  assetId: string,
  newPath: string
): Promise<MigrationResult> {
  try {
    // Find asset in registry
    const assets = await searchRegistry({});
    const asset = assets.find(a => a.id === assetId);

    if (!asset) {
      return {
        success: false,
        oldPath: '',
        newPath,
        registryUpdated: false,
        error: 'Asset not found in registry'
      };
    }

    const oldAbsolutePath = path.resolve(WORKSPACE_ROOT, asset.path);
    const newAbsolutePath = path.resolve(WORKSPACE_ROOT, newPath);

    // Check old file exists
    if (!fs.existsSync(oldAbsolutePath)) {
      return {
        success: false,
        oldPath: asset.path,
        newPath,
        registryUpdated: false,
        error: 'Source file not found'
      };
    }

    // Ensure new directory exists
    const newDir = path.dirname(newAbsolutePath);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    // Move file
    fs.renameSync(oldAbsolutePath, newAbsolutePath);

    // Update registry
    const updated = await updateRegistryPath(assetId, asset.path, newPath);

    return {
      success: true,
      oldPath: asset.path,
      newPath,
      registryUpdated: updated
    };
  } catch (error) {
    return {
      success: false,
      oldPath: '',
      newPath,
      registryUpdated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Update asset path in registry
 */
async function updateRegistryPath(
  assetId: string,
  oldPath: string,
  newPath: string
): Promise<boolean> {
  if (!fs.existsSync(REGISTRY_PATH)) {
    return false;
  }

  let content = fs.readFileSync(REGISTRY_PATH, 'utf-8');

  // Find and replace path for this asset
  const pathLine = `**Path**: \`${oldPath}\``;
  const newPathLine = `**Path**: \`${newPath}\``;

  content = content.replace(pathLine, newPathLine);

  fs.writeFileSync(REGISTRY_PATH, content, 'utf-8');

  return true;
}

/**
 * Batch move assets
 */
export async function moveAssets(
  migrations: Array<{ assetId: string; newPath: string }>
): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];

  for (const migration of migrations) {
    const result = await moveAsset(migration.assetId, migration.newPath);
    results.push(result);
  }

  return results;
}

/**
 * Consolidate duplicate assets
 */
export async function consolidateDuplicates(
  keepId: string,
  removeIds: string[]
): Promise<{ kept: string; removed: string[]; errors: string[] }> {
  const errors: string[] = [];
  const removed: string[] = [];

  for (const removeId of removeIds) {
    try {
      const assets = await searchRegistry({});
      const asset = assets.find(a => a.id === removeId);

      if (!asset) {
        errors.push(`${removeId}: not found`);
        continue;
      }

      const filePath = path.resolve(WORKSPACE_ROOT, asset.path);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      removed.push(removeId);
    } catch (error) {
      errors.push(`${removeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { kept: keepId, removed, errors };
}
