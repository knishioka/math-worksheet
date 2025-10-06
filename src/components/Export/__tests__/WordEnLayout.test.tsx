import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiPrintButton } from '../MultiPrintButton';
import type { WorksheetData } from '../../../types';

/**
 * English Word Problems レイアウトテスト
 * 2列・3列で正しくグリッド表示されるかを確認
 */
describe('English Word Problems Layout', () => {
  let printContainer: HTMLDivElement | null = null;
  let capturedHTML = '';

  beforeEach(() => {
    // window.printをモック（HTMLをキャプチャ）
    global.window.print = vi.fn(() => {
      const container = document.getElementById('multi-print-container');
      if (container) {
        printContainer = container as HTMLDivElement;
        capturedHTML = container.innerHTML;
      }
    });
  });

  afterEach(() => {
    // クリーンアップ
    const existing = document.getElementById('print-container');
    if (existing) {
      existing.remove();
    }
    const multiPrint = document.getElementById('multi-print-container');
    if (multiPrint) {
      multiPrint.remove();
    }
    printContainer = null;
    capturedHTML = '';
  });

  it('should display word-en problems in 2 columns', () => {
    const worksheet: WorksheetData = {
      settings: {
        grade: 3,
        problemType: 'word-en',
        operation: 'addition',
        problemCount: 16,
        layoutColumns: 2,
      },
      problems: Array.from({ length: 16 }, (_, i) => ({
        id: `word-en-${i}`,
        type: 'word-en' as const,
        operation: 'addition' as const,
        problemText: `Problem ${i + 1}: Sam has ${i + 1} apples.`,
        answer: i + 1,
        category: 'word-story' as const,
        language: 'en' as const,
      })),
      generatedAt: new Date(),
    };

    render(
      <MultiPrintButton
        worksheets={[worksheet]}
        showAnswers={false}
        problemCountPerSheet={16}
      />
    );

    const button = screen.getByRole('button', { name: /印刷する/ });
    fireEvent.click(button);

    // printContainer とHTMLがキャプチャされていることを確認
    expect(printContainer).toBeTruthy();
    expect(capturedHTML).toBeTruthy();

    // グリッドスタイルを確認
    expect(capturedHTML).toContain('grid-template-columns: repeat(2, 1fr)');
  });

  it('should display word-en problems in 3 columns', () => {
    const worksheet: WorksheetData = {
      settings: {
        grade: 3,
        problemType: 'word-en',
        operation: 'addition',
        problemCount: 24,
        layoutColumns: 3,
      },
      problems: Array.from({ length: 24 }, (_, i) => ({
        id: `word-en-${i}`,
        type: 'word-en' as const,
        operation: 'addition' as const,
        problemText: `Problem ${i + 1}: Test problem.`,
        answer: i + 1,
        category: 'word-story' as const,
        language: 'en' as const,
      })),
      generatedAt: new Date(),
    };

    render(
      <MultiPrintButton
        worksheets={[worksheet]}
        showAnswers={false}
        problemCountPerSheet={24}
      />
    );

    const button = screen.getByRole('button', { name: /印刷する/ });
    fireEvent.click(button);

    // printContainer とHTMLがキャプチャされていることを確認
    expect(printContainer).toBeTruthy();
    expect(capturedHTML).toBeTruthy();

    // グリッドスタイルを確認
    expect(capturedHTML).toContain('grid-template-columns: repeat(3, 1fr)');
  });

  it('should have correct HTML structure for word-en in grid', () => {
    const worksheet: WorksheetData = {
      settings: {
        grade: 3,
        problemType: 'word-en',
        operation: 'addition',
        problemCount: 4,
        layoutColumns: 2,
      },
      problems: Array.from({ length: 4 }, (_, i) => ({
        id: `word-en-${i}`,
        type: 'word-en' as const,
        operation: 'addition' as const,
        problemText: `Test problem ${i + 1}`,
        answer: i + 1,
        category: 'word-story' as const,
        language: 'en' as const,
      })),
      generatedAt: new Date(),
    };

    render(
      <MultiPrintButton
        worksheets={[worksheet]}
        showAnswers={false}
        problemCountPerSheet={4}
      />
    );

    const button = screen.getByRole('button', { name: /印刷する/ });
    fireEvent.click(button);

    // キャプチャしたHTMLを確認
    expect(capturedHTML).toBeTruthy();

    // グリッドコンテナが存在することを確認
    expect(capturedHTML).toContain('display: grid');
    expect(capturedHTML).toContain('grid-template-columns: repeat(2, 1fr)');

    // Flexレイアウトの問題が存在することを確認（問題番号インライン）
    expect(capturedHTML).toContain('display: flex');
    expect(capturedHTML).toContain('Test problem 1');
    expect(capturedHTML).toContain('Test problem 2');
    expect(capturedHTML).toContain('Test problem 3');
    expect(capturedHTML).toContain('Test problem 4');

    // 正しい数の問題番号が表示されていることを確認
    const problemNumbers = capturedHTML.match(/\(\d+\)/g);
    expect(problemNumbers).toHaveLength(4);
  });

  it('should properly close div tags for word-en problems', () => {
    const worksheet: WorksheetData = {
      settings: {
        grade: 3,
        problemType: 'word-en',
        operation: 'addition',
        problemCount: 2,
        layoutColumns: 2,
      },
      problems: [
        {
          id: 'word-en-1',
          type: 'word-en' as const,
          operation: 'addition' as const,
          problemText: 'Problem 1',
          answer: 5,
          category: 'word-story' as const,
          language: 'en' as const,
        },
        {
          id: 'word-en-2',
          type: 'word-en' as const,
          operation: 'addition' as const,
          problemText: 'Problem 2',
          answer: 10,
          category: 'word-story' as const,
          language: 'en' as const,
        },
      ],
      generatedAt: new Date(),
    };

    render(
      <MultiPrintButton
        worksheets={[worksheet]}
        showAnswers={false}
        problemCountPerSheet={2}
      />
    );

    const button = screen.getByRole('button', { name: /印刷する/ });
    fireEvent.click(button);

    // キャプチャしたHTMLを確認
    expect(capturedHTML).toBeTruthy();

    // 開きタグと閉じタグの数を確認
    const openDivs = (capturedHTML.match(/<div/g) || []).length;
    const closeDivs = (capturedHTML.match(/<\/div>/g) || []).length;

    expect(openDivs).toBe(closeDivs);
  });
});
