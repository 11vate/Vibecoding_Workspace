/**
 * Auto Registrar - Automatically register generated assets
 *
 * Purpose: Register generated assets in ASSET_REGISTRY.md
 * Authority: Tier 2 (Mandatory for autonomous asset generation)
 * Use: Asset registry management
 */

import * as fs from 'fs';
import * as path from 'path';
import { GenerationMethod } from './asset-decision-engine';

export interface AssetRegistrationRequest {
  name: string;
  type: string;
  category?: string;
  dimensions: { width: number; height: number };
  tags: string[];
  description: string;
  projectContext?: string;
  generationMethod: GenerationMethod;
  seed: number;
  buffer: Buffer | string;
}

export interface AssetRegistryEntry {
  id: string;
  name: string;
  path: string;
  type: string;
  category?: string;
  dimensions: { width: number; height: number };
  tags: string[];
  description: string;
  projectContext?: string;
  generationMethod: GenerationMethod;
  seed: number;
  createdAt: string;
  fileSize: number;
}

const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const ASSET_REGISTRY_PATH = path.join(WORKSPACE_ROOT, 'asset-system', 'ASSET_REGISTRY.md');
const ASSETS_DIR = path.join(WORKSPACE_ROOT, 'assets');

/**
 * Register generated asset
 */
export async function registerAsset(request: AssetRegistrationRequest): Promise<AssetRegistryEntry> {
  // Step 1: Ensure assets directory exists
  ensureDirectoriesExist(request);

  // Step 2: Save asset file
  const assetPath = await saveAssetFile(request);

  // Step 3: Create registry entry
  const entry: AssetRegistryEntry = {
    id: generateAssetId(request),
    name: request.name,
    path: assetPath,
    type: request.type,
    category: request.category,
    dimensions: request.dimensions,
    tags: request.tags,
    description: request.description,
    projectContext: request.projectContext,
    generationMethod: request.generationMethod,
    seed: request.seed,
    createdAt: new Date().toISOString(),
    fileSize: Buffer.isBuffer(request.buffer) ? request.buffer.length : Buffer.from(request.buffer).length
  };

  // Step 4: Update registry file
  await updateRegistry(entry);

  console.log(`[Asset Registry] Registered: ${entry.name} at ${entry.path}`);

  return entry;
}

/**
 * Ensure necessary directories exist
 */
function ensureDirectoriesExist(request: AssetRegistrationRequest): void {
  const basePath = path.join(ASSETS_DIR, request.type);

  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  if (request.category) {
    const categoryPath = path.join(basePath, request.category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
  }

  if (request.projectContext) {
    const projectPath = request.category
      ? path.join(basePath, request.category, request.projectContext)
      : path.join(basePath, request.projectContext);

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }
  }
}

/**
 * Save asset file to disk
 */
async function saveAssetFile(request: AssetRegistrationRequest): Promise<string> {
  // Determine file path
  let dirPath = path.join(ASSETS_DIR, request.type);

  if (request.category) {
    dirPath = path.join(dirPath, request.category);
  }

  if (request.projectContext) {
    dirPath = path.join(dirPath, request.projectContext);
  }

  // Determine file extension
  const ext = Buffer.isBuffer(request.buffer) ? '.png' : '.svg';

  // Sanitize filename
  const sanitizedName = sanitizeFilename(request.name);
  const fileName = `${sanitizedName}${ext}`;
  const filePath = path.join(dirPath, fileName);

  // Write file
  if (Buffer.isBuffer(request.buffer)) {
    fs.writeFileSync(filePath, request.buffer);
  } else {
    fs.writeFileSync(filePath, request.buffer, 'utf-8');
  }

  // Return relative path from workspace root
  return path.relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/');
}

/**
 * Update ASSET_REGISTRY.md with new entry
 */
