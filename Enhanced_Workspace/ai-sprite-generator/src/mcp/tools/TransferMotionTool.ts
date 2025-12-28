/**
 * Transfer Motion Tool
 */

import type { MCPTool } from '../MCPServer.js';
import { MotionExtractor } from '../../motion/MotionExtractor.js';
import { MotionRetargeter } from '../../motion/MotionRetargeter.js';
import { readFile } from 'fs/promises';

export class TransferMotionTool implements MCPTool {
  name = 'transfer_motion';
  description = 'Transfer animation from reference to target sprite';
  inputSchema = {
    type: 'object',
    properties: {
      reference: { type: 'string', description: 'Path to reference sprite sheet' },
      target: { type: 'string', description: 'Target sprite description' },
      frames: { type: 'number', description: 'Number of frames' },
    },
    required: ['reference', 'target'],
  };

  async execute(params: unknown): Promise<unknown> {
    const { reference, target } = params as {
      reference: string;
      target: string;
    };

    const extractor = new MotionExtractor();
    const spriteSheet = await readFile(reference);
    const referenceSequence = await extractor.extractPoseSequence(spriteSheet, 64, 64);

    const retargeter = new MotionRetargeter();
    const resultFrames = await retargeter.transferMotion(
      referenceSequence,
      target,
      'pixel-art'
    );

    return {
      frames: resultFrames.map(f => ({
        id: f.id,
        width: f.width,
        height: f.height,
      })),
      frameCount: resultFrames.length,
    };
  }
}

