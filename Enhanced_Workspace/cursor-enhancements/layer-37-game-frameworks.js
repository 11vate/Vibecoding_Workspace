/**
 * LAYER 37 — GAME FRAMEWORKS
 *
 * Deep understanding and code generation for game frameworks.
 *
 * This layer provides framework-specific patterns, code generation templates,
 * and integration support for popular game development frameworks.
 */
/**
 * Main game frameworks configuration
 */
export const GAME_FRAMEWORKS = {
    /**
     * Phaser 3 Framework
     */
    phaser: {
        description: "Phaser 3 - HTML5 game framework",
        language: "typescript",
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
        language: "haxe",
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
        language: "lua",
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
        language: "csharp",
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
        language: "typescript",
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
};
/**
 * Generate code for specific framework and type
 */
export async function generateCode(framework, type, config, options) {
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
                throw new Error(`Cannot generate code: ${verification.missing.length} asset(s) are missing. ` +
                    `Assets must exist before code can reference them.`);
            }
        }
        catch (error) {
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
function isAnimationControllerConfig(config) {
    return typeof config === 'object' &&
        config !== null &&
        'spriteSheet' in config &&
        'animations' in config;
}
function isSceneConfig(config) {
    return typeof config === 'object' &&
        config !== null &&
        'name' in config &&
        'type' in config;
}
function isSpriteSheetArray(config) {
    return Array.isArray(config) &&
        config.length > 0 &&
        config.every(item => typeof item === 'object' &&
            item !== null &&
            'name' in item &&
            'path' in item &&
            'frameWidth' in item &&
            'frameHeight' in item);
}
/**
 * Generate animation controller
 */
export function generateAnimationController(framework, config) {
    return generateCode(framework, "animation-controller", config);
}
/**
 * Generate game scene
 */
export function generateGameScene(framework, config) {
    return generateCode(framework, "game-scene", config);
}
/**
 * Generate sprite loader
 */
export function generateSpriteLoader(framework, spriteSheets) {
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
//# sourceMappingURL=layer-37-game-frameworks.js.map