# Architecture Index

**Authority Tier**: 2 (Mandatory Process)
**Last Updated**: 2025-12-24
**Purpose**: Navigate critical architecture files for implementation tasks

---

## Purpose

**When to use**: Implementation tasks, code architecture, system design

**DO NOT** scan entire `/src/` directory. Use this index to find critical files.

---

## Critical Architecture Files

Load these files when implementing features:

### 1. Framework Constraints
**File**: `.cursorrules`
**Lines**: 311 total
**Critical Sections**:
- Lines 22-29: Framework constraints (PWA-first, TypeScript, Tailwind)
- Lines 104-121: Quality gates (no placeholders, zero warnings)
- Lines 270-289: Asset handling rules

**When**: Every implementation task
**Why**: Tier 1 laws that cannot be violated

---

### 2. System Architecture Blueprints

**Directory**: `docs/blueprints/system-*.md`

**Key Blueprints**:
- `system-state-management.md` - Centralized state
- `system-event-bus.md` - Event-driven architecture
- `system-asset-loading.md` - Asset management
- `system-offline-sync.md` - PWA offline capabilities

**When**: Building new systems or features
**Why**: Defines architectural patterns to follow

---

### 3. Architecture Gate

**File**: `gates/architecture-gate.md`
**Critical Checks**:
- System coupling limit (≤ 3 dependencies)
- Core loop definition (< 60 seconds)
- State centralization
- Event-driven architecture

**When**: Before any system implementation
**Why**: Validates architectural compliance

---

## Architecture Principles

Load these when making architectural decisions:

### Principle 1: PWA-First Architecture
**Source**: `.cursorrules` lines 22-29
**Rules**:
- All assets local (no external CDNs)
- Offline-capable by design
- Progressive enhancement
- Service worker integration
- Installable on all platforms

### Principle 2: Event-Driven Design
**Source**: `docs/blueprints/system-event-bus.md`
**Rules**:
- Systems communicate via events
- No direct system-to-system calls
- Pub/sub pattern throughout
- Event logging for debugging
- Loose coupling enforced

### Principle 3: Centralized State
**Source**: `docs/blueprints/system-state-management.md`
**Rules**:
- Single source of truth
- Immutable state updates
- State changes via actions/events only
- No local component state for global data
- Time-travel debugging support

### Principle 4: Component Modularity
**Rules**:
- Each component does ONE thing
- Clear interfaces
- No circular dependencies
- Dependency injection where needed
- Components testable in isolation

---

## System Boundaries & Contracts

### Core Systems Map

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  ┌──────────┐  ┌──────────┐            │
│  │ UI Layer │  │ Game Loop│            │
│  └────┬─────┘  └────┬─────┘            │
│       │             │                   │
├───────┼─────────────┼───────────────────┤
│       │   Event Bus │                   │
│  ┌────▼─────────────▼─────┐            │
│  │   State Management      │            │
│  └────┬───────────┬────────┘            │
│       │           │                     │
├───────┼───────────┼─────────────────────┤
│  ┌────▼────┐ ┌───▼──────┐              │
│  │ Systems │ │  Assets  │              │
│  │ Layer   │ │  Layer   │              │
│  └─────────┘ └──────────┘              │
│                                         │
└─────────────────────────────────────────┘
```

**Critical Files for Each Layer**:

**UI Layer**:
- `src/components/` - Reusable UI components
- `src/screens/` - Screen-level components
- `docs/blueprints/ux-*.md` - UX blueprints

**Game Loop** (if applicable):
- `src/game/core-loop.ts` - Main game loop
- `src/game/update.ts` - Update logic
- `src/game/render.ts` - Render logic

**Event Bus**:
- `src/systems/event-bus.ts` - Central event dispatcher
- `src/types/events.ts` - Event type definitions

**State Management**:
- `src/store/` - State store implementation
- `src/reducers/` - State reducers
- `src/actions/` - Action creators

**Systems Layer**:
- `src/systems/` - All game/app systems
- Each system in own file

**Assets Layer**:
- `src/assets/` - All assets (sprites, audio, fonts)
- `src/assets/manifest.json` - Asset manifest
- `asset-system/ASSET_REGISTRY.md` - Registry

---

## Integration Points

### How Systems Integrate

**Rule**: Systems MUST communicate via event bus

**Anti-Pattern** (Direct Coupling):
```typescript
// ❌ BAD - Direct system dependency
class FusionSystem {
  constructor(private collectionSystem: CollectionSystem) {}

