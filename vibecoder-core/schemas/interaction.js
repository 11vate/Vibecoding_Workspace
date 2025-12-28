const { z } = require('zod');

const InteractionSchema = z.object({
  id: z.string(), // The verb (e.g., "push", "ignite", "talk")
  type: z.enum(['action', 'reaction']).default('action'),
  
  // What is required to perform this?
  requirements: z.object({
    actorTags: z.array(z.string()).optional(), // e.g. ["strong"]
    targetTags: z.array(z.string()).optional(), // e.g. ["pushable", "flammable"]
    tool: z.string().optional() // e.g. "torch"
  }).optional(),

  // How does it execute?
  logic: z.object({
    duration: z.number().default(0), // ms (0 = instant)
    range: z.number().default(1), // grid units
    cooldown: z.number().default(0)
  }),

  // What happens?
  effects: z.array(z.object({
    type: z.string(), // e.g. "apply_force", "state_change", "spawn_particle"
    params: z.record(z.any())
  })).default([]),

  // Asset Requirements (for the verb itself)
  assets: z.object({
    actorAnimation: z.string().optional(), // e.g. "push"
    targetAnimation: z.string().optional(), // e.g. "slide"
    sfx: z.string().optional(),
    vfx: z.string().optional()
  }).optional()
});

module.exports = { InteractionSchema };
