/**
 * Asset Manifest Generation
 *
 * Generates project-wide asset manifests for build verification.
 * Scans projects and creates comprehensive asset inventories.
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import { createAssetRegistry, verifyAllAssets } from './asset-registry';
/**
 * Generate asset manifest for a project
 */
export async function generateAssetManifest(projectPath) {
    // Load registry
    const registry = await createAssetRegistry(projectPath);
    // Verify all assets
    const verification = await verifyAllAssets(registry);
    // Get project name
    const projectName = path.basename(projectPath);
    // Build manifest assets
    const assets = [];
    const byType = {};
    for (const [assetId, entry] of registry.assets) {
        assets.push({
            id: assetId,
            path: entry.path,
            type: entry.type,
            spec: {
                assetId: entry.spec.assetId,
                type: entry.spec.type,
                resolution: entry.spec.resolution,
                frames: entry.spec.frames,
                style: entry.spec.style
            },
            validated: entry.validated && verification.valid.includes(assetId),
            lastValidated: entry.lastValidated.toISOString(),
            generated: entry.generated,
            references: entry.references
        });
        // Count by type
        const typeCount = byType[entry.type] || 0;
        byType[entry.type] = typeCount + 1;
    }
    // Build summary
    const summary = {
        total: assets.length,
        validated: verification.valid.length,
        missing: verification.missing.length,
        byType
    };
    return {
        project: projectName,
        generated: new Date().toISOString(),
        version: '1.0.0',
        assets,
        summary
    };
}
/**
 * Save manifest to disk
 */
export async function saveAssetManifest(manifest, projectPath) {
    const manifestPath = path.join(projectPath, 'asset_manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    return manifestPath;
}
/**
 * Load manifest from disk
 */
export async function loadAssetManifest(projectPath) {
    const manifestPath = path.join(projectPath, 'asset_manifest.json');
    try {
        const data = await fs.readFile(manifestPath, 'utf-8');
        return JSON.parse(data);
    }
    catch {
        return null;
    }
}
/**
 * Verify manifest completeness
 *
 * Checks that all assets in manifest exist on disk.
 */
export async function verifyManifest(manifest, projectPath) {
    const missing = [];
    const errors = [];
    for (const asset of manifest.assets) {
        const fullPath = path.join(projectPath, asset.path);
        try {
            await fs.access(fullPath);
        }
        catch {
            missing.push(asset.id);
            errors.push(`Asset ${asset.id} is missing: ${asset.path}`);
        }
    }
    return {
        valid: missing.length === 0,
        missing,
        errors
    };
}
/**
 * Generate and save manifest
 */
export async function generateAndSaveManifest(projectPath) {
    const manifest = await generateAssetManifest(projectPath);
    return await saveAssetManifest(manifest, projectPath);
}
//# sourceMappingURL=asset-manifest.js.map