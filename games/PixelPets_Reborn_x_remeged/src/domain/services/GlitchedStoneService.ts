/**
 * Glitched Stone Service
 * Handles glitched stone generation and properties
 */

import { StoneType, StoneTier, Stone } from '../entities/Stone';
import { generateStoneId } from '@/shared/utils/idGenerator';

export interface GlitchedStoneProperties {
  glitchSeverity: number; // 0-100
  enhancedStatBonus: number; // Multiplier for stat bonuses
  fusionBoost: number; // Additional fusion power
  visualEffect: string; // Description of visual glitch
  domainEffectBoost?: string; // Enhanced domain effect description
}

/**
 * Glitched Stone Service
 */
export class GlitchedStoneService {
  /**
   * Check if a stone should become glitched
   * Returns glitch chance as a percentage
   */
  static getGlitchChance(
    stone1Tier: StoneTier,
    stone2Tier: StoneTier,
    fusionCount: number
  ): number {
    // Base chance: 1%
    let chance = 1.0;

    // Higher tier stones increase chance
    if (stone1Tier >= StoneTier.IV) chance += 2.0;
    if (stone2Tier >= StoneTier.IV) chance += 2.0;
    if (stone1Tier === StoneTier.V && stone2Tier === StoneTier.V) chance += 5.0;

    // More fusions increase chance (chaos accumulates)
    chance += Math.min(fusionCount * 0.5, 10.0);

    return Math.min(chance, 15.0); // Cap at 15%
  }

  /**
   * Generate a glitched stone from a normal stone
   */
  static createGlitchedStone(baseStone: Stone): Stone {
    const glitchSeverity = this.calculateGlitchSeverity(baseStone.tier);
    const properties = this.getGlitchedProperties(baseStone.type, glitchSeverity);

    // Enhance stat bonuses
    const enhancedBonuses = {
      hp: baseStone.statBonuses.hp
        ? Math.round(baseStone.statBonuses.hp * properties.enhancedStatBonus)
        : undefined,
      attack: baseStone.statBonuses.attack
        ? Math.round(baseStone.statBonuses.attack * properties.enhancedStatBonus)
        : undefined,
      defense: baseStone.statBonuses.defense
        ? Math.round(baseStone.statBonuses.defense * properties.enhancedStatBonus)
        : undefined,
      speed: baseStone.statBonuses.speed
        ? Math.round(baseStone.statBonuses.speed * properties.enhancedStatBonus)
        : undefined,
    };

    // Enhance elemental power
    const enhancedElementalPower = Math.round(
      baseStone.elementalPower * (1 + properties.fusionBoost / 100)
    );

    return new Stone(
      generateStoneId(),
      baseStone.playerId,
      baseStone.type,
      baseStone.tier,
      enhancedBonuses,
      enhancedElementalPower,
      true, // isGlitched
      baseStone.obtainedAt
    );
  }

  /**
   * Calculate glitch severity (0-100)
   */
  private static calculateGlitchSeverity(tier: StoneTier): number {
    // Higher tier = more severe glitch
    const baseSeverity = tier * 15;
    const random = Math.random() * 20;
    return Math.min(baseSeverity + random, 100);
  }

  /**
   * Get glitched properties for a stone type
   */
  private static getGlitchedProperties(
    type: StoneType,
    severity: number
  ): GlitchedStoneProperties {
    const severityLevel = this.getSeverityLevel(severity);

    // Base properties based on type
    const baseProperties: Record<StoneType, Partial<GlitchedStoneProperties>> = {
      [StoneType.RUBY]: {
        visualEffect: 'Flickers between red and corrupted purple. Flames burn in impossible colors.',
        domainEffectBoost: 'Glitched flames deal extra damage and apply random status effects.',
      },
      [StoneType.SAPPHIRE]: {
        visualEffect: 'Waters flow backwards and in impossible patterns. Colors shift erratically.',
        domainEffectBoost: 'Glitched tides create healing zones that also damage enemies.',
      },
      [StoneType.EMERALD]: {
        visualEffect: 'Plants grow in geometric patterns. Leaves fall upward. Nature defies logic.',
        domainEffectBoost: 'Glitched growth creates barriers that phase in and out of reality.',
      },
      [StoneType.TOPAZ]: {
        visualEffect: 'Lightning strikes in slow motion. Electricity flows in circles.',
        domainEffectBoost: 'Glitched storms create lightning that bounces infinitely.',
      },
      [StoneType.AMETHYST]: {
        visualEffect: 'Reality fractures around it. You see multiple dimensions simultaneously.',
        domainEffectBoost: 'Glitched shadows create portals that teleport allies and enemies randomly.',
      },
      [StoneType.PEARL]: {
        visualEffect: 'Light becomes solid and breaks like glass. Darkness glows.',
        domainEffectBoost: 'Glitched light creates barriers of pure illumination that damage and heal simultaneously.',
      },
      [StoneType.ONYX]: {
        visualEffect: 'Gravity inverts near it. Objects float while others sink impossibly.',
        domainEffectBoost: 'Glitched earth creates zones where damage is reflected and absorbed randomly.',
      },
      [StoneType.OPAL]: {
        visualEffect: 'All elements exist at once and nowhere. Colors shift faster than light.',
        domainEffectBoost: 'Glitched balance creates perfect chaos where all effects apply at once.',
      },
    };

    // Severity modifiers
    const severityMultipliers: Record<'low' | 'medium' | 'high' | 'extreme', number> = {
      low: 1.2,
      medium: 1.5,
      high: 2.0,
      extreme: 3.0,
    };

    const multiplier = severityMultipliers[severityLevel];

    return {
      glitchSeverity: severity,
      enhancedStatBonus: multiplier,
      fusionBoost: severity / 2, // 0-50% boost
      visualEffect: baseProperties[type].visualEffect || 'Reality glitches around this stone.',
      domainEffectBoost: baseProperties[type].domainEffectBoost,
    };
  }

  /**
   * Get severity level from severity value
   */
  private static getSeverityLevel(severity: number): 'low' | 'medium' | 'high' | 'extreme' {
    if (severity < 30) return 'low';
    if (severity < 60) return 'medium';
    if (severity < 85) return 'high';
    return 'extreme';
  }

  /**
   * Check if glitched fusion should occur
   * Glitched fusions can happen when both stones are glitched, or when one glitched stone has high severity
   */
  static shouldTriggerGlitchedFusion(
    stone1: Stone,
    stone2: Stone
  ): boolean {
    // Both glitched = guaranteed glitched fusion
    if (stone1.isGlitched && stone2.isGlitched) {
      return true;
    }

    // One glitched stone with high severity = chance for glitched fusion
    if (stone1.isGlitched || stone2.isGlitched) {
      // Simplified: if one is glitched, 30% chance
      // In full implementation, this would check glitch severity
      return Math.random() < 0.3;
    }

    return false;
  }
}


