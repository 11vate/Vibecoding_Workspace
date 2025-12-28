/**
 * Runtime Asset Verification
 *
 * Generates runtime checks that fail fast if assets are missing.
 * Creates engine-specific verification code.
 */
/**
 * Generate runtime checks for assets
 */
export function generateRuntimeChecks(assets, framework) {
    const checks = assets.map(a => a.id);
    if (framework === 'phaser') {
        return generatePhaserChecks(assets, checks);
    }
    else if (framework === 'pixi') {
        return generatePixiChecks(assets, checks);
    }
    else {
        return generateGenericChecks(assets, checks);
    }
}
/**
 * Generate Phaser-specific runtime checks
 */
function generatePhaserChecks(assets, checks) {
    const codeLines = [
        '/**',
        ' * Runtime Asset Verification',
        ' * Generated automatically - do not edit manually',
        ' */',
        '',
        'export function verifyAssets(scene: Phaser.Scene): {',
        '  valid: boolean;',
        '  missing: string[];',
        '  errors: string[];',
        '} {',
        '  const missing: string[] = [];',
        '  const errors: string[] = [];',
        '',
        '  // Check each asset',
        ''
    ];
    for (const asset of assets) {
        codeLines.push(`  // Asset: ${asset.id}`);
        codeLines.push(`  if (!scene.textures.exists('${asset.id}')) {`);
        codeLines.push(`    missing.push('${asset.id}');`);
        codeLines.push(`    errors.push('Missing asset: ${asset.id} (expected at ${asset.path})');`);
        codeLines.push(`  }`);
        codeLines.push('');
    }
    codeLines.push('  return {');
    codeLines.push('    valid: missing.length === 0,');
    codeLines.push('    missing,');
    codeLines.push('    errors');
    codeLines.push('  };');
    codeLines.push('}');
    codeLines.push('');
    codeLines.push('// Call this in your scene create() method:');
    codeLines.push('// const verification = verifyAssets(this);');
    codeLines.push('// if (!verification.valid) {');
    codeLines.push('//   console.error("Asset verification failed:", verification.errors);');
    codeLines.push('//   throw new Error("Missing assets detected");');
    codeLines.push('// }');
    return {
        code: codeLines.join('\n'),
        language: 'typescript',
        framework: 'phaser',
        checks
    };
}
/**
 * Generate PixiJS-specific runtime checks
 */
function generatePixiChecks(assets, checks) {
    const codeLines = [
        '/**',
        ' * Runtime Asset Verification',
        ' * Generated automatically - do not edit manually',
        ' */',
        '',
        'import * as PIXI from "pixi.js";',
        '',
        'export function verifyAssets(loader: PIXI.Loader): {',
        '  valid: boolean;',
        '  missing: string[];',
        '  errors: string[];',
        '} {',
        '  const missing: string[] = [];',
        '  const errors: string[] = [];',
        '',
        '  // Check each asset',
        ''
    ];
    for (const asset of assets) {
        codeLines.push(`  // Asset: ${asset.id}`);
        codeLines.push(`  if (!loader.resources['${asset.id}']) {`);
        codeLines.push(`    missing.push('${asset.id}');`);
        codeLines.push(`    errors.push('Missing asset: ${asset.id} (expected at ${asset.path})');`);
        codeLines.push(`  }`);
        codeLines.push('');
    }
    codeLines.push('  return {');
    codeLines.push('    valid: missing.length === 0,');
    codeLines.push('    missing,');
    codeLines.push('    errors');
    codeLines.push('  };');
    codeLines.push('}');
    return {
        code: codeLines.join('\n'),
        language: 'typescript',
        framework: 'pixi',
        checks
    };
}
/**
 * Generate generic runtime checks
 */
function generateGenericChecks(assets, checks) {
    const codeLines = [
        '/**',
        ' * Runtime Asset Verification',
        ' * Generated automatically - do not edit manually',
        ' */',
        '',
        'export function verifyAssets(assetLoader: { hasAsset(id: string): boolean }): {',
        '  valid: boolean;',
        '  missing: string[];',
        '  errors: string[];',
        '} {',
        '  const missing: string[] = [];',
        '  const errors: string[] = [];',
        '',
        '  // Check each asset',
        ''
    ];
    for (const asset of assets) {
        codeLines.push(`  // Asset: ${asset.id}`);
        codeLines.push(`  if (!assetLoader.hasAsset('${asset.id}')) {`);
        codeLines.push(`    missing.push('${asset.id}');`);
        codeLines.push(`    errors.push('Missing asset: ${asset.id} (expected at ${asset.path})');`);
        codeLines.push(`  }`);
        codeLines.push('');
    }
    codeLines.push('  return {');
    codeLines.push('    valid: missing.length === 0,');
    codeLines.push('    missing,');
    codeLines.push('    errors');
    codeLines.push('  };');
    codeLines.push('}');
    return {
        code: codeLines.join('\n'),
        language: 'typescript',
        framework: 'custom',
        checks
    };
}
/**
 * Create asset loader with verification
 */
export function createAssetLoaderWithVerification(registry, framework) {
    const allAssets = Array.from(registry.assets.values());
    return generateRuntimeChecks(allAssets, framework);
}
//# sourceMappingURL=runtime-verification.js.map