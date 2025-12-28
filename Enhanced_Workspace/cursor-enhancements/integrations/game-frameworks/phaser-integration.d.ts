/**
 * Phaser Integration
 *
 * Phaser-specific helpers and code generation utilities.
 */
import type { SceneConfig, AnimationControllerConfig, GeneratedCode } from '../../layer-37-game-frameworks';
/**
 * Phaser integration service
 */
export declare class PhaserIntegration {
    /**
     * Generate Phaser scene class
     */
    generateScene(config: SceneConfig): GeneratedCode;
    /**
     * Generate animation controller
     */
    generateAnimationController(config: AnimationControllerConfig): GeneratedCode;
    /**
     * Generate sprite loader
     */
    generateSpriteLoader(spriteSheets: Array<{
        name: string;
        path: string;
        frameWidth: number;
        frameHeight: number;
        spacing?: number;
        margin?: number;
    }>): GeneratedCode;
    /**
     * Generate game configuration
     */
    generateGameConfig(config: {
        width: number;
        height: number;
        parent?: string;
        backgroundColor?: string;
        physics?: {
            type: "arcade" | "matter";
            gravity?: {
                x: number;
                y: number;
            };
            debug?: boolean;
        };
        scenes: string[];
        scale?: {
            mode?: "FIT" | "WIDTH_CONTROLS_HEIGHT" | "HEIGHT_CONTROLS_WIDTH" | "RESIZE" | "SMOOTH";
            autoCenter?: "CENTER_BOTH" | "CENTER_HORIZONTALLY" | "CENTER_VERTICALLY" | "NO_CENTER";
        };
    }): GeneratedCode;
    private toPascalCase;
    private toCamelCase;
    /**
     * Generate load assets code
     */
    private generateLoadAssets;
    /**
     * Generate create content code
     */
    private generateCreateContent;
    /**
     * Generate update logic code
     */
    private generateUpdateLogic;
}
/**
 * Create Phaser integration instance
 */
export declare function createPhaserIntegration(): PhaserIntegration;
//# sourceMappingURL=phaser-integration.d.ts.map