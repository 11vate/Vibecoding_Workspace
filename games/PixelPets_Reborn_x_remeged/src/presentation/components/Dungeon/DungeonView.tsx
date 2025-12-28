/**
 * Dungeon View Component
 * Displays dungeon floors and allows starting dungeon runs
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../../stores/playerStore';
import { useCombatStore } from '../../stores/combatStore';
import { StartDungeonRun } from '@/application/dungeon/StartDungeonRun';
import { GenerateEncounter } from '@/application/dungeon/GenerateEncounter';
import { InitializeBattle } from '@/application/combat/InitializeBattle';
import { DungeonRepository } from '@/infrastructure/persistence/repositories/DungeonRepository';
import { PlayerRepository } from '@/infrastructure/persistence/repositories/PlayerRepository';
import { PetRepository } from '@/infrastructure/persistence/repositories/PetRepository';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import './DungeonView.css';

export const DungeonView: React.FC = () => {
  const navigate = useNavigate();
  const { player, loadPlayer } = usePlayerStore();
  const { setCurrentBattle, saveBattle, setDungeonRun } = useCombatStore();
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayer();
  }, [loadPlayer]);

  const handleFloorClick = (floorNumber: number) => {
    setSelectedFloor(floorNumber);
    setShowStartModal(true);
  };

  const handleStartDungeon = async () => {
    if (!player || !selectedFloor || !selectedTeamId) return;

    setIsLoading(true);
    setError(null);

    try {
      const startDungeonRun = new StartDungeonRun(
        new DungeonRepository(),
        new PlayerRepository(),
        new PetRepository()
      );

      const result = await startDungeonRun.execute({
        floorNumber: selectedFloor,
        teamId: selectedTeamId,
        playerId: player.id,
      });

      // Store dungeon run state
      setDungeonRun(result.run);

      // Generate first encounter (minion wave or boss)
      const generateEncounter = new GenerateEncounter();
      const encounter = await generateEncounter.execute({
        dungeon: result.run.dungeon,
        waveIndex: result.run.currentWaveIndex,
        playerTeamSize: result.run.playerTeam.length,
      });

      // Initialize battle with player team vs enemy team
      const initializeBattle = new InitializeBattle();
      const battle = await initializeBattle.execute({
        team1: result.run.playerTeam,
        team2: encounter.enemyPets,
      });

      // Save battle and navigate to battle view
      setCurrentBattle(battle);
      await saveBattle(battle);
      setShowStartModal(false);
      navigate('/battle');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start dungeon run';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getFloorTier = (floorNumber: number): number => {
    return Math.floor((floorNumber - 1) / 10) + 1;
  };

  const getTierName = (tier: number): string => {
    const names = ['Basic', 'Rare', 'SR', 'Legendary', 'Mythic'];
    return names[tier - 1] || 'Unknown';
  };

  const isFloorCompleted = (floorNumber: number): boolean => {
    if (!player) return false;
    const dungeonId = `dungeon_floor_${floorNumber}`;
    return player.hasCompletedDungeon(dungeonId);
  };

  const isFloorUnlocked = (floorNumber: number): boolean => {
    if (floorNumber === 1) return true;
    // Floor is unlocked if previous floor is completed
    const previousFloor = floorNumber - 1;
    return isFloorCompleted(previousFloor);
  };

  // Render floors organized by tier (10 floors per tier)
  const renderTier = (tier: number) => {
    const startFloor = (tier - 1) * 10 + 1;
    const endFloor = tier * 10;
    const tierName = getTierName(tier);

    return (
      <div key={tier} className="dungeon-view__tier">
        <h2 className="dungeon-view__tier-title">{tierName} Tier (Floors {startFloor}-{endFloor})</h2>
        <div className="dungeon-view__tier-floors">
          {Array.from({ length: 10 }, (_, i) => {
            const floorNumber = startFloor + i;
            const completed = isFloorCompleted(floorNumber);
            const unlocked = isFloorUnlocked(floorNumber);
            const isBossFloor = floorNumber % 10 === 0;

            return (
              <div
                key={floorNumber}
                className={`dungeon-view__floor ${
                  !unlocked ? 'dungeon-view__floor--locked' : ''
                } ${completed ? 'dungeon-view__floor--completed' : ''} ${
                  isBossFloor ? 'dungeon-view__floor--boss' : ''
                }`}
                onClick={() => unlocked && handleFloorClick(floorNumber)}
              >
                <div className="dungeon-view__floor-number">{floorNumber}</div>
                {isBossFloor && <div className="dungeon-view__floor-boss">BOSS</div>}
                {completed && <div className="dungeon-view__floor-check">✓</div>}
                {!unlocked && <div className="dungeon-view__floor-lock">🔒</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="dungeon-view">
      <div className="dungeon-view__header">
        <h1>Dungeons</h1>
        <p>Challenge dungeons to earn essence and stones</p>
      </div>

      {error && (
        <div className="dungeon-view__error">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Dungeon Tiers */}
      <div className="dungeon-view__tiers">
        {[1, 2, 3, 4, 5].map((tier) => renderTier(tier))}
      </div>

      {/* Start Dungeon Modal */}
      {showStartModal && selectedFloor && player && (
        <Modal
          isOpen={showStartModal}
          onClose={() => {
            setShowStartModal(false);
            setSelectedFloor(null);
            setSelectedTeamId(null);
          }}
          title={`Start Floor ${selectedFloor}`}
        >
          <div className="dungeon-view__start-modal">
            <div className="dungeon-view__floor-info">
              <p>
                <strong>Tier:</strong> {getTierName(getFloorTier(selectedFloor))}
              </p>
              <p>
                <strong>Floor:</strong> {selectedFloor}
              </p>
            </div>

            <div className="dungeon-view__team-selection">
              <label htmlFor="team-select">Select Team:</label>
              <select
                id="team-select"
                value={selectedTeamId || ''}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="dungeon-view__team-select"
              >
                <option value="">-- Select a team --</option>
                {player.teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.petIds.length} pet{team.petIds.length !== 1 ? 's' : ''} - 1-4 allowed)
                  </option>
                ))}
              </select>
              {player.teams.length === 0 && (
                <p className="dungeon-view__no-teams">
                  You need to create a team first. Go to Team Builder to create one.
                </p>
              )}
            </div>

            <div className="dungeon-view__start-actions">
              <Button
                onClick={handleStartDungeon}
                disabled={!selectedTeamId || isLoading}
                variant="primary"
                size="lg"
              >
                {isLoading ? 'Starting...' : 'Start Dungeon Run'}
              </Button>
              <Button
                onClick={() => {
                  setShowStartModal(false);
                  setSelectedFloor(null);
                  setSelectedTeamId(null);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

