# Detailed Implementation Roadmap

## Overview

This roadmap provides step-by-step implementation details for enhancing the AI Sprite Generator with features from the AI-Powered Sprite Generator Architecture PDF.

## Phase 1: Project Analysis & Scanning (Week 1-2)

### 1.1 Enhanced Project Scanner

**File:** `src/analysis/ProjectScanner.ts`

**Implementation:**
```typescript
export class ProjectScanner {
  async detectEngine(projectPath: string): Promise<GameEngine | null>
  async scanProject(projectPath: string): Promise<ProjectAnalysis>
  async findAssetReferences(projectPath: string): Promise<AssetReference[]>
}
```

**Engine Detection:**
- Unity: Check for `Assets/` folder, `ProjectSettings/`
- Godot: Check for `project.godot` file
- Phaser: Check for `package.json` with phaser dependency
- Custom: Generic detection based on structure

**Tasks:**
1. Implement engine detection logic
2. Create project structure parser
3. Integrate with existing asset registry
4. Test with Pixel Pets Reborn, Unity, Godot projects

### 1.2 Framework-Specific Parsers

**Phaser Parser:** `src/analysis/parsers/PhaserParser.ts`
- Extend existing `scanPhaserReferences` from asset-reference-scanner.ts
- Parse `load.image()`, `load.spritesheet()`, `anims.create()`
- Extract animation definitions and frame counts
- Detect sprite sheet dimensions from code

**Godot Parser:** `src/analysis/parsers/GodotParser.ts`
- Parse `.tscn` scene files (XML-like format)
- Extract `Sprite2D` and `AnimatedSprite2D` nodes
- Parse resource paths and animation definitions
- Extract sprite sheet metadata

**Unity Parser:** `src/analysis/parsers/UnityParser.ts`
- Parse `.meta` files for asset GUIDs
- Scan `.prefab` files (YAML format)
- Extract `SpriteRenderer` and `Image` component references
- Parse scene files for asset usage

**Generic Parser:** `src/analysis/parsers/GenericParser.ts`
- Pattern matching for common asset reference patterns
- File path detection (`assets/...`, `sprites/...`)
- Asset ID pattern matching
- Fallback when engine not detected

### 1.3 Missing Asset Detection

**File:** `src/analysis/MissingAssetDetector.ts`

**Implementation:**
```typescript
export class MissingAssetDetector {
  async detectMissing(
    references: AssetReference[],
    registry: AssetRegistry
  ): Promise<MissingAsset[]>
  
  async crossReference(
    projectPath: string,
    registry: AssetRegistry
  ): Promise<MissingAssetReport>
}
```

**Logic:**
1. Scan all code files for asset references
2. Check each reference against asset registry
3. Verify file existence on disk
4. Generate missing asset report
5. Infer asset specifications from code context

### 1.4 Asset Suggester

**File:** `src/analysis/MissingAssetSuggester.ts`

**Implementation:**
```typescript
export class MissingAssetSuggester {
  async suggestAssets(
    missing: MissingAsset[],
    projectContext: ProjectContext
  ): Promise<AssetSuggestion[]>
  
  async learnConventions(
    projectPath: string
  ): Promise<NamingConventions>
  
  async suggestAssetSet(
    baseAsset: MissingAsset
  ): Promise<AssetSetPlan>
}
```

**Features:**
- Learn naming conventions from existing assets
- Detect patterns (e.g., `player_walk_north`, `player_walk_south`)
- Suggest complete sets (8-directional movement, animation cycles)
- Generate prompt templates for one-click generation

**Example Suggestions:**
- "Game has `player_walk_north` but missing `player_walk_south`, `player_walk_east`, etc."
- "Code expects `enemy_idle` animation with 8 frames - generate now?"
- "Detected `GoblinAttack` method - suggest generating goblin attack animation?"

## Phase 2: Motion Transfer (Week 3-4)

### 2.1 Motion Extraction

**File:** `src/motion/MotionExtractor.ts`

**Implementation:**
```typescript
export class MotionExtractor {
  async extractFromSpriteSheet(
    spriteSheet: Buffer,
    frameWidth: number,
    frameHeight: number
  ): Promise<PoseSequence>
  
  async extractFromVideo(
    videoPath: string
  ): Promise<PoseSequence>
  
  async extractPoses(
    frames: Buffer[]
  ): Promise<Pose[]>
}
```

**Technology:**
- **OpenPose:** Extract 2D pose skeletons from images
- **MediaPipe:** Alternative pose detection (lighter weight)
- **Custom:** Simple pose estimation for pixel art

**Pose Format:**
```typescript
interface Pose {
  keypoints: Keypoint[];
  confidence: number;
  bounds: { x: number; y: number; width: number; height: number };
}

interface PoseSequence {
  poses: Pose[];
  timing: number[]; // milliseconds per frame
  loopable: boolean;
}
```

