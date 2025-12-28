import { SpriteGenerator, SpriteConfig } from '../../src/content/generators/SpriteGenerator';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

async function generateTestSprite() {
    const generator = new SpriteGenerator();
    
    const seed = 12345; // Deterministic seed
    const config: SpriteConfig = {
        dimensions: { width: 16, height: 16 },
        palette: ['#2D3436', '#D63031', '#FDCB6E', '#00B894', '#0984E3'], // Retro colors
        symmetry: 'horizontal',
        complexity: 0.8
    };

    console.log(chalk.blue(`🎨 Generating Sprite with seed ${seed}...`));

    // Phase 1: Generate Schema
    const schema = generator.generate(seed, config);
    const schemaPath = path.join(process.cwd(), `src/content/schemas/sprite_${seed}.json`);
    await fs.writeJSON(schemaPath, schema, { spaces: 2 });
    console.log(chalk.green(`✅ Schema written to ${path.relative(process.cwd(), schemaPath)}`));

    // Phase 2: Render Artifact
    const buffer = await generator.render(schema);
    const artifactPath = path.join(process.cwd(), `src/assets/generated/sprite_${seed}.png`);
    await fs.writeFile(artifactPath, buffer);
    console.log(chalk.green(`✅ Artifact written to ${path.relative(process.cwd(), artifactPath)}`));

    // Verify
    console.log(chalk.magenta('\n🔍 Verifying Output...'));
    if (fs.existsSync(schemaPath) && fs.existsSync(artifactPath)) {
        console.log(chalk.green('SUCCESS: Generator Pipeline Valid.'));
    } else {
        console.error(chalk.red('FAILURE: Files missing.'));
        process.exit(1);
    }
}

generateTestSprite().catch(err => {
    console.error(err);
    process.exit(1);
});
