/**
 * Asset Reference Scanner
 *
 * Scans code to detect asset references and verifies their existence.
 * Used before code generation to ensure all referenced assets exist.
 */
import { extractAssetSpecs, generateSpecFromDescription } from '../integrations/asset-registry/asset-specification';
/**
 * Scan code for asset references
 */
export function scanForAssetReferences(code, framework) {
    const references = [];
    const lines = code.split('\n');
    // Framework-specific patterns
    if (framework === 'phaser') {
        references.push(...scanPhaserReferences(code, lines));
    }
    else if (framework === 'pixi') {
        references.push(...scanPixiReferences(code, lines));
    }
    else {
        // Generic patterns
        references.push(...scanGenericReferences(code, lines));
    }
    // Extract specs from code (may contain asset references)
    const specs = extractAssetSpecs(code);
    for (const spec of specs) {
        references.push({
            assetId: spec.assetId,
            type: 'spec',
            location: {
                line: 0, // Spec extraction doesn't track line numbers
                column: 0,
                context: `Asset spec: ${spec.assetId}`
            },
            inferredSpec: spec
        });
    }
    return references;
}
/**
 * Scan for Phaser-specific asset references
 */
function scanPhaserReferences(code, lines) {
    const references = [];
    // Pattern: this.load.image('assetId', 'path')
    const imagePattern = /\.load\.image\(['"]([^'"]+)['"]/g;
    let match;
    while ((match = imagePattern.exec(code)) !== null) {
        const assetId = match[1];
        const lineNum = getLineNumber(code, match.index);
        references.push({
            assetId,
            type: 'load_call',
            location: {
                line: lineNum,
                column: match.index - code.lastIndexOf('\n', match.index) - 1,
                context: lines[lineNum - 1] || ''
            }
        });
    }
    // Pattern: this.load.spritesheet('assetId', 'path', { frameWidth, frameHeight })
    const spritesheetPattern = /\.load\.spritesheet\(['"]([^'"]+)['"]/g;
    while ((match = spritesheetPattern.exec(code)) !== null) {
        const assetId = match[1];
        const lineNum = getLineNumber(code, match.index);
        references.push({
            assetId,
            type: 'load_call',
            location: {
                line: lineNum,
                column: match.index - code.lastIndexOf('\n', match.index) - 1,
                context: lines[lineNum - 1] || ''
            }
        });
    }
    // Pattern: this.add.image(x, y, 'assetId')
    const addImagePattern = /\.add\.image\([^,]+,\s*[^,]+,\s*['"]([^'"]+)['"]/g;
    while ((match = addImagePattern.exec(code)) !== null) {
        const assetId = match[1];
        const lineNum = getLineNumber(code, match.index);
        references.push({
            assetId,
            type: 'id',
            location: {
                line: lineNum,
                column: match.index - code.lastIndexOf('\n', match.index) - 1,
                context: lines[lineNum - 1] || ''
            }
        });
    }
    // Pattern: this.anims.create({ key: 'assetId', ... })
    const animsPattern = /\.anims\.create\([^)]*key:\s*['"]([^'"]+)['"]/g;
    while ((match = animsPattern.exec(code)) !== null) {
        const assetId = match[1];
        const lineNum = getLineNumber(code, match.index);
        references.push({
            assetId,
            type: 'id',
            location: {
                line: lineNum,
                column: match.index - code.lastIndexOf('\n', match.index) - 1,
                context: lines[lineNum - 1] || ''
            }
        });
    }
    return references;
}
/**
 * Scan for PixiJS-specific asset references
 */
function scanPixiReferences(code, lines) {
    const references = [];
    // Pattern: PIXI.Loader.shared.add('assetId', 'path')
    const loaderPattern = /\.add\(['"]([^'"]+)['"]/g;
    let match;
    while ((match = loaderPattern.exec(code)) !== null) {
        const assetId = match[1];
        const lineNum = getLineNumber(code, match.index);
        references.push({
            assetId,
            type: 'load_call',
            location: {
                line: lineNum,
                column: match.index - code.lastIndexOf('\n', match.index) - 1,
                context: lines[lineNum - 1] || ''
            }
        });
    }
    // Pattern: new PIXI.Sprite(PIXI.Texture.from('assetId'))
    const texturePattern = /Texture\.from\(['"]([^'"]+)['"]/g;
    while ((match = texturePattern.exec(code)) !== null) {
        const assetId = match[1];
        const lineNum = getLineNumber(code, match.index);
        references.push({
            assetId,
            type: 'id',
            location: {
                line: lineNum,
                column: match.index - code.lastIndexOf('\n', match.index) - 1,
                context: lines[lineNum - 1] || ''
            }
        });
    }
    return references;
}
/**
 * Scan for generic asset references (file paths, asset IDs)
 */
function scanGenericReferences(code, lines) {
    const references = [];
    // Pattern: asset paths (assets/... or /assets/...)
    const pathPattern = /['"](?:\.\/)?assets\/[^'"]+['"]/g;
    let match;
    while ((match = pathPattern.exec(code)) !== null) {
        const path = match[0].replace(/['"]/g, '');
        const assetId = extractAssetIdFromPath(path);
        if (assetId) {
            const lineNum = getLineNumber(code, match.index);
            references.push({
                assetId,
                type: 'path',
                location: {
                    line: lineNum,
                    column: match.index - code.lastIndexOf('\n', match.index) - 1,
                    context: lines[lineNum - 1] || ''
                }
            });
        }
    }
    // Pattern: asset IDs in comments or strings
    // Look for common patterns like "pet_flameling_idle", "sprite_hero", etc.
    const idPattern = /\b([a-z][a-z0-9_]*_(?:idle|walk|attack|death|sprite|icon|bg))\b/gi;
    while ((match = idPattern.exec(code)) !== null) {
        const assetId = match[1];
        const lineNum = getLineNumber(code, match.index);
        // Avoid duplicates
        if (!references.some(ref => ref.assetId === assetId && ref.location.line === lineNum)) {
            references.push({
                assetId,
                type: 'id',
                location: {
                    line: lineNum,
                    column: match.index - code.lastIndexOf('\n', match.index) - 1,
                    context: lines[lineNum - 1] || ''
                }
            });
        }
    }
    return references;
}
/**
 * Extract asset ID from file path
 */
function extractAssetIdFromPath(filePath) {
    // Remove extension and path, keep filename
    const filename = filePath.split('/').pop()?.split('\\').pop();
    if (!filename) {
        return null;
    }
    // Remove extension
    const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
    // Convert to asset ID format (snake_case)
    return nameWithoutExt.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}
/**
 * Get line number from character index
 */
function getLineNumber(code, index) {
    return code.substring(0, index).split('\n').length;
}
/**
 * Check asset existence against registry
 */
export async function checkAssetExistence(references, registry) {
    const missing = [];
    const seen = new Set();
    for (const ref of references) {
        if (seen.has(ref.assetId)) {
            continue;
        }
        seen.add(ref.assetId);
        const entry = registry.assets.get(ref.assetId);
        if (!entry) {
            // Asset not in registry
            missing.push({
                assetId: ref.assetId,
                references: [ref],
                inferredSpec: ref.inferredSpec,
                reason: 'not_in_registry'
            });
        }
        else {
            // Check if file actually exists
            const fullPath = `${registry.projectPath}/${entry.path}`;
            try {
                const fs = require('fs/promises');
                await fs.access(fullPath);
            }
            catch {
                // File missing
                missing.push({
                    assetId: ref.assetId,
                    references: [ref],
                    inferredSpec: ref.inferredSpec || entry.spec,
                    reason: 'file_missing'
                });
            }
        }
    }
    return missing;
}
/**
 * Generate asset specs for missing assets
 */
export function generateAssetSpecsForMissing(missing) {
    const specs = [];
    for (const asset of missing) {
        if (asset.inferredSpec) {
            specs.push(asset.inferredSpec);
        }
        else {
            // Try to infer from asset ID
            const spec = generateSpecFromDescription(asset.assetId);
            specs.push(spec);
        }
    }
    return specs;
}
/**
 * Full scan and check
 */
export async function scanAndCheckAssets(code, registry, framework) {
    const references = scanForAssetReferences(code, framework);
    const missing = await checkAssetExistence(references, registry);
    const existing = references
        .filter(ref => !missing.some(m => m.assetId === ref.assetId))
        .map(ref => ref.assetId);
    const warnings = [];
    // Warn about assets with inferred specs (may be incomplete)
    for (const asset of missing) {
        if (asset.inferredSpec && !asset.inferredSpec.resolution) {
            warnings.push(`Asset ${asset.assetId} has incomplete spec (missing resolution)`);
        }
    }
    return {
        references,
        missing,
        existing,
        warnings
    };
}
//# sourceMappingURL=asset-reference-scanner.js.map