/**
 * Asset Search - Search for assets in registry
 *
 * Purpose: Find assets by tags, type, dimensions, project
 * Authority: Tier 2 (Mandatory for asset discovery)
 * Use: Asset reuse, discovery, exploration
 */

import { searchRegistry, AssetRegistryEntry } from '../autonomous-assets/auto-registrar';

export interface SearchQuery {
  type?: string | string[];
  category?: string | string[];
  tags?: string[]; // Assets must have ALL these tags
  tagsAny?: string[]; // Assets must have ANY of these tags
  dimensions?: { width: number; height: number };
  dimensionsRange?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
  projectContext?: string;
  generationMethod?: string;
  searchText?: string; // Search in name and description
  sortBy?: 'name' | 'createdAt' | 'size' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface SearchResult {
  assets: AssetRegistryEntry[];
  total: number;
  query: SearchQuery;
}

/**
 * Search for assets
 */
export async function searchAssets(query: SearchQuery): Promise<SearchResult> {
  // Get all assets from registry (filtered by basic criteria)
  const basicQuery = {
    type: Array.isArray(query.type) ? query.type[0] : query.type,
    category: Array.isArray(query.category) ? query.category[0] : query.category,
    tags: query.tags,
    dimensions: query.dimensions,
    projectContext: query.projectContext
  };

  let assets = await searchRegistry(basicQuery);

  // Apply additional filters
  assets = applyFilters(assets, query);

  // Sort results
  assets = sortAssets(assets, query.sortBy || 'relevance', query.sortOrder || 'desc', query);

  // Apply limit
  const total = assets.length;
  if (query.limit && query.limit > 0) {
    assets = assets.slice(0, query.limit);
  }

  return {
    assets,
    total,
    query
  };
}

/**
 * Apply advanced filters
 */
function applyFilters(assets: AssetRegistryEntry[], query: SearchQuery): AssetRegistryEntry[] {
  let filtered = [...assets];

  // Filter by type (array support)
  if (query.type && Array.isArray(query.type) && query.type.length > 0) {
    filtered = filtered.filter(a => query.type!.includes(a.type));
  }

  // Filter by category (array support)
  if (query.category && Array.isArray(query.category) && query.category.length > 0) {
    filtered = filtered.filter(a => a.category && query.category!.includes(a.category));
  }

  // Filter by tags (ANY match)
  if (query.tagsAny && query.tagsAny.length > 0) {
    filtered = filtered.filter(a => query.tagsAny!.some(tag => a.tags.includes(tag)));
  }

  // Filter by dimension range
  if (query.dimensionsRange) {
    const range = query.dimensionsRange;
    filtered = filtered.filter(a => {
      if (range.minWidth && a.dimensions.width < range.minWidth) return false;
      if (range.maxWidth && a.dimensions.width > range.maxWidth) return false;
      if (range.minHeight && a.dimensions.height < range.minHeight) return false;
      if (range.maxHeight && a.dimensions.height > range.maxHeight) return false;
      return true;
    });
  }

  // Filter by generation method
  if (query.generationMethod) {
    filtered = filtered.filter(a => a.generationMethod === query.generationMethod);
  }

  // Filter by search text
  if (query.searchText) {
    const searchLower = query.searchText.toLowerCase();
    filtered = filtered.filter(a => {
      return (
        a.name.toLowerCase().includes(searchLower) ||
        a.description.toLowerCase().includes(searchLower) ||
        a.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    });
  }

  return filtered;
}

/**
 * Sort assets
 */
function sortAssets(
  assets: AssetRegistryEntry[],
  sortBy: 'name' | 'createdAt' | 'size' | 'relevance',
  sortOrder: 'asc' | 'desc',
  query: SearchQuery
): AssetRegistryEntry[] {
  const sorted = [...assets];

  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case 'createdAt':
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;

    case 'size':
      sorted.sort((a, b) => a.fileSize - b.fileSize);
      break;

    case 'relevance':
      // Calculate relevance scores
      const scores = new Map<string, number>();
      for (const asset of assets) {
        scores.set(asset.id, calculateRelevance(asset, query));
      }
      sorted.sort((a, b) => scores.get(b.id)! - scores.get(a.id)!);
      break;
  }

  if (sortOrder === 'desc') {
    sorted.reverse();
  }

  return sorted;
}

/**
 * Calculate relevance score for an asset
 */
function calculateRelevance(asset: AssetRegistryEntry, query: SearchQuery): number {
  let score = 0;

  // Exact type match
  if (query.type) {
    const types = Array.isArray(query.type) ? query.type : [query.type];
    if (types.includes(asset.type)) score += 10;
  }

  // Exact category match
  if (query.category && asset.category) {
    const categories = Array.isArray(query.category) ? query.category : [query.category];
    if (categories.includes(asset.category)) score += 10;
  }

  // Tag matches
  if (query.tags) {
    const matchingTags = query.tags.filter(tag => asset.tags.includes(tag));
    score += matchingTags.length * 5;
  }

  if (query.tagsAny) {
    const matchingTags = query.tagsAny.filter(tag => asset.tags.includes(tag));
    score += matchingTags.length * 3;
  }

  // Exact dimension match
  if (query.dimensions) {
    if (asset.dimensions.width === query.dimensions.width &&
        asset.dimensions.height === query.dimensions.height) {
      score += 15;
    }
  }

  // Project context match
  if (query.projectContext && asset.projectContext === query.projectContext) {
    score += 8;
  }

  // Search text match (weighted by location)
  if (query.searchText) {
    const searchLower = query.searchText.toLowerCase();

    // Name match (highest weight)
    if (asset.name.toLowerCase().includes(searchLower)) {
      score += 20;
      if (asset.name.toLowerCase() === searchLower) {
        score += 10; // Exact match bonus
      }
    }

    // Description match
    if (asset.description.toLowerCase().includes(searchLower)) {
      score += 5;
    }

    // Tag match
    if (asset.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
      score += 8;
    }
  }

  // Recency bonus (newer assets get slight boost)
  const ageInDays = (Date.now() - new Date(asset.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (ageInDays < 7) {
    score += 2;
  } else if (ageInDays < 30) {
    score += 1;
  }

  return score;
}

/**
 * Find similar assets
 */
export async function findSimilar(
  assetId: string,
  limit: number = 5
): Promise<AssetRegistryEntry[]> {
  // Get the reference asset
  const allAssets = await searchRegistry({});
  const referenceAsset = allAssets.find(a => a.id === assetId);

  if (!referenceAsset) {
    return [];
  }

  // Search for similar assets
  const result = await searchAssets({
    type: referenceAsset.type,
    category: referenceAsset.category,
    tagsAny: referenceAsset.tags,
    dimensionsRange: {
      minWidth: Math.floor(referenceAsset.dimensions.width * 0.75),
      maxWidth: Math.ceil(referenceAsset.dimensions.width * 1.25),
      minHeight: Math.floor(referenceAsset.dimensions.height * 0.75),
      maxHeight: Math.ceil(referenceAsset.dimensions.height * 1.25)
    },
    sortBy: 'relevance',
    limit: limit + 1 // +1 to account for the reference asset itself
  });

  // Exclude the reference asset from results
  return result.assets.filter(a => a.id !== assetId).slice(0, limit);
}

/**
 * Quick search presets
 */
export const SEARCH_PRESETS = {
  /**
   * Find all UI components
   */
  allUI: (): SearchQuery => ({
    type: 'ui',
    sortBy: 'name'
  }),

  /**
   * Find all character sprites
   */
  allCharacters: (): SearchQuery => ({
    type: 'sprite',
    category: 'character',
    sortBy: 'name'
  }),

  /**
   * Find all items
   */
  allItems: (): SearchQuery => ({
    type: 'sprite',
    category: ['item', 'consumable', 'equipment', 'collectible', 'currency'],
    sortBy: 'name'
  }),

  /**
   * Find all tilesets
   */
  allTilesets: (): SearchQuery => ({
    type: 'tileset',
    sortBy: 'name'
  }),

  /**
   * Find recently created assets
   */
  recent: (days: number = 7): SearchQuery => ({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 20
  }),

  /**
   * Find large assets
   */
  large: (minSizeKB: number = 100): SearchQuery => ({
    sortBy: 'size',
    sortOrder: 'desc'
  }),

  /**
   * Find assets by project
   */
  byProject: (projectContext: string): SearchQuery => ({
    projectContext,
    sortBy: 'name'
  })
};
