/**
 * ComfyUI Workflow Client
 * 
 * Integration with ComfyUI API for advanced workflow-based image generation.
 */

import type { GeneratedAsset, ImageGenerationParams } from '../../layer-36-multimodal-core';
import { retry, type RetryOptions } from '../../utils/retry';
import { validateDimensions } from '../../utils/validation';
import { z } from 'zod';

/**
 * ComfyUI configuration
 */
export interface ComfyUIConfig {
  baseUrl: string; // e.g., "http://localhost:8188"
  clientId?: string;
  retryOptions?: RetryOptions;
  enableLogging?: boolean;
  maxWaitTime?: number; // Max wait time for workflow completion in ms
  pollInterval?: number; // Polling interval in ms
  onProgress?: (progress: WorkflowProgress) => void;
}

/**
 * Workflow progress
 */
export interface WorkflowProgress {
  stage: "submitting" | "queued" | "executing" | "completed" | "failed";
  progress?: number; // 0-1
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
export class ComfyUIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ComfyUIError';
  }
}

/**
 * History response schema
 */
const HistoryResponseSchema = z.record(z.object({
  outputs: z.record(z.object({
    images: z.array(z.object({
      filename: z.string(),
      subfolder: z.string().optional(),
      type: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional()
    })).optional()
  })).optional()
}));

/**
 * ComfyUI Service
 */
export class ComfyUIService {
  private config: Required<Omit<ComfyUIConfig, 'retryOptions' | 'onProgress'>> & {
    retryOptions?: RetryOptions;
    onProgress?: (progress: WorkflowProgress) => void;
  };
  private queueUrl: string;
  private historyUrl: string;
  private viewUrl: string;
  private queueStatusUrl: string;

  constructor(config: ComfyUIConfig) {
    this.config = {
      clientId: config.clientId || this.generateClientId(),
      maxWaitTime: 120000, // 2 minutes default
      pollInterval: 1000, // 1 second default
      enableLogging: false,
      ...config
    };
    
    this.queueUrl = `${config.baseUrl}/prompt`;
    this.historyUrl = `${config.baseUrl}/history`;
    this.viewUrl = `${config.baseUrl}/view`;
    this.queueStatusUrl = `${config.baseUrl}/queue`;
  }

