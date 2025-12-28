# Asset Rules

## Asset Organization

All assets live in `/src/assets` and are organized by type:

- `/src/assets/sprites/` - Sprite images and sprite sheets
- `/src/assets/audio/` - Audio files (music, sound effects)
- `/src/assets/fonts/` - Font files
- `/src/assets/icons/` - Icon files
- `/src/assets/data/` - Data files (JSON, etc.)

---

## Asset Naming

### Naming Convention

[Define naming convention - e.g., kebab-case, descriptive names]

**Examples**:
- `player-idle-sprite.png`
- `fusion-success-sound.mp3`
- `main-theme-music.ogg`

---

## Asset Registry

All assets must be registered in `/src/assets/index.ts`:

```typescript
// Example asset registry
export const Sprites = {
  playerIdle: '/src/assets/sprites/player-idle.png',
  playerRun: '/src/assets/sprites/player-run.png',
  // ...
};

export const Audio = {
  fusionSuccess: '/src/assets/audio/fusion-success.mp3',
  // ...
};
```

**Why**: Symbolic references, not file paths. Cursor reasons about assets like variables.

---

## Asset Loading

[Describe asset loading strategy - preloading, lazy loading, etc.]

### Preloading Strategy
[What assets are preloaded]

### Lazy Loading Strategy
[What assets are loaded on demand]

---

## Asset Optimization

[Describe asset optimization - compression, formats, etc.]

### Image Optimization
- Format: [PNG/WebP/etc.]
- Compression: [Strategy]
- Spritesheets: [When to use]

### Audio Optimization
- Format: [MP3/OGG/etc.]
- Compression: [Strategy]
- Streaming: [When to use]

---

## Asset Licensing

[Document asset sources and licenses - ensure all assets are properly licensed.]

### Asset Sources
- [Source]: [License]
- [Source]: [License]

---

**This document defines asset management - how assets are organized, named, loaded, and optimized.**


