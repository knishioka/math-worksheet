import { create } from 'zustand';
import type { Problem, WorksheetSettings, WorksheetData } from '../types';
import { APP_CONFIG } from '../config/constants';
import { generateProblems } from '../lib/generators';
import { parseUrlSettings } from '../lib/utils/url-state';

export type UpdateSettingsPayload = Partial<WorksheetSettings>;
export type WorksheetBatch = WorksheetData[];

export interface ProblemStoreState {
  settings: WorksheetSettings;
  problems: Problem[];
}

export interface ProblemStoreActions {
  updateSettings: (settings: UpdateSettingsPayload) => void;
  setProblems: (problems: Problem[]) => void;
  clearProblems: () => void;
  reset: () => void;
  getWorksheetData: () => WorksheetData;
  buildWorksheetBatch: (
    pageCount: number,
    baseWorksheet?: WorksheetData
  ) => WorksheetBatch;
}

type ProblemStore = ProblemStoreState & ProblemStoreActions;

export const defaultSettings: WorksheetSettings = {
  grade: 1,
  problemType: 'basic',
  operation: 'addition',
  problemCount: APP_CONFIG.defaultProblemCount,
  layoutColumns: APP_CONFIG.defaultLayoutColumns,
};

/**
 * 共有URLの設定を「最初の描画」から反映させるため、ストア生成時に取り込む。
 *
 * マウント後の useEffect で反映すると、復元前のデフォルト設定で描画される
 * 一瞬が生まれる。その間に走る各コンポーネントの初期化 effect
 * （パターンの自動選択・推奨問題数の自動適用・URLの書き戻し）が
 * 復元値を打ち消してしまうため、描画前に確定させる。
 */
export function getInitialSettings(): WorksheetSettings {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  return {
    ...defaultSettings,
    ...parseUrlSettings(window.location.search, defaultSettings),
  };
}

export const useProblemStore = create<ProblemStore>()((set, get) => ({
  settings: getInitialSettings(),
  problems: [],

  updateSettings: (newSettings): void => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  setProblems: (problems): void => {
    set({ problems });
  },

  clearProblems: (): void => {
    set({ problems: [] });
  },

  reset: (): void => {
    set({
      settings: { ...defaultSettings },
      problems: [],
    });
  },

  getWorksheetData: (): WorksheetData => ({
    settings: get().settings,
    problems: get().problems,
    generatedAt: new Date(),
  }),

  buildWorksheetBatch: (pageCount, baseWorksheet): WorksheetBatch => {
    if (pageCount <= 0) {
      return [];
    }

    const baseSettings = baseWorksheet
      ? { ...baseWorksheet.settings }
      : { ...get().settings };

    const worksheets: WorksheetBatch = [];

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
}));
