import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ENTRANCE_EXAM_PATTERNS,
  UPPER_ENTRANCE_EXAM_EN_PATTERNS,
  UPPER_ENTRANCE_EXAM_PATTERNS,
  type UpperEntranceExamEnPattern,
} from '../../config/entrance-exam-patterns';
import { getLearningStages } from '../../config/learning-paths';
import {
  buildPatternCatalog,
  getEntryLanguageSupport,
  resolveEntryPattern,
} from '../../config/pattern-catalog';
import {
  getPatternCategory,
  getPatternLanguage,
} from '../../config/pattern-categories';
import { getEffectiveCounts } from '../../config/print-templates';
import { PATTERNS_BY_GRADE, type Grade, type WordProblemEn } from '../../types';
import { getEffectiveProblemType } from '../utils/problem-type-detector';
import { generateProblems } from './index';
import { generateEntranceExamProblems } from './entrance-exam';

const patterns = Object.keys(
  UPPER_ENTRANCE_EXAM_EN_PATTERNS
) as UpperEntranceExamEnPattern[];
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
function ratios(text: string): number[][] {
  return [...text.matchAll(/(\d+):(\d+)/g)].map((m) => [
    Number(m[1]),
    Number(m[2]),
  ]);
}

// 英語の問題文から条件を取り出し、保存された解答・解説を参照せず候補を検証する。
function solve(pattern: UpperEntranceExamEnPattern, text: string): number[] {
  switch (pattern) {
    case 'entrance-multiples-en': {
      const [[a, b], [c, d]] = ratios(text);
      const amount = number(text, /(?:gives Aoi|receives) (\d+)/);
      const transfer = text.includes('gives Aoi');
      return range(100)
        .filter((unit) => {
          const nextA = a * unit + amount;
          const nextB = b * unit + (transfer ? -amount : amount);
          return nextB > 0 && nextA * d === nextB * c;
        })
        .map((unit) => a * unit);
    }
    case 'entrance-ratio-sharing-en': {
      const parts = ratios(text);
      const total = number(text, /(\d+) cards (?:are shared|in total)/);
      const [a, b] = parts[0];
      if (parts.length === 1)
        return range(total - 1).filter(
          (first) => first * b === (total - first) * a
        );
      const [c, d] = parts[1];
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
    case 'entrance-age-en': {
      const parent = number(text, /father is (\d+) years/);
      const child = number(text, /child is (\d+) years/);
      const factor = number(text, /(\d+) times/);
      const sign = text.includes('from now') ? 1 : -1;
      return range(100).filter(
        (years) =>
          child + sign * years >= 0 &&
          parent + sign * years === factor * (child + sign * years)
      );
    }
    case 'entrance-equivalent-en': {
      const fractions = [...text.matchAll(/(\d+)\/(\d+)/g)].map((m) => [
        Number(m[1]),
        Number(m[2]),
      ]);
      const remaining = number(text, /(?:and|still) (\d+) pages/);
      const [a, b] = fractions[0];
      if (fractions.length === 1)
        return range(5000).filter((total) => total * (b - a) === remaining * b);
      const [c, d] = fractions[1];
      return range(5000).filter(
        (total) => total * (b - a) * (d - c) === remaining * b * d
      );
    }
    case 'entrance-reverse-en': {
      const nums = values(text);
      if (text.includes('divided by')) {
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
    case 'entrance-profit-loss-en': {
      const markup = number(text, /profit of (\d+)%/);
      const discount = number(text, /(\d+)% off/);
      if (text.startsWith('An item costs')) {
        const cost = number(text, /costs RM(\d+)/);
        return range(2000).filter(
          (profit) =>
            (cost + (text.includes('loss') ? -profit : profit)) * 10000 ===
            cost * (100 + markup) * (100 - discount)
        );
      }
      const profit = number(text, /profit is RM(\d+)/);
      return range(10000).filter(
        (cost) =>
          (cost + profit) * 10000 === cost * (100 + markup) * (100 - discount)
      );
    }
    case 'entrance-salt-water-en': {
      const nums = values(text);
      if (text.startsWith('Only water')) {
        const [mass, initial, target] = nums;
        return range(2000).filter(
          (water) => initial * mass === target * (mass + water)
        );
      }
      const [massA, a, massB, b] = nums;
      return range(99).filter(
        (concentration) =>
          concentration * (massA + massB) === a * massA + b * massB
      );
    }
    case 'entrance-traveler-en': {
      const distance = number(text, /(\d+) m (?:apart|ahead)/);
      const [a, b] = [...text.matchAll(/(\d+) m per minute/g)].map((m) =>
        Number(m[1])
      );
      return range(500).filter((minutes) =>
        text.includes('towards each other')
          ? (a + b) * minutes === distance
          : a * minutes + distance === b * minutes
      );
    }
    case 'entrance-train-passing-en': {
      const lengths = [...text.matchAll(/(\d+) m long/g)].map((m) =>
        Number(m[1])
      );
      const speeds = [...text.matchAll(/(\d+) m per second/g)].map((m) =>
        Number(m[1])
      );
      expect(lengths).toHaveLength(2);
      expect(lengths.every((length) => length > 0)).toBe(true);
      return range(1000).filter(
        (seconds) =>
          speeds.reduce((a, b) => a + b, 0) * seconds ===
          lengths.reduce((a, b) => a + b, 0)
      );
    }
    case 'entrance-river-en': {
      const still = number(text, /(\d+) m per minute in still water/);
      const current = number(text, /flows at (\d+) m per minute/);
      const distance = number(text, /goes (\d+) m/);
      expect(still).toBeGreaterThan(current);
      return range(1000).filter((minutes) =>
        text.includes('downstream')
          ? (still + current) * minutes === distance
          : still * minutes === distance + current * minutes
      );
    }
    case 'entrance-work-en': {
      const a = number(text, /takes A (\d+) days/);
      const b = number(text, /and B (\d+) days/);
      const first = text.includes('alone for the first')
        ? number(text, /first (\d+) days/)
        : 0;
      expect(first).toBeLessThan(a);
      return range(500).filter(
        (together) => (first + together) * b + together * a === a * b
      );
    }
    case 'entrance-newton-en': {
      const perWorker = number(text, /sorts (\d+) books? per minute/);
      if (text.includes('How many books are returned')) {
        const [[a, t], [b, u]] = [
          ...text.matchAll(/(\d+) people take (\d+) minutes/g),
        ].map((m) => [Number(m[1]), Number(m[2])]);
        return range(a * perWorker - 1).filter(
          (arriving) =>
            (a * perWorker - arriving) * t === (b * perWorker - arriving) * u
        );
      }
      const arriving = number(text, /(\d+) books? (?:is|are) returned per minute/);
      const workers = number(text, /With (\d+) people/);
      const firstMinutes = number(text, /cleared in (\d+) minutes/);
      const targetMinutes = number(text, /pile in (\d+) minutes/);
      const initial = (workers * perWorker - arriving) * firstMinutes;
      expect(initial).toBeGreaterThan(0);
      return range(100).filter(
        (candidate) =>
          (candidate * perWorker - arriving) * targetMinutes === initial
      );
    }
    case 'entrance-advanced-crane-turtle-en': {
      const total = number(text, /There are (\d+)/);
      const legs = number(text, /(\d+) legs in total/);
      const factor = text.includes('the same as')
        ? 1
        : number(text, /dogs is (\d+) times/);
      return range(total - 1).filter((spiders) => {
        const dogs = spiders * factor;
        const chickens = total - dogs - spiders;
        return chickens > 0 && 2 * chickens + 4 * dogs + 8 * spiders === legs;
      });
    }
    case 'entrance-advanced-ratio-age-en': {
      const factor = number(text, /is (\d+):1/);
      const useSum = text.includes('sum of their ages');
      const given = number(
        text,
        /(?:sum of their ages is|difference between their ages is) (\d+)/
      );
      const children = range(100).filter(
        (child) =>
          (useSum ? child * (factor + 1) : child * (factor - 1)) === given
      );
      expect(children).toHaveLength(1);
      const child = children[0];
      const parent = child * factor;
      const future = text.match(/ages be (\d+):(\d+)/)!;
      return range(100).filter(
        (years) =>
          (parent + years) * Number(future[2]) ===
          (child + years) * Number(future[1])
      );
    }
    case 'entrance-advanced-speed-en': {
      const speeds = [...text.matchAll(/(\d+) m per minute/g)].map((m) =>
        Number(m[1])
      );
      if (text.includes('follows the same path')) {
        const delay = number(text, /(\d+) minutes later/);
        const [a, b] = speeds;
        return range(500).filter(
          (minutes) => b * minutes === a * (minutes + delay)
        );
      }
      const distance = number(text, /are (\d+) m apart/);
      const first = number(text, /changes to \d+ m per minute (\d+) minutes/);
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

describe('5・6年生の受験文章題（英語版）', () => {
  it('売買損益は利益・原価の逆算・損失を順に出題する', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const problems = generateEntranceExamProblems('entrance-profit-loss-en', 3);
    expect(problems[0].problemText).toContain('what is the profit?');
    expect(problems[1].problemText).toContain('What is the cost');
    expect(problems[2].problemText).toContain('what is the loss?');
    expect(problems[2].answer).toBeGreaterThan(0);
  });

  it.each(patterns)(
    '%s: 問題文の条件を満たす正整数の答えが1つだけ',
    (pattern) => {
      for (const p of generateEntranceExamProblems(pattern, 120)) {
        expect(p.type).toBe('word-en');
        expect(solve(pattern, p.problemText)).toEqual([p.answer]);
        expect(p.unit).toBeDefined();
        expect(p.solutionSteps?.length).toBeGreaterThanOrEqual(2);
        expect(`${p.problemText}${p.solutionSteps?.join('')}`).not.toMatch(
          /NaN|Infinity|undefined|[ぁ-んァ-ン一-龥]/
        );
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
    '%i年生で日本語版と対になり、word-en として生成できる',
    (grade) => {
      const gradePatterns = patterns.filter(
        (p) => UPPER_ENTRANCE_EXAM_EN_PATTERNS[p].grade === grade
      );
      const japanese = Object.keys(UPPER_ENTRANCE_EXAM_PATTERNS).filter(
        (p) =>
          UPPER_ENTRANCE_EXAM_PATTERNS[
            p as keyof typeof UPPER_ENTRANCE_EXAM_PATTERNS
          ].grade === grade
      );
      // 日本語版と1対1
      expect(
        gradePatterns.map((p) => p.replace(/-en$/, '-jap')).sort()
      ).toEqual([...japanese].sort());
      // 英語版は道すじには載せない（カタログで日本語版とまとまる）
      const route = getLearningStages(grade, 'entrance').flatMap(
        (stage) => stage.patterns
      );
      for (const pattern of gradePatterns) {
        expect(route).not.toContain(pattern);
        expect(ENTRANCE_EXAM_PATTERNS[pattern].type).toBe('word-en');
        expect(getPatternCategory(pattern)).toBe('entrance');
        expect(getPatternLanguage(pattern)).toBe('en');
        expect(getEffectiveProblemType('basic', pattern)).toBe('word-en');
        expect(PATTERNS_BY_GRADE[grade]).toContain(pattern);
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
        }) as WordProblemEn[];
        expect(problems).toHaveLength(4);
        for (const p of problems) {
          expect(p.type).toBe('word-en');
          expect(p.language).toBe('en');
          expect(solve(pattern, p.problemText)).toEqual([p.answer]);
        }
        // 英語版の上限（6/10/9）を使う
        expect(
          getEffectiveCounts('word-en', pattern, grade as Grade).maxCounts
        ).toEqual({ 1: 6, 2: 10, 3: 9 });
      }
      const catalog = buildPatternCatalog(PATTERNS_BY_GRADE[grade], grade);
      const entrance = catalog.find((group) => group.category === 'entrance')!;
      expect(entrance.entries).toHaveLength(japanese.length);
      for (const entry of entrance.entries) {
        expect(getEntryLanguageSupport(entry)).toBe('both');
        expect(resolveEntryPattern(entry, 'en')).toMatch(/-en$/);
        expect(entry.onLearningPath).toBe(true);
      }
    }
  );
});
