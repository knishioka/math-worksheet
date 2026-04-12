import type { NumberTracingProblem } from '../../types';
import { generateId } from '../utils/math';

/**
 * 数字なぞり書き問題を生成する
 * 0〜9をこの順で生成。countが10を超える場合は0から繰り返す。
 */
export function generateNumberTracingProblems(
  count: number
): NumberTracingProblem[] {
  const problems: NumberTracingProblem[] = [];
  const safeCount = Math.max(1, Math.min(count, 100));

  for (let i = 0; i < safeCount; i++) {
    const digit = i % 10;
    problems.push({
      id: generateId(),
      type: 'number-tracing',
      operation: 'addition',
      digit,
      traceCount: 3,
      practiceCount: 3,
    });
  }

  return problems;
}
