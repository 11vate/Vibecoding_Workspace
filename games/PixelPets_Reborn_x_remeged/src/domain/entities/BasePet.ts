/**
 * BasePet Entity
 * Template for summonable pets (not runtime instances)
 */

import type { BasePetId } from '@/shared/types/brands';
import type { Rarity } from '@/shared/types/rarity';
import type { PetFamily } from '@/shared/types/family';

export interface BasePetStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface BasePet {
  id: BasePetId;
  name: string;
  family: PetFamily;
  rarity: Rarity;
  baseStats: BasePetStats;
  starterAbilities: readonly string[];
  starterPassives: readonly string[];
  visualTags: readonly string[];
  lore: string;
}
