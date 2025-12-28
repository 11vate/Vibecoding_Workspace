# Autonomous Asset Generation Protocol

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-26
**Purpose**: Enable AI models to autonomously generate ANY asset using 100% free procedural methods

---

## Core Principle

**AI models MUST be self-sufficient in asset creation. Never block on missing assets.**

When any asset is needed, AI executes this mandatory protocol autonomously.

---

## Asset Decision Protocol (Tier 2 - Mandatory)

Every asset request follows this exact sequence:

### Step 1: Search Registry (MANDATORY)
```
Query ASSET_REGISTRY.md for:
- Exact matches (same dimensions, type, purpose)
- Similar assets (same category, close dimensions)
- Reusable alternatives (can adapt existing)

IF found with confidence > 80%:
  → REUSE (increment reuse_count)
  → STOP (return symbolic reference)
```

### Step 2: Evaluate Generation Method (MANDATORY)
```
IF not found:
  Analyze asset need:
    - What type? (sprite, UI, texture, icon, effect)
    - What complexity? (simple geometric, detailed pixel art, procedural texture)
    - What constraints? (dimensions, colors, style, animation)

  Consult Generation Method Priority (see below)

  SELECT appropriate method
```

### Step 3: Build Specification (MANDATORY)
```
Create detailed AssetSpecification:
  - id: unique identifier
  - type: asset category
  - dimensions: exact size
  - style: visual style (pixel-art, geometric, etc.)
  - colors: palette or color scheme
  - purpose: what it's for
  - technical_requirements: format, transparency, etc.
  - generation_method: selected method
  - fallback_method: backup if primary fails
  - validation_criteria: success conditions
```

### Step 4: Execute Generation (MANDATORY)
```
CALL appropriate generator with specification

Generator MUST:
  - Use seed for determinism
  - Follow workspace normalization standards
  - Output to /src/assets/generated/
  - Generate schema to /src/content/schemas/
  - Use only local/free methods (NO API calls)
```

### Step 5: Validate Output (MANDATORY)
```
Run Asset Generation Gate validation:
  - Dimensions match specification? ✓
  - Transparency requirements met? ✓
  - File format correct? ✓
  - File size reasonable? ✓
  - Quality acceptable? ✓
  - Normalization standards followed? ✓

IF validation fails:
  → Try fallback method
  → IF fallback fails: Document and request human spec
```

### Step 6: Register Asset (MANDATORY)
```
Create registry entry:
  - Add to ASSET_REGISTRY.md
  - Add to ASSET_REGISTRY.json
  - Include full metadata
  - Document generation method
  - Record seed for reproducibility
```

### Step 7: Return Reference (MANDATORY)
```
Return symbolic reference:
  import { ASSET_ID } from 'src/assets/index.ts'

Never use direct paths.
```

---

## Generation Method Priority (Tier 1 - Immutable)

AI MUST select methods in this priority order:

### Priority 1: Geometric Generation (Canvas API)
**When to Use**:
- Simple UI elements (buttons, panels, bars)
- Shapes, gradients, patterns
- HUD elements (health bars, score displays)
- Abstract backgrounds

**Tools**: `/tools/procedural-generation/geometric-engine/`

**Advantages**:
- Instant generation
- Infinite variations
- Perfect precision
- No external dependencies

**Example Assets**:
- Buttons (all states: normal, hover, pressed, disabled)
- Progress bars, sliders
- Panels, dialogs, modals
- Simple icons (shapes-based)

---

### Priority 2: Algorithmic Pixel Art
**When to Use**:
- Game sprites (characters, enemies, NPCs)
- Items (potions, weapons, collectibles)
- Simple creatures
- Retro-style assets

**Tools**: `/tools/procedural-generation/pixel-art-engine/`

**Methods**:
- Symmetry-based generation (horizontal, vertical, quad)
- Cellular automata
- Shape grammar rules
- Random walk with constraints

**Advantages**:
- Unique sprites every time
- Retro aesthetic
- Fast generation
- Highly configurable

**Example Assets**:
- 32x32 character sprites
- 16x16 item icons
- Enemy sprites
- Props (chests, rocks, trees)

---

### Priority 3: Noise Textures (Perlin/Simplex)
**When to Use**:
- Terrain tiles (grass, stone, water, dirt)
- Natural textures (wood, rock, clouds)
- Background elements
- Particle effects

**Tools**: `/tools/procedural-generation/texture-engine/`

**Methods**:
- Perlin noise (smooth, natural)
- Simplex noise (faster, less directional artifacts)
- Texture synthesis (quilting, patch-based)

**Advantages**:
- Natural-looking results
- Seamless tiling
- Infinite variations
- Realistic textures

