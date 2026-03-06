import { describe, it, expect } from 'vitest';

import {
  generateAnzanRoundAdd,
  generateAnzanRoundSub,
  generateAnzanRoundMul,
  generateGradeAnzanRoundingProblems,
} from './anzan-problems';
import type { Grade } from '../../types';

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
