/**
 * OpenAI Vision Integration
 *
 * Integration with OpenAI GPT-4 Vision API for image understanding and analysis.
 */
import { retry } from '../../utils/retry';
import { createRateLimiter } from '../../utils/rate-limiter';
import { validateImageBuffer } from '../../utils/validation';
import { z } from 'zod';
/**
 * OpenAI API Error
 */
export class OpenAIVisionError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'OpenAIVisionError';
    }
}
/**
 * Response schema for structured analysis
 */
const ImageAnalysisResponseSchema = z.object({
    description: z.string(),
    detectedObjects: z.array(z.object({
        type: z.string(),
        bounds: z.object({
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number()
        }),
        confidence: z.number().min(0).max(1).optional(),
        attributes: z.record(z.unknown()).optional()
    })).optional(),
    palette: z.object({
        dominant: z.array(z.string()),
        all: z.array(z.string()).optional(),
        count: z.number(),
        style: z.enum(["pixel-art", "hand-drawn", "photorealistic", "vector", "unknown"])
    }).optional(),
    dimensions: z.object({
        width: z.number(),
        height: z.number()
    }).optional(),
    format: z.string().optional()
});
/**
 * OpenAI Vision Service
 */
export class OpenAIVisionService {
    config;
    baseUrl = "https://api.openai.com/v1/chat/completions";
    defaultRateLimiter;
    constructor(config) {
        // Load from environment if not provided
        const apiKey = config.apiKey || process.env.OPENAI_API_KEY || "";
        // API key is now optional - will fallback to local Ollama if not provided
        if (!apiKey && process.env.USE_LOCAL_MODELS !== "false") {
            console.warn("OpenAI API key not provided. Will attempt to use local Ollama vision model as fallback.");
        }
        this.config = {
            model: config.model || process.env.OPENAI_MODEL || "gpt-4o",
            maxTokens: config.maxTokens || parseInt(process.env.OPENAI_MAX_TOKENS || "1000"),
            temperature: config.temperature || parseFloat(process.env.OPENAI_TEMPERATURE || "0.3"),
            enableLogging: config.enableLogging || process.env.ENABLE_LOGGING === "true",
            apiKey,
            retryOptions: config.retryOptions,
            rateLimiter: config.rateLimiter
        };
        // Default rate limiter: 50 requests per minute (OpenAI tier limits)
        this.defaultRateLimiter = config.rateLimiter || createRateLimiter({
            maxRequests: parseInt(process.env.OPENAI_RATE_LIMIT || "50"),
            windowMs: 60000
        });
    }
    /**
     * Log message if logging is enabled
     */
    log(message, data) {
        if (this.config.enableLogging) {
            console.log(`[OpenAIVision] ${message}`, data || '');
        }
    }
    /**
     * Convert image to base64 data URL
     */
    prepareImageData(image) {
        if (typeof image === 'string') {
            // Already a URL or data URL
            return image;
        }
        // Validate buffer
        const validation = validateImageBuffer(image);
        if (!validation.valid) {
            throw new OpenAIVisionError(`Invalid image buffer: ${validation.error}`);
        }
        const format = validation.format || 'png';
        return `data:image/${format};base64,${image.toString('base64')}`;
    }
    /**
     * Make API request with retry and rate limiting
     */
    async makeRequest(payload) {
        // Wait for rate limiter
        await this.defaultRateLimiter.waitUntilAllowed();
        const retryOptions = this.config.retryOptions || {
            maxAttempts: 3,
            initialDelay: 1000,
            retryableErrors: (error) => {
                if (error instanceof OpenAIVisionError) {
                    // Retry on 5xx errors and rate limits
                    return error.statusCode === 429 ||
                        (error.statusCode !== undefined && error.statusCode >= 500);
                }
                return false;
            }
        };
        const result = await retry(async () => {
            this.log('Making API request', { model: this.config.model });
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new OpenAIVisionError(errorData.error?.message || `API error: ${response.statusText}`, response.status, errorData.error?.code, errorData);
                throw error;
            }
            return await response.json();
        }, retryOptions);
        if (!result.success) {
            throw result.error || new OpenAIVisionError('Request failed after retries');
        }
        return result.result;
    }
    /**
     * Analyze image with vision model
     */
    async analyzeImage(request) {
        // If no API key, try local Ollama fallback
        if (!this.config.apiKey && process.env.USE_LOCAL_MODELS !== "false") {
            try {
                const { createOllamaVisionService } = require('../local-models/ollama-vision');
                const ollamaVision = createOllamaVisionService({
                    enableLogging: this.config.enableLogging
                });
                const imageBuffer = typeof request.image === 'string'
                    ? Buffer.from(request.image.split(',')[1] || '', 'base64')
                    : request.image;
                return await ollamaVision.analyzeImage(imageBuffer, request.prompt);
            }
            catch (error) {
                console.warn("Local Ollama vision fallback failed, attempting API call anyway:", error);
            }
        }
        if (!this.config.apiKey) {
            throw new OpenAIVisionError("OpenAI API key is required. Set OPENAI_API_KEY or enable local models with USE_LOCAL_MODELS=true");
        }
        try {
            const imageData = this.prepareImageData(request.image);
            // Enhanced prompt for structured output
            const enhancedPrompt = request.responseFormat === "json_object"
                ? `${request.prompt}\n\nReturn your analysis as a JSON object with the following structure:
{
  "description": "detailed description of the image",
  "detectedObjects": [{"type": "string", "bounds": {"x": 0, "y": 0, "width": 0, "height": 0}, "confidence": 0.0}],
  "palette": {"dominant": ["#hex"], "all": ["#hex"], "count": 0, "style": "pixel-art|hand-drawn|photorealistic|vector|unknown"},
  "dimensions": {"width": 0, "height": 0},
  "format": "png|jpeg|webp|unknown"
}`
                : request.prompt;
            const payload = {
                model: this.config.model,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: enhancedPrompt
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageData,
                                    detail: request.detail || "high"
                                }
                            }
                        ]
                    }
                ],
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature,
                ...(request.responseFormat === "json_object" && { response_format: { type: "json_object" } })
            };
            const data = await this.makeRequest(payload);
            if (!data.choices || !data.choices[0]?.message?.content) {
                throw new OpenAIVisionError('Invalid response format from API');
            }
            const content = data.choices[0].message.content;
            const analysis = this.parseAnalysis(content, request.responseFormat === "json_object");
            this.log('Image analysis completed', { description: analysis.description.substring(0, 100) });
            return analysis;
        }
        catch (error) {
            this.log('Image analysis failed', error);
            if (error instanceof OpenAIVisionError) {
                throw error;
            }
            throw new OpenAIVisionError(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error);
        }
    }
    /**
     * Analyze sprite sheet specifically
     */
    async analyzeSpriteSheet(image, prompt) {
        const defaultPrompt = `Analyze this sprite sheet image. Identify:
1. Frame count and dimensions
2. Layout pattern (grid, packed, or custom)
3. Animation sequences if visible
4. Color palette
5. Any metadata visible in the image

Return structured analysis as JSON.`;
        try {
            const analysis = await this.analyzeImage({
                image,
                prompt: prompt || defaultPrompt,
                detail: "high",
                responseFormat: "json_object"
            });
            return this.convertToSpriteSheetAnalysis(analysis, image);
        }
        catch (error) {
            this.log('Sprite sheet analysis failed', error);
            throw new OpenAIVisionError(`Failed to analyze sprite sheet: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error);
        }
    }
    /**
     * Parse analysis from OpenAI response
     */
    parseAnalysis(content, isJson = false) {
        let parsed;
        if (isJson) {
            try {
                parsed = JSON.parse(content);
            }
            catch (error) {
                this.log('Failed to parse JSON response', error);
                // Fall back to text parsing
                return this.parseTextAnalysis(content);
            }
            // Validate against schema
            const validation = ImageAnalysisResponseSchema.safeParse(parsed);
            if (validation.success) {
                const data = validation.data;
                return {
                    description: data.description,
                    detectedObjects: data.detectedObjects || [],
                    palette: data.palette || {
                        dominant: [],
                        all: [],
                        count: 0,
                        style: "unknown"
                    },
                    dimensions: data.dimensions || { width: 0, height: 0 },
                    format: data.format || "unknown",
                    metadata: {}
                };
            }
            else {
                this.log('Schema validation failed', validation.error);
                return this.parseTextAnalysis(content);
            }
        }
        return this.parseTextAnalysis(content);
    }
    /**
     * Parse text-based analysis (fallback)
     */
    parseTextAnalysis(content) {
        // Extract information from text using regex patterns
        const description = content;
        // Try to extract dimensions
        const dimensionMatch = content.match(/(\d+)\s*x\s*(\d+)/i);
        const dimensions = dimensionMatch
            ? { width: parseInt(dimensionMatch[1]), height: parseInt(dimensionMatch[2]) }
            : { width: 0, height: 0 };
        // Try to extract colors (hex codes)
        const colorMatches = content.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g) || [];
        const palette = {
            dominant: colorMatches.slice(0, 5),
            all: colorMatches,
            count: colorMatches.length,
            style: this.detectStyle(content)
        };
        // Try to extract detected objects
        const detectedObjects = [];
        // This would need more sophisticated parsing for text responses
        return {
            description,
            detectedObjects,
            palette,
            dimensions,
            format: "unknown",
            metadata: {}
        };
    }
    /**
     * Detect art style from text description
     */
    detectStyle(content) {
        const lower = content.toLowerCase();
        if (lower.includes('pixel') || lower.includes('8-bit') || lower.includes('16-bit')) {
            return "pixel-art";
        }
        if (lower.includes('hand-drawn') || lower.includes('sketch') || lower.includes('drawn')) {
            return "hand-drawn";
        }
        if (lower.includes('photo') || lower.includes('realistic') || lower.includes('photorealistic')) {
            return "photorealistic";
        }
        if (lower.includes('vector') || lower.includes('svg')) {
            return "vector";
        }
        return "unknown";
    }
    /**
     * Convert image analysis to sprite sheet analysis
     */
    convertToSpriteSheetAnalysis(analysis, imageBuffer) {
        // Try to extract frame information from description
        const frameMatch = analysis.description.match(/(\d+)\s*frames?/i);
        const frameCount = frameMatch ? parseInt(frameMatch[1]) : 0;
        // Try to detect grid layout
        const gridMatch = analysis.description.match(/(\d+)\s*x\s*(\d+)\s*grid/i);
        const isGrid = gridMatch !== null || analysis.description.toLowerCase().includes('grid');
        // Calculate frame dimensions if we have total dimensions and frame count
        let frameDimensions = { width: 0, height: 0 };
        if (frameCount > 0 && analysis.dimensions.width > 0 && analysis.dimensions.height > 0) {
            if (gridMatch) {
                const cols = parseInt(gridMatch[1]);
                const rows = parseInt(gridMatch[2]);
                frameDimensions = {
                    width: Math.floor(analysis.dimensions.width / cols),
                    height: Math.floor(analysis.dimensions.height / rows)
                };
            }
            else {
                // Assume single row
                frameDimensions = {
                    width: Math.floor(analysis.dimensions.width / frameCount),
                    height: analysis.dimensions.height
                };
            }
        }
        // Extract animation sequences from description
        const animations = [];
        const animationMatches = analysis.description.matchAll(/(\w+)\s*animation[:\s]+frames?\s*(\d+(?:[-\s,]\d+)*)/gi);
        for (const match of animationMatches) {
            const name = match[1];
            const frameStr = match[2];
            const frames = this.parseFrameRange(frameStr);
            animations.push({
                name,
                frames,
                loop: analysis.description.toLowerCase().includes(`${name} loop`),
                timing: 0.1, // Default
                tags: []
            });
        }
        // Generate frame definitions
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
     * Parse frame range string (e.g., "1-4" or "1,2,3,4" or "1 2 3 4")
     */
    parseFrameRange(rangeStr) {
        // Handle ranges like "1-4"
        if (rangeStr.includes('-')) {
            const [start, end] = rangeStr.split('-').map(n => parseInt(n.trim()));
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
        // Handle comma or space separated
        const numbers = rangeStr.split(/[,\s]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        return numbers;
    }
}
/**
 * Create OpenAI Vision service instance
 */
export function createOpenAIVisionService(config) {
    return new OpenAIVisionService(config);
}
//# sourceMappingURL=openai-vision.js.map