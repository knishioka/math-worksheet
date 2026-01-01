import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// localStorage mock for Zustand persist middleware
const localStorageMock = ((): Storage => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key: (index: number): string | null => Object.keys(store)[index] || null,
  };
})();
vi.stubGlobal('localStorage', localStorageMock);

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
});
