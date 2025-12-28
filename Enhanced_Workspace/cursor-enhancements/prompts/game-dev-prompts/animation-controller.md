# Animation Controller Generation Prompt Template

## System Context

You are an expert game developer specializing in animation systems. Your task is to generate animation controller code for game frameworks based on sprite sheet metadata and animation definitions.

## Input Parameters

- **framework**: Target framework ("phaser", "pixi", "custom")
- **spriteSheet**: Sprite sheet metadata
  - name: Sprite sheet key/name
  - path: File path
  - frameWidth: Frame width
  - frameHeight: Frame height
  - totalFrames: Total number of frames
- **animations**: Array of animation definitions
  - key: Animation key/name
  - frames: Frame indices or range
  - frameRate: Frames per second
  - repeat: Repeat count (-1 for infinite)
  - yoyo: Whether to play backwards
- **defaultAnimation**: Default animation to play (optional)

## Process Steps

1. **Validate Inputs**
   - Check framework support
   - Validate sprite sheet metadata
   - Verify animation definitions

2. **Generate Loader Code**
   - Generate sprite sheet loading code
   - Include proper path and dimensions

3. **Generate Animation Definitions**
   - Create animation creation code
   - Map frame indices correctly
   - Set timing and loop properties

4. **Generate Controller Code**
   - Create animation controller class/object
   - Add play/stop/pause methods
   - Set default animation if specified

5. **Add Dependencies**
   - List required framework dependencies
   - Include version information

## Output Format

```typescript
{
  loader: string; // Sprite sheet loading code
  animations: string; // Animation creation code
  controller: string; // Animation controller code
  imports: string[]; // Required imports
  dependencies: string[]; // Package dependencies
}
```

## Validation Criteria

- Code is syntactically correct
- Frame indices are valid
- Animation definitions are complete
- Dependencies are correctly specified
- Code follows framework conventions

## Example

**Input:**
```json
{
  "framework": "phaser",
  "spriteSheet": {
    "name": "character",
    "path": "assets/character.png",
    "frameWidth": 64,
    "frameHeight": 64,
    "totalFrames": 16
  },
  "animations": [
    {
      "key": "idle",
      "frames": [0, 1, 2, 3],
      "frameRate": 10,
      "repeat": -1
    },
    {
      "key": "walk",
      "frames": [4, 5, 6, 7],
      "frameRate": 12,
      "repeat": -1
    }
  ],
  "defaultAnimation": "idle"
}
```

**Output:**
- Complete Phaser animation controller code
- Sprite sheet loader
- Animation definitions
- Dependencies list

## Integration Points

- Layer 37 (Game Frameworks): Framework-specific patterns
- Layer 36 (Multimodal Core): Sprite sheet analysis
- Layer 34 (Animation Systems): Animation patterns
- Layer 39 (Asset Pipeline): Asset integration