  fusePets() {
    this.collectionSystem.removePet(petId); // Direct call!
  }
}
```

**Correct Pattern** (Event-Driven):
```typescript
// ✅ GOOD - Event-driven integration
class FusionSystem {
  constructor(private eventBus: EventBus) {}

  fusePets() {
    this.eventBus.emit('pet:fused', { petId, result });
    // CollectionSystem listens for 'pet:fused' and handles removal
  }
}
```

**Integration File**:
- `docs/blueprints/system-integration-map.md` - System interaction diagram

---

## State Management Contract

### State Structure
**File**: `src/store/types.ts`

```typescript
interface AppState {
  // UI state
  ui: {
    currentScreen: string;
    modals: Modal[];
    loading: boolean;
  };

  // Game state (if applicable)
  game: {
    pets: Pet[];
    inventory: Item[];
    player: Player;
  };

  // System state
  systems: {
    fusion: FusionState;
    collection: CollectionState;
    progression: ProgressionState;
  };
}
```

### State Update Rules

**File**: `docs/blueprints/system-state-management.md`

**Rules**:
1. **Immutable updates** - Always return new state
2. **Action-based** - State changes via dispatched actions only
3. **Single source** - No duplicate data across state tree
4. **Serializable** - All state must be JSON-serializable
5. **Time-travel** - State history for debugging

**Example**:
```typescript
// ✅ GOOD - Immutable update
function fusionReducer(state: FusionState, action: Action): FusionState {
  switch (action.type) {
    case 'FUSION_START':
      return {
        ...state,
        inProgress: true,
        selectedPets: action.payload.pets
      };

    default:
      return state;
  }
}
```

---

## Asset Loading Architecture

### Asset Loading Contract
**File**: `docs/blueprints/system-asset-loading.md`

**Rules**:
1. All assets loaded via registry
2. Lazy loading for non-critical assets
3. Preloading for critical assets
4. Asset unloading when unused
5. Loading state tracking

**Asset Manifest**:
**File**: `src/assets/manifest.json`

```json
{
  "critical": [
    "ASSET-2025-001",
    "ASSET-2025-010"
  ],
  "lazy": [
    "ASSET-2025-050"
  ]
}
```

**Loading Implementation**:
**File**: `src/systems/asset-loader.ts`

---

## TypeScript Architecture

### Type Definitions
**Directory**: `src/types/`

**Critical Type Files**:
- `src/types/game.ts` - Game entity types
- `src/types/ui.ts` - UI component types
- `src/types/events.ts` - Event type definitions
- `src/types/state.ts` - State tree types
- `src/types/assets.ts` - Asset types

**Rule**: No `any` types allowed (.cursorrules line 110)

### Interface Contracts
**Pattern**: Always define interfaces for system boundaries

```typescript
// System interface
interface IFusionSystem {
  fusePets(pet1: Pet, pet2: Pet, options?: FusionOptions): Promise<FusionResult>;
  validateFusion(pet1: Pet, pet2: Pet): ValidationResult;
  calculateRarity(parent1: Pet, parent2: Pet): number;
}

// Implementation
class FusionSystem implements IFusionSystem {
  // Must implement all interface methods
}
```

---

## Performance Architecture

### Core Loop Performance
**File**: `docs/blueprints/system-performance.md`

**Requirements**:
- Core loop: 60 FPS (16.67ms per frame)
- State updates: < 1ms
- Render: < 10ms
- Event handling: < 1ms
- Asset loading: Non-blocking

**Critical Sections**:
- `src/game/update.ts` - Performance-critical update logic
- `src/game/render.ts` - Performance-critical render logic

### Bundle Size Architecture
**Target**: < 500 KB initial bundle (gzipped)

**Splitting Strategy**:
- `main.bundle.js` - Core app (< 200 KB)
- `game.bundle.js` - Game logic (< 150 KB)
- `ui.bundle.js` - UI components (< 100 KB)
- `assets.bundle.js` - Asset loading (< 50 KB)

**File**: `webpack.config.js` or build configuration

---

## Testing Architecture

### Test Structure
**Directory**: `tests/`

**Test Categories**:
- `tests/unit/` - Unit tests (individual functions)
- `tests/integration/` - Integration tests (system interactions)
- `tests/e2e/` - End-to-end tests (full workflows)

**Coverage Requirements**:
- Core systems: 90%+ coverage
- UI components: 70%+ coverage
- Utilities: 95%+ coverage

### Test Contracts
**File**: `docs/blueprints/system-testing-strategy.md`

**Rules**:
- All systems must have test suites
- All public APIs must be tested
- Edge cases must be covered
- Tests run in CI/CD before merge

---

## Error Handling Architecture

### Error Boundaries
**File**: `src/errors/error-boundary.tsx`

**Hierarchy**:
```
App
└── ErrorBoundary (top-level)
    ├── Screen ErrorBoundary
    │   └── Component ErrorBoundary
