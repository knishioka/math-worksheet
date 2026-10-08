import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  UPPER_ENTRANCE_EXAM_PATTERNS,
  type UpperEntranceExamPattern,
} from '../../config/entrance-exam-patterns';
import { getLearningStages } from '../../config/learning-paths';
import { getDiscoveryGroups } from '../../config/pattern-discovery';
import {
  getPatternCategory,
  filterPatternsByLanguage,
} from '../../config/pattern-categories';
import { PATTERNS_BY_GRADE, type WordProblem, type Grade } from '../../types';
import { generateEntranceExamProblems } from './entrance-exam';
import { generateProblems } from './index';

const patterns = Object.keys(
  UPPER_ENTRANCE_EXAM_PATTERNS
) as UpperEntranceExamPattern[];
afterEach(() => vi.restoreAllMocks());

function range(max: number): number[] {
  return Array.from({ length: max }, (_, i) => i + 1);
}
function number(text: string, expression: RegExp): number {
  const match = text.match(expression);
  if (!match) throw new Error(`Missing condition ${expression}: ${text}`);
  return Number(match[1]);
}
function values(text: string): number[] {
  return [...text.matchAll(/\d+/g)].map((match) => Number(match[0]));
}

// 問題文から条件を取り出し、保存された解答・解説を参照せず候補を検証する。
function solve(pattern: UpperEntranceExamPattern, text: string): number[] {
  switch (pattern) {
    case 'entrance-multiples-jap': {
      const ratios = [...text.matchAll(/(\d+):(\d+)/g)].map((m) => [
        Number(m[1]),
        Number(m[2]),
      ]);
      const amount = number(text, /(\d+)枚(?:渡す|もらう)/);
      const [[a, b], [c, d]] = ratios;
      const transfer = text.includes('渡す');
      return range(100)
        .filter((unit) => {
          const nextA = a * unit + amount;
          const nextB = b * unit + (transfer ? -amount : amount);
          return nextB > 0 && nextA * d === nextB * c;
        })
        .map((unit) => a * unit);
    }
    case 'entrance-ratio-sharing-jap': {
      const ratios = [...text.matchAll(/(\d+):(\d+)/g)].map((m) => [
        Number(m[1]),
        Number(m[2]),
      ]);
      const total = number(text, /(?:合計は|^)(\d+)枚/);
      const [a, b] = ratios[0];
      if (ratios.length === 1)
        return range(total - 1).filter(
          (first) => first * b === (total - first) * a
        );
      const [c, d] = ratios[1];
      return range(total - 1).filter((middle) => {
        const first = (middle * a) / b;
        const last = (middle * d) / c;
        return (
          Number.isInteger(first) &&
          Number.isInteger(last) &&
          first + middle + last === total
        );
      });
    }
    case 'entrance-age-jap': {
      const parent = number(text, /父は(\d+)歳/);
      const child = number(text, /子は(\d+)歳/);
      const factor = number(text, /年齢の(\d+)倍/);
      const sign = text.includes('何年後') ? 1 : -1;
      return range(100).filter(
        (years) =>
          child + sign * years >= 0 &&
          parent + sign * years === factor * (child + sign * years)
      );
    }
    case 'entrance-equivalent-jap': {
      const fractions = [...text.matchAll(/(\d+)\/(\d+)/g)].map((m) => [
        Number(m[1]),
        Number(m[2]),
      ]);
      const remaining = number(text, /(?:残りは|まだ)(\d+)ページ/);
      const [a, b] = fractions[0];
      if (fractions.length === 1)
        return range(5000).filter((total) => total * (b - a) === remaining * b);
      const [c, d] = fractions[1];
      return range(5000).filter(
        (total) => total * (b - a) * (d - c) === remaining * b * d
      );
    }
    case 'entrance-reverse-jap': {
      const nums = values(text);
      if (text.includes('で割り')) {
        const [subtract, factor, add, result] = nums;
        return range(1000).filter(
          (original) =>
            original > subtract &&
            (original - subtract) % factor === 0 &&
            (original - subtract) / factor + add === result
        );
      }
      const [factor, add, result] = nums;
      return range(1000).filter(
        (original) => original * factor + add === result
      );
    }
    case 'entrance-profit-loss-jap': {
      const markup = number(text, /原価の(\d+)％/);
      const discount = number(text, /定価の(\d+)％引き/);
      if (text.startsWith('原価')) {
        const cost = number(text, /^原価(\d+)円/);
        return range(2000).filter(
          (profit) =>
            (cost + (text.includes('損失') ? -profit : profit)) * 10000 ===
            cost * (100 + markup) * (100 - discount)
        );
      }
      const profit = number(text, /利益は(\d+)円/);
      return range(10000).filter(
        (cost) =>
          (cost + profit) * 10000 === cost * (100 + markup) * (100 - discount)
      );
    }
    case 'entrance-salt-water-jap': {
      const nums = values(text);
      if (text.includes('水だけ')) {
        const [initial, mass, target] = nums;
        return range(2000).filter(
          (water) => initial * mass === target * (mass + water)
        );
      }
      const [a, massA, b, massB] = nums;
      return range(99).filter(
        (concentration) =>
          concentration * (massA + massB) === a * massA + b * massB
      );
    }
    case 'entrance-traveler-jap': {
      const distance = number(text, /(\d+)m(?:離れ|前に)/);
      const speeds = [...text.matchAll(/分速(\d+)m/g)].map((m) => Number(m[1]));
      const [a, b] = speeds;
      return range(500).filter((minutes) =>
        text.includes('向かい合って')
          ? (a + b) * minutes === distance
          : a * minutes + distance === b * minutes
      );
    }
    case 'entrance-train-passing-jap': {
      const lengths = [...text.matchAll(/長さ(\d+)m/g)].map((m) =>
        Number(m[1])
      );
      const speeds = [...text.matchAll(/秒速(\d+)m/g)].map((m) => Number(m[1]));
      expect(lengths).toHaveLength(2);
      expect(lengths.every((length) => length > 0)).toBe(true);
      return range(1000).filter(
        (seconds) =>
          speeds.reduce((a, b) => a + b, 0) * seconds ===
          lengths.reduce((a, b) => a + b, 0)
      );
    }
    case 'entrance-river-jap': {
      const still = number(text, /静水での速さが分速(\d+)m/);
      const current = number(text, /流れの速さが分速(\d+)m/);
      const distance = number(text, /川を(\d+)m/);
      expect(still).toBeGreaterThan(current);
      return range(1000).filter((minutes) =>
        text.includes('下ります')
          ? (still + current) * minutes === distance
          : still * minutes === distance + current * minutes
      );
    }
    case 'entrance-work-jap': {
      const a = number(text, /Aさん1人なら(\d+)日/);
      const b = number(text, /Bさん1人なら(\d+)日/);
      const first = text.includes('先に') ? number(text, /先に(\d+)日/) : 0;
      expect(first).toBeLessThan(a);
      return range(500).filter(
        (together) => (first + together) * b + together * a === a * b
      );
    }
    case 'entrance-newton-jap': {
      const perWorker = number(text, /速さは毎分(\d+)冊/);
      if (text.includes('毎分何冊')) {
        const conditions = [...text.matchAll(/(\d+)人で(\d+)分/g)].map((m) => [
          Number(m[1]),
          Number(m[2]),
        ]);
        const [[a, t], [b, u]] = conditions;
        return range(a * perWorker - 1).filter(
          (arriving) =>
            (a * perWorker - arriving) * t === (b * perWorker - arriving) * u
        );
      }
      const arriving = number(text, /作業中も毎分(\d+)冊/);
      const workers = number(text, /(\d+)人なら/);
      const firstMinutes = number(text, /人なら(\d+)分/);
      const targetMinutes = number(text, /冊数を(\d+)分/);
      const initial = (workers * perWorker - arriving) * firstMinutes;
      expect(initial).toBeGreaterThan(0);
      return range(100).filter(
        (candidate) =>
          (candidate * perWorker - arriving) * targetMinutes === initial
      );
    }
    case 'entrance-advanced-crane-turtle-jap': {
      const total = number(text, /合わせて(\d+)匹/);
      const legs = number(text, /全部で(\d+)本/);
      const factor = text.includes('数と同じ')
        ? 1
        : number(text, /クモの数の(\d+)倍/);
      return range(total - 1).filter((spiders) => {
        const dogs = spiders * factor;
        const chickens = total - dogs - spiders;
        return chickens > 0 && 2 * chickens + 4 * dogs + 8 * spiders === legs;
      });
    }
    case 'entrance-advanced-ratio-age-jap': {
      const factor = number(text, /比は(\d+):1/);
      const useSum = text.includes('合計');
      const given = number(text, /(?:合計|差)は(\d+)歳/);
      const children = range(100).filter(
        (child) =>
          (useSum ? child * (factor + 1) : child * (factor - 1)) === given
      );
      expect(children).toHaveLength(1);
      const child = children[0];
      const parent = child * factor;
      const future = text.match(/比が(\d+):(\d+)/)!;
      return range(100).filter(
        (years) =>
          (parent + years) * Number(future[2]) ===
          (child + years) * Number(future[1])
      );
    }
    case 'entrance-advanced-speed-jap': {
      const speeds = [...text.matchAll(/分速(\d+)m/g)].map((m) => Number(m[1]));
      if (text.includes('追いかけ')) {
        const delay = number(text, /その(\d+)分後/);
        const [a, b] = speeds;
        return range(500).filter(
          (minutes) => b * minutes === a * (minutes + delay)
        );
      }
      const distance = number(text, /^(\d+)m/);
      const first = number(text, /出発から(\d+)分後/);
      const [a, b, c] = speeds;
      const candidates = range(500).filter(
        (minutes) =>
          a * minutes +
            (minutes <= first
              ? b * minutes
              : b * first + c * (minutes - first)) ===
          distance
      );
      expect(candidates[0]).toBeGreaterThan(first);
      return candidates;
    }
  }
}

