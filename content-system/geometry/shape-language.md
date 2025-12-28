# Shape Language

**Authority Tier**: 3 (Heuristic)
**Purpose**: Define vector-based geometry for procedural generation.

## Primitives
*   **Box**: `x, y, w, h`
*   **Circle**: `cx, cy, r`
*   **Polygon**: List of `(x, y)` points.

## Operations (CSG)
*   **Union**: Combine shapes.
*   **Difference**: Subtract shape B from A.
*   **Intersection**: Keep overlapping area.

## Usage
*   **Collision**: Shapes define physics bodies.
*   **Level Design**: Shapes define rooms and corridors.
*   **Visuals**: Shapes can be rasterized into sprites (see `sprite-renderer.md`).
