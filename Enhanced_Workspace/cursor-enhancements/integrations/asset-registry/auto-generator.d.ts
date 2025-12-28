/**
 * Auto-Generator System
 *
 * Automatically generates missing assets using local AI with fallbacks.
 * Integrates with existing asset pipeline for generation.
 */
import type { AssetSpec } from './asset-registry';
import type { AssetEnforcementConfig } from '../../layer-42-asset-enforcement';
import type { GeneratedAsset } from '../../layer-36-multimodal-core';
/**
 * Generation result
 */
export interface GenerationResult {
    asset: GeneratedAsset;
    path: string;
    success: boolean;
    errors: string[];
}
/**
 * Auto-generate a single asset
 */
export declare function autoGenerateAsset(spec: AssetSpec, config: AssetEnforcementConfig): Promise<GenerationResult>;
/**
 * Batch generate multiple assets
 */
export declare function batchGenerateAssets(specs: AssetSpec[], config: AssetEnforcementConfig): Promise<GenerationResult[]>;
/**
 * Export types
 */
export type { GenerationResult };
//# sourceMappingURL=auto-generator.d.ts.map