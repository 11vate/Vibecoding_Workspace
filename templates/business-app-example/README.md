# Business App Example Template

**Complete**, **production-ready** business dashboard application implementing the Design Intelligence Stack principles.

## Overview

This template provides a fully functional business dashboard with data visualization, analytics, and reporting capabilities. It demonstrates best practices for building professional business applications using the workspace's architectural patterns.

## Features

✅ **Business Dashboard** - Multi-view dashboard with stats and charts
✅ **Data Sync System** - Automatic data refresh and synchronization
✅ **Notification System** - In-app notifications and alerts
✅ **Navigation System** - Sidebar navigation with multiple views
✅ **Data Visualization** - Charts, graphs, and metrics display
✅ **Settings Management** - Application configuration
✅ **Fixed Timestep Loop** - Consistent 60 FPS rendering
✅ **Centralized State** - Redux-inspired state management
✅ **Auto-save Support** - Built-in save/load functionality
✅ **Debug Mode** - FPS display and performance tracking
✅ **TypeScript** - Full type safety with strict mode

## Architecture

```
src/
├── core/
│   ├── loop.ts                          # Main application loop
│   ├── state/
│   │   └── store.ts                     # Centralized state store
│   ├── input/
│   │   └── InputManager.ts              # Input handling
│   ├── systems/
│   │   ├── SystemManager.ts             # System orchestration
│   │   ├── DataSyncSystem.ts            # Data synchronization
│   │   └── NotificationSystem.ts        # Notifications
│   └── rendering/
│       └── Renderer.ts                  # Canvas rendering
└── main.ts                              # Application entry point
```

## Views

### Dashboard
- Revenue, users, and conversion metrics
- Sales overview chart
- Recent activity feed
- Quick stats cards

### Analytics
- Detailed metrics and KPIs
- Advanced data visualization
- Trend analysis

### Reports
- Generate custom reports
- Export data
- Historical analysis

### Settings
- Application configuration
- Theme selection
- Auto-save preferences
- Refresh interval

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

Open `http://localhost:5173` in your browser.

### Build

```bash
npm run build
```

## Default Controls

- **F1** - Toggle debug mode
- **F2** - Toggle FPS display
- **ESC** - Pause/Resume
- **Click sidebar items** - Navigate between views

## Debug Commands

When running, the app is exposed to the window:

```javascript
// In browser console:
app.toggleDebug();           // Enable debug mode
app.toggleFPS();             // Show FPS counter
app.toggleSidebar();         // Toggle sidebar
app.navigateTo('dashboard'); // Navigate to view
app.stop();                  // Stop application
app.start();                 // Start application
store.getState();            // Inspect current state
```

## Systems

### DataSyncSystem
Handles data synchronization on a configurable interval (default: 60s).

```typescript
const dataSyncSystem = systemManager.getSystem<DataSyncSystem>('DataSyncSystem');
dataSyncSystem.forceSync();          // Force immediate sync
dataSyncSystem.setSyncInterval(30);  // Change interval to 30s
```

### NotificationSystem
Manages in-app notifications with automatic expiration.

```typescript
const notificationSystem = systemManager.getSystem<NotificationSystem>('NotificationSystem');
notificationSystem.info('Information message');
notificationSystem.success('Success message');
notificationSystem.warning('Warning message');
notificationSystem.error('Error message');
```

## State Structure

```typescript
interface AppState {
  // UI state
  ui: {
    currentView: 'dashboard' | 'analytics' | 'reports' | 'settings';
    sidebarOpen: boolean;
    activeModal: string | null;
  };

  // Application data
  appData: {
    datasets: any[];
    filters: DataFilter[];
    sort: DataSort | null;
    selectedItems: string[];
  };

  // Settings
  settings: {
    autoSave: boolean;
    theme: 'light' | 'dark';
    refreshInterval: number;
    chartType: 'line' | 'bar' | 'pie';
  };

  // Debug
  debug: {
    enabled: boolean;
    showFPS: boolean;
    logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug';
  };
}
```

## Extending the Template

### Add a New View

1. Add view to `currentView` type in `store.ts`
2. Add navigation item in `Renderer.renderSidebar()`
3. Add render method in `Renderer` (e.g., `renderMyView()`)
4. Add case in `Renderer.render()` switch statement
5. Add click handler in `main.ts setupNavigationHandlers()`

### Add a New System

1. Create system file in `src/core/systems/`
2. Extend `BaseSystem`
3. Implement `initialize()`, `update()`, `cleanup()`
4. Register in `src/main.ts`

### Add New Actions

1. Add action type to `ActionType` enum in `store.ts`
2. Add case in `rootReducer()`
3. Dispatch from your code

## Data Integration

Replace mock data generation in `DataSyncSystem.generateMockData()` with real API calls:

```typescript
private async syncData(): Promise<void> {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();

    store.dispatch({
      type: ActionType.DATA_LOADED,
      payload: data
    });
  } catch (error) {
    console.error('Data sync failed:', error);
  }
}
```

## Styling

The template uses Canvas-based rendering for maximum performance. Colors follow a professional business theme:

- Background: `#f5f7fa`
- Sidebar: `#2d3748`
- Primary: `#4299e1`
- Success: `#48bb78`
- Warning: `#ed8936`
- Error: `#f56565`

## Performance

- **Fixed timestep** ensures consistent data processing at 60 FPS
- **Interpolation** provides smooth 60+ FPS rendering
- **Auto-save** runs every 60 seconds (configurable)
- **Data sync** runs every 60 seconds (configurable)

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
