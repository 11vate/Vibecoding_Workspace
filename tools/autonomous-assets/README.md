# Autonomous Asset Generation System

**Authority**: Tier 2 (Mandatory for AI operation)
**Purpose**: Enable 100% autonomous asset generation with ZERO external dependencies
**Status**: Fully Operational

## Overview

This system enables AI models to autonomously generate ALL required assets for projects without any human intervention, API keys, or external services. Assets are generated using **100% free, procedural/algorithmic methods**.

## Core Principle

**NEVER block on missing assets. ALWAYS generate autonomously.**

## Generation Methods (Priority Order)

1. **Geometric** (Canvas API) - UI components, shapes, gradients
2. **Pixel Art Symmetry** - Characters, items, sprites
3. **Pixel Art Cellular Automata** - Organic creatures, patterns
4. **Noise Texture** (Perlin) - Backgrounds, terrain, natural textures
5. **SVG Code Generation** - Icons, symbols, scalable graphics
6. **Animation Interpolation** - Frame-by-frame animations

## Architecture

```
Asset Need → Decision → Specification → Generation → Validation → Registration → Asset Reference
```

### Components

1. **Asset Decision Engine** (`asset-decision-engine.ts`)
   - Decides: reuse existing vs. generate new
   - Selects appropriate generation method
   - Returns high-level decision with reasoning

2. **Specification Builder** (`specification-builder.ts`)
   - Transforms asset needs into detailed generator specifications
   - Infers parameters from descriptions
   - Handles all asset types (UI, sprites, tilesets, etc.)

3. **Generation Orchestrator** (`generation-orchestrator.ts`)
   - **PRIMARY ENTRY POINT** for AI models
   - Coordinates entire pipeline
   - Executes generation using appropriate generators
   - Returns fully registered asset reference

4. **Quality Validator** (`quality-validator.ts`)
   - Validates generated assets against specifications
   - Checks technical compliance (PNG format, dimensions, size)
   - Enforces Asset Generation Gate rules

5. **Auto Registrar** (`auto-registrar.ts`)
   - Automatically registers generated assets
   - Updates ASSET_REGISTRY.md
   - Manages asset file storage
   - Enables future reuse

## Usage

### Simple Usage (Recommended)

```typescript
import { getAsset } from './tools/autonomous-assets';

// AI model requests an asset
const result = await getAsset({
  type: 'ui',
  category: 'button',
  description: 'Primary action button with glossy blue style',
  dimensions: { width: 120, height: 40 },
  tags: ['ui', 'button', 'primary'],
  projectContext: 'my-game'
});

if (result.success) {
  const assetRef = result.assetReference;
  console.log(`Asset ready: ${assetRef.symbolName}`);
  console.log(`Path: ${assetRef.path}`);
  // Use assetRef.path in your project
}
```

### Batch Generation

```typescript
import { generateAssetBatch } from './tools/autonomous-assets';

const needs = [
  { type: 'ui', category: 'button', description: 'Save button', ... },
  { type: 'sprite', category: 'character', description: 'Warrior', ... },
  { type: 'icon', category: 'icon', description: 'Settings icon', ... }
];

const results = await generateAssetBatch(needs);
```

### Project-Level Generation

```typescript
import { generateProjectAssetSet } from './tools/autonomous-assets';

// Generate all standard assets for an RPG project
const assets = await generateProjectAssetSet('rpg', 'my-rpg-game');
```

## Asset Types Supported

### UI Components
- **Buttons**: All states (normal, hover, pressed, disabled), 5 styles
- **Panels**: Dialogs, windows, containers, 5 styles
- **Icons**: 22+ built-in icons, SVG or PNG
- **Progress Bars**: Health, mana, XP, loading, 4 styles

### Sprites
- **Characters**: Humanoid characters with animations (idle, walk, attack)
- **Items**: Consumables, equipment, collectibles, currency
- **Creatures**: Organic sprites using cellular automata

### Environment
- **Tilesets**: Grass, stone, water, sand, dirt, wood, lava
- **Backgrounds**: Noise-based textures with customizable color maps

### Animations
- **Sprite Sheets**: Packed animation frames
- **Metadata**: JSON animation definitions
- **Interpolation**: Smooth between-frame generation

## Asset Need Specification

