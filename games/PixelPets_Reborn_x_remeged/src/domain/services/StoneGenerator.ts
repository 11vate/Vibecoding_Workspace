/**
 * Stone Generator Service
 * Generates stone instances with proper stat bonuses and properties
 */

import { Stone, StoneType, StoneTier, StoneStatBonuses } from '../entities/Stone';
import { generateStoneId } from '@/shared/utils/idGenerator';
import { GlitchedStoneService } from './GlitchedStoneService';

/**
 * Stat multipliers by tier
 */
const TIER_STAT_MULTIPLIERS: Record<StoneTier, number> = {
  [StoneTier.I]: 0.1,
  [StoneTier.II]: 0.15,
  [StoneTier.III]: 0.2,
  [StoneTier.IV]: 0.25,
  [StoneTier.V]: 0.3,
};

/**
 * Elemental power by tier
 */
const TIER_ELEMENTAL_POWER: Record<StoneTier, number> = {
  [StoneTier.I]: 10,
  [StoneTier.II]: 20,
  [StoneTier.III]: 30,
  [StoneTier.IV]: 40,
  [StoneTier.V]: 50,
};

/**
 * Base stats for stone generation
 */
const BASE_STONE_STATS = {
  hp: 100,
  attack: 50,
  defense: 50,
  speed: 50,
};

/**
 * Stone Generator Service
 */
export class StoneGenerator {
  /**
   * Generate a stone of specified type and tier
   */
  static generateStone(
    type: StoneType,
    tier: StoneTier,
    baseStats?: Partial<StoneStatBonuses>,
    isGlitched: boolean = false
  ): Stone {
    const multiplier = TIER_STAT_MULTIPLIERS[tier];
    
    const statBonuses: StoneStatBonuses = {
      hp: Math.round((baseStats?.hp ?? BASE_STONE_STATS.hp) * multiplier),
      attack: Math.round((baseStats?.attack ?? BASE_STONE_STATS.attack) * multiplier),
      defense: Math.round((baseStats?.defense ?? BASE_STONE_STATS.defense) * multiplier),
      speed: Math.round((baseStats?.speed ?? BASE_STONE_STATS.speed) * multiplier),
    };

    const elementalPower = TIER_ELEMENTAL_POWER[tier];

    const stone = new Stone(
      generateStoneId(),
      'SYSTEM', // Default owner
      type,
      tier,
      statBonuses,
      elementalPower,
      isGlitched,
      Date.now()
    );

    // If glitched, enhance it
    if (isGlitched) {
      return GlitchedStoneService.createGlitchedStone(stone);
    }

    return stone;
  }

  /**
   * Generate a random stone of specified tier
   */
  static generateRandomStone(tier: StoneTier, allowGlitched: boolean = false): Stone {
    const types = Object.values(StoneType);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const isGlitched = allowGlitched && Math.random() < 0.05; // 5% chance for glitched

    return this.generateStone(randomType, tier, undefined, isGlitched);
  }

  /**
   * Generate stone from reward specification (used by dungeon rewards)
   */
  static generateStoneFromReward(
    type: string,
    tier: number,
    chance: number = 1.0
  ): Stone | null {
    // Check if reward should be granted
    if (Math.random() >= chance) {
      return null;
    }

    const stoneType = (Object.values(StoneType) as string[]).includes(type.toUpperCase())
      ? (type.toUpperCase() as StoneType)
      : StoneType.RUBY;

    const stoneTier = Math.min(Math.max(tier, 1), 5) as StoneTier;

    return this.generateStone(stoneType, stoneTier);
  }
}















