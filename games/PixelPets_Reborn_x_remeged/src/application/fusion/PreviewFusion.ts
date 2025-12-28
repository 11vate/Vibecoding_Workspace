/**
 * Preview Fusion Use Case
 * Generates a preview of fusion outcome without executing it
 */

import type { IPetRepository } from '@/domain/repositories/IPetRepository';
import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';
import { FusionCalculator } from '@/domain/services/FusionCalculator';
import { RarityEscalator } from '@/domain/services/RarityEscalator';
import { RARITY_CONFIG } from '@/shared/types/rarity';
import type { Rarity } from '@/shared/types/rarity';

export interface FusionPreview {
  likelyRarity: Rarity;
  minRarity: Rarity;
  maxRarity: Rarity;
  statRanges: {
    hp: [number, number];
    attack: [number, number];
    defense: [number, number];
    speed: [number, number];
  };
  abilityCounts: {
    passives: number;
    actives: number;
    ultimates: number;
  };
  upgradeChance: number;
}

/**
 * Preview Fusion Use Case
 */
export class PreviewFusion {
  constructor(
    private petRepository: IPetRepository,
    private stoneRepository: IStoneRepository
  ) {}

  async execute(
    parent1Id: string,
    parent2Id: string,
    stone1Id: string,
    stone2Id: string
  ): Promise<FusionPreview> {
    // Fetch inputs
    const parent1 = await this.petRepository.findById(parent1Id as any);
    const parent2 = await this.petRepository.findById(parent2Id as any);
    const stone1 = await this.stoneRepository.findById(stone1Id as any);
    const stone2 = await this.stoneRepository.findById(stone2Id as any);

    if (!parent1 || !parent2 || !stone1 || !stone2) {
      throw new Error('Missing fusion inputs');
    }

    // Calculate rarity preview
    const rarityResult = RarityEscalator.calculateFusionRarity({
      parent1Rarity: parent1.rarity,
      parent2Rarity: parent2.rarity,
      stone1Tier: stone1.tier,
      stone2Tier: stone2.tier,
    });

    const minRarity = Math.min(parent1.rarity, parent2.rarity) as Rarity;
    const maxRarity = Math.min(rarityResult.finalRarity + 1, 6) as Rarity; // Omega is max

    // Calculate stat preview (use deterministic seed for preview to get consistent results)
    const previewSeed = Date.now();
    const calculation = FusionCalculator.calculateFusion(
      parent1,
      parent2,
      stone1,
      stone2,
      previewSeed
    );

    // Calculate stat ranges accounting for variance (±15%)
    // The calculation already includes variance, so we show the base value and variance range
    const variance = 0.15;
    const baseHp = calculation.stats.baseStats.maxHp;
    const baseAttack = calculation.stats.baseStats.attack;
    const baseDefense = calculation.stats.baseStats.defense;
    const baseSpeed = calculation.stats.baseStats.speed;
    
    // Apply stone bonuses to base stats for range calculation
    const stoneMultiplier = (stone1.tier + stone2.tier) / 2 * 0.05; // Average stone tier multiplier
    const enhancedBaseHp = Math.round(baseHp * (1 + stoneMultiplier));
    const enhancedBaseAttack = Math.round(baseAttack * (1 + stoneMultiplier));
    const enhancedBaseDefense = Math.round(baseDefense * (1 + stoneMultiplier));
    const enhancedBaseSpeed = Math.round(baseSpeed * (1 + stoneMultiplier));
    
    const statRanges = {
      hp: [
        Math.round(enhancedBaseHp * (1 - variance)),
        Math.round(enhancedBaseHp * (1 + variance)),
      ],
      attack: [
        Math.round(enhancedBaseAttack * (1 - variance)),
        Math.round(enhancedBaseAttack * (1 + variance)),
      ],
      defense: [
        Math.round(enhancedBaseDefense * (1 - variance)),
        Math.round(enhancedBaseDefense * (1 + variance)),
      ],
      speed: [
        Math.round(enhancedBaseSpeed * (1 - variance)),
        Math.round(enhancedBaseSpeed * (1 + variance)),
      ],
    };

    // Get ability counts from rarity config
    const rarityConfig = RARITY_CONFIG[rarityResult.finalRarity];
    const abilityCounts = {
      passives: rarityConfig.passiveCount,
      actives: rarityConfig.activeCount,
      ultimates: rarityConfig.ultimateCount,
    };

    return {
      likelyRarity: rarityResult.finalRarity,
      minRarity,
      maxRarity,
      statRanges: {
        hp: [statRanges.hp[0], statRanges.hp[1]] as [number, number],
        attack: [statRanges.attack[0], statRanges.attack[1]] as [number, number],
        defense: [statRanges.defense[0], statRanges.defense[1]] as [number, number],
        speed: [statRanges.speed[0], statRanges.speed[1]] as [number, number],
      },
      abilityCounts,
      upgradeChance: rarityResult.upgradeChance,
    };
  }
}

