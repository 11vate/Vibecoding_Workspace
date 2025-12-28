/**
 * Fusion AI Service
 * Handles AI-driven generation of fusion results (name, lore, abilities)
 */

import { AIService } from './AIService';
import type { FusionSignatureData } from '@/domain/services/FusionSignature';
import { FusionSignatureService } from '@/domain/services/FusionSignature';
import { Ability } from '@/domain/entities/Ability';
import type { Rarity } from '@/shared/types/rarity';
import { RARITY_CONFIG } from '@/shared/types/rarity';
import { generateAbilityId } from '@/shared/utils/idGenerator';
import { AbilityTemplateLibrary } from '@/domain/services/AbilityTemplate';
import { AbilityGenerator } from '@/domain/services/AbilityGenerator';
import { findElementInteraction } from '@/domain/services/ElementInteractions';

export interface FusionResult {
  name: string;
  lore: string;
  abilities: Ability[];
  visualTags: string[];
  spriteDescription?: string;
}

/**
 * Fusion AI Service
 * Generates fusion results using AI with procedural fallback
 */
export class FusionAIService {
  constructor(
    private petRepository?: import('@/domain/repositories/IPetRepository').IPetRepository
  ) {}

  /**
   * Generate fusion result from signature
   * Procedural generation is PRIMARY - AI is optional enhancement
   */
  async generateFusion(
    signature: FusionSignatureData,
    rarity: Rarity
  ): Promise<FusionResult> {
    const rarityConfig = RARITY_CONFIG[rarity];
    
    // PRIMARY PATH: Generate procedurally first (always works, no AI dependency)
    const proceduralResult = await this.generateProcedural(signature, rarity, rarityConfig);
    
    // OPTIONAL ENHANCEMENT: Try AI to enhance the result if available
    // Only use AI if explicitly available and successful
    const aiAvailable = await AIService.isAvailable();
    if (aiAvailable) {
      try {
        const signatureJson = FusionSignatureService.serialize(signature);
        const aiResult = await this.generateWithAI(signatureJson, rarity, rarityConfig, signature);
        if (aiResult && aiResult.name && aiResult.name !== 'Fused Pet') {
          // Validate name uniqueness if repository available
          if (this.petRepository) {
            const isUnique = await this.validateNameUniqueness(aiResult.name);
            if (!isUnique) {
              // Regenerate name with uniqueness suffix
              aiResult.name = await this.ensureUniqueName(aiResult.name);
            }
          }
          // Use AI result if it's valid and unique
          return aiResult;
        }
      } catch (error) {
        console.warn('[FusionAI] AI enhancement failed, using procedural result:', error);
      }
    }

    // Return procedural result (always available, always works)
    return proceduralResult;
  }

  /**
   * Generate fusion result using AI
   */
  private async generateWithAI(
    signatureJson: string,
    _rarity: Rarity,
    rarityConfig: typeof RARITY_CONFIG[Rarity],
    signature: FusionSignatureData
  ): Promise<FusionResult | null> {
    const prompt = this.createFusionPrompt(signatureJson, _rarity, rarityConfig, signature);

    try {
      // AI generation should never use "Fused Pet" fallback - if AI fails, return null to use procedural
      const responseText = await AIService.generateText(
        prompt,
        () => {
          // If AI is unavailable, return null to trigger procedural fallback
          console.warn('[FusionAI] AI unavailable, will use procedural generation');
          throw new Error('AI service unavailable');
        },
        { fallbackToProcedural: false } // Don't use procedural here - let generateFusion handle it
      );
      const response = JSON.parse(responseText);

      if (!response || typeof response !== 'object') {
        return null;
      }

      // Validate and convert response
      const result = this.parseAIResponse(response, _rarity, rarityConfig);
      
      // Ensure result has at least one active ability
      if (result) {
        const hasActive = result.abilities.some((a) => a.type === 'active');
        if (!hasActive) {
          console.warn('[FusionAI] AI response missing active abilities, adding fallback');
          const fallbackAbility = new Ability(
            generateAbilityId(),
            'Basic Strike',
            'A simple attack that deals damage to a single enemy.',
            'active',
            20,
            0,
            0,
            [
              {
                type: 'damage',
                target: 'single-enemy',
                value: 1.0,
                scaling: 'attack',
              },
            ],
            [],
            null
          );
          result.abilities.push(fallbackAbility);
        }
      }
      
      return result;
    } catch (error) {
      console.error('[FusionAI] AI generation error:', error);
      return null;
    }
  }

