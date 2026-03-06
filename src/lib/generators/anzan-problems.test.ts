import { describe, it, expect } from 'vitest';

import {
  generateAnzanRoundAdd,
  generateAnzanRoundSub,
  generateAnzanRoundMul,
  generateGradeAnzanRoundingProblems,
  generateComplement10,
  generateComplement100,
  generateChangeMaking,
  generateDistributiveProblems,
  generateMulDecomposeProblems,
  generateSquareDiffProblems,
  generateAnzanDecompositionProblems,
} from './anzan-problems';
import { generateProblems } from './index';
import type { Grade, WorksheetSettings } from '../../types';

function isNearRoundNumber(n: number, base: number): boolean {
  const remainder = n % base;
  return remainder <= 3 || remainder >= base - 3;
}

describe('generateAnzanRoundAdd', () => {
  it('generates the requested number of problems', () => {
    const problems = generateAnzanRoundAdd(3, 10);
    expect(problems).toHaveLength(10);
  });

  it('generates addition problems', () => {
    const problems = generateAnzanRoundAdd(3, 20);
    for (const p of problems) {
      expect(p.type).toBe('basic');
      expect(p.operation).toBe('addition');
    }
  });

  it('has correct answers', () => {
    const problems = generateAnzanRoundAdd(3, 20);
    for (const p of problems) {
      expect(p.answer).toBe(p.operand1! + p.operand2!);
    }
  });

  it('has positive answers', () => {
    const problems = generateAnzanRoundAdd(3, 50);
    for (const p of problems) {
      expect(p.answer).toBeGreaterThan(0);
    }
  });

  it('has at least one operand near a round number (grade 3, base 10)', () => {
    const problems = generateAnzanRoundAdd(3, 30);
    for (const p of problems) {
      const op1Near = isNearRoundNumber(p.operand1!, 10);
      const op2Near = isNearRoundNumber(p.operand2!, 10);
      expect(op1Near || op2Near).toBe(true);
    }
  });

  it('grade 5+ uses numbers near multiples of 100', () => {
    const problems = generateAnzanRoundAdd(5, 30);
    for (const p of problems) {
      const op1Near = isNearRoundNumber(p.operand1!, 100);
      const op2Near = isNearRoundNumber(p.operand2!, 100);
      expect(op1Near || op2Near).toBe(true);
    }
  });
});

describe('generateAnzanRoundSub', () => {
  it('generates the requested number of problems', () => {
    const problems = generateAnzanRoundSub(3, 10);
    expect(problems).toHaveLength(10);
  });

  it('generates subtraction problems', () => {
    const problems = generateAnzanRoundSub(3, 20);
    for (const p of problems) {
      expect(p.type).toBe('basic');
      expect(p.operation).toBe('subtraction');
    }
  });

  it('has correct answers', () => {
    const problems = generateAnzanRoundSub(3, 20);
    for (const p of problems) {
      expect(p.answer).toBe(p.operand1! - p.operand2!);
    }
  });

  it('has positive answers', () => {
    const problems = generateAnzanRoundSub(3, 50);
    for (const p of problems) {
      expect(p.answer).toBeGreaterThan(0);
    }
  });

  it('operand1 is near a round number (grade 3, base 10)', () => {
    const problems = generateAnzanRoundSub(3, 30);
    for (const p of problems) {
      expect(isNearRoundNumber(p.operand1!, 10)).toBe(true);
    }
  });

  it('grade 5+ operand1 is near a multiple of 100', () => {
    const problems = generateAnzanRoundSub(5, 30);
    for (const p of problems) {
      expect(isNearRoundNumber(p.operand1!, 100)).toBe(true);
    }
  });
});

describe('generateAnzanRoundMul', () => {
  it('generates the requested number of problems', () => {
    const problems = generateAnzanRoundMul(5, 10);
    expect(problems).toHaveLength(10);
  });

  it('generates multiplication problems', () => {
    const problems = generateAnzanRoundMul(5, 20);
    for (const p of problems) {
      expect(p.type).toBe('basic');
      expect(p.operation).toBe('multiplication');
    }
  });

  it('has correct answers', () => {
    const problems = generateAnzanRoundMul(5, 20);
    for (const p of problems) {
      expect(p.answer).toBe(p.operand1! * p.operand2!);
    }
  });

  it('has at least one round factor operand', () => {
    const roundFactors = [25, 50, 125];
    const problems = generateAnzanRoundMul(5, 30);
    for (const p of problems) {
      const op1Round = roundFactors.includes(p.operand1!);
      const op2Round = roundFactors.includes(p.operand2!);
      expect(op1Round || op2Round).toBe(true);
    }
  });
});

describe('generateGradeAnzanRoundingProblems', () => {
  it('dispatches to the correct generator', () => {
    const addProblems = generateGradeAnzanRoundingProblems(
      3,
      5,
      'anzan-round-add'
    );
    expect(addProblems).toHaveLength(5);
    expect(addProblems[0].operation).toBe('addition');

    const subProblems = generateGradeAnzanRoundingProblems(
      3,
      5,
      'anzan-round-sub'
    );
    expect(subProblems).toHaveLength(5);
    expect(subProblems[0].operation).toBe('subtraction');

    const mulProblems = generateGradeAnzanRoundingProblems(
      5,
      5,
      'anzan-round-mul'
    );
    expect(mulProblems).toHaveLength(5);
    expect(mulProblems[0].operation).toBe('multiplication');
  });

  it('works across all valid grades', () => {
    const grades: Grade[] = [3, 4, 5, 6];
    for (const grade of grades) {
      const add = generateGradeAnzanRoundingProblems(
        grade,
        5,
        'anzan-round-add'
      );
      expect(add).toHaveLength(5);

      const sub = generateGradeAnzanRoundingProblems(
        grade,
        5,
        'anzan-round-sub'
      );
      expect(sub).toHaveLength(5);
    }

    for (const grade of [5, 6] as Grade[]) {
      const mul = generateGradeAnzanRoundingProblems(
        grade,
        5,
        'anzan-round-mul'
      );
      expect(mul).toHaveLength(5);
    }
  });
});

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
    for (const p of problems) {
      expect(p.operand1).toBeGreaterThanOrEqual(2);
      expect(p.operand1).toBeLessThanOrEqual(9);
      expect(p.operand2).toBeGreaterThanOrEqual(11);
      expect(p.operand2).toBeLessThanOrEqual(29);
    }
  });

  it('dispatches anzan-mul-decompose correctly', () => {
    const problems = generateAnzanDecompositionProblems(
      5,
      5,
      'anzan-mul-decompose'
    );
    expect(problems).toHaveLength(5);
    for (const p of problems) {
      const r1 = p.operand1! % 10;
      const r2 = p.operand2! % 10;
      const hasNearRound = (r1 >= 1 && r1 <= 5) || (r2 >= 1 && r2 <= 5);
      expect(hasNearRound).toBe(true);
    }
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
