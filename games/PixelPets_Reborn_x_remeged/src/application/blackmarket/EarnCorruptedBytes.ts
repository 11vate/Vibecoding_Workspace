/**
 * Earn Corrupted Bytes Use Case
 * Handles acquisition of contraband currency through various methods
 */

import type { IPlayerRepository } from '@/domain/repositories/IPlayerRepository';
import type { IPetRepository } from '@/domain/repositories/IPetRepository';
import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';
import type { Rarity } from '@/shared/types/rarity';
import { brandPetId, brandStoneId } from '@/shared/types/brands';

export type ContrabanMethod =
  | 'pvp_loss'
  | 'pet_deletion'
  | 'daily_quest'
  | 'stone_dismantle'
  | 'battle_drop'
  | 'fusion_glitch';

interface EarnBytesInput {
  playerId: string;
  method: ContrabanMethod;
  metadata?: {
    petRarity?: Rarity;
    stoneTier?: number;
    pvpTrophiesLost?: number;
    battleVictory?: boolean;
    dungeonCompleted?: boolean;
  };
}

interface EarnBytesOutput {
  bytesEarned: number;
  newBalance: number;
  method: ContrabanMethod;
  message: string;
}

export class EarnCorruptedBytes {
  constructor(
    private playerRepository: IPlayerRepository,
    private petRepository?: IPetRepository,
    private stoneRepository?: IStoneRepository
  ) {}

