/**
 * Asset Specification System
 *
 * Extract, validate, and manage asset specifications before generation.
 * Ensures all required information is present before asset creation.
 */
import type { AssetSpec } from './asset-registry';
import type { GameFramework } from '../../layer-37-game-frameworks';
/**
 * Spec validation result
 */
export interface SpecValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    missingFields: string[];
}
/**
 * Asset spec template
 */
export interface AssetSpecTemplate {
    id: string;
    name: string;
    type: AssetSpec['type'];
    requiredFields: string[];
    optionalFields: string[];
    defaults: Partial<AssetSpec>;
    description: string;
}
/**
 * Common asset spec templates
 */
export declare const ASSET_SPEC_TEMPLATES: Record<string, AssetSpecTemplate>;
/**
 * Extract asset specifications from code
 *
 * Looks for patterns like:
 * - Comments: "// Asset: pet_flameling_idle, sprite, 64x64"
 * - Code: load.image('pet_flameling_idle', 'assets/...')
 * - Spec blocks: /* ASSET_SPEC: {...} *\/
 */
export declare function extractAssetSpecs(code: string): AssetSpec[];
/**
 * Validate asset specification
 */
export declare function validateAssetSpec(spec: AssetSpec): SpecValidationResult;
/**
 * Apply template to spec
 */
export declare function applyTemplate(spec: AssetSpec, templateId: string): AssetSpec;
/**
 * Generate asset spec from description
 *
 * Uses LLM-like reasoning to extract spec from natural language
 */
export declare function generateSpecFromDescription(description: string, framework?: GameFramework): AssetSpec;
/**
 * Complete spec with defaults
 */
export declare function completeSpec(spec: Partial<AssetSpec>): AssetSpec;
/**
 * Export types
 */
export type { SpecValidationResult, AssetSpecTemplate };
//# sourceMappingURL=asset-specification.d.ts.map