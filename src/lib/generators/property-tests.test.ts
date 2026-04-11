import { describe, expect, it } from 'vitest';
import type { Grade } from '../../types';
import {
  generateSingaporeBarModel,
  generateSingaporeNumberBond,
} from './singapore-problems-en';
import {
  generateEnMissingNumber,
  generateEnWordStory,
} from './word-problem-en';
import { generateProblems } from './index';
import { assertNoDuplicateNames } from './assertions';

const SAMPLE_SIZE = 200;
const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

describe('property-based tests: Singapore Bar Model', () => {
  it.each(GRADES)(
    'grade %i: generates 200+ valid problems with unique names',
    (grade) => {
      const problems = generateSingaporeBarModel(grade, SAMPLE_SIZE);
      expect(problems.length).toBe(SAMPLE_SIZE);

      for (const p of problems) {
        expect(p.type).toBe('singapore');
        expect(p.category).toBe('bar-model');
        expect(p.problemText.trim().length).toBeGreaterThan(0);
        expect(typeof p.answer).toBe('number');
        expect(Number.isFinite(p.answer)).toBe(true);
        expect(p.answer).toBeGreaterThan(0);
        expect(() =>
          assertNoDuplicateNames(p.problemText, 'test')
        ).not.toThrow();
      }
    }
  );

  it.each(GRADES)('grade %i: bar model diagram math is consistent', (grade) => {
    const problems = generateSingaporeBarModel(grade, SAMPLE_SIZE);

    for (const p of problems) {
      if (!p.diagram || p.diagram.diagramType !== 'bar-model') continue;

      if (p.diagram.variant === 'part-whole') {
        const segmentSum = p.diagram.segments.reduce(
          (sum, s) => sum + s.value,
          0
        );
        expect(segmentSum).toBe(p.diagram.totalValue);
      }

      if (p.diagram.variant === 'comparison') {
        const bigger = Math.max(...p.diagram.bars.map((b) => b.value));
        const smaller = Math.min(...p.diagram.bars.map((b) => b.value));
        expect(bigger - smaller).toBe(p.diagram.differenceValue);
      }
    }
  });
});

describe('property-based tests: Singapore Number Bond', () => {
  it.each(GRADES)(
    'grade %i: generates 200+ valid number bond problems',
    (grade) => {
      const problems = generateSingaporeNumberBond(grade, SAMPLE_SIZE);
      expect(problems.length).toBe(SAMPLE_SIZE);

      for (const p of problems) {
        expect(p.type).toBe('singapore');
        expect(p.category).toBe('number-bond');
        expect(p.problemText.trim().length).toBeGreaterThan(0);
        expect(typeof p.answer).toBe('number');
        expect(Number.isFinite(p.answer)).toBe(true);
        expect(p.answer).toBeGreaterThan(0);
      }
    }
  );

  it.each(GRADES)('grade %i: number bond parts sum to whole', (grade) => {
    const problems = generateSingaporeNumberBond(grade, SAMPLE_SIZE);

    for (const p of problems) {
      if (!p.diagram || p.diagram.diagramType !== 'number-bond') continue;
      const partsSum = p.diagram.parts.reduce((sum, v) => sum + v, 0);
      expect(partsSum).toBe(p.diagram.whole);
    }
  });
});

describe('property-based tests: English Word Problems', () => {
  it.each(GRADES)('grade %i: missing number problems are valid', (grade) => {
    const problems = generateEnMissingNumber(grade, SAMPLE_SIZE);
    // May generate fewer than SAMPLE_SIZE due to deduplication
    expect(problems.length).toBeGreaterThan(0);

    for (const p of problems) {
      expect(p.type).toBe('word-en');
      expect(p.problemText.trim().length).toBeGreaterThan(0);
      expect(typeof p.answer).toBe('number');
      expect(Number.isFinite(p.answer as number)).toBe(true);
      expect(p.answer).toBeGreaterThan(0);
    }
  });

  it.each(GRADES)('grade %i: word story problems are valid', (grade) => {
    const problems = generateEnWordStory(grade, SAMPLE_SIZE);
    expect(problems.length).toBe(SAMPLE_SIZE);

    for (const p of problems) {
      expect(p.type).toBe('word-en');
      expect(p.problemText.trim().length).toBeGreaterThan(0);
      expect(typeof p.answer).toBe('number');
      expect(Number.isFinite(p.answer as number)).toBe(true);
      expect(p.answer).toBeGreaterThan(0);
    }
  });
});

describe('property-based tests: pattern router integration', () => {
  const englishPatterns = [
    'word-en',
    'singapore-bar-model',
    'singapore-number-bond',
    'money-change-en',
    'money-total-en',
    'money-payment-en',
    'time-reading-en',
    'time-elapsed-en',
    'time-calc-en',
    'unit-length-en',
    'unit-weight-en',
    'unit-capacity-en',
    'shopping-discount-en',
    'shopping-budget-en',
    'shopping-comparison-en',
    'temperature-diff-en',
    'temperature-conversion-en',
    'distance-walk-en',
    'distance-map-scale-en',
    'distance-comparison-en',
    'cooking-ingredients-en',
    'cooking-time-en',
    'cooking-serving-en',
    'calendar-days-en',
    'calendar-week-en',
    'calendar-age-en',
    'energy-usage-en',
    'energy-saving-en',
    'transport-fare-en',
    'transport-change-en',
    'transport-discount-en',
    'allowance-saving-en',
    'allowance-goal-en',
  ] as const;

  // Test each English pattern at grade 3 (most patterns available)
  it.each(englishPatterns)('pattern %s generates valid problems', (pattern) => {
    const grade = 3;
    const count = 20;

    const problems = generateProblems({
      grade: grade as Grade,
      problemType: 'basic',
      operation: 'addition',
      problemCount: count,
      layoutColumns: 1,
      calculationPattern: pattern,
    });

    expect(problems.length).toBe(count);

    for (const p of problems) {
      if ('problemText' in p) {
        expect((p.problemText as string).trim().length).toBeGreaterThan(0);
      }
      if ('answer' in p && typeof p.answer === 'number') {
        expect(Number.isFinite(p.answer)).toBe(true);
      }
    }
  });
});
