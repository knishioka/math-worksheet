import { describe, it, expect } from 'vitest';
import { generateProblems } from './index';
import type { WorksheetSettings } from '../../types';
import {
  generateComplement10,
  generateComplement100,
  generateChangeMaking,
} from './anzan-problems';

describe('anzan-complement-10 (10の補数)', () => {
  const settings: WorksheetSettings = {
    grade: 1,
    problemType: 'basic',
    operation: 'addition',
    problemCount: 10,
    layoutColumns: 2,
    calculationPattern: 'anzan-complement-10',
  };

  it('should generate correct number of problems', () => {
    const problems = generateProblems(settings);
    expect(problems).toHaveLength(10);
  });

  it('should generate complement-to-10 problems for grade 1', () => {
    const problems = generateComplement10(1, 9);

    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      expect(problem.operation).toBe('addition');
      expect(problem.operand1).toBeGreaterThanOrEqual(1);
      expect(problem.operand1).toBeLessThanOrEqual(9);
      expect(problem.answer).toBe(10);
      expect(problem.missingPosition).toBe('operand2');
      expect(problem.operand2).toBeNull();
    });
  });

  it('should generate the same format for grade 2+', () => {
    const problems = generateComplement10(3, 9);

    problems.forEach((problem) => {
      expect(problem.operand1).toBeGreaterThanOrEqual(1);
      expect(problem.operand1).toBeLessThanOrEqual(9);
      expect(problem.answer).toBe(10);
      expect(problem.missingPosition).toBe('operand2');
    });
  });

  it('should produce positive integer answers', () => {
    const problems = generateComplement10(1, 9);

    problems.forEach((problem) => {
      // The hidden operand2 = 10 - operand1, which is always 1-9
      const hiddenAnswer = 10 - problem.operand1!;
      expect(hiddenAnswer).toBeGreaterThanOrEqual(1);
      expect(hiddenAnswer).toBeLessThanOrEqual(9);
      expect(Number.isInteger(hiddenAnswer)).toBe(true);
    });
  });

  it('should try to avoid duplicate operands', () => {
    const problems = generateComplement10(1, 9);
    const operands = problems.map((p) => p.operand1);
    const uniqueOperands = new Set(operands);
    // 9 possible values for 9 problems, should all be unique
    expect(uniqueOperands.size).toBe(9);
  });

  it('should integrate correctly via generateProblems', () => {
    const problems = generateProblems(settings);

    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      if (problem.type === 'basic') {
        expect(problem.answer).toBe(10);
        expect(problem.missingPosition).toBe('operand2');
      }
    });
  });
});

describe('anzan-complement-100 (100の補数)', () => {
  it('should generate multiples-of-10 complement for grade 3', () => {
    const problems = generateComplement100(3, 9);

    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      expect(problem.operation).toBe('addition');
      expect(problem.operand1).toBeGreaterThanOrEqual(10);
      expect(problem.operand1).toBeLessThanOrEqual(90);
      expect(problem.operand1! % 10).toBe(0);
      expect(problem.answer).toBe(100);
      expect(problem.missingPosition).toBe('operand2');
      expect(problem.operand2).toBeNull();
    });
  });

  it('should generate arbitrary 2-digit complement for grade 4+', () => {
    const problems = generateComplement100(4, 20);

    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      expect(problem.operation).toBe('addition');
      expect(problem.operand1).toBeGreaterThanOrEqual(1);
      expect(problem.operand1).toBeLessThanOrEqual(99);
      expect(problem.answer).toBe(100);
      expect(problem.missingPosition).toBe('operand2');
    });

    // At least some should NOT be multiples of 10
    const nonMultiples = problems.filter((p) => p.operand1! % 10 !== 0);
    expect(nonMultiples.length).toBeGreaterThan(0);
  });

  it('should produce positive integer answers', () => {
    const problems = generateComplement100(4, 20);

    problems.forEach((problem) => {
      const hiddenAnswer = 100 - problem.operand1!;
      expect(hiddenAnswer).toBeGreaterThanOrEqual(1);
      expect(hiddenAnswer).toBeLessThanOrEqual(99);
      expect(Number.isInteger(hiddenAnswer)).toBe(true);
    });
  });

  it('should integrate correctly via generateProblems', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 9,
      layoutColumns: 2,
      calculationPattern: 'anzan-complement-100',
    };

    const problems = generateProblems(settings);
    expect(problems).toHaveLength(9);

    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      if (problem.type === 'basic') {
        expect(problem.answer).toBe(100);
        expect(problem.missingPosition).toBe('operand2');
      }
    });
  });
});

describe('anzan-change-making (おつり算)', () => {
  it('should generate 1000-yen change for grade 4', () => {
    const problems = generateChangeMaking(4, 10);

    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      expect(problem.operation).toBe('subtraction');
      expect(problem.operand1).toBe(1000);
      expect(problem.operand2).toBeGreaterThanOrEqual(100);
      expect(problem.operand2).toBeLessThanOrEqual(999);
      expect(problem.answer).toBe(problem.operand1! - problem.operand2!);
    });
  });

  it('should generate multi-denomination change for grade 5+', () => {
    const problems = generateChangeMaking(5, 30);

    const amounts = new Set(problems.map((p) => p.operand1));

    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      expect(problem.operation).toBe('subtraction');
      expect([1000, 5000, 10000]).toContain(problem.operand1);
      expect(problem.operand2).toBeGreaterThanOrEqual(100);
      expect(problem.operand2!).toBeLessThan(problem.operand1!);
      expect(problem.answer).toBe(problem.operand1! - problem.operand2!);
    });

    // With 30 problems, should have multiple denominations
    expect(amounts.size).toBeGreaterThan(1);
  });

  it('should produce positive integer answers', () => {
    const problems = generateChangeMaking(4, 10);

    problems.forEach((problem) => {
      expect(problem.answer).toBeGreaterThan(0);
      expect(Number.isInteger(problem.answer)).toBe(true);
    });
  });

  it('should produce positive integer answers for grade 5+', () => {
    const problems = generateChangeMaking(5, 20);

    problems.forEach((problem) => {
      expect(problem.answer).toBeGreaterThan(0);
      expect(Number.isInteger(problem.answer)).toBe(true);
    });
  });

  it('should integrate correctly via generateProblems', () => {
    const settings: WorksheetSettings = {
      grade: 4,
      problemType: 'basic',
      operation: 'subtraction',
      problemCount: 10,
      layoutColumns: 2,
      calculationPattern: 'anzan-change-making',
    };

    const problems = generateProblems(settings);
    expect(problems).toHaveLength(10);

    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      if (problem.type === 'basic') {
        expect(problem.operand1).toBe(1000);
        expect(problem.answer).toBeGreaterThan(0);
      }
    });
  });
});
