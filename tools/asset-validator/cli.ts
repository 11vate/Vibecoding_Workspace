#!/usr/bin/env node
/**
 * Asset Validator CLI
 *
 * Purpose: Command-line interface for asset validation
 * Authority: Tier 3 (Optional tooling)
 * Use: Validate asset files and registry entries
 */

import { validateFile, validateDirectory } from './validate-file';
import { validateRegistryEntry, validateRegistryEntries, findDuplicateIds, findOrphanedEntries } from './validate-registry-entry';
import { searchRegistry } from '../autonomous-assets/auto-registrar';
import * as path from 'path';

const WORKSPACE_ROOT = path.resolve(__dirname, '../..');

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];

  switch (command) {
    case 'file':
      await handleFileValidation(args.slice(1));
      break;

    case 'dir':
    case 'directory':
      await handleDirectoryValidation(args.slice(1));
      break;

    case 'registry':
      await handleRegistryValidation();
      break;

    case 'all':
      await handleFullValidation();
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run with --help for usage information');
      process.exit(1);
  }
}

async function handleFileValidation(args: string[]) {
  if (args.length === 0) {
    console.error('Error: File path required');
    console.error('Usage: asset-validator file <path>');
    process.exit(1);
  }

  const filePath = args[0];
  console.log(`Validating file: ${filePath}\n`);

  const result = await validateFile(filePath);

  console.log(`Format: ${result.info.format}`);
  console.log(`Size: ${formatFileSize(result.info.fileSize)}`);

  if (result.info.dimensions) {
    console.log(`Dimensions: ${result.info.dimensions.width}x${result.info.dimensions.height}`);
  }

  if (result.info.colorType) {
    console.log(`Color Type: ${result.info.colorType}`);
  }

  if (result.info.bitDepth) {
    console.log(`Bit Depth: ${result.info.bitDepth}`);
  }

  console.log('');

  if (result.errors.length > 0) {
    console.log('✗ ERRORS:');
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('⚠ WARNINGS:');
    for (const warning of result.warnings) {
      console.log(`  - ${warning}`);
    }
    console.log('');
  }

  if (result.valid) {
    console.log('✓ File is valid');
    process.exit(0);
  } else {
    console.log('✗ File validation failed');
    process.exit(1);
  }
}

async function handleDirectoryValidation(args: string[]) {
  if (args.length === 0) {
    console.error('Error: Directory path required');
    console.error('Usage: asset-validator dir <path>');
    process.exit(1);
  }

  const dirPath = args[0];
  const recursive = !args.includes('--no-recursive');

  console.log(`Validating directory: ${dirPath}`);
  console.log(`Recursive: ${recursive}\n`);

  const results = await validateDirectory(dirPath, recursive);

  let validCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  for (const result of results) {
    if (result.valid) {
      validCount++;
    } else {
      errorCount++;
    }

    if (result.warnings.length > 0) {
      warningCount++;
    }

    // Show errors
    if (!result.valid || result.warnings.length > 0) {
      console.log(`${result.info.filePath}:`);

      if (result.errors.length > 0) {
        console.log('  ✗ ERRORS:');
        for (const error of result.errors) {
          console.log(`    - ${error}`);
        }
      }

      if (result.warnings.length > 0) {
        console.log('  ⚠ WARNINGS:');
        for (const warning of result.warnings) {
          console.log(`    - ${warning}`);
        }
      }

      console.log('');
    }
  }

  console.log('Summary:');
  console.log(`  Total files: ${results.length}`);
  console.log(`  Valid: ${validCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Warnings: ${warningCount}`);

  if (errorCount === 0) {
    console.log('\n✓ All files valid');
    process.exit(0);
  } else {
    console.log(`\n✗ ${errorCount} file(s) failed validation`);
    process.exit(1);
  }
}

async function handleRegistryValidation() {
  console.log('Validating asset registry...\n');

  // Load all registry entries
  const entries = await searchRegistry({});

  if (entries.length === 0) {
    console.log('Registry is empty (no assets to validate)');
    return;
  }

  console.log(`Found ${entries.length} registry entries\n`);

  // Validate each entry
  const results = validateRegistryEntries(entries, WORKSPACE_ROOT);

  let validCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  for (const result of results) {
    if (result.valid) {
      validCount++;
    } else {
      errorCount++;
    }

    if (result.warnings.length > 0) {
      warningCount++;
    }

    // Show issues
    if (!result.valid || result.warnings.length > 0) {
      console.log(`${result.entry.name} (${result.entry.id}):`);

      if (result.errors.length > 0) {
        console.log('  ✗ ERRORS:');
        for (const error of result.errors) {
          console.log(`    - ${error}`);
        }
      }

      if (result.warnings.length > 0) {
        console.log('  ⚠ WARNINGS:');
        for (const warning of result.warnings) {
          console.log(`    - ${warning}`);
        }
      }

      console.log('');
    }
  }

  // Check for duplicates
  const duplicates = findDuplicateIds(entries);
  if (duplicates.size > 0) {
    console.log('✗ DUPLICATE IDS DETECTED:');
    for (const [id, dupeEntries] of duplicates.entries()) {
      console.log(`  ID: ${id} (${dupeEntries.length} entries)`);
      for (const entry of dupeEntries) {
        console.log(`    - ${entry.name} at ${entry.path}`);
      }
    }
    console.log('');
  }

  // Check for orphaned entries
  const orphaned = findOrphanedEntries(entries, WORKSPACE_ROOT);
  if (orphaned.length > 0) {
    console.log('✗ ORPHANED ENTRIES (file not found):');
    for (const entry of orphaned) {
      console.log(`  - ${entry.name}: ${entry.path}`);
    }
    console.log('');
  }

  console.log('Summary:');
  console.log(`  Total entries: ${entries.length}`);
  console.log(`  Valid: ${validCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Warnings: ${warningCount}`);
  console.log(`  Duplicates: ${duplicates.size}`);
  console.log(`  Orphaned: ${orphaned.length}`);

  const totalIssues = errorCount + duplicates.size + orphaned.length;

  if (totalIssues === 0) {
    console.log('\n✓ Registry is valid');
    process.exit(0);
  } else {
    console.log(`\n✗ ${totalIssues} issue(s) found`);
    process.exit(1);
  }
}

async function handleFullValidation() {
  console.log('Running full asset validation...\n');
  console.log('='.repeat(80));
  console.log('REGISTRY VALIDATION');
  console.log('='.repeat(80));
  await handleRegistryValidation();
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function showHelp() {
  console.log(`
Asset Validator - Validate asset files and registry entries

USAGE:
  asset-validator <command> [options]

COMMANDS:
  file <path>       Validate a single file
  dir <path>        Validate all files in directory
  registry          Validate registry entries
  all               Run all validations

FILE/DIR OPTIONS:
  --no-recursive    Don't scan subdirectories (for dir command)

EXAMPLES:
  # Validate single file
  asset-validator file assets/ui/button/primary-button.png

  # Validate directory
  asset-validator dir assets/sprites

  # Validate registry
  asset-validator registry

  # Full validation
  asset-validator all
`);
}

// Run CLI
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
