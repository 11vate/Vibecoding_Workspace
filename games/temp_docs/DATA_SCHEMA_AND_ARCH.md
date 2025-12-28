# Destiny's Turn: Data Schema & Architecture

## 1. Core State Entities

### The World State (Zustand Store)
This is the single source of truth for the session.

```typescript
interface GameState {
  // --- Macro State ---
  sessionId: string;
  turnCount: number;
  activePlayerId: string;
  phase: 'PLAYER_MOVE' | 'PLAYER_ACTION' | 'SQUARE_REACTION' | 'THEME_SHIFT_ANIMATION';
  
  // --- The Dice ---
  masterDieA: ThemeType; // e.g., 'OCEAN', 'CARNIVAL'
  masterDieB: StateType; // e.g., 'STORM', 'CALM'
  
  // --- The Boards ---
  circle: CircleState;
  square: SquareState;
  
  // --- Entities ---
  players: Record<string, Player>;
  rabbit: RabbitState;
  bosses: Boss[];
}
```

---

## 2. The Square (The Living Grid)

The Square is the most complex data structure. It's not just a 2D array of strings; it's a collection of active objects.

```typescript
interface SquareState {
  grid: Tile[][]; // 8x8 matrix
  dimensions: { width: 8, height: 8 };
}

interface Tile {
  id: string; // Unique ID (e.g., "tile-3-4")
  coordinates: { x: number, y: number };
  
  // --- Visual & Thematic ---
  baseType: TerrainType; // Derived from current Theme (e.g., 'WATER_DEEP')
  visualVariant: number; // 0-3 for visual noise
  
  // --- Mechanics ---
  isWalkable: boolean;
  movementCost: number;
  hazards: HazardEffect[]; // e.g., ['FIRE', 'SLIPPERY']
  
  // --- Occupants ---
  relicId: string | null; // ID of embedded relic
  bossId: string | null;
  rabbitCameo: boolean; // Is the rabbit hiding here?
  
  // --- Dynamic State ---
  rotation: 0 | 90 | 180 | 270;
  heightLevel: number; // For 3D visualization or logic
}
```

---

## 3. Themes & Transformations

Themes are **Configuration Objects**, not state. They act as "lenses" that interpret the data.

```typescript
interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  
  // --- Tile Mapping ---
  // How the generic grid interprets terrain
  terrainMap: Record<GenericTerrainId, SpecificTerrainProps>;
  
  // --- Relic Mutation ---
  // How a generic relic behaves in this theme
  relicMutations: Record<BaseRelicType, RelicBehaviorOverride>;
  
  // --- Boss Data ---
  bossType: BossType;
  
  // --- Visuals ---
  palette: ColorPalette;
  musicTrack: string;
}

// Example: How a "Blocker" relic changes
// Ocean: "Buoy" (Floats, moves with tide)
// Jungle: "Thorn Bush" (Stationary, hurts adjacent)
```

---

## 4. Relics (The Bridge)

Relics are persistent data objects that "wear" different logic based on the theme.

```typescript
interface Relic {
  id: string;
  ownerId: string; // Player who placed it
  baseType: 'BLOCKER' | 'BRIDGE' | 'LURE' | 'TRAP' | 'BEACON';
  
  // --- Persistence ---
  durability: number; // Degrades on Theme Shift?
  experience: number; // Can relics level up? (Maybe later)
  
  // --- Current State ---
  position: { x: number, y: number };
  isActive: boolean;
}
```

---

## 5. The Circle (The Player Path)

```typescript
interface CircleState {
  spaces: CircleSpace[];
  totalSpaces: number; // ~32
}

interface CircleSpace {
  index: number;
  type: 'RESOURCE' | 'EVENT' | 'GATE_A' | 'GATE_B' | 'RELIC_DEPOSIT' | 'RABBIT_RUMOR';
  
  // --- Space Specifics ---
  resourceYield?: { material: number, favor: number };
  gateTarget?: 'THEME' | 'STATE';
  flavorText: string;
}
```

---

## 6. The Player

```typescript
interface Player {
  id: string;
  name: string;
  persona: 'PYROMANCER' | 'THIEF' | 'GAMBLER' | 'WHISPERER';
  color: string;
  
  // --- Position ---
  circlePosition: number; // 0-31
  
  // --- Inventory ---
  materials: number;
  favors: number;
  relicsInHand: BaseRelicType[];
  
  // --- Status ---
  charms: ActiveCharm[]; // Rabbit luck effects
}
```

---

## 7. The Reaction Engine (Architecture)

Since the Square "reacts" to the player, we need a command queue pattern.

**Flow**:
1.  Player performs actions (adds to `ActionQueue`).
2.  Player ends turn.
3.  **Resolver System** takes over:
    *   Reads `ActionQueue`.
    *   Checks `MasterDieB` (State) for global modifiers.
    *   Iterates through all `Tiles` and `Relics`.
    *   Generates a `ReactionBatch` (animations + state updates).
    *   Plays animations sequentially.
    *   Updates Game State.

```typescript
type GameAction = 
  | { type: 'MOVE_TILE', source: Coord, target: Coord }
  | { type: 'ROTATE_TILE', coord: Coord, degrees: number }
  | { type: 'SPAWN_HAZARD', coord: Coord, hazard: HazardType }
  | { type: 'BOSS_MOVE', bossId: string, path: Coord[] };
```
