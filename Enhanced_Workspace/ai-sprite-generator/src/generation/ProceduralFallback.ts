/**
 * Procedural Fallback Generator
 * 
 * Fallback procedural sprite generation when AI is unavailable.
 * Uses canvas-based generation similar to Pixel Pets SpriteGenerator.
 */

import type { GenerationParams, GeneratedSprite } from '../types/index.js';

/**
 * Procedural Fallback Generator
 * 
 * Generates sprites procedurally when AI models are unavailable.
 */
export class ProceduralFallback {
  private readonly DEFAULT_WIDTH = 128;
  private readonly DEFAULT_HEIGHT = 128;

  /**
   * Generate sprite procedurally
   */
  async generateSprite(params: GenerationParams): Promise<GeneratedSprite> {
    // This is a simplified version - in production, this would use
    // a more sophisticated procedural generation system
    // For now, we'll create a placeholder that indicates procedural generation
    
    const width = params.resolution[0] || this.DEFAULT_WIDTH;
    const height = params.resolution[1] || this.DEFAULT_HEIGHT;

    // In a browser environment, we could use canvas
    // In Node.js, we'll use a simple placeholder or Sharp
    const buffer = await this.createProceduralSprite(params, width, height);

    return {
      id: `procedural_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      data: buffer,
      width,
      height,
      format: 'png',
      metadata: {
        entity: params.entity,
        style: params.style,
        theme: params.theme,
        action: params.action,
        frameCount: params.frameCount,
        perspective: params.perspective,
        tags: ['procedural', params.style, params.entity],
        createdAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Create procedural sprite buffer
   * 
   * Note: This is a placeholder. In production, this would generate
   * actual procedural sprites using canvas or image libraries.
   */
  private async createProceduralSprite(
    params: GenerationParams,
    width: number,
    height: number
  ): Promise<Buffer> {
    // For now, return a minimal valid PNG buffer
    // In production, this would use Sharp or canvas to generate actual sprites
    
    // Create a simple colored square as placeholder
    // This would be replaced with actual procedural generation
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default;
    
    const color = this.getColorForTheme(params.theme || 'default');
    
    const image = sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: color.r, g: color.g, b: color.b, alpha: 1 }
      }
    });

    return image.png().toBuffer();
  }

  /**
   * Get color for theme
   */
  private getColorForTheme(theme: string): { r: number; g: number; b: number } {
    const themeColors: Record<string, { r: number; g: number; b: number }> = {
      fire: { r: 255, g: 100, b: 50 },
      water: { r: 50, g: 150, b: 255 },
      earth: { r: 139, g: 115, b: 85 },
      air: { r: 200, g: 220, b: 255 },
      default: { r: 128, g: 128, b: 128 },
    };

    const lowerTheme = theme.toLowerCase();
    for (const [key, color] of Object.entries(themeColors)) {
      if (lowerTheme.includes(key)) {
        return color;
      }
    }

    return themeColors.default;
  }
}

