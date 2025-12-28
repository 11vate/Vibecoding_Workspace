const { z } = require('zod');

const EntitySchema = z.object({
  id: z.string(), // Unique ID (e.g., "slime_basic")
  name: z.string(), // Display name
  description: z.string().optional(),
  
  // Visual connection
  visuals: z.object({
    assetId: z.string(), // Must exist in ASSET_REGISTRY
    scale: z.number().default(1),
    tint: z.string().optional(), // Hex code
    animations: z.record(z.string()).optional() // Map behavior state -> animation key (e.g., "move": "hop")
  }),

  // Physics properties
  physics: z.object({
    type: z.enum(['dynamic', 'static', 'kinematic']).default('dynamic'),
    mass: z.number().default(1),
    friction: z.number().default(0.1),
    bounce: z.number().default(0),
    isTrigger: z.boolean().default(false),
    size: z.object({ x: z.number(), y: z.number() }).optional() // Hitbox override
  }),

  // AI & Behavior
  behavior: z.object({
    type: z.string(), // e.g. "fsm", "pattern", "boid"
    perceptionRadius: z.number().default(100),
    states: z.array(z.string()).default(['idle']),
    defaultState: z.string().default('idle'),
    speed: z.number().default(0)
  }).optional(),

  // Game Stats
  stats: z.record(z.number()).optional(), // Flexible stat block (hp, mp, atk)

  // Loot & Drops
  drops: z.array(z.object({
    itemId: z.string(),
    chance: z.number().min(0).max(1), // 0.0 to 1.0
    min: z.number().default(1),
    max: z.number().default(1)
  })).default([])
});

module.exports = { EntitySchema };
