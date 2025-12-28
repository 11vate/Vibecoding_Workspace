/**
 * Branded types for IDs to ensure type safety
 */

export type PetId = string & { readonly __brand: unique symbol };
export type StoneId = string & { readonly __brand: unique symbol };
export type AbilityId = string & { readonly __brand: unique symbol };
export type BattleId = string & { readonly __brand: unique symbol };
export type DungeonId = string & { readonly __brand: unique symbol };
export type BasePetId = string & { readonly __brand: unique symbol };
export type PvPMatchId = string & { readonly __brand: unique symbol };

/**
 * Brand a string as a specific ID type
 */
export function brandPetId(id: string): PetId {
  return id as PetId;
}

export function brandStoneId(id: string): StoneId {
  return id as StoneId;
}

export function brandAbilityId(id: string): AbilityId {
  return id as AbilityId;
}

export function brandBattleId(id: string): BattleId {
  return id as BattleId;
}

export function brandDungeonId(id: string): DungeonId {
  return id as DungeonId;
}

export function brandBasePetId(id: string): BasePetId {
  return id as BasePetId;
}

export function brandPvPMatchId(id: string): PvPMatchId {
  return id as PvPMatchId;
}





















