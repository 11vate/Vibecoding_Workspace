/**
 * Test Layered Sprite Generator
 * Quick test to verify 4-layer compositing works
 */

import { LayeredSpriteGenerator } from '../src/infrastructure/sprite/LayeredSpriteGenerator';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ESM dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = join(__dirname, '../test-output/sprites');

async function testLayeredSprite() {
  console.log('🧪 Testing Layered Sprite Generator...\n');

  const generator = new LayeredSpriteGenerator();

  // Test pet sprite generation
  const testSpec = {
    family: 'PYRO_KIN' as const,
    rarity: 3, // SR
    visualTags: ['fire', 'beast', 'aggressive'],
    seed: 12345,
    visualGenome: {
      baseForm: 'biped' as const,
      bodyParts: {
        head: 'horned' as const,
        arms: 'clawed' as const,
        legs: 'digitigrade' as const,
        tail: 'long' as const,
        wings: true,
        armor: false
      },
      textures: [],
      paletteSeed: 0
    }
  };

  try {
    console.log('Generating test sprite with 4-layer compositing...');
    const result = await generator.generateSprite(testSpec);

    // Create output directory
    mkdirSync(OUTPUT_DIR, { recursive: true });

    // Save all animation states
    console.log('\nSaving animation states:');
    writeFileSync(join(OUTPUT_DIR, 'test-idle.png'), result.idle);
    console.log('  ✅ Idle frame saved');

    writeFileSync(join(OUTPUT_DIR, 'test-attack.png'), result.attack);
    console.log('  ✅ Attack frame saved');

    writeFileSync(join(OUTPUT_DIR, 'test-hit.png'), result.hit);
    console.log('  ✅ Hit frame saved');

    writeFileSync(join(OUTPUT_DIR, 'test-ultimate.png'), result.ultimate);
    console.log('  ✅ Ultimate frame saved');

    writeFileSync(join(OUTPUT_DIR, 'test-death.png'), result.death);
    console.log('  ✅ Death frame saved');

    writeFileSync(join(OUTPUT_DIR, 'test-sprite-sheet.png'), result.spriteSheet);
    console.log('  ✅ Sprite sheet saved');

    console.log('\n✅ Test complete!');
    console.log(`📂 Output saved to: ${OUTPUT_DIR}`);

    console.log('\nMetadata:');
    console.log(`  Frame size: ${result.metadata.frameWidth}×${result.metadata.frameHeight}`);
    console.log(`  Animations: ${Object.keys(result.metadata.animations).join(', ')}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('  Error stack:', error.stack);
    }
    process.exit(1);
  }
}

testLayeredSprite();
