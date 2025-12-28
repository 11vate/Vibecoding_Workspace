/**
 * API Configuration Management
 *
 * Centralized configuration for all external API connections.
 */
/**
 * API Configuration
 */
export interface APIConfig {
    openai?: {
        apiKey: string;
        baseUrl?: string;
        maxRetries?: number;
    };
    stabilityAI?: {
        apiKey: string;
        baseUrl?: string;
        maxRetries?: number;
    };
    leonardoAI?: {
        apiKey: string;
        baseUrl?: string;
        maxRetries?: number;
    };
    spriteSage?: {
        apiKey: string;
        baseUrl?: string;
        maxRetries?: number;
    };
    comfyUI?: {
        baseUrl: string;
        clientId?: string;
        maxWaitTime?: number;
        pollInterval?: number;
    };
}
/**
 * Load API configuration from environment variables
 */
export declare function loadAPIConfig(): APIConfig;
/**
 * Validate API configuration
 */
export declare function validateAPIConfig(config: APIConfig): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
//# sourceMappingURL=api-config.d.ts.map