/**
 * Pet Card Component
 * Reusable component for displaying pet information
 */

import React, { useState, useEffect } from 'react';
import type { Pet } from '@/domain/entities/Pet';
import { RARITY_CONFIG } from '@/shared/types/rarity';
import { SpriteGenerator } from '@/infrastructure/sprite/SpriteGenerator';
import './PetCard.css';

export interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
  selected?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onClick,
  selected = false,
  size = 'medium',
}) => {
  const rarityConfig = RARITY_CONFIG[pet.rarity];
  const sizeClass = `pet-card--${size}`;
  const selectedClass = selected ? 'pet-card--selected' : '';
  const [spriteUrl, setSpriteUrl] = useState<string | null>(null);
  const [isLoadingSprite, setIsLoadingSprite] = useState(true);
  const [spriteError, setSpriteError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Generate sprite on mount
  useEffect(() => {
    let isMounted = true;

    async function loadSprite() {
      try {
        setIsLoadingSprite(true);
        setSpriteError(null);
        const generator = new SpriteGenerator();
        const sprite = await generator.generateSpriteForPet(pet);
        if (isMounted) {
          setSpriteUrl(sprite);
          setIsLoadingSprite(false);
        }
      } catch (error) {
        console.error('Failed to generate sprite:', error);
        if (isMounted) {
          setSpriteError('Sprite generation failed');
          setIsLoadingSprite(false);
        }
      }
    }

    loadSprite();

    return () => {
      isMounted = false;
    };
  }, [pet.id, pet.appearance.visualTags.join(',')]);

  return (
    <div
      className={`pet-card ${sizeClass} ${selectedClass}`}
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
      {/* Tooltip */}
      {showTooltip && (
        <div className="pet-card__tooltip" style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: `1px solid ${rarityConfig.color}`,
          padding: '0.5rem',
          borderRadius: '4px',
          width: '200px',
          zIndex: 100,
          marginBottom: '0.5rem',
          pointerEvents: 'none'
        }}>
          <h4 style={{ color: rarityConfig.color, margin: '0 0 0.25rem 0' }}>{pet.name}</h4>
          <p style={{ fontSize: '0.8rem', margin: 0, color: '#ccc' }}>
            {rarityConfig.name} {pet.family.replace('_', ' ')}
          </p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#aaa' }}>
            <div>HP: {pet.stats.maxHp}</div>
            <div>ATK: {pet.stats.attack}</div>
            <div>DEF: {pet.stats.defense}</div>
            <div>SPD: {pet.stats.speed}</div>
          </div>
          {pet.activeAbilities.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#fff' }}>
              <strong>Abilities:</strong>
              <ul style={{ paddingLeft: '1rem', margin: '0.25rem 0 0 0' }}>
                {pet.activeAbilities.map(a => (
                  <li key={a.id} style={{ marginBottom: '4px' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{a.name}</span>
                    <div style={{ color: '#ccc', fontSize: '0.7rem' }}>{a.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div
        className="pet-card__rarity-bar"
        style={{ backgroundColor: rarityConfig.color }}
      />
      <div className="pet-card__content">
        <div className="pet-card__sprite-container">
          {isLoadingSprite ? (
            <div className="pet-card__sprite-loading">Loading...</div>
          ) : spriteError ? (
            <div className="pet-card__sprite-placeholder">?</div>
          ) : spriteUrl ? (
            <img
              src={spriteUrl}
              alt={pet.name}
              className="pet-card__sprite"
            />
          ) : (
            <div className="pet-card__sprite-placeholder">?</div>
          )}
        </div>
        <div className="pet-card__header">
          <h3 className="pet-card__name">{pet.name}</h3>
          {pet.nickname && (
            <span className="pet-card__nickname">"{pet.nickname}"</span>
          )}
        </div>
        <div className="pet-card__family">{pet.family}</div>
        <div className="pet-card__rarity">{rarityConfig.name}</div>
        <div className="pet-card__stats">
          <div className="pet-card__stat">
            <span className="pet-card__stat-label">HP:</span>
            <span className="pet-card__stat-value">{pet.stats.hp}</span>
          </div>
          <div className="pet-card__stat">
            <span className="pet-card__stat-label">ATK:</span>
            <span className="pet-card__stat-value">{pet.stats.attack}</span>
          </div>
          <div className="pet-card__stat">
            <span className="pet-card__stat-label">DEF:</span>
            <span className="pet-card__stat-value">{pet.stats.defense}</span>
          </div>
          <div className="pet-card__stat">
            <span className="pet-card__stat-label">SPD:</span>
            <span className="pet-card__stat-value">{pet.stats.speed}</span>
          </div>
        </div>
        {pet.isFused() && (
          <div className="pet-card__generation">
            Gen {pet.getGeneration()}
          </div>
        )}
      </div>
    </div>
  );
};










