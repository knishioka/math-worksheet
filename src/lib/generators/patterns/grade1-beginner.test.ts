import { describe, it, expect } from 'vitest';
import {
  generateAddPlusOne,
  generateAddPlusTwo,
  generateAddPlusThree,
  generateAddPlusFour,
  generateAddPlusFive,
  generateAddPlusSix,
  generateAddPlusSeven,
  generateAddPlusEight,
  generateAddPlusNine,
  generateAddCounting,
  generateCountingAdd,
  generateCountingSub,
} from './grade1';
import type { WorksheetSettings } from '../../../types';

const baseSettings: WorksheetSettings = {
  grade: 1,
  problemType: 'basic',
  operation: 'addition',
  problemCount: 10,
  layoutColumns: 2,
};

describe('generateAddPlusOne (+1のたし算)', () => {
  it('should generate problems with operand2 always 1', () => {
    const problems = generateAddPlusOne(baseSettings, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      expect(problem.operation).toBe('addition');
      expect(problem.operand2).toBe(1);
      expect(problem.operand1).toBeGreaterThanOrEqual(0);
      expect(problem.operand1).toBeLessThanOrEqual(9);
      expect(problem.answer).toBe(problem.operand1! + 1);
      expect(problem.carryOver).toBe(problem.operand1! + 1 > 10);
    });
  });

  it('should avoid duplicate operands when possible', () => {
    const problems = generateAddPlusOne(baseSettings, 10);
    const operands = problems.map((p) => p.operand1);
    const unique = new Set(operands);
    expect(unique.size).toBe(10); // 0-9 は10通りなので全てユニーク
  });

  it('should not have structurally identical halves when count exceeds pool size (2列20問)', () => {
    // 複数回テストして確率的に検証
    for (let trial = 0; trial < 5; trial++) {
      const problems = generateAddPlusOne(baseSettings, 20);
      expect(problems).toHaveLength(20);

      const firstHalf = problems.slice(0, 10).map((p) => p.operand1);
      const secondHalf = problems.slice(10, 20).map((p) => p.operand1);

      // 前半10問と後半10問が完全一致しないこと
      expect(firstHalf).not.toEqual(secondHalf);
    }
  });
});

describe('generateAddPlusTwo (+2のたし算)', () => {
  it('should generate problems with operand2 always 2 (答えが10を超えてよい)', () => {
    const problems = generateAddPlusTwo(baseSettings, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('basic');
      expect(problem.operation).toBe('addition');
      expect(problem.operand2).toBe(2);
      expect(problem.operand1).toBeGreaterThanOrEqual(0);
      expect(problem.operand1).toBeLessThanOrEqual(9);
      expect(problem.answer).toBe(problem.operand1! + 2);
      expect(problem.carryOver).toBe(problem.operand1! + 2 > 10);
    });
  });

  it('should avoid duplicate operands when possible', () => {
    const problems = generateAddPlusTwo(baseSettings, 10);
    const operands = problems.map((p) => p.operand1);
    const unique = new Set(operands);
    expect(unique.size).toBe(10); // 0-9 は10通りなので全てユニーク
  });

  it('should not have structurally identical halves when count exceeds pool size (2列20問)', () => {
    for (let trial = 0; trial < 5; trial++) {
      const problems = generateAddPlusTwo(baseSettings, 20);
      expect(problems).toHaveLength(20);

      const firstHalf = problems.slice(0, 10).map((p) => p.operand1);
      const secondHalf = problems.slice(10, 20).map((p) => p.operand1);

      expect(firstHalf).not.toEqual(secondHalf);
    }
  });
});

describe('generateAddPlusThree〜Nine (+3〜+9のたし算)', () => {
  const generators = [
    { n: 3, generate: generateAddPlusThree },
    { n: 4, generate: generateAddPlusFour },
    { n: 5, generate: generateAddPlusFive },
    { n: 6, generate: generateAddPlusSix },
    { n: 7, generate: generateAddPlusSeven },
    { n: 8, generate: generateAddPlusEight },
    { n: 9, generate: generateAddPlusNine },
  ];

  it.each(generators)(
    '+$n: operand2が常に$nで、答えが10を超えてよい',
    ({ n, generate }) => {
      const problems = generate(baseSettings, 10);

      expect(problems).toHaveLength(10);
      problems.forEach((problem) => {
        expect(problem.type).toBe('basic');
        expect(problem.operation).toBe('addition');
        expect(problem.operand2).toBe(n);
        expect(problem.operand1).toBeGreaterThanOrEqual(0);
        expect(problem.operand1).toBeLessThanOrEqual(9);
        expect(problem.answer).toBe(problem.operand1! + n);
        expect(problem.carryOver).toBe(problem.operand1! + n > 10);
      });
    }
  );

  it.each(generators)('+$n: 10問なら全operandがユニーク', ({ generate }) => {
    const problems = generate(baseSettings, 10);
    const unique = new Set(problems.map((p) => p.operand1));
    expect(unique.size).toBe(10); // 0-9 は10通りなので全てユニーク
  });

  it('+9では答えが10を超える問題が含まれる（最大9+9=18）', () => {
    const problems = generateAddPlusNine(baseSettings, 10);
    const answers = problems.map((p) => p.answer);
    expect(Math.max(...(answers as number[]))).toBe(18); // 9+9
    expect(answers.some((a) => (a as number) > 10)).toBe(true);
  });
});

describe('generateAddCounting (かずをかぞえよう)', () => {
  it('should generate word problems with symbols to count', () => {
    const problems = generateAddCounting(baseSettings, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('word');
      expect(problem.operation).toBe('addition');
      expect(problem.problemText).toContain('は いくつ？');
      expect(problem.answer).toBeGreaterThanOrEqual(1);
      expect(problem.answer).toBeLessThanOrEqual(10);
    });
  });

  it('should use various symbols', () => {
    const problems = generateAddCounting(baseSettings, 20);
    const symbols = problems.map((p) => {
      // problemText の最初の文字がシンボル
      return p.problemText.charAt(0);
    });
    const uniqueSymbols = new Set(symbols);
    // 複数のシンボルが使われていることを確認
    expect(uniqueSymbols.size).toBeGreaterThanOrEqual(2);
  });

  it('answer should match the number of symbols', () => {
    const problems = generateAddCounting(baseSettings, 10);
    problems.forEach((problem) => {
      const text = problem.problemText;
      const symbolPart = text.split('\nは いくつ？')[0];
      // シンボルは改行で区切られ、各行が同じ文字の繰り返し
      const symbol = symbolPart.charAt(0);
      const count = symbolPart.replace(/\n/g, '').split(symbol).length - 1;
      expect(problem.answer).toBe(count);
    });
  });
});

describe('generateCountingAdd (○を使ったたし算)', () => {
  it('should generate addition word problems with two groups of symbols', () => {
    const problems = generateCountingAdd(baseSettings, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('word');
      expect(problem.operation).toBe('addition');
      expect(problem.problemText).toContain('と');
      expect(problem.problemText).toContain('あわせて いくつ？');
      expect(problem.answer).toBeGreaterThanOrEqual(2);
      expect(problem.answer).toBeLessThanOrEqual(10);
    });
  });
});

describe('generateCountingSub (○を使ったひき算)', () => {
  it('should generate subtraction word problems with symbols', () => {
    const problems = generateCountingSub(baseSettings, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('word');
      expect(problem.operation).toBe('subtraction');
      expect(problem.problemText).toContain('から');
      expect(problem.problemText).toContain('のこりは いくつ？');
      expect(problem.answer).toBeGreaterThanOrEqual(1);
    });
  });
});
