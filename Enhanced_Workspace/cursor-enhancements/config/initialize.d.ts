/**
 * System Initialization
 *
 * Initializes all connections and services on startup.
 */
/**
 * System initialization result
 */
export interface InitializationResult {
    success: boolean;
    errors: string[];
    warnings: string[];
    services: {
        apis: string[];
        database: boolean;
        localModels: string[];
    };
}
/**
 * Initialize entire system
 */
export declare function initializeSystem(): Promise<InitializationResult>;
/**
 * Initialize knowledge graph system
 */
export declare function initializeKnowledgeGraph(): Promise<void>;
//# sourceMappingURL=initialize.d.ts.map