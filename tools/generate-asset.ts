
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { AdvancedSpriteGenerator, SpriteConfig } from './asset-generators/sprite-generator/advanced-sprite-generator';
import { PALETTES } from './procedural-generation/pixel-art-engine/palette-engine';

import { ProjectScaffolder } from './generators/project-scaffolder';

const program = new Command();

program
  .name('vibegen')
  .description('Vibecoding Asset Generator CLI')
  .version('1.0.0');

program
  .command('project')
  .description('Scaffold a new project with AI-generated assets')
  .argument('<name>', 'Project name')
  .option('-t, --type <type>', 'Project type (3d-world, 2d-platformer)', '3d-world')
  .action(async (name, options) => {
    try {
      const scaffolder = new ProjectScaffolder();
      await scaffolder.scaffold({
        name,
        type: options.type,
        targetDir: path.resolve(process.cwd(), 'projects')
      });
    } catch (error) {
      console.error('❌ Scaffolding failed:', error);
      process.exit(1);
    }
  });

program
  .command('sprite')
  .description('Generate a procedural pixel art sprite')
  .option('-t, --type <type>', 'Type of sprite (character, monster, item, spaceship)', 'character')
  .option('-w, --width <number>', 'Width in pixels', '32')
  .option('-h, --height <number>', 'Height in pixels', '32')
  .option('-p, --palette <name>', 'Palette name (fantasy, cyberpunk, etc) or random', 'random')
  .option('-s, --seed <number>', 'Random seed', Math.floor(Math.random() * 10000).toString())
  .option('-c, --complexity <number>', 'Complexity (0-1)', '0.5')
  .option('--no-outline', 'Disable black outline')
  .option('-o, --output <path>', 'Output file path', './sprite.png')
  .action(async (options) => {
    try {
      console.log(`🎨 Generating ${options.type} sprite...`);
      console.log(`   Seed: ${options.seed}`);
      console.log(`   Palette: ${options.palette}`);

      const generator = new AdvancedSpriteGenerator();
      const config: SpriteConfig = {
        width: parseInt(options.width),
        height: parseInt(options.height),
        type: options.type as any,
        palette: options.palette,
        seed: parseInt(options.seed),
        complexity: parseFloat(options.complexity),
        outline: options.outline
      };

      const buffer = generator.generateSprite(config);
      
      const outputPath = path.resolve(process.cwd(), options.output);
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`✅ Sprite saved to ${outputPath}`);
    } catch (error) {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    }
  });

program
  .command('palettes')
  .description('List available palettes')
  .action(() => {
    console.log('🎨 Available Palettes:');
    Object.entries(PALETTES).forEach(([key, p]) => {
      console.log(`  - ${key}: ${p.description}`);
    });
  });

program.parse(process.argv);