### 2.2 PoseCrafts Integration

**File:** `src/motion/PoseCraftsClient.ts`

**Implementation:**
```typescript
export class PoseCraftsClient {
  async generatePoseSequence(
    description: string,
    frameCount: number
  ): Promise<PoseSequence>
  
  async textToPoses(
    text: string,
    action: string
  ): Promise<Pose[]>
}
```

**Integration:**
- Use PoseCrafts project (GitHub: SupeemAFK/PoseCrafts)
- Text → OpenPose skeleton generation
- Generate pose sequences for animations
- Handle different action types (walk, run, attack, etc.)

### 2.3 ControlNet Integration

**File:** `src/generation/ControlNetManager.ts`

**Implementation:**
```typescript
export class ControlNetManager {
  async applyPoseControl(
    prompt: string,
    pose: Pose,
    baseImage?: Buffer
  ): Promise<Buffer>
  
  async generateWithControlNet(
    prompt: CompiledPrompt,
    controlType: 'openpose' | 'canny' | 'depth',
    controlImage: Buffer
  ): Promise<Buffer>
}
```

**ControlNet Types:**
- **OpenPose:** For character pose control
- **Canny:** For edge/outline control
- **Depth:** For 3D-like depth control

**Workflow:**
1. Generate or extract pose
2. Create ControlNet conditioning image
3. Generate frame with ControlNet + Stable Diffusion
4. Repeat for all frames
5. Ensure consistency via shared seed/LoRA

### 2.4 Motion Retargeting

**File:** `src/motion/MotionRetargeter.ts`

**Implementation:**
```typescript
export class MotionRetargeter {
  async transferMotion(
    referenceSequence: PoseSequence,
    targetSprite: GeneratedSprite,
    targetDescription: string
  ): Promise<GeneratedSprite[]>
  
  async maintainConsistency(
    frames: GeneratedSprite[],
    baseSprite: GeneratedSprite
  ): Promise<GeneratedSprite[]>
}
```

**Process:**
1. Extract motion from reference
2. Apply motion to target sprite description
3. Generate frames with ControlNet pose control
4. Use inpainting to maintain character consistency
5. Align frames to consistent pivot

## Phase 3: Chat UI & Real-time Preview (Week 5-6)

### 3.1 Chat Interface

**File:** `src/ui/components/ChatInterface.tsx`

**Features:**
- Message list (user + AI responses)
- Prompt input with autocomplete
- Style/perspective filter dropdowns
- Parameter sliders (color intensity, style strength)
- Regenerate/Upscale buttons per message

**State Management:**
```typescript
interface ChatState {
  messages: ChatMessage[];
  currentPrompt: string;
  selectedStyle: VisualStyle;
  selectedPerspective: Perspective;
  parameters: GenerationParameters;
  isGenerating: boolean;
}
```

### 3.2 Preview Panel

**File:** `src/ui/components/PreviewPanel.tsx`

**Features:**
- Thumbnail grid of generated sprites
- Click to view full-size
- Frame scrubber for animations
- Side-by-side comparison
- Drag-and-drop to project folder
- Export dialog (PNG, sprite sheet, JSON)

**Real-time Updates:**
- WebSocket or SSE for progress
- Low-res preview first
- Upscale option after generation
- Progress indicators

### 3.3 Prompt History

**File:** `src/ui/components/PromptHistory.tsx`

**Features:**
- Persistent conversation history (localStorage or database)
- Click to reuse prompts
- Edit and regenerate
- Export/import history
- Search history
- Favorite prompts

### 3.4 Backend API Server

**File:** `src/api/APIServer.ts`

**Endpoints:**
- `POST /api/generate` - Generate sprite
- `POST /api/scan-project` - Scan project for missing assets
- `POST /api/transfer-motion` - Transfer motion
- `GET /api/history` - Get generation history
- `WebSocket /api/progress` - Real-time progress updates

**Implementation:**
- Express.js or Fastify for HTTP server
- WebSocket for real-time updates
- File upload for project scanning
- Asset delivery

## Phase 4: Asset Set Generation (Week 7)

### 4.1 Asset Set Planner

**File:** `src/sets/AssetSetPlanner.ts`

**Implementation:**
```typescript
export class AssetSetPlanner {
  async planAssetSet(
    baseAsset: MissingAsset,
    projectContext: ProjectContext
  ): Promise<AssetSetPlan>
  
  async detectSetPattern(
    missingAssets: MissingAsset[]
  ): Promise<SetPattern | null>
}
```

**Set Patterns:**
- **8-Directional:** North, South, East, West, NE, NW, SE, SW
- **Animation Cycle:** Idle, Walk, Run, Attack, Death
- **Color Variants:** Red, Blue, Green variants
- **Equipment Sets:** Base + weapon variants

