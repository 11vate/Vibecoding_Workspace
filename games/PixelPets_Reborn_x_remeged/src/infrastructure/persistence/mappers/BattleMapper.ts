/**
 * Battle Mapper
 * Maps between Battle domain entity and BattleDTO
 * Note: Battles contain complex nested structures that are serialized as JSON
 */

import { Battle } from '@/domain/entities/Battle';
import type { BattleDTO } from '../schema';
import type { PetId } from '@/shared/types/brands';
import { brandBattleId, brandPetId } from '@/shared/types/brands';
import type { CombatPet, CombatLogEntry, DomainEffect } from '@/domain/entities/Battle';
import { petToDTO, dtoToPet } from './PetMapper';
import type { PetDTO } from '../schema';
import { Ability } from '@/domain/entities/Ability';
import type { AbilityEffect } from '@/domain/entities/Ability';
import type { StatusEffect } from '@/shared/types/status';

/**
 * Map Battle domain entity to DTO
 */
export function battleToDTO(battle: Battle): BattleDTO {
  // Serialize complex nested structures
  // Note: CombatPet contains Pet entities, which need to be serialized
  const team1DTO = battle.team1.map((combatPet) => ({
    pet: petToDTO(combatPet.pet),
    currentHp: combatPet.currentHp,
    currentEnergy: combatPet.currentEnergy,
    statusEffects: [...combatPet.statusEffects],
    buffs: [...combatPet.buffs],
    debuffs: [...combatPet.debuffs],
    position: combatPet.position,
  }));

  const team2DTO = battle.team2.map((combatPet) => ({
    pet: petToDTO(combatPet.pet),
    currentHp: combatPet.currentHp,
    currentEnergy: combatPet.currentEnergy,
    statusEffects: [...combatPet.statusEffects],
    buffs: [...combatPet.buffs],
    debuffs: [...combatPet.debuffs],
    position: combatPet.position,
  }));

  // Serialize log entries (they contain Ability entities which need serialization)
  const logDTO = battle.log.map((entry) => ({
    turn: entry.turn,
    action: {
      petId: entry.action.petId,
      ability: {
        id: entry.action.ability.id,
        name: entry.action.ability.name,
        description: entry.action.ability.description,
        type: entry.action.ability.type,
        energyCost: entry.action.ability.energyCost,
        cooldown: entry.action.ability.cooldown,
        currentCooldown: entry.action.ability.currentCooldown,
        effects: entry.action.ability.effects.map((e) => ({
          type: e.type,
          target: e.target,
          value: e.value,
          element: e.element,
          statusChance: e.statusChance,
          statusType: e.statusType,
          statusDuration: e.statusDuration,
          lifesteal: e.lifesteal,
          scaling: e.scaling,
        })),
        tags: [...entry.action.ability.tags],
        element: entry.action.ability.element,
      },
      targetIds: [...entry.action.targetIds],
      timestamp: entry.action.timestamp,
    },
    results: entry.results.map((r) => ({
      targetId: r.targetId,
      damage: r.damage,
      healing: r.healing,
      statusApplied: r.statusApplied,
      buffApplied: r.buffApplied,
      debuffApplied: r.debuffApplied,
      missed: r.missed,
      critical: r.critical,
    })),
    timestamp: entry.timestamp,
  }));

  const domainEffectsDTO = battle.domainEffects.map((effect) => ({
    type: effect.type,
    description: effect.description,
    sourcePetId: effect.sourcePetId,
  }));

  return {
    id: battle.id,
    team1: team1DTO as unknown,
    team2: team2DTO as unknown,
    currentTurn: battle.currentTurn,
    turnOrder: [...battle.turnOrder],
    currentActorIndex: battle.currentActorIndex,
    log: logDTO as unknown,
    domainEffects: domainEffectsDTO as unknown,
    isComplete: battle.isComplete,
    winner: battle.winner,
    createdAt: battle.createdAt,
  };
}

/**
 * Map DTO to Battle domain entity
 * Note: This is complex due to nested structures - may throw errors if data is corrupted
 */
export function dtoToBattle(dto: BattleDTO): Battle {
  // Reconstruct CombatPet arrays
  const team1 = (dto.team1 as any[]).map((combatPetDTO): CombatPet => {
    const pet = dtoToPet(combatPetDTO.pet as PetDTO);
    return {
      pet,
      currentHp: combatPetDTO.currentHp,
      currentEnergy: combatPetDTO.currentEnergy,
      statusEffects: combatPetDTO.statusEffects,
      buffs: combatPetDTO.buffs,
      debuffs: combatPetDTO.debuffs,
      position: combatPetDTO.position,
    };
  });

  const team2 = (dto.team2 as any[]).map((combatPetDTO): CombatPet => {
    const pet = dtoToPet(combatPetDTO.pet as PetDTO);
    return {
      pet,
      currentHp: combatPetDTO.currentHp,
      currentEnergy: combatPetDTO.currentEnergy,
      statusEffects: combatPetDTO.statusEffects,
      buffs: combatPetDTO.buffs,
      debuffs: combatPetDTO.debuffs,
      position: combatPetDTO.position,
    };
  });

  // Reconstruct log entries
  const log: CombatLogEntry[] = (dto.log as any[]).map((entryDTO) => {
    const effects: AbilityEffect[] = entryDTO.action.ability.effects.map((e: any) => ({
      type: e.type,
      target: e.target,
      value: e.value,
      element: e.element,
      statusChance: e.statusChance,
      statusType: e.statusType as StatusEffect | undefined,
      statusDuration: e.statusDuration,
      lifesteal: e.lifesteal,
      scaling: e.scaling,
    }));

    const ability = new Ability(
      entryDTO.action.ability.id as any,
      entryDTO.action.ability.name,
      entryDTO.action.ability.description,
      entryDTO.action.ability.type,
      entryDTO.action.ability.energyCost,
      entryDTO.action.ability.cooldown,
      entryDTO.action.ability.currentCooldown,
      effects,
      entryDTO.action.ability.tags,
      entryDTO.action.ability.element
    );

    return {
      turn: entryDTO.turn,
      action: {
        petId: brandPetId(entryDTO.action.petId) as PetId,
        ability,
        targetIds: entryDTO.action.targetIds.map((id: string) => brandPetId(id) as PetId),
        timestamp: entryDTO.action.timestamp,
      },
      results: entryDTO.results.map((r: any) => ({
        targetId: brandPetId(r.targetId) as PetId,
        damage: r.damage,
        healing: r.healing,
        statusApplied: r.statusApplied as StatusEffect | undefined,
        buffApplied: r.buffApplied,
        debuffApplied: r.debuffApplied,
        missed: r.missed,
        critical: r.critical,
      })),
      timestamp: entryDTO.timestamp,
    };
  });

  const domainEffects: DomainEffect[] = (dto.domainEffects as any[]).map((effectDTO) => ({
    type: effectDTO.type,
    description: effectDTO.description,
    sourcePetId: brandPetId(effectDTO.sourcePetId) as PetId,
  }));

  return new Battle(
    brandBattleId(dto.id),
    team1,
    team2,
    dto.currentTurn,
    dto.turnOrder.map((id) => brandBattleId(id) as any),
    dto.currentActorIndex,
    log,
    domainEffects,
    dto.isComplete,
    dto.winner,
    dto.createdAt
  );
}

