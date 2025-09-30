import { describe, it, expect } from 'vitest';
import {
  generateDecimalProblem,
  generateGradeDecimalProblems,
} from './decimal';
import type { WorksheetSettings } from '../../types';

describe('generateDecimalProblem', () => {
  const baseSettings: WorksheetSettings = {
    grade: 3,
    problemType: 'decimal',
    operation: 'addition',
    problemCount: 1,
    layoutColumns: 1,
  };

  it('should generate a valid decimal addition problem', () => {
    const problem = generateDecimalProblem(baseSettings);

    expect(problem.type).toBe('decimal');
    expect(problem.operation).toBe('addition');
    expect(problem.operand1).toBeGreaterThan(0);
    expect(problem.operand2).toBeGreaterThan(0);
    expect(problem.answer).toBeGreaterThan(0);
    expect(problem.decimalPlaces).toBeGreaterThan(0);
    expect(problem.id).toBeDefined();
  });

  it('should handle subtraction correctly', () => {
    const problem = generateDecimalProblem({
      ...baseSettings,
      operation: 'subtraction',
    });

    expect(problem.operation).toBe('subtraction');
    expect(problem.answer).toBeGreaterThanOrEqual(0);
  });

  it('should handle multiplication correctly', () => {
    const problem = generateDecimalProblem({
      ...baseSettings,
      operation: 'multiplication',
    });

    expect(problem.operation).toBe('multiplication');
    expect(problem.answer).toBeGreaterThan(0);
  });

  it('should handle division correctly', () => {
    const problem = generateDecimalProblem({
      ...baseSettings,
      operation: 'division',
    });

    expect(problem.operation).toBe('division');
    expect(problem.answer).toBeGreaterThan(0);
    expect(problem.operand2).toBeGreaterThan(0); // 0除算を避ける
  });
});

describe('generateGradeDecimalProblems', () => {
  it('should return empty array for grade 1', () => {
    const problems = generateGradeDecimalProblems(1, 5);
    expect(problems).toHaveLength(0);
  });

  it('should return empty array for grade 2', () => {
    const problems = generateGradeDecimalProblems(2, 5);
    expect(problems).toHaveLength(0);
  });

  it('should generate appropriate problems for grade 3', () => {
    const problems = generateGradeDecimalProblems(3, 5);

    expect(problems).toHaveLength(5);
    problems.forEach((problem) => {
      expect(problem.type).toBe('decimal');
      expect(['addition', 'subtraction']).toContain(problem.operation);
      expect(problem.decimalPlaces).toBeLessThanOrEqual(1); // 0.1の位まで
      expect(problem.operand1).toBeLessThanOrEqual(9.9);
      expect(problem.operand2).toBeLessThanOrEqual(9.9);
    });
  });

  it('should generate appropriate problems for grade 4', () => {
    const problems = generateGradeDecimalProblems(4, 5);

    expect(problems).toHaveLength(5);
    problems.forEach((problem) => {
      expect(problem.type).toBe('decimal');
      expect(['multiplication', 'division']).toContain(problem.operation);
      expect(problem.decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  it('should generate appropriate problems for grade 5', () => {
    const problems = generateGradeDecimalProblems(5, 5);

    expect(problems).toHaveLength(5);
    problems.forEach((problem) => {
      expect(problem.type).toBe('decimal');
      expect([
        'addition',
        'subtraction',
        'multiplication',
        'division',
      ]).toContain(problem.operation);
      expect(problem.decimalPlaces).toBeLessThanOrEqual(2);
      expect(problem.operand1).toBeLessThanOrEqual(99.99);
    });
  });

  it('should generate appropriate problems for grade 6', () => {
    const problems = generateGradeDecimalProblems(6, 5);

    expect(problems).toHaveLength(5);
    problems.forEach((problem) => {
      expect(problem.type).toBe('decimal');
      expect([
        'addition',
        'subtraction',
        'multiplication',
        'division',
      ]).toContain(problem.operation);
      expect(problem.decimalPlaces).toBeLessThanOrEqual(3);
    });
  });
});