  /**
   * Create prompt for AI fusion generation
   */
  private createFusionPrompt(
    signatureJson: string,
    rarity: Rarity,
    rarityConfig: typeof RARITY_CONFIG[Rarity],
    signature: FusionSignatureData
  ): string {
    // Get sample ability templates for reference
    const sampleTemplates = AbilityTemplateLibrary.getAllTemplates()
      .slice(0, 10)
      .map((t) => ({
        name: t.name,
        type: t.type,
        description: t.description,
        effects: t.effects.map((e) => ({
          type: e.type,
          target: e.target,
          baseValue: e.baseValue,
          element: e.element,
        })),
      }));

    // Build name generation context
    const nameContext: string[] = [];
    
    // Element interaction context
    if (signature.elementInteraction) {
      nameContext.push(`ELEMENT INTERACTION: ${signature.elementInteraction.element1} + ${signature.elementInteraction.element2} = ${signature.elementInteraction.result}`);
      nameContext.push(`Interaction Description: ${signature.elementInteraction.description}`);
      nameContext.push(`Suggested Name Prefixes: ${signature.elementInteraction.namePrefixes.join(', ')}`);
      nameContext.push(`Suggested Name Suffixes: ${signature.elementInteraction.nameSuffixes.join(', ')}`);
      nameContext.push(`The fusion should embody the ${signature.elementInteraction.result} concept.`);
    }

    // Fusion Intent context
    if (signature.intent) {
      const intentDescriptions: Record<string, string> = {
        DOMINANCE: 'The fusion should have an aggressive, controlling, predatory personality. Names should reflect power, dominance, and relentless pursuit.',
        RESILIENCE: 'The fusion should have an enduring, protective, steadfast personality. Names should reflect fortitude, guardianship, and unbreakable will.',
        VOLATILITY: 'The fusion should have an unpredictable, explosive, chaotic personality. Names should reflect chaos, unpredictability, and raw energy.',
        SYMBIOSIS: 'The fusion should have a cooperative, harmonious, supportive personality. Names should reflect unity, balance, and mutual benefit.',
        CORRUPTION: 'The fusion should have a patient, deceptive, transformative personality. Names should reflect decay, transformation, and hidden power.',
      };
      nameContext.push(`FUSION INTENT: ${signature.intent}`);
      nameContext.push(intentDescriptions[signature.intent] || 'The fusion should reflect the chosen intent.');
    }

    // Family themes context
    nameContext.push(`PARENT FAMILIES: ${signature.familyThemes.parent1Family} + ${signature.familyThemes.parent2Family}`);
    nameContext.push(`Family themes should influence the naming style and visual characteristics.`);

    // Stone context
    const stoneInfo = signature.stones.map((s) => `${s.type} (Tier ${s.tier}${s.isGlitched ? ', GLITCHED' : ''})`).join(' and ');
    nameContext.push(`STONES USED: ${stoneInfo}`);
    nameContext.push(`The stones' elements and tiers should influence the fusion's nature.`);

    return `You are a creative game designer for "Pixel Pets Reborn", a fusion-based pet game set in The Grid.

FUSION REQUEST:
${signatureJson}

RARITY: ${rarity} (${rarityConfig.name})
Ability Slots: ${rarityConfig.passiveCount} passive, ${rarityConfig.activeCount} active, ${rarityConfig.ultimateCount} ultimate

NAME GENERATION CONTEXT:
${nameContext.join('\n')}

CRITICAL NAME REQUIREMENTS:
- The name MUST be unique and creative, reflecting the fusion's true essence
- Blend parent names linguistically (e.g., "Flame" + "Tide" → "Flamede" or "Tideflame" or create something entirely new)
- If element interaction exists, use it as inspiration (e.g., Fire+Water=Steam → "Steam the Boiler", "Vapor the Turbine")
- Incorporate fusion intent into name style (DOMINANCE → aggressive names, SYMBIOSIS → harmonious names)
- Consider family themes and stone types
- Avoid generic names like "Fused Pet" or "Hybrid"
- Make the name memorable and evocative
- The name should tell a story about what was fused

SAMPLE ABILITY TEMPLATES (for reference):
${JSON.stringify(sampleTemplates, null, 2)}

Generate a unique pet fusion result as JSON with this structure:
{
  "name": "Creative, unique fusion name that reflects the essence of the fusion",
  "lore": "2-3 sentences of engaging lore that tells the story of this fusion",
  "visualTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "abilities": [
    {
      "name": "Ability name",
      "description": "Detailed ability description",
      "type": "passive|active|ultimate",
      "element": "fire|water|earth|lightning|shadow|light|metal|arcane|air|chaos (optional)",
      "energyCost": 0-100 (for active/ultimate),
      "cooldown": 0-6 (for active/ultimate),
      "effects": [
        {
          "type": "damage|heal|buff|debuff|status|special",
          "target": "self|single-enemy|all-enemies|random-ally|all-allies",
          "value": 0.5-3.0 (multiplier for damage/heal, percentage for buff/debuff),
          "scaling": "attack|defense|hp|speed (optional)",
          "element": "element name (if damage)",
          "statusChance": 0.0-1.0 (if status effect),
          "statusType": "BURN|POISON|FREEZE|STUN|BLEED|SLOW|SHOCKED|CONFUSION (if status)",
          "statusDuration": 1-5 (if status effect),
          "lifesteal": 0.0-1.0 (if heal from damage)
        }
      ],
      "tags": ["tag1", "tag2"]
    }
  ]
}

Requirements:
- Generate exactly ${rarityConfig.passiveCount} passive abilities
- Generate exactly ${rarityConfig.activeCount} active abilities
- Generate exactly ${rarityConfig.ultimateCount} ultimate abilities (if rarity allows)
- Abilities should blend the parents' abilities creatively
- Consider the stones used in the fusion for thematic elements
- Use appropriate energy costs and cooldowns based on ability power
- Make abilities feel unique and synergistic
- Higher rarity should have more powerful abilities
- The name MUST be creative and unique - avoid generic combinations

The pet should feel like a natural evolution of both parents while being unique. Be creative and ensure the name reflects what was truly fused!`;
  }