### 4.2 Variant Generator

**File:** `src/sets/VariantGenerator.ts`

**Implementation:**
```typescript
export class VariantGenerator {
  async generateColorVariants(
    baseSprite: GeneratedSprite,
    colors: string[]
  ): Promise<GeneratedSprite[]>
  
  async generateDirectionalViews(
    baseSprite: GeneratedSprite,
    directions: Direction[]
  ): Promise<GeneratedSprite[]>
  
  async generateEquipmentVariants(
    baseSprite: GeneratedSprite,
    equipment: string[]
  ): Promise<GeneratedSprite[]>
}
```

**Techniques:**
- Color replacement via image processing
- Style-consistent generation via LoRA
- ControlNet for pose consistency
- Inpainting for equipment addition

## Phase 5: MCP Integration (Week 8)

### 5.1 MCP Server Implementation

**File:** `src/mcp/SpriteGeneratorMCPServer.ts`

**MCP Protocol:**
```typescript
interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: unknown;
}

interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: MCPError;
}
```

**Tools:**
1. `generate_sprite`
   - Input: `{ concept: string, style?: string, frames?: number }`
   - Output: `{ sprite: Buffer, metadata: SpriteMetadata }`

2. `scan_project`
   - Input: `{ projectPath: string }`
   - Output: `{ missingAssets: MissingAsset[], suggestions: AssetSuggestion[] }`

3. `transfer_motion`
   - Input: `{ reference: Buffer, target: string, frames: number }`
   - Output: `{ spriteSheet: Buffer, metadata: SpriteSheetMetadata }`

4. `generate_asset_set`
   - Input: `{ baseAsset: string, setType: string }`
   - Output: `{ assets: GeneratedSprite[], metadata: AssetSetMetadata }`

5. `suggest_assets`
   - Input: `{ projectPath: string }`
   - Output: `{ suggestions: AssetSuggestion[] }`

### 5.2 Cursor Integration

**Configuration:**
```json
// .cursor/mcp.json
{
  "mcpServers": {
    "sprite-generator": {
      "command": "node",
      "args": ["ai-sprite-generator/dist/mcp/server.js"],
      "env": {}
    }
  }
}
```

**Testing:**
1. Start MCP server
2. Register with Cursor
3. Test tool invocation from Cursor
4. Verify asset delivery
5. Test project scanning from Cursor

## Phase 6: Enhanced Models & Polish (Week 9-10)

### 6.1 Animator2D Integration

**File:** `src/generation/Animator2DClient.ts`

**Implementation:**
```typescript
export class Animator2DClient {
  async generateAnimation(
    description: string,
    frames: number,
    direction?: string
  ): Promise<GeneratedSprite[]>
  
  async checkAvailability(): Promise<boolean>
}
```

**Integration:**
- HuggingFace model: `Loacky/Animator2D-v2.0.0-alpha`
- Local inference or API
- Fallback to frame-by-frame if unavailable

### 6.2 Enhanced ControlNet

**File:** `src/generation/ControlNetManager.ts`

**ControlNet Models:**
- **OpenPose:** Character pose control
- **Canny:** Edge/outline control
- **Depth:** 3D depth control
- **Scribble:** Sketch/line art control

**Workflow:**
1. Generate or extract control image
2. Load appropriate ControlNet model
3. Generate with ControlNet conditioning
4. Ensure consistency across frames

### 6.3 Upscaling Integration

**File:** `src/postprocessing/Upscaler.ts`

**Implementation:**
```typescript
export class Upscaler {
  async upscale(
    image: Buffer,
    scale: number,
    method: 'real-esrgan' | 'pixel-perfect'
  ): Promise<Buffer>
  
  async upscalePixelArt(
    image: Buffer,
    targetSize: [number, number]
  ): Promise<Buffer>
}
```

**Methods:**
- **Real-ESRGAN:** Quality upscaling for non-pixel art
- **Pixel-Perfect:** Nearest-neighbor for pixel art
- **HQx:** Specialized pixel art upscaling

### 6.4 Inpainting Support

**File:** `src/postprocessing/Inpainter.ts`

**Implementation:**
```typescript
export class Inpainter {
  async inpaint(
    image: Buffer,
    mask: Buffer,
    prompt: string
  ): Promise<Buffer>
  
  async fixFrame(
    frame: GeneratedSprite,
    issue: string
  ): Promise<GeneratedSprite>
}
```

**Use Cases:**
- Fix artifacts in generated frames
- Add/remove elements
- Refine specific areas
- Maintain consistency

## File Structure (Complete)

