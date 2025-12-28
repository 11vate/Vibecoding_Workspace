/**
 * Glitched Fusion Service
 * Handles glitched fusion detection, ability generation, and lore
 */

import type { Pet } from '../entities/Pet';
import type { Stone } from '../entities/Stone';
import { StoneType } from '../entities/Stone';
import { GlitchedStoneService } from './GlitchedStoneService';
import { Ability } from '../entities/Ability';
import { generateAbilityId } from '@/shared/utils/idGenerator';
import type { Rarity } from '@/shared/types/rarity';
import { RARITY_CONFIG } from '@/shared/types/rarity';

export interface GlitchedFusionResult {
  isGlitched: boolean;
  glitchSeverity: number;
  glitchedAbilities: Ability[];
  glitchedLore: string;
  visualEffects: string[];
}

/**
 * Glitched Fusion Service
 */
export class GlitchedFusionService {
  /**
   * Check if a fusion should be glitched based on various conditions
   */
  static shouldTriggerGlitchedFusion(
    parent1: Pet,
    parent2: Pet,
    stone1: Stone,
    stone2: Stone,
    fusionCount: number
  ): boolean {
    // Check stone-based glitch trigger
    if (GlitchedStoneService.shouldTriggerGlitchedFusion(stone1, stone2)) {
      return true;
    }

    // High generation pets have increased glitch chance
    const maxGeneration = Math.max(parent1.getGeneration(), parent2.getGeneration());
    if (maxGeneration >= 5) {
      const glitchChance = 0.05 + (maxGeneration - 5) * 0.02; // 5% base + 2% per generation above 5
      if (Math.random() < glitchChance) {
        return true;
      }
    }

    // Specific stone type combinations can trigger glitched fusions
    if (this.isGlitchedStoneCombination(stone1.type, stone2.type)) {
      return true;
    }

    // High mutation count increases glitch chance
    const totalMutations = parent1.getTotalMutations() + parent2.getTotalMutations();
    if (totalMutations >= 10) {
      const glitchChance = Math.min(0.1 + totalMutations * 0.01, 0.3); // Up to 30% chance
      if (Math.random() < glitchChance) {
        return true;
      }
    }

    // Fusion count increases glitch chance (chaos accumulates)
    if (fusionCount >= 20) {
      const glitchChance = Math.min(0.05 + (fusionCount - 20) * 0.005, 0.2); // Up to 20% chance
      if (Math.random() < glitchChance) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if stone combination is a glitched combination
   */
  private static isGlitchedStoneCombination(
    type1: Stone['type'],
    type2: Stone['type']
  ): boolean {
    // Specific combinations that always trigger glitched fusions
    const glitchedCombinations: Array<[Stone['type'], Stone['type']]> = [
      [StoneType.OPAL, StoneType.OPAL], // Double OPAL = guaranteed glitch
      [StoneType.AMETHYST, StoneType.OPAL], // Reality + Balance = chaos
      [StoneType.PEARL, StoneType.ONYX], // Light + Dark = paradox
    ];

    const normalized1 = type1 < type2 ? type1 : type2;
    const normalized2 = type1 < type2 ? type2 : type1;

    return glitchedCombinations.some(
      ([t1, t2]) => (t1 === normalized1 && t2 === normalized2) || (t1 === normalized2 && t2 === normalized1)
    );
  }

  /**
   * Calculate glitch severity (0-100)
   */
  static calculateGlitchSeverity(
    parent1: Pet,
    parent2: Pet,
    stone1: Stone,
    stone2: Stone
  ): number {
    let severity = 0;

    // Both stones glitched = high severity
    if (stone1.isGlitched && stone2.isGlitched) {
      severity += 50;
    } else if (stone1.isGlitched || stone2.isGlitched) {
      severity += 25;
    }

    // High generation = more chaos
    const maxGeneration = Math.max(parent1.getGeneration(), parent2.getGeneration());
    severity += maxGeneration * 5;

    // High mutation count = more instability
    const totalMutations = parent1.getTotalMutations() + parent2.getTotalMutations();
    severity += Math.min(totalMutations * 2, 20);

    // Specific stone combinations add severity
    if (this.isGlitchedStoneCombination(stone1.type, stone2.type)) {
      severity += 30;
    }

    // Random component
    severity += Math.random() * 20;

    return Math.min(severity, 100);
  }

  /**
   * Generate glitched abilities for a fusion
   */
  static generateGlitchedAbilities(
    rarity: Rarity,
    glitchSeverity: number,
    parentAbilities: Ability[]
  ): Ability[] {
    const rarityConfig = RARITY_CONFIG[rarity];
    const abilityCount = rarityConfig.passiveCount + rarityConfig.activeCount + rarityConfig.ultimateCount;
    const glitchedAbilities: Ability[] = [];

    // Determine how many abilities should be glitched
    const glitchRatio = glitchSeverity / 100;
    const glitchedCount = Math.max(1, Math.floor(abilityCount * glitchRatio));

    // Generate glitched abilities
    for (let i = 0; i < glitchedCount; i++) {
      const abilityType = i < rarityConfig.passiveCount
        ? 'passive'
        : i < rarityConfig.passiveCount + rarityConfig.activeCount
        ? 'active'
        : 'ultimate';

      const glitchedAbility = this.generateGlitchedAbility(
        abilityType as 'passive' | 'active' | 'ultimate',
        glitchSeverity,
        parentAbilities
      );
      glitchedAbilities.push(glitchedAbility);
    }

    return glitchedAbilities;
  }

  /**
   * Generate a single glitched ability
   */
  private static generateGlitchedAbility(
    type: 'passive' | 'active' | 'ultimate',
    glitchSeverity: number,
    parentAbilities: Ability[]
  ): Ability {
    const severityLevel = this.getSeverityLevel(glitchSeverity);
    const templates = this.getGlitchedAbilityTemplates(type, severityLevel);

    // Pick a random template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Modify based on parent abilities if available
    let name = template.name;
    let description = template.description;
    if (parentAbilities.length > 0) {
      const parentAbility = parentAbilities[Math.floor(Math.random() * parentAbilities.length)];
      name = `${parentAbility.name} [GLITCHED]`;
      description = `${template.description} This ability is corrupted by ${parentAbility.name}.`;
    }

    return new Ability(
      generateAbilityId(),
      name,
      description,
      type,
      template.energyCost,
      template.cooldown,
      0,
      template.effects,
      ['glitched', ...template.tags],
      template.element
    );
  }

  /**
   * Get glitched ability templates by type and severity
   */
  private static getGlitchedAbilityTemplates(
    type: 'passive' | 'active' | 'ultimate',
    severityLevel: 'low' | 'medium' | 'high' | 'extreme'
  ): Array<{
    name: string;
    description: string;
    energyCost: number;
    cooldown: number;
    effects: any[];
    tags: string[];
    element: string | null;
  }> {
    const templates: Record<string, Array<{
      name: string;
      description: string;
      energyCost: number;
      cooldown: number;
      effects: any[];
      tags: string[];
      element: string | null;
    }>> = {
      'passive-low': [
        {
          name: 'Reality Flicker',
          description: 'Occasionally phases in and out of existence, gaining brief invulnerability.',
          energyCost: 0,
          cooldown: 0,
          effects: [{
            type: 'special',
            target: 'self',
            value: 0.1,
            statusChance: 10,
            statusType: undefined,
            statusDuration: 1,
          }],
          tags: ['glitched', 'defensive'],
          element: null,
        },
      ],
      'passive-medium': [
        {
          name: 'Chaos Resonance',
          description: 'Randomly applies status effects to both allies and enemies.',
          energyCost: 0,
          cooldown: 0,
          effects: [{
            type: 'status',
            target: 'random',
            value: 0,
            statusChance: 15,
            statusType: undefined,
            statusDuration: 2,
          }],
          tags: ['glitched', 'chaos'],
          element: null,
        },
      ],
      'passive-high': [
        {
          name: 'Dimensional Instability',
          description: 'Stats randomly fluctuate each turn. Reality bends around this creature.',
          energyCost: 0,
          cooldown: 0,
          effects: [{
            type: 'special',
            target: 'self',
            value: 0.2,
            statusChance: 0,
            statusType: undefined,
            statusDuration: 0,
          }],
          tags: ['glitched', 'chaos', 'unpredictable'],
          element: null,
        },
      ],
      'active-low': [
        {
          name: 'Glitch Strike',
          description: 'An attack that sometimes hits the wrong target. Damage is unpredictable.',
          energyCost: 2,
          cooldown: 2,
          effects: [{
            type: 'damage',
            target: 'random-enemy',
            value: 0.8,
            statusChance: 0,
            statusType: undefined,
            statusDuration: 0,
            scaling: 'attack',
          }],
          tags: ['glitched', 'damage', 'unpredictable'],
          element: null,
        },
      ],
      'active-medium': [
        {
          name: 'Reality Tear',
          description: 'Creates a temporary rift that damages enemies and heals allies randomly.',
          energyCost: 3,
          cooldown: 3,
          effects: [{
            type: 'damage',
            target: 'all-enemies',
            value: 0.6,
            statusChance: 0,
            statusType: undefined,
            statusDuration: 0,
            scaling: 'attack',
          }, {
            type: 'heal',
            target: 'all-allies',
            value: 0.4,
            statusChance: 0,
            statusType: undefined,
            statusDuration: 0,
            scaling: 'hp',
          }],
          tags: ['glitched', 'damage', 'heal', 'chaos'],
          element: null,
        },
      ],
      'active-high': [
        {
          name: 'Paradox Blast',
          description: 'Deals damage based on missing HP. The less healthy, the more powerful.',
          energyCost: 4,
          cooldown: 4,
          effects: [{
            type: 'damage',
            target: 'single-enemy',
            value: 1.5,
            statusChance: 0,
            statusType: undefined,
            statusDuration: 0,
            scaling: 'attack',
          }],
          tags: ['glitched', 'damage', 'risky'],
          element: null,
        },
      ],
      'ultimate-extreme': [
        {
          name: 'Reality Collapse',
          description: 'Forces a complete reset of the battlefield. All status effects, buffs, and debuffs are removed. All pets take damage equal to 30% of their max HP.',
          energyCost: 6,
          cooldown: 8,
          effects: [{
            type: 'damage',
            target: 'all',
            value: 0.3,
            statusChance: 0,
            statusType: undefined,
            statusDuration: 0,
            scaling: 'hp',
          }, {
            type: 'special',
            target: 'all',
            value: 0,
            statusChance: 0,
            statusType: undefined,
            statusDuration: 0,
          }],
          tags: ['glitched', 'ultimate', 'chaos', 'reset'],
          element: null,
        },
      ],
    };

    const key = `${type}-${severityLevel}`;
    return templates[key] || templates[`${type}-low`] || [];
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
   * Generate glitched lore for a fusion
   */
  static generateGlitchedLore(
    parent1: Pet,
    parent2: Pet,
    stone1: Stone,
    stone2: Stone,
    glitchSeverity: number
  ): string {
    const severityLevel = this.getSeverityLevel(glitchSeverity);
    const templates = this.getGlitchedLoreTemplates(severityLevel);

    const template = templates[Math.floor(Math.random() * templates.length)];

    return template
      .replace('{parent1}', parent1.name)
      .replace('{parent2}', parent2.name)
      .replace('{stone1}', stone1.type.toLowerCase())
      .replace('{stone2}', stone2.type.toLowerCase());
  }

  /**
   * Get glitched lore templates
   */
  private static getGlitchedLoreTemplates(
    severityLevel: 'low' | 'medium' | 'high' | 'extreme'
  ): string[] {
    const templates: Record<string, string[]> = {
      low: [
        '{parent1} and {parent2} fused with {stone1} and {stone2} stones, but something went wrong. The fusion flickers between states, never quite settling into reality.',
        'A minor glitch occurred during the fusion of {parent1} and {parent2}. The {stone1} and {stone2} stones created an unstable bond, causing occasional reality distortions.',
      ],
      medium: [
        'The fusion of {parent1} and {parent2} was corrupted by the {stone1} and {stone2} stones. Reality bends around this creature, and its abilities are unpredictable.',
        'Something broke during the fusion process. {parent1} and {parent2} merged, but the {stone1} and {stone2} stones created a chaotic resonance that warps the laws of nature.',
      ],
      high: [
        'The fusion of {parent1} and {parent2} with {stone1} and {stone2} stones created a paradox. This creature exists in multiple states simultaneously, defying logic and physics.',
        'Reality itself rejected this fusion. {parent1} and {parent2} were forced together by {stone1} and {stone2} stones, creating a being that should not exist. Its very presence glitches the world around it.',
      ],
      extreme: [
        'The Grid itself screamed when {parent1} and {parent2} fused with {stone1} and {stone2} stones. This creature is a walking contradiction, a glitch in the code of existence. It breaks the rules simply by existing.',
        'This fusion should have been impossible. {parent1} and {parent2}, combined with {stone1} and {stone2} stones, created something that violates every law of The Grid. It is chaos made manifest, a reality error that cannot be fixed.',
      ],
    };

    return templates[severityLevel] || templates.low;
  }

  /**
   * Get visual effects for glitched fusion
   */
  static getGlitchedVisualEffects(glitchSeverity: number): string[] {
    const severityLevel = this.getSeverityLevel(glitchSeverity);
    const effects: Record<string, string[]> = {
      low: ['flickering', 'unstable', 'minor-glitch'],
      medium: ['glitching', 'reality-distortion', 'chaos-aura'],
      high: ['paradox', 'multi-dimensional', 'reality-break'],
      extreme: ['existence-error', 'code-break', 'reality-collapse', 'impossible'],
    };

    return effects[severityLevel] || effects.low;
  }
}







