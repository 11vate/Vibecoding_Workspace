/**
 * Base Pet Repository Interface
 * Abstract interface for base pet template data access
 */

import type { BasePetId } from '@/shared/types/brands';
import type { BasePet } from '../entities/BasePet';
import type { Rarity } from '@/shared/types/rarity';
import type { PetFamily } from '@/shared/types/family';

export interface IBasePetRepository {
  /**
   * Get base pet by ID
   */
  findById(id: BasePetId): Promise<BasePet | null>;

  /**
   * Get all base pets
   */
  findAll(): Promise<BasePet[]>;

  /**
   * Find base pets by family
   */
  findByFamily(family: PetFamily): Promise<BasePet[]>;

  /**
   * Find base pets by rarity
   */
  findByRarity(rarity: Rarity): Promise<BasePet[]>;

  /**
   * Get random base pet by rarity (for summoning)
   */
  getRandomByRarity(rarity: Rarity, excludeIds?: Set<BasePetId>): Promise<BasePet | null>;

  /**
   * Check if base pet exists
   */
  exists(id: BasePetId): Promise<boolean>;

  /**
   * Count total base pets
   */
  count(): Promise<number>;
}





















