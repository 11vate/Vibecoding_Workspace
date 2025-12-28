/**
 * Pet Repository Interface
 * Abstract interface for pet data access
 */

import type { PetId, BasePetId } from '@/shared/types/brands';
import type { Pet } from '../entities/Pet';
import type { Rarity } from '@/shared/types/rarity';
import type { PetFamily } from '@/shared/types/family';

export interface IPetRepository {
  /**
   * Get pet by ID
   */
  findById(id: PetId): Promise<Pet | null>;

  /**
   * Get all pets
   */
  findAll(): Promise<Pet[]>;

  /**
   * Find pets by family
   */
  findByFamily(family: PetFamily): Promise<Pet[]>;

  /**
   * Find pets by rarity
   */
  findByRarity(rarity: Rarity): Promise<Pet[]>;

  /**
   * Find pets by player ID
   */
  findByPlayerId(playerId: string): Promise<Pet[]>;

  /**
   * Save pet (create or update)
   */
  save(pet: Pet): Promise<void>;

  /**
   * Delete pet by ID
   */
  delete(id: PetId): Promise<void>;

  /**
   * Check if pet exists
   */
  exists(id: PetId): Promise<boolean>;

  /**
   * Count total pets
   */
  count(): Promise<number>;

  /**
   * Get all base pet IDs that the player owns
   */
  getOwnedBasePetIds(): Promise<Set<BasePetId>>;
}




