/**
 * Index Builder - Build searchable index from asset registry
 *
 * Purpose: Create optimized search index for fast asset discovery
 * Authority: Tier 2 (Mandatory for asset indexing)
 * Use: Fast asset search, autocomplete, suggestions
 */

import * as fs from 'fs';
import * as path from 'path';
import { searchRegistry, AssetRegistryEntry } from '../autonomous-assets/auto-registrar';

export interface AssetIndex {
  version: string;
  buildDate: string;
  totalAssets: number;

  // Inverted indexes for fast lookup
  byType: Map<string, string[]>; // type -> asset IDs
  byCategory: Map<string, string[]>; // category -> asset IDs
  byTag: Map<string, string[]>; // tag -> asset IDs
  byProject: Map<string, string[]>; // project -> asset IDs
  byDimension: Map<string, string[]>; // "WxH" -> asset IDs

  // Full-text search index
  textIndex: Map<string, string[]>; // word -> asset IDs

  // Asset data (for quick retrieval)
  assets: Map<string, AssetRegistryEntry>; // asset ID -> asset data
}

const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const INDEX_PATH = path.join(WORKSPACE_ROOT, 'asset-system', 'ASSET_INDEX.json');

/**
 * Build complete asset index
 */
export async function buildIndex(): Promise<AssetIndex> {
  console.log('[Index Builder] Building asset index...');

  // Load all assets from registry
  const assets = await searchRegistry({});

  const index: AssetIndex = {
    version: '1.0.0',
    buildDate: new Date().toISOString(),
    totalAssets: assets.length,
    byType: new Map(),
    byCategory: new Map(),
    byTag: new Map(),
    byProject: new Map(),
    byDimension: new Map(),
    textIndex: new Map(),
    assets: new Map()
  };

  // Build indexes
  for (const asset of assets) {
    // Store asset data
    index.assets.set(asset.id, asset);

    // Index by type
    addToIndex(index.byType, asset.type, asset.id);

    // Index by category
    if (asset.category) {
      addToIndex(index.byCategory, asset.category, asset.id);
    }

    // Index by tags
    for (const tag of asset.tags) {
      addToIndex(index.byTag, tag, asset.id);
    }

    // Index by project
    if (asset.projectContext) {
      addToIndex(index.byProject, asset.projectContext, asset.id);
    }

    // Index by dimensions
    const dimKey = `${asset.dimensions.width}x${asset.dimensions.height}`;
    addToIndex(index.byDimension, dimKey, asset.id);

    // Index for full-text search
    indexText(index.textIndex, asset.name, asset.id);
    indexText(index.textIndex, asset.description, asset.id);
    for (const tag of asset.tags) {
      indexText(index.textIndex, tag, asset.id);
    }
  }

  console.log(`[Index Builder] Indexed ${assets.length} assets`);
  console.log(`[Index Builder] - Types: ${index.byType.size}`);
  console.log(`[Index Builder] - Categories: ${index.byCategory.size}`);
  console.log(`[Index Builder] - Tags: ${index.byTag.size}`);
  console.log(`[Index Builder] - Projects: ${index.byProject.size}`);
  console.log(`[Index Builder] - Dimensions: ${index.byDimension.size}`);
  console.log(`[Index Builder] - Text terms: ${index.textIndex.size}`);

  return index;
}

/**
 * Add asset ID to index map
 */
function addToIndex(indexMap: Map<string, string[]>, key: string, assetId: string): void {
  if (!indexMap.has(key)) {
    indexMap.set(key, []);
  }
  indexMap.get(key)!.push(assetId);
}

/**
 * Index text for full-text search
 */
function indexText(textIndex: Map<string, string[]>, text: string, assetId: string): void {
  // Tokenize text (simple word splitting)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // Remove special chars except hyphen
    .split(/\s+/)
    .filter(w => w.length > 2); // Ignore very short words

  for (const word of words) {
    addToIndex(textIndex, word, assetId);
  }
}

/**
 * Save index to disk
 */
export async function saveIndex(index: AssetIndex): Promise<void> {
  // Convert Maps to objects for JSON serialization
  const serializable = {
    version: index.version,
    buildDate: index.buildDate,
    totalAssets: index.totalAssets,
    byType: Object.fromEntries(index.byType),
    byCategory: Object.fromEntries(index.byCategory),
    byTag: Object.fromEntries(index.byTag),
    byProject: Object.fromEntries(index.byProject),
    byDimension: Object.fromEntries(index.byDimension),
    textIndex: Object.fromEntries(index.textIndex),
    assets: Object.fromEntries(
      Array.from(index.assets.entries()).map(([id, asset]) => [id, asset])
    )
  };

  // Ensure directory exists
  const indexDir = path.dirname(INDEX_PATH);
  if (!fs.existsSync(indexDir)) {
    fs.mkdirSync(indexDir, { recursive: true });
  }

  // Write index file
  fs.writeFileSync(INDEX_PATH, JSON.stringify(serializable, null, 2), 'utf-8');

  console.log(`[Index Builder] Index saved to ${INDEX_PATH}`);
}

