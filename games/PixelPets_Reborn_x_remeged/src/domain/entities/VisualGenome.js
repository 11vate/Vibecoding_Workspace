/**
 * Visual Genome System
 * Structured data model for pet visual characteristics
 * Enables deterministic sprite assembly and visual identity
 */
/**
 * Helper function to create a default visual genome
 */
export function createDefaultVisualGenome(rarity, elementAffinity = []) {
    return {
        baseForm: 'quadruped',
        bodyParts: {
            head: 'standard',
            torso: 'standard',
            limbs: 'standard',
        },
        elementAffinity,
        rarity,
        mutationTraits: [],
        paletteSeed: Math.random().toString(36).substring(7),
        animationProfile: 'stable',
        sizeModifier: 1.0,
        visualTags: [],
    };
}
//# sourceMappingURL=VisualGenome.js.map