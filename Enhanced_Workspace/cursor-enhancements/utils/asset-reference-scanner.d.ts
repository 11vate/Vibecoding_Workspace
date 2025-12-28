/**
 * Asset Reference Scanner
 *
 * Scans code to detect asset references and verifies their existence.
 * Used before code generation to ensure all referenced assets exist.
 */
import type { GameFramework } from '../layer-37-game-frameworks';
import type { AssetRegistry } from '../integrations/asset-registry/asset-registry';
import type { AssetSpec } from '../integrations/asset-registry/asset-registry';
/**
 * Asset reference found in code
 */
export interface AssetReference {
    assetId: string;
    type: 'path' | 'id' | 'load_call' | 'spec';
    location: {
        line: number;
        column: number;
        context: string;
    };
    inferredSpec?: AssetSpec;
}
/**
 * Missing asset that needs to be generated
 */
export interface MissingAsset {
    assetId: string;
    references: AssetReference[];
    inferredSpec?: AssetSpec;
    reason: 'not_in_registry' | 'file_missing' | 'invalid_path';
}
/**
 * Scan result
 */
export interface ScanResult {
    references: AssetReference[];
    missing: MissingAsset[];
    existing: string[];
    warnings: string[];
}
/**
 * Scan code for asset references
 */
export declare function scanForAssetReferences(code: string, framework?: GameFramework): AssetReference[];
/**
 * Check asset existence against registry
 */
export declare function checkAssetExistence(references: AssetReference[], registry: AssetRegistry): Promise<MissingAsset[]>;
/**
 * Generate asset specs for missing assets
 */
export declare function generateAssetSpecsForMissing(missing: MissingAsset[]): AssetSpec[];
/**
 * Full scan and check
 */
export declare function scanAndCheckAssets(code: string, registry: AssetRegistry, framework?: GameFramework): Promise<ScanResult>;
/**
 * Export types
 */
export type { AssetReference, MissingAsset, ScanResult };
//# sourceMappingURL=asset-reference-scanner.d.ts.map