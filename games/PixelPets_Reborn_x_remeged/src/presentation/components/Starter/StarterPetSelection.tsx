/**
 * Starter Pet Selection Component
 * Allows new players to select their starting pet
 */

import React, { useState, useMemo } from 'react';
import { PlayerInitializationService } from '@/infrastructure/services/PlayerInitializationService';
import { PlayerRepository } from '@/infrastructure/persistence/repositories/PlayerRepository';
import { PetRepository } from '@/infrastructure/persistence/repositories/PetRepository';
import { StoneRepository } from '@/infrastructure/persistence/repositories/StoneRepository';
import { AbilityRepository } from '@/infrastructure/persistence/repositories/AbilityRepository';
import { STARTER_PETS } from '@/infrastructure/persistence/seedData/starterData';
import { usePlayerStore } from '../../stores/playerStore';
import { usePetStore } from '../../stores/petStore';
import './StarterPetSelection.css';

interface Props {
  onSelectionComplete: () => void;
}

export const StarterPetSelection: React.FC<Props> = ({ onSelectionComplete }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedPetIndex, setSelectedPetIndex] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { loadPlayer } = usePlayerStore();
  const { loadPets } = usePetStore();

  // Initialize service
  const initService = useMemo(() => {
    return new PlayerInitializationService(
      new PlayerRepository(),
      new PetRepository(),
      new StoneRepository(),
      new AbilityRepository(),
    );
  }, []);

  const handleStartGame = async () => {
    try {
      if (!playerName.trim()) {
        setError('Please enter a player name');
        return;
      }

      if (selectedPetIndex === null) {
        setError('Please select a starter pet');
        return;
      }

      const selectedPet = STARTER_PETS[selectedPetIndex];
      if (!selectedPet) {
        setError('Invalid pet selection');
        return;
      }

      setIsInitializing(true);
      setError(null);

      // Initialize player
      await initService.initializeNewPlayer({
        playerName: playerName.trim(),
        selectedPetName: selectedPet.name,
      });

      // Reload player and pets
      await loadPlayer();
      await loadPets();

      // Trigger callback
      onSelectionComplete();
    } catch (err) {
      console.error('Error initializing player:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize game');
      setIsInitializing(false);
    }
  };

  return (
    <div className="starter-selection">
      <div className="starter-selection__container">
        <h1 className="starter-selection__title">Welcome to Pixel Pets</h1>
        <p className="starter-selection__subtitle">Choose your first companion</p>

        {/* Player Name Input */}
        <div className="starter-selection__form-group">
          <label htmlFor="player-name" className="starter-selection__label">
            Your Name
          </label>
          <input
            id="player-name"
            type="text"
            maxLength={20}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="starter-selection__input"
            disabled={isInitializing}
          />
        </div>

        {/* Pet Selection Grid */}
        <div className="starter-selection__pets-grid">
          {STARTER_PETS.map((pet, index) => (
            <button
              key={pet?.name || index}
              className={`starter-selection__pet-card ${
                selectedPetIndex === index ? 'selected' : ''
              }`}
              onClick={() => setSelectedPetIndex(index)}
              disabled={isInitializing}
            >
              <div className="starter-selection__pet-card-inner">
                <div className="starter-selection__pet-family">
                  {pet?.family}
                </div>
                <div className="starter-selection__pet-name">
                  {pet?.name}
                </div>
                <div className="starter-selection__pet-stats">
                  <span className="stat">HP: {pet?.baseStats.hp}</span>
                  <span className="stat">ATK: {pet?.baseStats.attack}</span>
                  <span className="stat">DEF: {pet?.baseStats.defense}</span>
                  <span className="stat">SPD: {pet?.baseStats.speed}</span>
                </div>
                <div className="starter-selection__pet-rarity">
                  {pet?.rarity}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Pet Lore Display */}
        {selectedPetIndex !== null && STARTER_PETS[selectedPetIndex] && (
          <div className="starter-selection__lore">
            <h3>About {STARTER_PETS[selectedPetIndex]?.name}</h3>
            <p>{STARTER_PETS[selectedPetIndex]?.lore}</p>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="starter-selection__error">{error}</div>}

        {/* Start Button */}
        <button
          className="starter-selection__start-button"
          onClick={handleStartGame}
          disabled={isInitializing}
        >
          {isInitializing ? 'Initializing...' : 'Begin Adventure'}
        </button>
      </div>
    </div>
  );
};
