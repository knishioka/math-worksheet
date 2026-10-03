import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ENTRANCE_EXAM_PATTERNS,
  type EntranceExamPattern,
  type UpperEntranceExamPattern,
} from '../../config/entrance-exam-patterns';
import { getLearningStages } from '../../config/learning-paths';
import {
  filterPatternsByLanguage,
  getPatternCategory,
} from '../../config/pattern-categories';
import { getDiscoveryGroups } from '../../config/pattern-discovery';
import { PATTERNS_BY_GRADE, type WordProblem } from '../../types';
import { getEffectiveProblemType } from '../utils/problem-type-detector';
import { generateProblems } from './index';
import { generateEntranceExamProblems } from './entrance-exam';

type BasicEntranceExamPattern = Exclude<
  EntranceExamPattern,
  UpperEntranceExamPattern
>;
const patterns = Object.keys(ENTRANCE_EXAM_PATTERNS).filter(
  (pattern) =>
    ENTRANCE_EXAM_PATTERNS[pattern as EntranceExamPattern].grade === 4
) as BasicEntranceExamPattern[];
afterEach(() => vi.restoreAllMocks());

function numbers(text: string): number[] {
  return (text.match(/\d+/g) ?? []).map(Number);
}

// 出題文の条件を満たす候補を全て列挙し、保存された解答と独立に検証する。
function solve(
  pattern: BasicEntranceExamPattern,
  problem: WordProblem
): number[] {
  const text = problem.problemText;
  const values = numbers(text);
  switch (pattern) {
    case 'entrance-sum-difference-jap': {
      const [total, difference] = values;
      const small = Array.from({ length: total + 1 }, (_, n) => n).filter(
        (n) => n + (n + difference) === total
      );
      return text.endsWith('あおいさんのビー玉は何個ですか。')
        ? small.map((n) => n + difference)
        : small;
    }
    case 'entrance-tree-planting-jap': {
      const length = Number(text.match(/長さは(\d+)m/)![1]);
      const interval = Number(text.match(/間は(\d+)m/)![1]);
      expect(length % interval).toBe(0);
      const positions = Array.from(
        { length: length / interval + 1 },
        (_, n) => n * interval
      );
      const planted = positions.filter((position) => {
        if (text.includes('両端には木を植えず'))
          return position > 0 && position < length;
        if (text.includes('片方の端には') || text.includes('池のまわり'))
          return position < length;
        return true;
      });
      return [planted.length];
    }
    case 'entrance-crane-turtle-jap': {
      const animals = text.includes('つるとかめ');
      const [low, high, count, total] = animals
        ? [2, 4, values[0], values[1]]
        : [
            Number(text.match(/1個(\d+)円/)![1]),
            Number(text.match(/1本(\d+)円/)![1]),
            Number(text.match(/合わせて(\d+)点/)![1]),
            Number(text.match(/代金は(\d+)円/)![1]),
          ];
      const candidates = Array.from({ length: count + 1 }, (_, n) => n).filter(
        (n) => low * (count - n) + high * n === total
      );
      expect(candidates[0]).toBeGreaterThan(0);
      expect(candidates[0]).toBeLessThan(count);
      return candidates;
    }
    case 'entrance-difference-gathering-jap': {
      const quantities = [...text.matchAll(/(?:1冊|毎日)(\d+)(?:円|問)/g)].map(
        (match) => Number(match[1])
      );
      const extra = Number(text.match(/(?:代金は|全部で)(\d+)(?:円|問)/)![1]);
      return Array.from({ length: 100 }, (_, n) => n + 1).filter(
        (n) => quantities[0] * n + extra === quantities[1] * n
      );
    }
    case 'entrance-excess-shortage-jap': {
      const conditions = [
        ...text.matchAll(/1人に(\d+)個ずつ配ると(\d+)個(余り|足りなくなり)/g),
      ].map((match) => ({
        each: Number(match[1]),
        balance: Number(match[2]) * (match[3] === '余り' ? 1 : -1),
      }));
      expect(conditions).toHaveLength(2);
      const [a, b] = conditions;
      return Array.from({ length: 100 }, (_, n) => n + 1).filter((n) => {
        const total = a.each * n + a.balance;
        return total > 0 && total === b.each * n + b.balance;
      });
    }
    case 'entrance-elimination-jap': {
      const [a, b, total1, c, d, total2] = values;
      const candidates = [];
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

describe('中学受験問題の生成', () => {
  it.each(patterns)('%s: 問題文だけから解が一意に決まる', (pattern) => {
    const problems = generateEntranceExamProblems(pattern, 120);
    expect(problems).toHaveLength(120);
    expect(new Set(problems.map((problem) => problem.id)).size).toBe(120);
    for (const problem of problems) {
      expect(solve(pattern, problem)).toEqual([problem.answer]);
      expect(Number.isInteger(problem.answer)).toBe(true);
      expect(problem.answer).toBeGreaterThan(0);
      expect(problem.solutionSteps?.length).toBeGreaterThanOrEqual(2);
      expect(problem.solutionSteps?.join('')).not.toMatch(
        /NaN|undefined|Infinity/
      );
    }
  });

  it.each([0, 0.999999])('乱数が%sに固定されても全単元が成立する', (random) => {
    vi.spyOn(Math, 'random').mockReturnValue(random);
    for (const pattern of patterns) {
      const problems = generateEntranceExamProblems(pattern, 12);
      expect(new Set(problems.map((problem) => problem.id)).size).toBe(12);
      for (const problem of problems)
        expect(solve(pattern, problem)).toEqual([problem.answer]);
    }
  });

  it('短いプリントにも異なる条件を順に出す', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const trees = generateEntranceExamProblems('entrance-tree-planting-jap', 4);
    expect(trees[0].problemText).toContain('両端にも');
    expect(trees[1].problemText).toContain('片方の端には');
    expect(trees[2].problemText).toContain('両端には木を植えず');
    expect(trees[3].problemText).toContain('池のまわり');
    const cranes = generateEntranceExamProblems('entrance-crane-turtle-jap', 2);
    expect(cranes[0].problemText).toContain('つるとかめ');
    expect(cranes[1].problemText).toContain('えんぴつ');
    const excess = generateEntranceExamProblems(
      'entrance-excess-shortage-jap',
      3
    );
    expect(excess[0].problemText.match(/余り/g)).toHaveLength(1);
    expect(excess[0].problemText.match(/足りなくなり/g)).toHaveLength(1);
    expect(excess[1].problemText.match(/余り/g)).toHaveLength(2);
    expect(excess[2].problemText.match(/足りなくなり/g)).toHaveLength(2);
    const elimination = generateEntranceExamProblems(
      'entrance-elimination-jap',
      2
    );
    expect(elimination[0].solutionSteps?.[0]).toContain('どちらも');
    expect(elimination[1].solutionSteps?.[0]).toContain('倍すると');
  });
});

describe('中学受験教材の登録と学習順', () => {
  it('4年生のカテゴリ・日本語教材として選べて既存入口から生成できる', () => {
    for (const pattern of patterns) {
      expect(PATTERNS_BY_GRADE[4]).toContain(pattern);
      for (const grade of [1, 2, 3, 5, 6])
        expect(PATTERNS_BY_GRADE[grade]).not.toContain(pattern);
      expect(getPatternCategory(pattern)).toBe('entrance');
      expect(getEffectiveProblemType('basic', pattern)).toBe('word');
      const problems = generateProblems({
        grade: 4,
        problemType: 'basic',
        calculationPattern: pattern,
        operation: 'addition',
        problemCount: 5,
        layoutColumns: 2,
      });
      expect(problems).toHaveLength(5);
      expect(problems.every((problem) => problem.type === 'word')).toBe(true);
    }
    expect(filterPatternsByLanguage(patterns, 'ja')).toEqual(patterns);
    expect(filterPatternsByLanguage(patterns, 'en')).toEqual([]);
  });

  it('学校算数と受験の道すじを分け、教材検索も受験の順序で並べる', () => {
    const route = getLearningStages(4, 'entrance').flatMap(
      (stage) => stage.patterns
    );
    expect(route).toEqual(patterns);
    expect(getLearningStages(4).flatMap((stage) => stage.patterns)).not.toEqual(
      expect.arrayContaining(patterns)
    );
    expect(getDiscoveryGroups([...patterns].reverse(), 4)).toEqual([
      { category: 'entrance', patterns },
    ]);
    expect(getLearningStages(3, 'entrance')).toEqual([]);
  });
});
