/**
 * Visual Genome Generator
 * Generates deterministic visual genomes for pets from fusion signatures
 */

import type { BaseForm, AnimationProfile } from '@/domain/entities/VisualGenome';
import type { FusionSignatureData } from './FusionSignature';
import type { Rarity } from '@/shared/types/rarity';
import type { Pet } from '@/domain/entities/Pet';
import type { BasePet } from '@/domain/entities/BasePet';
import { PetVisualGenome } from '@/domain/entities/VisualGenome';
import { SeededRandom } from '@/shared/utils/seededRandom';
import { PetFamily } from '@/shared/types/family';

/**
 * Generate visual genome from fusion signature
 * Deterministic based on fusion seed
 */
export class VisualGenomeGenerator {
  /**
   * Generate genome for a base pet (or hacked pet)
   */
  static generateFromBase(
    basePet: BasePet,
    seed: string,
    extraTags: string[] = []
  ): PetVisualGenome {
    const random = new SeededRandom(seed);
    
    const baseForm = this.determineBaseFormFromFamily(basePet.family, random);
    const bodyParts = this.generateBodyPartsFromFamily(basePet.family, random);
    const elementAffinity = [this.getFamilyElement(basePet.family) || 'neutral'];
    
    return {
      baseForm,
      bodyParts,
      elementAffinity,
      rarity: basePet.rarity,
      mutationTraits: extraTags.includes('glitched') ? ['glitch'] : [],
      paletteSeed: seed,
      animationProfile: extraTags.includes('hacked') ? 'chaotic' : 'stable',
      sizeModifier: 1.0,
      visualTags: [...basePet.visualTags, ...extraTags],
    };
  }

  /**
   * Determine base form from family
   */
  private static determineBaseFormFromFamily(family: string, random: SeededRandom): BaseForm {
    // Family-specific tendencies
    if (family === PetFamily.AERO_FLIGHT || family === PetFamily.LUMINA) return 'floating';
    if (family === PetFamily.TERRA_FORGED) return 'quadruped';
    if (family === PetFamily.SHADOW_VEIL) return 'biped';
    if (family === PetFamily.VOLT_STREAM) return 'serpentine';
    
    return random.choice(['biped', 'quadruped', 'serpentine', 'floating']);
  }

  /**
   * Generate body parts from family
   */
  private static generateBodyPartsFromFamily(family: string, random: SeededRandom): PetVisualGenome['bodyParts'] {
    const head = family === PetFamily.AERO_FLIGHT ? 'beaked' : 
                 family === PetFamily.SHADOW_VEIL ? 'masked' :
                 family === PetFamily.TERRA_FORGED ? 'horned' : 'standard';
                 
    const torso = family === PetFamily.TERRA_FORGED ? 'armored' :
                  family === PetFamily.AQUA_BORN ? 'scaled' : 'standard';
                  
    const limbs = family === PetFamily.AQUA_BORN ? 'webbed' :
                  family === PetFamily.PYRO_KIN ? 'clawed' : 'standard';
                  
    const wings = (family === PetFamily.AERO_FLIGHT || family === PetFamily.LUMINA) ? 'feathered' : undefined;

    return {
      head,
      torso,
      limbs,
      wings,
      tail: random.nextFloat(0, 1) > 0.5 ? 'standard' : undefined
    };
  }

  /**
   * Generate genome for a fused pet
   */
  static generateFromFusion(
    signature: FusionSignatureData,
    rarity: Rarity,
    fusionSeed: string,
    parent1?: Pet,
    parent2?: Pet
  ): PetVisualGenome {
    const random = new SeededRandom(fusionSeed);

    // Get parent genomes from actual Pet objects if available
    const parent1Genome = parent1?.appearance.visualGenome;
    const parent2Genome = parent2?.appearance.visualGenome;

    // Determine base form
    const baseForm = this.determineBaseForm(parent1Genome, parent2Genome, random);

    // Blend body parts
    const bodyParts = this.blendBodyParts(parent1Genome, parent2Genome, random);

    // Determine element affinity from stones and parents
    const elementAffinity = this.determineElementAffinity(signature, parent1Genome, parent2Genome);

    // Determine mutation traits
    const mutationTraits = this.determineMutationTraits(signature, parent1Genome, parent2Genome, random, parent1, parent2);

    // Generate deterministic palette seed
    const paletteSeed = this.generatePaletteSeed(fusionSeed, signature);

    // Determine animation profile
    const animationProfile = this.determineAnimationProfile(parent1Genome, parent2Genome, signature, random);

    // Determine size modifier
    const sizeModifier = this.determineSizeModifier(parent1Genome, parent2Genome, rarity, random);

    // Combine visual tags
    const visualTags = this.combineVisualTags(signature, parent1Genome, parent2Genome);

    return {
      baseForm,
      bodyParts,
      elementAffinity,
      rarity,
      mutationTraits,
      paletteSeed,
      animationProfile,
      sizeModifier,
      visualTags,
    };
  }

