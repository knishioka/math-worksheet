import { describe, it, expect } from 'vitest';
import { generateNumberTracingProblems } from './number-tracing';

describe('generateNumberTracingProblems', () => {
  it('0〜9を順番に10問生成する', () => {
    const problems = generateNumberTracingProblems(10);
    expect(problems).toHaveLength(10);
    problems.forEach((p, i) => {
      expect(p.type).toBe('number-tracing');
      expect(p.digit).toBe(i);
      expect(p.traceCount).toBeGreaterThan(0);
      expect(p.practiceCount).toBeGreaterThan(0);
    });
  });

  it('countが10未満でも動作する', () => {
    const problems = generateNumberTracingProblems(5);
    expect(problems).toHaveLength(5);
    expect(problems.map((p) => p.digit)).toEqual([0, 1, 2, 3, 4]);
  });

  it('countが10を超えると0から繰り返す', () => {
    const problems = generateNumberTracingProblems(12);
    expect(problems).toHaveLength(12);
    expect(problems[10].digit).toBe(0);
    expect(problems[11].digit).toBe(1);
  });

  it('全問題がユニークなidを持つ', () => {
    const problems = generateNumberTracingProblems(10);
    const ids = new Set(problems.map((p) => p.id));
    expect(ids.size).toBe(10);
  });
});