**Example Assets**:
- Grass tiles (seamless)
- Stone textures
- Water animations
- Cloud backgrounds

---

### Priority 4: SVG Code Generation
**When to Use**:
- Icons (save, load, settings, menu, etc.)
- Symbols (arrows, checkmarks, warnings)
- Logos, badges
- Scalable UI elements

**Tools**: `/tools/procedural-generation/vector-engine/`

**Methods**:
- Direct SVG path code generation
- Geometric primitive composition
- Icon library (100+ predefined patterns)

**Advantages**:
- Scalable (any size)
- Crisp at all resolutions
- Small file size
- Easy to modify

**Example Assets**:
- Icon sets (50+ common icons)
- UI symbols
- Badges, ribbons
- Decorative elements

---

### Priority 5: Font Rendering (Text-to-Sprite)
**When to Use**:
- Number displays (scores, timers)
- Text labels
- Icon fonts as sprites
- Bitmap fonts

**Tools**: `/tools/procedural-generation/font-engine/`

**Methods**:
- Render system fonts to canvas
- Icon font rasterization (FontAwesome, Material Icons)
- Custom bitmap font generation

**Advantages**:
- Instant text graphics
- Any font available
- Size flexibility
- Localization support

**Example Assets**:
- Score numbers
- Timer displays
- UI labels
- Icon sprites from icon fonts

---

## Generation Specification Schema

Every asset generation MUST start with a complete specification:

```typescript
interface AssetSpecification {
  // Identity
  id: string;                    // "hero-sprite-001"
  type: AssetType;               // "sprite" | "texture" | "icon" | "ui"
  purpose: string;               // "Player character for RPG"

  // Visual Requirements
  visual: {
    style: Style;                // "pixel_art" | "geometric" | "realistic"
    dimensions: {
      width: number;             // 32
      height: number;            // 32
    };
    colors?: {
      palette?: string[];        // ["#2d1b2e", "#5a3a5c", ...]
      count?: number;            // 5
      scheme?: string;           // "monochrome" | "complementary"
    };
    transparency: boolean;       // true
  };

  // Animation (if applicable)
  animation?: {
    states: string[];            // ["idle", "walk", "attack"]
    directions?: number;         // 4 (for 4-way movement)
    framesPerState: Record<string, number>; // { idle: 4, walk: 4 }
  };

  // Technical Requirements
  technical: {
    format: string;              // "png" | "svg" | "json"
    maxFileSize?: number;        // 50000 (bytes)
    sheetLayout?: string;        // "grid" | "packed"
    metadata?: boolean;          // true (generate JSON metadata)
  };

  // Generation Strategy
  generation: {
    method: GenerationMethod;    // "procedural_pixel_art"
    fallback: GenerationMethod;  // "geometric"
    seed?: number;               // 12345 (for reproducibility)
    config?: any;                // Method-specific configuration
  };

  // Validation Criteria
  validation: {
    mustHave: string[];          // ["transparent_background", "correct_dimensions"]
    mustNotHave: string[];       // ["compression_artifacts", "color_bleed"]
    qualityThreshold?: number;   // 0.8 (0-1 scale)
  };
}

type AssetType =
  | "sprite"
  | "sprite_sheet"
  | "texture"
  | "icon"
  | "ui_component"
  | "effect"
  | "background"
  | "tile";

type Style =
  | "pixel_art"
  | "geometric"
  | "flat_design"
  | "isometric"
  | "minimalist"
  | "realistic";

type GenerationMethod =
  | "geometric"           // Canvas API shapes/gradients
  | "pixel_art_symmetry"  // Symmetrical pixel art
  | "pixel_art_ca"        // Cellular automata
  | "texture_perlin"      // Perlin noise
  | "texture_simplex"     // Simplex noise
  | "svg_code"            // SVG code generation
  | "font_render";        // Font to sprite
```

---

## Quality Standards

All generated assets MUST meet these standards:

### File Format Standards
- **PNG**: 32-bit with alpha channel, sRGB color space
- **SVG**: Valid XML, optimized paths, no external dependencies
- **JSON**: Valid schema, complete metadata

### Dimension Standards
- Grid-aligned (multiples of base grid: 8, 16, 32, 64)
- Power-of-two preferred for textures (32, 64, 128, 256)
- Consistent sizing within asset sets

### Color Standards
- Transparency: Fully transparent background (alpha=0)
- Palette: Consistent within project style
- No semi-transparent edges (causes bleed)

### Optimization Standards
- File size: < 100KB for sprites, < 500KB for sheets
- Compression: Lossless PNG optimization
- Metadata: Minimal but complete

