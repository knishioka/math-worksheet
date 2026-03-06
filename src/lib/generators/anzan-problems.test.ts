import { describe, it, expect } from 'vitest';

import {
  generateAnzanRoundAdd,
  generateAnzanRoundSub,
  generateAnzanRoundMul,
  generateGradeAnzanRoundingProblems,
  generateComplement10,
  generateComplement100,
  generateChangeMaking,
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
