const { z } = require('zod');

// The intent schema defines the "Request" for an asset
const AssetIntentSchema = z.object({
  id: z.string().uuid().or(z.string()), // Unique ID for the request
  project: z.string(), // Project name (e.g., "PixelPets")
  type: z.enum(['sprite', 'tileset', 'ui', 'sfx', 'bg']),
  name: z.string(), // Human readable name (e.g., "Fire Dragon")
  
  // Visual specification
  spec: z.object({
    style: z.string().default('pixel-art'), // e.g., "pixel-art", "vector", "hand-drawn"
    palette: z.string().optional(), // Hex codes or palette name
    dimensions: z.object({
      width: z.number().int(),
      height: z.number().int()
    }).optional(),
    tags: z.array(z.string()).default([]),
  }),

  // Animation requirements (if applicable)
  animation: z.object({
    states: z.array(z.string()), // e.g., ["idle", "run", "attack"]
    fps: z.number().default(12),
    frame_width: z.number().optional(),
    frame_height: z.number().optional()
  }).optional(),

  // Generation Context (for the AI)
  context: z.object({
    description: z.string(), // "A small red dragon breathing fire"
    mood: z.string().optional(),
    references: z.array(z.string()).optional() // URLs or paths to reference images
  }),

  status: z.enum(['pending', 'generating', 'processing', 'complete', 'failed']).default('pending'),
  created_at: z.number().default(Date.now()),
});

module.exports = { AssetIntentSchema };
