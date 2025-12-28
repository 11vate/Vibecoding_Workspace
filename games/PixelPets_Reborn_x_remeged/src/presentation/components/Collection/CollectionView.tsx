/**
 * Collection View Component
 * Displays the player's pet collection with filtering, sorting, and search
 */

import React, { useState, useEffect, useMemo } from 'react';
import { usePetStore } from '../../stores/petStore';
import { PetCard } from '../common/PetCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Rarity, RARITY_CONFIG } from '@/shared/types/rarity';
import { PetFamily, FAMILY_CONFIGS } from '@/shared/types/family';
import type { Pet } from '@/domain/entities/Pet';
import './CollectionView.css';

type SortOption = 'name' | 'rarity' | 'date' | 'family';
type FilterRarity = Rarity | 'all';
type FilterFamily = PetFamily | 'all';

export const CollectionView: React.FC = () => {
  const { pets, selectedPet, isLoading, error, loadPets, selectPet } = usePetStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('all');
  const [filterFamily, setFilterFamily] = useState<FilterFamily>('all');
  const [showDetails, setShowDetails] = useState(false);

  // Load pets on mount
  useEffect(() => {
    loadPets();
  }, [loadPets]);

  // Filter and sort pets
  const filteredAndSortedPets = useMemo(() => {
    let filtered = [...pets];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(query) ||
          pet.nickname?.toLowerCase().includes(query) ||
          pet.family.toLowerCase().includes(query)
      );
    }

    // Filter by rarity
    if (filterRarity !== 'all') {
      filtered = filtered.filter((pet) => pet.rarity === filterRarity);
    }

    // Filter by family
    if (filterFamily !== 'all') {
      filtered = filtered.filter((pet) => pet.family === filterFamily);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          return b.rarity - a.rarity; // Higher rarity first
        case 'date':
          return b.collectionDate - a.collectionDate; // Newest first
        case 'family':
          return a.family.localeCompare(b.family);
        default:
          return 0;
      }
    });

    return filtered;
  }, [pets, searchQuery, filterRarity, filterFamily, sortBy]);

  const handlePetClick = (pet: Pet) => {
    selectPet(pet);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    selectPet(null);
  };

  return (
    <div className="collection-view">
      <div className="collection-view__header">
        <h1>Pet Collection</h1>
        <div className="collection-view__count">
          {filteredAndSortedPets.length} / {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="collection-view__controls">
        <Input
          type="text"
          placeholder="Search pets by name, nickname, or family..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="collection-view__search"
        />

        <div className="collection-view__filters">
          <div className="collection-view__filter-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="collection-view__select"
            >
              <option value="name">Name</option>
              <option value="rarity">Rarity</option>
              <option value="date">Date Collected</option>
              <option value="family">Family</option>
            </select>
          </div>

          <div className="collection-view__filter-group">
            <label>Rarity:</label>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value as FilterRarity)}
              className="collection-view__select"
            >
              <option value="all">All Rarities</option>
              {Object.values(Rarity)
                .filter((r) => typeof r === 'number')
                .map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {RARITY_CONFIG[rarity as Rarity].name}
                  </option>
                ))}
            </select>
          </div>

          <div className="collection-view__filter-group">
            <label>Family:</label>
            <select
              value={filterFamily}
              onChange={(e) => setFilterFamily(e.target.value as FilterFamily)}
              className="collection-view__select"
            >
              <option value="all">All Families</option>
              {Object.values(PetFamily).map((family) => (
                <option key={family} value={family}>
                  {FAMILY_CONFIGS[family].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="collection-view__loading">
          <p>Loading pets...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="collection-view__error">
          <p>Error: {error}</p>
          <Button onClick={loadPets}>Retry</Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredAndSortedPets.length === 0 && (
        <div className="collection-view__empty">
          {pets.length === 0 ? (
            <>
              <p>Your collection is empty.</p>
              <p>Summon your first pet to get started!</p>
            </>
          ) : (
            <>
              <p>No pets match your filters.</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setFilterRarity('all');
                  setFilterFamily('all');
                }}
              >
                Clear Filters
              </Button>
            </>
          )}
        </div>
      )}

      {/* Pet Grid */}
      {!isLoading && !error && filteredAndSortedPets.length > 0 && (
        <div className="collection-view__grid">
          {filteredAndSortedPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onClick={() => handlePetClick(pet)}
              selected={selectedPet?.id === pet.id}
              size="medium"
            />
          ))}
        </div>
      )}

      {/* Pet Details Modal */}
      {selectedPet && showDetails && (
        <Modal
          isOpen={showDetails}
          onClose={handleCloseDetails}
          title={selectedPet.name}
        >
          <div className="collection-view__details">
            {selectedPet.nickname && (
              <p className="collection-view__nickname">"{selectedPet.nickname}"</p>
            )}
            <div className="collection-view__detail-row">
              <span className="collection-view__detail-label">Family:</span>
              <span>{FAMILY_CONFIGS[selectedPet.family].name}</span>
            </div>
            <div className="collection-view__detail-row">
              <span className="collection-view__detail-label">Rarity:</span>
              <span style={{ color: RARITY_CONFIG[selectedPet.rarity].color }}>
                {RARITY_CONFIG[selectedPet.rarity].name}
              </span>
            </div>
            {selectedPet.isFused() && (
              <div className="collection-view__detail-row">
                <span className="collection-view__detail-label">Generation:</span>
                <span>Gen {selectedPet.getGeneration()}</span>
              </div>
            )}
            <div className="collection-view__stats">
              <h3>Stats</h3>
              <div className="collection-view__stat-grid">
                <div className="collection-view__stat-item">
                  <span>HP:</span>
                  <span>{selectedPet.stats.hp} / {selectedPet.stats.maxHp}</span>
                </div>
                <div className="collection-view__stat-item">
                  <span>Attack:</span>
                  <span>{selectedPet.stats.attack}</span>
                </div>
                <div className="collection-view__stat-item">
                  <span>Defense:</span>
                  <span>{selectedPet.stats.defense}</span>
                </div>
                <div className="collection-view__stat-item">
                  <span>Speed:</span>
                  <span>{selectedPet.stats.speed}</span>
                </div>
              </div>
            </div>
            <div className="collection-view__abilities">
              <h3>Abilities</h3>
              <div className="collection-view__ability-list">
                {selectedPet.activeAbilities.map((ability, index) => (
                  <div key={index} className="collection-view__ability-item">
                    <strong>{ability.name}</strong>
                    <p>{ability.description}</p>
                  </div>
                ))}
                {selectedPet.passiveAbilities.map((ability, index) => (
                  <div key={index} className="collection-view__ability-item collection-view__ability-item--passive">
                    <strong>{ability.name} (Passive)</strong>
                    <p>{ability.description}</p>
                  </div>
                ))}
                {selectedPet.ultimateAbility && (
                  <div className="collection-view__ability-item collection-view__ability-item--ultimate">
                    <strong>{selectedPet.ultimateAbility.name} (Ultimate)</strong>
                    <p>{selectedPet.ultimateAbility.description}</p>
                  </div>
                )}
              </div>
            </div>
            {selectedPet.fusionHistory.length > 0 && (
              <div className="collection-view__fusion-history">
                <h3>Fusion History</h3>
                <p>This pet has been fused {selectedPet.fusionHistory.length} time(s)</p>
                <p>Total mutations: {selectedPet.getTotalMutations()}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
