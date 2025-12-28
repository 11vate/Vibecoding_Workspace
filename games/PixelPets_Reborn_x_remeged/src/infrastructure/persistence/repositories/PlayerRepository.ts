/**
 * Player Repository Implementation (IndexedDB)
 */

import type { IPlayerRepository } from '@/domain/repositories/IPlayerRepository';
import { Player } from '@/domain/entities/Player';
import { openDatabase } from '../schema';
import { playerToDTO, dtoToPlayer } from '../mappers/PlayerMapper';
import type { Rarity } from '@/shared/types/rarity';

const DEFAULT_PLAYER_ID = 'player_1';

/**
 * Default player data
 */
function createDefaultPlayer(): Player {
  const defaultEssence: Record<Rarity, number> = {
    0: 100, // BASIC - starter essence for summoning
    1: 50, // RARE
    2: 20, // SR
    3: 5, // LEGENDARY
    4: 0, // MYTHIC
    5: 0, // PRISMATIC
    6: 0, // OMEGA
  };

  return new Player(
    DEFAULT_PLAYER_ID,
    'Player',
    defaultEssence,
    100,  // dataKeys
    500,  // corruptedBytes
    0,    // pityCounter
    1000, // rank
    [],   // teams
    [],   // completedDungeons
    Date.now()
  );
}

export class PlayerRepository implements IPlayerRepository {
  async findById(id: string): Promise<Player | null> {
    try {
      const db = await openDatabase();
      const dto = await db.get('playerData', id);
      return dto ? dtoToPlayer(dto) : null;
    } catch (error) {
      console.error('[PlayerRepository] Error finding player:', error);
      return null;
    }
  }

  async getDefaultPlayer(): Promise<Player> {
    const player = await this.findById(DEFAULT_PLAYER_ID);
    if (!player) {
      return await this.createDefaultPlayer();
    }
    return player;
  }

  async save(player: Player): Promise<void> {
    try {
      const db = await openDatabase();
      const dto = playerToDTO(player);
      await db.put('playerData', dto);
    } catch (error) {
      console.error('[PlayerRepository] Error saving player:', error);
      throw new Error(`Failed to save player: ${error}`);
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const db = await openDatabase();
      const dto = await db.get('playerData', id);
      return dto !== undefined;
    } catch (error) {
      console.error('[PlayerRepository] Error checking player existence:', error);
      return false;
    }
  }

  async findAll(): Promise<Player[]> {
    try {
      const db = await openDatabase();
      const dtos = await db.getAll('playerData');
      return dtos.map(dtoToPlayer);
    } catch (error) {
      console.error('[PlayerRepository] Error finding all players:', error);
      return [];
    }
  }

  async createDefaultPlayer(): Promise<Player> {
    const defaultPlayer = createDefaultPlayer();
    await this.save(defaultPlayer);
    return defaultPlayer;
  }
}







