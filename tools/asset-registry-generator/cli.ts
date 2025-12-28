#!/usr/bin/env node
/**
 * Asset Registry Generator CLI
 *
 * Purpose: Command-line interface for asset registry generation
 * Authority: Tier 3 (Optional tooling)
 * Use: Bulk registration, registry bootstrapping
 */

import { scanAssets, findUnregistered } from './scan-assets';
import { generateEntries } from './generate-entries';
import { addEntriesToRegistry, previewEntries } from './update-registry';
import * as path from 'path';

const WORKSPACE_ROOT = path.resolve(__dirname, '../..');
const DEFAULT_ASSETS_DIR = path.join(WORKSPACE_ROOT, 'assets');

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];

  switch (command) {
    case 'scan':
      await handleScan(args.slice(1));
      break;

    case 'generate':
      await handleGenerate(args.slice(1));
      break;

    case 'register':
      await handleRegister(args.slice(1));
      break;

    case 'auto':
      await handleAuto(args.slice(1));
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run with --help for usage information');
      process.exit(1);
  }
}

async function handleScan(args: string[]) {
  const dirPath = args[0] || DEFAULT_ASSETS_DIR;
  const recursive = !args.includes('--no-recursive');

  console.log(`Scanning: ${dirPath}`);
  console.log(`Recursive: ${recursive}\n`);

  const result = await scanAssets(dirPath, recursive);

  console.log('Scan Results:');
  console.log(`  Total assets: ${result.total}`);
  console.log(`  Registered: ${result.registered}`);
  console.log(`  Unregistered: ${result.unregistered}`);
  console.log('');

  if (result.unregistered > 0) {
    console.log('Unregistered assets:');

    const unregistered = result.assets.filter(a => !a.isRegistered);

    for (let i = 0; i < Math.min(unregistered.length, 20); i++) {
      const asset = unregistered[i];
      const dims = asset.dimensions ? `${asset.dimensions.width}x${asset.dimensions.height}` : 'unknown';
      console.log(`  ${asset.fileName} (${dims}) - ${asset.filePath}`);
    }

    if (unregistered.length > 20) {
      console.log(`  ... and ${unregistered.length - 20} more`);
    }

    console.log('');
    console.log('Run "asset-registry-generator register" to add these to the registry');
  } else {
    console.log('✓ All assets are registered');
  }
}

async function handleGenerate(args: string[]) {
  const dirPath = args[0] || DEFAULT_ASSETS_DIR;
  const recursive = !args.includes('--no-recursive');

  console.log(`Generating entries for: ${dirPath}\n`);

  // Scan for unregistered assets
  const unregistered = await findUnregistered(dirPath, recursive);

  if (unregistered.length === 0) {
    console.log('No unregistered assets found');
    return;
  }

  console.log(`Found ${unregistered.length} unregistered assets\n`);

  // Generate entries
  const entries = generateEntries(unregistered);

  // Preview entries
  const preview = previewEntries(entries);
  console.log(preview);
}

async function handleRegister(args: string[]) {
  const dirPath = args[0] || DEFAULT_ASSETS_DIR;
  const recursive = !args.includes('--no-recursive');
  const dryRun = args.includes('--dry-run');

  console.log(`Registering assets from: ${dirPath}`);
  console.log(`Dry run: ${dryRun}\n`);

  // Scan for unregistered assets
  const unregistered = await findUnregistered(dirPath, recursive);

  if (unregistered.length === 0) {
    console.log('✓ No unregistered assets found');
    return;
  }

  console.log(`Found ${unregistered.length} unregistered assets\n`);

  // Generate entries
  const entries = generateEntries(unregistered);

  // Preview
  console.log('Entries to be registered:');
  for (let i = 0; i < Math.min(entries.length, 10); i++) {
    const entry = entries[i];
    console.log(`  ${i + 1}. ${entry.name} (${entry.id})`);
  }

  if (entries.length > 10) {
    console.log(`  ... and ${entries.length - 10} more`);
  }

  console.log('');

  if (dryRun) {
    console.log('Dry run - no changes made');
    console.log('Run without --dry-run to register these assets');
    return;
  }

  // Confirm
  if (!args.includes('--yes') && !args.includes('-y')) {
    console.log('This will add entries to ASSET_REGISTRY.md');
    console.log('Run with --yes to skip this confirmation');
    console.log('');
    console.error('Add --yes flag to proceed');
    process.exit(1);
  }

  // Register
  console.log('Adding entries to registry...\n');

  const result = await addEntriesToRegistry(entries);

  console.log('Results:');
  console.log(`  Added: ${result.added}`);
  console.log(`  Skipped: ${result.skipped}`);
  console.log(`  Errors: ${result.errors.length}`);
  console.log('');

  if (result.errors.length > 0) {
    console.log('Errors:');
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
    console.log('');
  }

  if (result.added > 0) {
    console.log(`✓ Successfully registered ${result.added} assets`);
  }
}

async function handleAuto(args: string[]) {
  const dirPath = args[0] || DEFAULT_ASSETS_DIR;

  console.log('Auto-registering assets...\n');

  // Add --yes flag for automatic confirmation
  await handleRegister([dirPath, '--yes']);
}

function showHelp() {
  console.log(`
Asset Registry Generator - Scan and register assets automatically

USAGE:
  asset-registry-generator <command> [options]

COMMANDS:
  scan [dir]           Scan directory and show unregistered assets
  generate [dir]       Generate registry entries (preview only)
  register [dir]       Register unregistered assets
  auto [dir]           Auto-register without confirmation

OPTIONS:
  --no-recursive       Don't scan subdirectories
  --dry-run            Preview changes without modifying registry
  --yes, -y            Skip confirmation prompts

DESCRIPTION:
  This tool scans directories for asset files (PNG, JPG, SVG) and
  automatically generates registry entries for unregistered assets.

  It infers metadata from file paths and names:
  - Type from directory structure
  - Category from path components
  - Tags from file names and paths
  - Project context from directory hierarchy

EXAMPLES:
  # Scan assets directory
  asset-registry-generator scan assets/

  # Preview generated entries
  asset-registry-generator generate assets/

  # Register assets (with confirmation)
  asset-registry-generator register assets/ --yes

  # Auto-register without confirmation
  asset-registry-generator auto assets/

  # Dry run (no changes)
  asset-registry-generator register assets/ --dry-run
`);
}

// Run CLI
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
