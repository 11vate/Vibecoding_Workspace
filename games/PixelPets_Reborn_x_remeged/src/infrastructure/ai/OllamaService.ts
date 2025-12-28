/**
 * Ollama AI Service
 * Integration with Ollama local LLM for AI-powered generation
 */

import { fetchWithTimeout } from '@/shared/utils/fetchWithTimeout';

const OLLAMA_BASE_URL =
  typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_OLLAMA_URL
    ? (import.meta as any).env.VITE_OLLAMA_URL
    : 'http://localhost:11434';

export interface OllamaRequest {
  model: string;
  prompt: string;
  format?: 'json';
  stream?: boolean;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export class OllamaService {
  private static defaultModel = 'llama3.2';

  /**
   * Check if Ollama is available
   */
  static async checkAvailable(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${OLLAMA_BASE_URL}/api/tags`, {
        method: 'GET',
        timeoutMs: 3000,
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Generate text using Ollama
   */
  static async generateText(prompt: string, model: string = this.defaultModel): Promise<string> {
    try {
      const response = await fetchWithTimeout(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt, format: 'json', stream: false }),
        timeoutMs: 10000,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data: OllamaResponse = await response.json();
        return data.response;
      }
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Ollama generation error:', error);
      throw error;
    }
  }

  /**
   * Generate JSON using Ollama with structured output
   */
  static async generateJSON<T>(prompt: string, model: string = this.defaultModel): Promise<T> {
    const responseText = await this.generateText(prompt, model);
    try {
      // Try to extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : responseText;
      return JSON.parse(jsonText) as T;
    } catch (error) {
      console.error('Failed to parse Ollama JSON response:', error);
      console.error('Response text:', responseText);
      throw new Error('Invalid JSON response from Ollama');
    }
  }
}





















