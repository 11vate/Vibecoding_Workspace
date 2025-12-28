import React, { useState } from 'react';
import { GachaSummonService } from '@/application/summon/GachaSummonService';
import { Button } from '../common/Button';
import { PetCard } from '../common/PetCard';
import { Pet } from '@/domain/entities/Pet';
import { usePlayerStore } from '../../stores/playerStore';
import './CoreUplinkView.css';

interface CoreUplinkViewProps {
  service: GachaSummonService;
  onSummonComplete: () => void;
}

export const CoreUplinkView: React.FC<CoreUplinkViewProps> = ({ service, onSummonComplete }) => {
  const { player } = usePlayerStore();
  const [isSummoning, setIsSummoning] = useState(false);
  const [lastSummonedPets, setLastSummonedPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSummon = async (count: number) => {
    if (!player) return;
    
    setIsSummoning(true);
    setError(null);
    setLastSummonedPets([]);
    setShowResult(false);

    try {
      // Animation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let pets: Pet[] = [];
      if (count === 1) {
        const pet = await service.summon(player.id);
        pets = [pet];
      } else {
        pets = await service.summonBatch(player.id, count);
      }
      
      setLastSummonedPets(pets);
      setShowResult(true);
      onSummonComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Summoning failed');
    } finally {
      setIsSummoning(false);
    }
  };

  const closeResult = () => {
    setShowResult(false);
    setLastSummonedPets([]);
  };

  return (
    <div className="core-uplink">
      <div className="core-uplink__header">
        <h2 className="core-uplink__title">CORE UPLINK</h2>
        <p className="core-uplink__subtitle">Initialize connection to the Pet Network</p>
      </div>

      <div className="core-uplink__currency">
        <span>DATA KEYS:</span>
        <span>{player?.dataKeys || 0}</span>
      </div>

      <div className="core-uplink__portal">
        <div className={`core-uplink__portal-inner ${isSummoning ? 'active' : ''}`} />
      </div>

      <div className="core-uplink__controls">
        <Button 
          onClick={() => handleSummon(1)} 
          disabled={isSummoning || !player || !player.hasEnoughKeys(10)}
          loading={isSummoning}
          variant="primary"
          style={{ 
            backgroundColor: 'var(--color-palette-cyan)',
            color: 'var(--color-background-primary)',
            fontWeight: 'bold',
            letterSpacing: '1px',
            marginRight: '1rem'
          }}
        >
          {isSummoning ? '...' : 'SUMMON x1 (10 KEYS)'}
        </Button>

        <Button 
          onClick={() => handleSummon(10)} 
          disabled={isSummoning || !player || !player.hasEnoughKeys(100)}
          loading={isSummoning}
          variant="primary"
          style={{ 
            backgroundColor: 'var(--color-palette-purple)',
            color: 'var(--color-text-primary)',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          {isSummoning ? '...' : 'SUMMON x10 (100 KEYS)'}
        </Button>
      </div>
        {error && <div className="text-error">{error}</div>}

      {showResult && lastSummonedPets.length > 0 && (
        <div className="core-uplink__result-overlay" onClick={closeResult}>
          <div className="core-uplink__result-content" onClick={e => e.stopPropagation()}>
            <h3 className="core-uplink__result-title">
              {lastSummonedPets.length > 1 ? 'ENTITIES BATCH MATERIALIZED' : 'ENTITY MATERIALIZED'}
            </h3>
            <div className="core-uplink__pet-display" style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '1rem', 
              justifyContent: 'center',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}>
              {lastSummonedPets.map(pet => (
                <PetCard key={pet.id} pet={pet} size="medium" />
              ))}
            </div>
            <Button onClick={closeResult} variant="secondary">CONFIRM ACQUISITION</Button>
          </div>
        </div>
      )}
    </div>
  );
};
