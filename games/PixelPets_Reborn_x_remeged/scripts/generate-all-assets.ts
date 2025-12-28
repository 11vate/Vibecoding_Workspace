/**
 * Batch Asset Generation Script
 * Generates all game assets using workspace procedural generation tools
 */

import { resolve, join } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { pathToFileURL } from 'url';

// Get workspace root (5 levels up from scripts/)
const WORKSPACE_ROOT = resolve(__dirname, '../../../../../');
const GAME_ROOT = resolve(__dirname, '../');
const ASSETS_ROOT = join(GAME_ROOT, 'src/assets');

// Ensure directories exist
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Helper to convert Windows paths to file:// URLs for ESM imports
function toFileURL(path: string): string {
  return pathToFileURL(path).href;
}

/**
 * Generate all UI assets
 */
async function generateUIAssets() {
  console.log('\n📦 Generating UI Assets...');

  // Import workspace tools dynamically
  const { generateButtonSet } = await import(
    toFileURL(join(WORKSPACE_ROOT, 'tools/asset-generators/ui-generator/button-generator.ts'))
  );
  const { generateProgressBar } = await import(
    toFileURL(join(WORKSPACE_ROOT, 'tools/asset-generators/ui-generator/progress-bar-generator.ts'))
  );
  const { generatePanel } = await import(
    toFileURL(join(WORKSPACE_ROOT, 'tools/asset-generators/ui-generator/panel-generator.ts'))
  );

  const uiDir = join(ASSETS_ROOT, 'ui');
  ensureDir(uiDir);

  // Button configurations
  const buttons = [
    { name: 'primary-fuse', color: '#FF6B35', text: 'Fuse', style: 'glossy' as const },
    { name: 'primary-battle', color: '#4A90E2', text: 'Battle', style: 'glossy' as const },
    { name: 'primary-summon', color: '#9B59B6', text: 'Summon', style: 'glossy' as const },
    { name: 'primary-pvp', color: '#E74C3C', text: 'PvP', style: 'glossy' as const },
    { name: 'primary-collection', color: '#27AE60', text: 'Collection', style: 'glossy' as const },
    { name: 'primary-dungeon', color: '#F39C12', text: 'Dungeon', style: 'glossy' as const },
    { name: 'primary-shop', color: '#16A085', text: 'Shop', style: 'glossy' as const },
    { name: 'primary-blackmarket', color: '#8E44AD', text: 'Black Market', style: 'glossy' as const },
    { name: 'secondary-confirm', color: '#27AE60', text: 'Confirm', style: 'gradient' as const },
    { name: 'secondary-cancel', color: '#E74C3C', text: 'Cancel', style: 'gradient' as const },
    { name: 'secondary-back', color: '#7F8C8D', text: 'Back', style: 'outline' as const },
    { name: 'secondary-next', color: '#3498DB', text: 'Next', style: 'outline' as const },
    { name: 'utility-info', color: '#3498DB', text: 'Info', style: 'flat' as const },
    { name: 'utility-settings', color: '#95A5A6', text: 'Settings', style: 'flat' as const },
    { name: 'utility-close', color: '#E74C3C', text: '×', style: 'glass' as const }
  ];

  const buttonDir = join(uiDir, 'buttons');
  ensureDir(buttonDir);

  let buttonCount = 0;
  for (const config of buttons) {
    const buttonSet = await generateButtonSet({
      width: 120,
      height: 40,
      color: config.color,
      text: config.text,
      style: config.style,
      fontSize: 14,
      borderRadius: 8
    });

    for (const [state, result] of Object.entries(buttonSet)) {
      const filename = `${config.name}-${state}.png`;
      writeFileSync(join(buttonDir, filename), result.buffer);
      buttonCount++;
    }
  }

  console.log(`  ✓ Generated ${buttonCount} buttons`);

  // Progress bars
  const progressBars = [
    { name: 'hp-full', fillColor: '#27AE60', percentage: 100 },
    { name: 'hp-high', fillColor: '#27AE60', percentage: 75 },
    { name: 'hp-medium', fillColor: '#F39C12', percentage: 50 },
    { name: 'hp-low', fillColor: '#E67E22', percentage: 25 },
    { name: 'hp-critical', fillColor: '#E74C3C', percentage: 10 },
    { name: 'energy', fillColor: '#3498DB', percentage: 100 },
    { name: 'xp', fillColor: '#9B59B6', percentage: 60 },
    { name: 'loading-gradient', fillColor: '#00BFFF', percentage: 100, style: 'gradient' as const },
    { name: 'loading-standard', fillColor: '#4A90E2', percentage: 100, style: 'standard' as const }
  ];

  const progressDir = join(uiDir, 'progress-bars');
  ensureDir(progressDir);

  let progressCount = 0;
  for (const bar of progressBars) {
    const result = await generateProgressBar({
      width: 200,
      height: 20,
      fillColor: bar.fillColor,
      backgroundColor: '#333333',
      borderRadius: 10,
      percentage: bar.percentage,
      style: bar.style || 'standard'
    });

    const filename = `${bar.name}.png`;
    writeFileSync(join(progressDir, filename), result.image);
    progressCount++;
  }

  console.log(`  ✓ Generated ${progressCount} progress bars`);

  // Panels
  const panels = [
    { name: 'modal-small', width: 300, height: 200, style: 'glass' as const },
    { name: 'modal-medium', width: 500, height: 400, style: 'glass' as const },
    { name: 'modal-large', width: 700, height: 600, style: 'glass' as const },
    { name: 'card-pet', width: 150, height: 200, style: 'bordered' as const },
    { name: 'card-stone', width: 120, height: 150, style: 'bordered' as const },
    { name: 'card-ability', width: 180, height: 120, style: 'bordered' as const },
    { name: 'info-small', width: 200, height: 100, style: 'flat' as const },
    { name: 'info-large', width: 400, height: 200, style: 'flat' as const }
  ];

  const panelDir = join(uiDir, 'panels');
  ensureDir(panelDir);

  let panelCount = 0;
  for (const panel of panels) {
    const result = await generatePanel({
      width: panel.width,
      height: panel.height,
      style: panel.style,
      borderRadius: 12,
      backgroundColor: '#1A1A1A',
      borderColor: '#444444',
      borderWidth: 2
    });

    const filename = `${panel.name}.png`;
    writeFileSync(join(panelDir, filename), result.image);
    panelCount++;
  }

  console.log(`  ✓ Generated ${panelCount} panels`);

  return { buttons: buttonCount, progressBars: progressCount, panels: panelCount };
}

