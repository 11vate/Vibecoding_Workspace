/**
 * Asset Manifest Generation
 *
 * Generates project-wide asset manifests for build verification.
 * Scans projects and creates comprehensive asset inventories.
 */
/**
 * Asset manifest structure
 */
export interface AssetManifest {
    project: string;
    generated: string;
    version: string;
    assets: ManifestAsset[];
    summary: {
        total: number;
        validated: number;
        missing: number;
        byType: Record<string, number>;
    };
}
/**
 * Asset entry in manifest
 */
export interface ManifestAsset {
    id: string;
    path: string;
    type: string;
    spec: {
        assetId: string;
        type: string;
        resolution?: string;
        frames?: number;
        style?: string;
    };
    validated: boolean;
    lastValidated: string;
    generated: boolean;
    references: string[];
}
/**
 * Generate asset manifest for a project
 */
export declare function generateAssetManifest(projectPath: string): Promise<AssetManifest>;
/**
 * Save manifest to disk
 */
export declare function saveAssetManifest(manifest: AssetManifest, projectPath: string): Promise<string>;
/**
 * Load manifest from disk
 */
export declare function loadAssetManifest(projectPath: string): Promise<AssetManifest | null>;
/**
 * Verify manifest completeness
 *
 * Checks that all assets in manifest exist on disk.
 */
export declare function verifyManifest(manifest: AssetManifest, projectPath: string): Promise<{
    valid: boolean;
    missing: string[];
    errors: string[];
}>;
/**
 * Generate and save manifest
 */
export declare function generateAndSaveManifest(projectPath: string): Promise<string>;
/**
 * Export types
 */
export type { AssetManifest, ManifestAsset };
//# sourceMappingURL=asset-manifest.d.ts.map