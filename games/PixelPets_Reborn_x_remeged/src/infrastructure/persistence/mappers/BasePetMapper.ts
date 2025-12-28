/**
 * BasePet Mapper
 * Maps between BasePet domain entity and BasePetDTO
 */

import { BasePet } from '@/domain/entities/BasePet';
import type { BasePetDTO } from '../schema';
import { brandBasePetId } from '@/shared/types/brands';

/**
 * Map BasePet domain entity to DTO
 */
export function basePetToDTO(basePet: BasePet): BasePetDTO {
  return {
    id: basePet.id,
    name: basePet.name,
    family: basePet.family,
    rarity: basePet.rarity,
    baseStats: { ...basePet.baseStats },
    starterAbilities: [...basePet.starterAbilities],
    starterPassives: [...basePet.starterPassives],
    visualTags: [...basePet.visualTags],
    lore: basePet.lore,
  };
}

/**
 * Map DTO to BasePet domain entity
 */
export function dtoToBasePet(dto: BasePetDTO): BasePet {
  return {
    id: brandBasePetId(dto.id),
    name: dto.name,
    family: dto.family,
    rarity: dto.rarity,
    baseStats: dto.baseStats,
    starterAbilities: dto.starterAbilities,
    starterPassives: dto.starterPassives,
    visualTags: dto.visualTags,
    lore: dto.lore
  };
}



