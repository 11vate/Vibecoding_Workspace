// Simulate a Game Engine (e.g., Phaser, Unity, Custom Engine)
// This file demonstrates how a project can use the Content System at Runtime

// NOTE: In a real project, this import would be from a package (e.g. @vibecoding/content-system)
// or a cleaner alias. For this demo, we use the relative path.
import { SpriteLogic, SpriteConfig } from '../../src/content/generators/logic/SpriteLogic';

// 1. Initialize the Generator (Pure Logic, No Node Canvas)
const generator = new SpriteLogic();

// 2. Define a Runtime Request (e.g., "Player picked up a new sword")
const seed = Date.now(); // Dynamic seed
const config: SpriteConfig = {
    dimensions: { width: 16, height: 16 },
    palette: ['#000000', '#c0c0c0', '#ffffff', '#ffd700'], // Gold & Silver
    symmetry: 'vertical',
    complexity: 0.8
};

console.log(`🎮 Game Engine: Generating new asset at runtime (Seed: ${seed})...`);

// 3. Generate Schema
const schema = generator.generate(seed, config);

console.log(`✅ Asset Generated: ${schema.id}`);
console.log(`   Dimensions: ${schema.dimensions.width}x${schema.dimensions.height}`);
console.log(`   Palette: ${schema.palette.join(', ')}`);

// 4. Simulate Rendering (In a real browser game, this would use HTML5 Canvas)
console.log(`🎨 Rendering to Screen (Simulation)...`);
const pixelCount = schema.pixels.flat().filter(p => p !== -1).length;
console.log(`   Rendered ${pixelCount} pixels.`);

// In a real project, you would now:
// const ctx = myCanvas.getContext('2d');
// ... draw pixels from schema.pixels ...
