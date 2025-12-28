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
import { createAssetRegistry, registerAsset, verifyAllAssets } from './integrations/asset-registry/asset-registry';
import { scanAndCheckAssets } from './utils/asset-reference-scanner';
/**
 * Main asset enforcement configuration
 */
export const ASSET_ENFORCEMENT = {
    /**
     * Asset Existence Law (Prime Rule)
     */
    primeRule: {
        description: "No code may reference an asset unless that asset exists on disk, is validated, and is registered.",
        enforcement: "hard_gate", // Blocks code generation
        exceptions: []
    },
    /**
     * Asset-First Development Order
     */
    developmentOrder: [
        "Define asset spec",
        "Generate/source assets",
        "Validate assets",
        "Register assets",
        "Bind assets",
        "Write logic"
    ],
    /**
     * Validation Checks
     */
    validation: {
        registryCheck: {
            description: "Asset must be registered in asset registry",
            required: true
        },
        fileExistence: {
            description: "Asset file must exist on disk",
            required: true
        },
        pathValidation: {
            description: "Asset path must be valid and accessible",
            required: true
        },
        metadataCompleteness: {
            description: "Asset metadata must be complete",
            required: false // Warning only
        }
    },
    /**
     * Auto-Generation Rules
     */
    autoGeneration: {
        enabled: true,
        priority: "local_ai", // local_ai > procedural > manual
        fallback: "procedural",
        timeout: 30000, // 30 seconds
        retries: 2
    },
    /**
     * Failure Modes
     */
    failureModes: {
        missingAsset: {
            action: "auto_generate", // auto_generate | halt | prompt_user
            message: "Asset {assetId} is missing. Auto-generating..."
        },
        generationFailed: {
            action: "halt",
            message: "Failed to generate asset {assetId}. Cannot proceed."
        },
        validationFailed: {
            action: "halt",
            message: "Asset {assetId} failed validation. Cannot proceed."
        }
    }
};
/**
 * Validate asset references in code
 *
 * Scans code for asset references and verifies they exist.
 * Returns validation result indicating if code generation can proceed.
 */
export async function validateAssetReferences(code, config) {
    const errors = [];
    const warnings = [];
    // Load or create registry
    const registry = await createAssetRegistry(config.projectPath);
    // Scan code for asset references
    const scanResult = await scanAndCheckAssets(code, registry, config.framework);
    // Check for missing assets
    const missingAssets = scanResult.missing;
    const existingAssets = scanResult.existing;
    // Validate existing assets are actually on disk
    if (config.validateOnDisk) {
        const verification = await verifyAllAssets(registry);
        for (const missingId of verification.missing) {
            const entry = registry.assets.get(missingId);
            if (entry) {
                errors.push(`Asset ${missingId} is registered but file is missing: ${entry.path}`);
            }
        }
    }
    // Determine if we can proceed
    let canProceed = true;
    if (missingAssets.length > 0) {
        if (config.strictMode) {
            canProceed = false;
            errors.push(`Cannot proceed: ${missingAssets.length} asset(s) are missing. ` +
                `Assets must exist before code can reference them.`);
        }
        else {
            warnings.push(`${missingAssets.length} asset(s) are missing. ` +
                (config.autoGenerate
                    ? "Will attempt auto-generation."
                    : "Please create these assets manually."));
        }
    }
    // Add warnings from scan
    warnings.push(...scanResult.warnings);
    return {
        valid: errors.length === 0,
        missingAssets,
        existingAssets,
        errors,
        warnings,
        canProceed: canProceed && errors.length === 0
    };
}
/**
 * Enforce asset existence
 *
 * Ensures all referenced assets exist. If missing, auto-generates them.
 * Returns result indicating success and what was generated.
 */
