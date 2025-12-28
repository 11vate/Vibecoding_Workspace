/**
 * Asset Specification System
 *
 * Extract, validate, and manage asset specifications before generation.
 * Ensures all required information is present before asset creation.
 */
/**
 * Common asset spec templates
 */
export const ASSET_SPEC_TEMPLATES = {
    sprite_idle: {
        id: 'sprite_idle',
        name: 'Idle Sprite',
        type: 'sprite',
        requiredFields: ['assetId', 'type', 'resolution', 'style'],
        optionalFields: ['palette', 'description', 'engine'],
        defaults: {
            background: 'transparent',
            loop: false
        },
        description: 'Single-frame idle sprite'
    },
    sprite_sheet_animation: {
        id: 'sprite_sheet_animation',
        name: 'Animated Sprite Sheet',
        type: 'sprite_sheet',
        requiredFields: ['assetId', 'type', 'resolution', 'frames', 'style'],
        optionalFields: ['palette', 'loop', 'description', 'engine'],
        defaults: {
            background: 'transparent',
            loop: true
        },
        description: 'Multi-frame sprite sheet for animations'
    },
    background_tileable: {
        id: 'background_tileable',
        name: 'Tileable Background',
        type: 'background',
        requiredFields: ['assetId', 'type', 'resolution', 'style'],
        optionalFields: ['palette', 'description'],
        defaults: {
            background: 'solid'
        },
        description: 'Seamlessly tileable background'
    },
    ui_icon: {
        id: 'ui_icon',
        name: 'UI Icon',
        type: 'icon',
        requiredFields: ['assetId', 'type', 'resolution', 'style'],
        optionalFields: ['palette', 'description'],
        defaults: {
            background: 'transparent',
            resolution: '32x32'
        },
        description: 'Simple UI icon'
    }
};
/**
 * Extract asset specifications from code
 *
 * Looks for patterns like:
 * - Comments: "// Asset: pet_flameling_idle, sprite, 64x64"
 * - Code: load.image('pet_flameling_idle', 'assets/...')
 * - Spec blocks: /* ASSET_SPEC: {...} *\/
 */