async function updateRegistry(entry: AssetRegistryEntry): Promise<void> {
  // Ensure registry file exists
  if (!fs.existsSync(ASSET_REGISTRY_PATH)) {
    initializeRegistry();
  }

  // Read current registry
  let registryContent = fs.readFileSync(ASSET_REGISTRY_PATH, 'utf-8');

  // Check if entry already exists (by ID)
  if (registryContent.includes(`**ID**: ${entry.id}`)) {
    console.log(`[Asset Registry] Entry ${entry.id} already exists, skipping`);
    return;
  }

  // Create entry markdown
  const entryMarkdown = formatRegistryEntry(entry);

  // Find insertion point (before "---" at end, or append if not found)
  const endMarker = '\n---\n';
  const endMarkerIndex = registryContent.lastIndexOf(endMarker);

  if (endMarkerIndex !== -1) {
    // Insert before end marker
    registryContent =
      registryContent.slice(0, endMarkerIndex) +
      '\n' +
      entryMarkdown +
      '\n' +
      registryContent.slice(endMarkerIndex);
  } else {
    // Append to end
    registryContent += '\n\n' + entryMarkdown + '\n';
  }

  // Write updated registry
  fs.writeFileSync(ASSET_REGISTRY_PATH, registryContent, 'utf-8');
}

/**
 * Initialize empty registry file
 */
function initializeRegistry(): void {
  const registryDir = path.dirname(ASSET_REGISTRY_PATH);
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }

  const initialContent = `# Asset Registry

**Authority**: Tier 1 (Immutable Constitutional Law)
**Purpose**: Central registry of all workspace assets

This file tracks all assets in the workspace, enabling intelligent reuse and preventing duplication.

## Registry Entries

---
`;

  fs.writeFileSync(ASSET_REGISTRY_PATH, initialContent, 'utf-8');
}

/**
 * Format registry entry as markdown
 */
function formatRegistryEntry(entry: AssetRegistryEntry): string {
  const tags = entry.tags.map(t => `\`${t}\``).join(', ');
  const dimensions = `${entry.dimensions.width}x${entry.dimensions.height}`;

  return `### ${entry.name}

**ID**: ${entry.id}
**Type**: ${entry.type}${entry.category ? ` | **Category**: ${entry.category}` : ''}
**Dimensions**: ${dimensions}
**Tags**: ${tags}
**Path**: \`${entry.path}\`
**Description**: ${entry.description}
**Generation Method**: ${entry.generationMethod}
**Seed**: ${entry.seed}
**Created**: ${entry.createdAt}
**Size**: ${formatFileSize(entry.fileSize)}${entry.projectContext ? `\n**Project**: ${entry.projectContext}` : ''}

---`;
}

/**
 * Generate unique asset ID
 */
function generateAssetId(request: AssetRegistrationRequest): string {
  // Create ID from type-category-name-dimensions
  const parts = [
    request.type,
    request.category || 'misc',
    sanitizeFilename(request.name),
    `${request.dimensions.width}x${request.dimensions.height}`
  ];

  return parts.join('-').toLowerCase();
}

/**
 * Sanitize filename (remove special characters)
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Search registry for existing assets
 */