  /**
   * Parse and validate AI response
   */
  private parseAIResponse(
    response: any,
    _rarity: Rarity,
    rarityConfig: typeof RARITY_CONFIG[Rarity]
  ): FusionResult {
    // Validate that AI response has a name - if not, this is invalid and should use procedural
    if (!response.name || typeof response.name !== 'string' || response.name.trim() === '' || response.name === 'Fused Pet') {
      throw new Error('AI response missing valid name - will use procedural generation');
    }
    
    const name = response.name.trim();
    const lore = response.lore || 'A mysterious fusion.';
    const visualTags = Array.isArray(response.visualTags)
      ? response.visualTags.slice(0, 5)
      : [];

    // Parse abilities
    const abilities: Ability[] = [];
    if (Array.isArray(response.abilities)) {
      let passiveCount = 0;
      let activeCount = 0;
      let ultimateCount = 0;

      for (const abilityData of response.abilities) {
        if (!abilityData.name || !abilityData.description || !abilityData.type) {
          continue;
        }

        const type = abilityData.type as 'passive' | 'active' | 'ultimate';

        // Respect rarity limits
        if (type === 'passive' && passiveCount >= rarityConfig.passiveCount) continue;
        if (type === 'active' && activeCount >= rarityConfig.activeCount) continue;
        if (type === 'ultimate' && ultimateCount >= rarityConfig.ultimateCount) continue;

        // Parse effects from AI response
        const effects = Array.isArray(abilityData.effects)
          ? abilityData.effects.map((e: any) => ({
              type: e.type || 'damage',
              target: e.target || 'single-enemy',
              value: e.value || 1.0,
              scaling: e.scaling || undefined,
              element: e.element || abilityData.element || undefined,
              statusChance: e.statusChance || undefined,
              statusType: e.statusType || undefined,
              statusDuration: e.statusDuration || undefined,
              lifesteal: e.lifesteal || undefined,
            }))
          : [
              {
                type: 'damage',
                target: 'single-enemy',
                value: 1.0,
                element: abilityData.element,
              },
            ];

        // Determine energy cost and cooldown based on type and rarity
        let energyCost: number | null = null;
        let cooldown: number | null = null;
        if (type === 'active') {
          energyCost = abilityData.energyCost || 30;
          cooldown = abilityData.cooldown || 2;
        } else if (type === 'ultimate') {
          energyCost = abilityData.energyCost || 90;
          cooldown = abilityData.cooldown || 5;
        }

        // Create ability with proper effects
        const ability = new Ability(
          generateAbilityId(),
          abilityData.name,
          abilityData.description,
          type,
          energyCost,
          cooldown,
          null,
          effects,
          abilityData.tags || [],
          abilityData.element || null
        );

        abilities.push(ability);

        if (type === 'passive') passiveCount++;
        else if (type === 'active') activeCount++;
        else if (type === 'ultimate') ultimateCount++;
      }
    }

    return {
      name,
      lore,
      abilities,
      visualTags,
    };
  }

