/**
 * Self-Verification & Repair System
 *
 * Automatically scans projects for asset issues and repairs them.
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import { createAssetRegistry, verifyAllAssets, registerAsset } from './asset-registry';
import { scanForAssetReferences } from '../../utils/asset-reference-scanner';
import { autoGenerateAsset } from './auto-generator';
import { generateSpecFromDescription } from './asset-specification';
/**
 * Verify project assets
 */
export async function verifyProjectAssets(projectPath) {
    const report = {
        projectPath,
        scanned: 0,
        assetsFound: 0,
        assetsValid: 0,
        assetsMissing: 0,
        brokenReferences: [],
        missingFiles: [],
        generated: 0,
        errors: [],
        warnings: []
    };
    try {
        // Load registry
        const registry = await createAssetRegistry(projectPath);
        // Find all code files
        const codeFiles = await findCodeFiles(projectPath);
        report.scanned = codeFiles.length;
        // Scan each file for asset references
        const allReferences = new Map(); // assetId -> file paths
        for (const filePath of codeFiles) {
            try {
                const code = await fs.readFile(filePath, 'utf-8');
                const references = scanForAssetReferences(code);
                for (const ref of references) {
                    if (!allReferences.has(ref.assetId)) {
                        allReferences.set(ref.assetId, new Set());
                    }
                    allReferences.get(ref.assetId).add(filePath);
                }
            }
            catch (error) {
                report.warnings.push(`Failed to scan ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        report.assetsFound = allReferences.size;
        // Verify each referenced asset
        const verification = await verifyAllAssets(registry);
        for (const [assetId, filePaths] of allReferences) {
            const entry = registry.assets.get(assetId);
            if (!entry) {
                // Asset not in registry
                report.assetsMissing++;
                for (const filePath of filePaths) {
                    report.brokenReferences.push({
                        assetId,
                        filePath,
                        line: 0, // Line number not available from scanner
                        context: `Asset ${assetId} referenced but not in registry`
                    });
                }
            }
            else if (!verification.valid.includes(assetId)) {
                // Asset in registry but file missing
                report.assetsMissing++;
                report.missingFiles.push(entry.path);
                for (const filePath of filePaths) {
                    report.brokenReferences.push({
                        assetId,
                        filePath,
                        line: 0,
                        context: `Asset ${assetId} registered but file missing: ${entry.path}`
                    });
                }
            }
            else {
                report.assetsValid++;
            }
        }
    }
    catch (error) {
        report.errors.push(`Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    return report;
}
/**
 * Repair missing assets
 */
export async function repairMissingAssets(report, config) {
    const result = {
        success: true,
        generated: [],
        fixed: [],
        failed: [],
        errors: []
    };
    // Get unique missing asset IDs
    const missingAssetIds = new Set(report.brokenReferences.map(ref => ref.assetId));
    // Load registry
    const registry = await createAssetRegistry(report.projectPath);
    // Generate missing assets
    for (const assetId of missingAssetIds) {
        try {
            // Generate spec
            const spec = generateSpecFromDescription(assetId, config.framework);
            // Generate asset
            const generationResult = await autoGenerateAsset(spec, config);
            if (generationResult.success) {
                // Register asset
                const assetEntry = {
                    id: assetId,
                    path: generationResult.path,
                    type: spec.type === 'sprite_sheet' ? 'sprite' : spec.type,
                    spec,
                    validated: true,
                    lastValidated: new Date(),
                    generated: true,
                    metadata: generationResult.asset.metadata,
                    references: Array.from(new Set(report.brokenReferences.filter(ref => ref.assetId === assetId).map(ref => ref.filePath)))
                };
                await registerAsset(registry, assetEntry);
                result.generated.push(assetId);
                result.fixed.push(assetId);
            }
            else {
                result.failed.push(assetId);
                result.errors.push(`Failed to generate ${assetId}: ${generationResult.errors.join(', ')}`);
                result.success = false;
            }
        }
        catch (error) {
            result.failed.push(assetId);
            result.errors.push(`Error generating ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            result.success = false;
        }
    }
    return result;
}
/**
 * Generate verification report as markdown
 */
export async function generateVerificationReport(projectPath) {
    const report = await verifyProjectAssets(projectPath);
    const lines = [
        '# Asset Verification Report',
        '',
        `**Project:** ${path.basename(projectPath)}`,
        `**Generated:** ${new Date().toISOString()}`,
        '',
        '## Summary',
        '',
        `- **Files Scanned:** ${report.scanned}`,
        `- **Assets Found:** ${report.assetsFound}`,
        `- **Assets Valid:** ${report.assetsValid}`,
        `- **Assets Missing:** ${report.assetsMissing}`,
        `- **Broken References:** ${report.brokenReferences.length}`,
        '',
    ];
    if (report.brokenReferences.length > 0) {
        lines.push('## Broken References', '');
        for (const ref of report.brokenReferences) {
            lines.push(`- **${ref.assetId}** in \`${ref.filePath}\``);
            lines.push(`  - ${ref.context}`);
        }
        lines.push('');
    }
    if (report.missingFiles.length > 0) {
        lines.push('## Missing Files', '');
        for (const file of report.missingFiles) {
            lines.push(`- \`${file}\``);
        }
        lines.push('');
    }
    if (report.errors.length > 0) {
        lines.push('## Errors', '');
        for (const error of report.errors) {
            lines.push(`- ${error}`);
        }
        lines.push('');
    }
    if (report.warnings.length > 0) {
        lines.push('## Warnings', '');
        for (const warning of report.warnings) {
            lines.push(`- ${warning}`);
        }
        lines.push('');
    }
    return lines.join('\n');
}
/**
 * Find all code files in project
 */
async function findCodeFiles(projectPath) {
    const files = [];
    const ignoreDirs = ['node_modules', 'dist', 'build', '.git', '.next', '.vite'];
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    async function walkDir(dir) {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                // Skip ignored directories
                if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
                    await walkDir(fullPath);
                }
                else if (entry.isFile()) {
                    const ext = path.extname(entry.name);
                    if (extensions.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        }
        catch {
            // Skip directories we can't read
        }
    }
    await walkDir(projectPath);
    return files;
}
//# sourceMappingURL=self-verification.js.map