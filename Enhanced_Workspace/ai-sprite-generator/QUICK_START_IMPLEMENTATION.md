# Quick Start Implementation Guide

## Getting Started

This guide provides a quick-start approach to implementing the enhanced features. Start with Phase 1 for immediate value.

## Phase 1: Project Analysis (Start Here)

### Step 1: Create Project Scanner

**File:** `src/analysis/ProjectScanner.ts`

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';

export type GameEngine = 'unity' | 'godot' | 'phaser' | 'unknown';

export interface ProjectAnalysis {
  engine: GameEngine;
  projectPath: string;
  assetReferences: AssetReference[];
  missingAssets: MissingAsset[];
}

export class ProjectScanner {
  async detectEngine(projectPath: string): Promise<GameEngine> {
    // Check for Unity
    const assetsPath = path.join(projectPath, 'Assets');
    if (await this.pathExists(assetsPath)) {
      return 'unity';
    }
    
    // Check for Godot
    const godotProject = path.join(projectPath, 'project.godot');
    if (await this.pathExists(godotProject)) {
      return 'godot';
    }
    
    // Check for Phaser
    const packageJson = path.join(projectPath, 'package.json');
    if (await this.pathExists(packageJson)) {
      const pkg = JSON.parse(await fs.readFile(packageJson, 'utf-8'));
      if (pkg.dependencies?.phaser || pkg.devDependencies?.phaser) {
        return 'phaser';
      }
    }
    
    return 'unknown';
  }
  
  private async pathExists(p: string): Promise<boolean> {
    try {
      await fs.access(p);
      return true;
    } catch {
      return false;
    }
  }
}
```

### Step 2: Extend Asset Reference Scanner

**File:** `src/analysis/parsers/PhaserParser.ts`

```typescript
import { scanPhaserReferences } from '../../../cursor-enhancements/utils/asset-reference-scanner';

export class PhaserParser {
  parse(code: string): AssetReference[] {
    // Use existing scanner
    return scanPhaserReferences(code, code.split('\n'));
  }
  
  async parseProject(projectPath: string): Promise<AssetReference[]> {
    const codeFiles = await this.findCodeFiles(projectPath);
    const references: AssetReference[] = [];
    
    for (const file of codeFiles) {
      const code = await fs.readFile(file, 'utf-8');
      references.push(...this.parse(code));
    }
    
    return references;
  }
}
```

### Step 3: Missing Asset Detection

**File:** `src/analysis/MissingAssetDetector.ts`

```typescript
import { createAssetRegistry, AssetRegistry } from '../../../cursor-enhancements/integrations/asset-registry/asset-registry';
import { scanForAssetReferences } from '../../../cursor-enhancements/utils/asset-reference-scanner';

export class MissingAssetDetector {
  async detectMissing(projectPath: string): Promise<MissingAsset[]> {
    const registry = await createAssetRegistry(projectPath);
    const scanner = new ProjectScanner();
    const engine = await scanner.detectEngine(projectPath);
    
    // Scan all code files
    const codeFiles = await this.findCodeFiles(projectPath);
    const allReferences: AssetReference[] = [];
    
    for (const file of codeFiles) {
      const code = await fs.readFile(file, 'utf-8');
      const refs = scanForAssetReferences(code, engine === 'phaser' ? 'phaser' : undefined);
      allReferences.push(...refs);
    }
    
    // Check against registry
    const missing: MissingAsset[] = [];
    for (const ref of allReferences) {
      const entry = registry.assets.get(ref.assetId);
      if (!entry) {
        missing.push({
          assetId: ref.assetId,
          references: [ref],
          reason: 'not_in_registry'
        });
      } else {
        // Verify file exists
        const fullPath = path.join(projectPath, entry.path);
        if (!await this.pathExists(fullPath)) {
          missing.push({
            assetId: ref.assetId,
            references: [ref],
            reason: 'file_missing'
          });
        }
      }
    }
    
    return missing;
  }
}
```

### Step 4: Add CLI Command

**File:** `src/cli.ts` (add new command)

```typescript
program
  .command('scan')
  .description('Scan project for missing assets')
  .argument('<project-path>', 'Path to game project')
  .action(async (projectPath: string) => {
    const detector = new MissingAssetDetector();
    const missing = await detector.detectMissing(projectPath);
    
    console.log(`Found ${missing.length} missing assets:`);
    for (const asset of missing) {
      console.log(`  - ${asset.assetId} (${asset.reason})`);
    }
  });
