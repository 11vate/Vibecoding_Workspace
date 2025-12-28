/**
 * Generation Orchestrator - Coordinate autonomous asset generation pipeline
 *
 * Purpose: Full pipeline coordination from need to registered asset
 * Authority: Tier 2 (Mandatory for autonomous asset generation)
 * Use: AI model primary entry point for asset generation
 */

import { AssetNeed, decideAssetSourcing, AssetDecision, GenerationMethod } from './asset-decision-engine';
import { buildSpecification, GenerationSpec } from './specification-builder';
import { validateGeneratedAsset, ValidationResult } from './quality-validator';
import { registerAsset, AssetRegistryEntry } from './auto-registrar';

// Import all generators
import { generateButton, generateButtonSet, ButtonSpec } from '../asset-generators/ui-generator/button-generator';
import { generatePanel, PanelSpec } from '../asset-generators/ui-generator/panel-generator';
import { generateIcon, IconSpec } from '../asset-generators/ui-generator/icon-generator';
import { generateProgressBar, ProgressBarSpec } from '../asset-generators/ui-generator/progress-bar-generator';
import { generateHumanoid, HumanoidSpec } from '../asset-generators/character-generator/humanoid-generator';
import { generateTileset, TilesetSpec } from '../asset-generators/environment-generator/tileset-generator';
import { generateItem, ItemSpec } from '../asset-generators/item-generator/item-generator';

export interface AssetGenerationResult {
  success: boolean;
  assetReference?: AssetReference;
  validationResult?: ValidationResult;
  error?: string;
  decision: AssetDecision;
  generatedFiles?: GeneratedFile[];
}

export interface AssetReference {
  symbolName: string;
  path: string;
  dimensions: { width: number; height: number };
  tags: string[];
  registryEntry: AssetRegistryEntry;
}

export interface GeneratedFile {
  path: string;
  buffer: Buffer | string;
  type: 'png' | 'svg' | 'json';
}

/**
 * Main entry point: Get asset (reuse or generate)
 */
export async function getAsset(need: AssetNeed): Promise<AssetGenerationResult> {
  try {
    // Step 1: Decide how to source the asset
    console.log(`[Asset Pipeline] Deciding how to source: ${need.description}`);
    const decision = await decideAssetSourcing(need);

    // Step 2: If reusing, return existing asset
    if (decision.action === 'reuse' && decision.existingAsset) {
      console.log(`[Asset Pipeline] Reusing existing asset: ${decision.existingAsset.name}`);
      return {
        success: true,
        assetReference: {
          symbolName: decision.existingAsset.name,
          path: decision.existingAsset.path,
          dimensions: decision.existingAsset.dimensions,
          tags: decision.existingAsset.tags,
          registryEntry: {} as AssetRegistryEntry // Would load from registry
        },
        decision
      };
    }

    // Step 3: Generate asset
    if (decision.action === 'generate' && decision.method) {
      console.log(`[Asset Pipeline] Generating asset using method: ${decision.method}`);
      return await generateAsset(need, decision.method, decision);
    }

    // Fallback
    return {
      success: false,
      error: 'Unable to determine asset sourcing strategy',
      decision
    };
  } catch (error) {
    console.error('[Asset Pipeline] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      decision: {
        action: 'generate',
        reasoning: 'Error occurred during decision making',
        confidence: 0
      }
    };
  }
}

/**
 * Generate asset using specified method
 */
