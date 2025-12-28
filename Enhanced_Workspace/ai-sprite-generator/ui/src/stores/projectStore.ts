import { create } from 'zustand';

export interface ProjectAnalysis {
  engine: string;
  missingAssets: number;
  existingAssets: number;
  suggestions?: any[];
}

interface ProjectState {
  currentProject: string | null;
  analysis: ProjectAnalysis | null;
  setProject: (path: string | null) => void;
  setAnalysis: (analysis: ProjectAnalysis | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  analysis: null,
  setProject: (path) => set({ currentProject: path }),
  setAnalysis: (analysis) => set({ analysis }),
}));







