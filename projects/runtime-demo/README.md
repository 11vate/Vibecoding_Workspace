# Runtime Generation Demo

This project demonstrates how a game (or any other application) can import the Content System to generate assets **at runtime**.

## Key Concepts

1.  **Pure Logic**: The game imports `SpriteLogic` (from `src/content/generators/logic/SpriteLogic`), which has **zero dependencies** on Node.js-specific packages like `fs` or `canvas`.
2.  **Runtime Config**: The game provides a seed (e.g., `Date.now()`) and a config object.
3.  **Client-Side Rendering**: The generator returns a **Schema** (JSON data: pixels, palette). The game is responsible for rendering this schema to the screen (e.g., using HTML5 Canvas, WebGL, or Unity).

## How to Run

```bash
tsx projects/runtime-demo/game_simulation.ts
```

## Integration Example

```typescript
import { SpriteLogic } from '@vibecoding/content-system'; // Hypothetical package alias

const gen = new SpriteLogic();
const schema = gen.generate(12345, { ...config });

// Render schema.pixels to your game canvas
```
