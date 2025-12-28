/**
 * Missing Asset Suggester
 * 
 * Learns naming conventions from existing assets and generates prompt templates
 * for missing assets.
 */

import type { AssetRegistry } from '../../../cursor-enhancements/integrations/asset-registry/asset-registry';
import type { MissingAsset } from './MissingAssetDetector';
import { createAssetRegistry } from '../../../cursor-enhancements/integrations/asset-registry/asset-registry';

/**
 * Asset suggestion with prompt template
 */
export interface AssetSuggestion {
  assetId: string;
  prompt: string;
  type: 'single' | 'set';
  missingAsset: MissingAsset;
  confidence: number;
}

/**
 * Asset set plan for generating multiple related assets
 */
export interface AssetSetPlan {
  baseAssetId: string;
  setType: 'directional' | 'animation' | 'color-variants' | 'equipment';
  assets: AssetSuggestion[];
  description: string;
}

/**
 * Naming conventions learned from project
 */
export interface NamingConventions {
  separator: string; // '_' or '-' or camelCase
  prefixes: string[]; // Common prefixes like 'sprite_', 'img_'
  suffixes: string[]; // Common suffixes like '_idle', '_walk'
  patterns: {
    directional?: string[]; // ['north', 'south', 'east', 'west']
    animation?: string[]; // ['idle', 'walk', 'run', 'attack']
    color?: string[]; // ['red', 'blue', 'green']
  };
}

/**
 * Missing Asset Suggester
 */
export class MissingAssetSuggester {
  /**
   * Learn naming conventions from project
   */
  async learnConventions(projectPath: string): Promise<NamingConventions> {
    const registry = await createAssetRegistry(projectPath);
    const conventions: NamingConventions = {
      separator: '_',
      prefixes: [],
      suffixes: [],
      patterns: {}
    };

    const assetIds = Array.from(registry.assets.keys());
    if (assetIds.length === 0) {
      return conventions;
    }

    // Analyze separators
    const separators = { '_': 0, '-': 0, camelCase: 0 };
    for (const id of assetIds) {
      if (id.includes('_')) separators['_']++;
      if (id.includes('-')) separators['-']++;
      if (/[a-z][A-Z]/.test(id)) separators.camelCase++;
    }
    const maxSep = Object.entries(separators).reduce((a, b) => separators[a[0] as keyof typeof separators] > separators[b[0] as keyof typeof separators] ? a : b);
    conventions.separator = maxSep[0] === 'camelCase' ? '' : maxSep[0];

    // Extract prefixes and suffixes
    const prefixes = new Map<string, number>();
    const suffixes = new Map<string, number>();
    
    for (const id of assetIds) {
      const parts = id.split(/[_-]/);
      if (parts.length > 1) {
        const prefix = parts[0];
        const suffix = parts[parts.length - 1];
        prefixes.set(prefix, (prefixes.get(prefix) || 0) + 1);
        suffixes.set(suffix, (suffixes.get(suffix) || 0) + 1);
      }
    }

    // Get most common prefixes/suffixes
    conventions.prefixes = Array.from(prefixes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([prefix]) => prefix);
    
    conventions.suffixes = Array.from(suffixes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([suffix]) => suffix);

    // Detect patterns
    const directionalKeywords = ['north', 'south', 'east', 'west', 'n', 's', 'e', 'w', 'up', 'down', 'left', 'right'];
    const animationKeywords = ['idle', 'walk', 'run', 'attack', 'cast', 'hit', 'death', 'jump', 'fall'];
    const colorKeywords = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'white'];

    const foundDirections: string[] = [];
    const foundAnimations: string[] = [];
    const foundColors: string[] = [];

    for (const id of assetIds) {
      const lowerId = id.toLowerCase();
      for (const dir of directionalKeywords) {
        if (lowerId.includes(dir) && !foundDirections.includes(dir)) {
          foundDirections.push(dir);
        }
      }
      for (const anim of animationKeywords) {
        if (lowerId.includes(anim) && !foundAnimations.includes(anim)) {
          foundAnimations.push(anim);
        }
      }
      for (const color of colorKeywords) {
        if (lowerId.includes(color) && !foundColors.includes(color)) {
          foundColors.push(color);
        }
      }
    }

    if (foundDirections.length > 0) {
      conventions.patterns.directional = foundDirections;
    }
    if (foundAnimations.length > 0) {
      conventions.patterns.animation = foundAnimations;
    }
    if (foundColors.length > 0) {
      conventions.patterns.color = foundColors;
    }

