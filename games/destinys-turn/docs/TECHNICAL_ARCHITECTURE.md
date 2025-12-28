# Destiny's Turn: Technical Architecture

## 1. Tech Stack
*   **Core**: React 19 + TypeScript 5.x
*   **Build Tool**: Vite
*   **State Management**: Zustand (with Immer middleware for complex nested updates)
*   **Styling**: Tailwind CSS (for layout) + Custom CSS Modules (for specialized effects)
*   **Animation**: Framer Motion (crucial for "living board" feel)
*   **Logic Engine**: Custom "Reaction Queue" system.

---

## 2. Data Schema (Core Types)

### The Board
```typescript
type Coordinate = { x: number; y: number };

type TileType = 'WATER' | 'LAND' | 'VINE' | 'CARNIVAL' | 'EMPTY';

interface Tile {
  id: string;
  position: Coordinate;
  type: TileType;
  state: 'NORMAL' | 'FLOODED' | 'BURNING' | 'LOCKED';
  contents: WorldObject[];
}

interface WorldObject {
  id: string;
  type: 'RELIC' | 'BOSS' | 'RABBIT' | 'HAZARD';
  subType: string; // e.g., 'RELIC_SHIP_MARKER'
  ownerId?: string; // Player who placed it
}
```

### The Game State (Zustand Store)
```typescript
interface GameState {
  // Global
  theme: ThemeType;
  worldState: WorldStateType; // Calm, Storm, etc.
  turnCount: number;
  activePlayerId: string;
  
  // Boards
  circlePosition: Record<string, number>; // PlayerId -> Index (0-39)
  squareGrid: Tile[][]; // 8x8 Grid
  
  // Entities
  players: Record<string, Player>;
  bosses: Boss[];
  rabbit: { position: Coordinate; isCaught: boolean };
  
  // Systems
  messageLog: LogEntry[];
  reactionQueue: GameEvent[]; // For resolving world effects step-by-step
}
```

---

## 3. Systems Architecture

### A. The "World Turn" Engine (Reaction Queue)
Since the board reacts *after* player input, we need a queue system to visualize changes.
1.  **Phase 1: Player Input**: Player updates state (places Relic).
2.  **Phase 2: Calculation**: Engine calculates resulting effects (Relic placement -> triggers Boss aggro -> triggers Tide).
3.  **Phase 3: Enqueue**: These effects are pushed to `reactionQueue`.
4.  **Phase 4: Playback**: The UI consumes the queue, playing animations one by one (Tide rises -> Boss moves -> Tile cracks).

### B. The Theme System (Strategy Pattern)
Themes shouldn't just be data; they are logic.
```typescript
interface ThemeLogic {
  id: string;
  onTurnStart: (grid: Grid) => GameEvent[];
  onRelicPlaced: (grid: Grid, relic: Relic) => GameEvent[];
  getTerrainMap: () => TileType[][]; // Procedural generation logic
}
```
We will create a `ThemeRegistry` that swaps the active logic when the Master Die triggers.

### C. The Grid System
*   **Coordinate System**: Standard (x, y) 0-7.
*   **Adjacency Logic**: Helper functions to determine "Line of Effect".
    *   `getNeighbors(pos)`
    *   `getLineOfSight(start, end)`
    *   `getFloodFill(start, type)` (for fluid dynamics like water/fire)

---

## 4. UI/UX Architecture

### Layout Strategy: "The Split View"
*   **Left Panel (30%)**: The **Circle** (Abstract representation, linear or circular track). Player controls here.
*   **Right Panel (70%)**: The **Square** (Immersive 3D/Isometric view). The "Stage".
*   **Overlay**: Master Dice & Turn Controls.

### Visual feedback
*   **Tile Transitions**: When Theme shifts, tiles shouldn't just snap; they should "flip" or "morph" (Framer Motion `layoutId`).
*   **Relic Connecting**: Visual lines connecting Player -> Relic -> Target to show "Reach".

---

## 5. File Structure
```
src/
├── assets/          # Images, Icons
├── components/      # React Components
│   ├── circle/      # Outer board components
│   ├── square/      # Inner grid components
│   ├── ui/          # HUD, Dialogs, Cards
│   └── effects/     # Particle effects, Overlays
├── hooks/           # Custom hooks (useGameLoop, useGrid)
├── logic/           # Pure game logic (No UI)
│   ├── themes/      # Theme definitions (Ocean, Carnival...)
│   ├── bosses/      # Boss AI
│   └── grid/        # Adjacency, pathfinding
├── store/           # Zustand stores
├── types/           # TypeScript definitions
└── utils/           # Math, Random, Formatting
```
