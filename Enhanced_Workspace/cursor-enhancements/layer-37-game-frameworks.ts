/**
 * LAYER 37 — GAME FRAMEWORKS
 * 
 * Deep understanding and code generation for game frameworks.
 * 
 * This layer provides framework-specific patterns, code generation templates,
 * and integration support for popular game development frameworks.
 */

/**
 * Supported game framework
 */
export type GameFramework = "phaser" | "openfl" | "defold" | "monogame" | "pixi" | "custom";

/**
 * Code generation type
 */
export type CodeGenerationType = 
  | "animation-controller"
  | "game-scene"
  | "sprite-loader"
  | "game-loop"
  | "physics-setup"
  | "asset-manager"
  | "state-machine"
  | "input-handler";

/**
 * Scene configuration
 */
export interface SceneConfig {
  name: string;
  type: "menu" | "game" | "battle" | "inventory" | "custom";
  width: number;
  height: number;
  backgroundColor?: string;
  physics?: PhysicsConfig;
  cameras?: CameraConfig[];
  layers?: LayerConfig[];
}

/**
 * Physics configuration
 */
export interface PhysicsConfig {
  enabled: boolean;
  type?: "arcade" | "matter" | "box2d";
  gravity?: { x: number; y: number };
  debug?: boolean;
}

/**
 * Camera configuration
 */
export interface CameraConfig {
  name: string;
  follow?: string; // Entity to follow
  bounds?: { x: number; y: number; width: number; height: number };
  zoom?: number;
}

/**
 * Layer configuration
 */
export interface LayerConfig {
  name: string;
  depth: number;
  fixed?: boolean;
}

/**
 * Animation controller configuration
 */
export interface AnimationControllerConfig {
  spriteSheet: SpriteSheetMetadata;
  animations: AnimationDefinition[];
  defaultAnimation?: string;
  frameRate?: number;
}

/**
 * Animation definition
 */
export interface AnimationDefinition {
  key: string;
  frames: number[] | string; // Frame indices or frame range
  frameRate?: number;
  repeat?: number; // -1 for infinite
  yoyo?: boolean;
}

/**
 * Sprite sheet metadata (from Layer 36)
 */
export interface SpriteSheetMetadata {
  name: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  totalFrames?: number;
  spacing?: number;
  margin?: number;
}

/**
 * Generated code result
 */
export interface GeneratedCode {
  framework: GameFramework;
  type: CodeGenerationType;
  code: string;
  language: "typescript" | "javascript" | "lua" | "csharp" | "haxe";
  dependencies: string[];
  imports: string[];
  exports?: string[];
}

/**
 * Main game frameworks configuration
 */
