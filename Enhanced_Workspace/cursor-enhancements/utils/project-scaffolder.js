/**
 * Project Scaffolding Enhancement
 *
 * Enhances project scaffolding to include asset infrastructure.
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import { createAssetRegistry } from '../integrations/asset-registry/asset-registry';
import { generateAndSaveManifest } from '../integrations/asset-registry/asset-manifest';
/**
 * Scaffold project with asset infrastructure
 */
export async function scaffoldProject(projectPath, options) {
    const created = [];
    const errors = [];
    try {
        // Create asset directories
        if (options?.includeAssets !== false) {
            const assetDirs = [
                'assets',
                'assets/sprites',
                'assets/backgrounds',
                'assets/ui',
                'assets/audio',
                'assets/tilesets'
            ];
            for (const dir of assetDirs) {
                const fullPath = path.join(projectPath, dir);
                try {
                    await fs.mkdir(fullPath, { recursive: true });
                    created.push(dir);
                }
                catch (error) {
                    errors.push(`Failed to create ${dir}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        }
        // Initialize asset registry
        try {
            const registry = await createAssetRegistry(projectPath);
            created.push('asset_registry.json');
        }
        catch (error) {
            errors.push(`Failed to create asset registry: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        // Generate asset manifest
        try {
            const manifestPath = await generateAndSaveManifest(projectPath);
            created.push('asset_manifest.json');
        }
        catch (error) {
            errors.push(`Failed to create asset manifest: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        // Create verification script if requested
        if (options?.includeVerification) {
            const scriptPath = path.join(projectPath, 'scripts', 'verify-assets.ts');
            const scriptContent = `/**
 * Asset Verification Script
 * 
 * Run this script to verify all assets exist and are properly registered.
 */

import { verifyProjectAssets, generateVerificationReport } from '../cursor-enhancements/integrations/asset-registry/self-verification';
import * as path from 'path';

async function main() {
  const projectPath = process.cwd();
  
  console.log('Verifying assets...');
  const report = await verifyProjectAssets(projectPath);
  
  console.log(\`\nVerification complete:\`);
  console.log(\`- Files scanned: \${report.scanned}\`);
  console.log(\`- Assets found: \${report.assetsFound}\`);
  console.log(\`- Assets valid: \${report.assetsValid}\`);
  console.log(\`- Assets missing: \${report.assetsMissing}\`);
  
  if (report.brokenReferences.length > 0) {
    console.log(\`\n⚠️  \${report.brokenReferences.length} broken reference(s) found\`);
  }
  
  if (report.errors.length > 0) {
    console.log(\`\n❌ Errors:\`);
    report.errors.forEach(err => console.log(\`  - \${err}\`));
  }
  
  // Generate report file
  const reportContent = await generateVerificationReport(projectPath);
  const reportPath = path.join(projectPath, 'asset-verification-report.md');
  await require('fs/promises').writeFile(reportPath, reportContent, 'utf-8');
  console.log(\`\n📄 Report saved to: \${reportPath}\`);
}

main().catch(console.error);
`;
            try {
                await fs.mkdir(path.dirname(scriptPath), { recursive: true });
                await fs.writeFile(scriptPath, scriptContent, 'utf-8');
                created.push('scripts/verify-assets.ts');
            }
            catch (error) {
                errors.push(`Failed to create verification script: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        // Create .gitkeep files in asset directories
        const assetDirs = ['assets/sprites', 'assets/backgrounds', 'assets/ui', 'assets/audio', 'assets/tilesets'];
        for (const dir of assetDirs) {
            const gitkeepPath = path.join(projectPath, dir, '.gitkeep');
            try {
                await fs.writeFile(gitkeepPath, '', 'utf-8');
            }
            catch {
                // Ignore errors for .gitkeep
            }
        }
    }
    catch (error) {
        errors.push(`Scaffolding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    return {
        success: errors.length === 0,
        created,
        errors
    };
}
//# sourceMappingURL=project-scaffolder.js.map