async function generateAsset(
  need: AssetNeed,
  method: GenerationMethod,
  decision: AssetDecision
): Promise<AssetGenerationResult> {
  try {
    // Step 1: Build detailed specification
    const seed = generateSeed(need);
    console.log(`[Asset Pipeline] Building specification (seed: ${seed})`);
    const spec = buildSpecification(need, method, seed);

    // Step 2: Execute generation
    console.log(`[Asset Pipeline] Executing generation...`);
    const generationResult = await executeGeneration(spec, need);

    if (!generationResult.success || !generationResult.buffer) {
      return {
        success: false,
        error: generationResult.error || 'Generation failed',
        decision
      };
    }

    // Step 3: Validate generated asset
    console.log(`[Asset Pipeline] Validating generated asset...`);
    const validation = await validateGeneratedAsset(
      generationResult.buffer,
      need,
      spec
    );

    if (!validation.valid) {
      console.error('[Asset Pipeline] Validation failed:', validation.errors);
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`,
        decision,
        validationResult: validation
      };
    }

    // Step 4: Register asset
    console.log(`[Asset Pipeline] Registering asset...`);
    const registryEntry = await registerAsset({
      name: generationResult.symbolName,
      type: need.type,
      category: need.category,
      dimensions: generationResult.dimensions,
      tags: need.tags || [],
      description: need.description,
      projectContext: need.projectContext,
      generationMethod: method,
      seed,
      buffer: generationResult.buffer
    });

    // Step 5: Prepare result
    const assetReference: AssetReference = {
      symbolName: generationResult.symbolName,
      path: registryEntry.path,
      dimensions: generationResult.dimensions,
      tags: registryEntry.tags,
      registryEntry
    };

    console.log(`[Asset Pipeline] ✓ Asset generated successfully: ${assetReference.symbolName}`);

    return {
      success: true,
      assetReference,
      validationResult: validation,
      decision,
      generatedFiles: generationResult.additionalFiles
    };
  } catch (error) {
    console.error('[Asset Pipeline] Generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown generation error',
      decision
    };
  }
}

/**
 * Execute generation based on specification type
 */
async function executeGeneration(
  spec: GenerationSpec,
  need: AssetNeed
): Promise<{
  success: boolean;
  buffer?: Buffer;
  symbolName: string;
  dimensions: { width: number; height: number };
  error?: string;
  additionalFiles?: GeneratedFile[];
}> {
  try {
    // Button
    if ('state' in spec && 'style' in spec && 'color' in spec) {
      const buttonSpec = spec as ButtonSpec;
      const result = await generateButton(buttonSpec);
      return {
        success: true,
        buffer: result.image,
        symbolName: result.symbolName,
        dimensions: { width: buttonSpec.width, height: buttonSpec.height }
      };
    }

    // Panel
    if ('backgroundColor' in spec && 'style' in spec && !('progress' in spec)) {
      const panelSpec = spec as PanelSpec;
      const result = await generatePanel(panelSpec);
      return {
        success: true,
        buffer: result.image,
        symbolName: result.symbolName,
        dimensions: { width: panelSpec.width, height: panelSpec.height }
      };
    }

    // Icon
    if ('name' in spec && 'format' in spec && 'size' in spec) {
      const iconSpec = spec as IconSpec;
      const result = await generateIcon(iconSpec);
      return {
        success: true,
        buffer: result.image as Buffer, // Assuming PNG format
        symbolName: result.symbolName,
        dimensions: { width: iconSpec.size, height: iconSpec.size }
      };
    }

    // Progress Bar
    if ('progress' in spec && 'fillColor' in spec) {
      const progressSpec = spec as ProgressBarSpec;
      const result = await generateProgressBar(progressSpec);
      return {
        success: true,
        buffer: result.image,
        symbolName: result.symbolName,
        dimensions: { width: progressSpec.width, height: progressSpec.height }
      };
    }

    // Character (Humanoid)
    if ('class' in spec && 'size' in spec && 'seed' in spec) {
      const humanoidSpec = spec as HumanoidSpec;
      const result = await generateHumanoid(humanoidSpec);

      const additionalFiles: GeneratedFile[] = [];

      // Add sprite sheet if generated
      if (result.spriteSheet) {
        additionalFiles.push({
          path: `${result.symbolName}_sheet.png`,
          buffer: result.spriteSheet.image,
          type: 'png'
        });
      }

      // Add metadata if generated
      if (result.metadata) {
        additionalFiles.push({
          path: `${result.symbolName}_metadata.json`,
          buffer: JSON.stringify(result.metadata, null, 2),
          type: 'json'
        });
      }

      const sizeDimensions = { small: 16, medium: 32, large: 48 };
      const dim = sizeDimensions[humanoidSpec.size];

      return {
        success: true,
        buffer: result.baseSprite,
        symbolName: result.symbolName,
        dimensions: { width: dim, height: dim },
        additionalFiles
      };
    }

    // Tileset
    if ('tileType' in spec && 'tileSize' in spec) {
      const tilesetSpec = spec as TilesetSpec;
      const result = await generateTileset(tilesetSpec);

      return {
        success: true,
        buffer: result.tilesheet || result.tiles[0],
        symbolName: result.symbolName,
        dimensions: { width: tilesetSpec.tileSize, height: tilesetSpec.tileSize }
      };
    }

    // Item
    if ('category' in spec && 'name' in spec && !('class' in spec)) {
      const itemSpec = spec as ItemSpec;
      const result = await generateItem(itemSpec);

      const sizeDimensions = { small: 16, medium: 32, large: 48 };
      const dim = sizeDimensions[itemSpec.size];

      return {
        success: true,
        buffer: result.sprite,
        symbolName: result.symbolName,
        dimensions: { width: dim, height: dim }
      };
    }

    return {
      success: false,
      error: 'Unable to determine generator for specification',
      symbolName: 'unknown',
      dimensions: { width: 0, height: 0 }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown execution error',
      symbolName: 'error',
      dimensions: { width: 0, height: 0 }
    };
  }
}

/**
 * Generate deterministic seed from asset need
 */
function generateSeed(need: AssetNeed): number {
  // Create deterministic seed from need properties
  const seedString = `${need.type}-${need.category || ''}-${need.description}-${need.dimensions?.width || 0}-${need.dimensions?.height || 0}`;

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash);
}

/**
 * Batch generate multiple assets
 */
export async function generateAssetBatch(needs: AssetNeed[]): Promise<AssetGenerationResult[]> {
  const results: AssetGenerationResult[] = [];

  console.log(`[Asset Pipeline] Batch generation: ${needs.length} assets`);

  for (let i = 0; i < needs.length; i++) {
    console.log(`[Asset Pipeline] Processing ${i + 1}/${needs.length}...`);
    const result = await getAsset(needs[i]);
    results.push(result);
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`[Asset Pipeline] Batch complete: ${successCount}/${needs.length} successful`);

  return results;
}

/**
 * Generate asset set for a complete project
 */
export async function generateProjectAssetSet(
  projectType: 'rpg' | 'platformer' | 'puzzle' | 'business-app',
  projectContext: string
): Promise<AssetGenerationResult[]> {
  const needs = getProjectAssetNeeds(projectType, projectContext);
  return generateAssetBatch(needs);
}

/**
 * Get default asset needs for project types
 */
function getProjectAssetNeeds(
  projectType: 'rpg' | 'platformer' | 'puzzle' | 'business-app',
  projectContext: string
): AssetNeed[] {
  const commonUI: AssetNeed[] = [
    {
      type: 'ui',
      category: 'button',
      description: 'Primary action button with glossy style',
      dimensions: { width: 120, height: 40 },
      tags: ['ui', 'button', 'primary'],
      projectContext
    },
    {
      type: 'ui',
      category: 'panel',
      description: 'Main menu panel with bordered style',
      dimensions: { width: 400, height: 300 },
      tags: ['ui', 'panel', 'menu'],
      projectContext
    }
  ];

  switch (projectType) {
    case 'rpg':
      return [
        ...commonUI,
        {
          type: 'sprite',
          category: 'character',
          description: 'Player character warrior class medium size',
          dimensions: { width: 32, height: 32 },
          tags: ['character', 'player', 'warrior'],
          projectContext,
          attributes: { generateAnimations: true }
        },
        {
          type: 'sprite',
          category: 'item',
          description: 'Health potion consumable',
          dimensions: { width: 32, height: 32 },
          tags: ['item', 'consumable', 'potion'],
          projectContext
        },
        {
          type: 'tileset',
          category: 'terrain',
          description: 'Grass terrain tileset',
          dimensions: { width: 32, height: 32 },
          tags: ['tileset', 'terrain', 'grass'],
          projectContext
        },
        {
          type: 'ui',
          category: 'health-bar',
          description: 'Player health bar with gradient style',
          dimensions: { width: 200, height: 20 },
          tags: ['ui', 'health', 'progress-bar'],
          projectContext
        }
      ];

    case 'platformer':
      return [
        ...commonUI,
        {
          type: 'sprite',
          category: 'character',
          description: 'Player character rogue class small size',
          dimensions: { width: 16, height: 16 },
          tags: ['character', 'player', 'platformer'],
          projectContext,
          attributes: { generateAnimations: true }
        },
        {
          type: 'tileset',
          category: 'terrain',
          description: 'Stone platform tileset',
          dimensions: { width: 16, height: 16 },
          tags: ['tileset', 'platform', 'stone'],
          projectContext
        }
      ];

    case 'puzzle':
      return [
        ...commonUI,
        {
          type: 'sprite',
          category: 'collectible',
          description: 'Puzzle piece gem collectible',
          dimensions: { width: 32, height: 32 },
          tags: ['collectible', 'gem', 'puzzle'],
          projectContext
        }
      ];

    case 'business-app':
      return [
        ...commonUI,
        {
          type: 'icon',
          category: 'icon',
          description: 'Save icon',
          dimensions: { width: 24, height: 24 },
          tags: ['icon', 'save'],
          projectContext
        },
        {
          type: 'icon',
          category: 'icon',
          description: 'Settings icon',
          dimensions: { width: 24, height: 24 },
          tags: ['icon', 'settings'],
          projectContext
        },
        {
          type: 'ui',
          category: 'progress-bar',
          description: 'Loading progress bar with standard style',
          dimensions: { width: 300, height: 20 },
          tags: ['ui', 'progress', 'loading'],
          projectContext
        }
      ];

    default:
      return commonUI;
  }
}
