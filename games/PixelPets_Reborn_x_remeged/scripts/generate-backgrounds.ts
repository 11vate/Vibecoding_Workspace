/**
 * Generate Background & Environment Assets for Pixel Pets
 *
 * Generates:
 * - Battle arenas (6 family-themed environments)
 * - UI backgrounds (main menu, collection, fusion lab, black market)
 *
 * Uses workspace procedural generation (Perlin noise, color gradients)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const WORKSPACE_ROOT = resolve(__dirname, '../../../');

// Helper to convert Windows paths to file:// URLs
function toFileURL(path: string): string {
  return pathToFileURL(path).href;
}

// Dynamic imports
const noiseTexturePath = join(WORKSPACE_ROOT, 'tools/procedural-generation/texture-engine/perlin-noise.ts');

const OUTPUT_DIR = join(__dirname, '../src/assets/backgrounds');

// Battle arena configurations (family-themed)
const BATTLE_ARENAS = [
  {
    name: 'pyro-arena',
    family: 'PYRO_KIN',
    colorMap: (v: number): string => {
      if (v < 0.2) return '#C21807'; // Deep red
      if (v < 0.4) return '#EE4B2B'; // Bright red
      if (v < 0.6) return '#FF6B35'; // Orange-red
      if (v < 0.8) return '#F7931E'; // Orange
      return '#FFD23F'; // Yellow-orange
    },
    scale: 0.05,
    octaves: 6
  },
  {
    name: 'aqua-arena',
    family: 'AQUA_BORN',
    colorMap: (v: number): string => {
      if (v < 0.3) return '#003459'; // Deep blue
      if (v < 0.5) return '#007EA7'; // Ocean blue
      if (v < 0.7) return '#00A8E8'; // Bright blue
      if (v < 0.85) return '#4A90E2'; // Sky blue
      return '#80D4FF'; // Light blue
    },
    scale: 0.08,
    octaves: 5
  },
  {
    name: 'terra-arena',
    family: 'TERRA_FORGED',
    colorMap: (v: number): string => {
      if (v < 0.25) return '#6B5840'; // Dark brown
      if (v < 0.5) return '#8B7355'; // Brown
      if (v < 0.75) return '#A0826D'; // Light brown
      return '#C4A676'; // Tan
    },
    scale: 0.06,
    octaves: 7
  },
  {
    name: 'volt-arena',
    family: 'VOLT_STREAM',
    colorMap: (v: number): string => {
      if (v < 0.2) return '#FF6B00'; // Dark orange
      if (v < 0.4) return '#FFA500'; // Orange
      if (v < 0.6) return '#FFD700'; // Gold
      if (v < 0.8) return '#FFC107'; // Amber
      return '#FFEB3B'; // Yellow
    },
    scale: 0.04,
    octaves: 4
  },
  {
    name: 'shadow-arena',
    family: 'SHADOW_VEIL',
    colorMap: (v: number): string => {
      if (v < 0.3) return '#1A1A1A'; // Black
      if (v < 0.5) return '#2C1810'; // Dark brown-black
      if (v < 0.7) return '#4A4A4A'; // Dark gray
      if (v < 0.85) return '#6B6B6B'; // Gray
      return '#8B8B8B'; // Light gray
    },
    scale: 0.03,
    octaves: 8
  },
  {
    name: 'lumina-arena',
    family: 'LUMINA',
    colorMap: (v: number): string => {
      if (v < 0.2) return '#E6E6FA'; // Lavender
      if (v < 0.4) return '#F0F8FF'; // Alice blue
      if (v < 0.6) return '#FFE4B5'; // Moccasin
      if (v < 0.8) return '#FFFACD'; // Lemon chiffon
      return '#FFFFFF'; // White
    },
    scale: 0.07,
    octaves: 3
  }
];

// UI background configurations
const UI_BACKGROUNDS = [
  {
    name: 'main-menu',
    width: 1920,
    height: 1080,
    colorMap: (v: number): string => {
      if (v < 0.3) return '#1A1A2E'; // Dark purple-blue
      if (v < 0.5) return '#16213E'; // Navy
      if (v < 0.7) return '#0F3460'; // Dark blue
      return '#533483'; // Purple
    },
    scale: 0.002,
    octaves: 4,
    description: 'Main menu gradient background'
  },
  {
    name: 'collection-view',
    width: 1920,
    height: 1080,
    colorMap: (v: number): string => {
      if (v < 0.4) return '#2C3E50'; // Dark gray-blue
      if (v < 0.6) return '#34495E'; // Gray-blue
      if (v < 0.8) return '#415A77'; // Blue-gray
      return '#526D82'; // Light blue-gray
    },
    scale: 0.015,
    octaves: 5,
    description: 'Collection grid texture'
  },
  {
    name: 'fusion-lab',
    width: 1920,
    height: 1080,
    colorMap: (v: number): string => {
      // Glowing circuit aesthetic
      if (v < 0.2) return '#0A0E27'; // Very dark blue
      if (v < 0.4) return '#1B1464'; // Dark purple
      if (v < 0.6) return '#2E1A47'; // Purple
      if (v < 0.8) return '#402060'; // Light purple
      return '#5B2C6F'; // Pink-purple
    },
    scale: 0.01,
    octaves: 6,
    description: 'Fusion lab glowing background'
  },
  {
    name: 'black-market',
    width: 1920,
    height: 1080,
    colorMap: (v: number): string => {
      // Dark, glitchy aesthetic
      if (v < 0.3) return '#0D0D0D'; // Almost black
      if (v < 0.5) return '#1A1A1A'; // Black
      if (v < 0.7) return '#2C1810'; // Dark brown-black
      if (v < 0.85) return '#1C3738'; // Dark teal
      return '#264653'; // Teal-gray
    },
    scale: 0.005,
    octaves: 8,
    description: 'Black market dark glitch background'
  }
];

/**
 * Generate battle arenas
 */
