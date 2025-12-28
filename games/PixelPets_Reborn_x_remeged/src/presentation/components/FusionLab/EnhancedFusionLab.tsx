/**
 * Enhanced Fusion Lab Component
 * Advanced interface with drag-drop, live preview, and element visualization
 */

import React, { useState, useEffect } from 'react';
import { useFusionStore } from '../../stores/fusionStore';
import { usePetStore } from '../../stores/petStore';
import { useStoneStore } from '../../stores/stoneStore';
import { PetCard } from '../common/PetCard';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { PerformFusion, PreviewFusion, ValidateFusion } from '@/application/fusion';
import { PetRepository } from '@/infrastructure/persistence/repositories/PetRepository';
import { StoneRepository } from '@/infrastructure/persistence/repositories/StoneRepository';
import { RARITY_CONFIG } from '@/shared/types/rarity';
import type { FusionPreview } from '@/application/fusion/PreviewFusion';
import type { Pet } from '@/domain/entities/Pet';
import type { Stone } from '@/domain/entities/Stone';
import type { UniquenessScore } from '@/domain/services/UniquenessScoring';
import './EnhancedFusionLab.css';

// Element compatibility matrix
const ELEMENT_COMBINATIONS: Record<string, Record<string, { result: string; color: string }>> = {
  PYRO_KIN: {
    AQUA_BORN: { result: 'Steam', color: '#B0B0FF' },
    TERRA_FORGED: { result: 'Lava', color: '#FF8C00' },
    AERO_FLIGHT: { result: 'Smoke', color: '#808080' }
  },
  AQUA_BORN: {
    PYRO_KIN: { result: 'Steam', color: '#B0B0FF' },
    VOLT_STREAM: { result: 'Electro', color: '#FFD700' },
    TERRA_FORGED: { result: 'Mud', color: '#8B4513' }
  },
  TERRA_FORGED: {
    PYRO_KIN: { result: 'Lava', color: '#FF8C00' },
    AQUA_BORN: { result: 'Mud', color: '#8B4513' },
    AERO_FLIGHT: { result: 'Dust', color: '#D2B48C' }
  },
  VOLT_STREAM: {
    AQUA_BORN: { result: 'Electro', color: '#FFD700' },
    STEEL_WORKS: { result: 'Magneto', color: '#C0C0C0' }
  }
};

