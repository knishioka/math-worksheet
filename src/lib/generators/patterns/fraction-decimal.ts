import type {
  CalculationPattern,
  WordProblem,
  WorksheetSettings,
} from '../../../types';
import { generateId, randomInt } from '../../utils/math';

type ConversionPattern = 'frac-to-decimal' | 'decimal-to-frac';

export function isFractionDecimalPattern(
  pattern?: CalculationPattern
): pattern is ConversionPattern {
  return pattern === 'frac-to-decimal' || pattern === 'decimal-to-frac';
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function generateFractionDecimalProblems(
  settings: WorksheetSettings,
  count: number,
  excludedTexts: ReadonlySet<string> = new Set()
): WordProblem[] {
  const pool: Pick<WordProblem, 'problemText' | 'answer'>[] = [];

  if (settings.calculationPattern === 'frac-to-decimal') {
    for (const denominator of [2, 4, 5, 10, 20, 25, 50, 100]) {
      for (let numerator = 1; numerator < denominator; numerator++) {
        pool.push({
          problemText: `${numerator}/${denominator}を小数に直しましょう。`,
          answer: numerator / denominator,
        });
      }
    }
  } else if (settings.calculationPattern === 'decimal-to-frac') {
    // 整数の百分の一単位で生成し、浮動小数点の丸めを約分に持ち込まない（#57）。
    for (let hundredths = 1; hundredths < 200; hundredths++) {
      if (hundredths === 100) continue;
      const divisor = gcd(hundredths, 100);
      pool.push({
        problemText: `${hundredths / 100}を約分した分数に。`,
        answer: `${hundredths / divisor}/${100 / divisor}`,
      });
    }
  } else {
    throw new Error('Unsupported fraction/decimal conversion pattern');
  }

  const available = pool.filter(
    (problem) => !excludedTexts.has(problem.problemText)
  );
  if (!Number.isInteger(count) || count < 0 || count > available.length) {
    throw new RangeError('Not enough unique conversion problems');
  }

  // 再試行方式と異なり、乱数が偏っても同一問題を選ばない（#57）。
  for (let i = available.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [available[i], available[j]] = [available[j], available[i]];
  }
  return available.slice(0, count).map((problem) => ({
    ...problem,
    id: generateId(),
    type: 'word',
    operation: 'division',
    showCalculation: false,
  }));
}
