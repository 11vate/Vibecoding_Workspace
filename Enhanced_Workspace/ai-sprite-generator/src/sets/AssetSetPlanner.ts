/**
 * Asset Set Planner
 * 
 * Analyzes project requirements and plans complete asset sets.
 */

import type { AssetSetPlan } from '../analysis/MissingAssetSuggester.js';
import { MissingAssetSuggester as Suggester } from '../analysis/MissingAssetSuggester.js';
import type { MissingAsset } from '../analysis/MissingAssetDetector.js';

/**
 * Asset set type
 */
export type SetType = 'directional' | 'animation' | 'color-variants' | 'equipment';

/**
 * Asset Set Planner
 */
export class AssetSetPlanner {
  private suggester: Suggester;

  constructor() {
    this.suggester = new Suggester();
  }

  /**
   * Plan asset set based on missing asset
   */
  async planAssetSet(
    projectPath: string,
    baseAsset: MissingAsset,
    setType?: SetType
  ): Promise<AssetSetPlan | null> {
    // Try to detect set type from asset ID if not provided
    if (!setType) {
      setType = this.detectSetType(baseAsset.assetId);
    }

    // Use suggester to generate set plan
    return await this.suggester.suggestAssetSet(projectPath, baseAsset);
  }

  /**
   * Detect set pattern from missing assets
   */
  detectSetPattern(missingAssets: MissingAsset[]): SetType | null {
    // Check for directional pattern
    const directionalKeywords = ['north', 'south', 'east', 'west', 'n', 's', 'e', 'w', 'up', 'down', 'left', 'right'];
    const hasDirectional = missingAssets.some(asset =>
      directionalKeywords.some(keyword => asset.assetId.toLowerCase().includes(keyword))
    );
    if (hasDirectional) {
      return 'directional';
    }

    // Check for animation pattern
    const animationKeywords = ['idle', 'walk', 'run', 'attack', 'cast', 'hit', 'death'];
    const hasAnimation = missingAssets.some(asset =>
      animationKeywords.some(keyword => asset.assetId.toLowerCase().includes(keyword))
    );
    if (hasAnimation) {
      return 'animation';
    }

    // Check for color variant pattern
    const colorKeywords = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const hasColor = missingAssets.some(asset =>
      colorKeywords.some(keyword => asset.assetId.toLowerCase().includes(keyword))
    );
    if (hasColor) {
      return 'color-variants';
    }

    return null;
  }

  /**
   * Detect set type from asset ID
   */
  private detectSetType(assetId: string): SetType {
    const lowerId = assetId.toLowerCase();

    if (['north', 'south', 'east', 'west', 'n', 's', 'e', 'w'].some(k => lowerId.includes(k))) {
      return 'directional';
    }

    if (['idle', 'walk', 'run', 'attack'].some(k => lowerId.includes(k))) {
      return 'animation';
    }

    if (['red', 'blue', 'green', 'yellow'].some(k => lowerId.includes(k))) {
      return 'color-variants';
    }

    return 'animation'; // Default
  }
}