export const EnhancedFusionLab: React.FC = () => {
  const {
    selectedParent1,
    selectedParent2,
    selectedStone1,
    selectedStone2,
    fusionIntent,
    isFusing,
    error: fusionError,
    selectParent1,
    selectParent2,
    selectStone1,
    selectStone2,
    setFusionIntent,
    setFusing,
    setError,
    clearSelection,
  } = useFusionStore();

  const { pets, loadPets } = usePetStore();
  const { stones, loadStones } = useStoneStore();

  const [preview, setPreview] = useState<FusionPreview | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultPet, setResultPet] = useState<any>(null);
  const [resultUniquenessScore, setResultUniquenessScore] = useState<UniquenessScore | null>(null);
  const [draggedPet, setDraggedPet] = useState<Pet | null>(null);
  const [draggedStone, setDraggedStone] = useState<Stone | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Load data on mount
  useEffect(() => {
    loadPets();
    loadStones();
  }, [loadPets, loadStones]);

  // Initialize use cases
  const petRepository = new PetRepository();
  const stoneRepository = new StoneRepository();
  const performFusion = new PerformFusion(petRepository, stoneRepository);
  const previewFusion = new PreviewFusion(petRepository, stoneRepository);
  const validateFusion = new ValidateFusion(petRepository, stoneRepository);

  const canFuse = selectedParent1 && selectedParent2 && selectedStone1 && selectedStone2;

  // Auto-advance steps
  useEffect(() => {
    if (selectedParent1 && !selectedParent2) setCurrentStep(2);
    else if (selectedParent1 && selectedParent2 && !selectedStone1) setCurrentStep(3);
    else if (selectedParent1 && selectedParent2 && selectedStone1 && !selectedStone2) setCurrentStep(4);
  }, [selectedParent1, selectedParent2, selectedStone1, selectedStone2]);

  // Generate live preview
  useEffect(() => {
    if (canFuse) {
      generatePreview();
      validateSelections();
    } else {
      setPreview(null);
      setValidationErrors([]);
    }
  }, [selectedParent1?.id, selectedParent2?.id, selectedStone1?.id, selectedStone2?.id]);

  const validateSelections = async () => {
    if (!canFuse) return;

    try {
      const result = await validateFusion.execute(
        selectedParent1!.id,
        selectedParent2!.id,
        selectedStone1!.id,
        selectedStone2!.id
      );
      setValidationErrors(result.errors);
    } catch (error) {
      setValidationErrors([error instanceof Error ? error.message : 'Validation failed']);
    }
  };

  const generatePreview = async () => {
    if (!canFuse) return;

    try {
      const previewResult = await previewFusion.execute(
        selectedParent1!.id,
        selectedParent2!.id,
        selectedStone1!.id,
        selectedStone2!.id
      );
      setPreview(previewResult);
    } catch (error) {
      console.error('Preview generation failed:', error);
      setPreview(null);
    }
  };

  const handleFuse = async () => {
    if (!canFuse || validationErrors.length > 0) return;

    setFusing(true);
    setError(null);

    try {
      const result = await performFusion.execute({
        parent1Id: selectedParent1!.id,
        parent2Id: selectedParent2!.id,
        stone1Id: selectedStone1!.id,
        stone2Id: selectedStone2!.id,
        fusionIntent: fusionIntent || undefined,
      });

      await loadPets();
      setResultPet(result.resultPet);
      setResultUniquenessScore(result.uniquenessScore || null);
      setShowResultModal(true);
      clearSelection();
      setCurrentStep(1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Fusion failed';
      setError(errorMessage);
      console.error('Fusion failed:', error);
    } finally {
      setFusing(false);
    }
  };

  // Drag handlers for pets
  const handlePetDragStart = (pet: Pet) => (e: React.DragEvent) => {
    setDraggedPet(pet);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePetDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handlePetDrop = (slot: 'parent1' | 'parent2') => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPet) {
      if (slot === 'parent1') {
        selectParent1(draggedPet);
      } else {
        selectParent2(draggedPet);
      }
      setDraggedPet(null);
    }
  };

  // Drag handlers for stones
  const handleStoneDragStart = (stone: Stone) => (e: React.DragEvent) => {
    setDraggedStone(stone);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleStoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleStoneDrop = (slot: 'stone1' | 'stone2') => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedStone) {
      if (slot === 'stone1') {
        selectStone1(draggedStone);
      } else {
        selectStone2(draggedStone);
      }
      setDraggedStone(null);
    }
  };

  // Get element combination result
  const getElementCombination = () => {
    if (!selectedParent1 || !selectedParent2) return null;
    const family1 = selectedParent1.family;
    const family2 = selectedParent2.family;
    return ELEMENT_COMBINATIONS[family1]?.[family2] || null;
  };

  // Calculate stone compatibility
  const getStoneCompatibility = (_stone: Stone): number => {
    if (!selectedParent1 && !selectedParent2) return 0;

    let compatibility = 50; // Base compatibility

    // Boost if stone family matches parent family
    // if (selectedParent1 && stone.element === selectedParent1.family) compatibility += 25;
    // if (selectedParent2 && stone.element === selectedParent2.family) compatibility += 25;

    return Math.min(100, compatibility);
  };

  const availablePets = pets.filter(
    (pet) => pet.id !== selectedParent1?.id && pet.id !== selectedParent2?.id
  );

  const availableStones = stones.filter(
    (stone) => stone.id !== selectedStone1?.id && stone.id !== selectedStone2?.id
  );

  const elementCombination = getElementCombination();

  return (
    <div className="enhanced-fusion-lab">
      <div className="fusion-lab__header">
        <h1>Advanced Fusion Lab</h1>
        <p>Drag and drop pets and stones to create unique combinations</p>
      </div>

      {fusionError && (
        <div className="fusion-lab__error">
          <p>Error: {fusionError}</p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="fusion-progress">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${selectedParent1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Parent 1</div>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${selectedParent2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Parent 2</div>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${selectedStone1 ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Stone 1</div>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${currentStep >= 4 ? 'active' : ''} ${selectedStone2 ? 'completed' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Stone 2</div>
        </div>
      </div>

      <div className="fusion-workspace">
        {/* Drop Zones */}
        <div className="drop-zones">
          {/* Parent 1 Drop Zone */}
          <div
            className={`drop-zone pet-drop ${selectedParent1 ? 'filled' : 'empty'} ${draggedPet ? 'dragging' : ''}`}
            onDragOver={handlePetDragOver}
            onDrop={handlePetDrop('parent1')}
          >
            <div className="drop-zone-label">Parent 1</div>
            {selectedParent1 ? (
              <div className="dropped-item">
                <PetCard pet={selectedParent1} size="medium" />
                <button className="remove-btn" onClick={() => selectParent1(null)}>×</button>
              </div>
            ) : (
              <div className="drop-placeholder">
                <div className="drop-icon">🐾</div>
                <p>Drag a pet here</p>
              </div>
            )}
          </div>

          {/* Element Combination Indicator */}
          {selectedParent1 && selectedParent2 && elementCombination && (
            <div className="element-combination" style={{ backgroundColor: elementCombination.color + '33' }}>
              <div className="combination-symbol" style={{ color: elementCombination.color }}>⚡</div>
              <div className="combination-name" style={{ color: elementCombination.color }}>
                {elementCombination.result}
              </div>
            </div>
          )}

          {/* Parent 2 Drop Zone */}
          <div
            className={`drop-zone pet-drop ${selectedParent2 ? 'filled' : 'empty'} ${draggedPet ? 'dragging' : ''}`}
            onDragOver={handlePetDragOver}
            onDrop={handlePetDrop('parent2')}
          >
            <div className="drop-zone-label">Parent 2</div>
            {selectedParent2 ? (
              <div className="dropped-item">
                <PetCard pet={selectedParent2} size="medium" />
                <button className="remove-btn" onClick={() => selectParent2(null)}>×</button>
              </div>
            ) : (
              <div className="drop-placeholder">
                <div className="drop-icon">🐾</div>
                <p>Drag a pet here</p>
              </div>
            )}
          </div>

          {/* Stone 1 Drop Zone */}
          <div
            className={`drop-zone stone-drop ${selectedStone1 ? 'filled' : 'empty'} ${draggedStone ? 'dragging' : ''}`}
            onDragOver={handleStoneDragOver}
            onDrop={handleStoneDrop('stone1')}
          >
            <div className="drop-zone-label">Stone 1</div>
            {selectedStone1 ? (
              <div className="dropped-stone">
                <div className="stone-info">
                  <strong>{selectedStone1.type}</strong>
                  <span>Tier {selectedStone1.tier}</span>
                  {selectedStone1.isGlitched && <span className="glitched">Glitched</span>}
                </div>
                <button className="remove-btn" onClick={() => selectStone1(null)}>×</button>
              </div>
            ) : (
              <div className="drop-placeholder">
                <div className="drop-icon">💎</div>
                <p>Drag a stone here</p>
              </div>
            )}
          </div>

          {/* Stone 2 Drop Zone */}
          <div
            className={`drop-zone stone-drop ${selectedStone2 ? 'filled' : 'empty'} ${draggedStone ? 'dragging' : ''}`}
            onDragOver={handleStoneDragOver}
            onDrop={handleStoneDrop('stone2')}
          >
            <div className="drop-zone-label">Stone 2</div>
            {selectedStone2 ? (
              <div className="dropped-stone">
                <div className="stone-info">
                  <strong>{selectedStone2.type}</strong>
                  <span>Tier {selectedStone2.tier}</span>
                  {selectedStone2.isGlitched && <span className="glitched">Glitched</span>}
                </div>
                <button className="remove-btn" onClick={() => selectStone2(null)}>×</button>
              </div>
            ) : (
              <div className="drop-placeholder">
                <div className="drop-icon">💎</div>
                <p>Drag a stone here</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        {preview && canFuse && (
          <div className="live-preview-panel">
            <h3>Live Fusion Preview</h3>

            {/* Stat Ranges with Visual Bars */}
            <div className="preview-stats">
              <h4>Expected Stats</h4>
              {(['hp', 'attack', 'defense', 'speed'] as const).map((stat) => (
                <div key={stat} className="stat-preview">
                  <span className="stat-name">{stat.toUpperCase()}</span>
                  <div className="stat-range-bar">
                    <div
                      className="stat-fill"
                      style={{
                        width: `${(preview.statRanges[stat][1] / 200) * 100}%`,
                        background: `linear-gradient(90deg, #444 0%, #4A90E2 ${(preview.statRanges[stat][0] / preview.statRanges[stat][1]) * 100}%)`
                      }}
                    />
                  </div>
                  <span className="stat-values">
                    {preview.statRanges[stat][0]} - {preview.statRanges[stat][1]}
                  </span>
                </div>
              ))}
            </div>

            {/* Ability Inheritance */}
            <div className="ability-inheritance">
              <h4>Ability Transfer</h4>
              <div className="ability-sources">
                <div className="parent-abilities">
                  <strong>{selectedParent1.name}:</strong>
                  <span>{selectedParent1.activeAbilities.length} active, {selectedParent1.passiveAbilities.length} passive</span>
                </div>
                <div className="inheritance-arrow">→</div>
                <div className="parent-abilities">
                  <strong>{selectedParent2.name}:</strong>
                  <span>{selectedParent2.activeAbilities.length} active, {selectedParent2.passiveAbilities.length} passive</span>
                </div>
              </div>
              <div className="result-abilities">
                Result: {preview.abilityCounts.actives} active, {preview.abilityCounts.passives} passive
                {preview.abilityCounts.ultimates > 0 && `, ${preview.abilityCounts.ultimates} ultimate`}
              </div>
            </div>

            {/* Rarity Prediction */}
            <div className="rarity-prediction">
              <span className="label">Predicted Rarity:</span>
              <span className="rarity-badge" style={{ color: RARITY_CONFIG[preview.likelyRarity].color }}>
                {RARITY_CONFIG[preview.likelyRarity].name}
              </span>
              {preview.upgradeChance > 0 && (
                <span className="upgrade-chance">
                  ({Math.round(preview.upgradeChance * 100)}% upgrade chance)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Available Pets (Draggable) */}
      <div className="available-items">
        <div className="available-pets">
          <h3>Your Pets</h3>
          <div className="pet-grid">
            {availablePets.map((pet) => (
              <div
                key={pet.id as string}
                draggable
                onDragStart={handlePetDragStart(pet)}
                className="draggable-pet"
              >
                <PetCard pet={pet} size="small" />
              </div>
            ))}
          </div>
        </div>

        {/* Available Stones (Draggable with Compatibility) */}
        <div className="available-stones">
          <h3>Your Stones</h3>
          <div className="stone-grid">
            {availableStones.map((stone) => {
              const compatibility = getStoneCompatibility(stone);
              return (
                <div
                  key={stone.id as string}
                  draggable
                  onDragStart={handleStoneDragStart(stone)}
                  className={`draggable-stone compatibility-${Math.floor(compatibility / 25)}`}
                  data-compatibility={compatibility}
                >
                  <div className="stone-card">
                    <strong>{stone.type}</strong>
                    <span>Tier {stone.tier}</span>
                    {stone.isGlitched && <span className="glitched">⚠️</span>}
                    <div className="compatibility-bar">
                      <div className="compatibility-fill" style={{ width: `${compatibility}%` }} />
                    </div>
                    <span className="compatibility-label">{compatibility}% match</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="fusion-lab__validation-errors">
          <h4>⚠️ Cannot fuse:</h4>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Fusion Intent */}
      <div className="fusion-intent-section">
        <label htmlFor="fusion-intent">Fusion Intent (optional):</label>
        <textarea
          id="fusion-intent"
          value={fusionIntent}
          onChange={(e) => setFusionIntent(e.target.value)}
          placeholder="Describe what you want to create for AI-guided fusion..."
          rows={2}
        />
      </div>

      {/* Actions */}
      <div className="fusion-actions">
        <Button
          onClick={handleFuse}
          disabled={!canFuse || isFusing || validationErrors.length > 0}
          variant="primary"
          size="lg"
        >
          {isFusing ? '⚡ Fusing...' : '⚡ Perform Fusion'}
        </Button>
        <Button onClick={() => { clearSelection(); setCurrentStep(1); }} variant="secondary">
          Clear All
        </Button>
      </div>

      {/* Result Modal (same as original) */}
      {showResultModal && resultPet && (
        <Modal isOpen={showResultModal} onClose={() => setShowResultModal(false)} title="Fusion Complete!">
          <div className="fusion-result">
            <p>You successfully created:</p>
            <PetCard pet={resultPet} size="large" />
            {resultUniquenessScore && (
              <div className="uniqueness-score">
                <h3>Uniqueness Score</h3>
                <div className="score-display">
                  <span className="score-value">{resultUniquenessScore.totalScore}</span>
                  <span className="score-rank">{resultUniquenessScore.rank}</span>
                </div>
                <div className="score-percentile">
                  {resultUniquenessScore.percentile}th percentile
                </div>
              </div>
            )}
            <Button onClick={() => setShowResultModal(false)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