export async function enforceAssetExistence(assetIds, config) {
    const errors = [];
    const warnings = [];
    const generatedAssets = [];
    const registeredAssets = [];
    // Load registry
    const registry = await createAssetRegistry(config.projectPath);
    // Check each asset
    for (const assetId of assetIds) {
        const entry = registry.assets.get(assetId);
        if (!entry) {
            // Asset not in registry - needs generation
            if (config.autoGenerate) {
                try {
                    // Import auto-generator (will be created next)
                    const { autoGenerateAsset } = await import('./integrations/asset-registry/auto-generator');
                    // Generate spec from asset ID
                    const { generateSpecFromDescription } = await import('./integrations/asset-registry/asset-specification');
                    const spec = generateSpecFromDescription(assetId, config.framework);
                    // Generate asset
                    const generated = await autoGenerateAsset(spec, config);
                    generatedAssets.push(generated.asset);
                    // Register asset
                    const assetEntry = {
                        id: assetId,
                        path: generated.path,
                        type: spec.type === 'sprite_sheet' ? 'sprite' : spec.type,
                        spec,
                        validated: true,
                        lastValidated: new Date(),
                        generated: true,
                        metadata: generated.asset.metadata,
                        references: []
                    };
                    await registerAsset(registry, assetEntry);
                    registeredAssets.push(assetId);
                }
                catch (error) {
                    errors.push(`Failed to auto-generate asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
            else {
                errors.push(`Asset ${assetId} is missing and auto-generation is disabled. ` +
                    `Please create this asset manually.`);
            }
        }
        else {
            // Asset in registry - verify it exists on disk
            const fs = require('fs/promises');
            const fullPath = `${config.projectPath}/${entry.path}`;
            try {
                await fs.access(fullPath);
                // Asset exists, all good
            }
            catch {
                // File missing
                if (config.autoGenerate) {
                    try {
                        const { autoGenerateAsset } = await import('./integrations/asset-registry/auto-generator');
                        const generated = await autoGenerateAsset(entry.spec, config);
                        generatedAssets.push(generated.asset);
                        // Update entry path if changed
                        entry.path = generated.path;
                        entry.validated = true;
                        entry.lastValidated = new Date();
                        await registerAsset(registry, entry);
                        registeredAssets.push(assetId);
                    }
                    catch (error) {
                        errors.push(`Failed to regenerate asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                }
                else {
                    errors.push(`Asset ${assetId} is registered but file is missing: ${entry.path}`);
                }
            }
        }
    }
    const success = errors.length === 0;
    return {
        success,
        generatedAssets,
        registeredAssets,
        errors,
        warnings,
        message: success
            ? `All ${assetIds.length} asset(s) are available.`
            : `Failed to ensure asset existence: ${errors.length} error(s).`
    };
}
/**
 * Auto-generate missing assets
 *
 * Takes missing asset specs and generates them using local AI.
 */
export async function autoGenerateMissingAssets(specs, config) {
    const { autoGenerateAsset } = await import('./integrations/asset-registry/auto-generator');
    const generated = [];
    for (const spec of specs) {
        try {
            const result = await autoGenerateAsset(spec, config);
            generated.push(result.asset);
        }
        catch (error) {
            console.error(`Failed to generate asset ${spec.assetId}:`, error);
            // Continue with other assets
        }
    }
    return generated;
}
/**
 * Pre-code generation check
 *
 * Called before code generation to ensure all assets exist.
 * Blocks code generation if assets are missing and strict mode is enabled.
 */
export async function preCodeGenerationCheck(codeToGenerate, config) {
    // Validate asset references
    const validation = await validateAssetReferences(codeToGenerate, config);
    if (!validation.canProceed && config.strictMode) {
        return {
            canProceed: false,
            validation
        };
    }
    // If missing assets and auto-generate enabled, generate them
    let enforcement;
    if (validation.missingAssets.length > 0 && config.autoGenerate) {
        const assetIds = validation.missingAssets.map(a => a.assetId);
        enforcement = await enforceAssetExistence(assetIds, config);
        if (!enforcement.success && config.strictMode) {
            return {
                canProceed: false,
                validation,
                enforcement
            };
        }
    }
    return {
        canProceed: true,
        validation,
        enforcement
    };
}
//# sourceMappingURL=layer-42-asset-enforcement.js.map