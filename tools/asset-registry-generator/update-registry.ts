/**
 * Registry Updater - Update ASSET_REGISTRY.md with new entries
 *
 * Purpose: Add bulk entries to registry
 * Authority: Tier 2 (Mandatory for registry management)
 * Use: Bulk registration from scans
 */

import * as fs from 'fs';
import * as path from 'path';
import { AssetRegistryEntry, registerAsset } from '../autonomous-assets/auto-registrar';

const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const ASSET_REGISTRY_PATH = path.join(WORKSPACE_ROOT, 'asset-system', 'ASSET_REGISTRY.md');

/**
 * Add multiple entries to registry
 */
export async function addEntriesToRegistry(entries: AssetRegistryEntry[]): Promise<{
  added: number;
  skipped: number;
  errors: string[];
}> {
  const results = {
    added: 0,
    skipped: 0,
    errors: []
  };

  for (const entry of entries) {
    try {
      // Use registerAsset from auto-registrar
      // But we need to bypass file writing since files already exist
      await addSingleEntry(entry);
      results.added++;
    } catch (error) {
      results.errors.push(`${entry.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      results.skipped++;
    }
  }

  return results;
}

/**
 * Add single entry to registry (simpler version for existing files)
 */
async function addSingleEntry(entry: AssetRegistryEntry): Promise<void> {
  // Ensure registry file exists
  ensureRegistryExists();

  // Read current registry
  let registryContent = fs.readFileSync(ASSET_REGISTRY_PATH, 'utf-8');

  // Check if entry already exists
  if (registryContent.includes(`**ID**: ${entry.id}`)) {
    throw new Error('Entry already exists');
  }

  // Create entry markdown
  const entryMarkdown = formatRegistryEntry(entry);

  // Find insertion point
  const endMarker = '\n---\n';
  const endMarkerIndex = registryContent.lastIndexOf(endMarker);

  if (endMarkerIndex !== -1) {
    registryContent =
      registryContent.slice(0, endMarkerIndex) +
      '\n' +
      entryMarkdown +
      '\n' +
      registryContent.slice(endMarkerIndex);
  } else {
    registryContent += '\n\n' + entryMarkdown + '\n';
  }

  // Write updated registry
  fs.writeFileSync(ASSET_REGISTRY_PATH, registryContent, 'utf-8');
}

/**
 * Ensure registry file exists
 */
function ensureRegistryExists(): void {
  if (fs.existsSync(ASSET_REGISTRY_PATH)) {
    return;
  }

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
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Preview entries (show what would be added)
 */
export function previewEntries(entries: AssetRegistryEntry[]): string {
  let preview = `Preview of ${entries.length} entries to be added:\n\n`;

  for (let i = 0; i < Math.min(entries.length, 10); i++) {
    const entry = entries[i];
    preview += `${i + 1}. ${entry.name}\n`;
    preview += `   ID: ${entry.id}\n`;
    preview += `   Type: ${entry.type}${entry.category ? ` / ${entry.category}` : ''}\n`;
    preview += `   Path: ${entry.path}\n`;
    preview += `   Tags: ${entry.tags.join(', ')}\n`;
    preview += '\n';
  }

  if (entries.length > 10) {
    preview += `... and ${entries.length - 10} more entries\n`;
  }

  return preview;
}
