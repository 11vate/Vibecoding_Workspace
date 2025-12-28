/**
 * Starter Stones Seed Data
 * 8-10 starter stones for new player setup
 * Mix of types and tiers to allow fusion experimentation
 */

import { Stone, StoneType, StoneTier, type StoneStatBonuses } from '@/domain/entities/Stone';
import { generateId } from '@/shared/utils/idGenerator';
import type { StoneId } from '@/shared/types/brands';

/**
 * Create a starter stone helper
 */
function createStarterStone(
  type: StoneType,
  tier: StoneTier,
  isGlitched: boolean = false
): Stone {
  const tierBonusMap = {
    [StoneTier.I]: 5,
    [StoneTier.II]: 10,
    [StoneTier.III]: 15,
    [StoneTier.IV]: 20,
    [StoneTier.V]: 25,
  };

  const bonusAmount = tierBonusMap[tier];

  const statBonusMap: Record<StoneType, StoneStatBonuses> = {
    [StoneType.RUBY]: { attack: bonusAmount },
    [StoneType.SAPPHIRE]: { defense: bonusAmount },
    [StoneType.EMERALD]: { hp: bonusAmount * 5 },
    [StoneType.TOPAZ]: { speed: bonusAmount },
    [StoneType.AMETHYST]: { attack: bonusAmount / 2, speed: bonusAmount / 2 },
    [StoneType.PEARL]: { speed: bonusAmount },
    [StoneType.ONYX]: { attack: bonusAmount / 2, defense: bonusAmount / 2 },
    [StoneType.OPAL]: { hp: bonusAmount * 3, defense: bonusAmount / 2 },
  };

  return new Stone(
    generateId('STONE') as StoneId,
    'SYSTEM', // Placeholder ID for starter stones
    type,
    tier,
    statBonusMap[type],
    tier * 10,
    isGlitched,
    Date.now()
  );
}

/**
 * Starter stones: 8 stones covering all types with varied tiers
 * Strategy: Give player mix to allow immediate fusion experimentation
 * - 1 of each primary type (Ember, Wave, Earth, Bolt)
 * - 2 secondary types (Shadow, Wind) for element interaction
 * - 2 special types (Magic, Light) for quality fusions
 */
export const STARTER_STONES = [
  // Primary elements (Tier 2 - Common)
  createStarterStone(StoneType.RUBY, StoneTier.II),        // Fire/Ember
  createStarterStone(StoneType.SAPPHIRE, StoneTier.II),    // Water/Wave
  createStarterStone(StoneType.EMERALD, StoneTier.II),     // Earth
  createStarterStone(StoneType.TOPAZ, StoneTier.II),       // Lightning/Bolt

  // Secondary elements (Tier 2 - Common)
  createStarterStone(StoneType.AMETHYST, StoneTier.II),    // Shadow/Dark
  createStarterStone(StoneType.PEARL, StoneTier.II),       // Wind/Air

  // Special elements (Tier 1 - to encourage rare fusions)
  createStarterStone(StoneType.ONYX, StoneTier.I),        // Magic/Arcane
  createStarterStone(StoneType.OPAL, StoneTier.I),        // Light

  // Bonus: One higher tier stone (Tier 3) for a more powerful early fusion
  createStarterStone(StoneType.RUBY, StoneTier.III),      // Fire/Ember Tier 3
];

/**
 * Export as constant array for use in seeding
 */
export const ALL_STARTER_STONES = STARTER_STONES;

export default STARTER_STONES;
