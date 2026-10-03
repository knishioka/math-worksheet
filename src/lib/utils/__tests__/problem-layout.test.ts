import { describe, expect, it } from 'vitest';
import { arrangeProblems } from '../problem-layout';
import type { LayoutColumns } from '../../../types';

describe('problem order', () => {
  it.each([
    [4, 3, [1, 3, 4, 2, null, null]],
    [7, 3, [1, 4, 6, 2, 5, 7, 3, null, null]],
    [5, 2, [1, 4, 2, 5, 3, null]],
  ] as const)(
    'balances %i problems across %i columns',
    (count, columns, expected) => {
      const problems = Array.from({ length: count }, (_, index) => index + 1);
      expect(
        arrangeProblems(problems, columns).map((entry) => entry?.number ?? null)
      ).toEqual(expected);
    }
  );

  it('uses row order without changing the source numbers', () => {
    expect(arrangeProblems(['A', 'B', 'C', 'D', 'E'], 3, 'row')).toEqual([
      { problem: 'A', number: 1 },
      { problem: 'B', number: 2 },
      { problem: 'C', number: 3 },
      { problem: 'D', number: 4 },
      { problem: 'E', number: 5 },
      null,
    ]);
  });

  it('never drops or duplicates a problem and keeps column lengths within one', () => {
    for (const columns of [1, 2, 3] as LayoutColumns[]) {
      for (let count = 1; count <= 100; count++) {
        const problems = Array.from({ length: count }, (_, index) => index);
        const arranged = arrangeProblems(problems, columns);
        expect(
          arranged
            .filter((entry) => entry !== null)
            .map((entry) => entry!.problem)
            .sort((a, b) => a - b)
        ).toEqual(problems);
        const lengths = Array.from(
          { length: columns },
          (_, column) =>
            arranged.filter(
              (entry, index) => entry && index % columns === column
            ).length
        );
        expect(Math.max(...lengths) - Math.min(...lengths)).toBeLessThanOrEqual(
          1
        );
      }
    }
  });
});
