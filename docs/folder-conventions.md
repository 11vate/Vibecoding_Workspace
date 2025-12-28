# Folder Conventions

## Purpose

Standard folder structure ensuring consistency, maintainability, and clear organization across all projects.

**Consistent structure enables navigation and understanding.**

---

## Enhanced Folder Structure

```
src/
├── core/              # Core systems (existing)
│   ├── loop.ts        # Main game/app loop
│   ├── state/         # State management
│   ├── systems/       # Core systems
│   └── events/        # Event system
├── systems/           # Feature systems (new)
│   ├── inventory/     # Inventory system
│   ├── combat/        # Combat system
│   └── progression/   # Progression system
├── mechanics/         # Game/app mechanics (new)
│   ├── fusion/        # Fusion mechanic
│   ├── collection/    # Collection mechanic
│   └── crafting/      # Crafting mechanic
├── ui/                # UI components (existing)
│   ├── components/    # Reusable components
│   ├── screens/       # Screen components
│   └── layouts/       # Layout components
├── logic/             # Business logic (existing)
│   ├── rules/         # Game/app rules
│   ├── calculations/  # Calculations
│   └── validators/    # Validators
├── assets/            # Asset registry (existing)
│   ├── index.ts       # Asset registry
│   ├── sprites/       # Sprite assets
│   └── audio/         # Audio assets
├── data/              # Data structures (new)
│   ├── models/        # Data models
│   ├── schemas/       # Data schemas
│   └── types/         # Type definitions
├── events/            # Event system (existing)
│   ├── bus.ts         # Event bus
│   ├── types.ts       # Event types
│   └── handlers/      # Event handlers
├── state/             # State management (existing)
│   ├── store.ts       # State store
│   ├── reducers/      # State reducers
│   └── selectors/     # State selectors
└── utils/             # Utilities (new)
    ├── helpers/       # Helper functions
    ├── constants/     # Constants
    └── validators/    # Validation utilities
```

---

## Folder Rules

### Core Folder

**Purpose**: Core systems that every project needs.

**Contents**:
- Game/app loop
- State management
- Core systems
- Event system

**Rules**:
- Only core systems
- No feature-specific code
- Reusable across projects

---

### Systems Folder

**Purpose**: Feature-specific systems.

**Contents**:
- Feature systems
- System modules
- System logic

**Rules**:
- One folder per system
- Self-contained modules
- Clear boundaries

---

### Mechanics Folder

**Purpose**: Game/app mechanics.

**Contents**:
- Mechanic implementations
- Mechanic logic
- Mechanic data

**Rules**:
- One folder per mechanic
- Mechanic-specific code only
- Clear interfaces

---

### UI Folder

**Purpose**: User interface components.

**Contents**:
- UI components
- Screen components
- Layout components

**Rules**:
- Component-based structure
- Reusable components
- Clear component hierarchy

---

### Logic Folder

**Purpose**: Business logic.

**Contents**:
- Game/app rules
- Calculations
- Validators

**Rules**:
- Pure functions preferred
- Deterministic logic
- Testable code

---

### Assets Folder

**Purpose**: Asset management.

**Contents**:
- Asset registry
- Asset files
- Asset utilities

**Rules**:
- Registry-based access
- No direct paths
- Symbolic references

---

### Data Folder

**Purpose**: Data structures and models.

**Contents**:
- Data models
- Data schemas
- Type definitions

**Rules**:
- Type-safe structures
- Clear schemas
- Documented models

---

### Events Folder

**Purpose**: Event system.

**Contents**:
- Event bus
- Event types
- Event handlers

**Rules**:
- Centralized event bus
- Typed events
- Clear event flow

---

### State Folder

**Purpose**: State management.

**Contents**:
- State store
- State reducers
- State selectors

**Rules**:
- Centralized state
- Immutable updates
- Clear state structure

---

### Utils Folder

**Purpose**: Utility functions.

**Contents**:
- Helper functions
- Constants
- Validators

**Rules**:
- Pure functions
- Reusable utilities
- Well-documented

---

## Naming Conventions

### Folders

**Convention**: kebab-case

**Examples**:
- `inventory-system`
- `combat-system`
- `progression-system`

---

### Files

**Convention**: kebab-case for files, PascalCase for classes

**Examples**:
- `inventory-system.ts`
- `InventorySystem.ts` (class file)

---

### Exports

**Convention**: Named exports preferred

**Examples**:
```typescript
export class InventorySystem { ... }
export function calculateScore() { ... }
```

---

## Integration Points

### .cursorrules
- Conventions enforced in .cursorrules
- Automated checks
- Quality gates

### Knowledge Base
- Conventions documented
- Patterns referenced
- Best practices shared

---

**These conventions ensure consistent, maintainable project structure.**


