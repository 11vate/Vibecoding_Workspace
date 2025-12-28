/**
 * Leaderboard View Component
 * Displays global PvP rankings
 */

import { useEffect } from 'react';
import { usePvPStore } from '@/presentation/stores/pvpStore';
import { DIVISION_INFO } from '@/domain/entities/PvPRanking';

export function LeaderboardView() {
  const { leaderboard, playerRanking, isLoading, loadLeaderboard } = usePvPStore();

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  if (isLoading) {
    return (
      <div className="leaderboard-container">
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Global Leaderboard</h1>
        <p>Top 100 Players</p>
      </div>

      {/* Player's current rank (if not in top 100) */}
      {playerRanking && !leaderboard.find(r => r.playerId === playerRanking.playerId) && (
        <div className="your-rank-card">
          <div className="rank-label">Your Rank</div>
          <div className="rank-info">
            <span className="rank-position">#{leaderboard.length + 1}+</span>
            <span className="rank-trophies">{playerRanking.trophies} 🏆</span>
            <span className="rank-division" style={{ color: DIVISION_INFO[playerRanking.division].color }}>
              {DIVISION_INFO[playerRanking.division].icon} {playerRanking.division}
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="leaderboard-table">
        <div className="table-header">
          <div className="col-rank">Rank</div>
          <div className="col-player">Player</div>
          <div className="col-division">Division</div>
          <div className="col-trophies">Trophies</div>
          <div className="col-record">Record</div>
          <div className="col-winrate">Win Rate</div>
        </div>

        <div className="table-body">
          {leaderboard.map((ranking, index) => {
            const isPlayer = playerRanking?.playerId === ranking.playerId;
            const divisionInfo = DIVISION_INFO[ranking.division];

            return (
              <div
                key={ranking.playerId}
                className={`table-row ${isPlayer ? 'is-player' : ''} ${index < 3 ? 'top-three' : ''}`}
              >
                <div className="col-rank">
                  <span className={`rank-badge rank-${index + 1}`}>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </span>
                </div>

                <div className="col-player">
                  <span className="player-name">
                    {isPlayer ? 'You' : `Player ${ranking.playerId.slice(0, 8)}`}
                  </span>
                  {ranking.winStreak >= 5 && (
                    <span className="streak-badge">
                      🔥 {ranking.winStreak}
                    </span>
                  )}
                </div>

                <div className="col-division">
                  <span className="division-badge" style={{ color: divisionInfo.color }}>
                    {divisionInfo.icon} {ranking.division}
                  </span>
                </div>

                <div className="col-trophies">
                  <span className="trophy-count">{ranking.trophies}</span>
                  <span className="trophy-icon">🏆</span>
                </div>

                <div className="col-record">
                  <span className="wins">{ranking.wins}W</span>
                  <span className="separator">-</span>
                  <span className="losses">{ranking.losses}L</span>
                  {ranking.draws > 0 && (
                    <>
                      <span className="separator">-</span>
                      <span className="draws">{ranking.draws}D</span>
                    </>
                  )}
                </div>

                <div className="col-winrate">
                  <span className={`winrate ${ranking.getWinRate() >= 0.6 ? 'high' : ranking.getWinRate() >= 0.4 ? 'medium' : 'low'}`}>
                    {(ranking.getWinRate() * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="empty-state">
            <p>No players on the leaderboard yet.</p>
            <p>Be the first to compete in PvP!</p>
          </div>
        )}
      </div>

      {/* Division Breakdown */}
      <div className="division-breakdown">
        <h2>Divisions</h2>
        <div className="division-grid">
          {Object.entries(DIVISION_INFO).map(([division, info]) => {
            const playersInDivision = leaderboard.filter(r => r.division === division).length;

            return (
              <div key={division} className="division-card">
                <div className="division-icon" style={{ color: info.color }}>
                  {info.icon}
                </div>
                <div className="division-name">{division}</div>
                <div className="division-range">
                  {info.min === 0 ? '0' : info.min.toLocaleString()}-
                  {info.max === Infinity ? '∞' : info.max.toLocaleString()}
                </div>
                <div className="division-players">
                  {playersInDivision} player{playersInDivision !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
