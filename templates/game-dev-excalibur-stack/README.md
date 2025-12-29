# Game Development Template - Excalibur.js Stack

**Optimal vibecoding stack for 2D game development with 100% offline capability**

## Stack Overview

This template provides the best-in-class stack for creating 2D games with AI-assisted development:

### Core Technologies
- **Excalibur.js** (v0.29.3) - TypeScript-native 2D game engine
- **TypeScript** (v5.3.3) - Strict mode enabled for maximum type safety
- **Vite** (v5.0.11) - Lightning-fast build tool and dev server
- **Zustand** (v4.5.0) - Lightweight state management
- **IndexedDB** (via idb v8.0.0) - Offline data persistence

### Game Development Features
- **Ape-ECS** (v1.4.1) - Entity Component System architecture
- **FastNoiseLite** (v1.1.1) - Procedural generation (terrain, textures)
- **Vite PWA Plugin** (v0.19.2) - Offline-first Progressive Web App

## Features

✅ **100% Offline Capable**
- Service worker for asset caching
- IndexedDB for game state persistence
- No external API dependencies

✅ **TypeScript Strict Mode**
- Full type safety
- No implicit any
- Compile-time error detection

✅ **Modern Architecture**
- Scene-based game structure
- Centralized state management
- Event-driven systems

✅ **PWA Ready**
- Installable on desktop and mobile
- Offline gameplay
- Automatic updates

✅ **Developer Experience**
- Hot module replacement
- Source maps
- Path aliases (@/, @assets/, @systems/)

## Quick Start

### 1. Installation

```bash
# Copy this template to your project directory
cp -r templates/game-dev-excalibur-stack my-game
cd my-game

# Install dependencies
npm install
```

### 2. Development

```bash
# Start dev server with hot reload
npm run dev

# Open http://localhost:3000
```

### 3. Build for Production

```bash
# Type check
npm run type-check

# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
my-game/
├── src/
│   ├── main.ts                 # Entry point
│   ├── scenes/                 # Game scenes
│   │   ├── MainMenuScene.ts    # Main menu
│   │   └── GameScene.ts        # Game play
│   ├── systems/                # Game systems
│   │   └── GameState.ts        # Zustand store
│   ├── components/             # ECS components (add as needed)
│   ├── entities/               # Game entities (add as needed)
│   ├── assets/                 # Game assets
│   │   ├── sprites/
│   │   ├── audio/
│   │   └── index.ts            # Asset registry
│   └── utils/                  # Utilities
│       └── pwa.ts              # PWA helpers
├── public/                     # Static assets
│   ├── icon-192.png            # App icon (192x192)
│   └── icon-512.png            # App icon (512x512)
├── docs/                       # Design intelligence docs
│   ├── vision.md
│   ├── mechanics.md
│   ├── ux-flow.md
│   └── blueprints/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Design Intelligence Integration

This template follows the vibecoding workspace philosophy:

### 1. Design Before Code
Create blueprints in `/docs/blueprints/` before implementing features.

### 2. Research Before Design
Document research in `/docs/research/` before creating designs.

### 3. Layer-Based Reasoning
Always reason through the Design Intelligence Stack:
1. **Experience Intent** - Why does this exist?
2. **Player Psychology** - How should it feel?
3. **Core Loop** - What's the repeating interaction?
4. **Systems** - How do mechanics interconnect?
5. **Implementation** - The actual code

## Adding New Scenes

```typescript
// src/scenes/MyNewScene.ts
import { Scene, Engine } from 'excalibur'

export class MyNewScene extends Scene {
  onInitialize(engine: Engine): void {
    // Setup scene
  }

  onActivate(): void {
    // Scene activated
  }

  onDeactivate(): void {
    // Scene deactivated, cleanup
  }
}

// In main.ts
import { MyNewScene } from './scenes/MyNewScene'

game.addScene('my-scene', new MyNewScene())
game.goToScene('my-scene')
```

## State Management Pattern

```typescript
// Define state interface
interface GameData {
  score: number
}

// Define actions
interface GameActions {
  incrementScore: (amount: number) => void
}

// Create store
export const useGameStore = create<GameData & GameActions>()(
  persist(
    (set) => ({
      score: 0,
      incrementScore: (amount) =>
        set((state) => ({ score: state.score + amount })),
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => createIndexedDBStorage()),
    }
  )
)

// Use in components
const { score, incrementScore } = useGameStore()
```

## Procedural Generation

```typescript
import { FastNoiseLite } from 'fast-noise-lite'

// Create noise generator
const noise = new FastNoiseLite()
noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin)
noise.SetSeed(12345)

// Generate terrain
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    const value = noise.GetNoise(x, y)
    // Use value to determine terrain type
  }
}
```

## Asset Generation

Use the workspace's procedural generation tools:

```typescript
import { generateSprite } from '@/tools/procedural-generation/pixel-art-engine'

// Generate a sprite procedurally
const sprite = generateSprite({
  width: 32,
  height: 32,
  seed: 'unique-identifier',
  palette: ['#ff0000', '#00ff00', '#0000ff'],
})
```

## Performance Optimization

### Pixel-Perfect Rendering
```typescript
// Already configured in vite.config.ts
const game = new Engine({
  antialiasing: false,
  pixelArt: true,
})
```

### Asset Preloading
```typescript
// Load assets before game starts
const loader = new Loader([sprite1, sprite2, sound1])
await game.start(loader)
```

### Object Pooling
```typescript
// Reuse objects instead of creating new ones
class BulletPool {
  private pool: Bullet[] = []

  get(): Bullet {
    return this.pool.pop() || new Bullet()
  }

  release(bullet: Bullet): void {
    this.pool.push(bullet)
  }
}
```

## Testing Offline Mode

1. Build the project: `npm run build`
2. Preview: `npm run preview`
3. Open DevTools → Application → Service Workers
4. Check "Offline" mode
5. Reload - game should work offline!

## Deployment

### GitHub Pages
```bash
# Build with correct base path
vite build --base=/my-game/

# Deploy dist/ folder to gh-pages branch
```

### Netlify / Vercel
- Connect repository
- Build command: `npm run build`
- Publish directory: `dist`

## Next Steps

1. **Define Your Game** - Create `/docs/vision.md`
2. **Design Core Loop** - Create `/docs/core-loop.md`
3. **Create Blueprints** - Plan your systems in `/docs/blueprints/`
4. **Implement** - Follow blueprints exactly
5. **Test Offline** - Ensure PWA works correctly

## Resources

- [Excalibur.js Documentation](https://excaliburjs.com/)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [FastNoiseLite Docs](https://github.com/Auburn/FastNoiseLite)

## License

This template is part of the Ultimate Cursor Vibecoding Workspace.
Use freely for any project!
