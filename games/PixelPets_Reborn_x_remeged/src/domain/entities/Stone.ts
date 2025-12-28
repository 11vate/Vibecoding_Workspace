/**
 * Stone Entity
 * Represents a fusion stone with type, tier, and properties
 */

import type { StoneId } from '@/shared/types/brands';

export enum StoneType {
  RUBY = 'RUBY',
  SAPPHIRE = 'SAPPHIRE',
  EMERALD = 'EMERALD',
  TOPAZ = 'TOPAZ',
  AMETHYST = 'AMETHYST',
  PEARL = 'PEARL',
  ONYX = 'ONYX',
  OPAL = 'OPAL',
}

export enum StoneTier {
  I = 1,
  II = 2,
  III = 3,
  IV = 4,
  V = 5,
}

export interface StoneStatBonuses {
  hp?: number;
  attack?: number;
  defense?: number;
  speed?: number;
}

export class Stone {
  constructor(
    public readonly id: StoneId,
    public readonly playerId: string, // Owner ID
    public readonly type: StoneType,
    public readonly tier: StoneTier,
    public readonly statBonuses: StoneStatBonuses,
    public readonly elementalPower: number,
    public readonly isGlitched: boolean,
    public readonly obtainedAt: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Stone must have an ID');
    if (this.elementalPower < 0) throw new Error('Elemental power cannot be negative');
    if (this.tier < StoneTier.I || this.tier > StoneTier.V) {
      throw new Error('Stone tier must be between I and V');
    }
  }

  /**
   * Check if stone is Tier V (can trigger domain effects)
   */
  isTierV(): boolean {
    return this.tier === StoneTier.V;
  }

  /**
   * Check if stone can create domain effects (both stones must be Tier V)
   */
  canCreateDomainEffect(other: Stone): boolean {
    return this.isTierV() && other.isTierV();
  }

  /**
   * Get total stat bonus value
   */
  getTotalStatBonus(): number {
    return (
      (this.statBonuses.hp || 0) +
      (this.statBonuses.attack || 0) +
      (this.statBonuses.defense || 0) +
      (this.statBonuses.speed || 0)
    );
  }
}





















