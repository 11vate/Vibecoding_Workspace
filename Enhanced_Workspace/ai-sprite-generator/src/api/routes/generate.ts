/**
 * Generate route
 */

import { Router } from 'express';
import type { Server as SocketIOServer } from 'socket.io';
import { AssetPipeline } from '../../pipeline/AssetPipeline.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export function generateRoute(io: SocketIOServer): Router {
  const router = Router();
  const pipeline = new AssetPipeline();

  router.post('/', async (req, res) => {
    const { concept, engine, output } = req.body;

    if (!concept) {
      return res.status(400).json({ error: 'Concept is required' });
    }

    const socketId = req.headers['x-socket-id'] as string;
    const socket = socketId ? io.sockets.sockets.get(socketId) : null;

    try {
      // Emit progress
      socket?.emit('progress', { stage: 'interpreting', progress: 10 });

      const config = {
        enablePostProcessing: true,
        enableValidation: true,
        enableExport: true,
        targetEngine: engine || 'phaser',
      };

      socket?.emit('progress', { stage: 'generating', progress: 30 });

      const result = await pipeline.execute(concept, config);

      if (!result.success) {
        socket?.emit('progress', { stage: 'failed', progress: 100 });
        return res.status(500).json({
          error: 'Generation failed',
          errors: result.errors,
          warnings: result.warnings,
        });
      }

      socket?.emit('progress', { stage: 'saving', progress: 80 });

      // Save assets
      const outputDir = output || 'assets';
      await mkdir(outputDir, { recursive: true });
      await mkdir(join(outputDir, 'sprites'), { recursive: true });
      await mkdir(join(outputDir, 'sheets'), { recursive: true });
      await mkdir(join(outputDir, 'metadata'), { recursive: true });

      let spriteUrl: string | undefined;
      if (result.sprite) {
        const spritePath = join(outputDir, 'sprites', `${result.sprite.id}.png`);
        await writeFile(spritePath, result.sprite.data);
        spriteUrl = `/assets/sprites/${result.sprite.id}.png`;
      }

      if (result.sheet && result.metadata) {
        const sheetPath = join(outputDir, 'sheets', `${result.sprite!.id}_sheet.png`);
        await writeFile(sheetPath, result.sheet);
      }

      socket?.emit('progress', { stage: 'completed', progress: 100 });

      return res.json({
        success: true,
        sprite: result.sprite,
        spriteUrl,
        metadata: result.metadata,
        codeBindings: result.codeBindings,
      });
    } catch (error) {
      socket?.emit('progress', { stage: 'failed', progress: 100 });
      res.status(500).json({
        error: 'Generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      return;
    }
  });

  return router;
}

