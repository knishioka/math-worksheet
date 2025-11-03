/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Problem, WorksheetSettings, WorksheetData } from '../types';
import { APP_CONFIG } from '../config/constants';
import { generateProblems } from '../lib/generators';

interface ProblemStore {
  settings: WorksheetSettings;
  problems: Problem[];
  updateSettings: (settings: Partial<WorksheetSettings>) => void;
  setProblems: (problems: Problem[]) => void;
  clearProblems: () => void;
  getWorksheetData: () => WorksheetData;
  buildWorksheetBatch: (pageCount: number) => WorksheetData[];
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

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      setProblems: (problems) => set({ problems }),

      clearProblems: () => set({ problems: [] }),

      getWorksheetData: () => ({
        settings: get().settings,
        problems: get().problems,
        generatedAt: new Date(),
      }),

      buildWorksheetBatch: (pageCount) => {
        const snapshotSettings = { ...get().settings };
        return Array.from({ length: pageCount }, () => ({
          settings: { ...snapshotSettings },
          problems: generateProblems(snapshotSettings),
          generatedAt: new Date(),
        }));
      },
    }),
    {
      name: 'math-worksheet-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
