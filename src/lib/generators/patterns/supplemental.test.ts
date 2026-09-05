import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateProblems } from '..';
import { generateSupplementalProblems } from './supplemental';
import {
  SUPPLEMENTAL_PATTERNS,
  type SupplementalPattern,
} from '../../../config/supplemental-patterns';
import {
  PATTERNS_BY_GRADE,
  type BasicProblem,
  type Grade,
  type WorksheetSettings,
} from '../../../types';
import { getLearningStages } from '../../../config/learning-paths';
import { getEffectiveProblemType } from '../../utils/problem-type-detector';
import {
  calculateMissingOperand1,
  calculateMissingOperand2,
} from '../../utils/missing-number-calculator';
import { generateAddTripleDigit } from './grade3';
import {
  generateMultDecInt,
  generateDivDecInt,
  generateDivWithRemainder,
} from './grade4';
import { generatePercentBasic } from './grade5';
import { generateRatioProportion, generateSpeedTimeDistance } from './grade6';

const settings: WorksheetSettings = {
  grade: 1,
  problemType: 'basic',
  operation: 'addition',
  problemCount: 30,
  layoutColumns: 3,
};
const patterns = Object.keys(SUPPLEMENTAL_PATTERNS) as SupplementalPattern[];
afterEach(() => vi.restoreAllMocks());

