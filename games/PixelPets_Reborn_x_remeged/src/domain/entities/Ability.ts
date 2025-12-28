/**
 * Ability Entity
 * Represents a pet ability (passive, active, or ultimate)
 */

import type { AbilityId } from '@/shared/types/brands';
import type { StatusEffect } from '@/shared/types/status';

export type AbilityType = 'passive' | 'active' | 'ultimate';
export type AbilityTarget =
  | 'single-enemy'
  | 'all-enemies'
  | 'random-enemies'
  | 'self'
  | 'all-allies'
  | 'random-ally';

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

export class Ability {
  constructor(
    public readonly id: AbilityId,
    public readonly name: string,
    public readonly description: string,
    public readonly type: AbilityType,
    public readonly energyCost: number | null,
    public readonly cooldown: number | null,
    public readonly currentCooldown: number | null,
    public readonly effects: readonly AbilityEffect[],
    public readonly tags: readonly string[],
    public readonly element: string | null
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Ability must have an ID');
    if (!this.name) throw new Error('Ability must have a name');
    if (!this.description) throw new Error('Ability must have a description');
    if (this.type === 'passive' && this.energyCost !== null) {
      throw new Error('Passive abilities cannot have energy cost');
    }
    if (this.type === 'passive' && this.cooldown !== null) {
      throw new Error('Passive abilities cannot have cooldown');
    }
    if (this.type !== 'passive' && this.energyCost === null) {
      throw new Error('Active and ultimate abilities must have energy cost');
    }
    if (this.energyCost !== null && this.energyCost < 0) {
      throw new Error('Energy cost cannot be negative');
    }
    if (this.cooldown !== null && this.cooldown < 0) {
      throw new Error('Cooldown cannot be negative');
    }
    if (this.effects.length === 0) {
      throw new Error('Ability must have at least one effect');
    }
  }

  /**
   * Check if ability is available (cooldown ready, has energy)
   */
  isAvailable(currentEnergy: number): boolean {
    if (this.type === 'passive') return true;
    if (this.energyCost !== null && currentEnergy < this.energyCost) return false;
    if (this.currentCooldown !== null && this.currentCooldown > 0) return false;
    return true;
  }

  /**
   * Create a copy with updated cooldown
   */
  withCooldown(cooldown: number): Ability {
    return new Ability(
      this.id,
      this.name,
      this.description,
      this.type,
      this.energyCost,
      this.cooldown,
      cooldown,
      this.effects,
      this.tags,
      this.element
    );
  }

  /**
   * Create a copy with cooldown reduced
   */
  reduceCooldown(amount: number = 1): Ability {
    if (this.currentCooldown === null) return this;
    const newCooldown = Math.max(0, this.currentCooldown - amount);
    return this.withCooldown(newCooldown);
  }
}





















