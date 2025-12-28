/**
 * Player Repository Interface
 * Abstract interface for player data access
 */

import type { Player } from '../entities/Player';

export interface IPlayerRepository {
  /**
   * Get player by ID (typically only one player per game instance)
   */
  findById(id: string): Promise<Player | null>;

  /**
   * Get the default player (singleton pattern)
   */
  getDefaultPlayer(): Promise<Player>;

  /**
   * Save player (create or update)
   */
  save(player: Player): Promise<void>;

  /**
   * Check if player exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Create default player if none exists
   */
  createDefaultPlayer(): Promise<Player>;
}
















