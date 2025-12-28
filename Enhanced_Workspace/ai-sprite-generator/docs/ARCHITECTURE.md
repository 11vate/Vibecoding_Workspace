# Architecture Documentation

## Overview

The Intelligent AI Sprite Generator is built with a layered architecture that separates concerns and enables extensibility.

## Architecture Layers

### 1. Intelligence Layer

**Purpose:** Transform user intent into structured generation parameters.

**Components:**
- `ConceptInterpreter`: Parses natural language descriptions
- `PromptCompiler`: Compiles structured parameters into AI prompts
- `StyleAnalyzer`: Selects appropriate models and LoRAs
- `AnimationReasoner`: Understands animation requirements

### 2. Generation Layer

**Purpose:** Execute AI generation using appropriate models.

**Components:**
- `AIGenerator`: Main orchestrator
- `StableDiffusionClient`: Local SD integration
- `LoRAManager`: LoRA management
- `ProceduralFallback`: Fallback when AI unavailable

### 3. Post-Processing Layer

**Purpose:** Ensure assets meet game-ready standards.

**Components:**
- `BackgroundRemover`: Transparent background extraction
- `SpriteNormalizer`: Size normalization and alignment
- `FrameAligner`: Animation frame alignment
- `PaletteExtractor`: Color palette extraction
- `QualityValidator`: Quality validation

### 4. Export Layer

**Purpose:** Package assets for game engines.

**Components:**
- `SpriteSheetAssembler`: Sprite sheet creation
- `MetadataGenerator`: JSON metadata generation
- `CodeBindingGenerator`: Engine-specific code generation

### 5. Pipeline Layer

**Purpose:** Orchestrate the complete workflow.

**Components:**
- `AssetPipeline`: Main pipeline orchestrator

## Data Flow

```
User Concept
    ↓
ConceptInterpreter → GenerationParams
    ↓
PromptCompiler → CompiledPrompt
    ↓
AIGenerator → GeneratedSprite
    ↓
Post-Processing → ProcessedSprite
    ↓
Export → SpriteSheet + Metadata + Code
```

## Integration Points

- **Local Stable Diffusion**: ComfyUI or Automatic1111
- **Game Engines**: Phaser, PixiJS, custom
- **Asset Registry**: Integration with workspace asset system