/**
 * Generate background assets
 */
async function generateBackgrounds() {
  console.log('\n🌄 Generating Backgrounds...');

  // Import workspace tools
  const { generateNoiseTexture } = await import(
    toFileURL(join(WORKSPACE_ROOT, 'tools/procedural-generation/texture-engine/perlin-noise.ts'))
  );

  const backgroundDir = join(ASSETS_ROOT, 'backgrounds');
  ensureDir(backgroundDir);

  // Battle arenas
  const arenas = [
    {
      name: 'pyro-arena',
      width: 1280,
      height: 720,
      colorMap: (v: number) => {
        if (v < 0.2) return '#C21807';
        if (v < 0.4) return '#EE4B2B';
        if (v < 0.6) return '#FF6B35';
        if (v < 0.8) return '#FFA500';
        return '#FFD700';
      },
      scale: 0.05,
      octaves: 6
    },
    {
      name: 'aqua-arena',
      width: 1280,
      height: 720,
      colorMap: (v: number) => {
        if (v < 0.3) return '#003366';
        if (v < 0.5) return '#0066CC';
        if (v < 0.7) return '#0099FF';
        return '#00BFFF';
      },
      scale: 0.04,
      octaves: 5
    },
    {
      name: 'terra-arena',
      width: 1280,
      height: 720,
      colorMap: (v: number) => {
        if (v < 0.3) return '#654321';
        if (v < 0.6) return '#8B4513';
        return '#A0522D';
      },
      scale: 0.03,
      octaves: 4
    },
    {
      name: 'volt-arena',
      width: 1280,
      height: 720,
      colorMap: (v: number) => {
        if (v < 0.3) return '#B8860B';
        if (v < 0.6) return '#FFD700';
        return '#FFFF00';
      },
      scale: 0.06,
      octaves: 5
    },
    {
      name: 'shadow-arena',
      width: 1280,
      height: 720,
      colorMap: (v: number) => {
        if (v < 0.4) return '#000000';
        if (v < 0.7) return '#1A1A1A';
        return '#333333';
      },
      scale: 0.02,
      octaves: 3
    },
    {
      name: 'lumina-arena',
      width: 1280,
      height: 720,
      colorMap: (v: number) => {
        if (v < 0.3) return '#E6E6FA';
        if (v < 0.6) return '#F0F8FF';
        return '#FFFFFF';
      },
      scale: 0.05,
      octaves: 4
    }
  ];

  let arenaCount = 0;
  for (const arena of arenas) {
    const seed = arena.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const buffer = generateNoiseTexture({
      width: arena.width,
      height: arena.height,
      scale: arena.scale,
      octaves: arena.octaves,
      persistence: 0.5,
      seed,
      colorMap: arena.colorMap
    });

    writeFileSync(join(backgroundDir, `${arena.name}.png`), buffer);
    arenaCount++;
  }

  console.log(`  ✓ Generated ${arenaCount} battle arenas`);

  // UI backgrounds
  const uiBackgrounds = [
    {
      name: 'main-menu',
      width: 1920,
      height: 1080,
      colorMap: (v: number) => {
        if (v < 0.5) return '#4A148C';
        return '#7B1FA2';
      },
      scale: 0.01,
      octaves: 3
    },
    {
      name: 'collection-view',
      width: 1920,
      height: 1080,
      colorMap: (v: number) => {
        if (v < 0.5) return '#1A1A2E';
        return '#16213E';
      },
      scale: 0.02,
      octaves: 2
    },
    {
      name: 'fusion-lab',
      width: 1920,
      height: 1080,
      colorMap: (v: number) => {
        if (v < 0.3) return '#0A0A1E';
        if (v < 0.6) return '#16213E';
        return '#1F4068';
      },
      scale: 0.03,
      octaves: 4
    },
    {
      name: 'black-market',
      width: 1920,
      height: 1080,
      colorMap: (v: number) => {
        if (v < 0.4) return '#0D0D0D';
        if (v < 0.7) return '#1A1A1A';
        return '#2A0A2E';
      },
      scale: 0.015,
      octaves: 5
    }
  ];

  let uiBgCount = 0;
  for (const bg of uiBackgrounds) {
    const seed = bg.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const buffer = generateNoiseTexture({
      width: bg.width,
      height: bg.height,
      scale: bg.scale,
      octaves: bg.octaves,
      persistence: 0.5,
      seed,
      colorMap: bg.colorMap
    });

    writeFileSync(join(backgroundDir, `${bg.name}.png`), buffer);
    uiBgCount++;
  }

  console.log(`  ✓ Generated ${uiBgCount} UI backgrounds`);

  return { arenas: arenaCount, uiBackgrounds: uiBgCount };
}

