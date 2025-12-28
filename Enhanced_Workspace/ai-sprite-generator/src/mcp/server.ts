/**
 * MCP Server entry point
 */

import { MCPServer } from './MCPServer.js';
import { GenerateSpriteTool } from './tools/GenerateSpriteTool.js';
import { ScanProjectTool } from './tools/ScanProjectTool.js';
import { TransferMotionTool } from './tools/TransferMotionTool.js';
import { GenerateAssetSetTool } from './tools/GenerateAssetSetTool.js';
import { SuggestAssetsTool } from './tools/SuggestAssetsTool.js';

const server = new MCPServer();

// Register tools
server.registerTool(new GenerateSpriteTool());
server.registerTool(new ScanProjectTool());
server.registerTool(new TransferMotionTool());
server.registerTool(new GenerateAssetSetTool());
server.registerTool(new SuggestAssetsTool());

// Handle stdin/stdout for JSON-RPC
process.stdin.setEncoding('utf8');

let buffer = '';

process.stdin.on('data', async (chunk: string) => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (line.trim()) {
      try {
        const request = JSON.parse(line);
        const response = await server.handleRequest(request);
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (error) {
        const errorResponse = {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32700,
            message: 'Parse error',
            data: error instanceof Error ? error.message : 'Unknown error',
          },
        };
        process.stdout.write(JSON.stringify(errorResponse) + '\n');
      }
    }
  }
});

process.stdin.on('end', () => {
  process.exit(0);
});







