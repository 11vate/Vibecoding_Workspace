# API Documentation

## AssetPipeline

Main pipeline orchestrator for sprite generation.

### Methods

#### `execute(concept: string, config?: PipelineConfig): Promise<PipelineResult>`

Execute the complete asset generation pipeline.

**Parameters:**
- `concept`: Natural language description (e.g., "pixel art fire pet idle animation")
- `config`: Optional pipeline configuration

**Returns:** `PipelineResult` with generated assets and metadata

**Example:**
```typescript
import { AssetPipeline } from 'ai-sprite-generator';

const pipeline = new AssetPipeline();
const result = await pipeline.execute('pixel art fire pet idle animation', {
  enablePostProcessing: true,
  enableValidation: true,
  targetEngine: 'phaser',
});

if (result.success) {
  console.log('Sprite generated:', result.sprite?.id);
}
```

## ConceptInterpreter

Interprets natural language concepts into structured parameters.

### Methods

#### `interpret(concept: string): ConceptInterpretation`

Parse a concept description into structured generation parameters.

**Example:**
```typescript
import { ConceptInterpreter } from 'ai-sprite-generator';

const interpreter = new ConceptInterpreter();
const interpretation = interpreter.interpret('pixel art fire pet idle animation');

console.log(interpretation.params);
// {
//   entity: 'pet',
//   style: 'pixel-art',
//   theme: 'fire',
//   action: 'idle',
//   frameCount: 8,
//   ...
// }
```

## AIGenerator

AI-powered sprite generation.

### Methods

#### `generate(params: GenerationParams): Promise<GeneratedSprite>`

Generate a single sprite from parameters.

#### `generateAnimation(params: GenerationParams, frameCount: number): Promise<GeneratedSprite[]>`

Generate multiple frames for animation.

#### `isAvailable(): Promise<boolean>`

Check if AI generation is available.







