# Canonical Spine Template

**Complete**, **production-ready** application template implementing the Design Intelligence Stack principles.

## Overview

This template provides a fully functional application structure that follows the workspace's architectural patterns and quality standards. It's ready to use as a starting point for any game or interactive application.

## Features

✅ **Complete Core Loop** - Fixed timestep game loop with interpolation
✅ **Centralized State Management** - Redux-inspired store with actions and reducers
✅ **Input Management** - Keyboard, mouse, and touch support
✅ **System Architecture** - Priority-based system manager (ECS-inspired)
✅ **Rendering System** - Canvas-based renderer with interpolation
✅ **Example Systems** - Physics and Animation systems included
✅ **Example Components** - Button UI component
✅ **Auto-save Support** - Built-in save/load functionality
✅ **Debug Mode** - FPS display and performance tracking
✅ **TypeScript** - Full type safety with strict mode

## Architecture

```
src/
├── core/
│   ├── loop.ts                    # Main game loop (fixed timestep)
│   ├── state/
│   │   └── store.ts               # Centralized state store
│   ├── input/
│   │   └── InputManager.ts        # Input handling
│   ├── systems/
│   │   ├── SystemManager.ts       # System orchestration
│   │   ├── PhysicsSystem.ts       # Example physics system
│   │   └── AnimationSystem.ts     # Example animation system
│   └── rendering/
│       └── Renderer.ts            # Canvas rendering
├── ui/
│   └── components/
│       └── Button.ts              # Example UI component
└── main.ts                        # Application entry point
```

## Core Loop Structure

The canonical spine follows a **fixed timestep** loop with 4 phases:

1. **Input** - Process user input events
2. **Update** - Update systems and state (fixed timestep)
3. **Side Effects** - Handle saves, network, analytics
4. **Render** - Render with interpolation for smooth visuals

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Default Controls

- **F1** - Toggle debug mode
- **F2** - Toggle FPS display
- **ESC** - Pause/Resume

## Debug Commands

When running, the app is exposed to the window:

```javascript
// In browser console:
app.toggleDebug();       // Enable debug mode
app.toggleFPS();         // Show FPS counter
app.stop();              // Stop application
app.start();             // Start application
store.getState();        // Inspect current state
```

## Extending the Template

### Add a New System

1. Create system file in `src/core/systems/`
2. Extend `BaseSystem`
3. Register in `src/main.ts`

### Add New Actions

1. Add action type to `ActionType` enum in `store.ts`
2. Add case in `rootReducer()`
3. Dispatch from your code

### Add New UI Component

1. Create component file in `src/ui/components/`
2. Implement `update()` and `render()` methods
3. Instantiate and use in your systems

## Quality Gates

This template passes all 8 workspace quality gates:

✅ Complexity Gate - All functions < 10 complexity
✅ Quality Gate - No placeholders, strict TypeScript
✅ Architecture Gate - Proper layer separation
✅ Blueprint Gate - Follows canonical structure
✅ Asset Gate - Assets properly registered
✅ Reuse Gate - DRY principles followed
✅ Asset Sourcing - Proper asset handling
✅ Content Integrity - Consistent patterns

## License

Part of the Ultimate Design Intelligence Workspace.


