import { describe, it, expect } from 'vitest';

import {
  generateDistributiveProblems,
  generateMulDecomposeProblems,
  generateSquareDiffProblems,
  generateAnzanDecompositionProblems,
} from './anzan-problems';

describe('anzan-distributive', () => {
  it('generates the requested number of problems', () => {
    const problems = generateDistributiveProblems(4, 10);
    expect(problems).toHaveLength(10);
  });

  it('generates grade 4 problems: 1-digit × 2-digit (10s-20s)', () => {
    const problems = generateDistributiveProblems(4, 50);
    for (const p of problems) {
      expect(p.type).toBe('basic');
      expect(p.operation).toBe('multiplication');
      expect(p.operand1).toBeGreaterThanOrEqual(2);
      expect(p.operand1).toBeLessThanOrEqual(9);
      expect(p.operand2).toBeGreaterThanOrEqual(11);
      expect(p.operand2).toBeLessThanOrEqual(29);
      expect(p.answer).toBe(p.operand1! * p.operand2!);
      expect(p.answer).toBeGreaterThan(0);
      // Remainder must be > 0 (ones digit is non-zero)
      expect(p.operand2! % 10).toBeGreaterThan(0);
    }
  });

  it('generates grade 5+ problems: 1-digit × 3-digit', () => {
    const problems = generateDistributiveProblems(5, 50);
    for (const p of problems) {
      expect(p.operand1).toBeGreaterThanOrEqual(2);
      expect(p.operand1).toBeLessThanOrEqual(9);
      expect(p.operand2).toBeGreaterThanOrEqual(101);
      expect(p.operand2).toBeLessThanOrEqual(299);
      expect(p.answer).toBe(p.operand1! * p.operand2!);
      expect(p.answer).toBeGreaterThan(0);
      // Remainder must be > 0
      expect(p.operand2! % 100).toBeGreaterThan(0);
    }
  });

  it('generates grade 6 problems same as grade 5', () => {
    const problems = generateDistributiveProblems(6, 10);
    for (const p of problems) {
      expect(p.operand2).toBeGreaterThanOrEqual(101);
      expect(p.operand2).toBeLessThanOrEqual(299);
    }
  });
});

describe('anzan-mul-decompose', () => {
  it('generates the requested number of problems', () => {
    const problems = generateMulDecomposeProblems(5, 10);
    expect(problems).toHaveLength(10);
  });

  it('generates grade 5 problems: 2-digit × 2-digit with near-round operand', () => {
    const problems = generateMulDecomposeProblems(5, 50);
    for (const p of problems) {
      expect(p.type).toBe('basic');
      expect(p.operation).toBe('multiplication');
      // Both operands should be 2-digit
      const op1 = p.operand1!;
      const op2 = p.operand2!;
      expect(op1).toBeGreaterThanOrEqual(11);
      expect(op2).toBeGreaterThanOrEqual(11);
      expect(op1).toBeLessThanOrEqual(45);
      expect(op2).toBeLessThanOrEqual(45);
      // One operand should be near a multiple of 10 (remainder 1-5)
      const r1 = op1 % 10;
      const r2 = op2 % 10;
      const nearRound = (r1 >= 1 && r1 <= 5) || (r2 >= 1 && r2 <= 5);
      expect(nearRound).toBe(true);
      expect(p.answer).toBe(op1 * op2);
      expect(p.answer).toBeGreaterThan(0);
    }
  });

  it('generates grade 6 problems: 2-digit × 3-digit', () => {
    const problems = generateMulDecomposeProblems(6, 50);
    for (const p of problems) {
      const op1 = p.operand1!;
      const op2 = p.operand2!;
      // One should be 2-digit near-round, other should be 3-digit, but order may vary
      const ops = [op1, op2].sort((a, b) => a - b);
      expect(ops[0]).toBeGreaterThanOrEqual(11);
      expect(ops[0]).toBeLessThanOrEqual(45);
      expect(ops[1]).toBeGreaterThanOrEqual(101);
      expect(ops[1]).toBeLessThanOrEqual(199);
      expect(p.answer).toBe(op1 * op2);
      expect(p.answer).toBeGreaterThan(0);
    }
  });
});

describe('anzan-square-diff', () => {
  it('generates the requested number of problems', () => {
    const problems = generateSquareDiffProblems(6, 10);
    expect(problems).toHaveLength(10);
  });

  it('generates problems where average of operands is a multiple of 10', () => {
    const problems = generateSquareDiffProblems(6, 50);
    for (const p of problems) {
      expect(p.type).toBe('basic');
      expect(p.operation).toBe('multiplication');
      const op1 = p.operand1!;
      const op2 = p.operand2!;
      // Average should be a multiple of 10
      const avg = (op1 + op2) / 2;
      expect(avg % 10).toBe(0);
      // Diff should be 1-5
      const diff = Math.abs(op1 - op2) / 2;
      expect(diff).toBeGreaterThanOrEqual(1);
      expect(diff).toBeLessThanOrEqual(5);
      // Answer = center² - diff²
      expect(p.answer).toBe(avg * avg - diff * diff);
      expect(p.answer).toBe(op1 * op2);
      expect(p.answer).toBeGreaterThan(0);
    }
  });

  it('generates center values that are multiples of 10 (10-50)', () => {
    const problems = generateSquareDiffProblems(6, 100);
    const centers = new Set<number>();
    for (const p of problems) {
      const center = (p.operand1! + p.operand2!) / 2;
      centers.add(center);
      expect(center).toBeGreaterThanOrEqual(10);
      expect(center).toBeLessThanOrEqual(50);
    }
    // With 100 problems, we should see multiple distinct centers
    expect(centers.size).toBeGreaterThan(1);
  });
});

describe('generateAnzanDecompositionProblems dispatch', () => {
  it('dispatches anzan-distributive correctly', () => {
    const problems = generateAnzanDecompositionProblems(
      4,
      5,
      'anzan-distributive'
    );
    expect(problems).toHaveLength(5);
    expect(problems[0].operation).toBe('multiplication');
  });

  it('dispatches anzan-mul-decompose correctly', () => {
    const problems = generateAnzanDecompositionProblems(
      5,
      5,
      'anzan-mul-decompose'
    );
    expect(problems).toHaveLength(5);
  });

  it('dispatches anzan-square-diff correctly', () => {
    const problems = generateAnzanDecompositionProblems(
      6,
      5,
      'anzan-square-diff'
    );
    expect(problems).toHaveLength(5);
    for (const p of problems) {
      const avg = (p.operand1! + p.operand2!) / 2;
      expect(avg % 10).toBe(0);
    }
  });
});
