/**
 * Fusion Lab Component
 * Interface for performing pet fusions with preview and validation
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
import './FusionLab.css';
import type { UniquenessScore } from '@/domain/services/UniquenessScoring';

export const FusionLab: React.FC = () => {
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

  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState<FusionPreview | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultPet, setResultPet] = useState<any>(null);
  const [resultUniquenessScore, setResultUniquenessScore] = useState<UniquenessScore | null>(null);

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

  // Generate preview when selections change
  useEffect(() => {
    if (canFuse) {
      generatePreview();
      validateSelections();
    } else {
      setPreview(null);
      setValidationErrors([]);
      setShowPreview(false);
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
      setShowPreview(true);
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

      // Update stores
      await loadPets(); // Reload to get new pet
      
      // Show result
      setResultPet(result.resultPet);
      setResultUniquenessScore(result.uniquenessScore || null);
      setShowResultModal(true);

      // Clear selection after successful fusion
      clearSelection();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Fusion failed';
      setError(errorMessage);
      console.error('Fusion failed:', error);
    } finally {
      setFusing(false);
    }
  };

  const availablePets = pets.filter(
    (pet) => pet.id !== selectedParent1?.id && pet.id !== selectedParent2?.id
  );

  return (
    <div className="fusion-lab">
      <div className="fusion-lab__header">
        <h1>Fusion Lab</h1>
        <p>Combine two pets with two stones to create something new</p>
      </div>

      {fusionError && (
        <div className="fusion-lab__error">
          <p>Error: {fusionError}</p>
        </div>
      )}

      <div className="fusion-lab__selection">
        {/* Pet Selection */}
        <div className="fusion-lab__parents">
          <div className="fusion-lab__parent-slot">
            <h3>Parent 1</h3>
            {selectedParent1 ? (
              <div className="fusion-lab__selected-item">
                <PetCard pet={selectedParent1} size="medium" />
                <Button onClick={() => selectParent1(null)} variant="secondary" size="sm">
                  Clear
                </Button>
              </div>
            ) : (
              <div className="fusion-lab__select-area">
                <p>Select a pet</p>
                <div className="fusion-lab__pet-list">
                  {availablePets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                      onClick={() => selectParent1(pet)}
                      size="small"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="fusion-lab__plus">+</div>

          <div className="fusion-lab__parent-slot">
            <h3>Parent 2</h3>
            {selectedParent2 ? (
              <div className="fusion-lab__selected-item">
                <PetCard pet={selectedParent2} size="medium" />
                <Button onClick={() => selectParent2(null)} variant="secondary" size="sm">
                  Clear
                </Button>
              </div>
            ) : (
              <div className="fusion-lab__select-area">
                <p>Select a pet</p>
                <div className="fusion-lab__pet-list">
                  {availablePets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                      onClick={() => selectParent2(pet)}
                      size="small"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stone Selection */}
        <div className="fusion-lab__stones">
          <div className="fusion-lab__stone-slot">
            <h3>Stone 1</h3>
            {selectedStone1 ? (
              <div className="fusion-lab__selected-stone">
                <div className="fusion-lab__stone-info">
                  <strong>{selectedStone1.type}</strong>
                  <span>Tier {selectedStone1.tier}</span>
                  {selectedStone1.isGlitched && <span className="fusion-lab__glitched">Glitched</span>}
                </div>
                <Button onClick={() => selectStone1(null)} variant="secondary" size="sm">
                  Clear
                </Button>
              </div>
            ) : (
              <div className="fusion-lab__select-area">
                <p>Select a stone</p>
                <div className="fusion-lab__stone-list">
                  {stones
                    .filter((stone) => stone.id !== selectedStone2?.id)
                    .map((stone) => (
                      <div
                        key={stone.id}
                        className="fusion-lab__stone-item"
                        onClick={() => selectStone1(stone)}
                      >
                        <strong>{stone.type}</strong>
                        <span>Tier {stone.tier}</span>
                        {stone.isGlitched && <span className="fusion-lab__glitched">Glitched</span>}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="fusion-lab__plus">+</div>

          <div className="fusion-lab__stone-slot">
            <h3>Stone 2</h3>
            {selectedStone2 ? (
              <div className="fusion-lab__selected-stone">
                <div className="fusion-lab__stone-info">
                  <strong>{selectedStone2.type}</strong>
                  <span>Tier {selectedStone2.tier}</span>
                  {selectedStone2.isGlitched && <span className="fusion-lab__glitched">Glitched</span>}
                </div>
                <Button onClick={() => selectStone2(null)} variant="secondary" size="sm">
                  Clear
                </Button>
              </div>
            ) : (
              <div className="fusion-lab__select-area">
                <p>Select a stone</p>
                <div className="fusion-lab__stone-list">
                  {stones
                    .filter((stone) => stone.id !== selectedStone1?.id)
                    .map((stone) => (
                      <div
                        key={stone.id}
                        className="fusion-lab__stone-item"
                        onClick={() => selectStone2(stone)}
                      >
                        <strong>{stone.type}</strong>
                        <span>Tier {stone.tier}</span>
                        {stone.isGlitched && <span className="fusion-lab__glitched">Glitched</span>}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && preview && (
        <div className="fusion-lab__preview">
          <h3>Fusion Preview</h3>
          <div className="fusion-lab__preview-content">
            <div className="fusion-lab__preview-rarity">
              <strong>Likely Rarity:</strong>
              <span style={{ color: RARITY_CONFIG[preview.likelyRarity].color }}>
                {RARITY_CONFIG[preview.likelyRarity].name}
              </span>
              {preview.upgradeChance > 0 && (
                <span className="fusion-lab__upgrade-chance">
                  ({Math.round(preview.upgradeChance * 100)}% upgrade chance)
                </span>
              )}
            </div>
            <div className="fusion-lab__preview-stats">
              <h4>Expected Stats (Range):</h4>
              <div className="fusion-lab__stat-ranges">
                <div>HP: {preview.statRanges.hp[0]} - {preview.statRanges.hp[1]}</div>
                <div>Attack: {preview.statRanges.attack[0]} - {preview.statRanges.attack[1]}</div>
                <div>Defense: {preview.statRanges.defense[0]} - {preview.statRanges.defense[1]}</div>
                <div>Speed: {preview.statRanges.speed[0]} - {preview.statRanges.speed[1]}</div>
              </div>
            </div>
            <div className="fusion-lab__preview-abilities">
              <h4>Abilities:</h4>
              <div>
                {preview.abilityCounts.passives} Passive{preview.abilityCounts.passives !== 1 ? 's' : ''}, 
                {preview.abilityCounts.actives} Active{preview.abilityCounts.actives !== 1 ? 's' : ''}
                {preview.abilityCounts.ultimates > 0 && `, ${preview.abilityCounts.ultimates} Ultimate${preview.abilityCounts.ultimates !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="fusion-lab__validation-errors">
          <h4>Cannot fuse:</h4>
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Fusion Intent */}
      <div className="fusion-lab__intent">
        <label htmlFor="fusion-intent">Fusion Intent (optional):</label>
        <textarea
          id="fusion-intent"
          value={fusionIntent}
          onChange={(e) => setFusionIntent(e.target.value)}
          placeholder="Describe what you want to create..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="fusion-lab__actions">
        <Button
          onClick={handleFuse}
          disabled={!canFuse || isFusing || validationErrors.length > 0}
          variant="primary"
          size="lg"
        >
          {isFusing ? 'Fusing...' : 'Perform Fusion'}
        </Button>
        <Button onClick={clearSelection} variant="secondary">
          Clear All
        </Button>
      </div>

      {/* Result Modal */}
      {showResultModal && resultPet && (
        <Modal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          title="Fusion Complete!"
        >
          <div className="fusion-lab__result">
            <p>You successfully created:</p>
            <PetCard pet={resultPet} size="large" />
            
            {/* Uniqueness Score Display */}
            {resultUniquenessScore && (
              <div className="fusion-lab__uniqueness-score">
                <h3>Uniqueness Score</h3>
                <div className="fusion-lab__score-main">
                  <div className="fusion-lab__score-total">
                    <span className="fusion-lab__score-value">{resultUniquenessScore.totalScore}</span>
                    <span className="fusion-lab__score-rank">{resultUniquenessScore.rank}</span>
                  </div>
                  <div className="fusion-lab__score-percentile">
                    {resultUniquenessScore.percentile}th percentile
                  </div>
                </div>
                <div className="fusion-lab__score-breakdown">
                  <div className="fusion-lab__score-item">
                    <span>Abilities:</span>
                    <span>{resultUniquenessScore.breakdown.abilityUniqueness}/30</span>
                  </div>
                  <div className="fusion-lab__score-item">
                    <span>Stats:</span>
                    <span>{resultUniquenessScore.breakdown.statDistribution}/20</span>
                  </div>
                  <div className="fusion-lab__score-item">
                    <span>Elements:</span>
                    <span>{resultUniquenessScore.breakdown.elementCombination}/15</span>
                  </div>
                  <div className="fusion-lab__score-item">
                    <span>Rarity:</span>
                    <span>{resultUniquenessScore.breakdown.rarityFactor}/10</span>
                  </div>
                  <div className="fusion-lab__score-item">
                    <span>Name:</span>
                    <span>{resultUniquenessScore.breakdown.nameUniqueness}/10</span>
                  </div>
                  <div className="fusion-lab__score-item">
                    <span>Visual:</span>
                    <span>{resultUniquenessScore.breakdown.visualUniqueness}/15</span>
                  </div>
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