describe('5・6年生の受験文章題', () => {
  it('売買損益は利益・原価の逆算・損失をそれぞれ出題する', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const problems = generateEntranceExamProblems(
      'entrance-profit-loss-jap',
      3
    );
    expect(problems[0].problemText).toContain('利益は何円');
    expect(problems[1].problemText).toContain('原価は何円');
    expect(problems[2].problemText).toContain('損失は何円');
    expect(problems[2].answer).toBeGreaterThan(0);
  });
  it.each(patterns)(
    '%s: 問題文の条件を満たす正整数の答えが1つだけ',
    (pattern) => {
      for (const p of generateEntranceExamProblems(pattern, 120)) {
        expect(solve(pattern, p.problemText)).toEqual([p.answer]);
        expect(p.unit).toBeDefined();
        expect(p.solutionSteps?.length).toBeGreaterThanOrEqual(2);
        expect(p.solutionSteps?.join('')).not.toMatch(/NaN|Infinity|undefined/);
      }
    }
  );

  it.each([0, 0.999999])('乱数%sでも、各出題条件が成立する', (value) => {
    vi.spyOn(Math, 'random').mockReturnValue(value);
    for (const pattern of patterns) {
      const problems = generateEntranceExamProblems(pattern, 4);
      expect(new Set(problems.map((p) => p.id)).size).toBe(4);
      expect(problems[0].problemText).not.toBe(problems[1].problemText);
      for (const p of problems)
        expect(solve(pattern, p.problemText)).toEqual([p.answer]);
    }
  });

  it.each([5, 6] as const)(
    '%i年生で選択・生成でき、道すじの全教材が登録されている',
    (grade) => {
      const gradePatterns = patterns.filter(
        (p) => UPPER_ENTRANCE_EXAM_PATTERNS[p].grade === grade
      );
      const route = getLearningStages(grade, 'entrance').flatMap(
        (stage) => stage.patterns
      );
      expect(new Set(route)).toEqual(new Set(gradePatterns));
      expect(route).toHaveLength(grade === 5 ? 10 : 5);
      expect(getDiscoveryGroups([...gradePatterns].reverse(), grade)).toEqual([
        { category: 'entrance', patterns: route },
      ]);
      for (const pattern of gradePatterns) {
        expect(getPatternCategory(pattern)).toBe('entrance');
        expect(PATTERNS_BY_GRADE[grade]).toContain(pattern);
        expect(
          getLearningStages(grade).flatMap((stage) => stage.patterns)
        ).not.toContain(pattern);
        for (const other of [1, 2, 3, 4, 5, 6])
          if (other !== grade)
            expect(PATTERNS_BY_GRADE[other]).not.toContain(pattern);
        const problems = generateProblems({
          grade: grade as Grade,
          problemType: 'basic',
          calculationPattern: pattern,
          operation: 'addition',
          problemCount: 4,
          layoutColumns: 2,
        });
        for (const p of problems) {
          expect(p.type).toBe('word');
          expect(solve(pattern, (p as WordProblem).problemText)).toEqual([
            (p as WordProblem).answer,
          ]);
        }
      }
      expect(filterPatternsByLanguage(gradePatterns, 'en')).toEqual([]);
    }
  );
});
