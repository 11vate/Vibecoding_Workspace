import React, { useState, useEffect } from 'react';
import { BlackMarketService, BlackMarketListing } from '@/application/summon/BlackMarketService';
import { usePlayerStore } from '../../stores/playerStore';
import { Pet } from '@/domain/entities/Pet';
import { Stone } from '@/domain/entities/Stone';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PetCard } from '../common/PetCard';
import { StoneCard } from '../Stones/StoneCard';
import { ListingCard } from '../common/ListingCard';
import './BlackMarketView.css';

interface BlackMarketViewProps {
  service: BlackMarketService;
}

export const BlackMarketView: React.FC<BlackMarketViewProps> = ({ service }) => {
  const { player, loadPlayer } = usePlayerStore();
  const [listings, setListings] = useState<BlackMarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<BlackMarketListing | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<Pet | Stone | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const items = await service.getDailyListings();
      setListings(items);
    } catch (err) {
      setError('Failed to load black market listings.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = (listing: BlackMarketListing) => {
    setSelectedListing(listing);
    setError(null);
  };

  const confirmPurchase = async () => {
    if (!player || !selectedListing) return;

    setPurchasing(selectedListing.id);
    try {
      const result = await service.purchaseListing(player.id, selectedListing.id);
      setPurchaseResult(result);
      // Remove from listings
      setListings(prev => prev.filter(l => l.id !== selectedListing.id));
      await loadPlayer();
      setSelectedListing(null); // Close confirmation modal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed.');
    } finally {
      setPurchasing(null);
    }
  };

  const calculateTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="black-market">
      <div className="black-market__header">
        <div>
          <h2 className="black-market__title">BLACK MARKET</h2>
          <div className="black-market__timer">REFRESH IN: {calculateTimeUntilReset()}</div>
        </div>
        <div className="black-market__currency">
          BYTES: {player?.corruptedBytes || 0}
        </div>
      </div>

      {loading ? (
        <div className="black-market__loading">DECRYPTING SIGNALS...</div>
      ) : (
        <div className="black-market__grid">
          {listings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              player={player}
              onPurchase={handlePurchaseClick}
            />
          ))}
        </div>
      )}

      {selectedListing && !purchaseResult && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedListing(null)}
          title="CONFIRM ILLEGAL TRANSACTION"
        >
          <div className="black-market__confirm">
            <p>Are you sure you want to purchase <strong>{selectedListing.name}</strong>?</p>
            <p className="text-warning">WARNING: Use of hacked entities is a violation of Terms of Service.</p>
            <div className="black-market__confirm-actions">
              <Button onClick={() => setSelectedListing(null)} variant="secondary">CANCEL</Button>
              <Button 
                onClick={confirmPurchase} 
                loading={purchasing !== null}
                variant="primary"
                style={{ backgroundColor: 'var(--color-palette-red)' }}
              >
                CONFIRM (-{selectedListing.price} BYTES)
              </Button>
            </div>
            {error && <div className="text-error">{error}</div>}
          </div>
        </Modal>
      )}

      {purchaseResult && (
        <div className="black-market__result-overlay" onClick={() => setPurchaseResult(null)}>
           <div className="black-market__result-content" onClick={e => e.stopPropagation()}>
             <h3 className="black-market__result-title">TRANSACTION SUCCESSFUL</h3>
             <div className="black-market__pet-display">
               {(purchaseResult as any).statBonuses ? (
                  <StoneCard stone={purchaseResult as Stone} />
               ) : (
                  <PetCard pet={purchaseResult as Pet} size="large" />
               )}
             </div>
             <Button onClick={() => setPurchaseResult(null)} variant="primary" style={{ backgroundColor: 'var(--color-palette-red)' }}>
               DISCONNECT
             </Button>
           </div>
        </div>
      )}
    </div>
  );
};