### Normalization Standards
- Follow `/asset-system/normalization/sprite-normalization.md`
- Anchor points: Bottom-center for ground entities
- Padding: 2px between sprite sheet frames

---

## Error Handling

### Generation Failures

**IF generation fails**:
1. Log failure details
2. Try fallback method
3. If fallback fails, try simpler method (geometric)
4. If all fail: Document and create commission spec

**Never**:
- Guess or hallucinate asset paths
- Use placeholder text ("TODO", "TBD")
- Block project on missing asset
- Request external assets from user

**Always**:
- Document what was attempted
- Provide specification for manual creation (if needed)
- Continue with project using temporary geometric placeholder

---

## Integration with Workspace

### With Asset Registry
Every generated asset:
- Registered in ASSET_REGISTRY.md
- Searchable via tags
- Tracked for reuse metrics

### With Gates
Generated assets pass through:
- Asset Gate (registry compliance)
- Asset Generation Gate (quality validation)
- Quality Gate (no placeholders)

### With Protocols
Generation follows:
- Asset lifecycle (ingestion → validation → registration)
- Normalization standards
- Reuse-before-create mandate

---

## Performance Targets

### Generation Speed
- Simple geometric: < 100ms
- Pixel art sprite: < 500ms
- Texture tile: < 1000ms
- Sprite sheet (16 frames): < 5000ms

### Quality Targets
- Validation pass rate: > 95%
- Reuse suggestion accuracy: > 80%
- User satisfaction: "Acceptable for prototype"

---

## Examples

### Example 1: Button Generation

```typescript
const buttonSpec: AssetSpecification = {
  id: "btn-primary-normal",
  type: "ui_component",
  purpose: "Primary button in normal state",

  visual: {
    style: "geometric",
    dimensions: { width: 120, height: 40 },
    colors: {
      palette: ["#4CAF50", "#45a049", "#388E3C"]
    },
    transparency: true
  },

  technical: {
    format: "png",
    maxFileSize: 10000
  },

  generation: {
    method: "geometric",
    fallback: "svg_code",
    config: {
      gradient: "linear",
      borderRadius: 8,
      border: { width: 2, color: "#2E7D32" }
    }
  },

  validation: {
    mustHave: ["rounded_corners", "gradient"],
    mustNotHave: ["jagged_edges"]
  }
};
```

### Example 2: Character Sprite

```typescript
const characterSpec: AssetSpecification = {
  id: "hero-sprite-walk",
  type: "sprite_sheet",
  purpose: "Hero character walk cycle",

  visual: {
    style: "pixel_art",
    dimensions: { width: 32, height: 32 },
    colors: {
      palette: ["#2d1b2e", "#5a3a5c", "#8b6d9c", "#c69fa5", "#ffffff"],
      count: 5
    },
    transparency: true
  },

  animation: {
    states: ["walk"],
    directions: 4,
    framesPerState: { walk: 4 }
  },

  technical: {
    format: "png",
    sheetLayout: "grid",
    metadata: true
  },

  generation: {
    method: "pixel_art_symmetry",
    fallback: "pixel_art_ca",
    seed: 42,
    config: {
      symmetry: "horizontal",
      complexity: 0.6
    }
  },

  validation: {
    mustHave: ["transparent_background", "pixel_perfect", "frame_consistency"],
    qualityThreshold: 0.7
  }
};
```

---

## Workflow Summary

```
ASSET NEEDED
    ↓
[1] Search ASSET_REGISTRY.md
    ↓
    Found? → REUSE → DONE
    ↓
    Not Found
    ↓
[2] Evaluate Generation Method
    ↓
[3] Build Specification
    ↓
[4] Execute Generation
    ↓
[5] Validate Output
    ↓
    Valid? → Continue
    Invalid? → Try Fallback
    ↓
[6] Register in Registry
    ↓
[7] Return Symbolic Reference
    ↓
ASSET READY FOR USE
```

---

## Compliance

This protocol is **Tier 2 (Mandatory Process)**. All AI models operating in this workspace MUST:

1. ✅ Follow this protocol for every asset request
2. ✅ Never skip registry search
3. ✅ Always validate generated assets
4. ✅ Always register new assets
5. ✅ Use only free/local generation methods
6. ✅ Document failures and attempt fallbacks
7. ✅ Never block on missing assets
8. ✅ Never request assets from users

**Violations will be logged in `/evolution/GATE_FAILURES_LOG.md`**

---

## Maintenance

**Review Cycle**: Quarterly
**Metrics Tracked**: Generation success rate, fallback usage, quality scores
**Evolution**: Via `/evolution/UPDATE_PROTOCOL.md` only

---

**This protocol ensures AI models have complete asset autonomy with zero external dependencies.**
