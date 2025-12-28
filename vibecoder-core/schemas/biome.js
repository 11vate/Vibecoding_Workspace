const { z } = require('zod');

const BiomeSchema = z.object({
  id: z.string(), // e.g. "forest_deep"
  name: z.string(),
  
  // Visuals
  tilesetId: z.string(), // Reference to ASSET_REGISTRY
  backgroundId: z.string().optional(),
  
  // Traversal Rules (How movement works here)
  traversal: z.array(z.object({
    tileType: z.string(), // e.g. "water", "mud", "ice"
    cost: z.number().default(1), // Pathfinding cost
    effect: z.string().optional() // e.g. "slide", "slow", "damage"
  })).default([]),

  // Spawning Rules (What lives here)
  encounters: z.array(z.object({
    entityId: z.string(), // Must match an EntitySchema ID
    weight: z.number().default(1), // Probability weight
    groupSize: z.object({ min: z.number(), max: z.number() }).default({ min: 1, max: 1 }),
    conditions: z.array(z.string()).optional() // e.g. ["night", "rain"]
  })).default([]),

  // Atmosphere & Ambience
  atmosphere: z.object({
    lighting: z.string().optional(), // Hex tint
    weather: z.enum(['clear', 'rain', 'fog', 'storm', 'snow', 'ash']).default('clear'),
    musicId: z.string().optional()
  }).optional()
});

module.exports = { BiomeSchema };
