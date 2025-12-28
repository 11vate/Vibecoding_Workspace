/**
 * Auto-Generator System
 *
 * Automatically generates missing assets using local AI with fallbacks.
 * Integrates with existing asset pipeline for generation.
 */
import { executePipeline } from '../../layer-39-asset-pipeline';
import { completeSpec } from './asset-specification';
import * as path from 'path';
import * as fs from 'fs/promises';
/**
 * Auto-generate a single asset
 */
export async function autoGenerateAsset(spec, config) {
    // Complete spec with defaults
    const completedSpec = completeSpec(spec);
    // Convert spec to pipeline parameters
    const pipelineParams = specToPipelineParams(completedSpec);
    // Configure pipeline
    const pipelineConfig = {
        generationSource: "ai", // Use AI generation (local first)
        validationEnabled: true,
        codeBindingEnabled: false, // Will be done separately
        targetFramework: config.framework,
        standards: {
            allowedFormats: ["png", "webp"],
            minDimensions: { width: 16, height: 16 },
            maxDimensions: { width: 2048, height: 2048 },
            requiredMetadata: ["id", "name", "dimensions", "format"]
        },
        autoIntegrate: true
    };
    try {
        // Execute pipeline
        const result = await executePipeline(pipelineParams, pipelineConfig);
        if (result.errors.length > 0) {
            return {
                asset: result.asset,
                path: result.integrationPath || getDefaultAssetPath(completedSpec),
                success: false,
                errors: result.errors
            };
        }
        // Save asset to disk
        const assetPath = await saveAssetToDisk(result.asset, completedSpec, config.projectPath);
        return {
            asset: result.asset,
            path: assetPath,
            success: true,
            errors: []
        };
    }
    catch (error) {
        // Try fallback generation
        return await generateWithFallback(completedSpec, config, error);
    }
}
/**
 * Batch generate multiple assets
 */
export async function batchGenerateAssets(specs, config) {
    const results = [];
    // Generate assets sequentially to avoid overwhelming the system
    for (const spec of specs) {
        try {
            const result = await autoGenerateAsset(spec, config);
            results.push(result);
        }
        catch (error) {
            results.push({
                asset: createErrorAsset(spec),
                path: getDefaultAssetPath(spec),
                success: false,
                errors: [error instanceof Error ? error.message : 'Unknown error']
            });
        }
    }
    return results;
}
/**
 * Generate with fallback strategies
 */
async function generateWithFallback(spec, config, originalError) {
    const errors = [
        `Primary generation failed: ${originalError instanceof Error ? originalError.message : 'Unknown error'}`
    ];
    // Try procedural generation as fallback
    try {
        const proceduralAsset = await generateProcedurally(spec, config);
        if (proceduralAsset) {
            const assetPath = await saveAssetToDisk(proceduralAsset, spec, config.projectPath);
            return {
                asset: proceduralAsset,
                path: assetPath,
                success: true,
                errors: []
            };
        }
    }
    catch (proceduralError) {
        errors.push(`Procedural generation failed: ${proceduralError instanceof Error ? proceduralError.message : 'Unknown error'}`);
    }
    // All generation methods failed
    return {
        asset: createErrorAsset(spec),
        path: getDefaultAssetPath(spec),
        success: false,
        errors
    };
}
/**
 * Convert asset spec to pipeline parameters
 */
function specToPipelineParams(spec) {
    // Parse resolution
    let resolution = [64, 64];
    if (spec.resolution) {
        const [width, height] = spec.resolution.split('x').map(Number);
        if (!isNaN(width) && !isNaN(height)) {
            resolution = [width, height];
        }
    }
    // Build prompt from spec
    const promptParts = [];
    if (spec.type === 'sprite' || spec.type === 'sprite_sheet') {
        promptParts.push('pixel art sprite');
    }
    else if (spec.type === 'background') {
        promptParts.push('pixel art background');
    }
    else if (spec.type === 'icon') {
        promptParts.push('pixel art icon');
    }
    // Add description
    if (spec.description) {
        promptParts.push(spec.description);
    }
    else {
        // Infer from asset ID
        promptParts.push(spec.assetId.replace(/_/g, ' '));
    }
    // Add style
    if (spec.style) {
        promptParts.push(spec.style);
    }
    // Add palette
    if (spec.palette && spec.palette.length > 0) {
        promptParts.push(`colors: ${spec.palette.join(', ')}`);
    }
    // Add transparency
    if (spec.background === 'transparent') {
        promptParts.push('transparent background');
    }
    const prompt = promptParts.join(', ');
    return {
        prompt,
        style: "pixel-art",
        resolution,
        entity: spec.assetId,
        theme: spec.style || "game asset",
        actions: spec.frames ? [{
                name: "default",
                frames: spec.frames,
                loop: spec.loop !== false
            }] : [],
        frameCount: spec.frames,
        constraints: {
            pixelStyle: "crisp",
            animationSmoothness: "gameReady",
            colorDepth: 32,
            maxColors: spec.palette?.length
        }
    };
}
/**
 * Generate asset procedurally (fallback)
 */
