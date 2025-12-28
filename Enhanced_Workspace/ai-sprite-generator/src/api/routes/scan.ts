/**
 * Scan route
 */

import { Router } from 'express';
import type { Server as SocketIOServer } from 'socket.io';
import { ProjectScanner } from '../../analysis/ProjectScanner.js';
import { MissingAssetDetector } from '../../analysis/MissingAssetDetector.js';
import { MissingAssetSuggester } from '../../analysis/MissingAssetSuggester.js';

export function scanRoute(io: SocketIOServer): Router {
  const router = Router();

  router.post('/', async (req, res) => {
    const { projectPath, suggest } = req.body;

    if (!projectPath) {
      return res.status(400).json({ error: 'projectPath is required' });
    }

    const socketId = req.headers['x-socket-id'] as string;
    const socket = socketId ? io.sockets.sockets.get(socketId) : null;

    try {
      socket?.emit('progress', { stage: 'scanning', progress: 20 });

      const scanner = new ProjectScanner();
      const analysis = await scanner.scanProject(projectPath);

      socket?.emit('progress', { stage: 'detecting', progress: 50 });

      const detector = new MissingAssetDetector();
      const report = await detector.detectMissing(projectPath, analysis.assetReferences);

      let suggestions: any[] = [];
      if (suggest) {
        socket?.emit('progress', { stage: 'suggesting', progress: 80 });
        const suggester = new MissingAssetSuggester();
        suggestions = await suggester.suggestAssets(projectPath, report.missingAssets);
      }

      socket?.emit('progress', { stage: 'completed', progress: 100 });

      return res.json({
        engine: analysis.engine,
        projectPath: analysis.projectPath,
        missingAssets: report.missingAssets.length,
        existingAssets: report.existingAssets.length,
        totalReferences: report.totalReferences,
        missing: report.missingAssets,
        suggestions,
        warnings: [...report.warnings, ...analysis.warnings],
      });
    } catch (error) {
      socket?.emit('progress', { stage: 'failed', progress: 100 });
      res.status(500).json({
        error: 'Scan failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      return;
    }
  });

  return router;
}

