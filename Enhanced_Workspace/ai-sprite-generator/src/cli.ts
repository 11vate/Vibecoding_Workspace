#!/usr/bin/env node

/**
 * CLI for AI Sprite Generator
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { AssetPipeline } from './pipeline/AssetPipeline.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const program = new Command();

program
  .name('ai-sprite-gen')
  .description('Intelligent AI Sprite Generator - Production-ready game asset generation')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate a sprite from a description')
  .argument('<concept>', 'Sprite concept description (e.g., "pixel art fire pet idle animation")')
  .option('-f, --frames <number>', 'Number of animation frames', parseInt)
  .option('-s, --style <style>', 'Visual style (pixel-art, cartoon, etc.)')
  .option('-e, --engine <engine>', 'Target game engine (phaser, pixijs, custom)')
  .option('-o, --output <dir>', 'Output directory', 'assets')
  .option('--no-post-processing', 'Skip post-processing')
  .option('--no-validation', 'Skip validation')
  .option('--no-export', 'Skip export')
  .action(async (concept, options) => {
    const spinner = ora('Generating sprite...').start();

    try {
      const pipeline = new AssetPipeline();

      const config = {
        enablePostProcessing: options.postProcessing !== false,
        enableValidation: options.validation !== false,
        enableExport: options.export !== false,
        targetEngine: options.engine,
      };

      spinner.text = 'Interpreting concept...';
      const result = await pipeline.execute(concept, config);

      if (!result.success) {
        spinner.fail('Generation failed');
        console.error(chalk.red('\nErrors:'));
        result.errors.forEach(error => console.error(chalk.red(`  - ${error}`)));
        if (result.warnings.length > 0) {
          console.warn(chalk.yellow('\nWarnings:'));
          result.warnings.forEach(warning => console.warn(chalk.yellow(`  - ${warning}`)));
        }
        process.exit(1);
      }

      spinner.text = 'Saving assets...';

      // Create output directory
      const outputDir = options.output;
      await mkdir(outputDir, { recursive: true });
      await mkdir(join(outputDir, 'sprites'), { recursive: true });
      await mkdir(join(outputDir, 'sheets'), { recursive: true });
      await mkdir(join(outputDir, 'metadata'), { recursive: true });
      if (result.codeBindings) {
        await mkdir(join(outputDir, 'code'), { recursive: true });
      }

      // Save sprite
      if (result.sprite) {
        const spritePath = join(outputDir, 'sprites', `${result.sprite.id}.png`);
        await writeFile(spritePath, result.sprite.data);
        console.log(chalk.green(`\n✓ Sprite saved: ${spritePath}`));
      }

      // Save sprite sheet if animation
      if (result.sheet && result.metadata) {
        const sheetPath = join(outputDir, 'sheets', `${result.sprite!.id}_sheet.png`);
        await writeFile(sheetPath, result.sheet);
        console.log(chalk.green(`✓ Sprite sheet saved: ${sheetPath}`));

        // Save metadata
        const metadataPath = join(outputDir, 'metadata', `${result.sprite!.id}.json`);
        await writeFile(metadataPath, JSON.stringify(result.metadata, null, 2));
        console.log(chalk.green(`✓ Metadata saved: ${metadataPath}`));
      }

      // Save code bindings
      if (result.codeBindings) {
        for (const binding of result.codeBindings) {
          const codePath = join(outputDir, 'code', binding.filePath);
          await mkdir(join(codePath, '..'), { recursive: true });
          await writeFile(codePath, binding.code);
          console.log(chalk.green(`✓ Code binding saved: ${codePath}`));
        }
      }

      spinner.succeed('Generation complete!');

      if (result.warnings.length > 0) {
        console.warn(chalk.yellow('\nWarnings:'));
        result.warnings.forEach(warning => console.warn(chalk.yellow(`  - ${warning}`)));
      }
    } catch (error) {
      spinner.fail('Generation failed');
      console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

program
  .command('scan')
  .description('Scan project for missing assets')
  .argument('<project-path>', 'Path to game project')
  .option('-s, --suggest', 'Generate suggestions for missing assets')
  .option('-j, --json', 'Output as JSON')
  .action(async (projectPath, options) => {
    const spinner = ora('Scanning project...').start();

    try {
      const { ProjectScanner } = await import('./analysis/ProjectScanner.js');
      const { MissingAssetDetector } = await import('./analysis/MissingAssetDetector.js');
      const { MissingAssetSuggester } = await import('./analysis/MissingAssetSuggester.js');

      // Scan project
      spinner.text = 'Detecting game engine...';
      const scanner = new ProjectScanner();
      const analysis = await scanner.scanProject(projectPath);

      spinner.text = 'Detecting missing assets...';
      const detector = new MissingAssetDetector();
      const report = await detector.detectMissing(projectPath, analysis.assetReferences);

      if (options.json) {
        spinner.stop();
        console.log(JSON.stringify({
          engine: analysis.engine,
          projectPath: analysis.projectPath,
          missingAssets: report.missingAssets.length,
          existingAssets: report.existingAssets.length,
          totalReferences: report.totalReferences,
          missing: report.missingAssets.map(a => ({
            assetId: a.assetId,
            reason: a.reason,
            references: a.references.length
          })),
          warnings: report.warnings
        }, null, 2));
        return;
      }

      spinner.succeed('Scan complete!');

      // Display results
      console.log(chalk.cyan(`\nEngine: ${analysis.engine}`));
      console.log(chalk.cyan(`Total references: ${report.totalReferences}`));
      console.log(chalk.green(`Existing assets: ${report.existingAssets.length}`));
      console.log(chalk.red(`Missing assets: ${report.missingAssets.length}`));

      if (report.missingAssets.length > 0) {
        console.log(chalk.yellow('\nMissing Assets:'));
        for (const asset of report.missingAssets) {
          console.log(chalk.red(`  ✗ ${asset.assetId}`));
          console.log(chalk.gray(`    Reason: ${asset.reason}`));
          console.log(chalk.gray(`    References: ${asset.references.length} location(s)`));
          if (asset.references.length > 0) {
            const firstRef = asset.references[0];
            console.log(chalk.gray(`    First reference: ${firstRef.location.context.trim()}`));
          }
        }

        if (options.suggest) {
          spinner.start('Generating suggestions...');
          const suggester = new MissingAssetSuggester();
          const suggestions = await suggester.suggestAssets(projectPath, report.missingAssets);

          spinner.succeed('Suggestions generated!');

          console.log(chalk.cyan('\nSuggested Prompts:'));
          for (const suggestion of suggestions) {
            console.log(chalk.green(`  • ${suggestion.assetId}:`));
            console.log(chalk.white(`    "${suggestion.prompt}"`));
            console.log(chalk.gray(`    Confidence: ${(suggestion.confidence * 100).toFixed(0)}%`));
            if (suggestion.type === 'set') {
              console.log(chalk.yellow(`    (Part of a set - consider generating full set)`));
            }
          }
        }
      }

      if (report.warnings.length > 0) {
        console.warn(chalk.yellow('\nWarnings:'));
        report.warnings.forEach(warning => console.warn(chalk.yellow(`  - ${warning}`)));
      }

      if (analysis.warnings.length > 0) {
        console.warn(chalk.yellow('\nScan Warnings:'));
        analysis.warnings.forEach(warning => console.warn(chalk.yellow(`  - ${warning}`)));
      }
    } catch (error) {
      spinner.fail('Scan failed');
      console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}`));
      if (error instanceof Error && error.stack) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

program.parse();

