/**
 * Uniqueness Scoring System
 * Calculates how unique a fusion result is based on various factors
 * Provides player feedback on fusion quality
 */

import type { Pet } from '../entities/Pet';
import type { Stone } from '../entities/Stone';
import { StoneType } from '../entities/Stone';

export interface UniquenessScore {
  totalScore: number;
  breakdown: {
    abilityUniqueness: number;
    statDistribution: number;
    elementCombination: number;
    rarityFactor: number;
    nameUniqueness: number;
    visualUniqueness: number;
  };
  percentile: number; // 0-100, compared to all fusions
  rank: string; // 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'
}

/**
 * Calculate uniqueness score for a fused pet
 */
export function calculateUniquenessScore(
  pet: Pet,
  parent1: Pet,
  parent2: Pet,
  stone1: Stone,
  stone2: Stone
): UniquenessScore {
  const breakdown = {
    abilityUniqueness: calculateAbilityUniqueness(pet, parent1, parent2),
    statDistribution: calculateStatDistributionUniqueness(pet),
    elementCombination: calculateElementCombinationUniqueness(pet, parent1, parent2, stone1, stone2),
    rarityFactor: calculateRarityFactor(pet),
    nameUniqueness: calculateNameUniqueness(pet),
    visualUniqueness: calculateVisualUniqueness(pet),
  };

  const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
  const percentile = calculatePercentile(totalScore);
  const rank = getUniquenessRank(totalScore);

  return {
    totalScore,
    breakdown,
    percentile,
    rank,
  };
}

/**
 * Calculate ability uniqueness (0-30 points)
 */
function calculateAbilityUniqueness(pet: Pet, parent1: Pet, parent2: Pet): number {
  let score = 0;

  // Count unique abilities (not from parents)
  const parentAbilityIds = new Set([
    ...parent1.activeAbilities.map((a) => a.id),
    ...parent1.passiveAbilities.map((a) => a.id),
    ...(parent1.ultimateAbility ? [parent1.ultimateAbility.id] : []),
    ...parent2.activeAbilities.map((a) => a.id),
    ...parent2.passiveAbilities.map((a) => a.id),
    ...(parent2.ultimateAbility ? [parent2.ultimateAbility.id] : []),
  ]);

  const allAbilities = [
    ...pet.activeAbilities,
    ...pet.passiveAbilities,
    ...(pet.ultimateAbility ? [pet.ultimateAbility] : []),
  ];

  const uniqueAbilities = allAbilities.filter((a) => !parentAbilityIds.has(a.id));
  score += uniqueAbilities.length * 5; // 5 points per unique ability

  // Bonus for ability mutations (similar name but different ID)
  const mutatedAbilities = allAbilities.filter((a) => {
    const parentAbilities = [
      ...parent1.activeAbilities,
      ...parent1.passiveAbilities,
      ...(parent1.ultimateAbility ? [parent1.ultimateAbility] : []),
      ...parent2.activeAbilities,
      ...parent2.passiveAbilities,
      ...(parent2.ultimateAbility ? [parent2.ultimateAbility] : []),
    ];
    
    const parentHasSimilar = parentAbilities.some((pa) => {
      const petNameWords = a.name.toLowerCase().split(' ');
      const parentNameWords = pa.name.toLowerCase().split(' ');
      return petNameWords.some((word) => parentNameWords.includes(word)) ||
             parentNameWords.some((word) => petNameWords.includes(word));
    });
    
    return parentHasSimilar && !parentAbilityIds.has(a.id);
  });
  score += mutatedAbilities.length * 3; // 3 points per mutation

  return Math.min(30, score);
}

/**
 * Calculate stat distribution uniqueness (0-20 points)
 */
function calculateStatDistributionUniqueness(pet: Pet): number {
  const stats = pet.stats;
  const totalStats = stats.maxHp + stats.attack + stats.defense + stats.speed;
  
  if (totalStats === 0) return 0;
  
  // Calculate stat ratios
  const hpRatio = stats.maxHp / totalStats;
  const atkRatio = stats.attack / totalStats;
  const defRatio = stats.defense / totalStats;
  const spdRatio = stats.speed / totalStats;

  // Uniqueness based on non-standard distributions
  // Standard would be ~0.4 HP, 0.25 ATK, 0.2 DEF, 0.15 SPD
  const standardRatios = { hp: 0.4, attack: 0.25, defense: 0.2, speed: 0.15 };
  
  let deviation = 0;
  deviation += Math.abs(hpRatio - standardRatios.hp);
  deviation += Math.abs(atkRatio - standardRatios.attack);
  deviation += Math.abs(defRatio - standardRatios.defense);
  deviation += Math.abs(spdRatio - standardRatios.speed);

  // More deviation = more unique (up to 20 points)
  return Math.min(20, deviation * 50);
}

/**
 * Calculate element combination uniqueness (0-15 points)
 */
