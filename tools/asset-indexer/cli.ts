#!/usr/bin/env node
/**
 * Asset Indexer CLI
 *
 * Purpose: Command-line interface for asset index management
 * Authority: Tier 3 (Optional tooling)
 * Use: Index building and maintenance
 */

import { rebuildIndex, getIndexStats, needsRebuild, loadIndex } from './index-builder';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'build':
    case 'rebuild':
      await handleBuild();
      break;

    case 'stats':
    case 'status':
      await handleStats();
      break;

    case 'check':
      await handleCheck();
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run with --help for usage information');
      process.exit(1);
  }
}

async function handleBuild() {
  console.log('Rebuilding asset index...\n');

  const startTime = Date.now();
  const index = await rebuildIndex();
  const duration = Date.now() - startTime;

  console.log('\n✓ Index rebuilt successfully!');
  console.log(`  Time: ${duration}ms`);
  console.log(`  Total assets: ${index.totalAssets}`);
  console.log(`  Build date: ${index.buildDate}`);
}

async function handleStats() {
  const stats = await getIndexStats();

  if (!stats.exists) {
    console.log('Index Status: NOT BUILT');
    console.log('\nRun "asset-indexer build" to create index');
    return;
  }

  console.log('Index Status: BUILT');
  console.log(`  Build date: ${stats.buildDate}`);
  console.log(`  Total assets: ${stats.totalAssets}`);
  console.log(`  Index size: ${formatFileSize(stats.indexSize!)}`);
  console.log(`  Needs rebuild: ${stats.needsRebuild ? 'YES' : 'NO'}`);

  if (stats.needsRebuild) {
    console.log('\n⚠ Registry has been updated since index was built');
    console.log('  Run "asset-indexer rebuild" to update');
  }

  // Show detailed breakdown
  const index = await loadIndex();
  if (index) {
    console.log('\nIndex Breakdown:');
    console.log(`  Types: ${index.byType.size}`);
    console.log(`  Categories: ${index.byCategory.size}`);
    console.log(`  Tags: ${index.byTag.size}`);
    console.log(`  Projects: ${index.byProject.size}`);
    console.log(`  Dimensions: ${index.byDimension.size}`);
    console.log(`  Text terms: ${index.textIndex.size}`);

    // Show top tags
    console.log('\nMost common tags:');
    const tagCounts = Array.from(index.byTag.entries())
      .map(([tag, ids]) => ({ tag, count: ids.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    for (const { tag, count } of tagCounts) {
      console.log(`  ${tag}: ${count}`);
    }
  }
}

async function handleCheck() {
  const needs = await needsRebuild();

  if (needs) {
    console.log('⚠ Index needs rebuild');
    console.log('Run "asset-indexer rebuild" to update');
    process.exit(1);
  } else {
    console.log('✓ Index is up to date');
    process.exit(0);
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function showHelp() {
  console.log(`
Asset Indexer - Manage asset search index

USAGE:
  asset-indexer <command>

COMMANDS:
  build, rebuild    Build/rebuild the asset index
  stats, status     Show index statistics
  check             Check if index needs rebuild
  help              Show this help message

DESCRIPTION:
  The asset indexer creates an optimized search index for fast
  asset discovery. The index is built from ASSET_REGISTRY.md
  and stored as ASSET_INDEX.json.

  The index enables:
  - Fast searches by type, category, tags, project
  - Full-text search across names and descriptions
  - Dimension-based filtering
  - Autocomplete and suggestions

EXAMPLES:
  # Build index
  asset-indexer build

  # Check index status
  asset-indexer stats

  # Check if rebuild needed
  asset-indexer check
`);
}

// Run CLI
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