/**
 * Load index from disk
 */
export async function loadIndex(): Promise<AssetIndex | null> {
  if (!fs.existsSync(INDEX_PATH)) {
    return null;
  }

  try {
    const content = fs.readFileSync(INDEX_PATH, 'utf-8');
    const data = JSON.parse(content);

    // Convert objects back to Maps
    const index: AssetIndex = {
      version: data.version,
      buildDate: data.buildDate,
      totalAssets: data.totalAssets,
      byType: new Map(Object.entries(data.byType)),
      byCategory: new Map(Object.entries(data.byCategory)),
      byTag: new Map(Object.entries(data.byTag)),
      byProject: new Map(Object.entries(data.byProject)),
      byDimension: new Map(Object.entries(data.byDimension)),
      textIndex: new Map(Object.entries(data.textIndex)),
      assets: new Map(Object.entries(data.assets))
    };

    return index;
  } catch (error) {
    console.error('[Index Builder] Failed to load index:', error);
    return null;
  }
}

/**
 * Rebuild index (build and save)
 */
export async function rebuildIndex(): Promise<AssetIndex> {
  const index = await buildIndex();
  await saveIndex(index);
  return index;
}

/**
 * Check if index needs rebuild
 */
export async function needsRebuild(): Promise<boolean> {
  const index = await loadIndex();

  if (!index) {
    return true; // No index exists
  }

  // Check if index is older than registry
  const registryPath = path.join(WORKSPACE_ROOT, 'asset-system', 'ASSET_REGISTRY.md');

  if (!fs.existsSync(registryPath)) {
    return false; // No registry
  }

  const registryModTime = fs.statSync(registryPath).mtime.getTime();
  const indexBuildTime = new Date(index.buildDate).getTime();

  return registryModTime > indexBuildTime;
}

/**
 * Get index statistics
 */
export async function getIndexStats(): Promise<{
  exists: boolean;
  buildDate?: string;
  totalAssets?: number;
  needsRebuild: boolean;
  indexSize?: number;
}> {
  const exists = fs.existsSync(INDEX_PATH);
  const needs = await needsRebuild();

  if (!exists) {
    return { exists: false, needsRebuild: needs };
  }

  const index = await loadIndex();
  const stats = fs.statSync(INDEX_PATH);

  return {
    exists: true,
    buildDate: index?.buildDate,
    totalAssets: index?.totalAssets,
    needsRebuild: needs,
    indexSize: stats.size
  };
}

/**
 * Search using index (faster than registry search)
 */
export async function searchWithIndex(query: {
  type?: string;
  category?: string;
  tags?: string[];
  projectContext?: string;
  dimensions?: { width: number; height: number };
  searchText?: string;
}): Promise<AssetRegistryEntry[]> {
  // Load or rebuild index
  let index = await loadIndex();

  if (!index || (await needsRebuild())) {
    console.log('[Index Search] Rebuilding index...');
    index = await rebuildIndex();
  }

  // Start with all asset IDs
  let resultIds = new Set<string>(index.assets.keys());

  // Apply filters using index
  if (query.type) {
    const typeIds = index.byType.get(query.type) || [];
    resultIds = intersect(resultIds, new Set(typeIds));
  }

  if (query.category) {
    const categoryIds = index.byCategory.get(query.category) || [];
    resultIds = intersect(resultIds, new Set(categoryIds));
  }

  if (query.tags) {
    for (const tag of query.tags) {
      const tagIds = index.byTag.get(tag) || [];
      resultIds = intersect(resultIds, new Set(tagIds));
    }
  }

  if (query.projectContext) {
    const projectIds = index.byProject.get(query.projectContext) || [];
    resultIds = intersect(resultIds, new Set(projectIds));
  }

  if (query.dimensions) {
    const dimKey = `${query.dimensions.width}x${query.dimensions.height}`;
    const dimIds = index.byDimension.get(dimKey) || [];
    resultIds = intersect(resultIds, new Set(dimIds));
  }

  if (query.searchText) {
    const words = query.searchText.toLowerCase().split(/\s+/);
    const textIds = new Set<string>();

    for (const word of words) {
      const wordIds = index.textIndex.get(word) || [];
      for (const id of wordIds) {
        textIds.add(id);
      }
    }

    resultIds = intersect(resultIds, textIds);
  }

  // Retrieve asset data
  const results: AssetRegistryEntry[] = [];
  for (const id of resultIds) {
    const asset = index.assets.get(id);
    if (asset) {
      results.push(asset);
    }
  }

  return results;
}

/**
 * Set intersection helper
 */
function intersect<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const item of setA) {
    if (setB.has(item)) {
      result.add(item);
    }
  }
  return result;
}
