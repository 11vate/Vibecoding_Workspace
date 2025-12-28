import React, { useState, useMemo, useEffect } from 'react';
import { GachaSummonService } from '@/application/summon/GachaSummonService';
import { BlackMarketService } from '@/application/summon/BlackMarketService';
import { PetRepository } from '@/infrastructure/persistence/repositories/PetRepository';
import { BasePetRepository } from '@/infrastructure/persistence/repositories/BasePetRepository';
import { PlayerRepository } from '@/infrastructure/persistence/repositories/PlayerRepository';
import { StoneRepository } from '@/infrastructure/persistence/repositories/StoneRepository';
import { CoreUplinkView } from './CoreUplinkView';
import { BlackMarketView } from './BlackMarketView';
import { usePetStore } from '../../stores/petStore';
import { usePlayerStore } from '../../stores/playerStore';
import './SummonView.css';

type Tab = 'uplink' | 'blackmarket';

export const SummonView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('uplink');
  const { loadPets } = usePetStore();
  const { loadPlayer } = usePlayerStore();

  // Initialize services
  const { gachaService, blackMarketService } = useMemo(() => {
    const petRepo = new PetRepository();
    const basePetRepo = new BasePetRepository();
    const playerRepo = new PlayerRepository();
    const stoneRepo = new StoneRepository();
    
    return {
      gachaService: new GachaSummonService(playerRepo, basePetRepo, petRepo),
      blackMarketService: new BlackMarketService(playerRepo, basePetRepo, petRepo, stoneRepo)
    };
  }, []);

  useEffect(() => {
    loadPlayer();
  }, [loadPlayer]);

  const handleSummonComplete = async () => {
    await loadPets();
    await loadPlayer();
  };

  return (
    <div className={`summon-view summon-view--${activeTab}`}>
      <div className="summon-view__nav">
        <button 
          className={`summon-view__tab ${activeTab === 'uplink' ? 'active' : ''}`}
          onClick={() => setActiveTab('uplink')}
        >
          CORE UPLINK
        </button>
        <button 
          className={`summon-view__tab ${activeTab === 'blackmarket' ? 'active' : ''}`}
          onClick={() => setActiveTab('blackmarket')}
        >
          BLACK MARKET
        </button>
      </div>

      <div className="summon-view__content">
        {activeTab === 'uplink' ? (
          <CoreUplinkView 
            service={gachaService} 
            onSummonComplete={handleSummonComplete}
          />
        ) : (
          <BlackMarketView 
            service={blackMarketService} 
          />
        )}
      </div>
    </div>
  );
};
