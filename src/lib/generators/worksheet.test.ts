import { describe, expect, it, vi } from 'vitest';
import type { WorksheetSettings } from '../../types';
import { buildWorksheet } from './worksheet';

const settings: WorksheetSettings = {
  grade: 2,
  problemType: 'basic',
  operation: 'addition',
  calculationPattern: 'add-double-digit-carry',
  problemCount: 8,
  layoutColumns: 2,
};

describe('worksheet updates', () => {
  it.each(['frac-to-decimal', 'decimal-to-frac'] as const)(
    'keeps %s unique through growth, shrinkage and layout changes',
    (calculationPattern) => {
      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      try {
        const conversionSettings = {
          ...settings,
          grade: 4 as const,
          calculationPattern,
        };
        const previous = buildWorksheet(conversionSettings);
        const more = buildWorksheet(
          { ...conversionSettings, problemCount: 100 },
          previous
        );
        expect(more.problems.slice(0, 8)).toEqual(previous.problems);
        expect(more.problems).toHaveLength(100);
        const less = buildWorksheet(conversionSettings, more);
        const regrown = buildWorksheet(
          { ...conversionSettings, problemCount: 100, layoutColumns: 3 },
          less
        );
        expect(regrown.problems.slice(0, 8)).toEqual(previous.problems);
        const texts = regrown.problems.map((problem) =>
          problem.type === 'word' ? problem.problemText : ''
        );
        expect(new Set(texts).size).toBe(100);
        expect(regrown.generatedAt).toBe(previous.generatedAt);
        expect(previous.problems).toHaveLength(8);
      } finally {
        randomSpy.mockRestore();
      }
    }
  );

  it('preserves problems and generation date when adjusting layout and equation lines', () => {
    const previous = buildWorksheet(settings);
    const next = buildWorksheet(
      {
        ...settings,
        layoutColumns: 1,
        showEquationLine: true,
        problemOrder: 'row',
      },
      previous
    );
    expect(next.problems).toBe(previous.problems);
    expect(next.generatedAt).toBe(previous.generatedAt);
    expect(previous.settings.layoutColumns).toBe(2);
    expect(next.settings.layoutColumns).toBe(1);
  });

  it('adds only the missing problems and removes only the tail', () => {
    const previous = buildWorksheet(settings);
    const more = buildWorksheet({ ...settings, problemCount: 10 }, previous);
    expect(more.problems).toHaveLength(10);
    expect(more.problems.slice(0, 8)).toEqual(previous.problems);
    expect(previous.problems).toHaveLength(8);
    const less = buildWorksheet({ ...settings, problemCount: 3 }, more);
    expect(less.problems).toEqual(previous.problems.slice(0, 3));
  });

  it('regenerates all problems for a different material or an explicit reset', () => {
    const previous = buildWorksheet(settings);
    const next = buildWorksheet(
      { ...settings, calculationPattern: 'sub-double-digit-borrow' },
      previous
    );
    expect(
      next.problems.every((problem) => problem.operation === 'subtraction')
    ).toBe(true);
    expect(
      next.problems.some((problem) => previous.problems.includes(problem))
    ).toBe(false);
    expect(
      buildWorksheet(settings).problems.some((problem) =>
        previous.problems.includes(problem)
      )
    ).toBe(false);
  });

  it('keeps all ten tracing digits when changing the fixed layout', () => {
    const tracing = {
      ...settings,
      grade: 0 as const,
      problemType: 'number-tracing' as const,
    };
    const previous = buildWorksheet(tracing);
    expect(
      buildWorksheet({ ...tracing, problemCount: 5 }, previous).problems
    ).toBe(previous.problems);
  });
});
