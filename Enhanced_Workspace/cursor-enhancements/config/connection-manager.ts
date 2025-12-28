/**
 * Connection Manager
 * 
 * Manages and pools connections to external services.
 */

import type { APIConfig } from './api-config';
import type { KnowledgeGraphConfig } from './database-config';

/**
 * Connection status
 */
export interface ConnectionStatus {
  service: string;
  connected: boolean;
  lastCheck: Date;
  error?: string;
}

/**
 * Connection Manager
 */
export class ConnectionManager {
  private apiConfig: APIConfig;
  private dbConfig: KnowledgeGraphConfig;
  private connections: Map<string, ConnectionStatus> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(apiConfig: APIConfig, dbConfig: KnowledgeGraphConfig) {
    this.apiConfig = apiConfig;
    this.dbConfig = dbConfig;
  }

  /**
   * Initialize all connections
   */
  async initialize(): Promise<void> {
    // Initialize API connections
    if (this.apiConfig.openai?.apiKey) {
      await this.checkConnection("openai", async () => {
        const response = await fetch(`${this.apiConfig.openai!.baseUrl}/models`, {
          headers: {
            'Authorization': `Bearer ${this.apiConfig.openai!.apiKey}`
          }
        });
        return response.ok;
      });
    }

    if (this.apiConfig.stabilityAI?.apiKey) {
      await this.checkConnection("stabilityAI", async () => {
        const response = await fetch(`${this.apiConfig.stabilityAI!.baseUrl}/user/account`, {
          headers: {
            'Authorization': `Bearer ${this.apiConfig.stabilityAI!.apiKey}`
          }
        });
        return response.ok;
      });
    }

    if (this.apiConfig.comfyUI?.baseUrl) {
      await this.checkConnection("comfyUI", async () => {
        const response = await fetch(`${this.apiConfig.comfyUI!.baseUrl}/system_stats`);
        return response.ok;
      });
    }

    // Initialize database connection
    await this.checkConnection("vectorDB", async () => {
      const { createVectorDBClient } = require('../integrations/knowledge-graph/vector-db-client');
      const client = createVectorDBClient(this.dbConfig.vectorDB);
      await client.connect();
      return true;
    });
  }

  /**
   * Check connection status
   */
  private async checkConnection(
    service: string,
    checkFn: () => Promise<boolean>
  ): Promise<void> {
    try {
      const connected = await checkFn();
      this.connections.set(service, {
        service,
        connected,
        lastCheck: new Date()
      });
    } catch (error) {
      this.connections.set(service, {
        service,
        connected: false,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get connection status
   */
  getStatus(service: string): ConnectionStatus | undefined {
    return this.connections.get(service);
  }

  /**
   * Get all connection statuses
   */
  getAllStatuses(): ConnectionStatus[] {
    return Array.from(this.connections.values());
  }

  /**
   * Start health check monitoring
   */
  startHealthChecks(intervalMs: number = 60000): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      await this.initialize();
    }, intervalMs);
  }

  /**
   * Stop health check monitoring
   */
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    this.stopHealthChecks();
    this.connections.clear();
  }
}

/**
 * Create connection manager
 */
export function createConnectionManager(
  apiConfig: APIConfig,
  dbConfig: KnowledgeGraphConfig
): ConnectionManager {
  return new ConnectionManager(apiConfig, dbConfig);
}









