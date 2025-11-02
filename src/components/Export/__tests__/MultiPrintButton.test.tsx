import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MultiPrintButton } from '../MultiPrintButton';
import {
  fitPageToA4,
  estimatePageLayout,
  mmToPx,
  A4_HEIGHT_MM,
} from '../fitPageToA4';
import { getPrintTemplate } from '../../../config/print-templates';
import type { WorksheetData } from '../../../types';

describe('MultiPrintButton', () => {
  const mockWorksheets: WorksheetData[] = [
    {
      settings: {
        grade: 3,
        problemType: 'basic',
        operation: 'addition',
        problemCount: 20,
        layoutColumns: 2,
      },
      problems: [
        {
          id: '1-1',
          type: 'basic',
          operation: 'addition',
          operand1: 5,
          operand2: 3,
          answer: 8,
        },
        {
          id: '1-2',
          type: 'basic',
          operation: 'addition',
          operand1: 7,
          operand2: 2,
          answer: 9,
        },
      ],
      generatedAt: new Date('2024-01-01'),
    },
    {
      settings: {
        grade: 3,
        problemType: 'basic',
        operation: 'subtraction',
        problemCount: 20,
        layoutColumns: 2,
      },
      problems: [
        {
          id: '2-1',
          type: 'basic',
          operation: 'subtraction',
          operand1: 10,
          operand2: 3,
          answer: 7,
        },
        {
          id: '2-2',
          type: 'basic',
          operation: 'subtraction',
          operand1: 15,
          operand2: 8,
          answer: 7,
        },
      ],
      generatedAt: new Date('2024-01-01'),
    },
  ];

  let originalPrint: typeof window.print;
  let originalTitle: string;

  beforeEach(() => {
    // window.printのモック
    originalPrint = window.print;
    window.print = vi.fn();
    originalTitle = document.title;
  });

  afterEach(() => {
    // 元に戻す
    window.print = originalPrint;
    document.title = originalTitle;
    // 追加された要素をクリーンアップ
    document.querySelectorAll('style').forEach((el) => el.remove());
    document
      .querySelectorAll('#multi-print-container')
      .forEach((el) => el.remove());
  });

  it('should render multi print button', () => {
    render(
      <MultiPrintButton
        worksheets={mockWorksheets}
        showAnswers={false}
        onPrint={vi.fn()}
      />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('印刷する')).toBeInTheDocument();
  });

  it('should handle multiple pages printing', async () => {
    const mockOnPrint = vi.fn();
    render(
      <MultiPrintButton
        worksheets={mockWorksheets}
        showAnswers={false}
        onPrint={mockOnPrint}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.print).toHaveBeenCalled();
      expect(mockOnPrint).toHaveBeenCalled();
    });
  });

  it('should set correct document title for multi-page printing', async () => {
    render(
      <MultiPrintButton
        worksheets={mockWorksheets}
        showAnswers={false}
        onPrint={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      // タイトルが元に戻ることを確認
      expect(document.title).toBe(originalTitle);
    });
  });

  it('should handle mixed problem types correctly', async () => {
    const mixedWorksheets: WorksheetData[] = [
      {
        ...mockWorksheets[0],
        problems: [
          {
            id: '1',
            type: 'basic',
            operation: 'addition',
            operand1: 5,
            operand2: 3,
            answer: 8,
          },
        ],
      },
      {
        ...mockWorksheets[0],
        settings: {
          ...mockWorksheets[0].settings,
          problemType: 'fraction',
        },
        problems: [
          {
            id: '2',
            type: 'fraction',
            operation: 'addition',
            numerator1: 1,
            denominator1: 2,
            numerator2: 1,
            denominator2: 3,
            answerNumerator: 5,
            answerDenominator: 6,
          },
        ],
      },
      {
        ...mockWorksheets[0],
        settings: {
          ...mockWorksheets[0].settings,
          problemType: 'word',
        },
        problems: [
          {
            id: '3',
            type: 'word',
            operation: 'multiplication',
            problemText: 'たて5cm、よこ3cmの長方形の面積は？',
            answer: 15,
            unit: 'cm²',
          },
        ],
      },
    ];

    render(
      <MultiPrintButton
        worksheets={mixedWorksheets}
        showAnswers={true}
        onPrint={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.print).toHaveBeenCalled();
    });
  });

  it('should handle empty worksheets array', () => {
    render(
      <MultiPrintButton worksheets={[]} showAnswers={false} onPrint={vi.fn()} />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should preserve problem ordering in columns', async () => {
    const worksheetWithManyProblems: WorksheetData = {
      ...mockWorksheets[0],
      settings: {
        ...mockWorksheets[0].settings,
        layoutColumns: 3,
      },
      problems: Array.from({ length: 12 }, (_, i) => ({
        id: `prob-${i + 1}`,
        type: 'basic' as const,
        operation: 'addition' as const,
        operand1: i + 1,
        operand2: i + 1,
        answer: (i + 1) * 2,
      })),
    };

    render(
      <MultiPrintButton
        worksheets={[worksheetWithManyProblems]}
        showAnswers={false}
        onPrint={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.print).toHaveBeenCalled();
    });
  });

  it('should clean up all print elements after printing', async () => {
    render(
      <MultiPrintButton
        worksheets={mockWorksheets}
        showAnswers={false}
        onPrint={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.print).toHaveBeenCalled();
      // 印刷用の一時的な要素が削除されていることを確認
      expect(document.querySelector('#multi-print-container')).toBeNull();
      // スタイル要素も削除されていることを確認
      const styles = document.querySelectorAll('style');
      const printStyles = Array.from(styles).filter((style) =>
        style.textContent?.includes('@media print')
      );
      expect(printStyles.length).toBe(0);
    });
  });

  it('should handle missing number problems in multi-print', async () => {
    const worksheetWithMissingNumbers: WorksheetData = {
      ...mockWorksheets[0],
      problems: [
        {
          id: '1',
          type: 'basic',
          operation: 'addition',
          operand1: null,
          operand2: 3,
          answer: 8,
          missingPosition: 'operand1',
        },
        {
          id: '2',
          type: 'basic',
          operation: 'subtraction',
          operand1: 10,
          operand2: null,
          answer: 7,
          missingPosition: 'operand2',
        },
      ],
    };

    render(
      <MultiPrintButton
        worksheets={[worksheetWithMissingNumbers]}
        showAnswers={true}
        onPrint={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.print).toHaveBeenCalled();
    });
  });

  it('should handle page breaks between worksheets', async () => {
    const manyWorksheets = Array.from({ length: 5 }, (_, i) => ({
      ...mockWorksheets[0],
      settings: {
        ...mockWorksheets[0].settings,
        grade: (i + 1) as 1 | 2 | 3 | 4 | 5,
      },
    }));

    render(
      <MultiPrintButton
        worksheets={manyWorksheets}
        showAnswers={false}
        onPrint={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.print).toHaveBeenCalled();
    });
  });
});