describe('補完教材の出題契約', () => {
  it.each(patterns)('%s: 件数・正答・印刷種別が一致する', (pattern) => {
    const definition = SUPPLEMENTAL_PATTERNS[pattern];
    const problems = generateProblems({
      ...settings,
      grade: definition.grade as Grade,
      calculationPattern: pattern,
    });
    expect(problems).toHaveLength(30);
    expect(new Set(problems.map((p) => p.id)).size).toBe(30);
    expect(getEffectiveProblemType('basic', pattern)).toBe(definition.type);
    for (const p of problems) {
      expect(p.type).toBe(definition.type);
      if (p.type === 'basic') {
        const a = p.operand1 ?? Number(calculateMissingOperand1(p));
        const b = p.operand2 ?? Number(calculateMissingOperand2(p));
        const answer =
          p.operation === 'addition'
            ? a + b
            : p.operation === 'subtraction'
              ? a - b
              : p.operation === 'multiplication'
                ? a * b
                : a / b;
        expect(p.answer).toBe(answer);
        expect(answer).toBeGreaterThanOrEqual(0);
      } else if (p.type === 'fraction') {
        expect(p.denominator1).toBeGreaterThan(0);
        expect(p.denominator2).toBeGreaterThan(0);
        const a = p.numerator1 / p.denominator1,
          b = p.numerator2! / p.denominator2!;
        const expected =
          p.operation === 'addition'
            ? a + b
            : p.operation === 'subtraction'
              ? a - b
              : p.operation === 'multiplication'
                ? a * b
                : a / b;
        expect(p.answerNumerator / p.answerDenominator).toBeCloseTo(
          expected,
          10
        );
        expect(expected).toBeGreaterThanOrEqual(0);
      } else if (p.type === 'word') {
        expect(p.problemText.length).toBeGreaterThan(0);
        expect(String(p.answer)).not.toMatch(/NaN|Infinity|undefined/);
        if (typeof p.answer === 'number')
          expect(p.answer).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it.each(patterns.filter((p) => p.startsWith('sub-minus-')))(
    '%s: 足し算の逆の全10通りを一巡する',
    (pattern) => {
      const problems = generateSupplementalProblems(
        pattern,
        20
      ) as BasicProblem[];
      for (const batch of [problems.slice(0, 10), problems.slice(10)]) {
        expect(batch.map((p) => p.answer).sort((a, b) => a! - b!)).toEqual([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        ]);
        expect(new Set(batch.map((p) => p.operand2)).size).toBe(1);
      }
    }
  );
  it.each(patterns.filter((p) => p.startsWith('mult-table-')))(
    '%s: 各段の1〜9を一巡する',
    (pattern) => {
      const problems = generateSupplementalProblems(
        pattern,
        9
      ) as BasicProblem[];
      expect(problems.map((p) => p.operand2).sort()).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]);
      expect(new Set(problems.map((p) => p.operand1)).size).toBe(1);
    }
  );
  it('ひき算混在では繰り下がりが半数になり、奇数件でも差は1以内', () => {
    for (const count of [1, 5, 10, 29]) {
      const problems = generateSupplementalProblems(
        'sub-single-digit-mixed',
        count
      ) as BasicProblem[];
      expect(problems.filter((p) => p.carryOver).length).toBe(
        Math.floor(count / 2)
      );
    }
  });
  it('乱数が両端でも終了し、分数の範囲が壊れない', () => {
    for (const value of [0, 0.999999]) {
      vi.spyOn(Math, 'random').mockReturnValue(value);
      for (const pattern of patterns)
        expect(generateSupplementalProblems(pattern, 3)).toHaveLength(3);
      vi.restoreAllMocks();
    }
  });
  it('棒グラフ・気温表の値と答えが対応する', () => {
    for (const pattern of ['data-bar-chart-jap', 'data-change-jap'] as const) {
      generateSupplementalProblems(pattern, 20).forEach((p, i) => {
        if (p.type !== 'word' || !p.dataDisplay)
          throw new Error('Missing data');
        const [a, b, c] = p.dataDisplay.entries.map((e) => e.value);
        expect(p.answer).toBe(
          pattern === 'data-bar-chart-jap' || i % 2 === 0 ? b - a : b - c
        );
      });
    }
  });
  it('面積・平均・中央値・約数・倍数を問題文から再計算できる', () => {
    for (const pattern of [
      'geometry-rectangle-area-jap',
      'geometry-circle-jap',
      'data-average-jap',
      'data-median-jap',
      'number-gcd-jap',
      'number-lcm-jap',
      'data-combinations-jap',
    ] as const) {
      for (const p of generateSupplementalProblems(pattern, 30)) {
        if (p.type !== 'word') throw new Error('Expected word');
        const values = p.problemText.match(/\d+(?:\.\d+)?/g)!.map(Number);
        if (pattern === 'geometry-rectangle-area-jap')
          expect(p.answer).toBe(values[0] * values[1]);
        if (pattern === 'geometry-circle-jap')
          expect(p.answer).toBeCloseTo(values[0] ** 2 * 3.14);
        if (pattern === 'data-average-jap')
          expect(p.answer).toBe(values.slice(1, 5).reduce((a, b) => a + b) / 4);
        if (pattern === 'data-median-jap')
          expect(p.answer).toBe(values.slice(1, 6).sort((a, b) => a - b)[2]);
        if (pattern === 'data-combinations-jap')
          expect(p.answer).toBe(values[0] * values[1]);
        if (pattern === 'number-gcd-jap') {
          const divisors = Array.from(
            { length: Math.min(values[0], values[1]) },
            (_, i) => i + 1
          ).filter((n) => values[0] % n === 0 && values[1] % n === 0);
          expect(p.answer).toBe(Math.max(...divisors));
        }
        if (pattern === 'number-lcm-jap') {
          let n = Math.max(values[0], values[1]);
          while (n % values[0] || n % values[1]) n++;
          expect(p.answer).toBe(n);
        }
      }
    }
  });
});

describe('学年全体の教材構成', () => {
  it.each([1, 2, 3, 4, 5, 6] as const)(
    '%i年生の道すじは利用可能な教材のみで構成する',
    (grade) => {
      const route = getLearningStages(grade).flatMap((s) => s.patterns);
      expect(new Set(route).size).toBe(route.length);
      for (const p of route) expect(PATTERNS_BY_GRADE[grade]).toContain(p);
      expect(new Set(PATTERNS_BY_GRADE[grade]).size).toBe(
        PATTERNS_BY_GRADE[grade].length
      );
    }
  );
  it('登録済みの全学年・全教材を生成できる', () => {
    for (const [grade, available] of Object.entries(PATTERNS_BY_GRADE)) {
      for (const pattern of available) {
        expect(
          generateProblems({
            ...settings,
            grade: Number(grade) as Grade,
            calculationPattern: pattern,
            problemCount: 3,
          }),
          `${grade}: ${pattern}`
        ).toHaveLength(3);
      }
    }
  });
});

describe('既存教材の学習上の不整合', () => {
  it.each([
    'add-sub-mixed-basic',
    'add-sub-double-mixed',
    'frac-same-denom',
    'frac-mixed-number',
    'frac-different-denom',
  ] as const)('%s は加減の件数差が1以内', (pattern) => {
    for (const count of [5, 20, 29]) {
      const problems = generateProblems({
        ...settings,
        calculationPattern: pattern,
        problemCount: count,
      });
      expect(problems.filter((p) => p.operation === 'addition')).toHaveLength(
        Math.ceil(count / 2)
      );
      expect(
        problems.filter((p) => p.operation === 'subtraction')
      ).toHaveLength(Math.floor(count / 2));
    }
  });
  it('100単位のたし算は表示名どおり、たし算だけを生成する', () => {
    for (const p of generateProblems({
      ...settings,
      calculationPattern: 'add-hundreds-simple',
    }))
      expect(p.operation).toBe('addition');
  });
  it('3桁のたし算は両方が3桁で合計999以下', () => {
    for (const p of generateAddTripleDigit(settings, 500)) {
      expect(p.operand1).toBeGreaterThanOrEqual(100);
      expect(p.operand2).toBeGreaterThanOrEqual(100);
      expect(p.answer).toBeLessThanOrEqual(999);
    }
  });
  it('4年生の小数の乗除は乗数・除数が整数、答えが正確', () => {
    for (const generate of [generateMultDecInt, generateDivDecInt]) {
      for (const p of generate(settings, 100)) {
        expect(Number.isInteger(p.operand2)).toBe(true);
        expect(p.answer).toBeCloseTo(
          p.operation === 'division'
            ? p.operand1! / p.operand2!
            : p.operand1! * p.operand2!,
          10
        );
      }
    }
  });
  it('あまりが保存され、被除数＝除数×商＋あまりが成立する', () => {
    for (const p of generateDivWithRemainder(settings, 100)) {
      expect(p.remainder).toBeGreaterThan(0);
      expect(p.remainder).toBeLessThan(p.operand2!);
      expect(p.operand1).toBe(p.operand2! * p.answer! + p.remainder!);
    }
  });
  it('割合・比例式・速さの答えは指示のない丸めや循環小数にならない', () => {
    for (const generate of [
      generatePercentBasic,
      generateRatioProportion,
      generateSpeedTimeDistance,
    ]) {
      for (const p of generate(settings, 100)) {
        if (typeof p.answer === 'number')
          expect(p.answer * 100).toBeCloseTo(Math.round(p.answer * 100), 8);
        if (p.problemText.includes('かかる時間')) {
          const [speed, distance] = p.problemText.match(/\d+/g)!.map(Number);
          expect(p.answer).toBe(distance / speed);
        }
      }
    }
  });
  it('各学年の教材数を監査できる', () => {
    const counts = Object.fromEntries(
      Object.entries(PATTERNS_BY_GRADE).map(([g, p]) => [g, p.length])
    );
    expect(Object.keys(counts)).toHaveLength(6);
    expect(patterns).toHaveLength(47);
  });
});