```

### Error Logging
**File**: `src/systems/error-logger.ts`

**Contract**:
```typescript
interface ErrorLog {
  timestamp: Date;
  error: Error;
  context: {
    component?: string;
    system?: string;
    state?: Partial<AppState>;
  };
  severity: 'critical' | 'error' | 'warning';
}
```

**Rule**: All errors logged, critical errors reported

---

## Accessibility Architecture

### A11y Requirements
**Source**: `.cursorrules` lines 113-115

**Rules**:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader support
- Focus management
- Color contrast compliance (WCAG AA)

**File**: `docs/blueprints/system-accessibility.md`

---

## Deployment Architecture

### PWA Architecture
**Files**:
- `public/manifest.json` - PWA manifest
- `public/service-worker.js` - Service worker
- `public/icons/` - PWA icons (various sizes)

**Requirements**:
- Lighthouse PWA score: 90+
- Offline functionality
- Install prompt
- App-like experience

### Build Architecture
**File**: Build configuration (webpack/vite/etc.)

**Targets**:
- Development: Fast rebuild, source maps
- Production: Minified, tree-shaken, optimized
- Staging: Production-like with debug symbols

---

## Migration & Versioning

### Version Strategy
**File**: `docs/architecture/versioning-strategy.md`

**Semantic Versioning**: MAJOR.MINOR.PATCH
- MAJOR: Breaking API changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Data Migration
**File**: `docs/architecture/data-migration.md`

**Strategy**:
- Version all state schemas
- Provide migration functions
- Graceful fallback for old data
- Test migrations thoroughly

---

## Quick Reference: Task → Files

### "Implement new system"
1. Load: `.cursorrules`
2. Load: `gates/architecture-gate.md`
3. Load: `docs/blueprints/system-[name].md` (if exists)
4. Create system in: `src/systems/[name].ts`
5. Integrate via: Event bus
6. Validate: Architecture gate

### "Implement new UI component"
1. Load: `.cursorrules`
2. Load: `docs/blueprints/ux-*.md`
3. Check: `src/components/` for reusable components
4. Create in: `src/components/[name].tsx`
5. Style with: Tailwind CSS
6. Validate: Quality gate, Complexity gate

### "Add new asset"
1. Load: `asset-system/ASSET_REGISTRY.md`
2. Search: Registry for existing assets
3. If not found: Follow ingestion protocol
4. Place in: `src/assets/[category]/`
5. Register: In registry
6. Validate: Asset gate

### "Modify state structure"
1. Load: `docs/blueprints/system-state-management.md`
2. Load: `src/types/state.ts`
3. Update: Type definitions
4. Update: Reducers
5. Provide: Migration if breaking
6. Test: State transitions

---

## Related Indexes

- **[[MASTER_INDEX.md]]** - Top-level navigation
- **[[DESIGN_INDEX.md]]** - Design intelligence layers
- **[[TOOL_INDEX.md]]** - Development tools
- **[[PROTOCOL_INDEX.md]]** - Implementation protocol

---

## Gates Required for Implementation

Before outputting code:

1. **Architecture Gate** - System design validation
2. **Complexity Gate** - Simplicity enforcement
3. **Quality Gate** - Zero-tolerance quality
4. **Blueprint Gate** - Design exists before code

All gates must pass. Gates are locks, not warnings.

---

## Notes

- **These files define the architecture** - don't guess, read them
- **Event-driven is mandatory** - no direct system coupling
- **PWA-first is non-negotiable** - offline must work
- **TypeScript strict mode** - no `any` types
- **Indexes compress complexity** - use them

**Architecture is not optional. It's the foundation.**

**Load these files. Follow the contracts. Execute with gates.**
