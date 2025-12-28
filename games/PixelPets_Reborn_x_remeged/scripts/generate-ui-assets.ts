/**
 * Generate UI Assets for Pixel Pets
 *
 * Generates all UI components procedurally using workspace generators:
 * - Buttons (all actions, all states)
 * - Progress bars (HP, energy, XP)
 * - Panels (modals, cards, containers)
 * - Icons (using SVG generator)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Workspace root is 3 levels up from scripts/
const WORKSPACE_ROOT = resolve(__dirname, '../../../');

// Helper to convert Windows paths to file:// URLs for ESM imports
function toFileURL(path: string): string {
  return pathToFileURL(path).href;
}

// Dynamic imports for workspace tools (convert to file:// URLs for Windows compatibility)
const { generateButtonSet } = await import(toFileURL(join(WORKSPACE_ROOT, 'tools/asset-generators/ui-generator/button-generator.ts')));
const { generateProgressBar } = await import(toFileURL(join(WORKSPACE_ROOT, 'tools/asset-generators/ui-generator/progress-bar-generator.ts')));
const { generatePanel } = await import(toFileURL(join(WORKSPACE_ROOT, 'tools/asset-generators/ui-generator/panel-generator.ts')));

const OUTPUT_DIR = join(__dirname, '../src/assets/ui');

// Button configurations for all primary actions
const BUTTON_CONFIGS = [
  // Primary action buttons
  { name: 'fuse', color: '#FF6B35', text: 'Fuse', style: 'glossy' as const },
  { name: 'battle', color: '#4A90E2', text: 'Battle', style: 'glossy' as const },
  { name: 'summon', color: '#9B59B6', text: 'Summon', style: 'glossy' as const },
  { name: 'pvp', color: '#E74C3C', text: 'PvP', style: 'glossy' as const },
  { name: 'collection', color: '#16A085', text: 'Collection', style: 'glossy' as const },
  { name: 'dungeon', color: '#8E44AD', text: 'Dungeon', style: 'glossy' as const },
  { name: 'shop', color: '#F39C12', text: 'Shop', style: 'glossy' as const },
  { name: 'black-market', color: '#2C3E50', text: 'Black Market', style: 'glass' as const },

  // Secondary action buttons
  { name: 'confirm', color: '#27AE60', text: 'Confirm', style: 'gradient' as const },
  { name: 'cancel', color: '#95A5A6', text: 'Cancel', style: 'flat' as const },
  { name: 'back', color: '#7F8C8D', text: 'Back', style: 'outline' as const },
  { name: 'next', color: '#3498DB', text: 'Next', style: 'gradient' as const },

  // Utility buttons
  { name: 'info', color: '#3498DB', text: 'Info', style: 'flat' as const },
  { name: 'settings', color: '#95A5A6', text: 'Settings', style: 'flat' as const },
  { name: 'close', color: '#E74C3C', text: '×', style: 'flat' as const },
];

// Progress bar configurations
const PROGRESS_BAR_CONFIGS = [
  // HP bars (health)
  { name: 'hp-full', fillColor: '#27AE60', percentage: 100, style: 'gradient' as const },
  { name: 'hp-high', fillColor: '#27AE60', percentage: 75, style: 'gradient' as const },
  { name: 'hp-medium', fillColor: '#F39C12', percentage: 50, style: 'gradient' as const },
  { name: 'hp-low', fillColor: '#E74C3C', percentage: 25, style: 'gradient' as const },
  { name: 'hp-critical', fillColor: '#C0392B', percentage: 10, style: 'gradient' as const },

  // Energy/Mana bars
  { name: 'energy-full', fillColor: '#3498DB', percentage: 100, style: 'gradient' as const },
  { name: 'energy-half', fillColor: '#3498DB', percentage: 50, style: 'gradient' as const },

  // XP/Progress bars
  { name: 'xp-bar', fillColor: '#9B59B6', percentage: 65, style: 'gradient' as const },
  { name: 'loading-bar', fillColor: '#16A085', percentage: 40, style: 'standard' as const },
];

// Panel configurations
const PANEL_CONFIGS = [
  // Modal backgrounds
  { name: 'modal-small', width: 300, height: 200, style: 'glass' as const },
  { name: 'modal-medium', width: 400, height: 300, style: 'glass' as const },
  { name: 'modal-large', width: 600, height: 500, style: 'glass' as const },

  // Card containers
  { name: 'pet-card', width: 200, height: 280, style: 'bordered' as const },
  { name: 'stone-card', width: 150, height: 180, style: 'bordered' as const },
  { name: 'ability-card', width: 160, height: 120, style: 'flat' as const },

  // Info panels
  { name: 'stats-panel', width: 250, height: 200, style: 'bordered' as const },
  { name: 'lineage-node', width: 180, height: 100, style: 'glass' as const },
];

/**
 * Generate all UI buttons
 */
