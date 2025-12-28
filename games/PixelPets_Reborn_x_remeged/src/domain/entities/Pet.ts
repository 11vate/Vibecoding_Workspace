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
  parentFamilies: [PetFamily, PetFamily]; // Track families for lineage calculations
  stonesUsed: [string, string]; // Stone IDs
  fusionSeed: string;
  mutationCount: number;
  timestamp: number;
}

export interface PetAppearance {
  baseSprite?: string;
  colorMutation?: { r: number; g: number; b: number };
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
export class Pet {
  constructor(
    public readonly id: PetId,
    public readonly playerId: string, // Owner ID
    public readonly basePetId: BasePetId | null,
    public readonly name: string,
    public readonly nickname: string | null,
    public readonly family: PetFamily,
    public readonly rarity: Rarity,
    public readonly stats: Stats,
    public readonly passiveAbilities: readonly Ability[],
    public readonly activeAbilities: readonly Ability[],
    public readonly ultimateAbility: Ability | null,
    public readonly fusionHistory: readonly FusionHistory[],
    public readonly appearance: PetAppearance,
    public readonly battleStats: BattleStats | null,
    public readonly collectionDate: number,
    public readonly isHacked: boolean = false,
    public readonly lore: string = '' // Lore for fused pets, empty for base pets
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) throw new Error('Pet must have an ID');
    if (!this.playerId) throw new Error('Pet must have a player ID');
    if (this.passiveAbilities.length < 0) {
      throw new Error('Pet cannot have negative passive abilities');
    }
    if (this.activeAbilities.length < 1) {
      throw new Error('Pet must have at least one active ability');
    }
  }

  /**
   * Check if this pet is a base pet (not fused)
   */
  isBasePet(): boolean {
    return this.fusionHistory.length === 0 && this.basePetId !== null;
  }

  /**
   * Check if this pet is fused
   */
  isFused(): boolean {
    return this.fusionHistory.length > 0;
  }

  /**
   * Get generation number (0 for base pets)
   */
  getGeneration(): number {
    if (this.fusionHistory.length === 0) return 0;
    return Math.max(...this.fusionHistory.map((h) => h.generation));
  }

  /**
   * Get total mutation count from all fusions
   */
  getTotalMutations(): number {
    return this.fusionHistory.reduce((sum, h) => sum + h.mutationCount, 0);
  }
}













