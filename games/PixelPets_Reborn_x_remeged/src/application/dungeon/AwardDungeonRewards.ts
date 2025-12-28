/**
 * Award Dungeon Rewards Use Case
 * Awards essence and stones to player after completing a dungeon
 */

import type { Dungeon } from '@/domain/entities/Dungeon';
import type { Player } from '@/domain/entities/Player';
import type { Rarity } from '@/shared/types/rarity';
import type { IPlayerRepository } from '@/domain/repositories/IPlayerRepository';
import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';
import { PlayerRepository } from '@/infrastructure/persistence/repositories/PlayerRepository';
import { StoneRepository } from '@/infrastructure/persistence/repositories/StoneRepository';
import { StoneGenerator } from '@/domain/services/StoneGenerator';
import { Rarity as RarityEnum } from '@/shared/types/rarity';

import { StoneTier } from '@/domain/entities/Stone';

export interface AwardDungeonRewardsInput {
  dungeon: Dungeon;
  playerId: string;
}

export interface AwardDungeonRewardsOutput {
  player: Player;
  essenceAwarded: Record<Rarity, number>;
  stonesAwarded: number;
  message: string;
}

/**
 * Award Dungeon Rewards Use Case
 */
export class AwardDungeonRewards {
  private playerRepository: IPlayerRepository;
  private stoneRepository: IStoneRepository;

  constructor(
    playerRepository?: IPlayerRepository,
    stoneRepository?: IStoneRepository
  ) {
    this.playerRepository = playerRepository || new PlayerRepository();
    this.stoneRepository = stoneRepository || new StoneRepository();
  }

  async execute(input: AwardDungeonRewardsInput): Promise<AwardDungeonRewardsOutput> {
    const { dungeon, playerId } = input;

    // Fetch player
    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Award essence rewards
    const essenceRewards = dungeon.getEssenceReward();
    const newEssence: Record<Rarity, number> = { ...player.essence };
    for (const [rarityStr, amount] of Object.entries(essenceRewards)) {
      const rarity = parseInt(rarityStr, 10) as Rarity;
      if (amount > 0) {
        newEssence[rarity] = (newEssence[rarity] || 0) + amount;
      }
    }

    let updatedPlayer = player.withEssence(newEssence);

    // Award stone rewards (roll for each stone reward)
    let stonesAwarded = 0;
    if (dungeon.rewards.stones) {
      for (const stoneReward of dungeon.rewards.stones) {
        const stone = StoneGenerator.generateStoneFromReward(
          stoneReward.type,
          stoneReward.tier as StoneTier,
          stoneReward.chance
        );
        if (stone) {
          await this.stoneRepository.save(stone);
          stonesAwarded++;
        }
      }
    }

    // Save updated player
    await this.playerRepository.save(updatedPlayer);

    // Build summary message
    const essenceSummary = Object.entries(essenceRewards)
      .filter(([_, amount]) => amount > 0)
      .map(([rarity, amount]) => {
        const rarityName = RarityEnum[parseInt(rarity, 10) as Rarity];
        return `${amount} ${rarityName} Essence`;
      })
      .join(', ');

    const message = `Rewards: ${essenceSummary}${stonesAwarded > 0 ? `, ${stonesAwarded} stone(s)` : ''}`;

    return {
      player: updatedPlayer,
      essenceAwarded: essenceRewards,
      stonesAwarded,
      message,
    };
  }
}

