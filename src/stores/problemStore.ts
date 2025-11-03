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
  buildWorksheetBatch: (
    pageCount: number,
    baseWorksheet?: WorksheetData
  ) => WorksheetData[];
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

      buildWorksheetBatch: (pageCount, baseWorksheet) => {
        if (pageCount <= 0) {
          return [];
        }

        const baseSettings = baseWorksheet
          ? { ...baseWorksheet.settings }
          : { ...get().settings };

        const worksheets: WorksheetData[] = [];

        if (baseWorksheet) {
          worksheets.push({
            settings: { ...baseWorksheet.settings },
            problems: baseWorksheet.problems,
            generatedAt: baseWorksheet.generatedAt,
          });
        }

        const remainingPages = Math.max(pageCount - worksheets.length, 0);

        for (let i = 0; i < remainingPages; i += 1) {
          const settingsSnapshot = { ...baseSettings };
          worksheets.push({
            settings: settingsSnapshot,
            problems: generateProblems(settingsSnapshot),
            generatedAt: new Date(),
          });
        }

        return worksheets;
      },
    }),
    {
      name: 'math-worksheet-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
