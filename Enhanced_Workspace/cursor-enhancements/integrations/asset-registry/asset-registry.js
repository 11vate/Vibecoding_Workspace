/**
 * Asset Registry System
 *
 * Central registry that tracks all assets across all projects.
 * Single source of truth for asset existence, metadata, and references.
 */
import * as fs from 'fs/promises';
import * as path from 'path';
/**
 * Create or load asset registry for a project
 */
export async function createAssetRegistry(projectPath) {
    const registryPath = path.join(projectPath, 'asset_registry.json');
    const assets = new Map();
    try {
        // Try to load existing registry
        const registryData = await fs.readFile(registryPath, 'utf-8');
        const registry = JSON.parse(registryData);
        // Convert JSON assets to Map
        for (const [id, entry] of Object.entries(registry.assets)) {
            assets.set(id, {
                ...entry,
                lastValidated: new Date(entry.lastValidated),
                references: entry.references || []
            });
        }
        return {
            projectPath,
            assets,
            registryPath
        };
    }
    catch (error) {
        // Registry doesn't exist, create new one
        if (error.code === 'ENOENT') {
            // Create empty registry
            const newRegistry = {
                version: '1.0.0',
                projectPath,
                generated: new Date().toISOString(),
                assets: {}
            };
            await fs.mkdir(path.dirname(registryPath), { recursive: true });
            await fs.writeFile(registryPath, JSON.stringify(newRegistry, null, 2), 'utf-8');
            return {
                projectPath,
                assets,
                registryPath
            };
        }
        throw error;
    }
}
/**
 * Register an asset in the registry
 */
export async function registerAsset(registry, entry) {
    registry.assets.set(entry.id, entry);
    await saveRegistry(registry);
}
/**
 * Get asset entry by ID
 */
export function getAsset(registry, assetId) {
    return registry.assets.get(assetId);
}
/**
 * Check if asset exists in registry
 */
export function hasAsset(registry, assetId) {
    return registry.assets.has(assetId);
}
/**
 * Check if asset file actually exists on disk
 */
export async function verifyAssetExists(registry, assetId) {
    const entry = registry.assets.get(assetId);
    if (!entry) {
        return false;
    }
    const fullPath = path.join(registry.projectPath, entry.path);
    try {
        await fs.access(fullPath);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Verify all assets in registry exist on disk
 */
export async function verifyAllAssets(registry) {
    const valid = [];
    const missing = [];
    for (const [assetId] of registry.assets) {
        const exists = await verifyAssetExists(registry, assetId);
        if (exists) {
            valid.push(assetId);
            // Update validation status
            const entry = registry.assets.get(assetId);
            if (entry) {
                entry.validated = true;
                entry.lastValidated = new Date();
            }
        }
        else {
            missing.push(assetId);
            // Update validation status
            const entry = registry.assets.get(assetId);
            if (entry) {
                entry.validated = false;
            }
        }
    }
    // Save updated validation status
    await saveRegistry(registry);
    return { valid, missing };
}
/**
 * Add reference to asset (track which files use this asset)
 */
export async function addAssetReference(registry, assetId, filePath) {
    const entry = registry.assets.get(assetId);
    if (!entry) {
        throw new Error(`Asset ${assetId} not found in registry`);
    }
    const relativePath = path.relative(registry.projectPath, filePath);
    if (!entry.references.includes(relativePath)) {
        entry.references.push(relativePath);
        await saveRegistry(registry);
    }
}
/**
 * Remove reference from asset
 */
export async function removeAssetReference(registry, assetId, filePath) {
    const entry = registry.assets.get(assetId);
    if (!entry) {
        return;
    }
    const relativePath = path.relative(registry.projectPath, filePath);
    entry.references = entry.references.filter(ref => ref !== relativePath);
    await saveRegistry(registry);
}
/**
 * Get all assets referenced by a file
 */
export function getAssetsByReference(registry, filePath) {
    const relativePath = path.relative(registry.projectPath, filePath);
    const assets = [];
    for (const entry of registry.assets.values()) {
        if (entry.references.includes(relativePath)) {
            assets.push(entry);
        }
    }
    return assets;
}
/**
 * Find assets by type
 */
export function findAssetsByType(registry, type) {
    const assets = [];
    for (const entry of registry.assets.values()) {
        if (entry.type === type) {
            assets.push(entry);
        }
    }
    return assets;
}
/**
 * Find assets by spec property
 */
export function findAssetsBySpec(registry, predicate) {
    const assets = [];
    for (const entry of registry.assets.values()) {
        if (predicate(entry.spec)) {
            assets.push(entry);
        }
    }
    return assets;
}
/**
 * Remove asset from registry
 */
export async function unregisterAsset(registry, assetId) {
    registry.assets.delete(assetId);
    await saveRegistry(registry);
}
/**
 * Save registry to disk
 */
async function saveRegistry(registry) {
    const registryFile = {
        version: '1.0.0',
        projectPath: registry.projectPath,
        generated: new Date().toISOString(),
        assets: {}
    };
    // Convert Map to object
    for (const [id, entry] of registry.assets) {
        registryFile.assets[id] = {
            ...entry,
            lastValidated: entry.lastValidated.toISOString()
        };
    }
    await fs.writeFile(registry.registryPath, JSON.stringify(registryFile, null, 2), 'utf-8');
}
/**
 * Get registry statistics
 */
export function getRegistryStats(registry) {
    const stats = {
        totalAssets: registry.assets.size,
        validatedAssets: 0,
        generatedAssets: 0,
        assetsByType: {},
        totalReferences: 0
    };
    for (const entry of registry.assets.values()) {
        if (entry.validated)
            stats.validatedAssets++;
        if (entry.generated)
            stats.generatedAssets++;
        const typeCount = stats.assetsByType[entry.type] || 0;
        stats.assetsByType[entry.type] = typeCount + 1;
        stats.totalReferences += entry.references.length;
    }
    return stats;
}
//# sourceMappingURL=asset-registry.js.map