/**
 * Stone Inventory View Component
 * Displays the player's stone collection with filtering and sorting
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useStoneStore } from '../../stores/stoneStore';
import { StoneCard } from './StoneCard';
import { Input } from '../common/Input';
import { StoneType, StoneTier } from '@/domain/entities/Stone';
import './StoneInventoryView.css';

type SortOption = 'type' | 'tier' | 'date';
type FilterType = StoneType | 'all';
type FilterTier = StoneTier | 'all';

export const StoneInventoryView: React.FC = () => {
  const { stones, isLoading, error, loadStones } = useStoneStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('type');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterTier, setFilterTier] = useState<FilterTier>('all');

  // Load stones on mount
  useEffect(() => {
    loadStones();
  }, [loadStones]);

  // Filter and sort stones
  const filteredAndSortedStones = useMemo(() => {
    let filtered = [...stones];

    // Filter by search query (type name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((stone) =>
        stone.type.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((stone) => stone.type === filterType);
    }

    // Filter by tier
    if (filterTier !== 'all') {
      filtered = filtered.filter((stone) => stone.tier === filterTier);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'type':
          return a.type.localeCompare(b.type);
        case 'tier':
          return b.tier - a.tier; // Higher tier first
        case 'date':
          return 0; // Would need a date field on Stone
        default:
          return 0;
      }
    });

    return filtered;
  }, [stones, searchQuery, filterType, filterTier, sortBy]);

  if (isLoading) {
    return (
      <div className="stone-inventory-view">
        <div className="stone-inventory-view__loading">Loading stones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stone-inventory-view">
        <div className="stone-inventory-view__error">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stone-inventory-view">
      <div className="stone-inventory-view__header">
        <h1>Stone Inventory</h1>
        <p>Manage your collection of fusion stones</p>
        <div className="stone-inventory-view__count">
          {filteredAndSortedStones.length} / {stones.length} Stones
        </div>
      </div>

      <div className="stone-inventory-view__controls">
        <div className="stone-inventory-view__search">
          <Input
            type="text"
            placeholder="Search stones by type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="stone-inventory-view__filters">
          <div className="stone-inventory-view__filter-group">
            <label htmlFor="type-filter">Type:</label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="stone-inventory-view__select"
            >
              <option value="all">All Types</option>
              {Object.values(StoneType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="stone-inventory-view__filter-group">
            <label htmlFor="tier-filter">Tier:</label>
            <select
              id="tier-filter"
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value as FilterTier)}
              className="stone-inventory-view__select"
            >
              <option value="all">All Tiers</option>
              {Object.values(StoneTier)
                .filter((tier) => typeof tier === 'number')
                .map((tier) => (
                  <option key={tier} value={tier}>
                    Tier {tier}
                  </option>
                ))}
            </select>
          </div>

          <div className="stone-inventory-view__filter-group">
            <label htmlFor="sort-filter">Sort by:</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="stone-inventory-view__select"
            >
              <option value="type">Type</option>
              <option value="tier">Tier</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedStones.length === 0 ? (
        <div className="stone-inventory-view__empty">
          <p>No stones found matching your filters.</p>
          {stones.length === 0 && (
            <p>Complete dungeons to earn stones!</p>
          )}
        </div>
      ) : (
        <div className="stone-inventory-view__grid">
          {filteredAndSortedStones.map((stone) => (
            <StoneCard key={stone.id} stone={stone} />
          ))}
        </div>
      )}
    </div>
  );
};