/**
 * Generate asset manifest
 */
function generateAssetManifest(stats: any) {
  console.log('\n📋 Generating Asset Manifest...');

  const manifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalAssets: Object.values(stats).reduce((sum: number, val: any) => {
      if (typeof val === 'number') return sum + val;
      if (typeof val === 'object') return sum + Object.values(val).reduce((s: number, v) => s + (typeof v === 'number' ? v : 0), 0);
      return sum;
    }, 0),
    categories: stats
  };

  const manifestPath = join(ASSETS_ROOT, 'asset-manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`  ✓ Manifest saved to ${manifestPath}`);
  console.log(`  ✓ Total assets: ${manifest.totalAssets}`);

  return manifest;
}

/**
 * Main execution
 */
async function main() {
  console.log('═'.repeat(60));
  console.log('   PIXEL PETS REBORN - BATCH ASSET GENERATION');
  console.log('   100% Free Workspace Tools - Zero External APIs');
  console.log('═'.repeat(60));

  const startTime = Date.now();

  // Ensure root directories
  ensureDir(ASSETS_ROOT);

  // Generate all asset categories
  const uiStats = await generateUIAssets();
  const backgroundStats = await generateBackgrounds();

  // Create manifest
  const manifest = generateAssetManifest({
    ui: uiStats,
    backgrounds: backgroundStats
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Asset generation complete in ${duration}s`);
  console.log(`📦 Total assets generated: ${manifest.totalAssets}`);
  console.log('═'.repeat(60));
}

main().catch(console.error);
