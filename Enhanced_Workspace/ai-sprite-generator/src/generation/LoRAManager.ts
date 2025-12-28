/**
 * LoRA Manager
 * 
 * Manages LoRA loading and application for style-specific generation.
 */

/**
 * LoRA configuration
 */
export interface LoRAConfig {
  name: string;
  path: string;
  weight: number;
  triggerWords?: string[];
}

/**
 * LoRA Manager
 * 
 * Manages LoRA models for style-specific generation.
 */
export class LoRAManager {
  private loras: Map<string, LoRAConfig> = new Map();

  /**
   * Register a LoRA
   */
  registerLoRA(config: LoRAConfig): void {
    this.loras.set(config.name, config);
  }

  /**
   * Get LoRA configuration by name
   */
  getLoRA(name: string): LoRAConfig | undefined {
    return this.loras.get(name);
  }

  /**
   * Get all registered LoRAs
   */
  getAllLoRAs(): LoRAConfig[] {
    return Array.from(this.loras.values());
  }

  /**
   * Check if LoRA is registered
   */
  hasLoRA(name: string): boolean {
    return this.loras.has(name);
  }

  /**
   * Initialize default LoRAs
   */
  initializeDefaults(): void {
    // Pixel Art XL LoRA
    this.registerLoRA({
      name: 'pixel-art-xl',
      path: 'models/loras/pixel-art-xl.safetensors',
      weight: 0.8,
      triggerWords: ['pixel art', '8-bit', 'retro'],
    });

    // Cartoon LoRA
    this.registerLoRA({
      name: 'cartoon-lora',
      path: 'models/loras/cartoon-lora.safetensors',
      weight: 0.7,
      triggerWords: ['cartoon', 'animated'],
    });
  }
}







