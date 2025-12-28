/**
 * Fusion Signature Service
 * Creates comprehensive fusion signatures that capture all pet aspects
 * for AI-driven fusion generation
 */

import type { Pet } from '../entities/Pet';
import type { Stone } from '../entities/Stone';
import { findElementInteraction } from './ElementInteractions';
import { FAMILY_CONFIGS } from '@/shared/types/family';

export interface FusionSignatureData {
  // Parent Information
  parent1: PetSignature;
  parent2: PetSignature;
  stones: StoneSignature[];

  // Fusion Intent (if provided)
  intent?: string;

  // Calculated Fusion Context
  calculatedRarity: number;
  generation: number;
  fusionSeed: string;

  // Element Interaction Context (for creative naming)
  elementInteraction?: {
    element1: string;
    element2: string;
    result: string;
    namePrefixes: string[];
    nameSuffixes: string[];
    abilityThemes: string[];
    description: string;
  };

  // Family Themes (for naming conventions)
  familyThemes: {
    parent1Family: string;
    parent2Family: string;
    parent1Colors: { primary: string; secondary: string; accent: string };
    parent2Colors: { primary: string; secondary: string; accent: string };
  };
}

export interface PetSignature {
  // Core Identity
  id: string;
  name: string;
  family: string;
  rarity: number;
  generation: number;

  // Stats
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };

  // Abilities
  abilities: AbilitySignature[];
  passives: string[];
  actives: string[];
  ultimates: string[];

  // Appearance
  visualTags: string[];
  colorMutation?: { r: number; g: number; b: number };
  glowColor?: string;

  // Lore & Narrative
  lore: string;
  fusionHistory: FusionHistorySignature[];

  // Battle Performance
  battleStats: {
    wins: number;
    losses: number;
    damageDealt: number;
    damageTaken: number;
  };

  // Lineage
  lineage: {
    basePetId: string;
    ancestorCount: number;
    uniqueMutations: number;
  };
}

export interface AbilitySignature {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'active' | 'ultimate';
  element?: string;
  tags: string[];
  effects: string[]; // Simplified effect descriptions
}

export interface FusionHistorySignature {
  generation: number;
  parentNames: [string, string];
  stonesUsed: [string, string];
  mutationCount: number;
}

export interface StoneSignature {
  id: string;
  type: string;
  tier: number;
  isGlitched: boolean;
  domainEffects?: string[];
}

/**
 * Fusion Signature Service
 */
export class FusionSignatureService {
  /**
   * Create comprehensive fusion signature from parents and stones
   */
  static create(
    parent1: Pet,
    parent2: Pet,
    stone1: Stone,
    stone2: Stone,
    intent?: string
  ): FusionSignatureData {
    const parent1Sig = this.createPetSignature(parent1);
    const parent2Sig = this.createPetSignature(parent2);
    const stonesSig = [
      this.createStoneSignature(stone1),
      this.createStoneSignature(stone2),
    ];

    // Generate fusion seed for reproducibility
    const fusionSeed = this.generateFusionSeed(parent1, parent2, stone1, stone2);

    // Calculate generation
    const maxGeneration = Math.max(parent1.fusionHistory.length, parent2.fusionHistory.length);
    const generation = maxGeneration + 1;

    // Estimate rarity (simplified - should use RarityEscalator in practice)
    const estimatedRarity = Math.max(parent1.rarity, parent2.rarity);

    // Detect element interaction for creative naming
    const stone1Element = this.getStoneElement(stone1.type);
    const stone2Element = this.getStoneElement(stone2.type);
    const parent1Element = this.getPetElement(parent1);
    const parent2Element = this.getPetElement(parent2);
    
    const element1 = stone1Element || parent1Element || 'fire';
    const element2 = stone2Element || parent2Element || 'water';
    const interaction = findElementInteraction(element1, element2);

    // Get family themes for naming conventions
    const family1Config = FAMILY_CONFIGS[parent1.family];
    const family2Config = FAMILY_CONFIGS[parent2.family];

    return {
      parent1: parent1Sig,
      parent2: parent2Sig,
      stones: stonesSig,
      intent,
      calculatedRarity: estimatedRarity,
      generation,
      fusionSeed,
      elementInteraction: interaction ? {
        element1: interaction.element1,
        element2: interaction.element2,
        result: interaction.result,
        namePrefixes: interaction.namePrefixes,
        nameSuffixes: interaction.nameSuffixes,
        abilityThemes: interaction.abilityThemes,
        description: interaction.description,
      } : undefined,
      familyThemes: {
        parent1Family: parent1.family,
        parent2Family: parent2.family,
        parent1Colors: {
          primary: family1Config.colorPalette.primary,
          secondary: family1Config.colorPalette.secondary,
          accent: family1Config.colorPalette.accent,
        },
        parent2Colors: {
          primary: family2Config.colorPalette.primary,
          secondary: family2Config.colorPalette.secondary,
          accent: family2Config.colorPalette.accent,
        },
      },
    };
  }

