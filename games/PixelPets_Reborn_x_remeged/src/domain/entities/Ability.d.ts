/**
 * Ability Entity
 * Represents a pet ability (passive, active, or ultimate)
 */
import type { AbilityId } from '@/shared/types/brands';
import type { StatusEffect } from '@/shared/types/status';
export type AbilityType = 'passive' | 'active' | 'ultimate';
export type AbilityTarget = 'single-enemy' | 'all-enemies' | 'random-enemies' | 'self' | 'all-allies' | 'random-ally';
export interface AbilityEffect {
    type: 'damage' | 'heal' | 'buff' | 'debuff' | 'status' | 'special';
    target: AbilityTarget;
    value: number;
    element?: string;
    statusChance?: number;
    statusType?: StatusEffect;
    statusDuration?: number;
    lifesteal?: number;
    scaling?: 'attack' | 'defense' | 'hp' | 'speed';
}
export declare class Ability {
    readonly id: AbilityId;
    readonly name: string;
    readonly description: string;
    readonly type: AbilityType;
    readonly energyCost: number | null;
    readonly cooldown: number | null;
    readonly currentCooldown: number | null;
    readonly effects: readonly AbilityEffect[];
    readonly tags: readonly string[];
    readonly element: string | null;
    constructor(id: AbilityId, name: string, description: string, type: AbilityType, energyCost: number | null, cooldown: number | null, currentCooldown: number | null, effects: readonly AbilityEffect[], tags: readonly string[], element: string | null);
    private validate;
    /**
     * Check if ability is available (cooldown ready, has energy)
     */
    isAvailable(currentEnergy: number): boolean;
    /**
     * Create a copy with updated cooldown
     */
    withCooldown(cooldown: number): Ability;
    /**
     * Create a copy with cooldown reduced
     */
    reduceCooldown(amount?: number): Ability;
}
//# sourceMappingURL=Ability.d.ts.map