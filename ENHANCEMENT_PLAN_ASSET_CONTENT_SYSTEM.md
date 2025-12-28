# Enhancement Plan: Asset & Content System Architecture

**Status**: Implementation Complete (Framework & Tooling Level)
**Version**: 1.1
**Last Updated**: 2025-12-24
**Objective**: Transform asset handling from "file management" to "content synthesis" and "sourcing protocols".

---

## 1. Problem Statement
**Root Cause**: AIs fail at asset sourcing because they lack a "contract". They treat "assets" as a single ambiguity, leading to safe defaults (squares, fake filenames) or hallucinations.
**Solution**: 
1.  **Split Sourcing**: 4 explicit modes (Gen, Lib, Ingest, Commission).
2.  **Asset Specs**: Replace "search" with "specification".
3.  **Parametric Content**: Content is data first, visuals second.
4.  **Synthesis as Compiler**: Treat content generation as a multi-phase compilation process (Grammar -> Structure -> Validation -> Instantiation).

---

## 2. Implementation Roadmap

### Phase 1: Asset Sourcing Protocols (The "Contract") - ✅ COMPLETE
Establish the laws for *where* assets come from.

- [x] **Create `asset-system/ASSET_SOURCING_MODES.md`**
    - Defined Mode 1: Deterministic Generation (AI-native).
    - Defined Mode 2: Curated Open Libraries (Authoritative).
    - Defined Mode 3: Local Asset Ingestion (Human-in-the-loop).
    - Defined Mode 4: Commission/Purchase (Explicitly Blocked).

- [x] **Create `asset-system/sources/` Directory**
    - [x] `OPEN_ASSET_SOURCES.md`: List of allowed domains/licenses (OpenGameArt, Kenney, etc.).
    - [x] `SOURCE_REGISTRY.json`: Machine-readable whitelist.

- [x] **Create `asset-system/specs/` Directory**
    - [x] `ASSET_SPEC_TEMPLATE.md`: The standard form for requesting assets (Context, Dimensions, Style, Mode).

- [x] **Update `gates/`**
    - [x] `asset-sourcing-gate.md`: Enforce that NO asset exists without a Spec + Source Mode + License.

### Phase 2: Asset Normalization (The "Handshake") - ✅ COMPLETE
Ensure sourced assets actually fit the engine.

- [x] **Create `asset-system/normalization/` Directory**
    - [x] `sprite-normalization.md`: Rules for base units (32x32, 64x64) and anchor points.
    - [x] `animation-alignment.md`: Standardizing timing and frame counts.

### Phase 3: Content System (The "Engine") - ✅ COMPLETE
Shift from "Assets" to "Parametric Content".

#### Layer 1: Data First
- [x] **Create `content-system/` Directory**
    - [x] `CONTENT_CONSTITUTION.md`: Law: Content = Data first, Visuals = Derived.
    - [x] `content-types.md`: Definition of content structures (Visual, Audio, Geometry, Animation, Narrative, Mechanics, UX).

#### Layer 2: Seeded Generative Pipelines
- [x] **Create `content-system/generation/`**
    - [x] `seed-model.md`: Global seed + Sub-seeds strategy.
    - [x] `generator-contract.md`: Deterministic generation rules (Grammar-based, Multi-phase).

#### Layer 3: Sprite Synthesis
- [x] **Create `content-system/sprites/`**
    - [x] `sprite-schema.json`: Logical size, anchors, animation states, frame relationships, palette constraints.
    - [x] `sprite-renderer.md`: Procedural rendering or deterministic rasterization protocols.

#### Layer 4: Procedural Geometry
- [x] **Create `content-system/geometry/`**
    - [x] `shape-language.md`: Vector-based definitions.
    - [x] `tile-synthesis.md`: Tilemaps from rules, world art from noise + grammar.

#### Layer 5: Narrative & Text
- [x] **Create `content-system/narrative/`**
    - [x] `lore-grammar.md`: Grammar-based lore generation.
    - [x] `naming-systems.md`: Phonetic naming systems.

#### Layer 6: Runtime Content Baking
- [x] **Create `content-system/baking/`**
    - [x] `bake-phases.md`: Pipeline (Generate -> Validate -> Bake -> Cache -> Bind).

### Phase 4: The Integrity Gate - ✅ COMPLETE
- [x] **Create `gates/content-integrity-gate.md`**
    - Rules:
        - No content without a generator.
        - No sprite without a schema.
        - No art without a seed.
        - No visual that cannot be regenerated.

---

## 3. Integration with Existing System
*Current `asset-system` (Registry, Validation, Ingestion) will remain as the "Storage & QA" layer, but `asset-sourcing` and `content-system` will sit *upstream* as the "Production" layer.*

1.  **Requirement** (Game Logic)
2.  **Spec** (`asset-system/specs`)
3.  **Sourcing/Generation** (`content-system` OR `asset-system/sources`)
4.  **Normalization** (`asset-system/normalization`)
5.  **Ingestion & Registry** (Existing `asset-system`)

---

## 4. Architectural Principles
Based on "First Principles" of Content Synthesis:
1.  **Rule-Generated**: Content is generated from formal grammars, not random noise.
2.  **Data Authoritative**: Visuals are derived artifacts.
3.  **Deterministic**: Global seed + sub-seeds.
4.  **Pre-Runtime Validation**: Validate mechanically before baking.
5.  **Multi-Phase**: Structure -> Constraint Solving -> Validation -> Instantiation.

## 5. Tooling Implementation Status (v1.1)

The following tools and generators have been implemented and verified:

### Generators (Layer 3-5)
- **Sprite Generator**:
  - `src/content/generators/logic/SpriteLogic.ts`: Pure logic generator (Runtime-safe).
  - `src/content/renderers/NodeSpriteRenderer.ts`: Node-canvas renderer (Build-time).
  - Supports: Dimensions, Palette, Symmetry, Complexity.
- **Lore Generator**:
  - `src/content/generators/LoreGenerator.ts`: Grammar-based text generation.
- **Geometry Generator**:
  - `src/content/generators/logic/GeometryLogic.ts`: Procedural mesh logic (Runtime-safe).
  - `src/content/renderers/ObjRenderer.ts`: OBJ file exporter.
  - Supports: Cube, Pyramid, Terrain chunks.

### Compilation & Preview (Layer 6)
- **Content Compiler**: `tools/generators/ContentCompiler.ts`
  - Orchestrates the full pipeline: Manifest -> Generator -> Schema -> Artifact.
  - Validates outputs against gates.
- **Gallery Preview**: `tools/preview/generate-gallery.ts`
  - Generates `gallery.html` to visualize all generated assets (Images, Text, OBJ).

### Runtime Support
- **In-Game Generation**: `projects/runtime-demo/game_simulation.ts`
  - Demonstrates how to use `SpriteLogic` directly in a game engine without Node dependencies.
  - Zero-dependency logic files.

### Verification Gates
- **Sourcing Gate**: `tools/gates/check-asset-sourcing.ts`
- **Integrity Gate**: `tools/gates/check-content-integrity.ts`