  /**
   * Create pet signature
   */
  private static createPetSignature(pet: Pet): PetSignature {
    // Categorize abilities
    const passives: string[] = [];
    const actives: string[] = [];
    const ultimates: string[] = [];

    // Combine all abilities from pet
    const allAbilities = [...pet.passiveAbilities, ...pet.activeAbilities];
    if (pet.ultimateAbility) allAbilities.push(pet.ultimateAbility);

    const abilities: AbilitySignature[] = allAbilities.map((ability) => {
      // Categorize
      if (ability.type === 'passive') passives.push(ability.name);
      else if (ability.type === 'active') actives.push(ability.name);
      else if (ability.type === 'ultimate') ultimates.push(ability.name);

      // Create signature
      return {
        id: ability.id,
        name: ability.name,
        description: ability.description,
        type: ability.type,
        element: ability.element || undefined,
        tags: [...ability.tags],
        effects: ability.effects.map((effect) => this.describeEffect(effect)),
      };
    });

    // Extract lineage info
    const basePetId = pet.basePetId || 'unknown';
    const ancestorCount = pet.fusionHistory.length;
    const uniqueMutations = new Set(pet.fusionHistory.map((h) => h.mutationCount)).size;

    // Create fusion history signatures
    const fusionHistory: FusionHistorySignature[] = pet.fusionHistory.map((h) => ({
      generation: h.generation,
      parentNames: [h.parentIds[0], h.parentIds[1]], // Simplified - would need to look up names
      stonesUsed: h.stonesUsed,
      mutationCount: h.mutationCount,
    }));

    return {
      id: pet.id,
      name: pet.name,
      family: pet.family,
      rarity: pet.rarity,
      generation: pet.fusionHistory.length,
      stats: { ...pet.stats },
      abilities,
      passives,
      actives,
      ultimates,
      visualTags: [...pet.appearance.visualTags],
      colorMutation: pet.appearance.colorMutation,
      glowColor: pet.appearance.glowColor,
      lore: '', // Pet entity doesn't have lore - would need to be stored separately or added
      fusionHistory,
      battleStats: pet.battleStats ? {
        wins: pet.battleStats.wins,
        losses: pet.battleStats.losses,
        damageDealt: pet.battleStats.damageDealt,
        damageTaken: pet.battleStats.damageTaken,
      } : { wins: 0, losses: 0, damageDealt: 0, damageTaken: 0 },
      lineage: {
        basePetId,
        ancestorCount,
        uniqueMutations,
      },
    };
  }

  /**
   * Create stone signature
   */
  private static createStoneSignature(stone: Stone): StoneSignature {
    return {
      id: stone.id,
      type: stone.type,
      tier: stone.tier,
      isGlitched: stone.isGlitched,
      domainEffects: undefined, // Stone entity doesn't have domainEffects yet - TODO: add when implementing stone system
    };
  }

  /**
   * Describe an ability effect for the signature
   */
  private static describeEffect(effect: any): string {
    const parts: string[] = [];

    if (effect.type === 'damage') {
      parts.push(`Deal ${effect.value} ${effect.element || ''} damage`);
    } else if (effect.type === 'heal') {
      parts.push(`Heal ${effect.value}`);
    } else if (effect.type === 'buff') {
      parts.push(`Buff ${effect.target}`);
    } else if (effect.type === 'debuff') {
      parts.push(`Debuff ${effect.target}`);
    } else if (effect.type === 'status') {
      parts.push(`Apply ${effect.statusType} (${effect.statusChance}% chance)`);
    }

    if (effect.lifesteal) {
      parts.push(`Lifesteal: ${effect.lifesteal}%`);
    }
    if (effect.scaling) {
      parts.push(`Scales with ${effect.scaling}`);
    }

    return parts.join(', ');
  }

  /**
   * Generate deterministic fusion seed
   */
  private static generateFusionSeed(
    parent1: Pet,
    parent2: Pet,
    stone1: Stone,
    stone2: Stone
  ): string {
    const components = [
      parent1.id,
      parent2.id,
      stone1.id,
      stone2.id,
      Date.now().toString(),
    ];
    return components.join('-');
  }

  /**
   * Get element from stone type
   */
  private static getStoneElement(stoneType: string): string | null {
    const stoneToElement: Record<string, string> = {
      RUBY: 'fire',
      SAPPHIRE: 'water',
      EMERALD: 'nature',
      TOPAZ: 'lightning',
      AMETHYST: 'shadow',
      PEARL: 'light',
      ONYX: 'shadow',
      OPAL: 'chaos',
    };
    return stoneToElement[stoneType] || null;
  }

  /**
   * Get element from pet (from abilities or family)
   */
  private static getPetElement(pet: Pet): string | null {
    // Try to get element from abilities first
    const allAbilities = [
      ...pet.passiveAbilities,
      ...pet.activeAbilities,
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
   * Serialize signature to JSON for AI consumption
   */
  static serialize(signature: FusionSignatureData): string {
    return JSON.stringify(signature, null, 2);
  }

  /**
   * Get all abilities from pet signature (flattened)
   */
  static getAllAbilities(signature: PetSignature): AbilitySignature[] {
    return signature.abilities;
  }

  /**
   * Get combined visual tags from both parents
   */
  static getCombinedVisualTags(signature: FusionSignatureData): string[] {
    const tags = new Set<string>();
    signature.parent1.visualTags.forEach((tag) => tags.add(tag));
    signature.parent2.visualTags.forEach((tag) => tags.add(tag));
    return Array.from(tags);
  }
}

