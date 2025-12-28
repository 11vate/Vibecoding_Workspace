/**
 * Battle View Component
 * Displays battle interface with turn execution and combat management
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombatStore } from '../../stores/combatStore';
import { usePetStore } from '../../stores/petStore';
import { usePlayerStore } from '../../stores/playerStore';
import { InitializeBattle } from '@/application/combat/InitializeBattle';
import { ExecuteTurn } from '@/application/combat/ExecuteTurn';
import { GenerateEncounter } from '@/application/dungeon/GenerateEncounter';
import { BattleRepository } from '@/infrastructure/persistence/repositories/BattleRepository';
import { SpriteGenerator } from '@/infrastructure/sprite/SpriteGenerator';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { ToastContainer } from '../common/Toast';
import type { Pet } from '@/domain/entities/Pet';
import type { CombatPet, Battle } from '@/domain/entities/Battle';
import './BattleView.css';

const BattlePetDisplay: React.FC<{
  combatPet: CombatPet;
  isCurrentActor: boolean;
  isAlive: boolean;
  side: 'left' | 'right';
  animationState: 'idle' | 'attack' | 'hit';
  floatingTexts?: { id: string; text: string; type: string }[];
}> = ({ combatPet, isCurrentActor, isAlive, side, animationState, floatingTexts = [] }) => {
  const [spriteUrl, setSpriteUrl] = useState<string | null>(null);

  useEffect(() => {
    const generator = new SpriteGenerator();
    generator.generateSpriteForPet(combatPet.pet).then(setSpriteUrl);
  }, [combatPet.pet.id]);

  let animationClass = 'battle-view__sprite--idle';
  if (animationState === 'attack') {
    animationClass = side === 'left' ? 'battle-view__sprite--attack' : 'battle-view__sprite--attack-enemy';
  } else if (animationState === 'hit') {
    animationClass = side === 'left' ? 'battle-view__sprite--hit' : 'battle-view__sprite--hit-enemy';
  }

  return (
    <div className="battle-view__pet-sprite-container" style={{
      width: '100%',
      height: '120px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '10px',
      position: 'relative', // Needed for absolute positioning of floating text
      // No manual flip here, handled by CSS animations/classes or distinct handling
    }}>
      {/* Floating Combat Text */}
      {floatingTexts.map(ft => (
        <div key={ft.id} className={`floating-text floating-text--${ft.type}`}>
          {ft.text}
        </div>
      ))}

      {spriteUrl ? (
        <img 
          src={spriteUrl} 
          alt={combatPet.pet.name}
          className={animationClass}
          style={{ 
            width: '96px', 
            height: '96px', 
            imageRendering: 'pixelated',
            filter: !isAlive ? 'grayscale(100%) brightness(50%)' : isCurrentActor ? 'drop-shadow(0 0 5px #fff)' : 'none',
            opacity: !isAlive ? 0.5 : 1,
            // Apply flip for enemy side if not handled by animation keyframes (idle needs flip?)
            transform: side === 'right' && animationState === 'idle' ? 'scaleX(-1)' : undefined
          }} 
        />
      ) : (
        <div className="battle-view__pet-placeholder">?</div>
      )}
    </div>
  );
};

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface FloatingTextItem {
  id: string;
  text: string;
  type: 'damage' | 'heal' | 'miss' | 'crit';
  timestamp: number;
}

