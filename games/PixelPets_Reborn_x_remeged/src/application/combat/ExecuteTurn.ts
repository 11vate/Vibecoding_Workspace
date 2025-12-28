/**
 * Execute Turn Use Case
 * Executes a single turn in a battle
 */

import { Battle } from '@/domain/entities/Battle';
import { CombatEngine } from '@/domain/services/CombatEngine';
import { createSeededRng, randomSeed } from '@/shared/utils/deterministic-rng';
import type { IBattleRepository } from '@/domain/repositories/IBattleRepository';

export interface ExecuteTurnInput {
  battleId: string;
}

export interface ExecuteTurnOutput {
  battle: Battle;
  turnCompleted: boolean;
}

/**
 * Execute Turn Use Case
 */
export class ExecuteTurn {
  constructor(private battleRepository: IBattleRepository) {}

  async execute(input: ExecuteTurnInput): Promise<ExecuteTurnOutput> {
    // Fetch battle
    const battle = await this.battleRepository.findById(input.battleId as any);

    if (!battle) {
      throw new Error(`Battle not found: ${input.battleId}`);
    }

    if (battle.isComplete) {
      return {
        battle,
        turnCompleted: false,
      };
    }

    // Create a deterministic seed for this turn (captured for replay)
    const seed = randomSeed();
    const rng = createSeededRng(seed);
    // Wire RNG into CombatEngine for deterministic randomness during this execution
    CombatEngine.setRng(() => rng.next());

    // Execute turn using CombatEngine (deterministic when RNG is set)
    const updatedBattle = CombatEngine.executeTurn(battle);

    // Save updated battle state and persist the seed for replay
    await this.battleRepository.save(updatedBattle, { seed });

    // Clear RNG provider to avoid leaking deterministic behavior elsewhere
    CombatEngine.clearRng();

    return {
      battle: updatedBattle,
      turnCompleted: true,
    };
  }
}


