  /**
   * Execute contraband bytes earning
   */
  async execute(input: EarnBytesInput): Promise<EarnBytesOutput> {
    const player = await this.playerRepository.findById(input.playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const bytesEarned = this.calculateBytesEarned(input.method, input.metadata);
    const newBalance = player.corruptedBytes + bytesEarned;

    // Update player balance
    const updatedPlayer = player.withCurrencies(player.dataKeys, newBalance);
    await this.playerRepository.save(updatedPlayer);

    return {
      bytesEarned,
      newBalance,
      method: input.method,
      message: this.getEarnMessage(input.method, bytesEarned)
    };
  }

  /**
   * Calculate bytes earned based on method
   */
  private calculateBytesEarned(
    method: ContrabanMethod,
    metadata?: EarnBytesInput['metadata']
  ): number {
    switch (method) {
      case 'pvp_loss':
        return this.calculatePvPLossBytes(metadata?.pvpTrophiesLost || 0);

      case 'pet_deletion':
        return this.calculatePetDeletionBytes(metadata?.petRarity || 1);

      case 'daily_quest':
        return this.calculateDailyQuestBytes(metadata?.dungeonCompleted || false);

      case 'stone_dismantle':
        return this.calculateStoneDismantleBytes(metadata?.stoneTier || 1);

      case 'battle_drop':
        return this.calculateBattleDropBytes(metadata?.battleVictory || false);

      case 'fusion_glitch':
        return this.calculateFusionGlitchBytes();

      default:
        return 0;
    }
  }

  /**
   * PvP Loss consolation prize
   * Range: 10-30 bytes (scaled by trophies lost)
   */
  private calculatePvPLossBytes(trophiesLost: number): number {
    const basePrize = 10;
    const trophyBonus = Math.min(trophiesLost * 0.5, 20); // Max +20 from trophies
    return Math.round(basePrize + trophyBonus);
  }

  /**
   * Pet Deletion bytes
   * Range: 50 (common) to 500 (mythic)
   */
  private calculatePetDeletionBytes(rarity: Rarity): number {
    // Base bytes based on rarity
    const rarityBytes: Record<string, number> = {
      Basic: 10,
      Common: 20,
      Uncommon: 50,
      Rare: 100,
      SR: 250,
      Legendary: 500,
      Mythic: 1000,
      Glitched: 2000,
    };

    return rarityBytes[rarity] || 50;
  }

  /**
   * Daily Black Market Quest bytes
   * Range: 100-300 bytes (based on quest completion)
   */
  private calculateDailyQuestBytes(completed: boolean): number {
    if (!completed) return 0;

    // Base reward
    const baseReward = 100;

    // Bonus for difficulty (randomized for variety)
    const difficultyBonus = Math.floor(Math.random() * 200);

    return baseReward + difficultyBonus;
  }

  /**
   * Stone Dismantling bytes
   * Range: 20-80 bytes (scaled by tier)
   */
  private calculateStoneDismantleBytes(tier: number): number {
    const baseBytes = 20;
    const tierBonus = tier * 15; // +15 per tier
    return baseBytes + tierBonus;
  }

  /**
   * Battle Drop bytes (random)
   * 5% chance, range: 5-15 bytes
   */
  private calculateBattleDropBytes(victory: boolean): number {
    if (!victory) return 0;

    // 5% chance to earn bytes
    if (Math.random() > 0.05) return 0;

    // Random amount between 5-15
    return 5 + Math.floor(Math.random() * 11);
  }

  /**
   * Fusion Glitch bytes (rare bonus)
   * Range: 30-80 bytes
   */
  private calculateFusionGlitchBytes(): number {
    return 30 + Math.floor(Math.random() * 51);
  }

  /**
   * Get message for earnings
   */
  private getEarnMessage(method: ContrabanMethod, bytes: number): string {
    const messages: Record<ContrabanMethod, string> = {
      pvp_loss: `Consolation data recovered from the battlefield: ${bytes} corrupted bytes`,
      pet_deletion: `Pet essence converted to corrupted bytes: ${bytes}`,
      daily_quest: `Black market quest completed! Earned ${bytes} corrupted bytes`,
      stone_dismantle: `Stone dismantled into raw data: ${bytes} corrupted bytes`,
      battle_drop: bytes > 0
        ? `Corrupted data dropped: ${bytes} bytes`
        : 'No corrupted data found',
      fusion_glitch: `Fusion anomaly detected! Recovered ${bytes} corrupted bytes`
    };

    return messages[method] || `Earned ${bytes} corrupted bytes`;
  }

  /**
   * Delete pet and earn bytes (irreversible action)
   */
  async deletePetForBytes(playerId: string, petId: string): Promise<EarnBytesOutput> {
    if (!this.petRepository) {
      throw new Error('Pet repository not initialized');
    }

    const pet = await this.petRepository.findById(brandPetId(petId));
    if (!pet) {
      throw new Error('Pet not found');
    }

    // Calculate bytes
    const bytesEarned = this.calculatePetDeletionBytes(pet.rarity);

    // Delete pet (irreversible!)
    await this.petRepository.delete(brandPetId(petId));

    // Award bytes
    const result = await this.execute({
      playerId,
      method: 'pet_deletion',
      metadata: { petRarity: pet.rarity }
    });

    return {
      ...result,
      message: `${pet.name} was converted to ${bytesEarned} corrupted bytes. This action cannot be undone.`
    };
  }

  /**
   * Dismantle stone and earn bytes
   */
  async dismantleStoneForBytes(playerId: string, stoneId: string): Promise<EarnBytesOutput> {
    if (!this.stoneRepository) {
      throw new Error('Stone repository not initialized');
    }

    const stone = await this.stoneRepository.findById(brandStoneId(stoneId));
    if (!stone) {
      throw new Error('Stone not found');
    }

    // Only glitched stones can be dismantled for bytes
    if (!stone.isGlitched) {
      throw new Error('Only glitched stones can be dismantled for corrupted bytes');
    }

    // Delete stone
    await this.stoneRepository.delete(brandStoneId(stoneId));

    // Award bytes
    const result = await this.execute({
      playerId,
      method: 'stone_dismantle',
      metadata: { stoneTier: stone.tier }
    });

    return {
      ...result,
      message: `Glitched ${stone.type} stone dismantled for ${result.bytesEarned} corrupted bytes`
    };
  }
}
