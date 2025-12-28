/**
 * Asset Registry System
 *
 * Central registry that tracks all assets across all projects.
 * Single source of truth for asset existence, metadata, and references.
 */
import type { AssetType } from '../../layer-31-asset-creation';
import type { AssetMetadata as CoreAssetMetadata } from '../../layer-36-multimodal-core';
/**
 * Asset entry in registry
 */
export interface AssetEntry {
    id: string;
    path: string;
    type: AssetType;
    spec: AssetSpec;
    validated: boolean;
    lastValidated: Date;
    generated: boolean;
    metadata?: CoreAssetMetadata;
    references: string[];
}
/**
 * Asset specification (from asset-specification.ts)
 */
export interface AssetSpec {
    assetId: string;
    type: "sprite_sheet" | "sprite" | "background" | "tileset" | "ui" | "icon" | "audio" | "animation" | "effect";
    resolution?: string;
    frames?: number;
    palette?: string[];
    loop?: boolean;
    background?: "transparent" | "solid" | string;
    style?: string;
    usage?: string;
    engine?: string;
    description?: string;
}
/**
 * Asset registry for a project
 */
export interface AssetRegistry {
    projectPath: string;
    assets: Map<string, AssetEntry>;
    registryPath: string;
}
/**
 * Create or load asset registry for a project
 */
export declare function createAssetRegistry(projectPath: string): Promise<AssetRegistry>;
/**
 * Register an asset in the registry
 */
export declare function registerAsset(registry: AssetRegistry, entry: AssetEntry): Promise<void>;
/**
 * Get asset entry by ID
 */
export declare function getAsset(registry: AssetRegistry, assetId: string): AssetEntry | undefined;
/**
 * Check if asset exists in registry
 */
export declare function hasAsset(registry: AssetRegistry, assetId: string): boolean;
/**
 * Check if asset file actually exists on disk
 */
export declare function verifyAssetExists(registry: AssetRegistry, assetId: string): Promise<boolean>;
/**
 * Verify all assets in registry exist on disk
 */
export declare function verifyAllAssets(registry: AssetRegistry): Promise<{
    valid: string[];
    missing: string[];
}>;
/**
 * Add reference to asset (track which files use this asset)
 */
export declare function addAssetReference(registry: AssetRegistry, assetId: string, filePath: string): Promise<void>;
/**
 * Remove reference from asset
 */
export declare function removeAssetReference(registry: AssetRegistry, assetId: string, filePath: string): Promise<void>;
/**
 * Get all assets referenced by a file
 */
export declare function getAssetsByReference(registry: AssetRegistry, filePath: string): AssetEntry[];
/**
 * Find assets by type
 */
export declare function findAssetsByType(registry: AssetRegistry, type: AssetType): AssetEntry[];
/**
 * Find assets by spec property
 */
export declare function findAssetsBySpec(registry: AssetRegistry, predicate: (spec: AssetSpec) => boolean): AssetEntry[];
/**
 * Remove asset from registry
 */
export declare function unregisterAsset(registry: AssetRegistry, assetId: string): Promise<void>;
/**
 * Get registry statistics
 */
export declare function getRegistryStats(registry: AssetRegistry): {
    totalAssets: number;
    validatedAssets: number;
    generatedAssets: number;
    assetsByType: Record<string, number>;
    totalReferences: number;
};
/**
 * Export types
 */
export type { AssetRegistry, AssetEntry, AssetSpec };
//# sourceMappingURL=asset-registry.d.ts.map