# Tile Synthesis

**Authority Tier**: 3 (Heuristic)
**Purpose**: Generate coherent world maps and tilemaps.

## Wave Function Collapse (WFC)
*   **Concept**: Define rules for which tiles can sit next to each other (Adjacency Constraints).
*   **Process**:
    1.  Define Tile Set.
    2.  Define Adjacency Rules (e.g., "Grass" can touch "Sand", but not "Lava").
    3.  Run WFC algorithm to collapse quantum states into a single valid map.

## Noise-Based Terrain
*   **Concept**: Use Perlin/Simplex noise for heightmaps and biomes.
*   **Process**:
    1.  Generate Height Map.
    2.  Generate Moisture Map.
    3.  Determine Biome (e.g., High + Dry = Mountain, Low + Wet = Ocean).
    4.  Map Biome to Tiles.

## Rule-Based Automata
*   **Concept**: Game of Life style rules for caves/dungeons.
*   **Process**:
    1.  Random fill.
    2.  Apply smoothing rules (e.g., "If < 4 neighbors, become empty").
    3.  Flood fill to ensure connectivity.
