/**
 * Fusion Calculator Service
 * Calculates fusion outcomes (stats, rarity, etc.)
 */

import type { Pet } from '../entities/Pet';
import type { Stone } from '../entities/Stone';
import type { Stats } from '../valueObjects/Stats';
import { Stats as StatsClass } from '../valueObjects/Stats';
import { RarityEscalator, type RarityCalculationInput } from './RarityEscalator';
import { StatNormalizer } from './StatNormalizer';
import type { Rarity } from '@/shared/types/rarity';

export interface FusionStatCalculation {
  baseStats: Stats;
  variedStats: Stats;
  stoneEnhancedStats: Stats;
  finalStats: Stats;
  variance: number;
}

export interface FusionCalculationResult {
  rarity: Rarity;
  stats: FusionStatCalculation;
  statBias: 'balanced' | 'offensive' | 'defensive' | 'speed';
}

/**
 * Fusion Calculator - calculates fusion outcomes
 */
export class FusionCalculator {
  /**
   * Calculate fusion stats from parents
   */
  static calculateFusionStats(
    parent1: Pet,
    parent2: Pet,
    stone1: Stone,
    stone2: Stone,
    targetRarity: Rarity,
    variance: number = 0.15,
    seed?: number
  ): FusionStatCalculation {
    // Calculate base stats (average of parents)
    const avgHp = Math.round((parent1.stats.maxHp + parent2.stats.maxHp) / 2);
    const baseStats = StatsClass.create(
      avgHp, // hp (start at max)
      avgHp, // maxHp
      Math.round((parent1.stats.attack + parent2.stats.attack) / 2),
      Math.round((parent1.stats.defense + parent2.stats.defense) / 2),
      Math.round((parent1.stats.speed + parent2.stats.speed) / 2)
    );

    // Apply variance (±variance%)
    let variedStats: Stats;
    if (seed !== undefined) {
      // Deterministic variance
      const rng1 = this.seededRandom(seed * 1000);
      const rng2 = this.seededRandom(seed * 2000);
      const rng3 = this.seededRandom(seed * 3000);
      const rng4 = this.seededRandom(seed * 4000);
      const hpVar = 1 + (rng1 * 2 - 1) * variance;
      const atkVar = 1 + (rng2 * 2 - 1) * variance;
      const defVar = 1 + (rng3 * 2 - 1) * variance;
      const spdVar = 1 + (rng4 * 2 - 1) * variance;

      const variedHp = Math.round(baseStats.maxHp * hpVar);
      variedStats = StatsClass.create(
        variedHp, // hp (start at max)
        variedHp, // maxHp
        Math.round(baseStats.attack * atkVar),
        Math.round(baseStats.defense * defVar),
        Math.round(baseStats.speed * spdVar)
      );
    } else {
      // Random variance
      const variedHp = Math.round(baseStats.maxHp * (1 + (Math.random() * 2 - 1) * variance));
      variedStats = StatsClass.create(
        variedHp, // hp (start at max)
        variedHp, // maxHp
        Math.round(baseStats.attack * (1 + (Math.random() * 2 - 1) * variance)),
        Math.round(baseStats.defense * (1 + (Math.random() * 2 - 1) * variance)),
        Math.round(baseStats.speed * (1 + (Math.random() * 2 - 1) * variance))
      );
    }

    // Apply stone bonuses
    const stoneMultiplier1 = this.getStoneStatMultiplier(stone1.tier);
    const stoneMultiplier2 = this.getStoneStatMultiplier(stone2.tier);
    const avgMultiplier = (stoneMultiplier1 + stoneMultiplier2) / 2;

    const enhancedHp = Math.round(variedStats.maxHp * (1 + avgMultiplier));
    const stoneEnhancedStats = StatsClass.create(
      enhancedHp, // hp (start at max)
      enhancedHp, // maxHp
      Math.round(variedStats.attack * (1 + avgMultiplier)),
      Math.round(variedStats.defense * (1 + avgMultiplier)),
      Math.round(variedStats.speed * (1 + avgMultiplier))
    );

    // Clamp to rarity constraints
    const finalStats = StatNormalizer.normalize(stoneEnhancedStats, targetRarity);

    return {
      baseStats,
      variedStats,
      stoneEnhancedStats,
      finalStats,
      variance,
    };
  }

  /**
   * Calculate complete fusion result
   */
  static calculateFusion(
    parent1: Pet,
    parent2: Pet,
    stone1: Stone,
    stone2: Stone,
    seed?: number
  ): FusionCalculationResult {
    // Calculate rarity
    const rarityInput: RarityCalculationInput = {
      parent1Rarity: parent1.rarity,
      parent2Rarity: parent2.rarity,
      stone1Tier: stone1.tier,
      stone2Tier: stone2.tier,
      useDeterministic: seed !== undefined,
      deterministicSeed: seed,
    };

    const rarityResult = RarityEscalator.calculateFusionRarity(rarityInput);

    // Calculate stats
    const stats = this.calculateFusionStats(
      parent1,
      parent2,
      stone1,
      stone2,
      rarityResult.finalRarity,
      0.15,
      seed
    );

    // Determine stat bias
    const statBias = this.determineStatBias(stats.finalStats);

    return {
      rarity: rarityResult.finalRarity,
      stats,
      statBias,
    };
  }

  /**
   * Determine stat bias from final stats
   */
  private static determineStatBias(stats: Stats): 'balanced' | 'offensive' | 'defensive' | 'speed' {
    // Simplified determination based on stat ratios
    const totalStats = stats.hp + stats.attack + stats.defense + stats.speed;
    if (totalStats === 0) return 'balanced';
    
    const atkRatio = stats.attack / totalStats;
    const defRatio = stats.defense / totalStats;
    const spdRatio = stats.speed / totalStats;
    
    if (spdRatio > 0.25) return 'speed';
    if (atkRatio > 0.3 && atkRatio > defRatio + 0.1) return 'offensive';
    if (defRatio > 0.3 && defRatio > atkRatio + 0.1) return 'defensive';
    return 'balanced';
  }

  /**
   * Get stone stat multiplier based on tier
   */
  private static getStoneStatMultiplier(tier: number): number {
    // Tier I: 5%, Tier II: 10%, Tier III: 15%, Tier IV: 20%, Tier V: 25%
    return tier * 0.05;
  }

  /**
   * Simple seeded random
   */
  private static seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
}