  /**
   * Procedural fallback generation using ability templates
   */
  private async generateProcedural(
    signature: FusionSignatureData,
    rarity: Rarity,
    rarityConfig: typeof RARITY_CONFIG[Rarity]
  ): Promise<FusionResult> {
    // Simple procedural generation
    const parent1Name = signature.parent1.name;
    const parent2Name = signature.parent2.name;

    // Get elements from stones and parents
    const stone1Element = this.getStoneElement(signature.stones[0]?.type);
    const stone2Element = this.getStoneElement(signature.stones[1]?.type);
    const parent1Element = signature.parent1.abilities.find((a) => a.element)?.element;
    const parent2Element = signature.parent2.abilities.find((a) => a.element)?.element;

    // Use element interaction from signature if available, otherwise detect it
    let interaction = signature.elementInteraction 
      ? {
          element1: signature.elementInteraction.element1,
          element2: signature.elementInteraction.element2,
          result: signature.elementInteraction.result,
          namePrefixes: signature.elementInteraction.namePrefixes,
          nameSuffixes: signature.elementInteraction.nameSuffixes,
          abilityThemes: signature.elementInteraction.abilityThemes,
          description: signature.elementInteraction.description,
        }
      : null;

    // If no interaction in signature, try to detect it
    if (!interaction) {
      const detectedInteraction = findElementInteraction(
        stone1Element || parent1Element || 'fire',
        stone2Element || parent2Element || 'water'
      );
      
      if (detectedInteraction) {
        interaction = {
          element1: detectedInteraction.element1,
          element2: detectedInteraction.element2,
          result: detectedInteraction.result,
          namePrefixes: detectedInteraction.namePrefixes,
          nameSuffixes: detectedInteraction.nameSuffixes,
          abilityThemes: detectedInteraction.abilityThemes,
          description: detectedInteraction.description,
        };
      }
    }

    // Generate creative name using multiple strategies
    let name: string;
    
    // Strategy 1: Use element interaction if available
    if (interaction) {
      const prefix = interaction.namePrefixes[Math.floor(Math.random() * interaction.namePrefixes.length)];
      const suffix = interaction.nameSuffixes[Math.floor(Math.random() * interaction.nameSuffixes.length)];
      name = `${prefix} ${suffix}`;
    } else {
      // Strategy 2: Creative linguistic blending of parent names
      name = this.blendParentNames(parent1Name, parent2Name, signature.intent);
    }
    
    // Apply fusion intent to name style if not using element interaction
    if (!interaction && signature.intent) {
      name = this.applyIntentToName(name, signature.intent);
    }
    
    // Ensure uniqueness
    if (this.petRepository) {
      const isUnique = await this.validateNameUniqueness(name);
      if (!isUnique) {
        name = await this.ensureUniqueName(name);
      }
    }

    // Enhanced lore with element interaction context
    const stoneTypes = signature.stones.map((s) => s.type).join(' and ');
    let lore: string;
    if (interaction) {
      lore = `${interaction.description} A fusion of ${parent1Name} and ${parent2Name}, empowered by ${stoneTypes} stones. This unique creature embodies the ${interaction.result} element, combining the strengths of both parents.`;
    } else {
      lore = `A fusion of ${parent1Name} and ${parent2Name}, empowered by ${stoneTypes} stones. This unique creature combines the strengths of both parents, creating something entirely new.`;
    }

    // Generate abilities using templates
    const abilities: Ability[] = [];

    // Generate passives
    for (let i = 0; i < rarityConfig.passiveCount; i++) {
      const template = AbilityTemplateLibrary.getRandomTemplate('passive', undefined, rarity);
      if (template) {
        const ability = AbilityGenerator.generateFromTemplate(template, rarity);
        abilities.push(ability);
      }
    }

    // Generate actives - ensure at least one is always created
    let activeCount = 0;
    const interactionThemes = interaction ? interaction.abilityThemes : [];

    for (let i = 0; i < rarityConfig.activeCount; i++) {
      // Try to get element from parents' abilities or interaction
      const preferredElement = interaction
        ? interaction.result
        : parent1Element || parent2Element;

      // Use interaction themes if available
      const template = AbilityTemplateLibrary.getRandomTemplate('active', preferredElement, rarity);
      if (template) {
        const ability = AbilityGenerator.generateFromTemplate(template, rarity);
        if (interactionThemes.length > 0 && ability.tags) {
          const abilityWithThemes = new Ability(
            ability.id,
            ability.name,
            ability.description,
            ability.type,
            ability.energyCost,
            ability.cooldown,
            ability.currentCooldown,
            ability.effects,
            [...ability.tags, ...interactionThemes.slice(0, 2)],
            ability.element
          );
          abilities.push(abilityWithThemes);
        } else {
          abilities.push(ability);
        }
        activeCount++;
      }
    }

    // Ensure at least one active ability exists (fallback if template generation failed)
    if (activeCount === 0) {
      console.warn('[FusionAI] No active abilities generated procedurally, creating fallback');
      // Try without element preference
      let fallbackTemplate = AbilityTemplateLibrary.getRandomTemplate('active', undefined, rarity);
      if (!fallbackTemplate) {
        // Try without rarity requirement
        fallbackTemplate = AbilityTemplateLibrary.getRandomTemplate('active', undefined, undefined);
      }
      
      if (fallbackTemplate) {
        const fallbackAbility = AbilityGenerator.generateFromTemplate(fallbackTemplate, rarity);
        abilities.push(fallbackAbility);
        activeCount++;
      } else {
        // Ultimate fallback: create a basic attack ability directly
        const fallbackAbility = new Ability(
          generateAbilityId(),
          'Basic Strike',
          'A simple attack that deals damage to a single enemy.',
          'active',
          20,
          0,
          0,
          [
            {
              type: 'damage',
              target: 'single-enemy',
              value: 1.0,
              scaling: 'attack',
            },
          ],
          [],
          null
        );
        abilities.push(fallbackAbility);
        activeCount++;
      }
    }

    // Generate ultimates
    for (let i = 0; i < rarityConfig.ultimateCount; i++) {
      const preferredElement = interaction
        ? interaction.result
        : parent1Element || parent2Element;

      const template = AbilityTemplateLibrary.getRandomTemplate('ultimate', preferredElement, rarity);
      if (template) {
        const ability = AbilityGenerator.generateFromTemplate(template, rarity);
        if (interactionThemes.length > 0 && ability.tags) {
          const abilityWithThemes = new Ability(
            ability.id,
            ability.name,
            ability.description,
            ability.type,
            ability.energyCost,
            ability.cooldown,
            ability.currentCooldown,
            ability.effects,
            [...ability.tags, ...interactionThemes.slice(0, 2)],
            ability.element
          );
          abilities.push(abilityWithThemes);
        } else {
          abilities.push(ability);
        }
      }
    }

    // Combine visual tags from parents
    const visualTags = [
      ...signature.parent1.visualTags.slice(0, 2),
      ...signature.parent2.visualTags.slice(0, 2),
      'fused',
    ]
      .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
      .slice(0, 5);

    // Final validation: ensure at least one active ability exists
    const hasActive = abilities.some((a) => a.type === 'active');
    if (!hasActive) {
      console.error('[FusionAI] Critical: No active abilities in procedural generation result, creating emergency fallback');
      const emergencyAbility = new Ability(
        generateAbilityId(),
        'Emergency Strike',
        'A basic attack created when ability generation fails.',
        'active',
        20,
        0,
        0,
        [
          {
            type: 'damage',
            target: 'single-enemy',
            value: 1.0,
            scaling: 'attack',
          },
        ],
        [],
        null
      );
      abilities.push(emergencyAbility);
    }

    return {
      name,
      lore,
      abilities,
      visualTags,
    };
  }

