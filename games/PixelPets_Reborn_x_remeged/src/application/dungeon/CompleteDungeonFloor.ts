/**
 * Complete Dungeon Floor Use Case
 * Marks a dungeon floor as completed for the player
 */

import type { DungeonId } from '@/shared/types/brands';
import type { IPlayerRepository } from '@/domain/repositories/IPlayerRepository';
import type { Player } from '@/domain/entities/Player';
import { PlayerRepository } from '@/infrastructure/persistence/repositories/PlayerRepository';

export interface CompleteDungeonFloorInput {
  dungeonId: DungeonId;
  playerId: string;
  victory: boolean;
}

export interface CompleteDungeonFloorOutput {
  player: Player;
  message: string;
}

/**
 * Complete Dungeon Floor Use Case
 */
export class CompleteDungeonFloor {
  private playerRepository: IPlayerRepository;

  constructor(playerRepository?: IPlayerRepository) {
    this.playerRepository = playerRepository || new PlayerRepository();
  }

  async execute(input: CompleteDungeonFloorInput): Promise<CompleteDungeonFloorOutput> {
    const { dungeonId, playerId, victory } = input;

    // Fetch player
    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Only mark as completed if victory
    if (!victory) {
      return {
        player,
        message: 'Dungeon run failed. Floor not marked as completed.',
      };
    }

    // Check if already completed
    if (player.hasCompletedDungeon(dungeonId)) {
      return {
        player,
        message: 'Dungeon floor already completed',
      };
    }

    // Mark dungeon as completed
    const updatedPlayer = player.withCompletedDungeon(dungeonId);
    await this.playerRepository.save(updatedPlayer);

    return {
      player: updatedPlayer,
      message: `Dungeon floor ${dungeonId} completed!`,
    };
  }
}











