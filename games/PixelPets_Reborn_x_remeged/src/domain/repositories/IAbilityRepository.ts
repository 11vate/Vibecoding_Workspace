/**
 * Ability Repository Interface
 * Abstract interface for ability data access
 */

import type { AbilityId } from '@/shared/types/brands';
import type { Ability, AbilityType } from '../entities/Ability';

export interface IAbilityRepository {
  /**
   * Get ability by ID
   */
  findById(id: AbilityId): Promise<Ability | null>;

  /**
   * Get all abilities
   */
  findAll(): Promise<Ability[]>;

  /**
   * Find abilities by type
   */
  findByType(type: AbilityType): Promise<Ability[]>;

  /**
   * Find abilities by element
   */
  findByElement(element: string): Promise<Ability[]>;

  /**
   * Find abilities by tags
   */
  findByTags(tags: string[]): Promise<Ability[]>;

  /**
   * Find ability by name
   */
  findByName(name: string): Promise<Ability | null>;

  /**
   * Save ability (create or update)
   */
  save(ability: Ability): Promise<void>;

  /**
   * Delete ability by ID
   */
  delete(id: AbilityId): Promise<void>;

  /**
   * Check if ability exists
   */
  exists(id: AbilityId): Promise<boolean>;

  /**
   * Count total abilities
   */
  count(): Promise<number>;
}





















