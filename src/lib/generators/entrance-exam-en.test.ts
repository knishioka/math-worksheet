import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ENTRANCE_EXAM_EN_PATTERNS,
  ENTRANCE_EXAM_PATTERNS,
  isEntranceExamEnPattern,
  type EntranceExamEnPattern,
} from '../../config/entrance-exam-patterns';
import {
  buildPatternCatalog,
  getEntryLanguageSupport,
  resolveEntryPattern,
} from '../../config/pattern-catalog';
import {
  filterPatternsByLanguage,
  getPatternCategory,
  getPatternLanguage,
} from '../../config/pattern-categories';
import { getEffectiveCounts } from '../../config/print-templates';
import { PATTERNS_BY_GRADE, type WordProblemEn } from '../../types';
import {
  getEffectiveProblemType,
  isWordEnProblem,
} from '../utils/problem-type-detector';
import { generateProblems } from './index';
import { generateEntranceExamProblems } from './entrance-exam';

const patterns = Object.keys(
  ENTRANCE_EXAM_EN_PATTERNS
) as EntranceExamEnPattern[];
afterEach(() => vi.restoreAllMocks());

function numbers(text: string): number[] {
  return (text.match(/\d+/g) ?? []).map(Number);
}
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

// 英語の問題文だけから条件を読み取り、保存された答えと独立に解く。
function solve(pattern: EntranceExamEnPattern, text: string): number[] {
  const values = numbers(text);
  switch (pattern) {
    case 'entrance-sum-difference-en': {
      const [total, difference] = values;
      const small = range(total + 1).filter(
        (n) => n + (n + difference) === total
      );
      return text.includes('does Aoi have')
        ? small.map((n) => n + difference)
        : small;
    }
    case 'entrance-tree-planting-en': {
      const length = Number(
        text.match(/(?:A road is|around a pond is) (\d+) m/)![1]
      );
      const interval = Number(text.match(/spaced (\d+) m apart/)![1]);
      expect(length % interval).toBe(0);
      const positions = range(length / interval + 1).map((n) => n * interval);
      const planted = positions.filter((position) => {
        if (text.includes('not at either end'))
          return position > 0 && position < length;
        if (
          text.includes('other end does not') ||
          text.includes('around the pond')
        )
          return position < length;
        return true;
      });
      return [planted.length];
    }
    case 'entrance-crane-turtle-en': {
      const animals = text.includes('cranes and turtles');
      const [low, high, count, total] = animals
        ? [2, 4, values[0], values[1]]
        : [
            Number(text.match(/eraser costs RM(\d+)/)![1]),
            Number(text.match(/pencil costs RM(\d+)/)![1]),
            Number(text.match(/bought (\d+) of these/)![1]),
            Number(text.match(/paid RM(\d+)/)![1]),
          ];
      const candidates = range(count + 1).filter(
        (n) => low * (count - n) + high * n === total
      );
      expect(candidates[0]).toBeGreaterThan(0);
      expect(candidates[0]).toBeLessThan(count);
      return candidates;
    }
    case 'entrance-difference-gathering-en': {
      const notebooks = text.includes('notebooks');
      const match = notebooks
        ? text.match(
            /cost RM(\d+) each would cost RM(\d+) more .* cost RM(\d+) each/
          )!
        : text.match(
            /Solving (\d+) problems a day would give (\d+) more .* solving (\d+) problems a day/
          )!;
      const [high, extra, low] = match.slice(1).map(Number);
      return range(100)
        .map((n) => n + 1)
        .filter((n) => low * n + extra === high * n);
    }
    case 'entrance-excess-shortage-en': {
      const conditions = [
        ...text.matchAll(
          /each child gets (\d+) candies, (?:(\d+) candies are left over|there are (\d+) candies too few)/g
        ),
      ].map((match) => ({
        each: Number(match[1]),
        balance: match[2] ? Number(match[2]) : -Number(match[3]),
      }));
      expect(conditions).toHaveLength(2);
      const [a, b] = conditions;
      return range(100)
        .map((n) => n + 1)
        .filter((n) => {
          const total = a.each * n + a.balance;
          return total > 0 && total === b.each * n + b.balance;
        });
    }
    case 'entrance-elimination-en': {
      const [a, b, total1, c, d, total2] = values;
      const candidates: number[] = [];
      for (let pencil = 1; pencil <= total1; pencil++) {
        const eraser = (total1 - a * pencil) / b;
        if (
          Number.isInteger(eraser) &&
          eraser > 0 &&
          c * pencil + d * eraser === total2
        )
          candidates.push(eraser);
      }
      return candidates;
    }
  }
}

