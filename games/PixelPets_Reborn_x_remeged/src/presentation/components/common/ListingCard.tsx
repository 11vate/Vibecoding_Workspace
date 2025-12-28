import React, { useState, useEffect } from 'react';
import { BlackMarketListing } from '@/application/summon/BlackMarketService';
import { RARITY_CONFIG } from '@/shared/types/rarity';
import { SpriteGenerator } from '@/infrastructure/sprite/SpriteGenerator';
import { Player } from '@/domain/entities/Player';
import { StoneType } from '@/domain/entities/Stone';

interface ListingCardProps {
  listing: BlackMarketListing;
  player: Player | null;
  onPurchase: (listing: BlackMarketListing) => void;
}

const getStoneColor = (type: StoneType | undefined): string => {
  if (!type) return '#888888';
  switch(type) {
    case StoneType.RUBY: return '#ff4444';
    case StoneType.SAPPHIRE: return '#4444ff';
    case StoneType.EMERALD: return '#44ff44';
    case StoneType.TOPAZ: return '#ffff44';
    case StoneType.AMETHYST: return '#ff44ff';
    case StoneType.PEARL: return '#eeeeee';
    case StoneType.ONYX: return '#444444';
    case StoneType.OPAL: return '#aaffff';
    default: return '#888888';
  }
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing, player, onPurchase }) => {
  const [spriteUrl, setSpriteUrl] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const isStone = listing.type === 'stone';

  useEffect(() => {
    if (!isStone && listing.visualGenome) {
      const generator = new SpriteGenerator();
      generator.generatePreviewSprite(
        listing.family!,
        listing.visualTags!,
        listing.rarity,
        listing.visualGenome
      ).then(setSpriteUrl);
    }
  }, [listing.id, isStone]);

  const stoneColor = isStone ? getStoneColor(listing.stoneType) : '#fff';

  return (
    <div 
      className="black-market__card"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ position: 'relative' }}
    >
      <div className="black-market__card-glitch-overlay" />
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="black-market__tooltip" style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(10, 0, 0, 0.95)',
          border: '1px solid #ff4444',
          padding: '10px',
          borderRadius: '4px',
          width: '220px',
          zIndex: 100,
          marginBottom: '10px',
          pointerEvents: 'none',
          boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)'
        }}>
          <h4 style={{ color: '#ff4444', margin: '0 0 5px 0', fontFamily: 'Courier New' }}>{listing.name}</h4>
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>
            {isStone ? 'ILLEGAL MODIFICATION' : listing.family} • {RARITY_CONFIG[listing.rarity].name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fff' }}>
            {isStone 
              ? `Contains raw ${listing.stoneType} energy. Handle with care.`
              : 'Warning: Genetic code unstable. Contains illegal modifications.'
            }
          </div>
        </div>
      )}

      <div className="black-market__sprite-container" style={{ 
        height: '120px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '10px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '4px'
      }}>
        {isStone ? (
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: stoneColor,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${stoneColor}`,
            border: '2px solid #fff',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '25%',
              width: '20%',
              height: '20%',
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: '50%'
            }} />
          </div>
        ) : spriteUrl ? (
          <img src={spriteUrl} alt={listing.name} style={{ width: '96px', height: '96px', imageRendering: 'pixelated' }} />
        ) : (
          <div style={{ color: '#555' }}>DECODING...</div>
        )}
      </div>

      <div className="black-market__pet-name" style={{ color: RARITY_CONFIG[listing.rarity].color }}>
        {listing.name}
      </div>
      
      <div className="black-market__stats">
        {isStone ? (
          <>
            {listing.stoneStats?.hp ? <div>HP +{listing.stoneStats.hp}</div> : null}
            {listing.stoneStats?.attack ? <div>ATK +{listing.stoneStats.attack}</div> : null}
            {listing.stoneStats?.defense ? <div>DEF +{listing.stoneStats.defense}</div> : null}
            {listing.stoneStats?.speed ? <div>SPD +{listing.stoneStats.speed}</div> : null}
            <div style={{color: stoneColor}}>PWR: {listing.elementalPower}</div>
          </>
        ) : (
          <>
            <div>HP: {listing.stats?.hp} <span className="black-market__stat-boost">^^</span></div>
            <div>ATK: {listing.stats?.attack} <span className="black-market__stat-boost">^^</span></div>
            <div>DEF: {listing.stats?.defense} <span className="black-market__stat-penalty">vv</span></div>
            <div>SPD: {listing.stats?.speed} <span className="black-market__stat-boost">^^</span></div>
          </>
        )}
      </div>

      <div className="black-market__price">
        <span>{listing.price} BYTES</span>
        <button 
          className="black-market__buy-btn"
          onClick={() => onPurchase(listing)}
          disabled={!player || !player.hasEnoughBytes(listing.price)}
        >
          [ACQUIRE]
        </button>
      </div>
    </div>
  );
};
