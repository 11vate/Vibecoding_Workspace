/**
 * Pet Entity
 * Core domain entity representing a pet
 */
import type { PetId, BasePetId } from '@/shared/types/brands';
import type { Rarity } from '@/shared/types/rarity';
import type { PetFamily } from '@/shared/types/family';
import type { Stats } from '../valueObjects/Stats';
import type { Ability } from './Ability';
import type { PetVisualGenome } from './VisualGenome';
export interface FusionHistory {
    generation: number;
    parentIds: [PetId, PetId];
    stonesUsed: [string, string];
    fusionSeed: string;
    mutationCount: number;
    timestamp: number;
}
export interface PetAppearance {
    baseSprite?: string;
    colorMutation?: {
        r: number;
        g: number;
        b: number;
    };
    glowColor?: string;
    particleEffect?: string;
    visualTags: string[];
    visualGenome?: PetVisualGenome;
}
export interface BattleStats {
    wins: number;
    losses: number;
    draws: number;
    damageDealt: number;
    damageTaken: number;
}
/**
 * Base Pet - Template for summonable pets
 */
export interface BasePet {
    id: BasePetId;
    name: string;
    family: PetFamily;
    rarity: Rarity;
    baseStats: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
    };
    starterAbilities: string[];
    starterPassives: string[];
    visualTags: string[];
    lore: string;
}
/**
 * Pet - Runtime entity
 */
export declare class Pet {
    readonly id: PetId;
    readonly basePetId: BasePetId | null;
    readonly name: string;
    readonly nickname: string | null;
    readonly family: PetFamily;
    readonly rarity: Rarity;
    readonly stats: Stats;
    readonly passiveAbilities: readonly Ability[];
    readonly activeAbilities: readonly Ability[];
    readonly ultimateAbility: Ability | null;
    readonly fusionHistory: readonly FusionHistory[];
    readonly appearance: PetAppearance;
    readonly battleStats: BattleStats | null;
    readonly collectionDate: number;
    readonly lore: string;
    constructor(id: PetId, basePetId: BasePetId | null, name: string, nickname: string | null, family: PetFamily, rarity: Rarity, stats: Stats, passiveAbilities: readonly Ability[], activeAbilities: readonly Ability[], ultimateAbility: Ability | null, fusionHistory: readonly FusionHistory[], appearance: PetAppearance, battleStats: BattleStats | null, collectionDate: number, lore?: string);
    private validate;
    /**
     * Check if this pet is a base pet (not fused)
     */
    isBasePet(): boolean;
    /**
     * Check if this pet is fused
     */
    isFused(): boolean;
    /**
     * Get generation number (0 for base pets)
     */
    getGeneration(): number;
    /**
     * Get total mutation count from all fusions
     */
    getTotalMutations(): number;
}
//# sourceMappingURL=Pet.d.ts.map