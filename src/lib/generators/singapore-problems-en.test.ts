import { describe, expect, it } from 'vitest';
import type { WorksheetSettings } from '../../types';
import { generateProblems } from './index';
import {
  generateSingaporeBarModel,
  generateSingaporeNumberBond,
} from './singapore-problems-en';

describe('singapore-problems-en generators', () => {
  it('generates bar model problems with diagrams for grade 1-2', () => {
    const problems = generateSingaporeBarModel(1, 12);
    expect(problems).toHaveLength(12);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.category).toBe('bar-model');
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeDefined();
    });
  });

  it('generates bar model problems without diagrams for grade 3+', () => {
    const problems = generateSingaporeBarModel(4, 12);
    expect(problems).toHaveLength(12);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.category).toBe('bar-model');
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeUndefined();
    });
  });

  it('generates number bond problems with diagrams for grade 1', () => {
    const problems = generateSingaporeNumberBond(1, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.category).toBe('number-bond');
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeDefined();
    });
  });

  it('generates number bond problems without diagrams for grade 2+', () => {
    const problems = generateSingaporeNumberBond(4, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.category).toBe('number-bond');
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeUndefined();
    });
  });

  it('never reuses the same name in two-person Singapore prompts', () => {
    const barModelProblems = generateSingaporeBarModel(4, 200);

    const selfReferencePattern =
      /\b([A-Z][a-z]+)\b has \d+ (?:more than|times as many as) \1\b/;

    barModelProblems.forEach((problem) => {
      expect(selfReferencePattern.test(problem.problemText)).toBe(false);
    });
  });
});

// ── Structure diversity tests ────────────────────────────────────────

describe('bar model structure diversity', () => {
  it('grade 3-4: produces multi-step, 3-part, and before/after variants', () => {
    const problems = generateSingaporeBarModel(4, 200);
    const hasMultiStep = problems.some((p) =>
      p.problemText.includes('times as many')
    );
    const has3Part = problems.some((p) => p.problemText.includes('3 pieces'));
    const hasBeforeAfter = problems.some((p) =>
      p.problemText.includes('gave away')
    );
    expect(hasMultiStep).toBe(true);
    expect(has3Part).toBe(true);
    expect(hasBeforeAfter).toBe(true);
  });

  it('grade 5-6: produces ratio-based, transfer, and fraction multi-step variants', () => {
    const problems = generateSingaporeBarModel(6, 200);
    const hasRatio = problems.some((p) => p.problemText.includes('ratio'));
    const hasTransfer = problems.some((p) =>
      p.problemText.includes('gives some')
    );
    const hasFractionStep = problems.some((p) =>
      p.problemText.includes('remainder')
    );
    expect(hasRatio).toBe(true);
    expect(hasTransfer).toBe(true);
    expect(hasFractionStep).toBe(true);
  });

  it('grade 1-2: only produces simple part-whole and comparison', () => {
    const problems = generateSingaporeBarModel(1, 200);
    problems.forEach((p) => {
      expect(p.problemText.includes('ratio')).toBe(false);
      expect(p.problemText.includes('gave away')).toBe(false);
      expect(p.problemText.includes('3 pieces')).toBe(false);
    });
  });
});

describe('number bond structure diversity', () => {
  it('grade 3-4: produces 4-digit place value, sum-difference, and 3-part text problems', () => {
    const problems = generateSingaporeNumberBond(4, 200);
    // All grade 3-4 are text-only (no diagram)
    problems.forEach((p) => expect(p.diagram).toBeUndefined());
    const has4Digit = problems.some(
      (p) => p.problemText.includes(' + ? + ') || p.problemText.match(/\d{4} =/)
    );
    const hasSumDiff = problems.some((p) =>
      p.problemText.includes('add up to')
    );
    const has3Part = problems.some(
      (p) => p.problemText.includes(' + ') && p.problemText.includes('+ ?.')
    );
    expect(has4Digit).toBe(true);
    expect(hasSumDiff).toBe(true);
    expect(has3Part).toBe(true);
  });

  it('grade 5-6: produces fraction, decimal, and complement problems', () => {
    const problems = generateSingaporeNumberBond(6, 200);
    const hasFraction = problems.some((p) => p.problemText.includes('/'));
    const hasDecomposition = problems.some(
      (p) => p.problemText.includes('= ') && p.problemText.includes('+ ?')
    );
    const hasComplement = problems.some((p) => p.problemText.includes('makes'));
    expect(hasFraction).toBe(true);
    expect(hasDecomposition).toBe(true);
    expect(hasComplement).toBe(true);
  });
});

describe('singapore pattern router integration', () => {
  const baseSettings: Omit<WorksheetSettings, 'calculationPattern'> = {
    grade: 5,
    problemType: 'basic',
    operation: 'addition',
    problemCount: 6,
    layoutColumns: 2,
  };

  it.each(['singapore-bar-model', 'singapore-number-bond'] as const)(
    'routes %s through generateProblems',
    (calculationPattern) => {
      const problems = generateProblems({
        ...baseSettings,
        calculationPattern,
      });

      expect(problems).toHaveLength(6);
      expect(problems.every((problem) => problem.type === 'singapore')).toBe(
        true
      );
    }
  );
});
