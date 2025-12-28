/**
 * Player Store (Zustand)
 * Manages player data and progression with repository integration
 */

import { create } from 'zustand';
import type { Player } from '@/domain/entities/Player';
import type { Team } from '@/domain/entities/Player';
import type { Rarity } from '@/shared/types/rarity';
import type { IPlayerRepository } from '@/domain/repositories/IPlayerRepository';
import { PlayerRepository } from '@/infrastructure/persistence/repositories/PlayerRepository';

interface PlayerStore {
  player: Player | null;
  isLoading: boolean;
  error: string | null;

  // Repository instance
  repository: IPlayerRepository;

  // Synchronous actions
  setPlayer: (player: Player | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Async repository actions
  loadPlayer: (playerId?: string) => Promise<Player | null>;
  updatePlayer: (player: Player) => Promise<void>;
  addEssence: (rarity: Rarity, amount: number) => Promise<void>;
  removeEssence: (rarity: Rarity, amount: number) => Promise<void>;
  updateTeam: (team: Team) => Promise<void>;
  addTeam: (team: Team) => Promise<void>;
  removeTeam: (teamId: string) => Promise<void>;
  completeDungeon: (dungeonId: string) => Promise<void>;
}

const DEFAULT_PLAYER_ID = 'player_1';

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  player: null,
  isLoading: false,
  error: null,
  repository: new PlayerRepository(),

  setPlayer: (player) => set({ player }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  loadPlayer: async (playerId?: string) => {
    const { repository, setLoading, setError, setPlayer } = get();
    const id = playerId || DEFAULT_PLAYER_ID;
    setLoading(true);
    setError(null);
    try {
      let player = await repository.findById(id);
      if (!player) {
        // Create default player if doesn't exist
        player = await repository.createDefaultPlayer();
      }
      setPlayer(player);
      return player;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load player';
      setError(errorMessage);
      console.error('Error loading player:', error);
      return null;
    } finally {
      setLoading(false);
    }
  },

  updatePlayer: async (player: Player) => {
    const { repository, setLoading, setError, setPlayer } = get();
    setLoading(true);
    setError(null);
    try {
      await repository.save(player);
      setPlayer(player);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update player';
      setError(errorMessage);
      console.error('Error updating player:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  addEssence: async (rarity: Rarity, amount: number) => {
    const { player, updatePlayer } = get();
    if (!player) {
      throw new Error('Player not loaded');
    }
    const newEssence = { ...player.essence };
    newEssence[rarity] = (newEssence[rarity] || 0) + amount;
    const updatedPlayer = player.withEssence(newEssence);
    await updatePlayer(updatedPlayer);
  },

  removeEssence: async (rarity: Rarity, amount: number) => {
    const { player, updatePlayer } = get();
    if (!player) {
      throw new Error('Player not loaded');
    }
    const currentAmount = player.getEssence(rarity);
    if (currentAmount < amount) {
      throw new Error(`Insufficient essence: have ${currentAmount}, need ${amount}`);
    }
    const newEssence = { ...player.essence };
    newEssence[rarity] = currentAmount - amount;
    const updatedPlayer = player.withEssence(newEssence);
    await updatePlayer(updatedPlayer);
  },

  updateTeam: async (team: Team) => {
    const { player, updatePlayer } = get();
    if (!player) {
      throw new Error('Player not loaded');
    }
    const teams = player.teams.map((t) => (t.id === team.id ? team : t));
    const updatedPlayer = player.withTeams(teams);
    await updatePlayer(updatedPlayer);
  },

  addTeam: async (team: Team) => {
    const { player, updatePlayer } = get();
    if (!player) {
      throw new Error('Player not loaded');
    }
    const teams = [...player.teams, team];
    const updatedPlayer = player.withTeams(teams);
    await updatePlayer(updatedPlayer);
  },

  removeTeam: async (teamId: string) => {
    const { player, updatePlayer } = get();
    if (!player) {
      throw new Error('Player not loaded');
    }
    const teams = player.teams.filter((t) => t.id !== teamId);
    const updatedPlayer = player.withTeams(teams);
    await updatePlayer(updatedPlayer);
  },

  completeDungeon: async (dungeonId: string) => {
    const { player, updatePlayer } = get();
    if (!player) {
      throw new Error('Player not loaded');
    }
    const updatedPlayer = player.withCompletedDungeon(dungeonId);
    await updatePlayer(updatedPlayer);
  },
}));
