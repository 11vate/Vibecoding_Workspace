/**
 * Pet Store (Zustand)
 * Manages pet collection state with repository integration
 */

import { create } from 'zustand';
import type { Pet } from '@/domain/entities/Pet';
import type { PetId } from '@/shared/types/brands';
import type { IPetRepository } from '@/domain/repositories/IPetRepository';
import { PetRepository } from '@/infrastructure/persistence/repositories/PetRepository';

interface PetStore {
  pets: Pet[];
  selectedPet: Pet | null;
  isLoading: boolean;
  error: string | null;

  // Repository instance
  repository: IPetRepository;

  // Synchronous actions
  setPets: (pets: Pet[]) => void;
  selectPet: (pet: Pet | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getPetById: (id: string) => Pet | undefined;

  // Async repository actions
  loadPets: () => Promise<void>;
  loadPet: (petId: PetId) => Promise<Pet | null>;
  savePet: (pet: Pet) => Promise<void>;
  deletePet: (petId: PetId) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [],
  selectedPet: null,
  isLoading: false,
  error: null,
  repository: new PetRepository(),

  setPets: (pets) => set({ pets }),
  selectPet: (pet) => set({ selectedPet: pet }),
  getPetById: (id: string) => get().pets.find((p) => p.id === id),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  loadPets: async () => {
    const { repository, setLoading, setError, setPets } = get();
    setLoading(true);
    setError(null);
    try {
      const pets = await repository.findAll();
      setPets(pets);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load pets';
      setError(errorMessage);
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  },

  loadPet: async (petId: PetId) => {
    const { repository, setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const pet = await repository.findById(petId);
      if (pet) {
        // Update in store if found
        const { pets, setPets } = get();
        const updatedPets = pets.some((p) => p.id === petId)
          ? pets.map((p) => (p.id === petId ? pet : p))
          : [...pets, pet];
        setPets(updatedPets);
      }
      return pet;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load pet';
      setError(errorMessage);
      console.error('Error loading pet:', error);
      return null;
    } finally {
      setLoading(false);
    }
  },

  savePet: async (pet: Pet) => {
    const { repository, setLoading, setError, pets, setPets } = get();
    setLoading(true);
    setError(null);
    try {
      await repository.save(pet);
      // Update store
      const updatedPets = pets.some((p) => p.id === pet.id)
        ? pets.map((p) => (p.id === pet.id ? pet : p))
        : [...pets, pet];
      setPets(updatedPets);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save pet';
      setError(errorMessage);
      console.error('Error saving pet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  deletePet: async (petId: PetId) => {
    const { repository, setLoading, setError, pets, setPets, selectedPet } = get();
    setLoading(true);
    setError(null);
    try {
      await repository.delete(petId);
      // Update store
      setPets(pets.filter((p) => p.id !== petId));
      if (selectedPet?.id === petId) {
        set({ selectedPet: null });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete pet';
      setError(errorMessage);
      console.error('Error deleting pet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  updatePet: async (pet: Pet) => {
    const { savePet } = get();
    return savePet(pet);
  },
}));








