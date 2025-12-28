# Content Baking Phases

**Authority Tier**: 2 (Mandatory Process)
**Purpose**: The pipeline from "Idea" to "Runtime Asset".

## Phase 1: Generation (Design Time / Build Time)
1.  **Input**: Global Seed + Configuration.
2.  **Process**: Generators run (WFC, Grammars, Sprite Synth).
3.  **Output**: **Schemas** (JSON data structures).
4.  **Storage**: `src/content/schemas/`

## Phase 2: Validation (Gatekeeper)
1.  **Input**: Schemas.
2.  **Process**: Run validation logic (Connectivity checks, Palette checks).
3.  **Output**: Pass/Fail.

## Phase 3: Baking (Asset Production)
1.  **Input**: Validated Schemas.
2.  **Process**: Renderers run (Schema -> PNG/WAV).
3.  **Output**: **Artifacts** (Source Assets).
4.  **Storage**: `src/assets/generated/`

## Phase 4: Integration (Runtime Binding)
1.  **Input**: Artifacts.
2.  **Process**: Engine loads assets and binds them to Entity Logic.
3.  **Output**: Playable Game.

## Caching Strategy
*   Schemas are cheap to store (text).
*   Artifacts are expensive (images).
*   **Strategy**: Only re-bake Artifacts if the Schema (or Generator) has changed. Use content hashing.
