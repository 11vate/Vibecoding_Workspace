import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { glob } from 'glob';

const WORKSPACE_ROOT = process.cwd();
const GENERATED_ASSETS_PATH = path.join(WORKSPACE_ROOT, 'src/assets/generated'); // Or wherever generated assets go
const SCHEMAS_PATH = path.join(WORKSPACE_ROOT, 'src/content/schemas');
const GENERATORS_PATH = path.join(WORKSPACE_ROOT, 'src/content/generators');

async function checkContentIntegrity() {
    console.log(chalk.blue('🛡️  Content Integrity Gate: Verifying generator contracts...'));

    // Rule 1: Generator Existence
    // Check if we have generators
    const generators = await glob('**/*.ts', { cwd: GENERATORS_PATH });
    if (generators.length === 0) {
        console.warn(chalk.yellow('⚠️  No Generators found in src/content/generators.'));
    }

    // Rule 2: Schema Existence (The Schema Rule)
    // Every generated asset must map to a schema.
    // We assume a naming convention: asset "sprite_01.png" -> schema "sprite_01.json"
    // This is a simplification; in reality, we might read a manifest.
    
    if (!fs.existsSync(GENERATED_ASSETS_PATH)) {
        console.log(chalk.green('✅ No generated assets found (Clean state).'));
        return;
    }

    const generatedFiles = await glob('**/*.{png,wav,json}', { cwd: GENERATED_ASSETS_PATH });
    let violations = 0;

    for (const file of generatedFiles) {
        const fileBase = path.parse(file).name;
        const schemaPath = path.join(SCHEMAS_PATH, `${fileBase}.json`);

        if (!fs.existsSync(schemaPath)) {
            console.error(chalk.red(`❌ Orphaned Asset: ${file}`));
            console.error(chalk.gray(`   Missing Schema: ${path.relative(WORKSPACE_ROOT, schemaPath)}`));
            console.error(chalk.gray(`   Rule: "No Sprite Without a Schema"`));
            violations++;
        }
    }

    if (violations > 0) {
        console.error(chalk.bold.red(`\n⛔ Integrity Gate Failed: ${violations} orphaned assets found.`));
        process.exit(1);
    } else {
        console.log(chalk.green('✅ Content Integrity Gate Passed.'));
    }
}

checkContentIntegrity().catch(err => {
    console.error(chalk.red('Fatal Error:'), err);
    process.exit(1);
});