  /**
   * Get element from stone type
   */
  private getStoneElement(stoneType?: string): string | null {
    if (!stoneType) return null;
    
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
   * Blend parent names creatively
   */
  private blendParentNames(name1: string, name2: string, intent?: string): string {
    const parts1 = name1.split(' ').filter(p => p.length > 0);
    const parts2 = name2.split(' ').filter(p => p.length > 0);
    
    // Extract meaningful words (avoid common words)
    const meaningful1 = parts1.filter(p => !['the', 'of', 'a', 'an'].includes(p.toLowerCase()));
    const meaningful2 = parts2.filter(p => !['the', 'of', 'a', 'an'].includes(p.toLowerCase()));
    
    if (meaningful1.length === 0 && meaningful2.length === 0) {
      // Fallback: use first 3-4 chars of each
      return `${name1.slice(0, 4)}${name2.slice(0, 4)}`;
    }
    
    // Strategy: Blend first meaningful parts
    const first1 = meaningful1[0] || parts1[0] || name1.slice(0, 4);
    const first2 = meaningful2[0] || parts2[0] || name2.slice(0, 4);
    
    // Try different blending techniques
    const techniques = [
      // Portmanteau (first half + second half)
      () => `${first1.slice(0, Math.ceil(first1.length / 2))}${first2.slice(Math.floor(first2.length / 2))}`,
      // Prefix + Suffix
      () => `${first1}${first2.slice(-3)}`,
      // Suffix + Prefix
      () => `${first1.slice(-3)}${first2}`,
      // Full blend
      () => `${first1}${first2}`,
    ];
    
    const technique = techniques[Math.floor(Math.random() * techniques.length)];
    let blended = technique();
    
    // Capitalize first letter
    blended = blended.charAt(0).toUpperCase() + blended.slice(1).toLowerCase();
    
    // Add suffix based on intent if available
    if (intent) {
      const intentSuffixes: Record<string, string[]> = {
        DOMINANCE: ['the Dominator', 'the Conqueror', 'the Tyrant'],
        RESILIENCE: ['the Guardian', 'the Protector', 'the Unbreakable'],
        VOLATILITY: ['the Unstable', 'the Chaotic', 'the Explosive'],
        SYMBIOSIS: ['the Harmonious', 'the Unified', 'the Balanced'],
        CORRUPTION: ['the Corruptor', 'the Decayed', 'the Transformed'],
      };
      
      if (intentSuffixes[intent]) {
        const suffix = intentSuffixes[intent][Math.floor(Math.random() * intentSuffixes[intent].length)];
        blended = `${blended} ${suffix}`;
      }
    }
    
    return blended;
  }

  /**
   * Apply fusion intent to name style
   */
  private applyIntentToName(name: string, intent: string): string {
    const intentModifiers: Record<string, (n: string) => string> = {
      DOMINANCE: (n) => {
        // Make name more aggressive
        const aggressive = ['Fierce', 'Ruthless', 'Brutal', 'Savage'];
        if (!n.includes('the')) {
          return `${aggressive[Math.floor(Math.random() * aggressive.length)]} ${n}`;
        }
        return n;
      },
      RESILIENCE: (n) => {
        const protective = ['Stalwart', 'Enduring', 'Immutable', 'Steadfast'];
        if (!n.includes('the')) {
          return `${protective[Math.floor(Math.random() * protective.length)]} ${n}`;
        }
        return n;
      },
      VOLATILITY: (n) => {
        const chaotic = ['Chaotic', 'Unstable', 'Volatile', 'Erratic'];
        if (!n.includes('the')) {
          return `${chaotic[Math.floor(Math.random() * chaotic.length)]} ${n}`;
        }
        return n;
      },
      SYMBIOSIS: (n) => {
        const harmonious = ['Harmonious', 'Unified', 'Balanced', 'Synergistic'];
        if (!n.includes('the')) {
          return `${harmonious[Math.floor(Math.random() * harmonious.length)]} ${n}`;
        }
        return n;
      },
      CORRUPTION: (n) => {
        const corrupt = ['Corrupted', 'Decayed', 'Transformed', 'Twisted'];
        if (!n.includes('the')) {
          return `${corrupt[Math.floor(Math.random() * corrupt.length)]} ${n}`;
        }
        return n;
      },
    };
    
    const modifier = intentModifiers[intent];
    return modifier ? modifier(name) : name;
  }

  /**
   * Validate name uniqueness
   */
  private async validateNameUniqueness(name: string): Promise<boolean> {
    if (!this.petRepository) return true; // Can't validate without repository
    
    try {
      // Get all pets and check for duplicate names
      const allPets = await this.petRepository.findAll();
      const duplicate = allPets.find(p => p.name.toLowerCase() === name.toLowerCase());
      return !duplicate;
    } catch (error) {
      console.warn('[FusionAI] Error validating name uniqueness:', error);
      return true; // Assume unique if check fails
    }
  }

  /**
   * Ensure name is unique by appending identifier if needed
   */
  private async ensureUniqueName(name: string): Promise<string> {
    if (!this.petRepository) return name;
    
    let uniqueName = name;
    let counter = 1;
    const maxAttempts = 100;
    
    while (counter < maxAttempts) {
      const isUnique = await this.validateNameUniqueness(uniqueName);
      if (isUnique) {
        return uniqueName;
      }
      
      // Append unique identifier
      uniqueName = `${name} ${counter}`;
      counter++;
    }
    
    // Fallback: append timestamp
    return `${name} ${Date.now().toString(36)}`;
  }
}
