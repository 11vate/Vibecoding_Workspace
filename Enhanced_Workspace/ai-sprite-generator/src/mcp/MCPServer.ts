/**
 * MCP Server
 * 
 * Model Context Protocol server implementation (JSON-RPC 2.0).
 */

/**
 * MCP Request
 */
export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: unknown;
}

/**
 * MCP Response
 */
export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: MCPError;
}

/**
 * MCP Error
 */
export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * MCP Tool
 */
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (params: unknown) => Promise<unknown>;
}

/**
 * MCP Server
 */
export class MCPServer {
  private tools: Map<string, MCPTool> = new Map();

  /**
   * Register tool
   */
  registerTool(tool: MCPTool): void {
    this.tools.set(tool.name, tool);
  }

  /**
   * Handle MCP request
   */
  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      if (request.method === 'tools/list') {
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: Array.from(this.tools.values()).map(tool => ({
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
            })),
          },
        };
      }

      if (request.method === 'tools/call') {
        const params = request.params as { name: string; arguments?: unknown };
        const tool = this.tools.get(params.name);

        if (!tool) {
          return {
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32601,
              message: `Tool ${params.name} not found`,
            },
          };
        }

        const result = await tool.execute(params.arguments || {});
        return {
          jsonrpc: '2.0',
          id: request.id,
          result,
        };
      }

      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: `Method not found: ${request.method}`,
        },
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32603,
          message: 'Internal error',
          data: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Get all registered tools
   */
  getTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }
}







