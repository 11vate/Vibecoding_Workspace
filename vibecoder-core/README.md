# Vibecoder Core Engine

This is the central nervous system for the Vibecoding Workspace. It bridges the gap between conceptual blueprints and playable assets.

## Capabilities

1.  **Asset Registry**: A single source of truth for all game assets (`ASSET_REGISTRY.json`).
2.  **Content Registry**: A database for game logic (`CONTENT_REGISTRY.json`) including Entities, Biomes, and Verbs.
3.  **Asset Processing**: Automated standardization of images (resizing, formatting).
4.  **Code Generation**: Auto-binding assets to game engines (Phaser/React).
5.  **Project Memory**: Tracking blueprints and lessons across projects.

## Usage

### 1. Request an Asset (Intent)
Turn an idea into a formal request.

```bash
node index.js request <project> <type> <name> <description>
# Example:
node index.js request PixelPets sprite "Fire Dragon" "A small red dragon"
```

### 2. Process an Asset
Once an image is generated (by AI or manually), process it into the project.

```bash
node index.js process <intentId> <path/to/raw/image.png>
```

### 3. Bind to Engine
Generate the code to load assets in the game.

```bash
node index.js bind <path/to/project>
```

### 4. Define Content (Entities, Biomes, Verbs)
Register game content to ensure consistency.

```bash
# Register an entity (from JSON string or file path)
node index.js define-entity '{"id": "slime", "name": "Slime", "visuals": {"assetId": "slime_sprite"}, "physics": {"type": "dynamic"}}'

# Register a biome
node index.js define-biome path/to/forest_biome.json

# Register a verb
node index.js define-verb '{"id": "push", "type": "action", "logic": {"duration": 500}}'
```

## Structure
*   `schemas/`: Zod definitions for data structures (Assets, Entities, Biomes, Interactions).
*   `registry/`: Database management.
*   `processors/`: Image manipulation logic.
*   `generators/`: Code emission logic.
*   `memory/`: Long-term project storage.
