/**
 * Start Dungeon Run Use Case
 * Initializes a dungeon run with player team
 */

import type { Dungeon } from '@/domain/entities/Dungeon';
import type { Pet } from '@/domain/entities/Pet';
import type { IDungeonRepository } from '@/domain/repositories/IDungeonRepository';
import type { IPlayerRepository } from '@/domain/repositories/IPlayerRepository';
import type { IPetRepository } from '@/domain/repositories/IPetRepository';
import { DungeonRepository } from '@/infrastructure/persistence/repositories/DungeonRepository';
import { PlayerRepository } from '@/infrastructure/persistence/repositories/PlayerRepository';
import { PetRepository } from '@/infrastructure/persistence/repositories/PetRepository';

export interface StartDungeonRunInput {
  floorNumber: number;
  teamId: string;
  playerId: string;
}

export interface DungeonRun {
  dungeon: Dungeon;
  playerTeam: Pet[];
  currentWaveIndex: number;
  isComplete: boolean;
}

export interface StartDungeonRunOutput {
  run: DungeonRun;
  message: string;
}

/**
 * Start Dungeon Run Use Case
 */
export class StartDungeonRun {
  private dungeonRepository: IDungeonRepository;
  private playerRepository: IPlayerRepository;
  private petRepository: IPetRepository;

  constructor(
    dungeonRepository?: IDungeonRepository,
    playerRepository?: IPlayerRepository,
    petRepository?: IPetRepository
  ) {
    this.dungeonRepository = dungeonRepository || new DungeonRepository();
    this.playerRepository = playerRepository || new PlayerRepository();
    this.petRepository = petRepository || new PetRepository();
  }

  async execute(input: StartDungeonRunInput): Promise<StartDungeonRunOutput> {
    const { floorNumber, teamId, playerId } = input;

    // Fetch player
    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Get team
    const team = player.getTeam(teamId);
    if (!team) {
      throw new Error(`Team ${teamId} not found`);
    }

    // Validate team size (1-4 pets allowed)
    if (team.petIds.length < 1 || team.petIds.length > 4) {
      throw new Error('Team must have between 1 and 4 pets');
    }

    // Fetch pets
    const playerTeam: Pet[] = [];
    for (const petId of team.petIds) {
      const pet = await this.petRepository.findById(petId as any);
      if (!pet) {
        throw new Error(`Pet ${petId} not found`);
      }
      playerTeam.push(pet);
    }

    // Get player's highest rarity pet for boss scaling
    const highestRarity = this.getHighestRarity(playerTeam);

    // Generate or fetch dungeon
    const dungeon = await (this.dungeonRepository as any).generateOrFetchDungeon(
      floorNumber,
      highestRarity
    );

    const run: DungeonRun = {
      dungeon,
      playerTeam,
      currentWaveIndex: 0,
      isComplete: false,
    };

    return {
      run,
      message: `Started dungeon floor ${floorNumber}`,
    };
  }

  /**
   * Get highest rarity from player team
   */
  private getHighestRarity(pets: Pet[]): number {
    if (pets.length === 0) return 0;
    return Math.max(...pets.map((p) => p.rarity));
  }
}

