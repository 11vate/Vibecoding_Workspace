#!/usr/bin/env node
/**
 * Asset Finder CLI
 *
 * Purpose: Command-line interface for asset search
 * Authority: Tier 3 (Optional tooling)
 * Use: Manual asset discovery
 */

import { searchAssets, findSimilar, SEARCH_PRESETS } from './search';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  // Parse command
  const command = args[0];

  switch (command) {
    case 'search':
      await handleSearch(args.slice(1));
      break;

    case 'similar':
      await handleSimilar(args.slice(1));
      break;

    case 'preset':
      await handlePreset(args.slice(1));
      break;

    case 'list':
      await handleList(args.slice(1));
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run with --help for usage information');
      process.exit(1);
  }
}

async function handleSearch(args: string[]) {
  const query: any = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--type' || arg === '-t') {
      query.type = args[++i];
    } else if (arg === '--category' || arg === '-c') {
      query.category = args[++i];
    } else if (arg === '--tags') {
      query.tags = args[++i].split(',').map(t => t.trim());
    } else if (arg === '--project' || arg === '-p') {
      query.projectContext = args[++i];
    } else if (arg === '--text') {
      query.searchText = args[++i];
    } else if (arg === '--width') {
      if (!query.dimensions) query.dimensions = { width: 0, height: 0 };
      query.dimensions.width = parseInt(args[++i]);
    } else if (arg === '--height') {
      if (!query.dimensions) query.dimensions = { width: 0, height: 0 };
      query.dimensions.height = parseInt(args[++i]);
    } else if (arg === '--limit' || arg === '-l') {
      query.limit = parseInt(args[++i]);
    } else if (arg === '--sort') {
      query.sortBy = args[++i];
    }
  }

  const result = await searchAssets(query);

  console.log(`Found ${result.total} asset(s):\n`);

  for (const asset of result.assets) {
    console.log(`${asset.name}`);
    console.log(`  ID: ${asset.id}`);
    console.log(`  Type: ${asset.type}${asset.category ? ` | Category: ${asset.category}` : ''}`);
    console.log(`  Dimensions: ${asset.dimensions.width}x${asset.dimensions.height}`);
    console.log(`  Tags: ${asset.tags.join(', ')}`);
    console.log(`  Path: ${asset.path}`);
    console.log(`  Size: ${formatFileSize(asset.fileSize)}`);
    console.log(`  Created: ${new Date(asset.createdAt).toLocaleString()}`);
    console.log('');
  }
}

async function handleSimilar(args: string[]) {
  if (args.length === 0) {
    console.error('Error: Asset ID required');
    console.error('Usage: asset-finder similar <asset-id>');
    process.exit(1);
  }

  const assetId = args[0];
  const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 5;

  const similar = await findSimilar(assetId, limit);

  console.log(`Found ${similar.length} similar asset(s) to "${assetId}":\n`);

  for (const asset of similar) {
    console.log(`${asset.name} (${asset.id})`);
    console.log(`  ${asset.dimensions.width}x${asset.dimensions.height} | ${asset.tags.join(', ')}`);
    console.log(`  ${asset.path}`);
    console.log('');
  }
}

async function handlePreset(args: string[]) {
  if (args.length === 0) {
    console.log('Available presets:');
    console.log('  allUI          - All UI components');
    console.log('  allCharacters  - All character sprites');
    console.log('  allItems       - All items');
    console.log('  allTilesets    - All tilesets');
    console.log('  recent         - Recently created assets');
    console.log('  large          - Large assets');
    console.log('');
    console.log('Usage: asset-finder preset <preset-name>');
    return;
  }

  const presetName = args[0];
  let query;

  switch (presetName) {
    case 'allUI':
      query = SEARCH_PRESETS.allUI();
      break;
    case 'allCharacters':
      query = SEARCH_PRESETS.allCharacters();
      break;
    case 'allItems':
      query = SEARCH_PRESETS.allItems();
      break;
    case 'allTilesets':
      query = SEARCH_PRESETS.allTilesets();
      break;
    case 'recent':
      query = SEARCH_PRESETS.recent(7);
      break;
    case 'large':
      query = SEARCH_PRESETS.large(100);
      break;
    default:
      console.error(`Unknown preset: ${presetName}`);
      process.exit(1);
  }

  const result = await searchAssets(query);

  console.log(`Preset: ${presetName}`);
  console.log(`Found ${result.total} asset(s):\n`);

  for (const asset of result.assets) {
    console.log(`${asset.name} (${asset.id})`);
    console.log(`  ${asset.type}${asset.category ? ` / ${asset.category}` : ''} | ${asset.dimensions.width}x${asset.dimensions.height}`);
    console.log('');
  }
}

async function handleList(args: string[]) {
  const result = await searchAssets({ sortBy: 'name' });

  console.log(`Total assets in registry: ${result.total}\n`);

  // Group by type
  const byType: Record<string, number> = {};
  for (const asset of result.assets) {
    byType[asset.type] = (byType[asset.type] || 0) + 1;
  }

  console.log('By type:');
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}: ${count}`);
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function showHelp() {
  console.log(`
Asset Finder - Search for assets in registry

USAGE:
  asset-finder <command> [options]

COMMANDS:
  search      Search for assets with filters
  similar     Find similar assets to a given asset
  preset      Use predefined search presets
  list        List all assets

SEARCH OPTIONS:
  --type, -t <type>        Filter by asset type
  --category, -c <cat>     Filter by category
  --tags <tag1,tag2>       Filter by tags (comma-separated)
  --project, -p <name>     Filter by project context
  --text <query>           Search in name/description
  --width <px>             Filter by exact width
  --height <px>            Filter by exact height
  --limit, -l <n>          Limit results
  --sort <field>           Sort by: name, createdAt, size, relevance

EXAMPLES:
  # Search for buttons
  asset-finder search --type ui --category button

  # Search for 32x32 sprites
  asset-finder search --width 32 --height 32

  # Search for character sprites in "my-rpg" project
  asset-finder search --type sprite --category character --project my-rpg

  # Find similar assets
  asset-finder similar sprite-character-warrior-32x32

  # Use preset
  asset-finder preset allCharacters

  # List all assets
  asset-finder list
`);
}

// Run CLI
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
