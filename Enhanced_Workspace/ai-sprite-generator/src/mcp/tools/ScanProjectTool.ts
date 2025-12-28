/**
 * Scan Project Tool
 */

import type { MCPTool } from '../MCPServer.js';
import { ProjectScanner } from '../../analysis/ProjectScanner.js';
import { MissingAssetDetector } from '../../analysis/MissingAssetDetector.js';

export class ScanProjectTool implements MCPTool {
  name = 'scan_project';
  description = 'Scan project for missing assets';
  inputSchema = {
    type: 'object',
    properties: {
      projectPath: { type: 'string', description: 'Path to game project' },
    },
    required: ['projectPath'],
  };

  async execute(params: unknown): Promise<unknown> {
    const { projectPath } = params as { projectPath: string };

    const scanner = new ProjectScanner();
    const analysis = await scanner.scanProject(projectPath);

    const detector = new MissingAssetDetector();
    const report = await detector.detectMissing(projectPath, analysis.assetReferences);

    return {
      engine: analysis.engine,
      missingAssets: report.missingAssets.length,
      existingAssets: report.existingAssets.length,
      missing: report.missingAssets.map(a => ({
        assetId: a.assetId,
        reason: a.reason,
      })),
    };
  }
}