export function extractAssetSpecs(code) {
    const specs = [];
    // Pattern 1: Comment-based specs
    // Format: // ASSET: assetId, type, resolution, [other params]
    const commentPattern = /\/\/\s*ASSET:\s*([^\n]+)/gi;
    let match;
    while ((match = commentPattern.exec(code)) !== null) {
        const spec = parseCommentSpec(match[1]);
        if (spec) {
            specs.push(spec);
        }
    }
    // Pattern 2: JSON spec blocks
    // Format: /* ASSET_SPEC: {...} */
    const jsonSpecPattern = /\/\*\s*ASSET_SPEC:\s*(\{[\s\S]*?\})\s*\*\//gi;
    while ((match = jsonSpecPattern.exec(code)) !== null) {
        try {
            const spec = JSON.parse(match[1]);
            if (validateSpecStructure(spec)) {
                specs.push(spec);
            }
        }
        catch {
            // Invalid JSON, skip
        }
    }
    // Pattern 3: Asset load calls (Phaser, etc.)
    // Format: this.load.image('assetId', 'path/to/asset.png')
    const loadPattern = /\.load\.(image|spritesheet|atlas)\(['"]([^'"]+)['"]/gi;
    while ((match = loadPattern.exec(code)) !== null) {
        const assetId = match[2];
        const loadType = match[1];
        // Try to infer spec from context
        const spec = inferSpecFromLoad(assetId, loadType, code);
        if (spec) {
            specs.push(spec);
        }
    }
    return specs;
}
/**
 * Parse comment-based asset spec
 */
function parseCommentSpec(comment) {
    const parts = comment.split(',').map(p => p.trim());
    if (parts.length < 2) {
        return null;
    }
    const assetId = parts[0];
    const type = parts[1];
    const spec = {
        assetId,
        type
    };
    // Parse additional parameters
    for (let i = 2; i < parts.length; i++) {
        const part = parts[i];
        if (part.includes('x')) {
            // Resolution
            spec.resolution = part;
        }
        else if (part.startsWith('frames:')) {
            spec.frames = parseInt(part.split(':')[1], 10);
        }
        else if (part.startsWith('style:')) {
            spec.style = part.split(':').slice(1).join(':');
        }
        else if (part === 'loop') {
            spec.loop = true;
        }
        else if (part === 'transparent') {
            spec.background = 'transparent';
        }
    }
    return spec;
}
/**
 * Validate spec structure (basic validation)
 */
function validateSpecStructure(spec) {
    if (typeof spec !== 'object' || spec === null) {
        return false;
    }
    const s = spec;
    return typeof s.assetId === 'string' && typeof s.type === 'string';
}
/**
 * Infer asset spec from load call
 */
function inferSpecFromLoad(assetId, loadType, code) {
    const spec = {
        assetId,
        type: loadType === 'spritesheet' ? 'sprite_sheet' : 'sprite'
    };
    // Try to find resolution in nearby code
    const contextStart = Math.max(0, code.indexOf(assetId) - 200);
    const contextEnd = Math.min(code.length, code.indexOf(assetId) + 200);
    const context = code.substring(contextStart, contextEnd);
    // Look for resolution patterns
    const resolutionMatch = context.match(/(\d+)x(\d+)/);
    if (resolutionMatch) {
        spec.resolution = resolutionMatch[0];
    }
    // Look for frame count
    const frameMatch = context.match(/frames?[:\s=]+(\d+)/i);
    if (frameMatch) {
        spec.frames = parseInt(frameMatch[1], 10);
    }
    return spec;
}
/**
 * Validate asset specification
 */
export function validateAssetSpec(spec) {
    const errors = [];
    const warnings = [];
    const missingFields = [];
    // Required fields
    if (!spec.assetId) {
        errors.push('assetId is required');
        missingFields.push('assetId');
    }
    if (!spec.type) {
        errors.push('type is required');
        missingFields.push('type');
    }
    // Type-specific validation
    if (spec.type === 'sprite_sheet' || spec.type === 'animation') {
        if (!spec.frames || spec.frames < 1) {
            errors.push('frames is required for sprite_sheet and animation types');
            missingFields.push('frames');
        }
    }
    if (spec.type === 'sprite' || spec.type === 'sprite_sheet' || spec.type === 'icon') {
        if (!spec.resolution) {
            warnings.push('resolution is recommended for sprite types');
        }
    }
    // Validate resolution format
    if (spec.resolution && !/^\d+x\d+$/.test(spec.resolution)) {
        errors.push(`Invalid resolution format: ${spec.resolution}. Expected format: WIDTHxHEIGHT (e.g., 64x64)`);
    }
    // Validate palette format
    if (spec.palette && !Array.isArray(spec.palette)) {
        errors.push('palette must be an array of color strings');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        missingFields
    };
}
/**
 * Apply template to spec
 */
export function applyTemplate(spec, templateId) {
    const template = ASSET_SPEC_TEMPLATES[templateId];
    if (!template) {
        return spec;
    }
    const templated = {
        ...template.defaults,
        ...spec
    };
    return templated;
}
/**
 * Generate asset spec from description
 *
 * Uses LLM-like reasoning to extract spec from natural language
 */
export function generateSpecFromDescription(description, framework) {
    const spec = {
        assetId: generateAssetId(description),
        type: inferAssetType(description),
        description
    };
    // Extract resolution
    const resolutionMatch = description.match(/(\d+)x(\d+)/);
    if (resolutionMatch) {
        spec.resolution = resolutionMatch[0];
    }
    // Extract frame count
    const frameMatch = description.match(/(\d+)\s*frames?/i);
    if (frameMatch) {
        spec.frames = parseInt(frameMatch[1], 10);
    }
    // Extract style
    const styleKeywords = ['pixel art', 'pixel-art', 'cyber', 'vaporwave', 'fantasy', 'cartoon'];
    for (const keyword of styleKeywords) {
        if (description.toLowerCase().includes(keyword)) {
            spec.style = keyword;
            break;
        }
    }
    // Set engine
    if (framework) {
        spec.engine = framework;
    }
    // Defaults based on type
    if (spec.type === 'sprite_sheet' || spec.type === 'animation') {
        spec.loop = true;
        spec.background = 'transparent';
    }
    else if (spec.type === 'sprite' || spec.type === 'icon') {
        spec.background = 'transparent';
    }
    return spec;
}
/**
 * Generate asset ID from description
 */
function generateAssetId(description) {
    // Convert to snake_case
    return description
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50); // Limit length
}
/**
 * Infer asset type from description
 */
function inferAssetType(description) {
    const lower = description.toLowerCase();
    if (lower.includes('sprite sheet') || lower.includes('spritesheet') || lower.includes('animation')) {
        return 'sprite_sheet';
    }
    if (lower.includes('background') || lower.includes('bg')) {
        return 'background';
    }
    if (lower.includes('tileset') || lower.includes('tile')) {
        return 'tileset';
    }
    if (lower.includes('icon')) {
        return 'icon';
    }
    if (lower.includes('ui') || lower.includes('interface')) {
        return 'ui';
    }
    if (lower.includes('effect') || lower.includes('particle')) {
        return 'effect';
    }
    return 'sprite'; // Default
}
/**
 * Complete spec with defaults
 */
export function completeSpec(spec) {
    const completed = {
        assetId: spec.assetId || 'unnamed_asset',
        type: spec.type || 'sprite',
        ...spec
    };
    // Apply defaults based on type
    if (!completed.background) {
        if (completed.type === 'sprite' || completed.type === 'sprite_sheet' || completed.type === 'icon') {
            completed.background = 'transparent';
        }
        else {
            completed.background = 'solid';
        }
    }
    if (!completed.resolution && (completed.type === 'sprite' || completed.type === 'sprite_sheet')) {
        completed.resolution = '64x64'; // Default
    }
    if ((completed.type === 'sprite_sheet' || completed.type === 'animation') && !completed.loop) {
        completed.loop = true; // Default for animations
    }
    return completed;
}
//# sourceMappingURL=asset-specification.js.map