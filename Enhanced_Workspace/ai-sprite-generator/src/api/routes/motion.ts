/**
 * Motion transfer route
 */

import { Router } from 'express';
import type { Server as SocketIOServer } from 'socket.io';
import { MotionExtractor } from '../../motion/MotionExtractor.js';
import { MotionRetargeter } from '../../motion/MotionRetargeter.js';
import { readFile } from 'fs/promises';

export function motionRoute(io: SocketIOServer): Router {
  const router = Router();

  router.post('/', async (req, res) => {
    const { referencePath, targetDescription, style, frameWidth, frameHeight, options } = req.body;

    if (!referencePath || !targetDescription) {
      return res.status(400).json({ error: 'referencePath and targetDescription are required' });
    }

    const socketId = req.headers['x-socket-id'] as string;
    const socket = socketId ? io.sockets.sockets.get(socketId) : null;

    try {
      socket?.emit('progress', { stage: 'extracting', progress: 20 });

      const extractor = new MotionExtractor();
      const spriteSheet = await readFile(referencePath);
      const referenceSequence = await extractor.extractPoseSequence(
        spriteSheet,
        frameWidth || 64,
        frameHeight || 64
      );

      socket?.emit('progress', { stage: 'transferring', progress: 50 });

      const retargeter = new MotionRetargeter();
      const frames = await retargeter.transferMotion(
        referenceSequence,
        targetDescription,
        style || 'pixel-art',
        options || {}
      );

      socket?.emit('progress', { stage: 'completed', progress: 100 });

      return res.json({
        success: true,
        frames: frames.map((f) => ({
          id: f.id,
          width: f.width,
          height: f.height,
        })),
        frameCount: frames.length,
      });
    } catch (error) {
      socket?.emit('progress', { stage: 'failed', progress: 100 });
      res.status(500).json({
        error: 'Motion transfer failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      return;
    }
  });

  return router;
}

