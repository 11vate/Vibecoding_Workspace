/**
 * Asset Decision Engine - Autonomous asset sourcing decisions
 *
 * Purpose: Decide how to source assets (reuse vs generate, which method)
 * Authority: Tier 2 (Mandatory for autonomous asset generation)
 * Use: AI model asset decision-making
 */

export interface AssetNeed {
  type: 'sprite' | 'ui' | 'texture' | 'icon' | 'tileset' | 'animation';
  category?: string; // e.g., 'character', 'item', 'button', 'terrain'
  description: string; // Human-readable description
  dimensions?: { width: number; height: number };
  attributes?: Record<string, any>; // Additional attributes
  tags?: string[]; // Search tags
  projectContext?: string; // Project name/ID
}

export interface AssetDecision {
  action: 'reuse' | 'generate';
  method?: GenerationMethod; // Only if action is 'generate'
  existingAsset?: AssetReference; // Only if action is 'reuse'
  reasoning: string; // Explanation of decision
  confidence: number; // 0.0 to 1.0
}

export type GenerationMethod =
  | 'geometric' // Canvas API - shapes, gradients, UI
  | 'pixel-art-symmetry' // Algorithmic pixel art - symmetry
  | 'pixel-art-cellular' // Algorithmic pixel art - cellular automata
  | 'noise-texture' // Perlin/Simplex noise
  | 'svg-code' // SVG code generation
  | 'animation-interpolation'; // Frame interpolation

export interface AssetReference {
  id: string;
  path: string;
  name: string;
  tags: string[];
  dimensions: { width: number; height: number };
}

/**
 * Decide how to source an asset
 */
export async function decideAssetSourcing(need: AssetNeed): Promise<AssetDecision> {
  // Step 1: Search for existing assets
  const existingAssets = await searchExistingAssets(need);

  // Step 2: Evaluate if any existing asset is suitable
  if (existingAssets.length > 0) {
    const bestMatch = findBestMatch(existingAssets, need);
    if (bestMatch.confidence > 0.7) {
      // High confidence match found - reuse
      return {
        action: 'reuse',
        existingAsset: bestMatch.asset,
        reasoning: `Found existing asset "${bestMatch.asset.name}" with ${Math.round(bestMatch.confidence * 100)}% match`,
        confidence: bestMatch.confidence
      };
    }
  }

  // Step 3: Decide generation method
  const method = selectGenerationMethod(need);

  return {
    action: 'generate',
    method,
    reasoning: `No suitable existing asset found. Will generate using ${method} method.`,
    confidence: calculateGenerationConfidence(need, method)
  };
}

/**
 * Search for existing assets (mock implementation - will read from ASSET_REGISTRY.md)
 */
async function searchExistingAssets(need: AssetNeed): Promise<AssetReference[]> {
  // TODO: Implement actual registry search
  // For now, return empty array (assuming registry is empty)
  // In production, this would:
  // 1. Read ASSET_REGISTRY.md
  // 2. Parse entries
  // 3. Match by tags, type, dimensions, description
  // 4. Return matching assets sorted by relevance

  return [];
}

/**
 * Find best matching asset from candidates
 */
function findBestMatch(
  candidates: AssetReference[],
  need: AssetNeed
): { asset: AssetReference; confidence: number } {
  let bestAsset = candidates[0];
  let bestScore = 0;

  for (const candidate of candidates) {
    let score = 0;

    // Match tags
    if (need.tags) {
      const matchingTags = candidate.tags.filter(t => need.tags!.includes(t));
      score += (matchingTags.length / need.tags.length) * 0.5; // 50% weight for tags
    }

    // Match dimensions
    if (need.dimensions) {
      const widthMatch = candidate.dimensions.width === need.dimensions.width;
      const heightMatch = candidate.dimensions.height === need.dimensions.height;
      if (widthMatch && heightMatch) {
        score += 0.3; // 30% weight for exact dimension match
      }
    }

    // Match description (simple keyword matching)
    const descWords = need.description.toLowerCase().split(' ');
    const nameWords = candidate.name.toLowerCase().split(/[-_\s]/);
    const matchingWords = descWords.filter(w => nameWords.some(nw => nw.includes(w)));
    score += (matchingWords.length / descWords.length) * 0.2; // 20% weight for description

    if (score > bestScore) {
      bestScore = score;
      bestAsset = candidate;
    }
  }

  return { asset: bestAsset, confidence: bestScore };
}

