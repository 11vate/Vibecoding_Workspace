/**
 * AI Service
 * Main interface for AI-powered generation with Ollama + procedural fallback
 */

import { OllamaService } from './OllamaService';

export interface AIGenerationOptions {
  useAI?: boolean; // Force AI usage (will throw if unavailable)
  fallbackToProcedural?: boolean; // Use procedural if AI unavailable (default: true)
}

export class AIService {
  private static ollamaAvailable: boolean | null = null;
  private static lastCheckTime: number = 0;
  private static readonly CHECK_CACHE_MS = 60000; // Cache availability check for 1 minute

  /**
   * Check if AI (Ollama) is available
   */
  static async isAvailable(): Promise<boolean> {
    const now = Date.now();
    if (this.ollamaAvailable === null || now - this.lastCheckTime > this.CHECK_CACHE_MS) {
      this.ollamaAvailable = await OllamaService.checkAvailable();
      this.lastCheckTime = now;
    }
    return this.ollamaAvailable;
  }

  /**
   * Generate text with AI (with fallback support)
   */
  static async generateText(
    prompt: string,
    proceduralFallback: () => string,
    options: AIGenerationOptions = {}
  ): Promise<string> {
    const { useAI = false, fallbackToProcedural = true } = options;

    if (useAI) {
      const available = await this.isAvailable();
      if (!available) {
        throw new Error('AI service requested but unavailable');
      }
      return OllamaService.generateText(prompt);
    }

    // Try AI if available, fallback to procedural
    const available = await this.isAvailable();
    if (available) {
      try {
        return await OllamaService.generateText(prompt);
      } catch (error) {
        console.warn('AI generation failed, falling back to procedural:', error);
        if (!fallbackToProcedural) {
          throw error;
        }
      }
    }

    // Procedural fallback
    return proceduralFallback();
  }

  /**
   * Generate JSON with AI (with fallback support)
   */
  static async generateJSON<T>(
    prompt: string,
    proceduralFallback: () => T,
    options: AIGenerationOptions = {}
  ): Promise<T> {
    const { useAI = false, fallbackToProcedural = true } = options;

    if (useAI) {
      const available = await this.isAvailable();
      if (!available) {
        throw new Error('AI service requested but unavailable');
      }
      return OllamaService.generateJSON<T>(prompt);
    }

    // Try AI if available, fallback to procedural
    const available = await this.isAvailable();
    if (available) {
      try {
        return await OllamaService.generateJSON<T>(prompt);
      } catch (error) {
        console.warn('AI JSON generation failed, falling back to procedural:', error);
        if (!fallbackToProcedural) {
          throw error;
        }
      }
    }

    // Procedural fallback
    return proceduralFallback();
  }
}





