  /**
   * Determine base form from parents
   */
  private static determineBaseForm(
    parent1Genome: PetVisualGenome | undefined,
    parent2Genome: PetVisualGenome | undefined,
    random: SeededRandom
  ): BaseForm {
    const forms: BaseForm[] = ['biped', 'quadruped', 'serpentine', 'floating'];

    // If both parents have genomes, blend their forms
    if (parent1Genome && parent2Genome) {
      const parentForms = [parent1Genome.baseForm, parent2Genome.baseForm];
      // 70% chance to inherit from parents, 30% chance to mutate
      if (random.nextFloat(0, 1) < 0.7) {
        return random.choice(parentForms);
      }
    } else if (parent1Genome) {
      // 80% chance to inherit from parent
      if (random.nextFloat(0, 1) < 0.8) {
        return parent1Genome.baseForm;
      }
    } else if (parent2Genome) {
      if (random.nextFloat(0, 1) < 0.8) {
        return parent2Genome.baseForm;
      }
    }

    // Random selection if no parent or mutation
    return random.choice(forms);
  }

  /**
   * Blend body parts from parents
   */
  private static blendBodyParts(
    parent1Genome: PetVisualGenome | undefined,
    parent2Genome: PetVisualGenome | undefined,
    random: SeededRandom
  ): PetVisualGenome['bodyParts'] {
    const headOptions = ['horned', 'beaked', 'fanged', 'crowned', 'masked', 'standard'];
    const torsoOptions = ['armored', 'scaled', 'furry', 'crystalline', 'ethereal', 'standard'];
    const limbOptions = ['clawed', 'hooved', 'webbed', 'tentacled', 'winged', 'standard'];
    const tailOptions = ['long', 'short', 'barbed', 'fluffy', 'scaled', undefined];
    const wingOptions = ['feathered', 'membranous', 'crystalline', 'ethereal', undefined];

    const blendPart = (
      parent1Part: string | undefined,
      parent2Part: string | undefined,
      options: string[]
    ): string => {
      if (parent1Part && parent2Part) {
        // 60% chance to inherit from parents, 40% chance to blend or mutate
        if (random.nextFloat(0, 1) < 0.6) {
          return random.choice([parent1Part, parent2Part]);
        }
      } else if (parent1Part) {
        if (random.nextFloat(0, 1) < 0.7) {
          return parent1Part;
        }
      } else if (parent2Part) {
        if (random.nextFloat(0, 1) < 0.7) {
          return parent2Part;
        }
      }
      return random.choice(options);
    };

    return {
      head: blendPart(parent1Genome?.bodyParts.head, parent2Genome?.bodyParts.head, headOptions),
      torso: blendPart(parent1Genome?.bodyParts.torso, parent2Genome?.bodyParts.torso, torsoOptions),
      limbs: blendPart(parent1Genome?.bodyParts.limbs, parent2Genome?.bodyParts.limbs, limbOptions),
      tail: random.nextFloat(0, 1) < 0.5
        ? blendPart(parent1Genome?.bodyParts.tail, parent2Genome?.bodyParts.tail, tailOptions.filter((t): t is string => t !== undefined))
        : undefined,
      wings: random.nextFloat(0, 1) < 0.3
        ? blendPart(parent1Genome?.bodyParts.wings, parent2Genome?.bodyParts.wings, wingOptions.filter((w): w is string => w !== undefined))
        : undefined,
    };
  }

  /**
   * Determine element affinity from stones and parents
   */
  private static determineElementAffinity(
    signature: FusionSignatureData,
    parent1Genome: PetVisualGenome | undefined,
    parent2Genome: PetVisualGenome | undefined
  ): string[] {
    const elements = new Set<string>();

    // Add elements from stones
    signature.stones.forEach((stone) => {
      const element = this.getStoneElement(stone.type);
      if (element) elements.add(element);
    });

    // Add elements from element interaction
    if (signature.elementInteraction) {
      elements.add(signature.elementInteraction.result);
    }

    // Add elements from parents
    if (parent1Genome) {
      parent1Genome.elementAffinity.forEach((e) => elements.add(e));
    }
    if (parent2Genome) {
      parent2Genome.elementAffinity.forEach((e) => elements.add(e));
    }

    // If no elements found, use default based on family
    if (elements.size === 0) {
      const familyElement = this.getFamilyElement(signature.parent1.family);
      if (familyElement) elements.add(familyElement);
    }

    return Array.from(elements);
  }

