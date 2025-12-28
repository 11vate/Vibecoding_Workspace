/**
 * Dungeon Repository Interface
 * Abstract interface for dungeon data access
 */

import type { DungeonId } from '@/shared/types/brands';
import type { Dungeon } from '../entities/Dungeon';

export interface IDungeonRepository {
  /**
   * Get dungeon by ID
   */
  findById(id: DungeonId): Promise<Dungeon | null>;

  /**
   * Get all dungeons
   */
  findAll(): Promise<Dungeon[]>;

  /**
   * Find dungeon by floor number
   */
  findByFloorNumber(floorNumber: number): Promise<Dungeon | null>;

  /**
   * Find dungeons by tier
   */
  findByTier(tier: number): Promise<Dungeon[]>;

  /**
   * Save dungeon (create or update)
   */
  save(dungeon: Dungeon): Promise<void>;

  /**
   * Delete dungeon by ID
   */
  delete(id: DungeonId): Promise<void>;

  /**
   * Check if dungeon exists
   */
  exists(id: DungeonId): Promise<boolean>;

  /**
   * Count total dungeons
   */
  count(): Promise<number>;
}





