describe('中学受験問題（英語版）の生成', () => {
  it.each(patterns)('%s: 問題文だけから解が一意に決まる', (pattern) => {
    const problems = generateEntranceExamProblems(pattern, 120);
    expect(problems).toHaveLength(120);
    expect(new Set(problems.map((problem) => problem.id)).size).toBe(120);
    for (const problem of problems) {
      expect(problem.type).toBe('word-en');
      expect(solve(pattern, problem.problemText)).toEqual([problem.answer]);
      expect(Number.isInteger(problem.answer)).toBe(true);
      expect(problem.answer).toBeGreaterThan(0);
      expect(problem.unit).toBeDefined();
      expect(problem.solutionSteps?.length).toBeGreaterThanOrEqual(2);
      expect(
        `${problem.problemText}${problem.solutionSteps?.join('')}`
      ).not.toMatch(/NaN|undefined|Infinity|[ぁ-んァ-ン一-龥]/);
    }
  });

  it.each([0, 0.999999])('乱数が%sに固定されても全単元が成立する', (random) => {
    vi.spyOn(Math, 'random').mockReturnValue(random);
    for (const pattern of patterns) {
      const problems = generateEntranceExamProblems(pattern, 12);
      expect(new Set(problems.map((problem) => problem.id)).size).toBe(12);
      for (const problem of problems)
        expect(solve(pattern, problem.problemText)).toEqual([problem.answer]);
    }
  });

  it('日本語版と同じ条件を順に出す', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const trees = generateEntranceExamProblems('entrance-tree-planting-en', 4);
    expect(trees[0].problemText).toContain('including both ends');
    expect(trees[1].problemText).toContain('other end does not');
    expect(trees[2].problemText).toContain('not at either end');
    expect(trees[3].problemText).toContain('around the pond');
    const cranes = generateEntranceExamProblems('entrance-crane-turtle-en', 2);
    expect(cranes[0].problemText).toContain('cranes and turtles');
    expect(cranes[1].problemText).toContain('pencil');
  });
});

describe('英語版の登録と日本語版との対応', () => {
  it('4年生の受験カテゴリに英語教材として登録され、word-en で印刷される', () => {
    for (const pattern of patterns) {
      expect(isEntranceExamEnPattern(pattern)).toBe(true);
      expect(ENTRANCE_EXAM_PATTERNS[pattern].grade).toBe(4);
      expect(PATTERNS_BY_GRADE[4]).toContain(pattern);
      for (const grade of [1, 2, 3, 5, 6])
        expect(PATTERNS_BY_GRADE[grade]).not.toContain(pattern);
      expect(getPatternCategory(pattern)).toBe('entrance');
      expect(getPatternLanguage(pattern)).toBe('en');
      expect(isWordEnProblem(pattern)).toBe(true);
      expect(getEffectiveProblemType('basic', pattern)).toBe('word-en');
      const problems = generateProblems({
        grade: 4,
        problemType: 'basic',
        calculationPattern: pattern,
        operation: 'addition',
        problemCount: 5,
        layoutColumns: 2,
      }) as WordProblemEn[];
      expect(problems).toHaveLength(5);
      expect(problems.every((problem) => problem.type === 'word-en')).toBe(
        true
      );
      expect(problems.every((problem) => problem.language === 'en')).toBe(true);
    }
    expect(filterPatternsByLanguage(patterns, 'en')).toEqual(patterns);
    expect(filterPatternsByLanguage(patterns, 'ja')).toEqual([]);
    expect(isEntranceExamEnPattern('entrance-crane-turtle-jap')).toBe(false);
  });

  it('教材カタログでは日本語版と1枚にまとまり、言語で行き来できる', () => {
    const catalog = buildPatternCatalog(PATTERNS_BY_GRADE[4], 4);
    const entrance = catalog.find((group) => group.category === 'entrance')!;
    expect(entrance.entries).toHaveLength(6);
    for (const entry of entrance.entries) {
      expect(getEntryLanguageSupport(entry)).toBe('both');
      expect(resolveEntryPattern(entry, 'ja')).toMatch(/-jap$/);
      expect(resolveEntryPattern(entry, 'en')).toMatch(/-en$/);
      expect(entry.onLearningPath).toBe(true);
    }
  });

  it('英語版は長文に合わせて問題数の上限を日本語版より抑える', () => {
    const english = getEffectiveCounts(
      'word-en',
      'entrance-crane-turtle-en',
      4
    );
    const japanese = getEffectiveCounts('word', 'entrance-crane-turtle-jap', 4);
    for (const column of [1, 2, 3] as const) {
      expect(english.maxCounts[column]).toBeLessThan(
        japanese.maxCounts[column]
      );
      expect(english.recommendedCounts[column]).toBeLessThanOrEqual(
        english.maxCounts[column]
      );
    }
  });
});
