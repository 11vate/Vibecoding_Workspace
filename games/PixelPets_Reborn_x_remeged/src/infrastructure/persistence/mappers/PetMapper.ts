/**
 * Pet Mapper
 * Maps between Pet domain entity and PetDTO
 */

import { Pet } from '@/domain/entities/Pet';
import type { FusionHistory, PetAppearance, BattleStats } from '@/domain/entities/Pet';
import type { Ability } from '@/domain/entities/Ability';
import type { PetDTO, FusionHistoryEntryDTO, PetAppearanceDTO, BattleStatsDTO } from '../schema';
import type { PetId } from '@/shared/types/brands';
import { brandPetId, brandBasePetId } from '@/shared/types/brands';
import { Stats } from '@/domain/valueObjects/Stats';
import { Ability as AbilityEntity } from '@/domain/entities/Ability';
import type { AbilityDTO } from '../schema';
import type { PetVisualGenome } from '@/domain/entities/VisualGenome';

/**
 * Map Pet domain entity to DTO
 */
export function petToDTO(pet: Pet): PetDTO {
  return {
    id: pet.id,
    playerId: pet.playerId,
    basePetId: pet.basePetId,
    name: pet.name,
    nickname: pet.nickname,
    family: pet.family,
    rarity: pet.rarity,
    stats: pet.stats.toObject(),
    passiveAbilities: pet.passiveAbilities.map(abilityToDTO),
    activeAbilities: pet.activeAbilities.map(abilityToDTO),
    ultimateAbility: pet.ultimateAbility ? abilityToDTO(pet.ultimateAbility) : null,
    fusionHistory: pet.fusionHistory.map(fusionHistoryToDTO),
    appearance: petAppearanceToDTO(pet.appearance),
    battleStats: pet.battleStats ? battleStatsToDTO(pet.battleStats) : null,
    collectionDate: pet.collectionDate,
    lore: pet.lore,
  };
}

/**
 * Map DTO to Pet domain entity
 */
export function dtoToPet(dto: PetDTO): Pet {
  return new Pet(
    brandPetId(dto.id),
    dto.playerId,
    dto.basePetId ? brandBasePetId(dto.basePetId) : null,
    dto.name,
    dto.nickname,
    dto.family,
    dto.rarity,
    Stats.fromObject(dto.stats),
    dto.passiveAbilities.map(dtoToAbility),
    dto.activeAbilities.map(dtoToAbility),
    dto.ultimateAbility ? dtoToAbility(dto.ultimateAbility) : null,
    dto.fusionHistory.map(dtoToFusionHistory),
    dtoToPetAppearance(dto.appearance),
    dto.battleStats ? dtoToBattleStats(dto.battleStats) : null,
    dto.collectionDate,
    false,
    dto.lore || '' // lore from DTO, default to empty string
  );
}

function fusionHistoryToDTO(history: FusionHistory): FusionHistoryEntryDTO {
  return {
    generation: history.generation,
    parentIds: [history.parentIds[0], history.parentIds[1]],
    parentFamilies: [history.parentFamilies[0], history.parentFamilies[1]],
    stonesUsed: [history.stonesUsed[0], history.stonesUsed[1]],
    fusionSeed: history.fusionSeed,
    mutationCount: history.mutationCount,
    timestamp: history.timestamp,
  };
}

function dtoToFusionHistory(dto: FusionHistoryEntryDTO): FusionHistory {
  return {
    generation: dto.generation,
    parentIds: [brandPetId(dto.parentIds[0]), brandPetId(dto.parentIds[1])] as [PetId, PetId],
    parentFamilies: dto.parentFamilies,
    stonesUsed: dto.stonesUsed as [string, string],
    fusionSeed: dto.fusionSeed,
    mutationCount: dto.mutationCount,
    timestamp: dto.timestamp,
  };
}

function petAppearanceToDTO(appearance: PetAppearance): PetAppearanceDTO {
  return {
    baseSprite: appearance.baseSprite,
    colorMutation: appearance.colorMutation,
    glowColor: appearance.glowColor,
    particleEffect: appearance.particleEffect,
    visualTags: [...appearance.visualTags],
    visualGenome: appearance.visualGenome ? visualGenomeToDTO(appearance.visualGenome) : undefined,
  };
}

function dtoToPetAppearance(dto: PetAppearanceDTO): PetAppearance {
  return {
    baseSprite: dto.baseSprite,
    colorMutation: dto.colorMutation,
    glowColor: dto.glowColor,
    particleEffect: dto.particleEffect,
    visualTags: [...dto.visualTags],
    visualGenome: dto.visualGenome ? dtoToVisualGenome(dto.visualGenome) : undefined,
  };
}

function visualGenomeToDTO(genome: PetVisualGenome): PetAppearanceDTO['visualGenome'] {
  return {
    baseForm: genome.baseForm,
    bodyParts: {
      head: genome.bodyParts.head,
      torso: genome.bodyParts.torso,
      limbs: genome.bodyParts.limbs,
      tail: genome.bodyParts.tail,
      wings: genome.bodyParts.wings,
    },
    elementAffinity: [...genome.elementAffinity],
    rarity: genome.rarity,
    mutationTraits: [...genome.mutationTraits],
    paletteSeed: genome.paletteSeed,
    animationProfile: genome.animationProfile,
    sizeModifier: genome.sizeModifier,
    visualTags: [...genome.visualTags],
  };
}

function dtoToVisualGenome(dto: NonNullable<PetAppearanceDTO['visualGenome']>): PetVisualGenome {
  return {
    baseForm: dto.baseForm as PetVisualGenome['baseForm'],
    bodyParts: {
      head: dto.bodyParts.head,
      torso: dto.bodyParts.torso,
      limbs: dto.bodyParts.limbs,
      tail: dto.bodyParts.tail,
      wings: dto.bodyParts.wings,
    },
    elementAffinity: [...dto.elementAffinity],
    rarity: dto.rarity as PetVisualGenome['rarity'],
    mutationTraits: [...dto.mutationTraits],
    paletteSeed: dto.paletteSeed,
    animationProfile: dto.animationProfile as PetVisualGenome['animationProfile'],
    sizeModifier: dto.sizeModifier,
    visualTags: [...dto.visualTags],
  };
}

function battleStatsToDTO(stats: BattleStats): BattleStatsDTO {
  return {
    wins: stats.wins,
    losses: stats.losses,
    draws: stats.draws,
    damageDealt: stats.damageDealt,
    damageTaken: stats.damageTaken,
  };
}

function dtoToBattleStats(dto: BattleStatsDTO): BattleStats {
  return {
    wins: dto.wins,
    losses: dto.losses,
    draws: dto.draws,
    damageDealt: dto.damageDealt,
    damageTaken: dto.damageTaken,
  };
}

function abilityToDTO(ability: Ability): AbilityDTO {
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

function dtoToAbility(dto: AbilityDTO): Ability {
  return new AbilityEntity(
    dto.id as any,
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
      statusType: effect.statusType as any,
      statusDuration: effect.statusDuration,
      lifesteal: effect.lifesteal,
      scaling: effect.scaling,
    })),
    dto.tags,
    dto.element
  );
}