async function generateBattleArenas(): Promise<void> {
  console.log('🏟️  Generating battle arenas...\n');

  const { generateNoiseTexture } = await import(toFileURL(noiseTexturePath)) as any;

  const arenaDir = join(OUTPUT_DIR, 'arenas');
  mkdirSync(arenaDir, { recursive: true });

  for (const arena of BATTLE_ARENAS) {
    console.log(`  Generating ${arena.name} (${arena.family})...`);

    const buffer = generateNoiseTexture({
      width: 1280,
      height: 720,
      scale: arena.scale,
      octaves: arena.octaves,
      persistence: 0.5,
      seed: arena.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0),
      colorMap: arena.colorMap
    });

    const filename = `${arena.name}.png`;
    const filepath = join(arenaDir, filename);
    writeFileSync(filepath, buffer);
  }

  console.log(`  ✅ Generated ${BATTLE_ARENAS.length} battle arena backgrounds\n`);
}

/**
 * Generate UI backgrounds
 */
async function generateUIBackgrounds(): Promise<void> {
  console.log('🎨 Generating UI backgrounds...\n');

  const { generateNoiseTexture } = await import(toFileURL(noiseTexturePath)) as any;

  const uiDir = join(OUTPUT_DIR, 'ui');
  mkdirSync(uiDir, { recursive: true });

  for (const bg of UI_BACKGROUNDS) {
    console.log(`  Generating ${bg.name} - ${bg.description}...`);

    const buffer = generateNoiseTexture({
      width: bg.width,
      height: bg.height,
      scale: bg.scale,
      octaves: bg.octaves,
      persistence: 0.5,
      seed: bg.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0),
      colorMap: bg.colorMap
    });

    const filename = `${bg.name}.png`;
    const filepath = join(uiDir, filename);
    writeFileSync(filepath, buffer);
  }

  console.log(`  ✅ Generated ${UI_BACKGROUNDS.length} UI backgrounds\n`);
}

/**
 * Generate manifest
 */
function generateManifest(): void {
  console.log('📋 Generating background manifest...\n');

  const manifest = {
    arenas: BATTLE_ARENAS.map(a => ({
      id: a.name,
      family: a.family,
      resolution: '1280x720'
    })),
    uiBackgrounds: UI_BACKGROUNDS.map(b => ({
      id: b.name,
      description: b.description,
      resolution: `${b.width}x${b.height}`
    })),
    generated: new Date().toISOString(),
    version: '1.0.0'
  };

  const manifestPath = join(OUTPUT_DIR, 'background-manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`  ✅ Generated manifest at ${manifestPath}\n`);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('🌄 Pixel Pets Background & Environment Generation');
  console.log('====================================================\n');

  try {
    // Create output directory
    mkdirSync(OUTPUT_DIR, { recursive: true });

    // Generate all backgrounds
    await generateBattleArenas();
    await generateUIBackgrounds();

    // Generate manifest
    generateManifest();

    console.log('🎉 Background generation complete!');
    console.log(`📂 Assets saved to: ${OUTPUT_DIR}`);
    console.log(`\nSummary:`);
    console.log(`  - ${BATTLE_ARENAS.length} battle arena backgrounds`);
    console.log(`  - ${UI_BACKGROUNDS.length} UI backgrounds`);
    console.log(`  - Total: ${BATTLE_ARENAS.length + UI_BACKGROUNDS.length} backgrounds`);

  } catch (error) {
    console.error('❌ Error generating backgrounds:', error);
    if (error instanceof Error) {
      console.error('  Stack:', error.stack);
    }
    process.exit(1);
  }
}

main();