export async function searchRegistry(query: {
  type?: string;
  category?: string;
  tags?: string[];
  dimensions?: { width: number; height: number };
  projectContext?: string;
}): Promise<AssetRegistryEntry[]> {
  // Read registry
  if (!fs.existsSync(ASSET_REGISTRY_PATH)) {
    return [];
  }

  const registryContent = fs.readFileSync(ASSET_REGISTRY_PATH, 'utf-8');

  // Parse entries (simplified - in production would use proper markdown parser)
  const entries = parseRegistryEntries(registryContent);

  // Filter by query
  return entries.filter(entry => {
    if (query.type && entry.type !== query.type) return false;
    if (query.category && entry.category !== query.category) return false;
    if (query.projectContext && entry.projectContext !== query.projectContext) return false;

    if (query.tags) {
      const hasAllTags = query.tags.every(tag => entry.tags.includes(tag));
      if (!hasAllTags) return false;
    }

    if (query.dimensions) {
      if (entry.dimensions.width !== query.dimensions.width ||
          entry.dimensions.height !== query.dimensions.height) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Parse registry entries from markdown
 */
function parseRegistryEntries(content: string): AssetRegistryEntry[] {
  const entries: AssetRegistryEntry[] = [];

  // Split by entry separator
  const sections = content.split('---').filter(s => s.trim().length > 0);

  for (const section of sections) {
    if (!section.includes('**ID**:')) continue;

    const entry = parseRegistryEntry(section);
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

/**
 * Parse single registry entry
 */
function parseRegistryEntry(section: string): AssetRegistryEntry | null {
  try {
    // Extract fields using regex
    const idMatch = section.match(/\*\*ID\*\*:\s*(.+)/);
    const typeMatch = section.match(/\*\*Type\*\*:\s*(.+?)(?:\s*\||$)/);
    const categoryMatch = section.match(/\*\*Category\*\*:\s*(.+)/);
    const dimensionsMatch = section.match(/\*\*Dimensions\*\*:\s*(\d+)x(\d+)/);
    const tagsMatch = section.match(/\*\*Tags\*\*:\s*(.+)/);
    const pathMatch = section.match(/\*\*Path\*\*:\s*`(.+?)`/);
    const descMatch = section.match(/\*\*Description\*\*:\s*(.+)/);
    const methodMatch = section.match(/\*\*Generation Method\*\*:\s*(.+)/);
    const seedMatch = section.match(/\*\*Seed\*\*:\s*(\d+)/);
    const createdMatch = section.match(/\*\*Created\*\*:\s*(.+)/);
    const sizeMatch = section.match(/\*\*Size\*\*:\s*(.+)/);
    const projectMatch = section.match(/\*\*Project\*\*:\s*(.+)/);

    if (!idMatch || !typeMatch || !pathMatch) return null;

    // Parse tags
    const tagsString = tagsMatch ? tagsMatch[1] : '';
    const tags = tagsString
      .split(',')
      .map(t => t.trim().replace(/`/g, ''))
      .filter(t => t.length > 0);

    return {
      id: idMatch[1].trim(),
      name: section.match(/^###\s+(.+)/m)?.[1].trim() || 'Unknown',
      path: pathMatch[1].trim(),
      type: typeMatch[1].trim(),
      category: categoryMatch ? categoryMatch[1].trim() : undefined,
      dimensions: dimensionsMatch
        ? { width: parseInt(dimensionsMatch[1]), height: parseInt(dimensionsMatch[2]) }
        : { width: 0, height: 0 },
      tags,
      description: descMatch ? descMatch[1].trim() : '',
      generationMethod: (methodMatch ? methodMatch[1].trim() : 'unknown') as GenerationMethod,
      seed: seedMatch ? parseInt(seedMatch[1]) : 0,
      createdAt: createdMatch ? createdMatch[1].trim() : '',
      fileSize: parseSizeString(sizeMatch ? sizeMatch[1].trim() : '0 B'),
      projectContext: projectMatch ? projectMatch[1].trim() : undefined
    };
  } catch (error) {
    console.error('[Asset Registry] Failed to parse entry:', error);
    return null;
  }
}

/**
 * Parse file size string to bytes
 */
function parseSizeString(sizeStr: string): number {
  const match = sizeStr.match(/([\d.]+)\s*(B|KB|MB)/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'B':
      return value;
    case 'KB':
      return value * 1024;
    case 'MB':
      return value * 1024 * 1024;
    default:
      return 0;
  }
}

/**
 * Get registry statistics
 */
export async function getRegistryStats(): Promise<{
  totalAssets: number;
  assetsByType: Record<string, number>;
  assetsByCategory: Record<string, number>;
  totalSize: number;
}> {
  if (!fs.existsSync(ASSET_REGISTRY_PATH)) {
    return {
      totalAssets: 0,
      assetsByType: {},
      assetsByCategory: {},
      totalSize: 0
    };
  }

  const content = fs.readFileSync(ASSET_REGISTRY_PATH, 'utf-8');
  const entries = parseRegistryEntries(content);

  const assetsByType: Record<string, number> = {};
  const assetsByCategory: Record<string, number> = {};
  let totalSize = 0;

  for (const entry of entries) {
    assetsByType[entry.type] = (assetsByType[entry.type] || 0) + 1;

    if (entry.category) {
      assetsByCategory[entry.category] = (assetsByCategory[entry.category] || 0) + 1;
    }

    totalSize += entry.fileSize;
  }

  return {
    totalAssets: entries.length,
    assetsByType,
    assetsByCategory,
    totalSize
  };
}
