/**
 * Ability Generator Service
 * Generates abilities from templates or procedurally
 */

import { Ability } from '../entities/Ability';
import { AbilityTemplateLibrary, type AbilityTemplate, type AbilityEffectTemplate } from './AbilityTemplate';
import { generateAbilityId } from '@/shared/utils/idGenerator';
import type { AbilityType, AbilityEffect } from '../entities/Ability';
import { Rarity } from '@/shared/types/rarity';

/**
 * Ability Generator Service
 */
export class AbilityGenerator {
  /**
   * Generate an ability from a template
   */
  static generateFromTemplate(
    template: AbilityTemplate,
    rarity?: Rarity,
    powerMultiplier: number = 1.0
  ): Ability {
    // Check rarity requirement
    if (template.rarity && rarity && rarity < template.rarity) {
      throw new Error(`Ability template requires minimum rarity: ${template.rarity}`);
    }

    // Generate effects from templates
    const effects: AbilityEffect[] = template.effects.map((effectTemplate) =>
      this.generateEffect(effectTemplate, powerMultiplier)
    );

    // Adjust energy cost and cooldown based on rarity
    let energyCost = template.energyCost;
    let cooldown = template.cooldown;

    if (rarity && template.type !== 'passive') {
      // Higher rarity = lower energy cost and cooldown
      const rarityMultiplier = this.getRarityMultiplier(rarity);
      if (energyCost !== null) {
        energyCost = Math.max(10, Math.round(energyCost * rarityMultiplier));
      }
      if (cooldown !== null) {
        cooldown = Math.max(1, Math.round(cooldown * rarityMultiplier));
      }
    }

    return new Ability(
      generateAbilityId(),
      template.name,
      template.description,
      template.type,
      energyCost,
      cooldown,
      template.type === 'passive' ? null : 0, // currentCooldown
      effects,
      template.tags,
      template.element || null
    );
  }

  /**
   * Generate a random ability of specified type
   */
  static generateRandom(
    type: AbilityType,
    element?: string,
    rarity?: Rarity,
    powerMultiplier: number = 1.0
  ): Ability {
    const template = AbilityTemplateLibrary.getRandomTemplate(type, element, rarity);
    if (!template) {
      throw new Error(`No template found for type: ${type}, element: ${element}, rarity: ${rarity}`);
    }

    return this.generateFromTemplate(template, rarity, powerMultiplier);
  }

  /**
   * Generate multiple abilities
   */
  static generateMultiple(
    count: number,
    type: AbilityType,
    element?: string,
    rarity?: Rarity,
    powerMultiplier: number = 1.0
  ): Ability[] {
    const abilities: Ability[] = [];
    const templates = AbilityTemplateLibrary.getTemplatesByType(type);

    if (element) {
      templates.filter((t) => t.element === element);
    }
    if (rarity) {
      templates.filter((t) => !t.rarity || t.rarity <= rarity);
    }

    for (let i = 0; i < count && templates.length > 0; i++) {
      const template = templates[i % templates.length];
      abilities.push(this.generateFromTemplate(template, rarity, powerMultiplier));
    }

    return abilities;
  }

  /**
   * Generate effect from template
   */
  private static generateEffect(template: AbilityEffectTemplate, powerMultiplier: number): AbilityEffect {
    let value = template.baseValue;

    // Apply value range if specified
    if (template.valueRange) {
      const [min, max] = template.valueRange;
      value = template.baseValue * (min + Math.random() * (max - min));
    }

    // Apply power multiplier
    value *= powerMultiplier;

    const effect: AbilityEffect = {
      type: template.type,
      target: template.target,
      value,
    };

    if (template.element) {
      effect.element = template.element;
    }
    if (template.statusChance !== undefined) {
      effect.statusChance = template.statusChance;
    }
    if (template.statusType) {
      effect.statusType = template.statusType;
    }
    if (template.statusDuration !== undefined) {
      effect.statusDuration = template.statusDuration;
    }
    if (template.lifesteal !== undefined) {
      effect.lifesteal = template.lifesteal;
    }
    if (template.scaling) {
      effect.scaling = template.scaling;
    }

    return effect;
  }

  /**
   * Get rarity multiplier for ability power
   */
  private static getRarityMultiplier(rarity: Rarity): number {
    const multipliers: Record<Rarity, number> = {
      [Rarity.BASIC]: 0.8,
      [Rarity.RARE]: 0.9,
      [Rarity.SR]: 1.0,
      [Rarity.LEGENDARY]: 1.1,
      [Rarity.MYTHIC]: 1.2,
      [Rarity.PRISMATIC]: 1.3,
      [Rarity.OMEGA]: 1.5,
    };

    return multipliers[rarity] || 1.0;
  }

  /**
   * Mutate an ability (for fusion)
   */
  static mutateAbility(ability: Ability, mutationStrength: number = 0.1): Ability {
    const mutatedEffects: AbilityEffect[] = ability.effects.map((effect) => {
      const mutation = 1 + (Math.random() - 0.5) * mutationStrength * 2;
      return {
        ...effect,
        value: effect.value * mutation,
      };
    });

    return new Ability(
      generateAbilityId(),
      ability.name,
      ability.description,
      ability.type,
      ability.energyCost,
      ability.cooldown,
      ability.currentCooldown,
      mutatedEffects,
      ability.tags,
      ability.element
    );
  }

  /**
   * Combine two abilities (for fusion)
   */
  static combineAbilities(ability1: Ability, ability2: Ability): Ability {
    // Combine effects
    const combinedEffects: AbilityEffect[] = [
      ...ability1.effects.map((e) => ({ ...e, value: e.value * 0.6 })),
      ...ability2.effects.map((e) => ({ ...e, value: e.value * 0.6 })),
    ];

    // Use higher energy cost and cooldown
    const energyCost = Math.max(
      ability1.energyCost || 0,
      ability2.energyCost || 0
    );
    const cooldown = Math.max(ability1.cooldown || 0, ability2.cooldown || 0);

    // Combine names
    const name = `${ability1.name} + ${ability2.name}`;
    const description = `A fusion of ${ability1.name} and ${ability2.name}. ${ability1.description} ${ability2.description}`;

    // Combine tags
    const tags = [...new Set([...ability1.tags, ...ability2.tags])];

    // Use element from first ability, or second if first is null
    const element = ability1.element || ability2.element;

    return new Ability(
      generateAbilityId(),
      name,
      description,
      ability1.type, // Use type from first ability
      energyCost || null,
      cooldown || null,
      0,
      combinedEffects,
      tags,
      element
    );
  }
}





