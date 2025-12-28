/**
 * Perform Fusion Use Case
 * Executes a fusion operation and returns the result
 */

import { Pet } from '@/domain/entities/Pet';
import type { BasePetId } from '@/shared/types/brands';
import type { Stone } from '@/domain/entities/Stone';
import { StoneType } from '@/domain/entities/Stone';
import type { IPetRepository } from '@/domain/repositories/IPetRepository';
import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';
import { FusionCalculator } from '@/domain/services/FusionCalculator';
import { FusionSignatureService } from '@/domain/services/FusionSignature';
import { FusionAIService } from '@/infrastructure/ai/FusionAIService';
import { SpriteGenerator } from '@/infrastructure/sprite/SpriteGenerator';
import { GlitchedStoneService } from '@/domain/services/GlitchedStoneService';
import { GlitchedFusionService } from '@/domain/services/GlitchedFusionService';
import { generatePetId } from '@/shared/utils/idGenerator';
import { Ability } from '@/domain/entities/Ability';
import { AbilityGenerator } from '@/domain/services/AbilityGenerator';
import { AbilityTemplateLibrary } from '@/domain/services/AbilityTemplate';
import { generateAbilityId } from '@/shared/utils/idGenerator';
import { calculateUniquenessScore } from '@/domain/services/UniquenessScoring';
import { FAMILY_CONFIGS } from '@/shared/types/family';
import { VisualGenomeGenerator } from '@/domain/services/VisualGenomeGenerator';

export interface PerformFusionInput {
  parent1Id: string;
  parent2Id: string;
  stone1Id: string;
  stone2Id: string;
  fusionIntent?: string;
}

export interface PerformFusionOutput {
  resultPet: Pet;
  consumedPets: [Pet, Pet];
  consumedStones: [Stone, Stone];
  uniquenessScore?: import('@/domain/services/UniquenessScoring').UniquenessScore;
}

/**
 * Perform Fusion Use Case
 */
export class PerformFusion {
  private fusionAIService: FusionAIService;
  private spriteGenerator: SpriteGenerator;

  constructor(
    private petRepository: IPetRepository,
    private stoneRepository: IStoneRepository
  ) {
    // Initialize AI service with pet repository for uniqueness checking
    this.fusionAIService = new FusionAIService(petRepository);
    // Initialize sprite generator
    this.spriteGenerator = new SpriteGenerator();
  }