    return conventions;
  }

  /**
   * Suggest assets for missing assets
   */
  async suggestAssets(
    projectPath: string,
    missingAssets: MissingAsset[]
  ): Promise<AssetSuggestion[]> {
    const conventions = await this.learnConventions(projectPath);
    const suggestions: AssetSuggestion[] = [];

    for (const missing of missingAssets) {
      const suggestion = this.generateSuggestion(missing, conventions);
      suggestions.push(suggestion);
    }

    return suggestions;
  }

  /**
   * Generate suggestion for a single missing asset
   */
  private generateSuggestion(
    missing: MissingAsset,
    conventions: NamingConventions
  ): AssetSuggestion {
    const assetId = missing.assetId;
    const parts = assetId.split(/[_-]/);
    
    // Extract entity type
    let entityType = 'character';
    if (assetId.includes('enemy') || assetId.includes('monster')) {
      entityType = 'enemy';
    } else if (assetId.includes('pet')) {
      entityType = 'pet';
    } else if (assetId.includes('item') || assetId.includes('equipment')) {
      entityType = 'item';
    } else if (assetId.includes('tile')) {
      entityType = 'tile';
    } else if (assetId.includes('ui') || assetId.includes('icon')) {
      entityType = 'ui';
    }

    // Extract action/animation
    let action: string | undefined;
    const actionKeywords = ['idle', 'walk', 'run', 'attack', 'cast', 'hit', 'death', 'jump', 'fall'];
    for (const keyword of actionKeywords) {
      if (assetId.includes(keyword)) {
        action = keyword;
        break;
      }
    }

    // Extract theme/description
    let theme = '';
    const themeKeywords = parts.filter(p => 
      !actionKeywords.includes(p.toLowerCase()) &&
      !['sprite', 'image', 'asset', 'sheet'].includes(p.toLowerCase())
    );
    if (themeKeywords.length > 0) {
      theme = themeKeywords.join(' ');
    }

    // Build prompt
    let prompt = '';
    if (theme) {
      prompt = `${theme} ${entityType}`;
    } else {
      prompt = entityType;
    }

    if (action) {
      prompt += ` ${action} animation`;
    }

    // Add style hint if available
    if (missing.inferredSpec?.style) {
      prompt = `${missing.inferredSpec.style} ${prompt}`;
    } else {
      prompt = `pixel art ${prompt}`;
    }

    // Determine if this is part of a set
    let isSet = false;
    if (conventions.patterns.directional && 
        conventions.patterns.directional.some(d => assetId.includes(d))) {
      isSet = true;
    }
    if (conventions.patterns.animation && 
        conventions.patterns.animation.some(a => assetId.includes(a))) {
      isSet = true;
    }

    // Calculate confidence based on how much we could infer
    let confidence = 0.5;
    if (entityType !== 'character') confidence += 0.1;
    if (action) confidence += 0.2;
    if (theme) confidence += 0.2;

    return {
      assetId,
      prompt,
      type: isSet ? 'set' : 'single',
      missingAsset: missing,
      confidence
    };
  }

  /**
   * Suggest asset set based on missing asset
   */
  async suggestAssetSet(
    projectPath: string,
    baseAsset: MissingAsset
  ): Promise<AssetSetPlan | null> {
    const conventions = await this.learnConventions(projectPath);
    const assetId = baseAsset.assetId;

    // Check for directional pattern
    if (conventions.patterns.directional) {
      const hasDirection = conventions.patterns.directional.some(d => 
        assetId.toLowerCase().includes(d)
      );
      
      if (hasDirection) {
        // Suggest 8-directional set
        const directions = ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'];
        const assets: AssetSuggestion[] = [];
        
        for (const dir of directions) {
          const newAssetId = assetId.replace(
            /(north|south|east|west|northeast|northwest|southeast|southwest)/i,
            dir
          );
          const suggestion = this.generateSuggestion(
            { ...baseAsset, assetId: newAssetId },
            conventions
          );
          assets.push(suggestion);
        }

        return {
          baseAssetId: assetId,
          setType: 'directional',
          assets,
          description: `8-directional movement sprites for ${assetId}`
        };
      }
    }

    // Check for animation pattern
    if (conventions.patterns.animation) {
      const hasAnimation = conventions.patterns.animation.some(a => 
        assetId.toLowerCase().includes(a)
      );
      
      if (hasAnimation) {
        // Suggest animation cycle
        const animations = ['idle', 'walk', 'run', 'attack', 'cast', 'hit', 'death'];
        const assets: AssetSuggestion[] = [];
        
        for (const anim of animations) {
          const newAssetId = assetId.replace(
            /(idle|walk|run|attack|cast|hit|death)/i,
            anim
          );
          const suggestion = this.generateSuggestion(
            { ...baseAsset, assetId: newAssetId },
            conventions
          );
          assets.push(suggestion);
        }

        return {
          baseAssetId: assetId,
          setType: 'animation',
          assets,
          description: `Complete animation cycle for ${assetId}`
        };
      }
    }

    return null;
  }
}







