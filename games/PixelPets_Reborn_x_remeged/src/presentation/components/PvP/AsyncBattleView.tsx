/**
 * Async Battle View Component
 * Displays async PvP battle results and match details
 */

import { useState } from 'react';
import type { PvPMatch } from '@/domain/entities/PvPMatch';
import { usePvPStore } from '@/presentation/stores/pvpStore';
import { usePetStore } from '@/presentation/stores/petStore';
import { usePlayerStore } from '@/presentation/stores/playerStore';

interface AsyncBattleViewProps {
  match: PvPMatch;
}

export function AsyncBattleView({ match }: AsyncBattleViewProps) {
  const { completeMatch, playerRanking } = usePvPStore();
  const { getPetById } = usePetStore();
  const { player } = usePlayerStore();

  const [battleComplete, setBattleComplete] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);

  const isPlayer1 = player?.id === match.player1Id;
  const opponentId = isPlayer1 ? match.player2Id : match.player1Id;
  const playerTeam = isPlayer1 ? match.player1Team : match.player2Team;
  const opponentTeam = isPlayer1 ? match.player2Team : match.player1Team;

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = Date.now();
    const remaining = match.expiresAt - now;

    if (remaining <= 0) return 'Expired';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  // Simulate battle (in real implementation, would use CombatEngine)
  const handleSimulateBattle = () => {
    // For now, randomly determine winner
    // In production: actually run battle simulation using CombatEngine
    const playerWins = Math.random() > 0.5;
    const winner = playerWins ? player!.id : opponentId;

    setWinnerId(winner);
    setBattleComplete(true);
  };

  // Complete match
  const handleCompleteMatch = async () => {
    if (!winnerId) return;

    await completeMatch(match.id as string, winnerId);
  };

  return (
    <div className="async-battle-container">
      <div className="battle-header">
        <h1>PvP Battle</h1>
        <div className="match-status">
          {match.status === 'pending' && (
            <span className="status-badge pending">Waiting for Battle</span>
          )}
          {match.status === 'in_progress' && (
            <span className="status-badge in-progress">In Progress</span>
          )}
          {match.status === 'completed' && (
            <span className="status-badge completed">Completed</span>
          )}
        </div>
        <div className="time-remaining">{getTimeRemaining()}</div>
      </div>

      {/* Teams Display */}
      <div className="battle-teams">
        {/* Player's Team */}
        <div className="team player-team">
          <div className="team-header">
            <h2>Your Team</h2>
            {playerRanking && (
              <div className="team-trophies">{playerRanking.trophies} 🏆</div>
            )}
          </div>
          <div className="team-pets">
            {playerTeam.map(petId => {
              const pet = getPetById(petId);
              if (!pet) return null;

              return (
                <div key={petId as string} className="battle-pet">
                  <div className="pet-sprite">
                    {/* Sprite would be rendered here */}
                    <span>{pet.name[0]}</span>
                  </div>
                  <div className="pet-name">{pet.name}</div>
                  <div className="pet-stats">
                    <div className="stat">
                      <span className="stat-label">HP</span>
                      <span className="stat-value">{pet.stats.maxHp}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">ATK</span>
                      <span className="stat-value">{pet.stats.attack}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">DEF</span>
                      <span className="stat-value">{pet.stats.defense}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">SPD</span>
                      <span className="stat-value">{pet.stats.speed}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VS Divider */}
        <div className="vs-divider">
          <span className="vs-text">VS</span>
        </div>

        {/* Opponent's Team */}
        <div className="team opponent-team">
          <div className="team-header">
            <h2>Opponent</h2>
            <div className="team-trophies">??? 🏆</div>
          </div>
          <div className="team-pets">
            {opponentTeam.map((petId, index) => (
              <div key={petId as string} className="battle-pet opponent-pet">
                <div className="pet-sprite">
                  <span>?</span>
                </div>
                <div className="pet-name">Pet #{index + 1}</div>
                <div className="pet-stats">
                  <div className="stat">
                    <span className="stat-label">HP</span>
                    <span className="stat-value">???</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">ATK</span>
                    <span className="stat-value">???</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Battle Controls */}
      {!battleComplete && match.status !== 'completed' && (
        <div className="battle-controls">
          <button
            className="simulate-battle-button"
            onClick={handleSimulateBattle}
          >
            Start Battle
          </button>
          <p className="battle-hint">
            This is an async match. The battle will be simulated using both teams.
          </p>
        </div>
      )}

      {/* Battle Results */}
      {battleComplete && (
        <div className="battle-results">
          <div className={`result-banner ${winnerId === player?.id ? 'victory' : 'defeat'}`}>
            <h2>{winnerId === player?.id ? '🎉 Victory!' : '💔 Defeat'}</h2>
          </div>

          <div className="rewards-preview">
            <h3>Expected Rewards</h3>
            <div className="reward-grid">
              <div className="reward-item">
                <span className="reward-icon">🔑</span>
                <span className="reward-label">Data Keys</span>
                <span className="reward-value">+{winnerId === player?.id ? '150' : '30'}</span>
              </div>
              <div className="reward-item">
                <span className="reward-icon">🏆</span>
                <span className="reward-label">Trophies</span>
                <span className="reward-value">{winnerId === player?.id ? '+25' : '-15'}</span>
              </div>
              <div className="reward-item">
                <span className="reward-icon">💾</span>
                <span className="reward-label">Contraband</span>
                <span className="reward-value">+{winnerId === player?.id ? '50' : '10'}</span>
              </div>
            </div>
          </div>

          <button
            className="claim-rewards-button"
            onClick={handleCompleteMatch}
          >
            Claim Rewards
          </button>
        </div>
      )}

      {/* Match Info */}
      <div className="match-info">
        <div className="info-item">
          <span className="info-label">Match Type</span>
          <span className="info-value">Async Battle</span>
        </div>
        <div className="info-item">
          <span className="info-label">Created</span>
          <span className="info-value">
            {new Date(match.createdAt).toLocaleString()}
          </span>
        </div>
        {match.isExpired() && (
          <div className="info-item expired">
            <span className="info-label">Status</span>
            <span className="info-value">⚠️ Expired</span>
          </div>
        )}
      </div>
    </div>
  );
}