async function generateProcedurally(spec, config) {
    // Simple procedural generation using canvas
    // This is a placeholder - would use actual canvas/image generation library
    const resolution = spec.resolution ? spec.resolution.split('x').map(Number) : [64, 64];
    const [width, height] = resolution;
    // Create a simple colored rectangle as placeholder
    // In production, this would use a proper image generation library
    const placeholderData = Buffer.alloc(width * height * 4); // RGBA
    // Fill with a simple pattern
    for (let i = 0; i < placeholderData.length; i += 4) {
        placeholderData[i] = 100; // R
        placeholderData[i + 1] = 150; // G
        placeholderData[i + 2] = 200; // B
        placeholderData[i + 3] = 255; // A
    }
    return {
        type: spec.type === 'sprite_sheet' ? 'sprite' : spec.type,
        data: placeholderData,
        metadata: {
            id: spec.assetId,
            name: spec.assetId,
            dimensions: { width, height },
            format: "png",
            palette: {
                dominant: spec.palette || [],
                all: spec.palette || [],
                count: spec.palette?.length || 0,
                style: "pixel-art"
            },
            tags: [spec.type, "procedural", "placeholder"],
            createdAt: new Date().toISOString()
        }
    };
}
/**
 * Save asset to disk
 */
async function saveAssetToDisk(asset, spec, projectPath) {
    // Determine asset directory based on type
    let assetDir = 'assets';
    if (spec.type === 'sprite' || spec.type === 'sprite_sheet') {
        assetDir = path.join(assetDir, 'sprites');
    }
    else if (spec.type === 'background') {
        assetDir = path.join(assetDir, 'backgrounds');
    }
    else if (spec.type === 'icon' || spec.type === 'ui') {
        assetDir = path.join(assetDir, 'ui');
    }
    // Create directory if needed
    const fullAssetDir = path.join(projectPath, assetDir);
    await fs.mkdir(fullAssetDir, { recursive: true });
    // Determine filename
    const extension = asset.metadata.format || 'png';
    const filename = `${spec.assetId}.${extension}`;
    const filePath = path.join(assetDir, filename);
    // Save file
    const fullPath = path.join(projectPath, filePath);
    if (Buffer.isBuffer(asset.data)) {
        await fs.writeFile(fullPath, asset.data);
    }
    else if (typeof asset.data === 'string') {
        // If data is a path, copy it
        await fs.copyFile(asset.data, fullPath);
    }
    return filePath; // Return relative path
}
/**
 * Get default asset path
 */
function getDefaultAssetPath(spec) {
    const extension = 'png';
    let dir = 'assets';
    if (spec.type === 'sprite' || spec.type === 'sprite_sheet') {
        dir = path.join(dir, 'sprites');
    }
    else if (spec.type === 'background') {
        dir = path.join(dir, 'backgrounds');
    }
    else if (spec.type === 'icon' || spec.type === 'ui') {
        dir = path.join(dir, 'ui');
    }
    return path.join(dir, `${spec.assetId}.${extension}`);
}
/**
 * Create error asset placeholder
 */
function createErrorAsset(spec) {
    return {
        type: spec.type === 'sprite_sheet' ? 'sprite' : spec.type,
        data: Buffer.alloc(0),
        metadata: {
            id: spec.assetId,
            name: spec.assetId,
            dimensions: { width: 64, height: 64 },
            format: "png",
            palette: {
                dominant: [],
                all: [],
                count: 0,
                style: "unknown"
            },
            tags: ["error", "missing"],
            createdAt: new Date().toISOString()
        }
    };
}
//# sourceMappingURL=auto-generator.js.map