import { describe, expect, it } from 'vitest';
import type { WorksheetSettings } from '../../types';
import { generateProblems } from './index';
import {
  generateSingaporeBarModel,
  generateSingaporeComparison,
  generateSingaporeMultiStep,
  generateSingaporeNumberBond,
} from './singapore-problems-en';

describe('singapore-problems-en generators', () => {
  it('generates bar model problems with valid shape', () => {
    const problems = generateSingaporeBarModel(3, 12);

    expect(problems).toHaveLength(12);
    problems.forEach((problem) => {
      expect(problem.type).toBe('word-en');
      expect(problem.language).toBe('en');
      expect(problem.problemText.toLowerCase()).toContain('bar model');
      expect(typeof problem.answer).toBe('number');
      expect(problem.category === 'word-story' || problem.category === 'comparison').toBe(true);
    });
  });

  it('generates number bond decomposition problems', () => {
    const problems = generateSingaporeNumberBond(4, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('word-en');
      expect(problem.language).toBe('en');
      expect(problem.category).toBe('missing-number');
      expect(problem.problemText.toLowerCase()).toContain('number bond');
      expect(typeof problem.answer).toBe('number');
    });
  });

  it('generates multiplicative comparison problems', () => {
    const problems = generateSingaporeComparison(5, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('word-en');
      expect(problem.operation).toBe('multiplication');
      expect(problem.category).toBe('comparison');
      expect(problem.problemText).toContain('times as many');
      expect(typeof problem.answer).toBe('number');
    });
  });

  it('generates multi-step fraction problems', () => {
    const problems = generateSingaporeMultiStep(6, 8);

    expect(problems).toHaveLength(8);
    problems.forEach((problem) => {
      expect(problem.type).toBe('word-en');
      expect(problem.category).toBe('word-story');
      expect(problem.problemText).toContain('/');
      expect(
        problem.operation === 'subtraction' || problem.operation === 'division'
      ).toBe(true);
      expect(typeof problem.answer).toBe('number');
      expect(Number.isInteger(problem.answer)).toBe(true);
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
    expect(problems.every((problem) => problem.type === 'word-en')).toBe(true);
  });
});