```

### Step 5: Test

```bash
cd ai-sprite-generator
npm run build
npm run dev scan ../games/PixelPets_Reborn_x_remeged
```

## Phase 2: Motion Transfer (After Phase 1)

### Step 1: Basic Motion Extraction

**File:** `src/motion/MotionExtractor.ts`

```typescript
import sharp from 'sharp';

export class MotionExtractor {
  async extractFromSpriteSheet(
    spriteSheet: Buffer,
    frameWidth: number,
    frameHeight: number
  ): Promise<PoseSequence> {
    // Extract frames
    const image = sharp(spriteSheet);
    const metadata = await image.metadata();
    const cols = Math.floor(metadata.width! / frameWidth);
    const rows = Math.floor(metadata.height! / frameHeight);
    
    const frames: Buffer[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const frame = await image
          .extract({
            left: col * frameWidth,
            top: row * frameHeight,
            width: frameWidth,
            height: frameHeight
          })
          .toBuffer();
        frames.push(frame);
      }
    }
    
    // For now, return simple pose sequence
    // TODO: Integrate OpenPose or MediaPipe
    return {
      poses: frames.map(() => ({ keypoints: [], confidence: 1, bounds: { x: 0, y: 0, width: frameWidth, height: frameHeight } })),
      timing: frames.map(() => 100), // 100ms per frame
      loopable: true
    };
  }
}
```

### Step 2: Integrate with Generation Pipeline

**File:** `src/motion/MotionRetargeter.ts`

```typescript
import { AIGenerator } from '../generation/AIGenerator';
import { PoseSequence } from './MotionExtractor';

export class MotionRetargeter {
  constructor(private generator: AIGenerator) {}
  
  async transferMotion(
    referenceSequence: PoseSequence,
    targetDescription: string,
    style: VisualStyle
  ): Promise<GeneratedSprite[]> {
    const frames: GeneratedSprite[] = [];
    
    // Generate each frame with pose guidance
    for (const pose of referenceSequence.poses) {
      const frame = await this.generator.generate({
        concept: targetDescription,
        style,
        perspective: 'side-view',
        action: 'idle', // Will be inferred from motion
        frames: 1
      });
      frames.push(frame);
    }
    
    return frames;
  }
}
```

## Phase 3: Chat UI (Can Start in Parallel)

### Step 1: Setup React Project

```bash
cd ai-sprite-generator
npm install react react-dom @vitejs/plugin-react vite
```

**File:** `ui/package.json` (or add to main package.json)

```json
{
  "scripts": {
    "dev:ui": "vite",
    "build:ui": "vite build"
  }
}
```

### Step 2: Basic Chat Component

**File:** `src/ui/components/ChatInterface.tsx`

```typescript
import { useState } from 'react';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  
  const handleGenerate = async () => {
    // Add user message
    setMessages([...messages, { role: 'user', content: prompt }]);
    
    // Generate sprite
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ concept: prompt })
    });
    const result = await response.json();
    
    // Add AI response
    setMessages([...messages, 
      { role: 'user', content: prompt },
      { role: 'assistant', content: result.sprite, type: 'sprite' }
    ]);
  };
  
  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.type === 'sprite' ? (
              <img src={msg.content} alt="Generated sprite" />
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
      </div>
      <div className="input">
        <input 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a sprite..."
        />
        <button onClick={handleGenerate}>Generate</button>
      </div>
    </div>
  );
}
```

## Phase 5: MCP Server (After Core Features)

### Step 1: Basic MCP Server

**File:** `src/mcp/MCPServer.ts`

```typescript
export class MCPServer {
  private tools: MCPTool[] = [];
  
