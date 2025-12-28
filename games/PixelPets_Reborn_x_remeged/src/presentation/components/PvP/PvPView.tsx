/**
 * PvP View Component
 * Main PvP interface with matchmaking and ranking display
 */

import { useEffect, useState } from 'react';
import { usePvPStore } from '@/presentation/stores/pvpStore';
import { usePlayerStore } from '@/presentation/stores/playerStore';
import { usePetStore } from '@/presentation/stores/petStore';
import type { Pet } from '@/domain/entities/Pet';
import type { PetId } from '@/shared/types/brands';
import { DIVISION_INFO } from '@/domain/entities/PvPRanking';
import { LeaderboardView } from './LeaderboardView';
import { AsyncBattleView } from './AsyncBattleView';

export function PvPView() {
  const {
    currentMatch,
    playerRanking,
    isLoading,
    error,
    loadPlayerRanking,
    findMatch,
    clearError
  } = usePvPStore();

  const { player } = usePlayerStore();
  const { pets } = usePetStore();

  const [selectedTeam, setSelectedTeam] = useState<Pet[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Load player ranking on mount
  useEffect(() => {
    if (player) {
      loadPlayerRanking(player.id);
    }
  }, [player, loadPlayerRanking]);

  // Handle team selection
  const handlePetSelect = (pet: Pet) => {
    if (selectedTeam.includes(pet)) {
      setSelectedTeam(selectedTeam.filter(p => p.id !== pet.id));
    } else if (selectedTeam.length < 4) {
      setSelectedTeam([...selectedTeam, pet]);
    }
  };

  // Handle find match
  const handleFindMatch = async () => {
    if (!player || selectedTeam.length === 0) return;

    const teamIds = selectedTeam.map(p => p.id as PetId);
    await findMatch(player.id, teamIds);
  };

  // If there's an active match, show battle view
  if (currentMatch) {
    return <AsyncBattleView match={currentMatch} />;
  }

  // If showing leaderboard
  if (showLeaderboard) {
    return (
      <div className="pvp-container">
        <button
          onClick={() => setShowLeaderboard(false)}
          className="back-button"
        >
          ← Back to PvP
        </button>
        <LeaderboardView />
      </div>
    );
  }

  // Main PvP view
  return (
    <div className="pvp-container">
      <div className="pvp-header">
        <h1>Player vs Player</h1>
        {error && (
          <div className="error-message">
            {error}
            <button onClick={clearError}>×</button>
          </div>
        )}
      </div>

      {/* Player Ranking Card */}
      {playerRanking && (
        <div className="ranking-card">
          <div className="ranking-header">
            <h2>Your Ranking</h2>
            <div className="division-badge" style={{ color: DIVISION_INFO[playerRanking.division].color }}>
              {DIVISION_INFO[playerRanking.division].icon} {playerRanking.division}
            </div>
          </div>

          <div className="ranking-stats">
            <div className="stat">
              <span className="stat-label">Trophies</span>
              <span className="stat-value">{playerRanking.trophies}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Win Rate</span>
              <span className="stat-value">
                {(playerRanking.getWinRate() * 100).toFixed(1)}%
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Wins</span>
              <span className="stat-value">{playerRanking.wins}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Losses</span>
              <span className="stat-value">{playerRanking.losses}</span>
            </div>
            {playerRanking.winStreak > 0 && (
              <div className="stat win-streak">
                <span className="stat-label">Win Streak</span>
                <span className="stat-value">🔥 {playerRanking.winStreak}</span>
              </div>
            )}
          </div>

          {playerRanking.getTrophiesUntilNextDivision() !== null && (
            <div className="next-division">
              <span>
                {playerRanking.getTrophiesUntilNextDivision()} trophies until next division
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(playerRanking.trophies / (DIVISION_INFO[playerRanking.division].max + 1)) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Team Selection */}
      <div className="team-selection">
        <h2>Select Your Team (1-4 pets)</h2>
        <div className="selected-team">
          {selectedTeam.map(pet => (
            <div key={pet.id as string} className="selected-pet" onClick={() => handlePetSelect(pet)}>
              <span className="pet-name">{pet.name}</span>
              <span className="remove-btn">×</span>
            </div>
          ))}
          {Array.from({ length: 4 - selectedTeam.length }).map((_, i) => (
            <div key={`empty-${i}`} className="empty-slot">
              <span>+</span>
            </div>
          ))}
        </div>

        <div className="pet-grid">
          {pets.map(pet => (
            <div
              key={pet.id as string}
              className={`pet-card ${selectedTeam.includes(pet) ? 'selected' : ''}`}
              onClick={() => handlePetSelect(pet)}
            >
              <div className="pet-avatar">
                {/* Sprite would be rendered here */}
                <span>{pet.name[0]}</span>
              </div>
              <div className="pet-info">
                <div className="pet-name">{pet.name}</div>
                <div className="pet-stats">
                  HP: {pet.stats.maxHp} | ATK: {pet.stats.attack}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pvp-actions">
        <button
          className="find-match-button"
          onClick={handleFindMatch}
          disabled={selectedTeam.length === 0 || isLoading}
        >
          {isLoading ? 'Finding Match...' : 'Find Match'}
        </button>

        <button
          className="leaderboard-button"
          onClick={() => setShowLeaderboard(true)}
        >
          View Leaderboard
        </button>
      </div>
    </div>
  );
}