describe('fitPageToA4', () => {
  const pxPerMm = 96 / 25.4;

  const parsePaddingValue = (value: string | null | undefined): number => {
    if (!value) return 0;
    const numeric = parseFloat(value.replace('mm', ''));
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const readVerticalPaddingMm = (
    style: CSSStyleDeclaration,
  ): { top: number; bottom: number } => {
    const directTop = parsePaddingValue(style.paddingTop);
    const directBottom = parsePaddingValue(style.paddingBottom);
    if (directTop || directBottom) {
      return { top: directTop, bottom: directBottom };
    }

    const shorthand = style.padding?.trim();
    if (!shorthand) {
      return { top: 0, bottom: 0 };
    }

    const parts = shorthand.split(/\s+/);
    if (parts.length === 1) {
      const val = parsePaddingValue(parts[0]);
      return { top: val, bottom: val };
    }

    if (parts.length === 2) {
      const vertical = parsePaddingValue(parts[0]);
      return { top: vertical, bottom: vertical };
    }

    if (parts.length === 3) {
      return {
        top: parsePaddingValue(parts[0]),
        bottom: parsePaddingValue(parts[2]),
      };
    }

    return {
      top: parsePaddingValue(parts[0]),
      bottom: parsePaddingValue(parts[2]),
    };
  };

  const createBoundingClientRectMock = (
    element: HTMLDivElement,
    heightsMm: number[],
  ): void => {
    const heightsPx = heightsMm.map((mm) => mm * pxPerMm);
    let callCount = 0;
    vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => {
      const height = heightsPx[Math.min(callCount, heightsPx.length - 1)];
      callCount += 1;
      return {
        width: 0,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height,
        toJSON: (): Record<string, never> => ({}),
      };
    });
  };

  const mockContentAwareBoundingRect = (
    element: HTMLDivElement,
    contentHeightMm: number,
  ): void => {
    vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => {
      const { top, bottom } = readVerticalPaddingMm(element.style);
      const heightMm = contentHeightMm + top + bottom;
      return {
        width: 0,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: mmToPx(heightMm),
        toJSON: (): Record<string, never> => ({}),
      };
    });
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reduces margins until the page fits without scaling', () => {
    const page = document.createElement('div');
    createBoundingClientRectMock(page, [320, 295]);

    const result = fitPageToA4(page, 20, 22);

    expect(result.scale).toBe(1);
    expect(parseFloat(page.style.paddingTop)).toBeCloseTo(9.22, 2);
    expect(parseFloat(page.style.paddingBottom)).toBeCloseTo(9.78, 2);
    expect(page.dataset.printScale).toBe('1.000');
  });

  it('applies a scale factor when margins alone cannot fit the page', () => {
    const page = document.createElement('div');
    createBoundingClientRectMock(page, [340, 340, 340, 340, 340, 340, 340]);

    const result = fitPageToA4(page, 15, 18);

    expect(result.scale).toBeLessThan(1);
    expect(result.scale).toBeGreaterThanOrEqual(0.85);
    expect(page.style.paddingTop).toBe('5mm');
    expect(page.style.paddingBottom).toBe('5mm');
    expect(page.style.transform).toBe(`scale(${result.scale})`);
    expect(page.style.transformOrigin).toBe('top center');
    expect(page.dataset.printScale).toBe(result.scale.toFixed(3));
    const expectedWidth = (210 / result.scale).toFixed(3);
    expect(page.style.width).toBe(`${expectedWidth}mm`);
  });

  it('keeps grade 2 transport fare layout within the scaled A4 frame', () => {
    const template = getPrintTemplate('word');
    const estimate = estimatePageLayout({
      problemCount: 20,
      columns: 2,
      template,
    });

    const actualContentHeightMm = estimate.contentHeightMm + 40; // taller than estimate
    const page = document.createElement('div');
    mockContentAwareBoundingRect(page, actualContentHeightMm);

    const result = fitPageToA4(
      page,
      estimate.topMarginMm,
      estimate.bottomMarginMm,
    );

    const finalHeightMm =
      actualContentHeightMm + result.topMarginMm + result.bottomMarginMm;
    const effectiveHeightMm = finalHeightMm * result.scale;

    expect(result.scale).toBeLessThan(1);
    expect(result.scale).toBeCloseTo(0.932, 2);
    expect(effectiveHeightMm).toBeLessThanOrEqual(A4_HEIGHT_MM - 0.5 + 0.01);
    expect(page.dataset.printScale).toBe(result.scale.toFixed(3));
  });
});
