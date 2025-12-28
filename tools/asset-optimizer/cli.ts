#!/usr/bin/env node
/**
 * Asset Optimizer CLI
 *
 * Purpose: Command-line interface for asset optimization
 * Authority: Tier 3 (Optional tooling)
 * Use: Compress and optimize assets
 */

import { compressPNG, optimizeDirectory } from './compress-png';
import { resizeImage, generateThumbnail } from './resize';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];

  switch (command) {
    case 'compress':
      await handleCompress(args.slice(1));
      break;

    case 'resize':
      await handleResize(args.slice(1));
      break;

    case 'thumbnail':
      await handleThumbnail(args.slice(1));
      break;

    case 'optimize':
      await handleOptimize(args.slice(1));
      break;

    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

async function handleCompress(args: string[]) {
  if (args.length === 0) {
    console.error('Error: File path required');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1];

  console.log(`Compressing: ${inputPath}\n`);

  const result = await compressPNG(inputPath, outputPath);

  console.log('Results:');
  console.log(`  Original: ${formatBytes(result.originalSize)}`);
  console.log(`  Compressed: ${formatBytes(result.compressedSize)}`);
  console.log(`  Savings: ${formatBytes(result.savings)} (${result.reduction.toFixed(1)}%)`);
}

async function handleResize(args: string[]) {
  if (args.length < 2) {
    console.error('Error: Input and output paths required');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1];

  const width = args.includes('--width') ? parseInt(args[args.indexOf('--width') + 1]) : undefined;
  const height = args.includes('--height') ? parseInt(args[args.indexOf('--height') + 1]) : undefined;

  const result = await resizeImage(inputPath, outputPath, { width, height });

  console.log('Resize complete:');
  console.log(`  Original: ${result.originalDimensions.width}x${result.originalDimensions.height}`);
  console.log(`  New: ${result.newDimensions.width}x${result.newDimensions.height}`);
}

async function handleThumbnail(args: string[]) {
  if (args.length < 2) {
    console.error('Error: Input and output paths required');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1];
  const size = args[2] ? parseInt(args[2]) : 128;

  await generateThumbnail(inputPath, outputPath, size);
  console.log(`✓ Thumbnail generated: ${size}x${size}`);
}

async function handleOptimize(args: string[]) {
  const dirPath = args[0] || 'assets';

  console.log(`Optimizing directory: ${dirPath}\n`);

  const result = await optimizeDirectory(dirPath, true);

  console.log('Optimization complete:');
  console.log(`  Files processed: ${result.processed}`);
  console.log(`  Original size: ${formatBytes(result.totalOriginalSize)}`);
  console.log(`  Optimized size: ${formatBytes(result.totalCompressedSize)}`);
  console.log(`  Total savings: ${formatBytes(result.totalSavings)}`);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function showHelp() {
  console.log(`
Asset Optimizer - Compress and optimize assets

USAGE:
  asset-optimizer <command> [options]

COMMANDS:
  compress <input> [output]       Compress PNG file
  resize <input> <output>         Resize image
  thumbnail <input> <output> [size]  Generate thumbnail
  optimize [dir]                  Optimize entire directory

RESIZE OPTIONS:
  --width <px>    Target width
  --height <px>   Target height

EXAMPLES:
  asset-optimizer compress sprite.png
  asset-optimizer resize large.png small.png --width 64
  asset-optimizer thumbnail sprite.png thumb.png 128
  asset-optimizer optimize assets/
`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
