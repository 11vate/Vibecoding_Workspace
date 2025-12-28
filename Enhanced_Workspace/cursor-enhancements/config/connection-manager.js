/**
 * Connection Manager
 *
 * Manages and pools connections to external services.
 */
/**
 * Connection Manager
 */
export class ConnectionManager {
    apiConfig;
    dbConfig;
    connections = new Map();
    healthCheckInterval;
    constructor(apiConfig, dbConfig) {
        this.apiConfig = apiConfig;
        this.dbConfig = dbConfig;
    }
    /**
     * Initialize all connections
     */
    async initialize() {
        // Initialize API connections
        if (this.apiConfig.openai?.apiKey) {
            await this.checkConnection("openai", async () => {
                const response = await fetch(`${this.apiConfig.openai.baseUrl}/models`, {
                    headers: {
                        'Authorization': `Bearer ${this.apiConfig.openai.apiKey}`
                    }
                });
                return response.ok;
            });
        }
        if (this.apiConfig.stabilityAI?.apiKey) {
            await this.checkConnection("stabilityAI", async () => {
                const response = await fetch(`${this.apiConfig.stabilityAI.baseUrl}/user/account`, {
                    headers: {
                        'Authorization': `Bearer ${this.apiConfig.stabilityAI.apiKey}`
                    }
                });
                return response.ok;
            });
        }
        if (this.apiConfig.comfyUI?.baseUrl) {
            await this.checkConnection("comfyUI", async () => {
                const response = await fetch(`${this.apiConfig.comfyUI.baseUrl}/system_stats`);
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
    async checkConnection(service, checkFn) {
        try {
            const connected = await checkFn();
            this.connections.set(service, {
                service,
                connected,
                lastCheck: new Date()
            });
        }
        catch (error) {
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
    getStatus(service) {
        return this.connections.get(service);
    }
    /**
     * Get all connection statuses
     */
    getAllStatuses() {
        return Array.from(this.connections.values());
    }
    /**
     * Start health check monitoring
     */
    startHealthChecks(intervalMs = 60000) {
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
    stopHealthChecks() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = undefined;
        }
    }
    /**
     * Close all connections
     */
    async close() {
        this.stopHealthChecks();
        this.connections.clear();
    }
}
/**
 * Create connection manager
 */
export function createConnectionManager(apiConfig, dbConfig) {
    return new ConnectionManager(apiConfig, dbConfig);
}
//# sourceMappingURL=connection-manager.js.map