  /**
   * Determine mutation traits
   */
  private static determineMutationTraits(
    signature: FusionSignatureData,
    parent1Genome: PetVisualGenome | undefined,
    parent2Genome: PetVisualGenome | undefined,
    random: SeededRandom,
    parent1?: Pet,
    parent2?: Pet
  ): string[] {
    const traits = new Set<string>();

    // Inherit traits from parents
    if (parent1Genome) {
      parent1Genome.mutationTraits.forEach((t) => traits.add(t));
    }
    if (parent2Genome) {
      parent2Genome.mutationTraits.forEach((t) => traits.add(t));
    }

    // Check for glitched stones
    const hasGlitchedStone = signature.stones.some((s) => s.isGlitched);
    if (hasGlitchedStone) {
      traits.add('glitch');
    }

    // Check for high mutation count from actual pets
    const mutationCount = (parent1?.getTotalMutations() || 0) + (parent2?.getTotalMutations() || 0);
    if (mutationCount > 5) {
      traits.add('unstable');
    }
    if (mutationCount > 10) {
      traits.add('chaotic');
    }

    // Rare chance for new traits
    if (random.nextFloat(0, 1) < 0.1) {
      const newTraits = ['crystal', 'ethereal', 'shadow', 'radiant', 'corrupted'];
      traits.add(random.choice(newTraits));
    }

    return Array.from(traits);
  }

  /**
   * Generate deterministic palette seed
   */
  private static generatePaletteSeed(fusionSeed: string, signature: FusionSignatureData): string {
    // Combine fusion seed with parent IDs and stone types for deterministic color
    const seedString = `${fusionSeed}-${signature.parent1.id}-${signature.parent2.id}-${signature.stones[0]?.type}-${signature.stones[1]?.type}`;
    return seedString;
  }

  /**
   * Determine animation profile
   */
  private static determineAnimationProfile(
    parent1Genome: PetVisualGenome | undefined,
    parent2Genome: PetVisualGenome | undefined,
    signature: FusionSignatureData,
    random: SeededRandom
  ): AnimationProfile {
    const profiles: AnimationProfile[] = ['stable', 'chaotic', 'heavy', 'agile'];

    // Check fusion intent
    if (signature.intent === 'VOLATILITY') {
      return 'chaotic';
    }
    if (signature.intent === 'RESILIENCE') {
      return 'heavy';
    }
    if (signature.intent === 'SYMBIOSIS') {
      return 'stable';
    }

    // Inherit from parents
    if (parent1Genome && parent2Genome) {
      if (random.nextFloat(0, 1) < 0.6) {
        return random.choice([parent1Genome.animationProfile, parent2Genome.animationProfile]);
      }
    } else if (parent1Genome) {
      if (random.nextFloat(0, 1) < 0.7) {
        return parent1Genome.animationProfile;
      }
    } else if (parent2Genome) {
      if (random.nextFloat(0, 1) < 0.7) {
        return parent2Genome.animationProfile;
      }
    }

    return random.choice(profiles);
  }

  /**
   * Determine size modifier
   */
  private static determineSizeModifier(
    parent1Genome: PetVisualGenome | undefined,
    parent2Genome: PetVisualGenome | undefined,
    rarity: Rarity,
    random: SeededRandom
  ): number {
    // Base size from rarity
    let baseSize = 1.0;
    if (rarity >= 5) baseSize = 1.2;
    else if (rarity >= 3) baseSize = 1.1;

    // Blend parent sizes
    let parentSize = 1.0;
    if (parent1Genome && parent2Genome) {
      parentSize = (parent1Genome.sizeModifier + parent2Genome.sizeModifier) / 2;
    } else if (parent1Genome) {
      parentSize = parent1Genome.sizeModifier;
    } else if (parent2Genome) {
      parentSize = parent2Genome.sizeModifier;
    }

    // Average with slight variance
    const finalSize = (baseSize + parentSize) / 2;
    const variance = (random.nextFloat(0, 1) - 0.5) * 0.2;

    return Math.max(0.5, Math.min(1.5, finalSize + variance));
  }

  /**
   * Combine visual tags
   */
  private static combineVisualTags(
    signature: FusionSignatureData,
    parent1Genome: PetVisualGenome | undefined,
    parent2Genome: PetVisualGenome | undefined
  ): string[] {
    const tags = new Set<string>();

    // Add tags from signature
    signature.parent1.visualTags.forEach((t) => tags.add(t));
    signature.parent2.visualTags.forEach((t) => tags.add(t));

    // Add tags from genomes
    if (parent1Genome) {
      parent1Genome.visualTags.forEach((t) => tags.add(t));
    }
    if (parent2Genome) {
      parent2Genome.visualTags.forEach((t) => tags.add(t));
    }

    // Add fusion tag
    tags.add('fused');

    return Array.from(tags).slice(0, 10);
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
   * Get element from family
   */
  private static getFamilyElement(family: string): string | null {
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

    return familyToElement[family] || null;
  }
}
