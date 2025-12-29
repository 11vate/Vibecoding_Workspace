/**
 * Local AI Service Layer
 * 
 * Provides privacy-preserving, local AI capabilities using Transformers.js.
 * Capable of running models directly in the browser or Node.js environment without external APIs.
 */

import { pipeline, env } from '@xenova/transformers';

// Configure to use local models if downloaded, or cache them
env.allowLocalModels = true;
// env.localModelPath = './models/'; // Uncomment if managing models locally

export interface AICompletionOptions {
  max_new_tokens?: number;
  temperature?: number;
  top_k?: number;
}

export class LocalAIService {
  private static instance: LocalAIService;
  private generator: any;
  private classifier: any;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): LocalAIService {
    if (!LocalAIService.instance) {
      LocalAIService.instance = new LocalAIService();
    }
    return LocalAIService.instance;
  }

  /**
   * Initialize the AI service
   * Downloads models if not cached
   */
  async initialize() {
    if (this.initialized) return;

    try {
      console.log('Initializing Local AI Service...');
      
      // Initialize code completion model (using a small model for demo/speed)
      // 'Xenova/codegen-350M-mono' or 'Xenova/tiny_starcoder_py' are options
      // For general text/code, we might use a quantized version
      this.generator = await pipeline('text-generation', 'Xenova/codegen-350M-mono');
      
      // Initialize sentiment/classification for vibe analysis
      this.classifier = await pipeline('sentiment-analysis');
      
      this.initialized = true;
      console.log('Local AI Service Initialized');
    } catch (error) {
      console.error('Failed to initialize Local AI Service:', error);
      throw error;
    }
  }

  /**
   * Generate code or text completion
   * @param prompt The input text/code
   * @param options Generation options
   */
  async completeCode(prompt: string, options: AICompletionOptions = {}) {
    if (!this.initialized) await this.initialize();

    const result = await this.generator(prompt, {
      max_new_tokens: options.max_new_tokens || 100,
      temperature: options.temperature || 0.7,
      top_k: options.top_k || 50,
      do_sample: true
    });

    return result[0].generated_text;
  }

  /**
   * Analyze the "vibe" (sentiment/tone) of text
   * @param text Input text
   */
  async analyzeVibe(text: string) {
    if (!this.initialized) await this.initialize();
    return await this.classifier(text);
  }

  /**
   * Extract features from text (for embeddings)
   * @param text Input text
   */
  async extractFeatures(text: string) {
    if (!this.initialized) await this.initialize();
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    return await extractor(text, { pooling: 'mean', normalize: true });
  }
}

export const aiService = LocalAIService.getInstance();
