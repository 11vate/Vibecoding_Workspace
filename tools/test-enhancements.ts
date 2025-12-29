
import { NoiseLibrary } from './procedural-generation/noise';
import { AudioEngine } from './procedural-generation/audio-engine';
import { aiService } from './ai-service/local-ai';
import { TerrainGenerator } from './procedural-generation/geometric-engine/terrain-generator';
import { HeadlessComponentGenerator } from './asset-generators/ui-generator/headless-component-generator';

async function testEnhancements() {
  console.log('--- Testing Enhancements (Phase 2 & 3) ---');

  // 1. Test Noise Library
  console.log('\n1. Testing Noise Library...');
  try {
    NoiseLibrary.seed(12345);
    const val = NoiseLibrary.perlin2D(0.5, 0.5);
    console.log(`   Noise value at (0.5, 0.5): ${val}`);
    console.log('   ✅ Noise Library functional');
  } catch (error) {
    console.error('   ❌ Noise Library failed:', error);
  }

  // 2. Test Audio Engine (Mock check)
  console.log('\n2. Testing Audio Engine...');
  try {
    if (AudioEngine && typeof AudioEngine.generateSoundEffect === 'function') {
      console.log('   ✅ Audio Engine structure valid');
    } else {
      throw new Error('AudioEngine export invalid');
    }
  } catch (error) {
    console.error('   ❌ Audio Engine failed:', error);
  }

  // 3. Test Local AI Service
  console.log('\n3. Testing Local AI Service...');
  try {
    if (aiService) {
      console.log('   ✅ Local AI Service structure valid');
    } else {
      throw new Error('aiService export invalid');
    }
  } catch (error) {
    console.error('   ❌ Local AI Service failed:', error);
  }

  // 4. Test 3D Terrain Generator
  console.log('\n4. Testing 3D Terrain Generator...');
  try {
    const terrain = TerrainGenerator.generateHeightMap({
      width: 100,
      depth: 100,
      segmentsW: 10,
      segmentsD: 10,
      maxHeight: 10,
      scale: 1,
      seed: 123
    });
    if (terrain && terrain.length > 0) {
      console.log(`   Generated heightmap with ${terrain.length} vertices`);
      console.log('   ✅ Terrain Generator functional');
    } else {
      throw new Error('Terrain heightmap empty');
    }
  } catch (error) {
    console.error('   ❌ Terrain Generator failed:', error);
  }

  // 5. Test Headless Component Generator
  console.log('\n5. Testing Headless Component Generator...');
  try {
    const code = HeadlessComponentGenerator.generateComponent({
      name: 'CyberButton',
      type: 'button',
      styling: 'tailwind',
      vibe: 'cyberpunk'
    });
    if (code.includes('bg-yellow-400') && code.includes('@radix-ui/react-slot')) {
      console.log('   Generated CyberButton code successfully');
      console.log('   ✅ Headless Component Generator functional');
    } else {
      throw new Error('Generated code missing expected vibe or imports');
    }
  } catch (error) {
    console.error('   ❌ Headless Component Generator failed:', error);
  }

  console.log('\n--- Test Complete ---');
}

testEnhancements().catch(console.error);
