/**
 * Player Mapper
 * Maps between Player domain entity and PlayerDataDTO
 */

import { Player } from '@/domain/entities/Player';
import type { PlayerDataDTO } from '../schema';
import type { Rarity } from '@/shared/types/rarity';
import type { Team } from '@/domain/entities/Player';

/**
 * Map Player domain entity to DTO
 */
export function playerToDTO(player: Player): PlayerDataDTO {
  return {
    id: player.id,
    username: player.username,
    essence: { ...player.essence },
    dataKeys: player.dataKeys,
    corruptedBytes: player.corruptedBytes,
    pityCounter: player.pityCounter,
    rank: player.rank,
    teams: player.teams.map((team) => ({
      id: team.id,
      name: team.name,
      petIds: [...team.petIds],
      formation: [...team.formation],
    })) as unknown[],
    completedDungeons: [...player.completedDungeons],
    lastUpdated: player.lastUpdated,
  };
}

/**
 * Map DTO to Player domain entity
 */
export function dtoToPlayer(dto: PlayerDataDTO): Player {
  const teams: Team[] = (dto.teams as any[]).map((teamDTO) => ({
    id: teamDTO.id,
    name: teamDTO.name,
    petIds: [...teamDTO.petIds],
    formation: [...teamDTO.formation],
  }));

  // Ensure all rarities are present in essence
  const essence: Record<Rarity, number> = {
    0: dto.essence[0] || 0, // BASIC
    1: dto.essence[1] || 0, // RARE
    2: dto.essence[2] || 0, // SR
    3: dto.essence[3] || 0, // LEGENDARY
    4: dto.essence[4] || 0, // MYTHIC
    5: dto.essence[5] || 0, // PRISMATIC
    6: dto.essence[6] || 0, // OMEGA
  } as Record<Rarity, number>;

  return new Player(
    dto.id,
    dto.username,
    essence,
    dto.dataKeys ?? 0,
    dto.corruptedBytes ?? 0,
    dto.pityCounter ?? 0,
    dto.rank,
    teams,
    dto.completedDungeons,
    dto.lastUpdated
  );
}