```typescript
interface AssetNeed {
  type: 'sprite' | 'ui' | 'texture' | 'icon' | 'tileset' | 'animation';
  category?: string; // e.g., 'character', 'button', 'terrain'
  description: string; // Natural language description
  dimensions?: { width: number; height: number };
  attributes?: Record<string, any>; // Additional parameters
  tags?: string[]; // For search and categorization
  projectContext?: string; // Project name/ID
}
```

## Examples

### Generate a Character

```typescript
const character = await getAsset({
  type: 'sprite',
  category: 'character',
  description: 'Player character warrior class medium size with animations',
  dimensions: { width: 32, height: 32 },
  tags: ['character', 'player', 'warrior'],
  projectContext: 'my-rpg',
  attributes: { generateAnimations: true }
});
```

### Generate UI Button

```typescript
const button = await getAsset({
  type: 'ui',
  category: 'button',
  description: 'Red glossy button with text "Attack"',
  dimensions: { width: 100, height: 40 },
  tags: ['ui', 'button', 'combat'],
  projectContext: 'my-rpg',
  attributes: { text: 'Attack', style: 'glossy' }
});
```

### Generate Terrain Tiles

```typescript
const tileset = await getAsset({
  type: 'tileset',
  category: 'terrain',
  description: 'Stone terrain tileset for dungeon',
  dimensions: { width: 32, height: 32 },
  tags: ['tileset', 'terrain', 'stone', 'dungeon'],
  projectContext: 'my-rpg'
});
```

## Decision Logic

The system automatically decides between **reuse** and **generate**:

1. **Search Registry**: Check ASSET_REGISTRY.md for existing assets
2. **Evaluate Match**: If high-confidence match (>70%), REUSE
3. **Generate**: Otherwise, select generation method and CREATE

## Validation

All generated assets pass through:

1. **Technical Compliance**: PNG format, dimensions, file size
2. **Visual Quality**: Basic quality checks
3. **Normalization Standards**: Sprite normalization compliance
4. **Generation Method Compliance**: Approved procedural methods only
5. **Specification Compliance**: Matches requested parameters

## Registry

Generated assets are automatically registered in:
- **File**: `asset-system/ASSET_REGISTRY.md`
- **Storage**: `assets/{type}/{category}/{project}/`

Registry tracks:
- Asset ID, name, path
- Type, category, dimensions, tags
- Generation method, seed (for reproducibility)
- Creation date, file size
- Project context

## Testing

Run comprehensive end-to-end test:

```bash
npx ts-node tools/autonomous-assets/test-autonomous-generation.ts
```

Tests validate:
- UI component generation
- Character sprite generation (with animations)
- Icon generation
- Tileset generation
- Item generation
- Batch generation
- Registry integration

## Key Features

✓ **100% Free** - No API keys, no external services
✓ **Deterministic** - Seed-based reproducibility
✓ **Offline-Capable** - No internet required
✓ **Type-Safe** - Full TypeScript support
✓ **Validated** - Quality checks on all outputs
✓ **Registered** - Automatic registry management
✓ **Reusable** - Smart asset reuse to prevent duplication

## Integration with Workspace

This system integrates with:
- **Asset Generation Gate**: Validates all generated assets
- **Asset Registry**: Tracks all assets for reuse
- **Normalization Standards**: Ensures consistency
- **Design Intelligence Stack**: Layer 4 (Mechanics) and Layer 5 (Content)

## Constitutional Authority

Per `.cursorrules` Section 6.1 (Autonomous Asset Generation):

> **Prime Directive**: AI models MUST be self-sufficient in asset creation. Never block on missing assets.

This system implements that directive completely.

## Future Enhancements

Potential additions:
- Advanced character customization (skin tone, hair, clothing)
- More complex animations (multi-direction, diagonal movement)
- Sound effect generation (procedural audio)
- Font rendering (text-to-sprite)
- 3D model generation (voxel art)

## Support

For issues or questions:
- Check test output for diagnostics
- Verify registry at `asset-system/ASSET_REGISTRY.md`
- Review generated assets in `assets/` directory
- Consult Asset Generation Gate for validation rules

---

**Status**: Production Ready ✓
**Last Updated**: 2025-12-27
**Version**: 1.0.0