/**
 * Select appropriate generation method based on need
 */
function selectGenerationMethod(need: AssetNeed): GenerationMethod {
  // Decision tree for generation method selection

  // UI elements -> geometric
  if (need.type === 'ui' || need.category === 'button' || need.category === 'panel') {
    return 'geometric';
  }

  // Icons -> SVG code generation
  if (need.type === 'icon') {
    return 'svg-code';
  }

  // Textures, tilesets -> noise
  if (need.type === 'texture' || need.type === 'tileset' || need.category === 'terrain') {
    return 'noise-texture';
  }

  // Animations -> interpolation
  if (need.type === 'animation') {
    return 'animation-interpolation';
  }

  // Characters, creatures -> pixel art (choose based on complexity)
  if (need.category === 'character' || need.category === 'creature' || need.category === 'npc') {
    // Use symmetry for humanoids, cellular automata for organic creatures
    if (need.description.toLowerCase().includes('humanoid') ||
        need.description.toLowerCase().includes('character')) {
      return 'pixel-art-symmetry';
    } else {
      return 'pixel-art-cellular';
    }
  }

  // Items -> pixel art symmetry
  if (need.category === 'item' || need.category === 'equipment' || need.category === 'consumable') {
    return 'pixel-art-symmetry';
  }

  // Default to pixel art symmetry for sprites
  if (need.type === 'sprite') {
    return 'pixel-art-symmetry';
  }

  // Fallback
  return 'geometric';
}

/**
 * Calculate confidence in generation method
 */
function calculateGenerationConfidence(need: AssetNeed, method: GenerationMethod): number {
  // High confidence for well-defined needs
  let confidence = 0.8;

  // Increase confidence if dimensions are specified
  if (need.dimensions) {
    confidence += 0.1;
  }

  // Increase confidence if attributes are specified
  if (need.attributes && Object.keys(need.attributes).length > 0) {
    confidence += 0.05;
  }

  // Decrease confidence for vague descriptions
  if (need.description.split(' ').length < 3) {
    confidence -= 0.15;
  }

  return Math.min(1.0, Math.max(0.0, confidence));
}

/**
 * Batch decision making for multiple assets
 */
export async function decideBatchAssetSourcing(needs: AssetNeed[]): Promise<AssetDecision[]> {
  const decisions: AssetDecision[] = [];

  for (const need of needs) {
    const decision = await decideAssetSourcing(need);
    decisions.push(decision);
  }

  return decisions;
}

/**
 * Evaluate if generation is feasible for a given need
 */
export function canGenerate(need: AssetNeed): { feasible: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check if type is supported
  const supportedTypes = ['sprite', 'ui', 'texture', 'icon', 'tileset', 'animation'];
  if (!supportedTypes.includes(need.type)) {
    issues.push(`Unsupported asset type: ${need.type}`);
  }

  // Check if dimensions are reasonable
  if (need.dimensions) {
    if (need.dimensions.width > 2048 || need.dimensions.height > 2048) {
      issues.push('Dimensions too large (max 2048x2048)');
    }
    if (need.dimensions.width < 8 || need.dimensions.height < 8) {
      issues.push('Dimensions too small (min 8x8)');
    }
  }

  // Check if description is provided
  if (!need.description || need.description.trim().length === 0) {
    issues.push('No description provided');
  }

  return {
    feasible: issues.length === 0,
    issues
  };
}

/**
 * Suggest improvements to asset need specification
 */
export function suggestImprovements(need: AssetNeed): string[] {
  const suggestions: string[] = [];

  if (!need.dimensions) {
    suggestions.push('Consider specifying dimensions for more precise generation');
  }

  if (!need.tags || need.tags.length === 0) {
    suggestions.push('Add tags to improve future asset discovery and reuse');
  }

  if (!need.category) {
    suggestions.push('Specify a category for better generation method selection');
  }

  if (need.description.split(' ').length < 5) {
    suggestions.push('Provide more detailed description for better results');
  }

  if (!need.projectContext) {
    suggestions.push('Add project context to enable project-scoped asset management');
  }

  return suggestions;
}
