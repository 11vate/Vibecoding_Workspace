/**
 * Ollama Vision Integration
 * 
 * Vision model wrapper using Ollama's vision models (Llava, Bakllava).
 * Completely free, no API keys required.
 */

import { createOllamaClient, type OllamaClient, type OllamaConfig } from './ollama-client';
import type { ImageAnalysis, SpriteSheetAnalysis, DetectedObject, ColorPalette } from '../../layer-36-multimodal-core';
import { validateImageBuffer } from '../../utils/validation';

/**
 * Ollama Vision configuration
 */
export interface OllamaVisionConfig extends OllamaConfig {
  visionModel?: string; // e.g., "llava:latest", "bakllava:latest"
  enableImageAnalysis?: boolean;
}

/**
 * Ollama Vision Service
 */
export class OllamaVisionService {
  private client: OllamaClient;
  private config: Required<Omit<OllamaVisionConfig, 'retryOptions'>> & {
    retryOptions?: OllamaConfig['retryOptions'];
  };

  constructor(config: OllamaVisionConfig = {}) {
    this.config = {
      visionModel: config.visionModel || process.env.OLLAMA_VISION_MODEL || "llava:latest",
      enableImageAnalysis: config.enableImageAnalysis !== false,
      enableLogging: config.enableLogging || process.env.ENABLE_LOGGING === "true",
      ...config
    };
    this.client = createOllamaClient(config);
  }

  /**
   * Log message if logging is enabled
   */
  private log(message: string, data?: unknown): void {
    if (this.config.enableLogging) {
      console.log(`[OllamaVision] ${message}`, data || '');
    }
  }

  /**
   * Convert image buffer to base64
   */
  private imageToBase64(image: Buffer): string {
    return image.toString('base64');
  }

