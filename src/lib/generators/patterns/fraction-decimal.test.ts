import { afterEach, describe, expect, it, vi } from 'vitest';
import type { WorksheetSettings } from '../../../types';
import { generateProblems } from '../index';
import { generateFractionDecimalProblems } from './fraction-decimal';

const settings: WorksheetSettings = {
  grade: 4,
  problemType: 'basic',
  operation: 'division',
  calculationPattern: 'frac-to-decimal',
  problemCount: 100,
  layoutColumns: 3,
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

afterEach(() => vi.restoreAllMocks());

describe('fraction/decimal conversions', () => {
  for (const grade of [4, 5] as const) {
    it(`generates exact terminating decimals in grade ${grade}`, () => {
      const problems = generateProblems({ ...settings, grade });
      expect(problems).toHaveLength(100);
      const texts = problems.map((problem) => {
        expect(problem.type).toBe('word');
        if (problem.type !== 'word') throw new Error('Expected word problem');
        const match = problem.problemText.match(/^(\d+)\/(\d+)を小数/);
        expect(match).not.toBeNull();
        const numerator = Number(match![1]);
        const denominator = Number(match![2]);
        expect([2, 4, 5, 10, 20, 25, 50, 100]).toContain(denominator);
        expect(numerator).toBeGreaterThan(0);
        expect(numerator).toBeLessThan(denominator);
        expect(problem.answer).toBe(numerator / denominator);
        expect(Number(Number(problem.answer).toFixed(2))).toBe(problem.answer);
        return problem.problemText;
      });
      expect(new Set(texts).size).toBe(100);
    });

    it(`reduces decimal answers using exact integer arithmetic in grade ${grade}`, () => {
      const problems = generateProblems({
        ...settings,
        grade,
        calculationPattern: 'decimal-to-frac',
      });
      expect(problems).toHaveLength(100);
      const texts = problems.map((problem) => {
        if (problem.type !== 'word') throw new Error('Expected word problem');
        const match = problem.problemText.match(/^(\d+\.\d{1,2})を約分/);
        expect(match).not.toBeNull();
        const hundredths = Math.round(Number(match![1]) * 100);
        const [numerator, denominator] = String(problem.answer)
          .split('/')
          .map(Number);
        expect(gcd(numerator, denominator)).toBe(1);
        expect(numerator * 100).toBe(hundredths * denominator);
        expect(problem.problemText).toContain('約分');
        return problem.problemText;
      });
      expect(new Set(texts).size).toBe(100);
    });
  }

  it.each(['frac-to-decimal', 'decimal-to-frac'] as const)(
    'never repeats %s questions even with a constant random source',
    (calculationPattern) => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const problems = generateFractionDecimalProblems(
        { ...settings, calculationPattern },
        100
      );
      expect(new Set(problems.map((problem) => problem.problemText)).size).toBe(
        100
      );
    }
  );

  it('includes tenths and hundredths and known reduced answers', () => {
    const problems = generateFractionDecimalProblems(
      { ...settings, calculationPattern: 'decimal-to-frac' },
      198
    );
    for (const [decimal, answer] of [
      ['0.1', '1/10'],
      ['0.01', '1/100'],
      ['0.5', '1/2'],
      ['0.75', '3/4'],
      ['1.25', '5/4'],
    ]) {
      expect(
        problems.find((problem) =>
          problem.problemText.startsWith(`${decimal}を`)
        )?.answer
      ).toBe(answer);
    }
  });
});
