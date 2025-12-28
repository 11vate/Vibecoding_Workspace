# Integration Guide

## Pixel Pets Reborn Integration

The AI Sprite Generator can be integrated with Pixel Pets Reborn to replace the procedural sprite generator.

### Setup

1. Install the generator in your workspace:
```bash
cd ai-sprite-generator
npm install
npm run build
```

2. Import the adapter in Pixel Pets:
```typescript
import { PixelPetsAdapter } from '../ai-sprite-generator/src/integration/PixelPetsAdapter';

const adapter = new PixelPetsAdapter();
```

3. Replace SpriteGenerator usage:
```typescript
// Old
const sprite = await spriteGenerator.generateSpriteForPet(pet);

// New
const sprite = await adapter.generateSpriteForPet(pet);
```

### Interface Compatibility

The `PixelPetsAdapter` maintains compatibility with the existing `SpriteGenerator` interface:
- `generateSpriteForPet(pet: Pet): Promise<string>` - Returns data URL
- `generateAllAnimationStates(pet: Pet): Promise<AnimationStates>` - Returns animation states

## CLI Usage

### Basic Generation

```bash
npm run dev generate "pixel art fire pet, side view"
```

### Animation Generation

```bash
npm run dev generate "pixel art fire pet idle animation" --frames 8
```

### With Engine Export

```bash
npm run dev generate "pixel art hero character" --engine phaser --output ./game-assets
```

### Options

- `--frames <number>`: Number of animation frames
- `--style <style>`: Visual style override
- `--engine <engine>`: Target game engine (phaser, pixijs, custom)
- `--output <dir>`: Output directory
- `--no-post-processing`: Skip post-processing
- `--no-validation`: Skip validation
- `--no-export`: Skip export

## Programmatic Usage

```typescript
import { AssetPipeline } from 'ai-sprite-generator';

const pipeline = new AssetPipeline();

const result = await pipeline.execute('pixel art fire pet idle animation', {
  enablePostProcessing: true,
  enableValidation: true,
  targetEngine: 'phaser',
});

if (result.success && result.sprite) {
  // Use result.sprite, result.sheet, result.metadata, result.codeBindings
}
```