export const GAME_FRAMEWORKS = {
  /**
   * Phaser 3 Framework
   */
  phaser: {
    description: "Phaser 3 - HTML5 game framework",
    language: "typescript" as const,
    version: "3.70.0",
    
    patterns: {
      gameScene: {
        description: "Generate Phaser game scene class",
        template: `
import Phaser from 'phaser';

export class {SceneName} extends Phaser.Scene {{
  constructor() {{
    super({{ key: '{sceneKey}' }});
  }}

  preload() {{
    // Load assets
{loadAssets}
  }}

  create() {{
    // Initialize scene
{createContent}
  }}

  update() {{
    // Update loop
{updateLogic}
  }}
}}
        `,
        placeholders: ["SceneName", "sceneKey", "loadAssets", "createContent", "updateLogic"]
      },
      
      animationController: {
        description: "Generate Phaser animation controller",
        template: `
// Create animations from sprite sheet
{animations}.forEach(anim => {{
  this.anims.create({{
    key: anim.key,
    frames: this.anims.generateFrameNumbers('{spriteSheetKey}', {{
      start: anim.frames[0],
      end: anim.frames[anim.frames.length - 1]
    }}),
    frameRate: anim.frameRate || {defaultFrameRate},
    repeat: anim.repeat || 0,
    yoyo: anim.yoyo || false
  }});
}});
        `,
        placeholders: ["animations", "spriteSheetKey", "defaultFrameRate"]
      },
      
      spriteLoader: {
        description: "Generate Phaser sprite loader",
        template: `
// Load sprite sheet
this.load.spritesheet('{spriteKey}', '{spritePath}', {{
  frameWidth: {frameWidth},
  frameHeight: {frameHeight},
  spacing: {spacing},
  margin: {margin}
}});
        `,
        placeholders: ["spriteKey", "spritePath", "frameWidth", "frameHeight", "spacing", "margin"]
      },
      
      gameLoop: {
        description: "Generate Phaser game loop setup",
        template: `
const config: Phaser.Types.Core.GameConfig = {{
  type: Phaser.AUTO,
  width: {width},
  height: {height},
  parent: '{parentElement}',
  backgroundColor: '{backgroundColor}',
  physics: {{
    default: '{physicsType}',
    {physicsType}: {{
      gravity: {{ x: {gravityX}, y: {gravityY} }},
      debug: {debug}
    }}
  }},
  scene: [{sceneClasses}]
}};

const game = new Phaser.Game(config);
        `,
        placeholders: ["width", "height", "parentElement", "backgroundColor", "physicsType", "gravityX", "gravityY", "debug", "sceneClasses"]
      }
    },
    
    dependencies: [
      "phaser@^3.70.0"
    ],
    
    imports: {
      core: "import Phaser from 'phaser';",
      scene: "import { SceneName } from './scenes/{SceneName}';"
    }
  },

  /**
   * OpenFL Framework
   */
  openfl: {
    description: "OpenFL - Multi-platform framework",
    language: "haxe" as const,
    version: "9.2.0",
    
    patterns: {
      gameScene: {
        description: "Generate OpenFL game scene",
        template: `
package;

import openfl.display.Sprite;

class {SceneName} extends Sprite {{
  public function new() {{
    super();
    initialize();
  }}

  private function initialize():Void {{
    // Initialize scene
{createContent}
  }}

  public function update(deltaTime:Float):Void {{
    // Update loop
{updateLogic}
  }}
}}
        `,
        placeholders: ["SceneName", "createContent", "updateLogic"]
      }
    },
    
    dependencies: [
      "openfl",
      "lime"
    ]
  },

  /**
   * Defold Framework
   */
  defold: {
    description: "Defold - 2D game engine",
    language: "lua" as const,
    version: "1.4.0",
    
    patterns: {
      gameScene: {
        description: "Generate Defold game script",
        template: `
function init(self)
  -- Initialize scene
{createContent}
end

function update(self, dt)
  -- Update loop
{updateLogic}
end
        `,
        placeholders: ["createContent", "updateLogic"]
      }
    }
  },

  /**
   * MonoGame Framework
   */
  monogame: {
    description: "MonoGame - Cross-platform C# framework",
    language: "csharp" as const,
    version: "3.8.0",
    
    patterns: {
      gameScene: {
        description: "Generate MonoGame game class",
        template: `
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

public class {SceneName} : Game
{{
    private GraphicsDeviceManager _graphics;
    private SpriteBatch _spriteBatch;

    public {SceneName}()
    {{
        _graphics = new GraphicsDeviceManager(this);
        Content.RootDirectory = "Content";
        IsMouseVisible = true;
    }}

    protected override void Initialize()
    {{
        // Initialize
{createContent}
        base.Initialize();
    }}

    protected override void LoadContent()
    {{
        _spriteBatch = new SpriteBatch(GraphicsDevice);
{loadAssets}
    }}

    protected override void Update(GameTime gameTime)
    {{
        // Update logic
{updateLogic}
        base.Update(gameTime);
    }}

    protected override void Draw(GameTime gameTime)
    {{
        GraphicsDevice.Clear(Color.{backgroundColor});
        _spriteBatch.Begin();
        // Draw content
{drawContent}
        _spriteBatch.End();
        base.Draw(gameTime);
    }}
}}
        `,
        placeholders: ["SceneName", "createContent", "loadAssets", "updateLogic", "backgroundColor", "drawContent"]
      }
    },
    
    dependencies: [
      "MonoGame.Framework"
    ]
  },

  /**
   * PixiJS Framework
   */
  pixi: {
    description: "PixiJS - 2D WebGL renderer",
    language: "typescript" as const,
    version: "7.3.0",
    
    patterns: {
      spriteLoader: {
        description: "Generate PixiJS sprite loader",
        template: `
import {{ Application, Sprite, Texture }} from 'pixi.js';

const app = new Application();
await app.init({{ width: {width}, height: {height} }});

// Load sprite sheet
const spriteSheet = await PIXI.Assets.load('{spritePath}');
const sprite = new Sprite(spriteSheet.textures['{frameKey}']);
        `,
        placeholders: ["width", "height", "spritePath", "frameKey"]
      }
    },
    
    dependencies: [
      "pixi.js@^7.3.0"
    ]
  }
} as const;

