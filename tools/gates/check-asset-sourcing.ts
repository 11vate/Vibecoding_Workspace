import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { glob } from 'glob';

const WORKSPACE_ROOT = process.cwd();
const ASSET_REGISTRY_PATH = path.join(WORKSPACE_ROOT, 'asset-system/ASSET_REGISTRY.json');
const TARGET_PROJECT_PATH = path.join(WORKSPACE_ROOT, 'games/PixelPets_Reborn_x_remeged');
const TARGET_ASSETS_PATH = path.join(TARGET_PROJECT_PATH, 'public'); // Adjust if assets are elsewhere

interface AssetEntry {
    id: string;
    path: string;
    source_mode: 'Mode 1' | 'Mode 2' | 'Mode 3' | 'Mode 4';
    license?: string;
}

interface Registry {
    assets: AssetEntry[];
}

async function checkAssetSourcing() {
    console.log(chalk.blue('🔒 Asset Sourcing Gate: Checking compliance...'));

    if (!fs.existsSync(ASSET_REGISTRY_PATH)) {
        console.warn(chalk.yellow('⚠️  No ASSET_REGISTRY.json found. Creating empty registry...'));
        await fs.writeJSON(ASSET_REGISTRY_PATH, { assets: [] }, { spaces: 2 });
    }

    const registry: Registry = await fs.readJSON(ASSET_REGISTRY_PATH);
    const registeredPaths = new Set(registry.assets.map(a => path.normalize(a.path)));

    // Find all asset files in the target directory
    // Excluding .json, .md, and typical ignored files
    const assetFiles = await glob('**/*.{png,jpg,jpeg,gif,webp,svg,wav,mp3,ogg,glb,gltf}', {
        cwd: TARGET_ASSETS_PATH,
        ignore: ['**/*.meta.json']
    });

    let violations = 0;

    for (const file of assetFiles) {
        // Construct the relative path as it should appear in the registry
        // We assume registry paths are relative to the project root or workspace root.
        // Let's standardize on: relative to workspace root.
        const absolutePath = path.join(TARGET_ASSETS_PATH, file);
        const relativeToWorkspace = path.relative(WORKSPACE_ROOT, absolutePath);

        if (!registeredPaths.has(path.normalize(relativeToWorkspace))) {
            console.error(chalk.red(`❌ Unauthorized Asset: ${file}`));
            console.error(chalk.gray(`   Path: ${relativeToWorkspace}`));
            console.error(chalk.gray(`   Action: Add to ASSET_REGISTRY.json with valid Source Mode.`));
            violations++;
        }
    }

    if (violations > 0) {
        console.error(chalk.bold.red(`\n⛔ Gate Failed: ${violations} unauthorized assets found.`));
        process.exit(1);
    } else {
        console.log(chalk.green('✅ Asset Sourcing Gate Passed.'));
    }
}

checkAssetSourcing().catch(err => {
    console.error(chalk.red('Fatal Error:'), err);
    process.exit(1);
});
