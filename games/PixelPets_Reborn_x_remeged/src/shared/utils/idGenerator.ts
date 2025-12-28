/**
 * ID Generator
 * Generates unique IDs for entities
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  PetId,
  StoneId,
  AbilityId,
  BattleId,
  DungeonId,
  BasePetId,
  PvPMatchId,
} from '../types/brands';
import {
  brandPetId,
  brandStoneId,
  brandAbilityId,
  brandBattleId,
  brandDungeonId,
  brandBasePetId,
  brandPvPMatchId,
} from '../types/brands';

export function generateId(prefix: string): string {
  const uuid = uuidv4();
  const shortId = uuid.replace(/-/g, '').substring(0, 12);
  return `${prefix}_${shortId}`;
}

export function generatePetId(): PetId {
  return brandPetId(generateId('pet'));
}

export function generateStoneId(): StoneId {
  return brandStoneId(generateId('stone'));
}

export function generateAbilityId(): AbilityId {
  return brandAbilityId(generateId('ability'));
}

export function generateBattleId(): BattleId {
  return brandBattleId(generateId('battle'));
}

export function generateDungeonId(): DungeonId {
  return brandDungeonId(generateId('dungeon'));
}

export function generateBasePetId(): BasePetId {
  return brandBasePetId(generateId('basepet'));
}

export function generatePvPMatchId(): PvPMatchId {
  return brandPvPMatchId(generateId('pvpmatch'));
}





















