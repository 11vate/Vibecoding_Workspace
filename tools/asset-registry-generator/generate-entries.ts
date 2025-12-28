/**
 * Entry Generator - Auto-generate registry entries from scanned assets
 *
 * Purpose: Create registry entries for unregistered assets
 * Authority: Tier 2 (Mandatory for registry management)
 * Use: Bulk registration, registry bootstrapping
 */

import { ScannedAsset } from './scan-assets';
import { AssetRegistryEntry } from '../autonomous-assets/auto-registrar';
import * as path from 'path';

/**
 * Generate registry entry from scanned asset
 */
export function generateEntry(asset: ScannedAsset): AssetRegistryEntry {
  // Infer asset type from path and extension
  const type = inferType(asset.filePath, asset.extension);

  // Infer category from path
  const category = inferCategory(asset.filePath, type);

  // Generate ID
  const id = generateId(asset.fileName, type, category, asset.dimensions);

  // Generate name
  const name = generateName(asset.fileName);

  // Infer tags
  const tags = inferTags(asset.filePath, asset.fileName, type, category);

  // Generate description
  const description = generateDescription(asset.fileName, type, category);

  // Infer project context
  const projectContext = inferProjectContext(asset.filePath);

  // Generate seed (deterministic from file path)
  const seed = generateSeed(asset.filePath);

  return {
    id,
    name,
    path: asset.filePath,
    type,
    category,
    dimensions: asset.dimensions || { width: 0, height: 0 },
    tags,
    description,
    projectContext,
    generationMethod: 'unknown',
    seed,
    createdAt: asset.modifiedDate.toISOString(),
    fileSize: asset.fileSize
  };
}

/**
 * Infer asset type from path
 */
function inferType(filePath: string, extension: string): string {
  const pathLower = filePath.toLowerCase();

  if (pathLower.includes('/ui/') || pathLower.includes('\\ui\\')) {
    return 'ui';
  }

  if (pathLower.includes('/icon/') || pathLower.includes('\\icon\\')) {
    return 'icon';
  }

  if (pathLower.includes('/tileset/') || pathLower.includes('\\tileset\\') ||
      pathLower.includes('/tile/') || pathLower.includes('\\tile\\')) {
    return 'tileset';
  }

  if (pathLower.includes('/texture/') || pathLower.includes('\\texture\\') ||
      pathLower.includes('/background/') || pathLower.includes('\\background\\')) {
    return 'texture';
  }

  if (pathLower.includes('/anim/') || pathLower.includes('\\anim\\') ||
      pathLower.includes('/animation/') || pathLower.includes('\\animation\\')) {
    return 'animation';
  }

  // Default to sprite
  return 'sprite';
}

/**
 * Infer category from path
 */
function inferCategory(filePath: string, type: string): string | undefined {
  const pathLower = filePath.toLowerCase();

  // UI categories
  if (type === 'ui') {
    if (pathLower.includes('/button/')) return 'button';
    if (pathLower.includes('/panel/')) return 'panel';
    if (pathLower.includes('/dialog/')) return 'dialog';
    if (pathLower.includes('/menu/')) return 'menu';
  }

  // Sprite categories
  if (type === 'sprite') {
    if (pathLower.includes('/character/')) return 'character';
    if (pathLower.includes('/item/')) return 'item';
    if (pathLower.includes('/enemy/') || pathLower.includes('/creature/')) return 'creature';
    if (pathLower.includes('/npc/')) return 'npc';
    if (pathLower.includes('/consumable/')) return 'consumable';
    if (pathLower.includes('/equipment/')) return 'equipment';
    if (pathLower.includes('/collectible/')) return 'collectible';
    if (pathLower.includes('/currency/')) return 'currency';
  }

  // Tileset categories
  if (type === 'tileset') {
    if (pathLower.includes('/terrain/')) return 'terrain';
    if (pathLower.includes('/dungeon/')) return 'dungeon';
    if (pathLower.includes('/interior/')) return 'interior';
  }

  return undefined;
}

/**
 * Generate ID from asset attributes
 */
function generateId(
  fileName: string,
  type: string,
  category: string | undefined,
  dimensions: { width: number; height: number } | undefined
): string {
  // Remove extension
  const baseName = fileName.replace(/\.[^.]+$/, '');

  // Sanitize name
  const sanitizedName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Build ID parts
  const parts = [type];

  if (category) {
    parts.push(category);
  }

  parts.push(sanitizedName);

  if (dimensions && dimensions.width > 0 && dimensions.height > 0) {
    parts.push(`${dimensions.width}x${dimensions.height}`);
  }

  return parts.join('-');
}

/**
 * Generate name from file name
 */
function generateName(fileName: string): string {
  // Remove extension
  const baseName = fileName.replace(/\.[^.]+$/, '');

  // Convert to title case
  return baseName
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Infer tags from path and name
 */
function inferTags(filePath: string, fileName: string, type: string, category: string | undefined): string[] {
  const tags = new Set<string>();

  // Add type
  tags.add(type);

  // Add category
  if (category) {
    tags.add(category);
  }

  // Parse path components
  const pathParts = filePath.split(/[/\\]/);

  for (const part of pathParts) {
    const partLower = part.toLowerCase();

    // Skip common directory names
    if (['assets', 'sprites', 'images', 'ui', 'icons'].includes(partLower)) {
      continue;
    }

    // Add as tag if it looks meaningful
    if (partLower.length > 2 && /^[a-z0-9-]+$/.test(partLower)) {
      tags.add(partLower);
    }
  }

  // Parse file name for keywords
  const nameLower = fileName.toLowerCase();

  const keywords = [
    'button', 'panel', 'icon', 'menu', 'dialog', 'window',
    'character', 'player', 'enemy', 'npc', 'creature',
    'item', 'weapon', 'armor', 'potion', 'consumable', 'equipment',
    'tile', 'terrain', 'grass', 'stone', 'water', 'dungeon',
    'primary', 'secondary', 'normal', 'hover', 'pressed', 'disabled',
    'small', 'medium', 'large', 'tiny', 'huge'
  ];

  for (const keyword of keywords) {
    if (nameLower.includes(keyword)) {
      tags.add(keyword);
    }
  }

  return Array.from(tags);
}

/**
 * Generate description from file name and type
 */
function generateDescription(fileName: string, type: string, category: string | undefined): string {
  const name = generateName(fileName);

  if (category) {
    return `${name} (${category} ${type})`;
  } else {
    return `${name} (${type})`;
  }
}

/**
 * Infer project context from path
 */
function inferProjectContext(filePath: string): string | undefined {
  // Look for project folder patterns
  const parts = filePath.split(/[/\\]/);

  // Check for common project directory patterns
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const partLower = part.toLowerCase();

    // Skip assets directory
    if (partLower === 'assets') {
      // Next part might be project name
      if (i + 1 < parts.length) {
        const nextPart = parts[i + 1];
        // If it's not a type folder, it's likely a project name
        if (!['sprite', 'ui', 'texture', 'icon', 'tileset'].includes(nextPart.toLowerCase())) {
          return nextPart;
        }
      }
    }

    // Check for explicit project markers
    if (partLower.includes('project-') || partLower.includes('-project')) {
      return part;
    }
  }

  return undefined;
}

/**
 * Generate deterministic seed from file path
 */
function generateSeed(filePath: string): number {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < filePath.length; i++) {
    const char = filePath.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Batch generate entries
 */
export function generateEntries(assets: ScannedAsset[]): AssetRegistryEntry[] {
  return assets.map(asset => generateEntry(asset));
}
