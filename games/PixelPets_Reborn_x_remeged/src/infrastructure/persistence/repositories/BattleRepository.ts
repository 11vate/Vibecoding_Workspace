/**
 * Battle Repository Implementation (IndexedDB)
 * Stores battles for replay/history functionality
 */

import type { IBattleRepository } from '@/domain/repositories/IBattleRepository';
import type { Battle } from '@/domain/entities/Battle';
import type { BattleId } from '@/shared/types/brands';
import { openDatabase } from '../schema';
import { battleToDTO, dtoToBattle } from '../mappers/BattleMapper';

export class BattleRepository implements IBattleRepository {
  async findById(id: BattleId): Promise<Battle | null> {
    try {
      const db = await openDatabase();
      const dto = await db.get('battles', id);
      return dto ? dtoToBattle(dto) : null;
    } catch (error) {
      console.error('[BattleRepository] Error finding battle:', error);
      return null;
    }
  }

  async findAll(): Promise<Battle[]> {
    try {
      const db = await openDatabase();
      const dtos = await db.getAll('battles');
      return dtos.map(dtoToBattle);
    } catch (error) {
      console.error('[BattleRepository] Error finding all battles:', error);
      return [];
    }
  }

  async save(battle: Battle, meta?: { seed?: string }): Promise<void> {
    try {
      const db = await openDatabase();
      const dto = battleToDTO(battle);
      // Persist optional seed for deterministic replay if provided
      if (meta?.seed) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (dto as any).seed = meta.seed;
      }
      await db.put('battles', dto);
    } catch (error) {
      console.error('[BattleRepository] Error saving battle:', error);
      throw new Error(`Failed to save battle: ${error}`);
    }
  }

  async delete(id: BattleId): Promise<void> {
    try {
      const db = await openDatabase();
      await db.delete('battles', id);
    } catch (error) {
      console.error('[BattleRepository] Error deleting battle:', error);
      throw new Error(`Failed to delete battle: ${error}`);
    }
  }

  async exists(id: BattleId): Promise<boolean> {
    try {
      const db = await openDatabase();
      const dto = await db.get('battles', id);
      return dto !== undefined;
    } catch (error) {
      console.error('[BattleRepository] Error checking battle existence:', error);
      return false;
    }
  }

  async count(): Promise<number> {
    try {
      const db = await openDatabase();
      return await db.count('battles');
    } catch (error) {
      console.error('[BattleRepository] Error counting battles:', error);
      return 0;
    }
  }

  /**
   * Get completed battles (for history)
   */
  async findCompletedBattles(limit?: number): Promise<Battle[]> {
    try {
      const db = await openDatabase();
      const index = db.transaction('battles').store.index('by-complete');
      const dtos = await index.getAll(true); // isComplete === true
      const battles = dtos.map(dtoToBattle);
      return limit ? battles.slice(0, limit) : battles;
    } catch (error) {
      console.error('[BattleRepository] Error finding completed battles:', error);
      return [];
    }
  }

  /**
   * Clean up old battles (keep only recent N battles)
   */
  async cleanupOldBattles(keepCount: number = 100): Promise<void> {
    try {
      const db = await openDatabase();
      const index = db.transaction('battles').store.index('by-created');
      const allBattles = await index.getAll();
      
      // Sort by createdAt descending
      allBattles.sort((a, b) => b.createdAt - a.createdAt);
      
      // Delete old battles
      const toDelete = allBattles.slice(keepCount);
      for (const battle of toDelete) {
        await db.delete('battles', battle.id);
      }
    } catch (error) {
      console.error('[BattleRepository] Error cleaning up old battles:', error);
    }
  }
}