function calculateElementCombinationUniqueness(
  pet: Pet,
  parent1: Pet,
  parent2: Pet,
  stone1: Stone,
  stone2: Stone
): number {
  let score = 0;

  // Get elements from pets (from family or abilities)
  const parent1Element = getPetElement(parent1);
  const parent2Element = getPetElement(parent2);
  const petElement = getPetElement(pet);

  const parentElements = new Set([
    parent1Element,
    parent2Element,
  ].filter(Boolean));

  const stoneElements = new Set([
    getElementFromStone(stone1),
    getElementFromStone(stone2),
  ].filter(Boolean));

  const allElements = new Set([
    ...parentElements,
    ...stoneElements,
    petElement,
  ].filter(Boolean));

  // Bonus for multiple unique elements
  if (allElements.size >= 3) {
    score += 10;
  } else if (allElements.size === 2) {
    score += 5;
  }

  // Bonus for rare element combinations
  const rareCombinations = [
    ['chaos', 'shadow'],
    ['light', 'shadow'],
    ['fire', 'water'],
  ];

  const petElementStr = petElement || '';
  for (const combo of rareCombinations) {
    if (combo.includes(petElementStr) && 
        allElements.has(combo[0]) && 
        allElements.has(combo[1])) {
      score += 5;
      break;
    }
  }

  return Math.min(15, score);
}

/**
 * Calculate rarity factor (0-10 points)
 */
function calculateRarityFactor(pet: Pet): number {
  // Higher rarity = more unique potential
  // Rarity multipliers: Basic=0, Rare=1, SR=2, Legendary=3, Mythic=4, Prismatic=5, Omega=6
  return Math.min(10, pet.rarity * 1.5);
}

/**
 * Calculate name uniqueness (0-10 points)
 */
function calculateNameUniqueness(pet: Pet): number {
  // Simplified: if name doesn't contain common words, it's more unique
  const commonWords = ['pet', 'creature', 'beast', 'monster', 'spirit', 'guardian', 'walker'];
  const nameLower = pet.name.toLowerCase();
  
  let score = 5; // Base score
  
  if (!commonWords.some((word) => nameLower.includes(word))) {
    score += 3;
  }
  
  // Check name length (longer names often more unique)
  if (pet.name.length > 15) {
    score += 2;
  }

  return Math.min(10, score);
}

/**
 * Calculate visual uniqueness (0-15 points)
 */
function calculateVisualUniqueness(pet: Pet): number {
  let score = 0;

  // More visual tags = more unique
  score += Math.min(10, pet.appearance.visualTags.length * 2);

  // Bonus for color mutations
  if (pet.appearance.colorMutation) {
    score += 3;
  }

  // Bonus for glow effects
  if (pet.appearance.glowColor) {
    score += 2;
  }

  return Math.min(15, score);
}

/**
 * Calculate percentile (0-100)
 * Simplified calculation - in production would compare against database
 */
function calculatePercentile(score: number): number {
  // Simplified percentile calculation
  // In production, would compare against database of all fusion scores
  const maxScore = 100; // Theoretical maximum
  return Math.min(100, Math.round((score / maxScore) * 100));
}

/**
 * Get uniqueness rank
 */
function getUniquenessRank(score: number): string {
  if (score >= 80) return 'Mythic';
  if (score >= 65) return 'Legendary';
  if (score >= 50) return 'Epic';
  if (score >= 35) return 'Rare';
  if (score >= 20) return 'Uncommon';
  return 'Common';
}

/**
 * Get element from pet (from family or primary ability)
 */
function getPetElement(pet: Pet): string | null {
  // Try to get element from abilities first
  const allAbilities = [
    ...pet.activeAbilities,
    ...pet.passiveAbilities,
    ...(pet.ultimateAbility ? [pet.ultimateAbility] : []),
  ];
  
  const elementAbility = allAbilities.find((a) => a.element);
  if (elementAbility?.element) {
    return elementAbility.element;
  }
  
  // Fallback to family-based element mapping
  const familyToElement: Record<string, string> = {
    PYRO_KIN: 'fire',
    AQUA_BORN: 'water',
    TERRA_FORGED: 'earth',
    VOLT_STREAM: 'lightning',
    SHADOW_VEIL: 'shadow',
    LUMINA: 'light',
    STEEL_WORKS: 'metal',
    ARCANE_RIFT: 'arcane',
    AERO_FLIGHT: 'air',
    WEIRDOS: 'chaos',
  };
  
  return familyToElement[pet.family] || null;
}

/**
 * Get element from stone
 */
function getElementFromStone(stone: Stone): string | null {
  // Map stone type to element
  const stoneToElement: Record<StoneType, string> = {
    [StoneType.RUBY]: 'fire',
    [StoneType.SAPPHIRE]: 'water',
    [StoneType.EMERALD]: 'nature',
    [StoneType.TOPAZ]: 'lightning',
    [StoneType.AMETHYST]: 'shadow',
    [StoneType.PEARL]: 'light',
    [StoneType.ONYX]: 'shadow',
    [StoneType.OPAL]: 'chaos',
  };

  return stoneToElement[stone.type] || null;
}

/**
 * Compare uniqueness scores
 */
export function compareUniquenessScores(score1: UniquenessScore, score2: UniquenessScore): number {
  return score2.totalScore - score1.totalScore; // Higher is better
}







