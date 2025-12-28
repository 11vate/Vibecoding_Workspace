/**
 * ComfyUI Workflow Client
 *
 * Integration with ComfyUI API for advanced workflow-based image generation.
 */
import type { GeneratedAsset, ImageGenerationParams } from '../../layer-36-multimodal-core';
import { type RetryOptions } from '../../utils/retry';
/**
 * ComfyUI configuration
 */
export interface ComfyUIConfig {
    baseUrl: string;
    clientId?: string;
    retryOptions?: RetryOptions;
    enableLogging?: boolean;
    maxWaitTime?: number;
    pollInterval?: number;
    onProgress?: (progress: WorkflowProgress) => void;
}
/**
 * Workflow progress
 */
export interface WorkflowProgress {
    stage: "submitting" | "queued" | "executing" | "completed" | "failed";
    progress?: number;
    message?: string;
    promptId?: string;
}
/**
 * ComfyUI workflow node
 */
export interface WorkflowNode {
    id: number;
    type: string;
    inputs: Record<string, unknown>;
    class_type: string;
}
/**
 * ComfyUI workflow
 */
export interface Workflow {
    [nodeId: string]: WorkflowNode;
}
/**
 * ComfyUI prompt (workflow format)
 */
export interface ComfyUIPrompt {
    prompt: Workflow;
    client_id?: string;
}
/**
 * ComfyUI API Error
 */
export declare class ComfyUIError extends Error {
    statusCode?: number | undefined;
    details?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, details?: unknown | undefined);
}
/**
 * ComfyUI Service
 */
export declare class ComfyUIService {
    private config;
    private queueUrl;
    private historyUrl;
    private viewUrl;
    private queueStatusUrl;
    constructor(config: ComfyUIConfig);
    /**
     * Log message if logging is enabled
     */
    private log;
    /**
     * Report progress
     */
    private reportProgress;
    /**
     * Submit workflow to queue
     */
    private submitWorkflow;
    /**
     * Execute workflow
     */
    executeWorkflow(workflow: Workflow): Promise<GeneratedAsset>;
    /**
     * Generate sprite using predefined workflow
     */
    generateSprite(params: ImageGenerationParams): Promise<GeneratedAsset>;
    /**
     * Create sprite generation workflow
     */
    private createSpriteWorkflow;
    /**
     * Check queue status
     */
    private checkQueueStatus;
    /**
     * Wait for workflow completion
     */
    private waitForCompletion;
    /**
     * Generate client ID
     */
    private generateClientId;
    /**
     * Generate unique ID
     */
    private generateId;
}
/**
 * Create ComfyUI service instance
 */
export declare function createComfyUIService(config: ComfyUIConfig): ComfyUIService;
//# sourceMappingURL=comfyui-client.d.ts.map