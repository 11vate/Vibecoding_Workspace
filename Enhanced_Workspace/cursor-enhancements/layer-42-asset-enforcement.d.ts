/**
 * LAYER 42 — ASSET ENFORCEMENT
 *
 * Hard gate that enforces assets must exist before code can reference them.
 *
 * This layer implements the Asset Existence Law:
 * - No code may reference an asset unless that asset exists on disk
 * - Assets must be validated and registered before use
 * - Missing assets trigger automatic generation using local AI
 * - Code generation is blocked until all assets are available
 */
import type { AssetSpec } from './integrations/asset-registry/asset-registry';
import type { MissingAsset } from './utils/asset-reference-scanner';
import type { GameFramework } from './layer-37-game-frameworks';
import type { GeneratedAsset } from './layer-36-multimodal-core';
/**
 * Asset validation result
 */
export interface AssetValidationResult {
    valid: boolean;
    missingAssets: MissingAsset[];
    existingAssets: string[];
    errors: string[];
    warnings: string[];
    canProceed: boolean;
}
/**
 * Enforcement result
 */
export interface EnforcementResult {
    success: boolean;
    generatedAssets: GeneratedAsset[];
    registeredAssets: string[];
    errors: string[];
    warnings: string[];
    message: string;
}
/**
 * Asset enforcement configuration
 */
export interface AssetEnforcementConfig {
    projectPath: string;
    framework?: GameFramework;
    autoGenerate: boolean;
    strictMode: boolean;
    validateOnDisk: boolean;
}
/**
 * Main asset enforcement configuration
 */
export declare const ASSET_ENFORCEMENT: {
    /**
     * Asset Existence Law (Prime Rule)
     */
    readonly primeRule: {
        readonly description: "No code may reference an asset unless that asset exists on disk, is validated, and is registered.";
        readonly enforcement: "hard_gate";
        readonly exceptions: readonly [];
    };
    /**
     * Asset-First Development Order
     */
    readonly developmentOrder: readonly ["Define asset spec", "Generate/source assets", "Validate assets", "Register assets", "Bind assets", "Write logic"];
    /**
     * Validation Checks
     */
    readonly validation: {
        readonly registryCheck: {
            readonly description: "Asset must be registered in asset registry";
            readonly required: true;
        };
        readonly fileExistence: {
            readonly description: "Asset file must exist on disk";
            readonly required: true;
        };
        readonly pathValidation: {
            readonly description: "Asset path must be valid and accessible";
            readonly required: true;
        };
        readonly metadataCompleteness: {
            readonly description: "Asset metadata must be complete";
            readonly required: false;
        };
    };
    /**
     * Auto-Generation Rules
     */
    readonly autoGeneration: {
        readonly enabled: true;
        readonly priority: "local_ai";
        readonly fallback: "procedural";
        readonly timeout: 30000;
        readonly retries: 2;
    };
    /**
     * Failure Modes
     */
    readonly failureModes: {
        readonly missingAsset: {
            readonly action: "auto_generate";
            readonly message: "Asset {assetId} is missing. Auto-generating...";
        };
        readonly generationFailed: {
            readonly action: "halt";
            readonly message: "Failed to generate asset {assetId}. Cannot proceed.";
        };
        readonly validationFailed: {
            readonly action: "halt";
            readonly message: "Asset {assetId} failed validation. Cannot proceed.";
        };
    };
};
/**
 * Validate asset references in code
 *
 * Scans code for asset references and verifies they exist.
 * Returns validation result indicating if code generation can proceed.
 */
export declare function validateAssetReferences(code: string, config: AssetEnforcementConfig): Promise<AssetValidationResult>;
/**
 * Enforce asset existence
 *
 * Ensures all referenced assets exist. If missing, auto-generates them.
 * Returns result indicating success and what was generated.
 */
export declare function enforceAssetExistence(assetIds: string[], config: AssetEnforcementConfig): Promise<EnforcementResult>;
/**
 * Auto-generate missing assets
 *
 * Takes missing asset specs and generates them using local AI.
 */
export declare function autoGenerateMissingAssets(specs: AssetSpec[], config: AssetEnforcementConfig): Promise<GeneratedAsset[]>;
/**
 * Pre-code generation check
 *
 * Called before code generation to ensure all assets exist.
 * Blocks code generation if assets are missing and strict mode is enabled.
 */
export declare function preCodeGenerationCheck(codeToGenerate: string, config: AssetEnforcementConfig): Promise<{
    canProceed: boolean;
    validation: AssetValidationResult;
    enforcement?: EnforcementResult;
}>;
/**
 * Export types
 */
export type { AssetValidationResult, EnforcementResult, AssetEnforcementConfig };
//# sourceMappingURL=layer-42-asset-enforcement.d.ts.map