/**
 * Visual Genome System
 * Structured data model for pet visual characteristics
 * Enables deterministic sprite assembly and visual identity
 */
import type { Rarity } from '@/shared/types/rarity';
/**
 * Base form types for pets
 */
export type BaseForm = 'biped' | 'quadruped' | 'serpentine' | 'floating';
/**
 * Animation profile types
 */
export type AnimationProfile = 'stable' | 'chaotic' | 'heavy' | 'agile';
/**
 * Body part types
 */
export interface BodyParts {
    head: string;
    torso: string;
    limbs: string;
    tail?: string;
    wings?: string;
}
/**
 * Visual Genome for a Pet
 * Provides structured data for deterministic sprite generation
 */
export interface PetVisualGenome {
    /**
     * Base form/shape of the pet
     */
    baseForm: BaseForm;
    /**
     * Detailed body parts
     */
    bodyParts: BodyParts;
    /**
     * Elemental affinities (can be multiple)
     */
    elementAffinity: string[];
    /**
     * Rarity tier
     */
    rarity: Rarity;
    /**
     * Mutation traits (glitch, crystal, ethereal, etc.)
     */
    mutationTraits: string[];
    /**
     * Deterministic color palette seed
     * Used to generate consistent colors for the same pet
     */
    paletteSeed: string;
    /**
     * Animation style profile
     */
    animationProfile: AnimationProfile;
    /**
     * Size modifier (0.5 = small, 1.0 = normal, 1.5 = large)
     */
    sizeModifier: number;
    /**
     * Additional visual characteristics
     */
    visualTags: string[];
}
/**
 * Helper function to create a default visual genome
 */
export declare function createDefaultVisualGenome(rarity: Rarity, elementAffinity?: string[]): PetVisualGenome;
//# sourceMappingURL=VisualGenome.d.ts.map