  /**
   * Analyze image using vision model
   */
  async analyzeImage(
    image: Buffer | string,
    prompt: string
  ): Promise<ImageAnalysis> {
    try {
      // Ensure vision model is available
      await this.client.ensureModel(this.config.visionModel);

      // Convert image to base64 if needed
      const imageBase64 = typeof image === 'string' 
        ? image.replace(/^data:image\/\w+;base64,/, '')
        : this.imageToBase64(image);

      // Validate image buffer if provided
      if (Buffer.isBuffer(image)) {
        const validation = validateImageBuffer(image);
        if (!validation.valid) {
          throw new Error(`Invalid image: ${validation.error}`);
        }
      }

      // Enhanced prompt for structured analysis
      const enhancedPrompt = `${prompt}

Please analyze this image and provide a detailed JSON response with:
- description: detailed description of the image
- detectedObjects: array of objects with type, bounds (x, y, width, height), confidence
- palette: object with dominant colors (hex codes), all colors, count, style (pixel-art/hand-drawn/photorealistic/vector/unknown)
- dimensions: object with width and height
- format: image format (png/jpeg/webp/unknown)

Return only valid JSON.`;

      // Use Ollama's vision capabilities
      const response = await this.client.generate({
        model: this.config.visionModel,
        prompt: enhancedPrompt,
        format: "json",
        options: {
          temperature: 0.3,
          num_predict: 2000
        }
      });

      // Parse response
      let parsed: any;
      try {
        parsed = JSON.parse(response.response);
      } catch {
        // Fallback: try to extract JSON from text
        const jsonMatch = response.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          // Last resort: parse text response
          return this.parseTextAnalysis(response.response);
        }
      }

      return {
        description: parsed.description || response.response,
        detectedObjects: parsed.detectedObjects || [],
        palette: parsed.palette || {
          dominant: [],
          all: [],
          count: 0,
          style: "unknown"
        },
        dimensions: parsed.dimensions || { width: 0, height: 0 },
        format: parsed.format || "unknown",
        metadata: {}
      };
    } catch (error) {
      this.log('Image analysis failed', error);
      throw new Error(
        `Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Analyze sprite sheet specifically
   */
  async analyzeSpriteSheet(image: Buffer, prompt?: string): Promise<SpriteSheetAnalysis> {
    const defaultPrompt = `Analyze this sprite sheet image. Identify:
1. Frame count and dimensions
2. Layout pattern (grid, packed, or custom)
3. Animation sequences if visible
4. Color palette
5. Any metadata visible in the image

Return structured JSON analysis.`;

    try {
      const analysis = await this.analyzeImage(image, prompt || defaultPrompt);
      return this.convertToSpriteSheetAnalysis(analysis, image);
    } catch (error) {
      this.log('Sprite sheet analysis failed', error);
      throw error;
    }
  }

  /**
   * Parse text-based analysis (fallback)
   */
  private parseTextAnalysis(content: string): ImageAnalysis {
    const description = content;

    // Extract dimensions
    const dimensionMatch = content.match(/(\d+)\s*x\s*(\d+)/i);
    const dimensions = dimensionMatch
      ? { width: parseInt(dimensionMatch[1]), height: parseInt(dimensionMatch[2]) }
      : { width: 0, height: 0 };

    // Extract colors
    const colorMatches = content.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g) || [];
    const palette: ColorPalette = {
      dominant: colorMatches.slice(0, 5),
      all: colorMatches,
      count: colorMatches.length,
      style: this.detectStyle(content)
    };

    return {
      description,
      detectedObjects: [],
      palette,
      dimensions,
      format: "unknown",
      metadata: {}
    };
  }

  /**
   * Detect art style from text
   */
  private detectStyle(content: string): "pixel-art" | "hand-drawn" | "photorealistic" | "vector" | "unknown" {
    const lower = content.toLowerCase();
    if (lower.includes('pixel') || lower.includes('8-bit') || lower.includes('16-bit')) {
      return "pixel-art";
    }
    if (lower.includes('hand-drawn') || lower.includes('sketch')) {
      return "hand-drawn";
    }
    if (lower.includes('photo') || lower.includes('realistic')) {
      return "photorealistic";
    }
    if (lower.includes('vector')) {
      return "vector";
    }
    return "unknown";
  }

  /**
   * Convert image analysis to sprite sheet analysis
   */
  private convertToSpriteSheetAnalysis(
    analysis: ImageAnalysis,
    imageBuffer: Buffer
  ): SpriteSheetAnalysis {
    // Extract frame information
    const frameMatch = analysis.description.match(/(\d+)\s*frames?/i);
    const frameCount = frameMatch ? parseInt(frameMatch[1]) : 0;

    const gridMatch = analysis.description.match(/(\d+)\s*x\s*(\d+)\s*grid/i);
    const isGrid = gridMatch !== null;

    let frameDimensions = { width: 0, height: 0 };
    if (frameCount > 0 && analysis.dimensions.width > 0 && analysis.dimensions.height > 0) {
      if (gridMatch) {
        const cols = parseInt(gridMatch[1]);
        const rows = parseInt(gridMatch[2]);
        frameDimensions = {
          width: Math.floor(analysis.dimensions.width / cols),
          height: Math.floor(analysis.dimensions.height / rows)
        };
      } else {
        frameDimensions = {
          width: Math.floor(analysis.dimensions.width / frameCount),
          height: analysis.dimensions.height
        };
      }
    }

    // Extract animations
    const animations: Array<{ name: string; frames: number[]; loop: boolean; timing: number; tags: string[] }> = [];
    const animationMatches = analysis.description.matchAll(/(\w+)\s*animation[:\s]+frames?\s*(\d+(?:[-\s,]\d+)*)/gi);
    for (const match of animationMatches) {
      const name = match[1];
      const frameStr = match[2];
      const frames = this.parseFrameRange(frameStr);
      animations.push({
        name,
        frames,
        loop: analysis.description.toLowerCase().includes(`${name} loop`),
        timing: 0.1,
        tags: []
      });
    }

    const frames = Array.from({ length: frameCount }, (_, i) => ({
      index: i,
      bounds: {
        x: (i % Math.ceil(Math.sqrt(frameCount))) * frameDimensions.width,
        y: Math.floor(i / Math.ceil(Math.sqrt(frameCount))) * frameDimensions.height,
        width: frameDimensions.width,
        height: frameDimensions.height
      }
    }));

    return {
      frameCount,
      frameDimensions,
      layout: isGrid ? "grid" : frameCount > 0 ? "packed" : "custom",
      gridConfig: gridMatch ? {
        rows: parseInt(gridMatch[2]),
        columns: parseInt(gridMatch[1]),
        cellWidth: frameDimensions.width,
        cellHeight: frameDimensions.height
      } : undefined,
      frames,
      palette: analysis.palette,
      animations,
      metadata: {
        name: "",
        entity: "",
        theme: "",
        resolution: [analysis.dimensions.width, analysis.dimensions.height],
        actions: animations.map(a => ({
          name: a.name,
          frames: a.frames.length,
          loop: a.loop,
          timing: a.timing
        })),
        palette: analysis.palette.dominant,
        constraints: {
          pixelStyle: analysis.palette.style === "pixel-art" ? "crisp" : "smooth",
          animationSmoothness: "gameReady",
          colorDepth: 32
        }
      }
    };
  }

  /**
   * Parse frame range string
   */
  private parseFrameRange(rangeStr: string): number[] {
    if (rangeStr.includes('-')) {
      const [start, end] = rangeStr.split('-').map(n => parseInt(n.trim()));
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    const numbers = rangeStr.split(/[,\s]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    return numbers;
  }
}

/**
 * Create Ollama Vision service
 */
export function createOllamaVisionService(config?: OllamaVisionConfig): OllamaVisionService {
  return new OllamaVisionService(config);
}









