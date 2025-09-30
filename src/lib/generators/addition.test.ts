import { describe, it, expect } from 'vitest';
import {
  generateAdditionProblem,
  generateAdditionProblems,
  generateGradeAdditionProblems,
} from './addition';
import type { WorksheetSettings } from '../../types';

describe('generateAdditionProblem', () => {
  const baseSettings: WorksheetSettings = {
    grade: 1,
    problemType: 'basic',
    operation: 'addition',
    problemCount: 1,
    layoutColumns: 1,
  };

  it('should generate a valid addition problem', () => {
    const problem = generateAdditionProblem(baseSettings);

    expect(problem.type).toBe('basic');
    expect(problem.operation).toBe('addition');
    expect(problem.operand1).not.toBeNull();
    expect(problem.operand1!).toBeGreaterThanOrEqual(1);
    expect(problem.operand1!).toBeLessThanOrEqual(10);
    expect(problem.operand2).not.toBeNull();
    expect(problem.operand2!).toBeGreaterThanOrEqual(1);
    expect(problem.operand2!).toBeLessThanOrEqual(10);
    expect(problem.answer).toBe(
      (problem.operand1 ?? 0) + (problem.operand2 ?? 0)
    );
    expect(problem.id).toBeDefined();
  });

  it('should respect carry over requirements', () => {
    const problemWithCarryOver = generateAdditionProblem(baseSettings, {
      includeCarryOver: true,
      minNumber: 5,
      maxNumber: 9,
    });

    expect(problemWithCarryOver.carryOver).toBe(true);
  });

  it('should exclude carry over when requested', () => {
    const problemWithoutCarryOver = generateAdditionProblem(baseSettings, {
      excludeCarryOver: true,
      minNumber: 1,
      maxNumber: 4,
    });

    expect(problemWithoutCarryOver.carryOver).toBe(false);
  });

  it('should generate numbers within specified range', () => {
    const problem = generateAdditionProblem(baseSettings, {
      minNumber: 5,
      maxNumber: 15,
    });

    expect(problem.operand1).not.toBeNull();
    expect(problem.operand1!).toBeGreaterThanOrEqual(5);
    expect(problem.operand1!).toBeLessThanOrEqual(15);
    expect(problem.operand2).not.toBeNull();
    expect(problem.operand2!).toBeGreaterThanOrEqual(5);
    expect(problem.operand2!).toBeLessThanOrEqual(15);
  });
});

describe('generateAdditionProblems', () => {
  const baseSettings: WorksheetSettings = {
    grade: 2,
    problemType: 'basic',
    operation: 'addition',
    problemCount: 10,
    layoutColumns: 2,
  };

  it('should generate the requested number of problems', () => {
    const problems = generateAdditionProblems(baseSettings, 5);
    expect(problems).toHaveLength(5);
  });

  it('should generate unique problems', () => {
    const problems = generateAdditionProblems(baseSettings, 10);
    const combinations = problems.map((p) => `${p.operand1}+${p.operand2}`);
    const uniqueCombinations = new Set(combinations);

    // Should have mostly unique combinations (allowing for some duplicates due to randomness)
    expect(uniqueCombinations.size).toBeGreaterThan(5);
  });

  it('should generate problems with consistent settings', () => {
    const problems = generateAdditionProblems(baseSettings, 5);

    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      expect(problem.operation).toBe('addition');
      expect(problem.answer).toBe(
        (problem.operand1 ?? 0) + (problem.operand2 ?? 0)
      );
    });
  });
});

describe('generateGradeAdditionProblems', () => {
  it('should generate appropriate problems for grade 1', () => {
    const problems = generateGradeAdditionProblems(1, 10);

    problems.forEach((problem) => {
      expect(problem.operand1).not.toBeNull();
      expect(problem.operand1!).toBeLessThanOrEqual(100);
      expect(problem.operand2).not.toBeNull();
      expect(problem.operand2!).toBeLessThanOrEqual(100);
      // Grade 1 can have carry over (30% chance)
    });
  });

  it('should generate appropriate problems for grade 2', () => {
    const problems = generateGradeAdditionProblems(2, 10);

    problems.forEach((problem) => {
      expect(problem.operand1).not.toBeNull();
      expect(problem.operand1!).toBeGreaterThanOrEqual(10);
      expect(problem.operand1!).toBeLessThanOrEqual(99);
      expect(problem.operand2).not.toBeNull();
      expect(problem.operand2!).toBeGreaterThanOrEqual(10);
      expect(problem.operand2!).toBeLessThanOrEqual(99);
      // Grade 2 focuses on 2-digit numbers with carry over
    });
  });

  it('should generate appropriate problems for grade 3', () => {
    const problems = generateGradeAdditionProblems(3, 10);

    problems.forEach((problem) => {
      expect(problem.operand1).not.toBeNull();
      expect(problem.operand1!).toBeGreaterThanOrEqual(100);
      expect(problem.operand1!).toBeLessThanOrEqual(9999);
      expect(problem.operand2).not.toBeNull();
      expect(problem.operand2!).toBeGreaterThanOrEqual(100);
      expect(problem.operand2!).toBeLessThanOrEqual(9999);
      // Grade 3 focuses on 3-4 digit numbers
    });
  });

  it('should generate problems for higher grades', () => {
    const problems = generateGradeAdditionProblems(5, 5);

    problems.forEach((problem) => {
      expect(problem.operand1).not.toBeNull();
      expect(problem.operand1!).toBeGreaterThanOrEqual(100);
      expect(problem.operand2).not.toBeNull();
      expect(problem.operand2!).toBeGreaterThanOrEqual(100);
    });
  });

  it('should handle invalid grade gracefully', () => {
    const problems = generateGradeAdditionProblems(10, 5);

    expect(problems).toHaveLength(5);
    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      expect(problem.operation).toBe('addition');
    });
  });
});
