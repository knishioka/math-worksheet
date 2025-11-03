import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { WorksheetData, WorksheetSettings, Problem } from '../../../types';
import type { UseReactToPrintOptions } from 'react-to-print';

let mockHandlePrint: Mock<() => Promise<void> | void>;
let storedPrintOptions: UseReactToPrintOptions | undefined;

vi.mock(
  'react-to-print',
  (): {
    __esModule: true;
    useReactToPrint: (
      options: UseReactToPrintOptions
    ) => (...args: []) => Promise<void> | void;
  } => ({
    __esModule: true,
    useReactToPrint: (
      options: UseReactToPrintOptions
    ): ((...args: []) => Promise<void> | void) => {
      storedPrintOptions = options;
      return (...args: []): Promise<void> | void =>
        mockHandlePrint(...args);
    },
  })
);

let generateProblemsMock: Mock<(settings: WorksheetSettings) => Problem[]>;

vi.mock(
  '../../../lib/generators',
  (): {
    generateProblems: (settings: WorksheetSettings) => Problem[];
  } => ({
    generateProblems: (settings: WorksheetSettings) =>
      generateProblemsMock(settings),
  })
);

import { WorksheetPreview } from '../WorksheetPreview';
import { useProblemStore } from '../../../stores/problemStore';

const baseSettings: WorksheetSettings = {
  grade: 2,
  problemType: 'basic',
  operation: 'addition',
  problemCount: 4,
  layoutColumns: 2,
};

const baseProblems: Problem[] = Array.from({ length: baseSettings.problemCount }, (_, index) => ({
  id: `base-${index}`,
  type: 'basic',
  operation: 'addition',
  operand1: index + 1,
  operand2: index + 2,
  answer: index + index + 3,
}));

const baseWorksheet: WorksheetData = {
  settings: baseSettings,
  problems: baseProblems,
  generatedAt: new Date('2024-01-01T00:00:00Z'),
};

describe('WorksheetPreview multi-page printing', () => {
  beforeEach(() => {
    mockHandlePrint = vi.fn<() => Promise<void> | void>(async () => {
      if (storedPrintOptions?.onBeforePrint) {
        await storedPrintOptions.onBeforePrint();
      }
      storedPrintOptions?.onAfterPrint?.();
    });
    generateProblemsMock = vi.fn<(settings: WorksheetSettings) => Problem[]>(
      (settings: WorksheetSettings): Problem[] =>
        Array.from({ length: settings.problemCount }, (_, index) => ({
          id: `generated-${index}`,
          type: 'basic',
          operation: settings.operation,
          operand1: index,
          operand2: index + 1,
          answer: index + index + 1,
        }))
    );
    storedPrintOptions = undefined;
    useProblemStore.setState({
      settings: baseSettings,
      problems: baseProblems,
    });
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('closes the dialog, generates worksheets, triggers print, and cleans up for multi-page requests', async () => {
    render(<WorksheetPreview worksheetData={baseWorksheet} />);

    fireEvent.click(
      screen.getByRole('button', { name: '印刷（複数ページにも対応）' })
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '3' } });

    fireEvent.click(screen.getByRole('button', { name: '印刷する' }));

    await waitFor(() => {
      expect(screen.queryByText('複数枚印刷')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(generateProblemsMock).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(mockHandlePrint).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getAllByText('名前：')).toHaveLength(1);
    });
  });
});
