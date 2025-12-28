/**
 * Stat Normalizer Service
 * Clamps stats to rarity constraints
 */

import type { Rarity } from '@/shared/types/rarity';
import { RARITY_CONFIG } from '@/shared/types/rarity';
import { Stats } from '../valueObjects/Stats';

export interface StatValues {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

/**
 * Clamp stats to rarity constraints
 */
export class StatNormalizer {
  static clampToRarity(stats: StatValues, rarity: Rarity): StatValues {
    const config = RARITY_CONFIG[rarity];

    return {
      hp: Math.max(config.hpRange[0], Math.min(config.hpRange[1], stats.hp)),
      attack: Math.max(config.attackRange[0], Math.min(config.attackRange[1], stats.attack)),
      defense: Math.max(config.defenseRange[0], Math.min(config.defenseRange[1], stats.defense)),
      speed: Math.max(config.speedRange[0], Math.min(config.speedRange[1], stats.speed)),
    };
  }

  static normalize(stats: Stats, rarity: Rarity): Stats {
    const clamped = this.clampToRarity(
      {
        hp: stats.hp,
        attack: stats.attack,
        defense: stats.defense,
        speed: stats.speed,
      },
      rarity
    );

    return Stats.create(clamped.hp, clamped.hp, clamped.attack, clamped.defense, clamped.speed);
  }
}





