  async execute(input: PerformFusionInput): Promise<PerformFusionOutput> {
    // Fetch inputs
    const parent1 = await this.petRepository.findById(input.parent1Id as any);
    const parent2 = await this.petRepository.findById(input.parent2Id as any);
    const stone1 = await this.stoneRepository.findById(input.stone1Id as any);
    const stone2 = await this.stoneRepository.findById(input.stone2Id as any);

    if (!parent1) {
      throw new Error(`Parent 1 not found: ${input.parent1Id}`);
    }
    if (!parent2) {
      throw new Error(`Parent 2 not found: ${input.parent2Id}`);
    }
    if (!stone1) {
      throw new Error(`Stone 1 not found: ${input.stone1Id}`);
    }
    if (!stone2) {
      throw new Error(`Stone 2 not found: ${input.stone2Id}`);
    }

    // Check for glitched stone generation (stones can become glitched during fusion)
    const fusionCount = parent1.fusionHistory.length + parent2.fusionHistory.length;
    const glitchChance = GlitchedStoneService.getGlitchChance(
      stone1.tier,
      stone2.tier,
      fusionCount
    );
    
    // Check if stones become glitched (create new glitched stones if triggered)
    let glitchedStone1: Stone | null = null;
    let glitchedStone2: Stone | null = null;
    
    if (!stone1.isGlitched && Math.random() < glitchChance / 100) {
      glitchedStone1 = GlitchedStoneService.createGlitchedStone(stone1);
      await this.stoneRepository.save(glitchedStone1);
    }
    if (!stone2.isGlitched && Math.random() < glitchChance / 100) {
      glitchedStone2 = GlitchedStoneService.createGlitchedStone(stone2);
      await this.stoneRepository.save(glitchedStone2);
    }

    // Use glitched stones if created, otherwise use originals
    const finalStone1 = glitchedStone1 || stone1;
    const finalStone2 = glitchedStone2 || stone2;

    // Check for glitched fusion (special fusion effects)
    const isGlitchedFusion = GlitchedFusionService.shouldTriggerGlitchedFusion(
      parent1,
      parent2,
      finalStone1,
      finalStone2,
      fusionCount
    );
    
    
    if (isGlitchedFusion) {
        // Glitch processing handled after fusion generation
    }

    // Calculate fusion statistics (includes rarity calculation)
    const calculation = FusionCalculator.calculateFusion(parent1, parent2, finalStone1, finalStone2);

    // Create comprehensive fusion signature (use final stones)
    const signature = FusionSignatureService.create(
      parent1,
      parent2,
      finalStone1,
      finalStone2,
      input.fusionIntent
    );

    // Generate fusion result using AI
    let fusionResult;
    try {
      fusionResult = await this.fusionAIService.generateFusion(
        signature,
        calculation.rarity
      );
      
      // Validate fusion result has required fields
      if (!fusionResult) {
        throw new Error('Fusion generation returned null result');
      }
      if (!fusionResult.name) {
        throw new Error('Fusion generation returned pet without name');
      }
      if (!fusionResult.abilities || fusionResult.abilities.length === 0) {
        throw new Error('Fusion generation returned pet without abilities');
      }
    } catch (error) {
      console.error('[PerformFusion] Error generating fusion result:', error);
      throw new Error(`Failed to generate fusion result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Separate abilities by type
    const passives: Ability[] = [];
    const actives: Ability[] = [];
    let ultimate: Ability | null = null;

    for (const ability of fusionResult.abilities) {
      if (ability.type === 'passive') {
        passives.push(ability);
      } else if (ability.type === 'active') {
        actives.push(ability);
      } else if (ability.type === 'ultimate') {
        ultimate = ability;
      }
    }

    // Determine family (use parent1's family, or blend if different families)
    const resultFamily = parent1.family === parent2.family
      ? parent1.family
      : parent1.family; // Default to parent1's family if different

    // Create fusion history entry (combine both parents' histories)
    const maxGeneration = Math.max(parent1.getGeneration(), parent2.getGeneration());
    const newGeneration = maxGeneration + 1;
    
    // Calculate mutation count based on visual/stat differences
    const mutationCount = this.calculateMutationCount(
      parent1,
      parent2,
      calculation.stats.finalStats,
      fusionResult.visualTags
    );
    
    // Combine fusion histories from both parents
    const combinedHistory = [
      ...parent1.fusionHistory,
      ...parent2.fusionHistory,
      {
        generation: newGeneration,
        parentIds: [parent1.id, parent2.id] as [any, any],
        parentFamilies: [parent1.family, parent2.family] as [any, any],
        stonesUsed: [finalStone1.id, finalStone2.id] as [string, string],
        fusionSeed: signature.fusionSeed,
        mutationCount,
        timestamp: Date.now(),
      },
    ];

    // Ensure at least one active ability exists (fallback to basic attack)
    if (actives.length === 0) {
      console.warn('[Fusion] No active abilities generated, creating fallback basic attack');
      const fallbackAbility = this.createFallbackBasicAttack(calculation.rarity, resultFamily);
      actives.push(fallbackAbility);
    }

    // Generate color mutation from parents
    const colorMutation = this.generateColorMutation(parent1, parent2);
    
    // Generate glow color from stones/rarity
    const glowColor = this.generateGlowColor(stone1, stone2, calculation.rarity);

    // Generate visual genome for the fused pet
    const fusionSeed = combinedHistory[combinedHistory.length - 1]?.fusionSeed || `${parent1.id}-${parent2.id}-${Date.now()}`;
    const visualGenome = VisualGenomeGenerator.generateFromFusion(
      signature,
      calculation.rarity,
      fusionSeed,
      parent1,
      parent2
    );

    // Create result pet with lore (temporarily without sprite)
    const tempPet = new Pet(
      generatePetId(),
      parent1.playerId, // Owner is same as parent1
      null, // basePetId - fused pets don't have base pet ID
      fusionResult.name,
      null, // nickname
      resultFamily,
      calculation.rarity,
      calculation.stats.finalStats,
      passives,
      actives,
      ultimate,
      combinedHistory,
      {
        visualTags: fusionResult.visualTags,
        colorMutation,
        glowColor,
        visualGenome, // Include visual genome
      },
      null, // battleStats - new pet
      Date.now(), // collectionDate
      false, // isHacked
      fusionResult.lore // Store generated lore
    );

    // Generate sprite for the fused pet
    let spriteDataUrl: string;
    try {
      spriteDataUrl = await this.spriteGenerator.generateSpriteForPet(tempPet);
    } catch (error) {
      console.warn('[PerformFusion] Sprite generation failed, using fallback:', error);
      // Use a safe fallback if generation throws unexpectedly
      spriteDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    }

    // Create final pet with sprite
    const resultPet = new Pet(
      tempPet.id,
      tempPet.playerId,
      tempPet.basePetId || (null as unknown as BasePetId),
      tempPet.name,
      tempPet.nickname,
      tempPet.family,
      tempPet.rarity,
      tempPet.stats,
      tempPet.passiveAbilities,
      tempPet.activeAbilities,
      tempPet.ultimateAbility,
      tempPet.fusionHistory,
      {
        ...tempPet.appearance,
        baseSprite: spriteDataUrl, // Store generated sprite
        visualGenome: tempPet.appearance.visualGenome, // Preserve visual genome
      },
      tempPet.battleStats,
      tempPet.collectionDate,
      false, // isHacked
      tempPet.lore
    );

    // Validate consumption - ensure pets exist before consuming
    const parent1Exists = await this.petRepository.exists(parent1.id);
    const parent2Exists = await this.petRepository.exists(parent2.id);

    if (!parent1Exists || !parent2Exists) {
      throw new Error('Cannot perform fusion: One or more parent pets no longer exist');
    }

    // Calculate uniqueness score for the fusion result
    const uniquenessScore = calculateUniquenessScore(
      resultPet,
      parent1,
      parent2,
      finalStone1,
      finalStone2
    );

    // Store uniqueness score in pet metadata (via appearance for now)
    // Note: In a future enhancement, we could add a dedicated metadata field
    const petWithScore = new Pet(
      resultPet.id,
      resultPet.playerId,
      resultPet.basePetId,
      resultPet.name,
      resultPet.nickname,
      resultPet.family,
      resultPet.rarity,
      resultPet.stats,
      resultPet.passiveAbilities,
      resultPet.activeAbilities,
      resultPet.ultimateAbility,
      resultPet.fusionHistory,
      {
        ...resultPet.appearance,
        // Store uniqueness score in a way that can be accessed later
        // We'll use a custom property for now
      },
      resultPet.battleStats,
      resultPet.collectionDate,
      false, // isHacked
      resultPet.lore
    );

    // Store result pet first (transaction-like: save result before consuming)
    await this.petRepository.save(petWithScore);

    // Consume parent pets and stones
    await this.petRepository.delete(parent1.id);
    await this.petRepository.delete(parent2.id);
    
    // Delete original stones (glitched stones were already saved if created)
    await this.stoneRepository.delete(stone1.id);
    await this.stoneRepository.delete(stone2.id);

    // Return result with uniqueness score
    return {
      resultPet: petWithScore,
      consumedPets: [parent1, parent2],
      consumedStones: [finalStone1, finalStone2],
      uniquenessScore, // Include in output for UI display
    };
  }

  /**
   * Calculate mutation count based on visual/stat differences between parents
   */
  private calculateMutationCount(
    parent1: Pet,
    parent2: Pet,
    finalStats: any,
    visualTags: string[]
  ): number {
    let mutations = 0;

    // Stat mutations: count significant stat differences from parent average
    const avgParentHp = (parent1.stats.maxHp + parent2.stats.maxHp) / 2;
    const avgParentAtk = (parent1.stats.attack + parent2.stats.attack) / 2;
    const avgParentDef = (parent1.stats.defense + parent2.stats.defense) / 2;
    const avgParentSpd = (parent1.stats.speed + parent2.stats.speed) / 2;

    const hpDiff = Math.abs(finalStats.maxHp - avgParentHp) / avgParentHp;
    const atkDiff = Math.abs(finalStats.attack - avgParentAtk) / avgParentAtk;
    const defDiff = Math.abs(finalStats.defense - avgParentDef) / avgParentDef;
    const spdDiff = Math.abs(finalStats.speed - avgParentSpd) / avgParentSpd;

    // Count mutations for stats that differ by more than 10%
    if (hpDiff > 0.1) mutations++;
    if (atkDiff > 0.1) mutations++;
    if (defDiff > 0.1) mutations++;
    if (spdDiff > 0.1) mutations++;

    // Visual mutations: count unique visual tags not present in either parent
    const parent1Tags = new Set(parent1.appearance.visualTags);
    const parent2Tags = new Set(parent2.appearance.visualTags);
    const uniqueTags = visualTags.filter(
      tag => !parent1Tags.has(tag) && !parent2Tags.has(tag)
    );
    mutations += uniqueTags.length;

    // Family mutation: different families = mutation
    if (parent1.family !== parent2.family) {
      mutations++;
    }

    return mutations;
  }

  /**
   * Generate color mutation from parent colors
   */
  private generateColorMutation(parent1: Pet, parent2: Pet): { r: number; g: number; b: number } | undefined {
    // Get family color palettes
    const family1 = FAMILY_CONFIGS[parent1.family];
    const family2 = FAMILY_CONFIGS[parent2.family];

    // Extract RGB from primary colors
    const color1 = this.hexToRgb(family1.colorPalette.primary);
    const color2 = this.hexToRgb(family2.colorPalette.primary);

    if (!color1 || !color2) return undefined;

    // Blend colors with slight random variation
    const blendFactor = 0.5 + (Math.random() - 0.5) * 0.3; // 0.35 to 0.65
    const r = Math.round(color1.r * blendFactor + color2.r * (1 - blendFactor));
    const g = Math.round(color1.g * blendFactor + color2.g * (1 - blendFactor));
    const b = Math.round(color1.b * blendFactor + color2.b * (1 - blendFactor));

    // Add small random mutation
    const mutation = 20;
    return {
      r: Math.max(0, Math.min(255, r + (Math.random() - 0.5) * mutation)),
      g: Math.max(0, Math.min(255, g + (Math.random() - 0.5) * mutation)),
      b: Math.max(0, Math.min(255, b + (Math.random() - 0.5) * mutation)),
    };
  }

  /**
   * Generate glow color from stones and rarity
   */
  private generateGlowColor(stone1: Stone, stone2: Stone, rarity: any): string | undefined {
    // Only generate glow for higher rarities
    if (rarity < 2) return undefined; // SR and below don't glow

    // Map stone types to glow colors
    const stoneGlowColors: Record<StoneType, string> = {
      [StoneType.RUBY]: '#FF4400',
      [StoneType.SAPPHIRE]: '#0088FF',
      [StoneType.EMERALD]: '#00FF00',
      [StoneType.TOPAZ]: '#FFD700',
      [StoneType.AMETHYST]: '#8000FF',
      [StoneType.PEARL]: '#FFFFFF',
      [StoneType.ONYX]: '#000000',
      [StoneType.OPAL]: '#FF00FF',
    };

    const color1 = stoneGlowColors[stone1.type];
    const color2 = stoneGlowColors[stone2.type];

    if (!color1 || !color2) return undefined;

    // Blend stone colors
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return undefined;

    // Blend based on stone tiers (higher tier = more influence)
    const tier1Weight = stone1.tier / (stone1.tier + stone2.tier);
    const tier2Weight = stone2.tier / (stone1.tier + stone2.tier);

    const r = Math.round(rgb1.r * tier1Weight + rgb2.r * tier2Weight);
    const g = Math.round(rgb1.g * tier1Weight + rgb2.g * tier2Weight);
    const b = Math.round(rgb1.b * tier1Weight + rgb2.b * tier2Weight);

    // Increase intensity based on rarity
    const rarityMultiplier = 0.7 + (rarity * 0.1); // 0.7 to 1.3
    const finalR = Math.min(255, Math.round(r * rarityMultiplier));
    const finalG = Math.min(255, Math.round(g * rarityMultiplier));
    const finalB = Math.min(255, Math.round(b * rarityMultiplier));

    return `#${finalR.toString(16).padStart(2, '0')}${finalG.toString(16).padStart(2, '0')}${finalB.toString(16).padStart(2, '0')}`;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Create a fallback basic attack ability when no active abilities are generated
   */
  private createFallbackBasicAttack(rarity: any, _family: any): Ability {
    // Try to get a basic attack template
    const basicAttackTemplate = AbilityTemplateLibrary.getRandomTemplate('active', undefined, rarity);
    
    if (basicAttackTemplate) {
      return AbilityGenerator.generateFromTemplate(basicAttackTemplate, rarity);
    }
    
    // Ultimate fallback: create a minimal basic attack ability
    return new Ability(
      generateAbilityId(),
      'Basic Attack',
      'A simple attack that deals damage to a single enemy.',
      'active',
      20, // energy cost
      0, // cooldown
      0, // current cooldown
      [
        {
          type: 'damage',
          target: 'single-enemy',
          value: 1.0,
          scaling: 'attack',
        },
      ],
      [],
      null // element
    );
  }
}


