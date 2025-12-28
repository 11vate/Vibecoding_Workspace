/**
 * Stone Card Component
 * Reusable component for displaying stone information
 */

import React from 'react';
import type { Stone } from '@/domain/entities/Stone';
import { StoneType, StoneTier } from '@/domain/entities/Stone';
import './StoneCard.css';

export interface StoneCardProps {
  stone: Stone;
  onClick?: () => void;
  selected?: boolean;
}

export const StoneCard: React.FC<StoneCardProps> = ({
  stone,
  onClick,
  selected = false,
}) => {
  const selectedClass = selected ? 'stone-card--selected' : '';

  const tierNames: Record<StoneTier, string> = {
    [StoneTier.I]: 'I',
    [StoneTier.II]: 'II',
    [StoneTier.III]: 'III',
    [StoneTier.IV]: 'IV',
    [StoneTier.V]: 'V',
  };

  const typeColors: Record<StoneType, string> = {
    [StoneType.RUBY]: '#FF4444',
    [StoneType.SAPPHIRE]: '#4444FF',
    [StoneType.EMERALD]: '#44FF44',
    [StoneType.TOPAZ]: '#FFAA44',
    [StoneType.AMETHYST]: '#AA44FF',
    [StoneType.PEARL]: '#FFFFFF',
    [StoneType.ONYX]: '#000000',
    [StoneType.OPAL]: '#FF00FF',
  };

  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div
      className={`stone-card ${selectedClass}`}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      style={{ position: 'relative' }}
    >
      {showTooltip && (
        <div className="stone-card__tooltip" style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          border: `1px solid ${typeColors[stone.type]}`,
          padding: '0.75rem',
          borderRadius: '4px',
          width: '220px',
          zIndex: 100,
          marginBottom: '0.5rem',
          pointerEvents: 'none',
          color: '#fff',
          fontSize: '0.8rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          <h4 style={{ color: typeColors[stone.type], margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>
            {stone.type} Stone {tierNames[stone.tier]}
          </h4>
          {stone.isGlitched && (
            <div style={{ color: '#ff00ff', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              ⚠️ GLITCHED ESSENCE
            </div>
          )}
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Stat Bonuses:</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
              {(stone.statBonuses.hp ?? 0) > 0 && <span>HP: +{stone.statBonuses.hp}</span>}
              {(stone.statBonuses.attack ?? 0) > 0 && <span>ATK: +{stone.statBonuses.attack}</span>}
              {(stone.statBonuses.defense ?? 0) > 0 && <span>DEF: +{stone.statBonuses.defense}</span>}
              {(stone.statBonuses.speed ?? 0) > 0 && <span>SPD: +{stone.statBonuses.speed}</span>}
            </div>
          </div>
          <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#aaa', fontSize: '0.7rem' }}>
            Fuses with pets to enhance their genetic potential.
          </div>
        </div>
      )}
      <div
        className="stone-card__type-bar"
        style={{ backgroundColor: typeColors[stone.type] }}
      />
      <div className="stone-card__content">
        <div className="stone-card__header">
          <h3 className="stone-card__type">{stone.type}</h3>
          <div className="stone-card__tier">Tier {tierNames[stone.tier]}</div>
        </div>
        {stone.isGlitched && (
          <div className="stone-card__glitched">GLITCHED</div>
        )}
        <div className="stone-card__stats">
          <div className="stone-card__stat">
            <span className="stone-card__stat-label">HP:</span>
            <span className="stone-card__stat-value">
              {(stone.statBonuses.hp ?? 0) > 0 ? '+' : ''}
              {stone.statBonuses.hp ?? 0}
            </span>
          </div>
          <div className="stone-card__stat">
            <span className="stone-card__stat-label">ATK:</span>
            <span className="stone-card__stat-value">
              {(stone.statBonuses.attack ?? 0) > 0 ? '+' : ''}
              {stone.statBonuses.attack ?? 0}
            </span>
          </div>
          <div className="stone-card__stat">
            <span className="stone-card__stat-label">DEF:</span>
            <span className="stone-card__stat-value">
              {(stone.statBonuses.defense ?? 0) > 0 ? '+' : ''}
              {stone.statBonuses.defense ?? 0}
            </span>
          </div>
          <div className="stone-card__stat">
            <span className="stone-card__stat-label">SPD:</span>
            <span className="stone-card__stat-value">
              {(stone.statBonuses.speed ?? 0) > 0 ? '+' : ''}
              {stone.statBonuses.speed ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};









