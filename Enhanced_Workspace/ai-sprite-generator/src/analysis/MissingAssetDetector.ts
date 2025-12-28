/**
 * Missing Asset Detector
 * 
 * Cross-references code references with asset registry to detect missing assets.
 */

import type { AssetRegistry } from '../../../cursor-enhancements/integrations/asset-registry/asset-registry';
import type { AssetReference } from '../../../cursor-enhancements/utils/asset-reference-scanner';
import { createAssetRegistry } from '../../../cursor-enhancements/integrations/asset-registry/asset-registry';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Missing asset information
 */
export interface MissingAsset {
  assetId: string;
  references: AssetReference[];
  reason: 'not_in_registry' | 'file_missing' | 'invalid_path';
  inferredSpec?: {
    type?: string;
    resolution?: string;
    frames?: number;
    style?: string;
  };
}

/**
 * Missing asset report
 */
export interface MissingAssetReport {
  projectPath: string;
  missingAssets: MissingAsset[];
  existingAssets: string[];
  totalReferences: number;
  warnings: string[];
}

/**
 * Missing Asset Detector
 */
export class MissingAssetDetector {
  /**
   * Detect missing assets in project
   */
  async detectMissing(
    projectPath: string,
    assetReferences: AssetReference[]
  ): Promise<MissingAssetReport> {
    const registry = await createAssetRegistry(projectPath);
    const missingAssets: MissingAsset[] = [];
    const existingAssets: string[] = [];
    const warnings: string[] = [];
    const seen = new Set<string>();

    // Group references by asset ID
    const refsByAsset = new Map<string, AssetReference[]>();
    for (const ref of assetReferences) {
      if (!refsByAsset.has(ref.assetId)) {
        refsByAsset.set(ref.assetId, []);
      }
      refsByAsset.get(ref.assetId)!.push(ref);
    }

    // Check each referenced asset
    for (const [assetId, references] of refsByAsset) {
      if (seen.has(assetId)) {
        continue;
      }
      seen.add(assetId);

      const entry = registry.assets.get(assetId);

      if (!entry) {
        // Asset not in registry
        const inferredSpec = this.inferSpecFromReferences(references);
        missingAssets.push({
          assetId,
          references,
          reason: 'not_in_registry',
          inferredSpec
        });
      } else {
        // Check if file actually exists
        const fullPath = path.join(registry.projectPath, entry.path);
        const exists = await this.pathExists(fullPath);

        if (!exists) {
          // File missing
          missingAssets.push({
            assetId,
            references,
            reason: 'file_missing',
            inferredSpec: {
              type: entry.spec.type,
              resolution: entry.spec.resolution,
              frames: entry.spec.frames,
              style: entry.spec.style
            }
          });
        } else {
          existingAssets.push(assetId);
        }
      }
    }

    // Generate warnings for incomplete specs
    for (const asset of missingAssets) {
      if (asset.inferredSpec && !asset.inferredSpec.resolution) {
        warnings.push(`Asset ${asset.assetId} has incomplete spec (missing resolution)`);
      }
    }

    return {
      projectPath,
      missingAssets,
      existingAssets,
      totalReferences: assetReferences.length,
      warnings
    };
  }

  /**
   * Infer asset specification from references
   */
  private inferSpecFromReferences(references: AssetReference[]): {
    type?: string;
    resolution?: string;
    frames?: number;
    style?: string;
  } {
    const spec: {
      type?: string;
      resolution?: string;
      frames?: number;
      style?: string;
    } = {};

    // Try to infer from asset ID
    const assetId = references[0]?.assetId || '';
    
    // Infer type from asset ID patterns
    if (assetId.includes('sprite') || assetId.includes('character') || assetId.includes('enemy')) {
      spec.type = 'sprite';
    } else if (assetId.includes('sheet') || assetId.includes('animation')) {
      spec.type = 'sprite_sheet';
    } else if (assetId.includes('icon') || assetId.includes('ui')) {
      spec.type = 'icon';
    } else if (assetId.includes('tile') || assetId.includes('bg')) {
      spec.type = assetId.includes('tile') ? 'tileset' : 'background';
    }

    // Infer animation frames from context
    for (const ref of references) {
      if (ref.location.context.includes('frame') || ref.location.context.includes('animation')) {
        // Try to extract frame count
        const frameMatch = ref.location.context.match(/(\d+)\s*frames?/i);
        if (frameMatch) {
          spec.frames = parseInt(frameMatch[1], 10);
        }
      }
    }

    // Default resolution if not specified
    if (!spec.resolution) {
      spec.resolution = '64x64'; // Default
    }

    return spec;
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

