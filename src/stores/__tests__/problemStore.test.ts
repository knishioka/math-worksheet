import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import type { WorksheetSettings, Problem, WorksheetData } from '../../types';

let generateProblemsMock: Mock<(settings: WorksheetSettings) => Problem[]>;

vi.mock(
  '../../lib/generators',
  (): { generateProblems: (settings: WorksheetSettings) => Problem[] } => ({
    generateProblems: (settings: WorksheetSettings) =>
      generateProblemsMock(settings),
  })
);

import { useProblemStore } from '../problemStore';

const settingsSnapshot: WorksheetSettings = {
  grade: 3,
  problemType: 'basic',
  operation: 'multiplication',
  problemCount: 5,
  layoutColumns: 2,
};

const baseProblems: Problem[] = Array.from(
  { length: settingsSnapshot.problemCount },
  (_, index) => ({
    id: `base-${index}`,
    type: 'basic',
    operation: settingsSnapshot.operation,
    operand1: index + 1,
    operand2: index + 2,
    answer: index + index + 3,
  })
);

const baseWorksheet: WorksheetData = {
  settings: settingsSnapshot,
  problems: baseProblems,
  generatedAt: new Date('2024-01-01T00:00:00Z'),
};

describe('useProblemStore.buildWorksheetBatch', () => {
  beforeEach(() => {
    generateProblemsMock = vi.fn<(settings: WorksheetSettings) => Problem[]>(
      (settings: WorksheetSettings): Problem[] =>
        Array.from({ length: settings.problemCount }, (_, index) => ({
          id: `problem-${index}`,
          type: 'basic',
          operation: settings.operation,
          operand1: index,
          operand2: index + 1,
          answer: index + index + 1,
        }))
    );
    useProblemStore.setState({
      settings: settingsSnapshot,
      problems: [],
    });
  });

  it('seeds the batch with the provided base worksheet and generates the remainder', () => {
    const batch = useProblemStore
      .getState()
      .buildWorksheetBatch(3, baseWorksheet);

    expect(batch).toHaveLength(3);
    expect(batch[0].settings).toEqual(baseWorksheet.settings);
    expect(batch[0].problems).toBe(baseWorksheet.problems);
    expect(batch[0].generatedAt).toBe(baseWorksheet.generatedAt);
    expect(generateProblemsMock).toHaveBeenCalledTimes(2);

    batch.slice(1).forEach((worksheet) => {
      expect(worksheet.settings).toEqual(baseWorksheet.settings);
      expect(worksheet.problems).toHaveLength(
        baseWorksheet.settings.problemCount
      );
      expect(worksheet.generatedAt).toBeInstanceOf(Date);
    });
  });

  it('falls back to the active settings when a base worksheet is not provided', () => {
    const batch = useProblemStore.getState().buildWorksheetBatch(2);

    expect(batch).toHaveLength(2);
    expect(generateProblemsMock).toHaveBeenCalledTimes(2);
    batch.forEach((worksheet) => {
      expect(worksheet.settings).toEqual(settingsSnapshot);
      expect(worksheet.problems).toHaveLength(settingsSnapshot.problemCount);
      expect(worksheet.generatedAt).toBeInstanceOf(Date);
    });
  });
});