async function generateButtons(): Promise<void> {
  console.log('🔘 Generating buttons...');

  const buttonDir = join(OUTPUT_DIR, 'buttons');
  mkdirSync(buttonDir, { recursive: true });

  let generatedCount = 0;

  for (const config of BUTTON_CONFIGS) {
    console.log(`  Generating ${config.name} button...`);

    // Generate all states (normal, hover, pressed, disabled)
    const buttonSet = await generateButtonSet({
      width: 120,
      height: 40,
      color: config.color,
      text: config.text,
      style: config.style,
      fontSize: 14,
      borderRadius: 8
    });

    // Save each state
    for (const [state, result] of Object.entries(buttonSet)) {
      const filename = `${config.name}-${state}.png`;
      const filepath = join(buttonDir, filename);
      writeFileSync(filepath, result.buffer);
      generatedCount++;
    }
  }

  console.log(`  ✅ Generated ${generatedCount} button images (${BUTTON_CONFIGS.length} buttons × 4 states)`);
}

/**
 * Generate all progress bars
 */
async function generateProgressBars(): Promise<void> {
  console.log('📊 Generating progress bars...');

  const barDir = join(OUTPUT_DIR, 'progress-bars');
  mkdirSync(barDir, { recursive: true });

  for (const config of PROGRESS_BAR_CONFIGS) {
    console.log(`  Generating ${config.name}...`);

    const result = await generateProgressBar({
      width: 200,
      height: 20,
      progress: config.percentage / 100, // Convert percentage to 0-1 range
      fillColor: config.fillColor,
      backgroundColor: '#2C3E50',
      borderColor: '#34495E',
      style: config.style,
      borderRadius: 4
    });

    const filename = `${config.name}.png`;
    const filepath = join(barDir, filename);
    writeFileSync(filepath, result.image);
  }

  console.log(`  ✅ Generated ${PROGRESS_BAR_CONFIGS.length} progress bar images`);
}

/**
 * Generate all panels
 */
async function generatePanels(): Promise<void> {
  console.log('🖼️  Generating panels...');

  const panelDir = join(OUTPUT_DIR, 'panels');
  mkdirSync(panelDir, { recursive: true });

  for (const config of PANEL_CONFIGS) {
    console.log(`  Generating ${config.name}...`);

    const result = await generatePanel({
      width: config.width,
      height: config.height,
      style: config.style,
      backgroundColor: '#1A1A1A',
      borderColor: '#34495E',
      borderRadius: 12
    });

    const filename = `${config.name}.png`;
    const filepath = join(panelDir, filename);
    writeFileSync(filepath, result.image);
  }

  console.log(`  ✅ Generated ${PANEL_CONFIGS.length} panel images`);
}

/**
 * Generate asset manifest
 */
function generateManifest(): void {
  console.log('📋 Generating asset manifest...');

  const manifest = {
    buttons: BUTTON_CONFIGS.map(c => ({
      id: c.name,
      states: ['normal', 'hover', 'pressed', 'disabled'],
      color: c.color,
      style: c.style
    })),
    progressBars: PROGRESS_BAR_CONFIGS.map(c => ({
      id: c.name,
      fillColor: c.fillColor,
      style: c.style
    })),
    panels: PANEL_CONFIGS.map(c => ({
      id: c.name,
      width: c.width,
      height: c.height,
      style: c.style
    })),
    generated: new Date().toISOString(),
    version: '1.0.0'
  };

  const manifestPath = join(OUTPUT_DIR, 'ui-manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`  ✅ Generated manifest at ${manifestPath}`);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('🎨 Pixel Pets UI Asset Generation');
  console.log('=====================================\n');

  try {
    // Create output directory
    mkdirSync(OUTPUT_DIR, { recursive: true });

    // Generate all asset types
    await generateButtons();
    await generateProgressBars();
    await generatePanels();

    // Generate manifest
    generateManifest();

    console.log('\n🎉 UI asset generation complete!');
    console.log(`📂 Assets saved to: ${OUTPUT_DIR}`);
    console.log(`\nSummary:`);
    console.log(`  - ${BUTTON_CONFIGS.length * 4} button images`);
    console.log(`  - ${PROGRESS_BAR_CONFIGS.length} progress bar images`);
    console.log(`  - ${PANEL_CONFIGS.length} panel images`);
    console.log(`  - Total: ${(BUTTON_CONFIGS.length * 4) + PROGRESS_BAR_CONFIGS.length + PANEL_CONFIGS.length} assets`);

  } catch (error) {
    console.error('❌ Error generating UI assets:', error);
    process.exit(1);
  }
}

// Run main function
main();

export { main as generateUIAssets };