```
ai-sprite-generator/
├── src/
│   ├── intelligence/          # ✅ Existing
│   ├── generation/            # ✅ Existing + New
│   │   ├── (existing files)
│   │   ├── Animator2DClient.ts
│   │   ├── PoseCraftsClient.ts
│   │   └── ControlNetManager.ts
│   ├── postprocessing/        # ✅ Existing + New
│   │   ├── (existing files)
│   │   ├── Upscaler.ts
│   │   └── Inpainter.ts
│   ├── export/                # ✅ Existing
│   ├── pipeline/               # ✅ Existing
│   ├── analysis/              # 🆕 New
│   │   ├── ProjectScanner.ts
│   │   ├── AssetReferenceDetector.ts
│   │   ├── MissingAssetDetector.ts
│   │   ├── MissingAssetSuggester.ts
│   │   └── parsers/
│   │       ├── PhaserParser.ts
│   │       ├── GodotParser.ts
│   │       ├── UnityParser.ts
│   │       └── GenericParser.ts
│   ├── motion/                # 🆕 New
│   │   ├── MotionExtractor.ts
│   │   ├── MotionRetargeter.ts
│   │   ├── PoseCraftsClient.ts
│   │   └── ControlNetClient.ts
│   ├── sets/                  # 🆕 New
│   │   ├── AssetSetPlanner.ts
│   │   └── VariantGenerator.ts
│   ├── mcp/                   # 🆕 New
│   │   ├── SpriteGeneratorMCPServer.ts
│   │   ├── MCPServer.ts
│   │   └── tools/
│   │       ├── GenerateSpriteTool.ts
│   │       ├── ScanProjectTool.ts
│   │       ├── TransferMotionTool.ts
│   │       └── GenerateAssetSetTool.ts
│   ├── api/                   # 🆕 New
│   │   ├── APIServer.ts
│   │   ├── routes/
│   │   │   ├── generate.ts
│   │   │   ├── scan.ts
│   │   │   └── motion.ts
│   │   └── websocket.ts
│   ├── ui/                    # 🆕 New
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── PreviewPanel.tsx
│   │   │   ├── PromptHistory.tsx
│   │   │   ├── StyleFilters.tsx
│   │   │   └── ExportDialog.tsx
│   │   ├── hooks/
│   │   │   ├── useSpriteGeneration.ts
│   │   │   ├── useProjectAnalysis.ts
│   │   │   └── useMotionTransfer.ts
│   │   ├── stores/
│   │   │   ├── chatStore.ts
│   │   │   ├── previewStore.ts
│   │   │   └── projectStore.ts
│   │   └── App.tsx
│   ├── integration/           # ✅ Existing
│   ├── utils/                 # ✅ Existing
│   ├── types/                 # ✅ Existing + New
│   ├── cli.ts                 # ✅ Existing
│   └── index.ts              # ✅ Existing
├── config/                    # ✅ Existing
├── docs/                      # ✅ Existing
├── ui/                        # 🆕 New (if separate UI project)
│   ├── public/
│   ├── src/
│   └── package.json
└── package.json
```

## Dependencies to Add

```json
{
  "dependencies": {
    // Existing...
    "express": "^4.18.2",           // API server
    "ws": "^8.16.0",                // WebSocket
    "multer": "^1.4.5-lts.1",       // File upload
    "@tensorflow/tfjs-node": "^4.15.0", // Pose detection (optional)
    "react": "^18.2.0",             // UI (if separate)
    "react-dom": "^18.2.0",         // UI
    "zustand": "^4.4.7",            // State management
    "socket.io-client": "^4.7.2"    // Real-time updates
  },
  "devDependencies": {
    // Existing...
    "@types/express": "^4.17.21",
    "@types/ws": "^8.5.10",
    "@vitejs/plugin-react": "^4.2.1", // UI build
    "vite": "^5.0.0"                  // UI build
  }
}
```

## Testing Strategy

### Unit Tests
- Project scanner engine detection
- Asset reference parsing
- Motion extraction
- Prompt compilation

### Integration Tests
- End-to-end sprite generation
- Project scanning → generation workflow
- Motion transfer pipeline
- MCP server tool invocation

### E2E Tests
- Chat UI workflow
- Project scanning UI
- Motion transfer UI
- Cursor integration

## Documentation Updates

1. **API Documentation** - Update with new endpoints
2. **MCP Integration Guide** - Cursor setup instructions
3. **Project Scanning Guide** - How to use project analysis
4. **Motion Transfer Guide** - How to transfer animations
5. **UI User Guide** - Chat interface usage

## Success Metrics

- ✅ Can scan any game project and detect missing assets
- ✅ Can transfer animations from reference to new sprites
- ✅ Chat UI provides Ludo.ai-like experience
- ✅ Cursor can generate sprites via MCP
- ✅ Can generate complete asset sets automatically
- ✅ Real-time preview with upscale option
- ✅ Motion transfer maintains character consistency

---

This roadmap provides a complete implementation plan for all features from the PDF while building on our existing foundation.







