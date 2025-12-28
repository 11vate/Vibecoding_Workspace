/**
 * Generate Asset Set Tool
 */

import type { MCPTool } from '../MCPServer.js';
import { AssetPipeline } from '../../pipeline/AssetPipeline.js';

export class GenerateAssetSetTool implements MCPTool {
  name = 'generate_asset_set';
  description = 'Generate complete asset set';
  inputSchema = {
    type: 'object',
    properties: {
      baseAsset: { type: 'string', description: 'Base asset description' },
      setType: { type: 'string', enum: ['directional', 'animation', 'color-variants'] },
    },
    required: ['baseAsset', 'setType'],
  };

  async execute(params: unknown): Promise<unknown> {
    const { baseAsset, setType } = params as {
      baseAsset: string;
      setType: 'directional' | 'animation' | 'color-variants';
    };

    const pipeline = new AssetPipeline();
    const results = await pipeline.generateAssetSet(baseAsset, setType);

    return {
      assets: results.map(r => ({
        success: r.success,
        spriteId: r.sprite?.id,
      })),
      count: results.length,
    };
  }
}







