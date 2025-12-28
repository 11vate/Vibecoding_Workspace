/**
 * Phaser Integration
 *
 * Phaser-specific helpers and code generation utilities.
 */
/**
 * Phaser integration service
 */
export class PhaserIntegration {
    /**
     * Generate Phaser scene class
     */
    generateScene(config) {
        const sceneName = this.toPascalCase(config.name);
        const sceneKey = this.toCamelCase(config.name);
        const loadAssets = this.generateLoadAssets(config);
        const createContent = this.generateCreateContent(config);
        const updateLogic = this.generateUpdateLogic(config);
        const code = `
import Phaser from 'phaser';

export class ${sceneName} extends Phaser.Scene {
  constructor() {
    super({ key: '${sceneKey}' });
  }

  preload() {
    // Load assets
${loadAssets}
  }

  create() {
    // Initialize scene
${createContent}
  }

  update() {
    // Update loop
${updateLogic}
  }
}
    `.trim();
        return {
            framework: "phaser",
            type: "game-scene",
            code,
            language: "typescript",
            dependencies: ["phaser@^3.70.0"],
            imports: ["import Phaser from 'phaser';"],
            exports: [sceneName]
        };
    }
    /**
     * Generate animation controller
     */
    generateAnimationController(config) {
        const animations = config.animations.map(anim => {
            let framesStr;
            if (Array.isArray(anim.frames)) {
                if (anim.frames.length === 1) {
                    framesStr = `[${anim.frames[0]}]`;
                }
                else {
                    // Check if frames are consecutive
                    const isConsecutive = anim.frames.every((val, idx, arr) => idx === 0 || val === arr[idx - 1] + 1);
                    if (isConsecutive) {
                        framesStr = `{ start: ${anim.frames[0]}, end: ${anim.frames[anim.frames.length - 1]} }`;
                    }
                    else {
                        framesStr = `[${anim.frames.join(', ')}]`;
                    }
                }
            }
            else if (typeof anim.frames === 'string') {
                // Handle frame range strings like "0-3" or "1,2,3"
                if (anim.frames.includes('-')) {
                    const [start, end] = anim.frames.split('-').map(n => parseInt(n.trim()));
                    framesStr = `{ start: ${start}, end: ${end} }`;
                }
                else {
                    framesStr = `[${anim.frames}]`;
                }
            }
            else {
                framesStr = `[${anim.frames}]`;
            }
            const frameRate = anim.frameRate || config.frameRate || 10;
            const repeat = anim.repeat !== undefined ? anim.repeat : (anim.repeat === -1 ? -1 : 0);
            const yoyo = anim.yoyo || false;
            return `    this.anims.create({
      key: '${anim.key}',
      frames: this.anims.generateFrameNumbers('${config.spriteSheet.name}', ${framesStr}),
      frameRate: ${frameRate},
      repeat: ${repeat},
      yoyo: ${yoyo}
    });`;
        }).join('\n\n');
        const defaultAnimCode = config.defaultAnimation
            ? `\n\n    // Play default animation\n    this.anims.play('${config.defaultAnimation}');`
            : '';
        const code = `// Create animations from sprite sheet: ${config.spriteSheet.name}
${animations}${defaultAnimCode}`;
        return {
            framework: "phaser",
            type: "animation-controller",
            code,
            language: "typescript",
            dependencies: ["phaser@^3.70.0"],
            imports: [],
            exports: []
        };
    }
    /**
     * Generate sprite loader
     */
    generateSpriteLoader(spriteSheets) {
        if (spriteSheets.length === 0) {
            return {
                framework: "phaser",
                type: "sprite-loader",
                code: "// No sprite sheets to load",
                language: "typescript",
                dependencies: ["phaser@^3.70.0"],
                imports: [],
                exports: []
            };
        }
        const loaders = spriteSheets.map((sheet, index) => {
            const options = [
                `frameWidth: ${sheet.frameWidth}`,
                `frameHeight: ${sheet.frameHeight}`
            ];
            if (sheet.spacing !== undefined && sheet.spacing > 0) {
                options.push(`spacing: ${sheet.spacing}`);
            }
            if (sheet.margin !== undefined && sheet.margin > 0) {
                options.push(`margin: ${sheet.margin}`);
            }
            const comment = index === 0 ? "// Load sprite sheets" : "";
            return `${comment ? comment + '\n' : ''}    this.load.spritesheet('${sheet.name}', '${sheet.path}', {
      ${options.join(',\n      ')}
    });`;
        }).join('\n\n');
        const code = loaders;
        return {
            framework: "phaser",
            type: "sprite-loader",
            code,
            language: "typescript",
            dependencies: ["phaser@^3.70.0"],
            imports: [],
            exports: []
        };
    }
    /**
     * Generate game configuration
     */
    generateGameConfig(config) {
        const physicsConfig = config.physics ? `
  physics: {
    default: '${config.physics.type}',
    ${config.physics.type}: {
      gravity: { x: ${config.physics.gravity?.x || 0}, y: ${config.physics.gravity?.y || 0} },
      debug: ${config.physics.debug || false}
    }
  },` : '';
        const scaleConfig = config.scale ? `
  scale: {
    mode: Phaser.Scale.${config.scale.mode || 'FIT'},
    autoCenter: Phaser.Scale.${config.scale.autoCenter || 'CENTER_BOTH'}
  },` : '';
        const sceneImports = config.scenes.length > 0
            ? config.scenes.map(s => `import { ${s} } from './scenes/${s}';`).join('\n')
            : '// Import your scenes here';
        const code = `import Phaser from 'phaser';
${sceneImports}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: ${config.width},
  height: ${config.height},
  parent: '${config.parent || 'game-container'}',
  backgroundColor: '${config.backgroundColor || '#000000'}',${physicsConfig}${scaleConfig}
  scene: [${config.scenes.length > 0 ? config.scenes.join(', ') : '/* Add your scenes here */'}]
};

const game = new Phaser.Game(config);

export default game;`;
        return {
            framework: "phaser",
            type: "game-scene",
            code,
            language: "typescript",
            dependencies: ["phaser@^3.70.0"],
            imports: [
                "import Phaser from 'phaser';",
                ...(config.scenes.length > 0 ? config.scenes.map(s => `import { ${s} } from './scenes/${s}';`) : [])
            ],
            exports: []
        };
    }
    toPascalCase(str) {
        return str.replace(/(?:^|[-_\s])(\w)/g, (_, c) => c.toUpperCase());
    }
    toCamelCase(str) {
        const pascal = this.toPascalCase(str);
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }
    /**
     * Generate load assets code
     */
    generateLoadAssets(config) {
        const assets = [];
        // Add background color if specified
        if (config.backgroundColor) {
            // Background is set in config, not loaded
        }
        // Generate placeholder for assets
        // In a real implementation, this would use config.assets if provided
        if (assets.length === 0) {
            return "    // Load your assets here\n    // Example: this.load.image('key', 'path/to/image.png');";
        }
        return assets.map(asset => `    ${asset}`).join('\n');
    }
    /**
     * Generate create content code
     */
    generateCreateContent(config) {
        const lines = [];
        // Add camera setup if specified
        if (config.cameras && config.cameras.length > 0) {
            config.cameras.forEach((camera, index) => {
                if (index === 0) {
                    lines.push(`    // Main camera setup`);
                    if (camera.follow) {
                        lines.push(`    this.cameras.main.startFollow(${camera.follow});`);
                    }
                    if (camera.zoom) {
                        lines.push(`    this.cameras.main.setZoom(${camera.zoom});`);
                    }
                    if (camera.bounds) {
                        lines.push(`    this.cameras.main.setBounds(${camera.bounds.x}, ${camera.bounds.y}, ${camera.bounds.width}, ${camera.bounds.height});`);
                    }
                }
                else {
                    lines.push(`    // Additional camera: ${camera.name}`);
                }
            });
        }
        // Add physics setup if enabled
        if (config.physics?.enabled) {
            lines.push(`    // Physics world setup`);
            if (config.physics.type === "arcade") {
                lines.push(`    // Arcade physics is enabled`);
            }
            else if (config.physics.type === "matter") {
                lines.push(`    // Matter.js physics is enabled`);
            }
        }
        // Add layers if specified
        if (config.layers && config.layers.length > 0) {
            lines.push(`    // Create layers`);
            config.layers.forEach(layer => {
                lines.push(`    const ${this.toCamelCase(layer.name)} = this.add.layer();`);
            });
        }
        if (lines.length === 0) {
            return "    // Initialize your game objects here";
        }
        return lines.join('\n');
    }
    /**
     * Generate update logic code
     */
    generateUpdateLogic(config) {
        const lines = [];
        // Add physics update if enabled
        if (config.physics?.enabled) {
            if (config.physics.type === "arcade") {
                lines.push("    // Update arcade physics");
                lines.push("    // this.physics.world.update(); // Usually handled automatically");
            }
        }
        if (lines.length === 0) {
            return "    // Update your game logic here";
        }
        return lines.join('\n');
    }
}
/**
 * Create Phaser integration instance
 */
export function createPhaserIntegration() {
    return new PhaserIntegration();
}
//# sourceMappingURL=phaser-integration.js.map