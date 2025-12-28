/**
 * Registry Entry Validator - Validate asset registry entries
 *
 * Purpose: Validate registry metadata completeness and correctness
 * Authority: Tier 2 (Mandatory for registry validation)
 * Use: Registry integrity checks
 */

import { AssetRegistryEntry } from '../autonomous-assets/auto-registrar';
import * as fs from 'fs';
import * as path from 'path';

export interface RegistryValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  entry: AssetRegistryEntry;
}

/**
 * Validate registry entry
 */
export function validateRegistryEntry(entry: AssetRegistryEntry, workspaceRoot: string): RegistryValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required fields
  if (!entry.id || entry.id.trim().length === 0) {
    errors.push('Missing or empty ID');
  }

  if (!entry.name || entry.name.trim().length === 0) {
    errors.push('Missing or empty name');
  }

  if (!entry.path || entry.path.trim().length === 0) {
    errors.push('Missing or empty path');
  }

  if (!entry.type || entry.type.trim().length === 0) {
    errors.push('Missing or empty type');
  }

  if (!entry.tags || entry.tags.length === 0) {
    warnings.push('No tags specified - may be difficult to discover');
  }

  if (!entry.description || entry.description.trim().length === 0) {
    warnings.push('Missing description');
  }

  // Validate dimensions
  if (!entry.dimensions) {
    errors.push('Missing dimensions');
  } else {
    if (entry.dimensions.width <= 0) {
      errors.push('Invalid width (must be > 0)');
    }

    if (entry.dimensions.height <= 0) {
      errors.push('Invalid height (must be > 0)');
    }

    // Check for reasonable dimensions
    if (entry.dimensions.width > 4096 || entry.dimensions.height > 4096) {
      warnings.push(`Very large dimensions (${entry.dimensions.width}x${entry.dimensions.height})`);
    }

    if (entry.dimensions.width < 8 || entry.dimensions.height < 8) {
      warnings.push(`Very small dimensions (${entry.dimensions.width}x${entry.dimensions.height})`);
    }

    // Check for grid alignment (recommended)
    const isAligned = (entry.dimensions.width % 8 === 0 && entry.dimensions.height % 8 === 0) ||
                     (entry.dimensions.width % 16 === 0 && entry.dimensions.height % 16 === 0);

    if (!isAligned) {
      warnings.push(`Dimensions not grid-aligned (recommend multiples of 8 or 16)`);
    }
  }

  // Validate file path exists
  if (entry.path) {
    const fullPath = path.resolve(workspaceRoot, entry.path);
    if (!fs.existsSync(fullPath)) {
      errors.push(`File not found at path: ${entry.path}`);
    }
  }

  // Validate generation method
  const validMethods = ['geometric', 'pixel-art-symmetry', 'pixel-art-cellular', 'noise-texture', 'svg-code', 'animation-interpolation', 'unknown'];
  if (entry.generationMethod && !validMethods.includes(entry.generationMethod)) {
    warnings.push(`Unknown generation method: ${entry.generationMethod}`);
  }

  // Validate seed (should be non-negative integer)
  if (entry.seed !== undefined && (entry.seed < 0 || !Number.isInteger(entry.seed))) {
    errors.push(`Invalid seed value: ${entry.seed}`);
  }

  // Validate created date
  if (entry.createdAt) {
    try {
      const date = new Date(entry.createdAt);
      if (isNaN(date.getTime())) {
        errors.push('Invalid createdAt date format');
      }
    } catch {
      errors.push('Invalid createdAt date');
    }
  }

  // Validate file size
  if (entry.fileSize !== undefined && entry.fileSize < 0) {
    errors.push('Invalid file size (negative)');
  }

  // Validate ID format (should match expected pattern)
  if (entry.id) {
    // ID should be lowercase with hyphens
    if (!/^[a-z0-9-]+$/.test(entry.id)) {
      warnings.push('ID contains invalid characters (should be lowercase alphanumeric with hyphens)');
    }
  }

  // Validate type
  const validTypes = ['sprite', 'ui', 'texture', 'icon', 'tileset', 'animation'];
  if (entry.type && !validTypes.includes(entry.type)) {
    warnings.push(`Non-standard asset type: ${entry.type}`);
  }

  // Check for duplicate tags
  if (entry.tags) {
    const uniqueTags = new Set(entry.tags);
    if (uniqueTags.size !== entry.tags.length) {
      warnings.push('Duplicate tags detected');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    entry
  };
}

/**
 * Batch validate registry entries
 */
export function validateRegistryEntries(entries: AssetRegistryEntry[], workspaceRoot: string): RegistryValidationResult[] {
  return entries.map(entry => validateRegistryEntry(entry, workspaceRoot));
}

/**
 * Find duplicate IDs
 */
export function findDuplicateIds(entries: AssetRegistryEntry[]): Map<string, AssetRegistryEntry[]> {
  const idMap = new Map<string, AssetRegistryEntry[]>();

  for (const entry of entries) {
    if (!idMap.has(entry.id)) {
      idMap.set(entry.id, []);
    }
    idMap.get(entry.id)!.push(entry);
  }

  // Filter to only duplicates
  const duplicates = new Map<string, AssetRegistryEntry[]>();
  for (const [id, entries] of idMap.entries()) {
    if (entries.length > 1) {
      duplicates.set(id, entries);
    }
  }

  return duplicates;
}

/**
 * Find orphaned entries (entry exists but file doesn't)
 */
export function findOrphanedEntries(entries: AssetRegistryEntry[], workspaceRoot: string): AssetRegistryEntry[] {
  const orphaned: AssetRegistryEntry[] = [];

  for (const entry of entries) {
    const fullPath = path.resolve(workspaceRoot, entry.path);
    if (!fs.existsSync(fullPath)) {
      orphaned.push(entry);
    }
  }

  return orphaned;
}

/**
 * Find unregistered files (file exists but no registry entry)
 */
export function findUnregisteredFiles(
  assetDirectory: string,
  registeredPaths: string[],
  workspaceRoot: string
): string[] {
  const unregistered: string[] = [];

  function scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        // Only check image files
        const ext = path.extname(entry.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.svg'].includes(ext)) {
          const relativePath = path.relative(workspaceRoot, fullPath).replace(/\\/g, '/');

          if (!registeredPaths.includes(relativePath)) {
            unregistered.push(relativePath);
          }
        }
      }
    }
  }

  scanDirectory(assetDirectory);

  return unregistered;
}