  /**
   * Log message if logging is enabled
   */
  private log(message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      console.log(`[ComfyUI] ${message}`, data || '');
    }
  }

  /**
   * Report progress
   */
  private reportProgress(progress: WorkflowProgress): void {
    if (this.config.onProgress) {
      this.config.onProgress(progress);
    }
    this.log(progress.stage, progress.message);
  }

  /**
   * Submit workflow to queue
   */
  private async submitWorkflow(workflow: Workflow): Promise<string> {
    const prompt: ComfyUIPrompt = {
      prompt: workflow,
      client_id: this.config.clientId
    };

    const retryOptions = this.config.retryOptions || {
      maxAttempts: 3,
      initialDelay: 1000
    };

    const result = await retry(async () => {
      this.log('Submitting workflow', { clientId: this.config.clientId });

      const response = await fetch(this.queueUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prompt)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ComfyUIError(
          `Failed to submit workflow: ${response.statusText}`,
          response.status,
          errorText
        );
      }

      const data = await response.json() as { prompt_id: string; error?: unknown };
      
      if (data.error) {
        throw new ComfyUIError(
          `Workflow submission error: ${JSON.stringify(data.error)}`,
          undefined,
          data.error
        );
      }

      if (!data.prompt_id) {
        throw new ComfyUIError('No prompt_id in response');
      }

      return data.prompt_id;
    }, retryOptions);

    if (!result.success || !result.result) {
      throw result.error || new ComfyUIError('Failed to submit workflow after retries');
    }

    return result.result;
  }

  /**
   * Execute workflow
   */
  async executeWorkflow(workflow: Workflow): Promise<GeneratedAsset> {
    try {
      this.reportProgress({ stage: "submitting", message: "Submitting workflow" });

      const promptId = await this.submitWorkflow(workflow);

      this.reportProgress({ 
        stage: "queued", 
        message: "Workflow queued",
        promptId 
      });

      // Poll for completion
      const result = await this.waitForCompletion(promptId);

      return result;
    } catch (error) {
      this.reportProgress({ 
        stage: "failed", 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
      this.log('Workflow execution failed', error);
      if (error instanceof ComfyUIError) {
        throw error;
      }
      throw new ComfyUIError(
        `Failed to execute workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      );
    }
  }

  /**
   * Generate sprite using predefined workflow
   */
  async generateSprite(params: ImageGenerationParams): Promise<GeneratedAsset> {
    try {
      // Validate parameters
      const dimValidation = validateDimensions(
        params.resolution[0],
        params.resolution[1],
        16,
        16,
        2048,
        2048
      );
      if (!dimValidation.valid) {
        throw new ComfyUIError(dimValidation.error || 'Invalid dimensions');
      }

      const workflow = this.createSpriteWorkflow(params);
      return this.executeWorkflow(workflow);
    } catch (error) {
      this.log('Sprite generation failed', error);
      if (error instanceof ComfyUIError) {
        throw error;
      }
      throw new ComfyUIError(
        `Failed to generate sprite: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      );
    }
  }

  /**
   * Create sprite generation workflow
   */
  private createSpriteWorkflow(params: ImageGenerationParams): Workflow {
    // This is a simplified example - actual ComfyUI workflows are more complex
    // and depend on the specific nodes and models available
    
    const workflow: Workflow = {
      "1": {
        id: 1,
        type: "CheckpointLoaderSimple",
        inputs: {
          ckpt_name: "model.safetensors" // Would use actual model name
        },
        class_type: "CheckpointLoaderSimple"
      },
      "2": {
        id: 2,
        type: "CLIPTextEncode",
        inputs: {
          text: params.prompt,
          clip: ["1", 1]
        },
        class_type: "CLIPTextEncode"
      },
      "3": {
        id: 3,
        type: "EmptyLatentImage",
        inputs: {
          width: params.resolution[0],
          height: params.resolution[1],
          batch_size: 1
        },
        class_type: "EmptyLatentImage"
      },
      "4": {
        id: 4,
        type: "KSampler",
        inputs: {
          seed: params.seed || Math.floor(Math.random() * 1000000),
          steps: 20,
          cfg: 7.0,
          sampler_name: "euler",
          scheduler: "normal",
          denoise: 1.0,
          model: ["1", 0],
          positive: ["2", 0],
          negative: ["2", 0],
          latent_image: ["3", 0]
        },
        class_type: "KSampler"
      },
      "5": {
        id: 5,
        type: "VAEDecode",
        inputs: {
          samples: ["4", 0],
          vae: ["1", 2]
        },
        class_type: "VAEDecode"
      },
      "6": {
        id: 6,
        type: "SaveImage",
        inputs: {
          filename_prefix: "sprite",
          images: ["5", 0]
        },
        class_type: "SaveImage"
      }
    };

    return workflow;
  }

  /**
   * Check queue status
   */
  private async checkQueueStatus(): Promise<{ running: string[]; pending: string[] }> {
    try {
      const response = await fetch(this.queueStatusUrl);
      if (!response.ok) {
        return { running: [], pending: [] };
      }
      const data = await response.json() as {
        queue_running: Array<{ prompt: string[] }>;
        queue_pending: Array<{ prompt: string[] }>;
      };
      return {
        running: data.queue_running?.map(item => item.prompt[0]).filter(Boolean) || [],
        pending: data.queue_pending?.map(item => item.prompt[0]).filter(Boolean) || []
      };
    } catch (error) {
      this.log('Failed to check queue status', error);
      return { running: [], pending: [] };
    }
  }

  /**
   * Wait for workflow completion
   */
  private async waitForCompletion(promptId: string): Promise<GeneratedAsset> {
    const startTime = Date.now();
    const maxWait = this.config.maxWaitTime;
    const pollInterval = this.config.pollInterval;
    let lastStatus = "queued";

    while (Date.now() - startTime < maxWait) {
      // Check queue status
      const queueStatus = await this.checkQueueStatus();
      const isRunning = queueStatus.running.includes(promptId);
      const isPending = queueStatus.pending.includes(promptId);

      if (isRunning && lastStatus !== "executing") {
        this.reportProgress({
          stage: "executing",
          message: "Workflow executing",
          promptId
        });
        lastStatus = "executing";
      } else if (isPending && lastStatus !== "queued") {
        this.reportProgress({
          stage: "queued",
          message: "Workflow in queue",
          promptId
        });
        lastStatus = "queued";
      }

      // Check history for completed workflow
      try {
        const historyResponse = await fetch(this.historyUrl);
        if (!historyResponse.ok) {
          throw new ComfyUIError(
            `Failed to fetch history: ${historyResponse.statusText}`,
            historyResponse.status
          );
        }

        const history = await historyResponse.json() as unknown;
        const validation = HistoryResponseSchema.safeParse(history);

        if (validation.success && validation.data[promptId]) {
          const workflowData = validation.data[promptId];
          const outputs = workflowData.outputs || {};

          // Find image node
          const imageNode = Object.keys(outputs).find(key => 
            outputs[key]?.images && outputs[key].images!.length > 0
          );

          if (imageNode) {
            const imageInfo = outputs[imageNode]!.images![0];
            const imageUrl = `${this.viewUrl}?filename=${imageInfo.filename}&subfolder=${imageInfo.subfolder || ''}&type=${imageInfo.type || 'output'}`;

            this.reportProgress({
              stage: "completed",
              progress: 1.0,
              message: "Workflow completed",
              promptId
            });

            // Fetch image with retry
            const imageResult = await retry(async () => {
              const imageResponse = await fetch(imageUrl);
              if (!imageResponse.ok) {
                throw new ComfyUIError(
                  `Failed to fetch image: ${imageResponse.statusText}`,
                  imageResponse.status
                );
              }
              return Buffer.from(await imageResponse.arrayBuffer());
            }, {
              maxAttempts: 3,
              initialDelay: 1000
            });

            if (!imageResult.success || !imageResult.result) {
              throw new ComfyUIError('Failed to download generated image');
            }

            const imageBuffer = imageResult.result;

            return {
              type: "sprite",
              data: imageBuffer,
              metadata: {
                id: this.generateId(),
                name: `comfyui_${promptId}`,
                dimensions: {
                  width: imageInfo.width || 512,
                  height: imageInfo.height || 512
                },
                format: "png",
                palette: {
                  dominant: [],
                  all: [],
                  count: 0,
                  style: "unknown"
                },
                tags: ["comfyui"],
                createdAt: new Date().toISOString()
              }
            };
          }
        }
      } catch (error) {
        // Log but continue polling
        this.log('Error checking history', error);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new ComfyUIError(
      `Workflow execution timeout after ${maxWait}ms`,
      undefined,
      { promptId, elapsed: Date.now() - startTime }
    );
  }

  /**
   * Generate client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `comfyui_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

/**
 * Create ComfyUI service instance
 */
export function createComfyUIService(config: ComfyUIConfig): ComfyUIService {
  return new ComfyUIService(config);
}

