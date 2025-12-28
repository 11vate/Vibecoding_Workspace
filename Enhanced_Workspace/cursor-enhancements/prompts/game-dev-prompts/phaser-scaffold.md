# Phaser Game Scaffold Prompt Template

## System Context

You are an expert Phaser 3 game developer. Your task is to scaffold a complete Phaser game structure based on design requirements, including scenes, asset loading, game configuration, and basic game loop setup.

## Input Parameters

- **gameName**: Name of the game
- **scenes**: Array of scene configurations
  - name: Scene name
  - type: "menu" | "game" | "battle" | "inventory" | "custom"
  - width: Scene width
  - height: Scene height
  - backgroundColor: Background color (hex)
- **assets**: Array of asset definitions
  - type: "sprite" | "image" | "audio" | "font"
  - key: Asset key
  - path: Asset file path
- **physics**: Physics configuration (optional)
  - type: "arcade" | "matter"
  - gravity: { x: number, y: number }
  - debug: boolean
- **gameConfig**: Game configuration
  - width: Game width
  - height: Game height
  - parent: Parent DOM element ID

## Process Steps

1. **Project Structure**
   - Create directory structure
   - Set up TypeScript configuration
   - Configure build tools (Vite/Webpack)

2. **Game Configuration**
   - Generate main game config file
   - Set up Phaser game instance
   - Configure physics if specified
   - Set up scene management

3. **Scene Generation**
   - Generate scene classes for each scene
   - Implement preload, create, update methods
   - Add scene-specific logic

4. **Asset Loading**
   - Generate asset loading code
   - Organize assets by type
   - Set up asset paths

5. **Dependencies**
   - Generate package.json
   - Add Phaser dependency
   - Add TypeScript dependencies
   - Add build tool dependencies

## Output Format

```
project/
├── src/
│   ├── main.ts
│   ├── config/
│   │   └── gameConfig.ts
│   ├── scenes/
│   │   ├── MenuScene.ts
│   │   ├── GameScene.ts
│   │   └── ...
│   └── assets/
├── package.json
├── tsconfig.json
└── vite.config.ts (or webpack.config.js)
```

## Validation Criteria

- All scenes are properly structured
- Game config is valid Phaser configuration
- Asset loading code is correct
- Dependencies are properly specified
- Code follows TypeScript best practices
- Project structure is organized

## Example

**Input:**
```json
{
  "gameName": "PixelPets",
  "scenes": [
    {
      "name": "Menu",
      "type": "menu",
      "width": 800,
      "height": 600,
      "backgroundColor": "#1a1a2e"
    },
    {
      "name": "Game",
      "type": "game",
      "width": 800,
      "height": 600,
      "backgroundColor": "#16213e"
    }
  ],
  "assets": [
    {
      "type": "image",
      "key": "logo",
      "path": "assets/images/logo.png"
    }
  ],
  "physics": {
    "type": "arcade",
    "gravity": { "x": 0, "y": 300 },
    "debug": false
  },
  "gameConfig": {
    "width": 800,
    "height": 600,
    "parent": "game-container"
  }
}
```

**Output:**
- Complete project structure with all files
- Generated TypeScript code for all scenes
- Game configuration file
- Package.json with dependencies
- Build configuration

## Integration Points

- Layer 37 (Game Frameworks): Phaser-specific patterns
- Layer 21 (Code Generation): Code generation patterns
- Layer 11 (Architecture Intelligence): Code quality patterns
- Layer 29 (Documentation): Code documentation









