/**
 * Generate Sprite Tool
 */

import type { MCPTool } from '../MCPServer.js';
import { AssetPipeline } from '../../pipeline/AssetPipeline.js';

export class GenerateSpriteTool implements MCPTool {
  name = 'generate_sprite';
  description = 'Generate a sprite from a text description';
  inputSchema = {
    type: 'object',
    properties: {
      concept: { type: 'string', description: 'Sprite description' },
      style: { type: 'string', enum: ['pixel-art', 'cartoon', 'hand-drawn'] },
      frames: { type: 'number', description: 'Number of frames for animation' },
      engine: { type: 'string', enum: ['phaser', 'pixijs', 'custom'] },
    },
    required: ['concept'],
  };

  async execute(params: unknown): Promise<unknown> {
    const { concept, engine } = params as {
      concept: string;
      engine?: string;
    };

    const pipeline = new AssetPipeline();
    const result = await pipeline.execute(concept, {
      enablePostProcessing: true,
      enableValidation: true,
      enableExport: true,
      targetEngine: engine as any,
    });

    if (!result.success) {
      throw new Error(`Generation failed: ${result.errors.join(', ')}`);
    }

    return {
      sprite: result.sprite ? {
        id: result.sprite.id,
        width: result.sprite.width,
        height: result.sprite.height,
      } : null,
      metadata: result.metadata,
      success: result.success,
    };
  }
}

