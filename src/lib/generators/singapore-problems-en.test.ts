import { describe, expect, it } from 'vitest';
import type { WorksheetSettings } from '../../types';
import { generateProblems } from './index';
import {
  calculateSequentialFractionUsage,
  generateSingaporeBarModel,
  generateSingaporeComparison,
  generateSingaporeMultiStep,
  generateSingaporeNumberBond,
} from './singapore-problems-en';

describe('singapore-problems-en generators', () => {
  it('generates bar model problems with diagram data', () => {
    const problems = generateSingaporeBarModel(3, 12);

    expect(problems).toHaveLength(12);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.language).toBe('en');
      expect(problem.category).toBe('bar-model');
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeDefined();
      expect(problem.diagram?.diagramType).toBe('bar-model');
    });
  });

  it('generates number bond problems with diagram data', () => {
    const problems = generateSingaporeNumberBond(4, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.language).toBe('en');
      expect(problem.category).toBe('number-bond');
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeDefined();
      expect(problem.diagram?.diagramType).toBe('number-bond');
      if (problem.diagram?.diagramType === 'number-bond') {
        expect(problem.diagram.parts.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  it('generates comparison problems with diagram data', () => {
    const problems = generateSingaporeComparison(5, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.operation).toBe('multiplication');
      expect(problem.category).toBe('comparison');
      expect(problem.problemText).toContain('times as many');
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeDefined();
      expect(problem.diagram?.diagramType).toBe('comparison');
    });
  });

  it('generates multi-step fraction problems without diagrams', () => {
    const problems = generateSingaporeMultiStep(6, 8);

    expect(problems).toHaveLength(8);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.category).toBe('multi-step');
      expect(problem.problemText).toContain('/');
      expect(
        problem.operation === 'subtraction' || problem.operation === 'division'
      ).toBe(true);
      expect(typeof problem.answer).toBe('number');
      expect(Number.isInteger(problem.answer)).toBe(true);
      expect(problem.diagram).toBeUndefined();
    });
  });

  it('never reuses the same name in two-person Singapore prompts', () => {
    const barModelProblems = generateSingaporeBarModel(4, 200);
    const comparisonProblems = generateSingaporeComparison(4, 200);

    const selfReferencePattern =
      /\b([A-Z][a-z]+)\b has \d+ (?:more than|times as many as) \1\b/;

    [...barModelProblems, ...comparisonProblems].forEach((problem) => {
      expect(selfReferencePattern.test(problem.problemText)).toBe(false);
    });
  });

  it('uses additive comparison language for grade 2', () => {
    const problems = generateSingaporeComparison(2, 80);

    expect(problems).toHaveLength(80);
    problems.forEach((problem) => {
      expect(
        problem.operation === 'addition' || problem.operation === 'subtraction'
      ).toBe(true);
      expect(problem.problemText.includes('times as many')).toBe(false);
      expect(
        problem.problemText.includes('more') ||
          problem.problemText.includes('fewer')
      ).toBe(true);
    });
  });

  it('keeps multiplicative comparison language for grade 3+', () => {
    const problems = generateSingaporeComparison(3, 80);

    expect(problems).toHaveLength(80);
    problems.forEach((problem) => {
      expect(problem.operation).toBe('multiplication');
      expect(problem.problemText).toContain('times as many');
    });
  });

  it('computes known multi-step calculations correctly', () => {
    const scenario = {
      fraction1Numerator: 1,
      fraction1Denominator: 2,
      fraction2Numerator: 1,
      fraction2Denominator: 4,
      lcm: 4,
    };
    const usage48 = calculateSequentialFractionUsage(48, scenario);
    const usage64 = calculateSequentialFractionUsage(64, scenario);

    expect(usage48).not.toBeNull();
    expect(usage64).not.toBeNull();
    expect(usage48?.usedFirst).toBe(24);
    expect(usage48?.usedSecond).toBe(6);
    expect(usage48?.remainingAfterSecond).toBe(18);
    expect((usage48?.remainingAfterSecond ?? 0) / 6).toBe(3);
    expect((usage64?.remainingAfterSecond ?? 0) / 6).toBe(4);
  });

  it('matches generated multi-step answers with sequential fraction math', () => {
    const problems = generateSingaporeMultiStep(3, 80);

    problems.forEach((problem) => {
      const [fraction1, fraction2] = [
        ...problem.problemText.matchAll(/(\d+)\/(\d+)/g),
      ];
      const totalMatch = problem.problemText.match(/(?:has|are) (\d+) /);
      expect(fraction1).toBeDefined();
      expect(fraction2).toBeDefined();
      expect(totalMatch).toBeDefined();

      const total = Number(totalMatch?.[1] ?? 0);
      const usage = calculateSequentialFractionUsage(total, {
        fraction1Numerator: Number(fraction1[1]),
        fraction1Denominator: Number(fraction1[2]),
        fraction2Numerator: Number(fraction2[1]),
        fraction2Denominator: Number(fraction2[2]),
        lcm: 1,
      });

      expect(usage).not.toBeNull();

      if (problem.operation === 'subtraction') {
        expect(problem.answer).toBe(usage?.remainingAfterSecond);
      } else {
        const groupsMatch = problem.problemText.match(/among (\d+) students/);
        expect(groupsMatch).toBeDefined();
        const groups = Number(groupsMatch?.[1] ?? 1);
        expect(problem.answer).toBe(
          (usage?.remainingAfterSecond ?? 0) / groups
        );
      }
    });
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

  it.each([
    'singapore-bar-model',
    'singapore-number-bond',
    'singapore-comparison',
    'singapore-multi-step',
  ] as const)('routes %s through generateProblems', (calculationPattern) => {
    const problems = generateProblems({
      ...baseSettings,
      calculationPattern,
    });

    expect(problems).toHaveLength(6);
    expect(problems.every((problem) => problem.type === 'singapore')).toBe(
      true
    );
  });
});
