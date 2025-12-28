/**
 * Team Builder Component
 * Manages player teams with pet selection and formation editing
 */

import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { usePetStore } from '../../stores/petStore';
import { PetCard } from '../common/PetCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import type { Team } from '@/domain/entities/Player';
import type { Pet } from '@/domain/entities/Pet';
import './TeamBuilder.css';

export const TeamBuilder: React.FC = () => {
  const { player, loadPlayer, updateTeam, addTeam, removeTeam } = usePlayerStore();
  const { pets, loadPets } = usePetStore();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [showPetSelector, setShowPetSelector] = useState(false);
  const [selectingSlot, setSelectingSlot] = useState<number | null>(null);

  useEffect(() => {
    loadPlayer();
    loadPets();
  }, [loadPlayer, loadPets]);

  // const selectedTeam = player?.teams.find((t) => t.id === selectedTeamId) || null; // Currently unused

  const handleCreateTeam = async () => {
    if (!player || !newTeamName.trim()) return;

    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: newTeamName.trim(),
      petIds: [],
      formation: ['front', 'front', 'back', 'back'],
    };

    await addTeam(newTeam);
    setNewTeamName('');
    setShowCreateModal(false);
    setSelectedTeamId(newTeam.id);
    setEditingTeam({ ...newTeam });
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeamId(team.id);
    setEditingTeam({ ...team });
  };

  const handleSaveTeam = async () => {
    if (!editingTeam || !player) return;
    await updateTeam(editingTeam);
    setEditingTeam(null);
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!player) return;
    if (confirm('Are you sure you want to delete this team?')) {
      await removeTeam(teamId);
      if (selectedTeamId === teamId) {
        setSelectedTeamId(null);
        setEditingTeam(null);
      }
    }
  };

  const handleSelectPet = (pet: Pet) => {
    if (!editingTeam || selectingSlot === null) return;

    const newPetIds = [...editingTeam.petIds];
    newPetIds[selectingSlot] = pet.id;
    
    // Ensure array has 4 slots
    while (newPetIds.length < 4) {
      newPetIds.push('');
    }

    setEditingTeam({
      ...editingTeam,
      petIds: newPetIds.slice(0, 4),
    });
    setShowPetSelector(false);
    setSelectingSlot(null);
  };

  const handleRemovePet = (index: number) => {
    if (!editingTeam) return;
    const newPetIds = [...editingTeam.petIds];
    newPetIds[index] = '';
    setEditingTeam({
      ...editingTeam,
      petIds: newPetIds,
    });
  };

  const handleToggleFormation = (index: number) => {
    if (!editingTeam) return;
    const newFormation = [...editingTeam.formation] as ('front' | 'back')[];
    newFormation[index] = newFormation[index] === 'front' ? 'back' : 'front';
    setEditingTeam({
      ...editingTeam,
      formation: newFormation,
    });
  };

  const getPetById = (petId: string): Pet | null => {
    return pets.find((p) => p.id === petId) || null;
  };

  const availablePets = pets.filter(
    (pet) => !editingTeam?.petIds.includes(pet.id) || editingTeam?.petIds[selectingSlot || -1] === pet.id
  );

  return (
    <div className="team-builder">
      <div className="team-builder__header">
        <h1>Team Builder</h1>
        <Button onClick={() => setShowCreateModal(true)} variant="primary">
          Create New Team
        </Button>
      </div>

      {!player && (
        <div className="team-builder__loading">
          <p>Loading player data...</p>
        </div>
      )}

      {player && (
        <>
          {/* Team List */}
          <div className="team-builder__teams">
            <h2>Your Teams</h2>
            {player.teams.length === 0 ? (
              <p className="team-builder__empty">No teams yet. Create your first team!</p>
            ) : (
              <div className="team-builder__team-list">
                {player.teams.map((team) => (
                  <div
                    key={team.id}
                    className={`team-builder__team-item ${
                      selectedTeamId === team.id ? 'team-builder__team-item--selected' : ''
                    }`}
                    onClick={() => handleEditTeam(team)}
                  >
                    <h3>{team.name}</h3>
                    <div className="team-builder__team-pets">
                      {team.petIds.map((petId, index) => {
                        const pet = getPetById(petId);
                        return pet ? (
                          <div key={index} className="team-builder__team-pet-preview">
                            {pet.name}
                          </div>
                        ) : (
                          <div key={index} className="team-builder__team-pet-empty">Empty</div>
                        );
                      })}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team.id);
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Editor */}
          {editingTeam && (
            <div className="team-builder__editor">
              <h2>Edit Team: {editingTeam.name}</h2>
              <div className="team-builder__formation">
                <div className="team-builder__front-row">
                  <h3>Front Row</h3>
                  <div className="team-builder__slots">
                    {[0, 1].map((index) => {
                      const petId = editingTeam.petIds[index] || '';
                      const pet = petId ? getPetById(petId) : null;
                      return (
                        <div key={index} className="team-builder__slot">
                          {pet ? (
                            <>
                              <PetCard pet={pet} size="medium" />
                              <div className="team-builder__slot-actions">
                                <Button
                                  onClick={() => {
                                    setSelectingSlot(index);
                                    setShowPetSelector(true);
                                  }}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Change
                                </Button>
                                <Button
                                  onClick={() => handleRemovePet(index)}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Remove
                                </Button>
                                <Button
                                  onClick={() => handleToggleFormation(index)}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Move to Back
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="team-builder__slot-empty">
                              <p>Empty Slot</p>
                              <Button
                                onClick={() => {
                                  setSelectingSlot(index);
                                  setShowPetSelector(true);
                                }}
                                variant="primary"
                                size="sm"
                              >
                                Add Pet
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="team-builder__back-row">
                  <h3>Back Row</h3>
                  <div className="team-builder__slots">
                    {[2, 3].map((index) => {
                      const petId = editingTeam.petIds[index] || '';
                      const pet = petId ? getPetById(petId) : null;
                      return (
                        <div key={index} className="team-builder__slot">
                          {pet ? (
                            <>
                              <PetCard pet={pet} size="medium" />
                              <div className="team-builder__slot-actions">
                                <Button
                                  onClick={() => {
                                    setSelectingSlot(index);
                                    setShowPetSelector(true);
                                  }}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Change
                                </Button>
                                <Button
                                  onClick={() => handleRemovePet(index)}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Remove
                                </Button>
                                <Button
                                  onClick={() => handleToggleFormation(index)}
                                  variant="secondary"
                                  size="sm"
                                >
                                  Move to Front
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="team-builder__slot-empty">
                              <p>Empty Slot</p>
                              <Button
                                onClick={() => {
                                  setSelectingSlot(index);
                                  setShowPetSelector(true);
                                }}
                                variant="primary"
                                size="sm"
                              >
                                Add Pet
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="team-builder__editor-actions">
                <Button onClick={handleSaveTeam} variant="primary" size="lg">
                  Save Team
                </Button>
                <Button
                  onClick={() => {
                    setEditingTeam(null);
                    setSelectedTeamId(null);
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Team"
        >
          <div className="team-builder__create-form">
            <Input
              type="text"
              placeholder="Team name..."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTeamName.trim()) {
                  handleCreateTeam();
                }
              }}
            />
            <div className="team-builder__create-actions">
              <Button onClick={handleCreateTeam} disabled={!newTeamName.trim()} variant="primary">
                Create
              </Button>
              <Button onClick={() => setShowCreateModal(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Pet Selector Modal */}
      {showPetSelector && (
        <Modal
          isOpen={showPetSelector}
          onClose={() => {
            setShowPetSelector(false);
            setSelectingSlot(null);
          }}
          title="Select Pet"
        >
          <div className="team-builder__pet-selector">
            {availablePets.length === 0 ? (
              <p>No available pets to select.</p>
            ) : (
              <div className="team-builder__pet-grid">
                {availablePets.map((pet) => (
                  <div
                    key={pet.id}
                    className="team-builder__pet-select-item"
                    onClick={() => handleSelectPet(pet)}
                  >
                    <PetCard pet={pet} size="small" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};


