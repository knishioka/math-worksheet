import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import type { WorksheetSettings, Problem } from '../../types';

let generateProblemsMock: Mock<[WorksheetSettings], Problem[]>;

vi.mock('../../lib/generators', (): unknown => ({
  generateProblems: (settings: WorksheetSettings) =>
    generateProblemsMock(settings),
}));

import { useProblemStore } from '../problemStore';

const settingsSnapshot: WorksheetSettings = {
  grade: 3,
  problemType: 'basic',
  operation: 'multiplication',
  problemCount: 5,
  layoutColumns: 2,
};

describe('useProblemStore.buildWorksheetBatch', () => {
  beforeEach(() => {
    generateProblemsMock = vi.fn((settings: WorksheetSettings): Problem[] =>
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

  it('creates the requested number of worksheets using the active settings', () => {
    const batch = useProblemStore.getState().buildWorksheetBatch(3);

    expect(batch).toHaveLength(3);
    expect(generateProblemsMock).toHaveBeenCalledTimes(3);
    batch.forEach((worksheet) => {
      expect(worksheet.settings).toEqual(settingsSnapshot);
      expect(worksheet.problems).toHaveLength(settingsSnapshot.problemCount);
      expect(worksheet.generatedAt).toBeInstanceOf(Date);
    });
  });
});