export const BattleView: React.FC = () => {
  const navigate = useNavigate();
  const { currentBattle, setCurrentBattle, saveBattle, isLoading, error, dungeonRun, setDungeonRun, clearDungeonRun } = useCombatStore();
  const { player, loadPlayer, updatePlayer } = usePlayerStore();
  const { pets, loadPets } = usePetStore();
  const [isExecutingTurn, setIsExecutingTurn] = useState(false);
  const [showStartBattleModal, setShowStartBattleModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Pet[]>([]);
  const [selectedEnemyTeam, setSelectedEnemyTeam] = useState<Pet[]>([]);
  const [selectedPlayerTeamId, setSelectedPlayerTeamId] = useState<string | null>(null);
  const [autoBattle, setAutoBattle] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [combatLogExpanded, setCombatLogExpanded] = useState(true);
  const [activeFloatingTexts, setActiveFloatingTexts] = useState<Record<string, FloatingTextItem[]>>({});
  const [lastLogLength, setLastLogLength] = useState(0);

  // Use useMemo to avoid recreating use cases on every render
  const executeTurnUseCase = useMemo(() => new ExecuteTurn(new BattleRepository()), []);
  const initializeBattleUseCase = useMemo(() => new InitializeBattle(), []);
  const generateEncounterUseCase = useMemo(() => new GenerateEncounter(), []);

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    // Load initial data
    loadPets().catch((err) => {
      console.error('Error loading pets:', err);
      addToast('Failed to load pets', 'error');
    });
    loadPlayer().catch((err) => {
      console.error('Error loading player:', err);
      addToast('Failed to load player data', 'error');
    });
  }, [loadPets, loadPlayer, addToast]);

  useEffect(() => {
    // Process combat log for floating text
    if (!currentBattle) {
        setLastLogLength(0);
        return;
    }

    if (currentBattle.log.length > lastLogLength) {
        const newEntries = currentBattle.log.slice(lastLogLength);
        const newTexts: Record<string, FloatingTextItem[]> = {};

        newEntries.forEach(entry => {
            entry.results.forEach(result => {
                const addText = (petId: string, text: string, type: FloatingTextItem['type']) => {
                    if (!newTexts[petId]) newTexts[petId] = [];
                    newTexts[petId].push({
                        id: `ft-${Date.now()}-${Math.random()}`,
                        text,
                        type,
                        timestamp: Date.now()
                    });
                };

                if (result.damage && result.damage > 0) {
                    addText(result.targetId, `-${result.damage}`, 'damage');
                    if (result.critical) {
                        addText(result.targetId, 'CRIT!', 'crit');
                    }
                }
                if (result.healing && result.healing > 0) {
                    addText(result.targetId, `+${result.healing}`, 'heal');
                }
                if (result.missed) {
                    addText(result.targetId, 'MISS', 'miss');
                }
            });
        });

        if (Object.keys(newTexts).length > 0) {
            setActiveFloatingTexts(prev => {
                const next = { ...prev };
                Object.keys(newTexts).forEach(petId => {
                    next[petId] = [...(next[petId] || []), ...newTexts[petId]];
                });
                return next;
            });

            // Cleanup after animation duration (1s)
            setTimeout(() => {
                setActiveFloatingTexts(prev => {
                    const next = { ...prev };
                    const now = Date.now();
                    let hasChanges = false;
                    Object.keys(next).forEach(petId => {
                        const filtered = next[petId].filter(ft => now - ft.timestamp < 1000);
                        if (filtered.length !== next[petId].length) {
                            next[petId] = filtered;
                            hasChanges = true;
                        }
                    });
                    return hasChanges ? next : prev;
                });
            }, 1000);
        }
        setLastLogLength(currentBattle.log.length);
    }
  }, [currentBattle, lastLogLength]);

  // Auto-select first team if available
  useEffect(() => {
    if (player && player.teams.length > 0 && !selectedPlayerTeamId) {
      setSelectedPlayerTeamId(player.teams[0].id);
    }
  }, [player, selectedPlayerTeamId]);

  useEffect(() => {
    // Auto-battle mode
    if (autoBattle && currentBattle && !currentBattle.isComplete && !isExecutingTurn) {
      const timer = setTimeout(() => {
        handleExecuteTurn();
      }, 1000); // 1 second delay between turns
      return () => clearTimeout(timer);
    }
  }, [autoBattle, currentBattle, isExecutingTurn]);

  const handleStartBattle = async () => {
    // Validate team sizes (1-4 pets allowed)
    if (selectedTeam.length < 1 || selectedTeam.length > 4) {
      addToast('Please select 1-4 pets for your team', 'warning');
      return;
    }

    if (selectedEnemyTeam.length < 1 || selectedEnemyTeam.length > 4) {
      addToast('Please select 1-4 pets for the enemy team', 'warning');
      return;
    }

    try {
      const battle = await initializeBattleUseCase.execute({
        team1: selectedTeam,
        team2: selectedEnemyTeam,
      });
      setCurrentBattle(battle);
      await saveBattle(battle);
      setShowStartBattleModal(false);
      addToast('Battle started!', 'success');
    } catch (error) {
      console.error('Error starting battle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addToast(`Failed to start battle: ${errorMessage}`, 'error');
    }
  };

  const handleExecuteTurn = async () => {
    if (!currentBattle || currentBattle.isComplete || isExecutingTurn) return;

    setIsExecutingTurn(true);
    try {
      const result = await executeTurnUseCase.execute({
        battleId: currentBattle.id,
      });
      setCurrentBattle(result.battle);
      await saveBattle(result.battle);

      if (result.battle.isComplete) {
        setAutoBattle(false);
        const winnerText =
          result.battle.winner === 'team1'
            ? 'Victory!'
            : result.battle.winner === 'team2'
              ? 'Defeat!'
              : "It's a draw!";
        addToast(`Battle complete: ${winnerText}`, result.battle.winner === 'team1' ? 'success' : 'info');
        
        // Handle dungeon progression if this is a dungeon battle
        if (dungeonRun) {
          await handleDungeonBattleComplete(result.battle);
        }
      } else if (result.turnCompleted) {
        // Show turn completion feedback (can be muted for auto-battle)
        if (!autoBattle) {
          const currentActor = result.battle.getCurrentActor();
          if (currentActor) {
            addToast(`${currentActor.pet.name}'s turn`, 'info');
          }
        }
      }
    } catch (error) {
      console.error('Error executing turn:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addToast(`Failed to execute turn: ${errorMessage}`, 'error');
    } finally {
      setIsExecutingTurn(false);
    }
  };

  const handleClearBattle = () => {
    setCurrentBattle(null);
    setAutoBattle(false);
    clearDungeonRun();
    addToast('Battle cleared', 'info');
  };

  /**
   * Handle dungeon battle completion - progress to next wave or complete dungeon
   */
  const handleDungeonBattleComplete = async (battle: Battle) => {
    if (!dungeonRun || !player) return;

    // If player lost, end dungeon run
    if (battle.winner !== 'team1') {
      clearDungeonRun();
      addToast('Dungeon run failed!', 'error');
      return;
    }

    // Player won - check if there are more waves
    const dungeon = dungeonRun.dungeon;
    const nextWaveIndex = dungeonRun.currentWaveIndex + 1;
    const isBossFloor = dungeon.isBossFloor();
    const totalWaves = dungeon.minionWaves.length;
    const isLastWave = nextWaveIndex >= totalWaves;

    // If this was the boss or last wave, complete the dungeon
    if (isBossFloor && isLastWave) {
      await completeDungeon(dungeonRun);
      return;
    }

    // If there are more minion waves, start next wave
    if (nextWaveIndex < totalWaves) {
      try {
        // Generate next encounter
        const encounter = await generateEncounterUseCase.execute({
          dungeon: dungeon,
          waveIndex: nextWaveIndex,
          playerTeamSize: dungeonRun.playerTeam.length,
        });

        // Initialize next battle
        const nextBattle = await initializeBattleUseCase.execute({
          team1: dungeonRun.playerTeam, // Keep player team from start
          team2: encounter.enemyPets,
        });

        // Update dungeon run state
        const updatedRun = {
          ...dungeonRun,
          currentWaveIndex: nextWaveIndex,
        };
        setDungeonRun(updatedRun);

        // Start next battle
        setCurrentBattle(nextBattle);
        await saveBattle(nextBattle);
        addToast(`Wave ${nextWaveIndex + 1} of ${totalWaves}`, 'info');
      } catch (error) {
        console.error('Error starting next dungeon wave:', error);
        addToast('Failed to start next wave', 'error');
        clearDungeonRun();
      }
    } else {
      // All minion waves cleared, start boss battle
      try {
        const encounter = await generateEncounterUseCase.execute({
          dungeon: dungeon,
          waveIndex: totalWaves, // Boss is after all minion waves
          playerTeamSize: dungeonRun.playerTeam.length,
        });

        const bossBattle = await initializeBattleUseCase.execute({
          team1: dungeonRun.playerTeam,
          team2: encounter.enemyPets,
        });

        const updatedRun = {
          ...dungeonRun,
          currentWaveIndex: totalWaves, // Mark as boss encounter
        };
        setDungeonRun(updatedRun);

        setCurrentBattle(bossBattle);
        await saveBattle(bossBattle);
        addToast('Boss encounter!', 'warning');
      } catch (error) {
        console.error('Error starting boss battle:', error);
        addToast('Failed to start boss battle', 'error');
        clearDungeonRun();
      }
    }
  };

  /**
   * Complete dungeon - give rewards and mark as completed
   */
  const completeDungeon = async (run: typeof dungeonRun) => {
    if (!run || !player) return;

    try {
      const dungeon = run.dungeon;
      const rewards = dungeon.rewards;

      // Add essence rewards to player
      const updatedEssence = { ...player.essence };
      
      // Use Object.entries to iterate with type safety
      (Object.entries(rewards.essence) as [unknown, number][]).forEach(([key, amount]) => {
        const rarity = key as import('@/shared/types/rarity').Rarity;
        if (amount > 0) {
          updatedEssence[rarity] = (updatedEssence[rarity] || 0) + amount;
        }
      });

      // Mark dungeon as completed
      const dungeonId = `dungeon_floor_${dungeon.floorNumber}`;
      const updatedPlayer = player
        .withEssence(updatedEssence)
        .withCompletedDungeon(dungeonId);

      // Save player using store method
      await updatePlayer(updatedPlayer);

      // Clear dungeon run
      clearDungeonRun();

      // Show success message
      const essenceText = Object.entries(rewards.essence)
        .filter(([_, amount]) => amount > 0)
        .map(([rarity, amount]) => `${amount} ${rarity} Essence`)
        .join(', ');
      
      addToast(`Dungeon completed! Rewards: ${essenceText}`, 'success');
      
      // Navigate back to dungeon view after a delay
      setTimeout(() => {
        navigate('/dungeons');
      }, 2000);
    } catch (error) {
      console.error('Error completing dungeon:', error);
      addToast('Failed to complete dungeon', 'error');
      clearDungeonRun();
    }
  };

  const handleLoadPlayerTeam = (teamId: string) => {
    if (!player) return;
    const team = player.teams.find((t) => t.id === teamId);
    if (!team) return;

    const teamPets = team.petIds
      .map((petId) => pets.find((p) => p.id === petId))
      .filter((p): p is Pet => p !== undefined);

    // Validate team size (1-4 pets allowed)
    if (teamPets.length < 1 || teamPets.length > 4) {
      addToast('Selected team must have 1-4 pets', 'warning');
      return;
    }

    setSelectedTeam(teamPets);
    setSelectedPlayerTeamId(teamId);
    addToast(`Loaded team: ${team.name}`, 'success');
  };

  const getCurrentActor = (): CombatPet | null => {
    if (!currentBattle || currentBattle.isComplete) return null;
    return currentBattle.getCurrentActor();
  };

  const getCombatPet = (petId: string): CombatPet | null => {
    if (!currentBattle) return null;
    const allPets = [...currentBattle.team1, ...currentBattle.team2];
    return allPets.find((p) => p.pet.id === petId) || null;
  };

  const isPetAlive = (combatPet: CombatPet): boolean => {
    return combatPet.currentHp > 0;
  };

  const getHpPercentage = (combatPet: CombatPet): number => {
    if (combatPet.pet.stats.hp === 0) return 0;
    return Math.max(0, Math.min(100, (combatPet.currentHp / combatPet.pet.stats.hp) * 100));
  };

  const getEnergyPercentage = (combatPet: CombatPet): number => {
    return Math.max(0, Math.min(100, (combatPet.currentEnergy / 100) * 100));
  };

  if (!currentBattle) {
    return (
      <div className="battle-view">
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <div className="battle-view__no-battle">
          <h1>No Active Battle</h1>
          <p>Start a battle to begin combat.</p>
          <Button onClick={() => setShowStartBattleModal(true)}>Start New Battle</Button>
        </div>

        <Modal
          isOpen={showStartBattleModal}
          onClose={() => setShowStartBattleModal(false)}
          title="Start New Battle"
          size="lg"
        >
          <div className="battle-view__start-modal">
            {/* Player Team Selection */}
            {player && player.teams.length > 0 && (
              <div className="battle-view__team-selection">
                <h3>Quick Load Team</h3>
                <div className="battle-view__team-selector">
                  {player.teams.map((team) => (
                    <button
                      key={team.id}
                      className={`battle-view__team-button ${
                        selectedPlayerTeamId === team.id ? 'battle-view__team-button--active' : ''
                      }`}
                      onClick={() => handleLoadPlayerTeam(team.id)}
                    >
                      {team.name} ({team.petIds.length}/4 pets)
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="battle-view__team-selection">
              <h3>Your Team (Select 1-4 pets) - {selectedTeam.length}/4</h3>
              <div className="battle-view__pet-grid">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className={`battle-view__pet-selector ${
                      selectedTeam.includes(pet) ? 'battle-view__pet-selector--selected' : ''
                    }`}
                    onClick={() => {
                      if (selectedTeam.includes(pet)) {
                        setSelectedTeam(selectedTeam.filter((p) => p.id !== pet.id));
                      } else if (selectedTeam.length < 4) {
                        setSelectedTeam([...selectedTeam, pet]);
                      } else {
                        addToast('Team is full (maximum 4 pets)', 'warning');
                      }
                    }}
                  >
                    <div className="battle-view__pet-selector-name">{pet.name}</div>
                    <div className="battle-view__pet-selector-stats">
                      HP: {pet.stats.hp} | ATK: {pet.stats.attack} | DEF: {pet.stats.defense} | SPD: {pet.stats.speed}
                    </div>
                    <div className="battle-view__pet-selector-rarity">{pet.rarity}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="battle-view__team-selection">
              <h3>Enemy Team (Select 1-4 pets) - {selectedEnemyTeam.length}/4</h3>
              <div className="battle-view__pet-grid">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className={`battle-view__pet-selector ${
                      selectedEnemyTeam.includes(pet) ? 'battle-view__pet-selector--selected' : ''
                    } ${selectedTeam.includes(pet) ? 'battle-view__pet-selector--disabled' : ''}`}
                    onClick={() => {
                      if (selectedEnemyTeam.includes(pet)) {
                        setSelectedEnemyTeam(selectedEnemyTeam.filter((p) => p.id !== pet.id));
                      } else if (selectedEnemyTeam.length < 4 && !selectedTeam.includes(pet)) {
                        setSelectedEnemyTeam([...selectedEnemyTeam, pet]);
                      } else if (selectedTeam.includes(pet)) {
                        addToast('This pet is already in your team', 'warning');
                      } else {
                        addToast('Enemy team is full (maximum 4 pets)', 'warning');
                      }
                    }}
                  >
                    <div className="battle-view__pet-selector-name">{pet.name}</div>
                    <div className="battle-view__pet-selector-stats">
                      HP: {pet.stats.hp} | ATK: {pet.stats.attack} | DEF: {pet.stats.defense} | SPD: {pet.stats.speed}
                    </div>
                    <div className="battle-view__pet-selector-rarity">{pet.rarity}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="battle-view__modal-actions">
              <Button variant="secondary" onClick={() => setShowStartBattleModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleStartBattle}
                disabled={selectedTeam.length < 1 || selectedTeam.length > 4 || selectedEnemyTeam.length < 1 || selectedEnemyTeam.length > 4}
              >
                Start Battle
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  const currentActor = getCurrentActor();

  return (
    <div className="battle-view">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {error && (
        <div className="battle-view__error">
          <p>Error: {error}</p>
        </div>
      )}

      <div className="battle-view__header">
        <div>
          <h1>Battle</h1>
          <div className="battle-view__turn">Turn {currentBattle.currentTurn}</div>
        </div>
        <div className="battle-view__header-actions">
          {currentActor && (
            <div className="battle-view__current-actor">
              Current: {currentActor.pet.name}
            </div>
          )}
          {!currentBattle.isComplete && (
            <>
              <Button
                onClick={handleExecuteTurn}
                disabled={isExecutingTurn || isLoading}
                loading={isExecutingTurn}
              >
                {autoBattle ? 'Pause Auto' : 'Next Turn'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setAutoBattle(!autoBattle)}
                disabled={isExecutingTurn}
              >
                {autoBattle ? 'Pause Auto' : 'Auto Battle'}
              </Button>
            </>
          )}
          <Button variant="danger" onClick={handleClearBattle}>
            Clear Battle
          </Button>
        </div>
      </div>

      <div className="battle-view__teams">
        <div className="battle-view__team battle-view__team--team1">
          <h2>Your Team</h2>
          <div className="battle-view__pets">
            {currentBattle.team1.map((combatPet) => {
              const isCurrentActor = currentActor?.pet.id === combatPet.pet.id;
              const isAlive = isPetAlive(combatPet);
              
              const lastLog = currentBattle.log.length > 0 ? currentBattle.log[currentBattle.log.length - 1] : null;
              let animationState: 'idle' | 'attack' | 'hit' = 'idle';
              if (lastLog) {
                if (lastLog.action.petId === combatPet.pet.id) animationState = 'attack';
                if (lastLog.results.some(r => r.targetId === combatPet.pet.id && r.damage && r.damage > 0)) animationState = 'hit';
              }

              return (
                <div
                  key={combatPet.pet.id}
                  className={`battle-view__pet ${
                    isCurrentActor ? 'battle-view__pet--active' : ''
                  } ${!isAlive ? 'battle-view__pet--dead' : ''}`}
                >
                  <BattlePetDisplay 
                    combatPet={combatPet} 
                    isCurrentActor={isCurrentActor} 
                    isAlive={isAlive}
                    side="left"
                    animationState={animationState}
                    floatingTexts={activeFloatingTexts[combatPet.pet.id]}
                  />
                  <div className="battle-view__pet-header">
                    <div className="battle-view__pet-name">{combatPet.pet.name}</div>
                    <div className="battle-view__pet-position">{combatPet.position}</div>
                  </div>
                  
                  <div className="battle-view__pet-hp-bar">
                    <div
                      className="battle-view__pet-hp-fill"
                      style={{ width: `${getHpPercentage(combatPet)}%` }}
                    />
                    <span className="battle-view__pet-hp-text">
                      {combatPet.currentHp} / {combatPet.pet.stats.hp}
                    </span>
                  </div>
                  <div className="battle-view__pet-energy-bar">
                    <div
                      className="battle-view__pet-energy-fill"
                      style={{ width: `${getEnergyPercentage(combatPet)}%` }}
                    />
                    <span className="battle-view__pet-energy-text">
                      Energy: {combatPet.currentEnergy}
                    </span>
                  </div>
                  {(combatPet.buffs.length > 0 || combatPet.debuffs.length > 0) && (
                    <div className="battle-view__pet-statuses">
                      {combatPet.buffs.map((buff, idx) => (
                        <span key={`buff-${idx}`} className="battle-view__status buff">
                          {buff.type} +{buff.value}%
                        </span>
                      ))}
                      {combatPet.debuffs.map((debuff, idx) => (
                        <span key={`debuff-${idx}`} className="battle-view__status debuff">
                          {debuff.type} -{debuff.value}%
                        </span>
                      ))}
                    </div>
                  )}
                  {combatPet.pet.activeAbilities.length > 0 && (
                    <div className="battle-view__pet-abilities">
                      <div className="battle-view__pet-abilities-title">Abilities:</div>
                      {combatPet.pet.activeAbilities.map((ability, idx) => {
                        const canUse = ability.isAvailable(combatPet.currentEnergy);
                        return (
                          <div
                            key={idx}
                            className={`battle-view__pet-ability ${!canUse ? 'battle-view__pet-ability--unavailable' : ''}`}
                            title={ability.description}
                          >
                            <span className="battle-view__pet-ability-name">{ability.name}</span>
                            <span className="battle-view__pet-ability-cost">{ability.energyCost}⚡</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="battle-view__versus">VS</div>

        <div className="battle-view__team battle-view__team--team2">
          <h2>Enemy Team</h2>
          <div className="battle-view__pets">
            {currentBattle.team2.map((combatPet) => {
              const isCurrentActor = currentActor?.pet.id === combatPet.pet.id;
              const isAlive = isPetAlive(combatPet);

              const lastLog = currentBattle.log.length > 0 ? currentBattle.log[currentBattle.log.length - 1] : null;
              let animationState: 'idle' | 'attack' | 'hit' = 'idle';
              if (lastLog) {
                if (lastLog.action.petId === combatPet.pet.id) animationState = 'attack';
                if (lastLog.results.some(r => r.targetId === combatPet.pet.id && r.damage && r.damage > 0)) animationState = 'hit';
              }

              return (
                <div
                  key={combatPet.pet.id}
                  className={`battle-view__pet ${
                    isCurrentActor ? 'battle-view__pet--active' : ''
                  } ${!isAlive ? 'battle-view__pet--dead' : ''}`}
                >
                  <div className="battle-view__pet-header">
                    <div className="battle-view__pet-name">{combatPet.pet.name}</div>
                    <div className="battle-view__pet-position">{combatPet.position}</div>
                  </div>

                  <BattlePetDisplay 
                    combatPet={combatPet} 
                    isCurrentActor={isCurrentActor} 
                    isAlive={isAlive}
                    side="right"
                    animationState={animationState}
                    floatingTexts={activeFloatingTexts[combatPet.pet.id]}
                  />

                  <div className="battle-view__pet-hp-bar">
                    <div
                      className="battle-view__pet-hp-fill"
                      style={{ width: `${getHpPercentage(combatPet)}%` }}
                    />
                    <span className="battle-view__pet-hp-text">
                      {combatPet.currentHp} / {combatPet.pet.stats.hp}
                    </span>
                  </div>
                  <div className="battle-view__pet-energy-bar">
                    <div
                      className="battle-view__pet-energy-fill"
                      style={{ width: `${getEnergyPercentage(combatPet)}%` }}
                    />
                    <span className="battle-view__pet-energy-text">
                      Energy: {combatPet.currentEnergy}
                    </span>
                  </div>
                  {(combatPet.buffs.length > 0 || combatPet.debuffs.length > 0) && (
                    <div className="battle-view__pet-statuses">
                      {combatPet.buffs.map((buff, idx) => (
                        <span key={`buff-${idx}`} className="battle-view__status buff">
                          {buff.type} +{buff.value}%
                        </span>
                      ))}
                      {combatPet.debuffs.map((debuff, idx) => (
                        <span key={`debuff-${idx}`} className="battle-view__status debuff">
                          {debuff.type} -{debuff.value}%
                        </span>
                      ))}
                    </div>
                  )}
                  {combatPet.pet.activeAbilities.length > 0 && (
                    <div className="battle-view__pet-abilities">
                      <div className="battle-view__pet-abilities-title">Abilities:</div>
                      {combatPet.pet.activeAbilities.map((ability, idx) => {
                        const canUse = ability.isAvailable(combatPet.currentEnergy);
                        return (
                          <div
                            key={idx}
                            className={`battle-view__pet-ability ${!canUse ? 'battle-view__pet-ability--unavailable' : ''}`}
                            title={ability.description}
                          >
                            <span className="battle-view__pet-ability-name">{ability.name}</span>
                            <span className="battle-view__pet-ability-cost">{ability.energyCost}⚡</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {currentBattle.isComplete && currentBattle.winner && (
        <div className="battle-view__result">
          <h2>
            {currentBattle.winner === 'draw'
              ? "It's a Draw!"
              : currentBattle.winner === 'team1'
                ? 'Victory!'
                : 'Defeat!'}
          </h2>
          <p>Battle completed in {currentBattle.currentTurn} turns</p>
          <div className="battle-view__result-actions">
            <Button onClick={handleClearBattle}>New Battle</Button>
            <Button variant="secondary" onClick={() => navigate('/collection')}>
              Back to Collection
            </Button>
          </div>
        </div>
      )}

      <div className="battle-view__combat-log">
        <div className="battle-view__combat-log-header">
          <h3>Combat Log ({currentBattle.log.length} entries)</h3>
          <Button
            variant="secondary"
            onClick={() => setCombatLogExpanded(!combatLogExpanded)}
            style={{ fontSize: '0.85em', padding: '4px 12px' }}
          >
            {combatLogExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
        {combatLogExpanded && (
          <div className="battle-view__log-entries">
            {currentBattle.log.length === 0 ? (
              <p className="battle-view__log-empty">No actions yet</p>
            ) : (
              currentBattle.log.slice(-15).map((entry, idx) => {
                const actorPet = getCombatPet(entry.action.petId);
                const isTeam1 = currentBattle.team1.some((p) => p.pet.id === entry.action.petId);
                return (
                  <div
                    key={idx}
                    className={`battle-view__log-entry ${isTeam1 ? 'battle-view__log-entry--team1' : 'battle-view__log-entry--team2'}`}
                  >
                    <div className="battle-view__log-turn">Turn {entry.turn}</div>
                    <div className="battle-view__log-action">
                      <strong className="battle-view__log-actor">
                        {actorPet?.pet.name || 'Unknown'}
                      </strong>{' '}
                      used{' '}
                      <strong className="battle-view__log-ability">{entry.action.ability.name}</strong>
                    </div>
                    <div className="battle-view__log-results">
                      {entry.results.map((result, resultIdx) => {
                        const targetPet = getCombatPet(result.targetId);
                        const targetName = targetPet?.pet.name || 'Unknown';
                        const parts: React.ReactNode[] = [];

                        if (result.damage !== undefined) {
                          parts.push(
                            <span key="damage">
                              {targetName} took{' '}
                              <span className={result.critical ? 'battle-view__log-critical' : ''}>
                                {result.damage} damage
                              </span>
                              {result.critical && ' (CRITICAL!)'}
                            </span>
                          );
                        }
                        if (result.healing !== undefined) {
                          parts.push(
                            <span key="healing" className="battle-view__log-healing">
                              {targetName} healed for {result.healing}
                            </span>
                          );
                        }
                        if (result.buffApplied) {
                          parts.push(
                            <span key="buff" className="battle-view__log-buff">
                              {targetName} gained {result.buffApplied.type} buff
                            </span>
                          );
                        }
                        if (result.debuffApplied) {
                          parts.push(
                            <span key="debuff" className="battle-view__log-debuff">
                              {targetName} received {result.debuffApplied.type} debuff
                            </span>
                          );
                        }
                        if (result.statusApplied) {
                          parts.push(
                            <span key="status">
                              {targetName} is now {result.statusApplied}
                            </span>
                          );
                        }
                        if (result.missed) {
                          parts.push(
                            <span key="miss" className="battle-view__log-miss">
                              {targetName} missed!
                            </span>
                          );
                        }

                        return (
                          <div key={resultIdx} className="battle-view__log-result">
                            {parts.map((part, partIdx) => (
                              <React.Fragment key={partIdx}>
                                {partIdx > 0 && ', '}
                                {part}
                              </React.Fragment>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
