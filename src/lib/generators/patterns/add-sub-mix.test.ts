import { describe, it, expect } from 'vitest';
import { generateProblems } from '..';
import type {
  BasicProblem,
  CalculationPattern,
  Grade,
  WorksheetSettings,
} from '../../../types';
import {
  PATTERNS_BY_GRADE,
  PATTERN_DESCRIPTIONS,
  PATTERN_LABELS,
} from '../../../types/calculation-patterns';
import { hasBorrow, hasCarryOver } from '../../utils/math';
import { ADD_SUB_MIXED_PATTERNS } from '../../../config/problem-patterns';
import { getOperationName } from '../../utils/formatting';

const settingsFor = (
  grade: Grade,
  calculationPattern: CalculationPattern,
  problemCount: number
): WorksheetSettings => ({
  grade,
  problemType: 'basic',
  operation: 'addition',
  problemCount,
  layoutColumns: 2,
  calculationPattern,
});

const generate = (
  grade: Grade,
  pattern: CalculationPattern,
  count: number
): BasicProblem[] =>
  generateProblems(settingsFor(grade, pattern, count)) as BasicProblem[];

type Kind = 'addPlain' | 'addCarry' | 'subPlain' | 'subBorrow';
const kindOf = (p: BasicProblem): Kind =>
  p.operation === 'addition'
    ? p.carryOver
      ? 'addCarry'
      : 'addPlain'
    : p.carryOver
      ? 'subBorrow'
      : 'subPlain';

const CASES: {
  grade: Grade;
  pattern: CalculationPattern;
  /** 実際の計算で繰り上がり・繰り下がりが起きるか */
  regroups: (p: BasicProblem) => boolean;
  inRange: (p: BasicProblem) => boolean;
}[] = [
  {
    grade: 1,
    pattern: 'add-sub-mixed-carry',
    // 1年生の規約: ちょうど10は繰り上がり扱いしない
    regroups: (p) =>
      p.operation === 'addition'
        ? p.answer! > 10
        : p.operand1! > 10 && p.operand1! % 10 < p.operand2!,
    inRange: (p) =>
      p.operand2! >= 1 &&
      p.operand2! <= 9 &&
      p.operand1! >= 1 &&
      p.operand1! <= 18 &&
      p.answer! >= 1 &&
      p.answer! <= 18 &&
      (p.operation === 'subtraction' || p.operand1! <= 9),
  },
  {
    grade: 2,
    pattern: 'add-sub-double-mixed',
    regroups: (p) =>
      p.operation === 'addition'
        ? hasCarryOver(p.operand1!, p.operand2!)
        : hasBorrow(p.operand1!, p.operand2!),
    inRange: (p) =>
      p.operand1! >= 10 &&
      p.operand1! <= 99 &&
      p.operand2! >= 10 &&
      p.operand2! <= 99 &&
      p.answer! >= 1 &&
      p.answer! <= 99,
  },
  {
    grade: 3,
    pattern: 'add-sub-triple-mixed',
    regroups: (p) =>
      p.operation === 'addition'
        ? hasCarryOver(p.operand1!, p.operand2!)
        : hasBorrow(p.operand1!, p.operand2!),
    inRange: (p) =>
      p.operand1! >= 100 &&
      p.operand1! <= 999 &&
      p.operand2! >= 100 &&
      p.operand2! <= 999 &&
      p.answer! >= 1 &&
      p.answer! <= 999,
  },
];

describe.each(CASES)(
  '$pattern（$grade年生）',
  ({ grade, pattern, regroups, inRange }) => {
    it('その学年で選択できる', () => {
      expect(PATTERNS_BY_GRADE[grade]).toContain(pattern);
    });

    it('答え・範囲・繰り上がりフラグが正しい', () => {
      for (let run = 0; run < 50; run++) {
        for (const p of generate(grade, pattern, 30)) {
          expect(p.type).toBe('basic');
          expect(p.answer).toBe(
            p.operation === 'addition'
              ? p.operand1! + p.operand2!
              : p.operand1! - p.operand2!
          );
          expect(inRange(p), JSON.stringify(p)).toBe(true);
          expect(regroups(p), JSON.stringify(p)).toBe(p.carryOver);
        }
      }
    });

    it.each([5, 6, 10, 20, 29, 30])(
      '%i問で4種類（たし算/ひき算×あり/なし）がバランスよく入る',
      (count) => {
        const problems = generate(grade, pattern, count);
        expect(problems).toHaveLength(count);

        const tally: Record<Kind, number> = {
          addPlain: 0,
          addCarry: 0,
          subPlain: 0,
          subBorrow: 0,
        };
        problems.forEach((p) => tally[kindOf(p)]++);

        const additions = Math.ceil(count / 2);
        const subtractions = count - additions;
        expect(tally.addCarry).toBe(Math.ceil(additions / 2));
        expect(tally.addPlain).toBe(Math.floor(additions / 2));
        expect(tally.subBorrow).toBe(Math.ceil(subtractions / 2));
        expect(tally.subPlain).toBe(Math.floor(subtractions / 2));
      }
    );

    it('出題順が固定の繰り返しにならない', () => {
      const firstKinds = new Set<Kind>();
      const sequences = new Set<string>();
      for (let run = 0; run < 40; run++) {
        const problems = generate(grade, pattern, 8);
        firstKinds.add(kindOf(problems[0]));
        sequences.add(problems.map(kindOf).join(','));
      }
      expect(firstKinds.size).toBeGreaterThan(1);
      expect(sequences.size).toBeGreaterThan(1);
    });

    it('同じ問題が重複しない', () => {
      for (let run = 0; run < 20; run++) {
        const keys = generate(grade, pattern, 20).map((p) =>
          p.operation === 'addition'
            ? `+${Math.min(p.operand1!, p.operand2!)},${Math.max(p.operand1!, p.operand2!)}`
            : `-${p.operand1},${p.operand2}`
        );
        expect(new Set(keys).size).toBe(keys.length);
      }
    });
  }
);

describe('混合パターンの見つけやすさ', () => {
  const searchText = (pattern: CalculationPattern): string =>
    `${PATTERN_LABELS[pattern]} ${PATTERN_DESCRIPTIONS[pattern]}`;

  it.each(CASES.map(({ grade, pattern }) => [grade, pattern] as const))(
    '%i年生の %s は「ミックス」「繰り上がり」「繰り下がり」「混合」で検索できる',
    (_grade, pattern) => {
      const text = searchText(pattern);
      for (const keyword of ['ミックス', '繰り上がり', '繰り下がり', '混合']) {
        expect(text).toContain(keyword);
      }
    }
  );

  it('1年生の10までのミックスは範囲が表示名で区別できる', () => {
    expect(PATTERN_LABELS['add-sub-mixed-basic']).toContain('10まで');
    expect(PATTERN_LABELS['add-sub-mixed-carry']).toContain('20まで');
    expect(PATTERN_DESCRIPTIONS['add-sub-mixed-carry']).toContain('繰り上がり');
  });

  it.each([...ADD_SUB_MIXED_PATTERNS])(
    '%s の見出しは「たし算・ひき算」',
    (pattern) => {
      expect(getOperationName('addition', pattern)).toBe('たし算・ひき算');
    }
  );
});
