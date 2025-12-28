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
export type CodeGenerationType = "animation-controller" | "game-scene" | "sprite-loader" | "game-loop" | "physics-setup" | "asset-manager" | "state-machine" | "input-handler";
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
    gravity?: {
        x: number;
        y: number;
    };
    debug?: boolean;
}
/**
 * Camera configuration
 */
export interface CameraConfig {
    name: string;
    follow?: string;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
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
    frames: number[] | string;
    frameRate?: number;
    repeat?: number;
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
export declare const GAME_FRAMEWORKS: {
    /**
     * Phaser 3 Framework
     */
    readonly phaser: {
        readonly description: "Phaser 3 - HTML5 game framework";
        readonly language: "typescript";
        readonly version: "3.70.0";
        readonly patterns: {
            readonly gameScene: {
                readonly description: "Generate Phaser game scene class";
                readonly template: "\nimport Phaser from 'phaser';\n\nexport class {SceneName} extends Phaser.Scene {{\n  constructor() {{\n    super({{ key: '{sceneKey}' }});\n  }}\n\n  preload() {{\n    // Load assets\n{loadAssets}\n  }}\n\n  create() {{\n    // Initialize scene\n{createContent}\n  }}\n\n  update() {{\n    // Update loop\n{updateLogic}\n  }}\n}}\n        ";
                readonly placeholders: readonly ["SceneName", "sceneKey", "loadAssets", "createContent", "updateLogic"];
            };
            readonly animationController: {
                readonly description: "Generate Phaser animation controller";
                readonly template: "\n// Create animations from sprite sheet\n{animations}.forEach(anim => {{\n  this.anims.create({{\n    key: anim.key,\n    frames: this.anims.generateFrameNumbers('{spriteSheetKey}', {{\n      start: anim.frames[0],\n      end: anim.frames[anim.frames.length - 1]\n    }}),\n    frameRate: anim.frameRate || {defaultFrameRate},\n    repeat: anim.repeat || 0,\n    yoyo: anim.yoyo || false\n  }});\n}});\n        ";
                readonly placeholders: readonly ["animations", "spriteSheetKey", "defaultFrameRate"];
            };
            readonly spriteLoader: {
                readonly description: "Generate Phaser sprite loader";
                readonly template: "\n// Load sprite sheet\nthis.load.spritesheet('{spriteKey}', '{spritePath}', {{\n  frameWidth: {frameWidth},\n  frameHeight: {frameHeight},\n  spacing: {spacing},\n  margin: {margin}\n}});\n        ";
                readonly placeholders: readonly ["spriteKey", "spritePath", "frameWidth", "frameHeight", "spacing", "margin"];
            };
            readonly gameLoop: {
                readonly description: "Generate Phaser game loop setup";
                readonly template: "\nconst config: Phaser.Types.Core.GameConfig = {{\n  type: Phaser.AUTO,\n  width: {width},\n  height: {height},\n  parent: '{parentElement}',\n  backgroundColor: '{backgroundColor}',\n  physics: {{\n    default: '{physicsType}',\n    {physicsType}: {{\n      gravity: {{ x: {gravityX}, y: {gravityY} }},\n      debug: {debug}\n    }}\n  }},\n  scene: [{sceneClasses}]\n}};\n\nconst game = new Phaser.Game(config);\n        ";
                readonly placeholders: readonly ["width", "height", "parentElement", "backgroundColor", "physicsType", "gravityX", "gravityY", "debug", "sceneClasses"];
            };
        };
        readonly dependencies: readonly ["phaser@^3.70.0"];
        readonly imports: {
            readonly core: "import Phaser from 'phaser';";
            readonly scene: "import { SceneName } from './scenes/{SceneName}';";
        };
    };
    /**
     * OpenFL Framework
     */
    readonly openfl: {
        readonly description: "OpenFL - Multi-platform framework";
        readonly language: "haxe";
        readonly version: "9.2.0";
        readonly patterns: {
            readonly gameScene: {
                readonly description: "Generate OpenFL game scene";
                readonly template: "\npackage;\n\nimport openfl.display.Sprite;\n\nclass {SceneName} extends Sprite {{\n  public function new() {{\n    super();\n    initialize();\n  }}\n\n  private function initialize():Void {{\n    // Initialize scene\n{createContent}\n  }}\n\n  public function update(deltaTime:Float):Void {{\n    // Update loop\n{updateLogic}\n  }}\n}}\n        ";
                readonly placeholders: readonly ["SceneName", "createContent", "updateLogic"];
            };
        };
        readonly dependencies: readonly ["openfl", "lime"];
    };
    /**
     * Defold Framework
     */
    readonly defold: {
        readonly description: "Defold - 2D game engine";
        readonly language: "lua";
        readonly version: "1.4.0";
        readonly patterns: {
            readonly gameScene: {
                readonly description: "Generate Defold game script";
                readonly template: "\nfunction init(self)\n  -- Initialize scene\n{createContent}\nend\n\nfunction update(self, dt)\n  -- Update loop\n{updateLogic}\nend\n        ";
                readonly placeholders: readonly ["createContent", "updateLogic"];
            };
        };
    };
    /**
     * MonoGame Framework
     */
    readonly monogame: {
        readonly description: "MonoGame - Cross-platform C# framework";
        readonly language: "csharp";
        readonly version: "3.8.0";
        readonly patterns: {
            readonly gameScene: {
                readonly description: "Generate MonoGame game class";
                readonly template: "\nusing Microsoft.Xna.Framework;\nusing Microsoft.Xna.Framework.Graphics;\n\npublic class {SceneName} : Game\n{{\n    private GraphicsDeviceManager _graphics;\n    private SpriteBatch _spriteBatch;\n\n    public {SceneName}()\n    {{\n        _graphics = new GraphicsDeviceManager(this);\n        Content.RootDirectory = \"Content\";\n        IsMouseVisible = true;\n    }}\n\n    protected override void Initialize()\n    {{\n        // Initialize\n{createContent}\n        base.Initialize();\n    }}\n\n    protected override void LoadContent()\n    {{\n        _spriteBatch = new SpriteBatch(GraphicsDevice);\n{loadAssets}\n    }}\n\n    protected override void Update(GameTime gameTime)\n    {{\n        // Update logic\n{updateLogic}\n        base.Update(gameTime);\n    }}\n\n    protected override void Draw(GameTime gameTime)\n    {{\n        GraphicsDevice.Clear(Color.{backgroundColor});\n        _spriteBatch.Begin();\n        // Draw content\n{drawContent}\n        _spriteBatch.End();\n        base.Draw(gameTime);\n    }}\n}}\n        ";
                readonly placeholders: readonly ["SceneName", "createContent", "loadAssets", "updateLogic", "backgroundColor", "drawContent"];
            };
        };
        readonly dependencies: readonly ["MonoGame.Framework"];
    };
    /**
     * PixiJS Framework
     */
    readonly pixi: {
        readonly description: "PixiJS - 2D WebGL renderer";
        readonly language: "typescript";
        readonly version: "7.3.0";
        readonly patterns: {
            readonly spriteLoader: {
                readonly description: "Generate PixiJS sprite loader";
                readonly template: "\nimport {{ Application, Sprite, Texture }} from 'pixi.js';\n\nconst app = new Application();\nawait app.init({{ width: {width}, height: {height} }});\n\n// Load sprite sheet\nconst spriteSheet = await PIXI.Assets.load('{spritePath}');\nconst sprite = new Sprite(spriteSheet.textures['{frameKey}']);\n        ";
                readonly placeholders: readonly ["width", "height", "spritePath", "frameKey"];
            };
        };
        readonly dependencies: readonly ["pixi.js@^7.3.0"];
    };
};
/**
 * Generate code for specific framework and type
 */
export declare function generateCode(framework: GameFramework, type: CodeGenerationType, config: unknown, options?: {
    projectPath?: string;
    verifyAssets?: boolean;
}): Promise<GeneratedCode>;
/**
 * Generate animation controller
 */
export declare function generateAnimationController(framework: GameFramework, config: AnimationControllerConfig): GeneratedCode;
/**
 * Generate game scene
 */
export declare function generateGameScene(framework: GameFramework, config: SceneConfig): GeneratedCode;
/**
 * Generate sprite loader
 */
export declare function generateSpriteLoader(framework: GameFramework, spriteSheets: SpriteSheetMetadata[]): GeneratedCode;
/**
 * Type exports
 */
export type { GameFramework, CodeGenerationType, SceneConfig, AnimationControllerConfig, GeneratedCode, SpriteSheetMetadata };
//# sourceMappingURL=layer-37-game-frameworks.d.ts.map