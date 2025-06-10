import { describe, it, expect } from 'vitest';
import { generateFractionProblem, generateGradeFractionProblems } from './fraction';
import type { WorksheetSettings } from '../../types';

describe('generateFractionProblem', () => {
  const baseSettings: WorksheetSettings = {
    grade: 3,
    problemType: 'fraction',
    operation: 'addition',
    problemCount: 1,
    layoutColumns: 1,
  };

  it('should generate a valid fraction addition problem', () => {
    const problem = generateFractionProblem(baseSettings);
    
    expect(problem.type).toBe('fraction');
    expect(problem.operation).toBe('addition');
    expect(problem.numerator1).toBeGreaterThan(0);
    expect(problem.denominator1).toBeGreaterThan(0);
    expect(problem.answerNumerator).toBeGreaterThan(0);
    expect(problem.answerDenominator).toBeGreaterThan(0);
    expect(problem.id).toBeDefined();
  });

  it('should handle subtraction correctly', () => {
    const problem = generateFractionProblem({
      ...baseSettings,
      operation: 'subtraction',
    });
    
    expect(problem.operation).toBe('subtraction');
    expect(problem.answerNumerator).toBeGreaterThanOrEqual(0);
  });

  it('should handle multiplication correctly', () => {
    const problem = generateFractionProblem({
      ...baseSettings,
      operation: 'multiplication',
    });
    
    expect(problem.operation).toBe('multiplication');
    expect(problem.answerNumerator).toBeGreaterThan(0);
  });
});

describe('generateGradeFractionProblems', () => {
  it('should return empty array for grade 1', () => {
    const problems = generateGradeFractionProblems(1, 5);
    expect(problems).toHaveLength(0);
  });

  it('should generate appropriate problems for grade 2', () => {
    const problems = generateGradeFractionProblems(2, 5);
    
    expect(problems).toHaveLength(5);
    problems.forEach(problem => {
      expect(problem.type).toBe('fraction');
      expect(problem.numerator1).toBeLessThanOrEqual(problem.denominator1 - 1); // 真分数
      expect(problem.denominator1).toBeLessThanOrEqual(4);
    });
  });

  it('should generate appropriate problems for grade 3', () => {
    const problems = generateGradeFractionProblems(3, 5);
    
    expect(problems).toHaveLength(5);
    problems.forEach(problem => {
      expect(problem.type).toBe('fraction');
      expect(['addition', 'subtraction']).toContain(problem.operation);
      expect(problem.denominator1).toBeLessThanOrEqual(8);
    });
  });

  it('should generate appropriate problems for grade 5', () => {
    const problems = generateGradeFractionProblems(5, 5);
    
    expect(problems).toHaveLength(5);
    problems.forEach(problem => {
      expect(problem.type).toBe('fraction');
      expect(problem.answerNumerator).toBeGreaterThan(0);
      expect(problem.answerDenominator).toBeGreaterThan(0);
    });
  });

  it('should generate appropriate problems for grade 6', () => {
    const problems = generateGradeFractionProblems(6, 5);
    
    expect(problems).toHaveLength(5);
    problems.forEach(problem => {
      expect(problem.type).toBe('fraction');
      expect(['addition', 'subtraction', 'multiplication', 'division']).toContain(problem.operation);
    });
  });
});