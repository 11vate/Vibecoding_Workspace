/**
 * Dungeon Mapper
 * Maps between Dungeon domain entity and DungeonDTO
 */

import { Dungeon, type MinionWave, type BossEncounter, type DungeonRewards } from '@/domain/entities/Dungeon';
import type { DungeonDTO, MinionWaveDTO, BossEncounterDTO, DungeonRewardsDTO } from '../schema';
import { brandDungeonId } from '@/shared/types/brands';
import { basePetToDTO, dtoToBasePet } from './BasePetMapper';

/**
 * Map Dungeon domain entity to DTO
 */
export function dungeonToDTO(dungeon: Dungeon): DungeonDTO {
  return {
    id: dungeon.id,
    floorNumber: dungeon.floorNumber,
    tier: dungeon.tier,
    name: dungeon.name,
    description: dungeon.description,
    minionWaves: dungeon.minionWaves.map(minionWaveToDTO),
    boss: bossEncounterToDTO(dungeon.boss),
    rewards: dungeonRewardsToDTO(dungeon.rewards),
  };
}

/**
 * Map DTO to Dungeon domain entity
 */
export function dtoToDungeon(dto: DungeonDTO): Dungeon {
  return new Dungeon(
    brandDungeonId(dto.id),
    dto.floorNumber,
    dto.tier,
    dto.name,
    dto.description,
    dto.minionWaves.map(dtoToMinionWave),
    dtoToBossEncounter(dto.boss),
    dtoToDungeonRewards(dto.rewards)
  );
}

/**
 * Map MinionWave to DTO
 */
function minionWaveToDTO(wave: MinionWave): MinionWaveDTO {
  return {
    pets: wave.pets.map(basePetToDTO),
    difficulty: wave.difficulty,
  };
}

/**
 * Map DTO to MinionWave
 */
function dtoToMinionWave(dto: MinionWaveDTO): MinionWave {
  return {
    pets: dto.pets.map(dtoToBasePet),
    difficulty: dto.difficulty,
  };
}

/**
 * Map BossEncounter to DTO
 */
function bossEncounterToDTO(boss: BossEncounter): BossEncounterDTO {
  return {
    pet: basePetToDTO(boss.pet),
    specialAbilities: [...boss.specialAbilities],
    difficultyMultiplier: boss.difficultyMultiplier,
  };
}

/**
 * Map DTO to BossEncounter
 */
function dtoToBossEncounter(dto: BossEncounterDTO): BossEncounter {
  return {
    pet: dtoToBasePet(dto.pet),
    specialAbilities: [...dto.specialAbilities],
    difficultyMultiplier: dto.difficultyMultiplier,
  };
}

/**
 * Map DungeonRewards to DTO
 */
function dungeonRewardsToDTO(rewards: DungeonRewards): DungeonRewardsDTO {
  return {
    essence: { ...rewards.essence },
    stones: rewards.stones ? rewards.stones.map((stone) => ({
      type: stone.type,
      tier: stone.tier,
      chance: stone.chance,
    })) : undefined,
  };
}

/**
 * Map DTO to DungeonRewards
 */
function dtoToDungeonRewards(dto: DungeonRewardsDTO): DungeonRewards {
  return {
    essence: { ...dto.essence },
    stones: dto.stones ? dto.stones.map((stone) => ({
      type: stone.type,
      tier: stone.tier,
      chance: stone.chance,
    })) : undefined,
  };
}











