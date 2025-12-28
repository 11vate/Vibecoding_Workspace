import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { glob } from 'glob';
import { SpriteGenerator, SpriteConfig } from '../../src/content/generators/SpriteGenerator';
import { LoreGenerator, LoreConfig } from '../../src/content/generators/LoreGenerator';
import { GeometryGenerator, GeometryConfig } from '../../src/content/generators/GeometryGenerator';

const WORKSPACE_ROOT = process.cwd();
const SCHEMAS_PATH = path.join(WORKSPACE_ROOT, 'src/content/schemas');
const GENERATED_ASSETS_PATH = path.join(WORKSPACE_ROOT, 'src/assets/generated');
const MANIFEST_PATH = path.join(WORKSPACE_ROOT, 'src/content/manifests/core_manifest.json');

class ContentCompiler {
    private spriteGen = new SpriteGenerator();
    private loreGen = new LoreGenerator();
    private geoGen = new GeometryGenerator();

    async compile() {
        console.log(chalk.bold.blue('🏭 Content Compiler: Starting Build...'));

        // Ensure directories
        await fs.ensureDir(SCHEMAS_PATH);
        await fs.ensureDir(GENERATED_ASSETS_PATH);

        // Load Manifest
        if (!await fs.pathExists(MANIFEST_PATH)) {
            console.error(chalk.red(`❌ Manifest not found at ${MANIFEST_PATH}`));
            return;
        }
        
        const manifest = await fs.readJSON(MANIFEST_PATH);
        const items = manifest.content || [];
        
        console.log(chalk.blue(`   Loaded manifest with ${items.length} items.`));

        let successCount = 0;
        let failCount = 0;

        for (const item of items) {
            try {
                console.log(chalk.gray(`   Compiling ${item.id} (${item.type})...`));

                if (item.type === 'sprite') {
                    // 1. Generate Schema
                    const schema = this.spriteGen.generate(item.seed, item.config as SpriteConfig);
                    schema.id = item.id; // Override ID with manifest ID

                    // 2. Write Schema (The AST)
                    const schemaPath = path.join(SCHEMAS_PATH, `${item.id}.json`);
                    await fs.writeJSON(schemaPath, schema, { spaces: 2 });

                    // 3. Render Artifact (The Bytecode)
                    const buffer = await this.spriteGen.render(schema);
                    const artifactPath = path.join(GENERATED_ASSETS_PATH, `${item.id}.png`);
                    await fs.writeFile(artifactPath, buffer);

                    successCount++;
                } 
                else if (item.type === 'lore') {
                     // 1. Generate Schema
                     const schema = this.loreGen.generate(item.seed, item.config as LoreConfig);
                     schema.id = item.id;
 
                     // 2. Write Schema
                     const schemaPath = path.join(SCHEMAS_PATH, `${item.id}.json`);
                     await fs.writeJSON(schemaPath, schema, { spaces: 2 });
 
                     // 3. Render Artifact (Text File)
                     const textContent = await this.loreGen.render(schema);
                     const artifactPath = path.join(GENERATED_ASSETS_PATH, `${item.id}.txt`);
                     await fs.writeFile(artifactPath, textContent);
 
                     successCount++;
                }
                else if (item.type === 'geometry') {
                    // 1. Generate Schema
                    const schema = this.geoGen.generate(item.seed, item.config as GeometryConfig);
                    schema.id = item.id;

                    // 2. Write Schema
                    const schemaPath = path.join(SCHEMAS_PATH, `${item.id}.json`);
                    await fs.writeJSON(schemaPath, schema, { spaces: 2 });

                    // 3. Render Artifact (OBJ File)
                    const objContent = await this.geoGen.render(schema);
                    const artifactPath = path.join(GENERATED_ASSETS_PATH, `${item.id}.obj`);
                    await fs.writeFile(artifactPath, objContent);

                    successCount++;
                }
                else {
                    console.warn(chalk.yellow(`   Unknown content type: ${item.type}`));
                }
            } catch (err) {
                console.error(chalk.red(`❌ Failed to compile ${item.id}:`), err);
                failCount++;
            }
        }

        console.log(chalk.bold(`\n✨ Compilation Complete`));
        console.log(chalk.green(`   Success: ${successCount}`));
        if (failCount > 0) console.log(chalk.red(`   Failed:  ${failCount}`));
    }
}

new ContentCompiler().compile().catch(err => {
    console.error(chalk.red('Fatal Compiler Error:'), err);
    process.exit(1);
});
