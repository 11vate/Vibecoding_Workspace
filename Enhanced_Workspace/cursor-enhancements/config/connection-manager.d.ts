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
export declare class ConnectionManager {
    private apiConfig;
    private dbConfig;
    private connections;
    private healthCheckInterval?;
    constructor(apiConfig: APIConfig, dbConfig: KnowledgeGraphConfig);
    /**
     * Initialize all connections
     */
    initialize(): Promise<void>;
    /**
     * Check connection status
     */
    private checkConnection;
    /**
     * Get connection status
     */
    getStatus(service: string): ConnectionStatus | undefined;
    /**
     * Get all connection statuses
     */
    getAllStatuses(): ConnectionStatus[];
    /**
     * Start health check monitoring
     */
    startHealthChecks(intervalMs?: number): void;
    /**
     * Stop health check monitoring
     */
    stopHealthChecks(): void;
    /**
     * Close all connections
     */
    close(): Promise<void>;
}
/**
 * Create connection manager
 */
export declare function createConnectionManager(apiConfig: APIConfig, dbConfig: KnowledgeGraphConfig): ConnectionManager;
//# sourceMappingURL=connection-manager.d.ts.map