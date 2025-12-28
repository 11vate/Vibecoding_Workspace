/**
 * Ability Mapper
 * Maps between Ability domain entity and AbilityDTO
 */

import { Ability } from '@/domain/entities/Ability';
import type { AbilityDTO } from '../schema';
import { brandAbilityId } from '@/shared/types/brands';
import type { StatusEffect } from '@/shared/types/status';

/**
 * Map Ability domain entity to DTO
 */
export function abilityToDTO(ability: Ability): AbilityDTO {
  return {
    id: ability.id,
    name: ability.name,
    description: ability.description,
    type: ability.type,
    energyCost: ability.energyCost,
    cooldown: ability.cooldown,
    currentCooldown: ability.currentCooldown,
    effects: ability.effects.map((effect) => ({
      type: effect.type,
      target: effect.target,
      value: effect.value,
      element: effect.element,
      statusChance: effect.statusChance,
      statusType: effect.statusType,
      statusDuration: effect.statusDuration,
      lifesteal: effect.lifesteal,
      scaling: effect.scaling,
    })),
    tags: [...ability.tags],
    element: ability.element,
  };
}

/**
 * Map DTO to Ability domain entity
 */
export function dtoToAbility(dto: AbilityDTO): Ability {
  return new Ability(
    brandAbilityId(dto.id),
    dto.name,
    dto.description,
    dto.type,
    dto.energyCost,
    dto.cooldown,
    dto.currentCooldown,
    dto.effects.map((effect) => ({
      type: effect.type as any,
      target: effect.target as any,
      value: effect.value,
      element: effect.element,
      statusChance: effect.statusChance,
      statusType: effect.statusType as StatusEffect | undefined,
      statusDuration: effect.statusDuration,
      lifesteal: effect.lifesteal,
      scaling: effect.scaling,
    })),
    dto.tags,
    dto.element
  );
}


