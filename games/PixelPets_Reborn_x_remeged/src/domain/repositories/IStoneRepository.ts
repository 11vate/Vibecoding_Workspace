/**
 * Stone Repository Interface
 * Abstract interface for stone data access
 */

import type { StoneId } from '@/shared/types/brands';
import type { Stone, StoneType, StoneTier } from '../entities/Stone';

export interface IStoneRepository {
  /**
   * Get stone by ID
   */
  findById(id: StoneId): Promise<Stone | null>;

  /**
   * Get all stones
   */
  findAll(): Promise<Stone[]>;

  /**
   * Find stones by type
   */
  findByType(type: StoneType): Promise<Stone[]>;

  /**
   * Find stones by tier
   */
  findByTier(tier: StoneTier): Promise<Stone[]>;

  /**
   * Find stones by player ID
   */
  findByPlayerId(playerId: string): Promise<Stone[]>;

  /**
   * Save stone (create or update)
   */
  save(stone: Stone): Promise<void>;

  /**
   * Delete stone by ID
   */
  delete(id: StoneId): Promise<void>;

  /**
   * Check if stone exists
   */
  exists(id: StoneId): Promise<boolean>;

  /**
   * Count total stones
   */
  count(): Promise<number>;
}





















