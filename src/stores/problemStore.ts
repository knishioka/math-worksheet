import { create } from 'zustand';
import type { Problem, WorksheetSettings, WorksheetData } from '../types';

interface ProblemStore {
  settings: WorksheetSettings;
  problems: Problem[];
  updateSettings: (settings: Partial<WorksheetSettings>) => void;
  setProblems: (problems: Problem[]) => void;
  clearProblems: () => void;
  getWorksheetData: () => WorksheetData;
}

const defaultSettings: WorksheetSettings = {
  grade: 1,
  problemType: 'basic',
  operation: 'addition',
  problemCount: 20,
  layoutColumns: 2,
};

export const useProblemStore = create<ProblemStore>((set, get) => ({
  settings: defaultSettings,
  problems: [],

  updateSettings: (newSettings): void =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  setProblems: (problems): void => set({ problems }),

  clearProblems: (): void => set({ problems: [] }),

  getWorksheetData: (): WorksheetData => ({
    settings: get().settings,
    problems: get().problems,
    generatedAt: new Date(),
  }),
}));
