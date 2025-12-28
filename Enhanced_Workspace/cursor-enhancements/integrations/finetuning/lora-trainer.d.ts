/**
 * LoRA Trainer for Stable Diffusion
 *
 * Fine-tuning utilities for creating custom pixel art models.
 */
/**
 * LoRA training configuration
 */
export interface LoRATrainingConfig {
    baseModel: string;
    datasetPath: string;
    outputPath: string;
    loraRank?: number;
    loraAlpha?: number;
    trainingSteps?: number;
    learningRate?: number;
    batchSize?: number;
    resolution?: number;
    enableLogging?: boolean;
}
/**
 * Training progress
 */
export interface TrainingProgress {
    step: number;
    totalSteps: number;
    loss: number;
    epoch: number;
    message?: string;
}
/**
 * LoRA Trainer
 */
export declare class LoRATrainer {
    private config;
    constructor(config: LoRATrainingConfig);
    /**
     * Prepare dataset for training
     */
    prepareDataset(): Promise<void>;
    /**
     * Train LoRA model
     */
    train(onProgress?: (progress: TrainingProgress) => void): Promise<string>;
    /**
     * Validate training configuration
     */
    validateConfig(): {
        valid: boolean;
        errors: string[];
    };
}
/**
 * Create LoRA trainer
 */
export declare function createLoRATrainer(config: LoRATrainingConfig): LoRATrainer;
//# sourceMappingURL=lora-trainer.d.ts.map