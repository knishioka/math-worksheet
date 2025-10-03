import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Problem, WorksheetSettings, WorksheetData } from '../types';
import { APP_CONFIG } from '../config/constants';

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
  problemCount: APP_CONFIG.defaultProblemCount,
  layoutColumns: APP_CONFIG.defaultLayoutColumns,
};

export const useProblemStore = create<ProblemStore>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'math-worksheet-settings',
      partialPersist: (state) => ({ settings: state.settings }),
    }
  )
);
