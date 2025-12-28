/**
 * Rarity Escalator Service
 * Calculates fusion rarity based on parents and stones
 */

import type { Rarity } from '@/shared/types/rarity';
import { Rarity as RarityEnum } from '@/shared/types/rarity';
import type { StoneTier } from '../entities/Stone';

export interface RarityCalculationInput {
  parent1Rarity: Rarity;
  parent2Rarity: Rarity;
  stone1Tier: StoneTier;
  stone2Tier: StoneTier;
  useDeterministic?: boolean;
  deterministicSeed?: number;
}

export interface RarityCalculationResult {
  baseRarity: Rarity;
  finalRarity: Rarity;
  upgraded: boolean;
  upgradeChance: number;
  roll: number;
}

/**
 * Rarity Escalator - calculates fusion rarity outcomes
 */
export class RarityEscalator {
  /**
   * Calculate fusion rarity based on parents and stones
   * 
   * Formula per concept:
   * Base Tier = round((PetA Tier + PetB Tier) / 2)
   * + Stone Bonus (Tier I: +0, Tier II: +0.25, Tier III: +0.5, Tier IV: +1, Tier V: +1.5)
   * + Same-rarity bonus: +10% upgrade chance if parents are same rarity
   */
  static calculateFusionRarity(input: RarityCalculationInput): RarityCalculationResult {
    // Calculate base tier as average of parents (per concept requirement)
    const averageTier = (input.parent1Rarity + input.parent2Rarity) / 2;
    let baseTier = Math.round(averageTier);

    // Add stone tier bonuses to base tier
    const stoneBonus1 = this.getStoneTierBonus(input.stone1Tier);
    const stoneBonus2 = this.getStoneTierBonus(input.stone2Tier);
    const totalStoneBonus = stoneBonus1 + stoneBonus2;
    
    // Apply stone bonuses (can push base tier up)
    baseTier = Math.round(baseTier + totalStoneBonus);
    
    // Clamp base tier to valid rarity range (0-6)
    baseTier = Math.max(0, Math.min(6, baseTier));
    
    const baseRarity = baseTier as Rarity;

    // Base upgrade chance: 15%
    let upgradeChance = 0.15;

    // Same rarity bonus: +10% upgrade chance if parents are same rarity
    if (input.parent1Rarity === input.parent2Rarity) {
      upgradeChance += 0.1;
    }

    // High-tier stones bonus: +5% per stone (Tier IV+) for upgrade chance
    if (input.stone1Tier >= 4) upgradeChance += 0.05;
    if (input.stone2Tier >= 4) upgradeChance += 0.05;

    // Clamp upgrade chance to reasonable bounds
    upgradeChance = Math.min(0.5, Math.max(0, upgradeChance));

    // Roll for upgrade (chance to go one tier higher than base)
    let roll: number;
    if (input.useDeterministic && input.deterministicSeed !== undefined) {
      // Use seeded random for deterministic results
      roll = this.seededRandom(input.deterministicSeed);
    } else {
      roll = Math.random();
    }

    const upgraded = roll < upgradeChance && baseRarity < RarityEnum.OMEGA;
    const finalRarity = upgraded ? ((baseRarity + 1) as Rarity) : baseRarity;

    return {
      baseRarity,
      finalRarity,
      upgraded,
      upgradeChance,
      roll,
    };
  }

  /**
   * Get stone tier bonus for base tier calculation
   * Tier I: +0, Tier II: +0.25, Tier III: +0.5, Tier IV: +1, Tier V: +1.5
   */
  private static getStoneTierBonus(tier: StoneTier): number {
    switch (tier) {
      case 1: return 0;
      case 2: return 0.25;
      case 3: return 0.5;
      case 4: return 1.0;
      case 5: return 1.5;
      default: return 0;
    }
  }

  /**
   * Simple seeded random (for deterministic calculations)
   */
  private static seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Get upgrade chance without rolling
   */
  static getUpgradeChance(input: Omit<RarityCalculationInput, 'useDeterministic' | 'deterministicSeed'>): number {
    const result = this.calculateFusionRarity({ ...input, useDeterministic: false });
    return result.upgradeChance;
  }
}