/**
 * Generate code for specific framework and type
 */
export async function generateCode(
  framework: GameFramework,
  type: CodeGenerationType,
  config: unknown,
  options?: {
    projectPath?: string;
    verifyAssets?: boolean;
  }
): Promise<GeneratedCode> {
  const frameworkConfig = GAME_FRAMEWORKS[framework];
  
  if (!frameworkConfig) {
    throw new Error(`Framework ${framework} not supported`);
  }

  // Verify assets if requested
  if (options?.verifyAssets && options.projectPath && type === 'sprite-loader') {
    try {
      const { createAssetRegistry, verifyAllAssets } = require('../integrations/asset-registry/asset-registry');
      const registry = await createAssetRegistry(options.projectPath);
      const verification = await verifyAllAssets(registry);
      
      if (verification.missing.length > 0) {
        throw new Error(
          `Cannot generate code: ${verification.missing.length} asset(s) are missing. ` +
          `Assets must exist before code can reference them.`
        );
      }
    } catch (error) {
      // If verification fails, still proceed but log warning
      console.warn('Asset verification failed:', error);
    }
  }

  // Import framework-specific integration
  if (framework === "phaser") {
    const { createPhaserIntegration } = require('../integrations/game-frameworks/phaser-integration');
    const phaserIntegration = createPhaserIntegration();

    switch (type) {
      case "animation-controller":
        if (!isAnimationControllerConfig(config)) {
          throw new Error("Invalid config for animation-controller");
        }
        return phaserIntegration.generateAnimationController(config);
      
      case "game-scene":
        if (!isSceneConfig(config)) {
          throw new Error("Invalid config for game-scene");
        }
        return phaserIntegration.generateScene(config);
      
      case "sprite-loader":
        if (!isSpriteSheetArray(config)) {
          throw new Error("Invalid config for sprite-loader");
        }
        return phaserIntegration.generateSpriteLoader(config);
      
      default:
        throw new Error(`Code generation type ${type} not implemented for ${framework}`);
    }
  }

  throw new Error(`Framework ${framework} code generation not fully implemented`);
}

/**
 * Type guards
 */
function isAnimationControllerConfig(config: unknown): config is AnimationControllerConfig {
  return typeof config === 'object' && 
         config !== null && 
         'spriteSheet' in config && 
         'animations' in config;
}

function isSceneConfig(config: unknown): config is SceneConfig {
  return typeof config === 'object' && 
         config !== null && 
         'name' in config && 
         'type' in config;
}

function isSpriteSheetArray(config: unknown): config is Array<{ name: string; path: string; frameWidth: number; frameHeight: number; spacing?: number; margin?: number }> {
  return Array.isArray(config) && 
         config.length > 0 && 
         config.every(item => 
           typeof item === 'object' && 
           item !== null && 
           'name' in item && 
           'path' in item && 
           'frameWidth' in item && 
           'frameHeight' in item
         );
}

/**
 * Generate animation controller
 */
export function generateAnimationController(
  framework: GameFramework,
  config: AnimationControllerConfig
): GeneratedCode {
  return generateCode(framework, "animation-controller", config);
}

/**
 * Generate game scene
 */
export function generateGameScene(
  framework: GameFramework,
  config: SceneConfig
): GeneratedCode {
  return generateCode(framework, "game-scene", config);
}

/**
 * Generate sprite loader
 */
export function generateSpriteLoader(
  framework: GameFramework,
  spriteSheets: SpriteSheetMetadata[]
): GeneratedCode {
  // Convert SpriteSheetMetadata to format expected by Phaser integration
  const formattedSheets = spriteSheets.map(sheet => ({
    name: sheet.name,
    path: sheet.path,
    frameWidth: sheet.frameWidth,
    frameHeight: sheet.frameHeight,
    spacing: sheet.spacing,
    margin: sheet.margin
  }));
  
  return generateCode(framework, "sprite-loader", formattedSheets);
}

/**
 * Type exports
 */
export type {
  GameFramework,
  CodeGenerationType,
  SceneConfig,
  AnimationControllerConfig,
  GeneratedCode,
  SpriteSheetMetadata
};