  registerTool(tool: MCPTool) {
    this.tools.push(tool);
  }
  
  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    if (request.method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          tools: this.tools.map(t => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema
          }))
        }
      };
    }
    
    if (request.method === 'tools/call') {
      const tool = this.tools.find(t => t.name === request.params.name);
      if (!tool) {
        throw new Error(`Tool ${request.params.name} not found`);
      }
      
      const result = await tool.execute(request.params.arguments);
      return {
        jsonrpc: '2.0',
        id: request.id,
        result
      };
    }
    
    throw new Error(`Unknown method: ${request.method}`);
  }
}
```

### Step 2: Generate Sprite Tool

**File:** `src/mcp/tools/GenerateSpriteTool.ts`

```typescript
import { AssetPipeline } from '../../pipeline/AssetPipeline';

export class GenerateSpriteTool implements MCPTool {
  name = 'generate_sprite';
  description = 'Generate a sprite from a text description';
  inputSchema = {
    type: 'object',
    properties: {
      concept: { type: 'string', description: 'Sprite description' },
      style: { type: 'string', enum: ['pixel-art', 'cartoon', 'hand-drawn'] },
      frames: { type: 'number', description: 'Number of frames for animation' }
    },
    required: ['concept']
  };
  
  async execute(params: { concept: string; style?: string; frames?: number }) {
    const pipeline = new AssetPipeline();
    const result = await pipeline.execute({
      concept: params.concept,
      style: params.style || 'pixel-art',
      frames: params.frames || 1
    });
    
    return {
      sprite: result.asset.path,
      metadata: result.metadata
    };
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
// src/analysis/__tests__/ProjectScanner.test.ts
import { ProjectScanner } from '../ProjectScanner';

describe('ProjectScanner', () => {
  it('should detect Phaser project', async () => {
    const scanner = new ProjectScanner();
    const engine = await scanner.detectEngine('./test-projects/phaser-game');
    expect(engine).toBe('phaser');
  });
});
```

### Integration Tests

```typescript
// src/__tests__/integration/motion-transfer.test.ts
import { MotionRetargeter } from '../../motion/MotionRetargeter';

describe('Motion Transfer', () => {
  it('should transfer animation from reference', async () => {
    const retargeter = new MotionRetargeter(generator);
    const result = await retargeter.transferMotion(
      referenceSequence,
      'fire pet',
      'pixel-art'
    );
    expect(result).toHaveLength(referenceSequence.poses.length);
  });
});
```

## Priority Order

1. **Phase 1** - Project Analysis (highest value, enables everything else)
2. **Phase 3** - Chat UI (user-facing, can start in parallel)
3. **Phase 2** - Motion Transfer (advanced feature)
4. **Phase 4** - Asset Sets (builds on Phase 1)
5. **Phase 5** - MCP Integration (requires core features)
6. **Phase 6** - Enhanced Models (polish and optimization)

## Quick Wins

1. **Extend existing asset scanner** - Add Unity/Godot parsers (1-2 days)
2. **Missing asset report** - Generate report with suggestions (1 day)
3. **Basic chat UI** - Simple React interface (2-3 days)
4. **MCP server skeleton** - Basic MCP implementation (1 day)

## Common Pitfalls

1. **Don't over-engineer** - Start simple, iterate
2. **Use existing code** - Leverage asset-reference-scanner.ts
3. **Test incrementally** - Test each phase before moving on
4. **Document as you go** - Update docs with each feature

---

**Start with Phase 1** - It provides immediate value and enables all other features.







