/**
 * Acquire Stone Use Case
 * Acquires a stone and adds it to the player's collection
 */

import type { IStoneRepository } from '@/domain/repositories/IStoneRepository';
import { StoneGenerator } from '@/domain/services/StoneGenerator';
import type { Stone, StoneType, StoneTier } from '@/domain/entities/Stone';

export interface AcquireStoneInput {
  playerId: string;
  type: StoneType;
  tier: StoneTier;
  isGlitched?: boolean;
}

export interface AcquireStoneOutput {
  stone: Stone;
  message: string;
}

/**
 * Acquire Stone Use Case
 */
export class AcquireStone {
  constructor(private stoneRepository: IStoneRepository) {}

  /**
   * Acquire a stone with specified type and tier
   */
  async execute(input: AcquireStoneInput): Promise<AcquireStoneOutput> {
    // Generate the stone
    const stone = StoneGenerator.generateStone(
      input.type,
      input.tier,
      undefined,
      input.isGlitched || false
    );

    // Save to repository
    await this.stoneRepository.save(stone);

    return {
      stone,
      message: `Acquired ${stone.type} Stone (Tier ${stone.tier})${stone.isGlitched ? ' [GLITCHED]' : ''}!`,
    };
  }

  /**
   * Acquire a random stone of specified tier
   */
  async acquireRandom(input: { playerId: string; tier: StoneTier; allowGlitched?: boolean }): Promise<AcquireStoneOutput> {
    const stone = StoneGenerator.generateRandomStone(input.tier, input.allowGlitched || false);

    await this.stoneRepository.save(stone);

    return {
      stone,
      message: `Acquired ${stone.type} Stone (Tier ${stone.tier})${stone.isGlitched ? ' [GLITCHED]' : ''}!`,
    };
  }
}















