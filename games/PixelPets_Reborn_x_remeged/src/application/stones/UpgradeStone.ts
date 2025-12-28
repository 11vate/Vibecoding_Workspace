/**
 * Upgrade Stone Use Case (Lithosynthesis)
 * Upgrades a stone's tier by consuming other stones
 */

import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';
import { StoneGenerator } from '@/domain/services/StoneGenerator';
import type { Stone } from '@/domain/entities/Stone';
import { StoneTier } from '@/domain/entities/Stone';
import type { StoneId } from '@/shared/types/brands';

export interface UpgradeStoneInput {
  targetStoneId: StoneId;
  materialStoneIds: StoneId[];
}

export interface UpgradeStoneOutput {
  upgradedStone: Stone;
  consumedStones: Stone[];
  message: string;
}

/**
 * Lithosynthesis cost requirements by tier
 */
const LITHOSYNTHESIS_COSTS: Record<StoneTier, { stonesRequired: number; sameTypeRequired: number }> = {
  [StoneTier.I]: { stonesRequired: 2, sameTypeRequired: 0 }, // Tier I -> II: 2 stones
  [StoneTier.II]: { stonesRequired: 3, sameTypeRequired: 1 }, // Tier II -> III: 3 stones (1 same type)
  [StoneTier.III]: { stonesRequired: 4, sameTypeRequired: 2 }, // Tier III -> IV: 4 stones (2 same type)
  [StoneTier.IV]: { stonesRequired: 5, sameTypeRequired: 3 }, // Tier IV -> V: 5 stones (3 same type)
  [StoneTier.V]: { stonesRequired: 0, sameTypeRequired: 0 }, // Cannot upgrade Tier V
};

/**
 * Upgrade Stone Use Case (Lithosynthesis)
 */
export class UpgradeStone {
  constructor(private stoneRepository: IStoneRepository) {}

  /**
   * Upgrade a stone by consuming material stones
   */
  async execute(input: UpgradeStoneInput): Promise<UpgradeStoneOutput> {
    // Fetch target stone
    const targetStone = await this.stoneRepository.findById(input.targetStoneId);
    if (!targetStone) {
      throw new Error(`Target stone not found: ${input.targetStoneId}`);
    }

    // Check if stone can be upgraded
    if (targetStone.tier === StoneTier.V) {
      throw new Error('Cannot upgrade a Tier V stone');
    }

    // Get cost requirements
    const cost = LITHOSYNTHESIS_COSTS[targetStone.tier];
    if (!cost) {
      throw new Error(`Invalid tier for upgrade: ${targetStone.tier}`);
    }

    // Validate material stones
    if (input.materialStoneIds.length < cost.stonesRequired) {
      throw new Error(
        `Insufficient material stones. Required: ${cost.stonesRequired}, provided: ${input.materialStoneIds.length}`
      );
    }

    // Fetch material stones
    const materialStones: Stone[] = [];
    for (const materialId of input.materialStoneIds) {
      const stone = await this.stoneRepository.findById(materialId);
      if (!stone) {
        throw new Error(`Material stone not found: ${materialId}`);
      }
      materialStones.push(stone);
    }

    // Validate same-type requirement
    const sameTypeCount = materialStones.filter((s) => s.type === targetStone.type).length;
    if (sameTypeCount < cost.sameTypeRequired) {
      throw new Error(
        `Insufficient same-type stones. Required: ${cost.sameTypeRequired} ${targetStone.type}, found: ${sameTypeCount}`
      );
    }

    // Validate material stones are not higher tier than target
    const maxMaterialTier = Math.max(...materialStones.map((s) => s.tier));
    if (maxMaterialTier > targetStone.tier) {
      throw new Error('Material stones cannot be higher tier than the stone being upgraded');
    }

    // Check for glitched stone in materials (can enhance upgrade)
    const hasGlitchedMaterial = materialStones.some((s) => s.isGlitched);
    const upgradeResult = hasGlitchedMaterial && Math.random() < 0.3; // 30% chance to get glitched upgrade

    // Create upgraded stone
    const newTier = (targetStone.tier + 1) as StoneTier;
    const upgradedStone = StoneGenerator.generateStone(
      targetStone.type,
      newTier,
      targetStone.statBonuses, // Preserve stat bonuses from original
      upgradeResult || targetStone.isGlitched // Preserve glitched status or upgrade to glitched
    );

    // Delete consumed stones
    for (const materialStone of materialStones) {
      await this.stoneRepository.delete(materialStone.id);
    }

    // Delete original stone
    await this.stoneRepository.delete(targetStone.id);

    // Save upgraded stone
    await this.stoneRepository.save(upgradedStone);

    return {
      upgradedStone,
      consumedStones: [targetStone, ...materialStones],
      message: `Successfully upgraded ${targetStone.type} Stone from Tier ${targetStone.tier} to Tier ${upgradedStone.tier}${upgradedStone.isGlitched ? ' [GLITCHED]' : ''}!`,
    };
  }
}






