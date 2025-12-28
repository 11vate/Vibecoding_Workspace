/**
 * Sprite Sage Service Integration
 *
 * Integration with Sprite Sage API for sprite generation.
 */
import { retry } from '../../utils/retry';
import { createRateLimiter } from '../../utils/rate-limiter';
import { validateDimensions } from '../../utils/validation';
/**
 * Sprite Sage Error
 */
export class SpriteSageError extends Error {
    statusCode;
    details;
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'SpriteSageError';
    }
}
/**
 * Sprite Sage Service
 */
export class SpriteSageService {
    config;
    defaultBaseUrl = "https://api.spritesage.ai/v1";
    defaultRateLimiter;
    constructor(config) {
        this.config = {
            baseUrl: this.defaultBaseUrl,
            enableLogging: false,
            ...config
        };
        // Default rate limiter: 15 requests per minute
        this.defaultRateLimiter = config.rateLimiter || createRateLimiter({
            maxRequests: 15,
            windowMs: 60000
        });
    }
    /**
     * Log message if logging is enabled
     */
    log(message, data) {
        if (this.config.enableLogging) {
            console.log(`[SpriteSage] ${message}`, data || '');
        }
    }
    /**
     * Validate parameters
     */
    validateParams(params) {
        const dimValidation = validateDimensions(params.resolution[0], params.resolution[1], 16, 16, 1024, 1024);
        if (!dimValidation.valid) {
            throw new SpriteSageError(dimValidation.error || 'Invalid dimensions');
        }
    }
    /**
     * Generate sprite
     */
    async generateSprite(params) {
        try {
            this.validateParams(params);
            await this.defaultRateLimiter.waitUntilAllowed();
            const retryOptions = this.config.retryOptions || {
                maxAttempts: 3,
                initialDelay: 1000
            };
            const result = await retry(async () => {
                this.log('Generating sprite', { entity: params.entity, theme: params.theme });
                // Note: This is a placeholder implementation
                // In production, this would call the actual Sprite Sage API
                const response = await fetch(`${this.config.baseUrl}/generate`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.config.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: params.prompt,
                        entity: params.entity,
                        theme: params.theme,
                        style: params.style,
                        resolution: params.resolution,
                        frameCount: params.frameCount,
                        palette: params.palette
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new SpriteSageError(errorData.message || `API error: ${response.statusText}`, response.status, errorData);
                }
                const data = await response.json();
                // Download or decode image
                let imageBuffer;
                if (data.imageUrl) {
                    const imageResponse = await fetch(data.imageUrl);
                    imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
                }
                else if (data.imageData) {
                    imageBuffer = Buffer.from(data.imageData, 'base64');
                }
                else {
                    throw new SpriteSageError('No image data in response');
                }
                return {
                    type: "sprite",
                    data: imageBuffer,
                    metadata: {
                        id: this.generateId(),
                        name: `spritesage_${params.entity || 'sprite'}`,
                        dimensions: {
                            width: data.width || params.resolution[0],
                            height: data.height || params.resolution[1]
                        },
                        format: "png",
                        palette: {
                            dominant: params.palette?.slice(0, 5) || [],
                            all: params.palette || [],
                            count: params.palette?.length || 0,
                            style: params.style === "pixel-art" ? "pixel-art" : "unknown"
                        },
                        tags: ["sprite-sage", params.entity || "", params.theme || ""].filter(Boolean),
                        createdAt: new Date().toISOString()
                    }
                };
            }, retryOptions);
            if (!result.success || !result.result) {
                throw result.error || new SpriteSageError('Failed to generate sprite after retries');
            }
            return result.result;
        }
        catch (error) {
            this.log('Sprite generation failed', error);
            if (error instanceof SpriteSageError) {
                throw error;
            }
            throw new SpriteSageError(`Failed to generate sprite: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, error);
        }
    }
    /**
     * Generate unique ID
     */
    generateId() {
        return `spritesage_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
}
/**
 * Create Sprite Sage service instance
 */
export function createSpriteSageService(config) {
    return new SpriteSageService(config);
}
//# sourceMappingURL=sprite-sage-service.js.map