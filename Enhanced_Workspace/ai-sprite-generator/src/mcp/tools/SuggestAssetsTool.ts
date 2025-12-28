/**
 * Suggest Assets Tool
 */

import type { MCPTool } from '../MCPServer.js';
import { ProjectScanner } from '../../analysis/ProjectScanner.js';
import { MissingAssetDetector } from '../../analysis/MissingAssetDetector.js';
import { MissingAssetSuggester } from '../../analysis/MissingAssetSuggester.js';

export class SuggestAssetsTool implements MCPTool {
  name = 'suggest_assets';
  description = 'Suggest assets based on project analysis';
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

    const suggester = new MissingAssetSuggester();
    const suggestions = await suggester.suggestAssets(projectPath, report.missingAssets);

    return {
      suggestions: suggestions.map(s => ({
        assetId: s.assetId,
        prompt: s.prompt,
        confidence: s.confidence,
        type: s.type,
      })),
      count: suggestions.length,
    };
  }
}







