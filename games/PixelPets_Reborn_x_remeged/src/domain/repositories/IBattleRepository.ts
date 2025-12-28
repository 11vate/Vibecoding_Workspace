/**
 * Battle Repository Interface
 * Abstract interface for battle data access
 */

import type { BattleId } from '@/shared/types/brands';
import type { Battle } from '../entities/Battle';

export interface IBattleRepository {
  /**
   * Get battle by ID
   */
  findById(id: BattleId): Promise<Battle | null>;

  /**
   * Get all battles
   */
  findAll(): Promise<Battle[]>;

  /**
   * Save battle (create or update). Optional metadata (e.g., seed) may be provided.
   */
  save(battle: Battle, meta?: { seed?: string }): Promise<void>;

  /**
   * Delete battle by ID
   */
  delete(id: BattleId): Promise<void>;

  /**
   * Check if battle exists
   */
  exists(id: BattleId): Promise<boolean>;

  /**
   * Count total battles
   */
  count(): Promise<number>;
}





















