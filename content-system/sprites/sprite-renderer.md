# Sprite Renderer Protocol

**Authority Tier**: 2 (Mandatory Process)
**Purpose**: Turn `sprite-schema.json` into actual pixels (`.png`).

## Rendering Strategies

### 1. Component Composition (Layering)
*   **Method**: Assemble pre-made parts (Head, Body, Weapon) based on the Schema.
*   **Tech**: Canvas API (Node.js/Browser) or Python (Pillow).
*   **Process**:
    1.  Load part assets.
    2.  Tint parts using the `palette` from Schema.
    3.  Draw parts in `layer` order.
    4.  Apply composite effects (outline, shadow).

### 2. Procedural Pixel Generation (Cellular Automata)
*   **Method**: Generate shapes using algorithms (e.g., Space Invaders symmetry, Perlin noise).
*   **Tech**: Custom algorithms.
*   **Process**:
    1.  Initialize grid.
    2.  Apply generation logic (e.g., mirror half-width).
    3.  Apply cellular automata smoothing.
    4.  Map values to `palette`.

### 3. Vector Rasterization
*   **Method**: Draw shapes defined in `shape_data` (SVG paths, primitives).
*   **Tech**: SVG-to-PNG library.
*   **Process**:
    1.  Parse vector paths.
    2.  Fill with palette colors.
    3.  Rasterize to target resolution.

## The Rendering Pipeline (Implementation)
The workspace must contain a script (e.g., `tools/renderers/sprite-renderer.ts`) that:
1.  Reads `schema.json`.
2.  Executes the chosen strategy.
3.  Outputs `artifact.png`.
4.  Optimizes/Normalizes the PNG.

## Validation
*   Renderer must verify that the output image dimensions match `dimensions` in Schema.
*   Renderer must ensure no colors outside the `palette` are introduced (except anti-aliasing if enabled).
