import type {
  FractionProblem,
  MixedNumberProblem,
  WorksheetSettings,
} from '../../types';
import { randomInt, generateId } from '../utils/math';

export interface FractionOptions {
  maxNumerator?: number;
  maxDenominator?: number;
  allowImproper?: boolean; // 仮分数を許可
  requireSimplification?: boolean; // 約分が必要な問題
  commonDenominator?: boolean; // 同分母に限定
  mixedNumbers?: boolean; // 帯分数を使用
}

/**
 * 最大公約数を計算
 */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * 最小公倍数を計算
 */
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * 分数を約分
 */
function simplifyFraction(
  numerator: number,
  denominator: number
): [number, number] {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

/**
 * 仮分数を帯分数に変換
 */
function toMixedNumber(
  numerator: number,
  denominator: number
): [number, number, number] {
  const whole = Math.floor(numerator / denominator);
  const remainingNumerator = numerator % denominator;
  return [whole, remainingNumerator, denominator];
}

/**
 * 分数の足し算
 */
function addFractions(
  num1: number,
  den1: number,
  num2: number,
  den2: number
): [number, number] {
  const commonDen = lcm(den1, den2);
  const newNum1 = num1 * (commonDen / den1);
  const newNum2 = num2 * (commonDen / den2);
  return simplifyFraction(newNum1 + newNum2, commonDen);
}

/**
 * 分数の引き算
 */
function subtractFractions(
  num1: number,
  den1: number,
  num2: number,
  den2: number
): [number, number] {
  const commonDen = lcm(den1, den2);
  const newNum1 = num1 * (commonDen / den1);
  const newNum2 = num2 * (commonDen / den2);

  // 負の結果を避けるため、必要に応じて順序を入れ替え
  if (newNum1 < newNum2) {
    return simplifyFraction(newNum2 - newNum1, commonDen);
  }
  return simplifyFraction(newNum1 - newNum2, commonDen);
}

/**
 * 分数の掛け算
 */
function multiplyFractions(
  num1: number,
  den1: number,
  num2: number,
  den2: number
): [number, number] {
  return simplifyFraction(num1 * num2, den1 * den2);
}

/**
 * 分数の割り算
 */
function divideFractions(
  num1: number,
  den1: number,
  num2: number,
  den2: number
): [number, number] {
  return simplifyFraction(num1 * den2, den1 * num2);
}

/**
 * 分数問題を生成
 */
export function generateFractionProblem(
  settings: WorksheetSettings,
  options: FractionOptions = {}
): FractionProblem {
  const {
    maxNumerator = 12,
    maxDenominator = 12,
    allowImproper = false,
    requireSimplification = false,
    commonDenominator = false,
  } = options;

  let numerator1: number = 1,
    denominator1: number = 2;
  let numerator2: number = 1,
    denominator2: number = 2;
  let answerNumerator: number = 1,
    answerDenominator: number = 2;

  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    // 第1の分数を生成
    denominator1 = randomInt(2, maxDenominator);
    numerator1 = allowImproper
      ? randomInt(1, maxNumerator)
      : randomInt(1, denominator1 - 1);

    // 第2の分数を生成
    if (commonDenominator) {
      denominator2 = denominator1;
    } else {
      denominator2 = randomInt(2, maxDenominator);
    }
    numerator2 = allowImproper
      ? randomInt(1, maxNumerator)
      : randomInt(1, denominator2 - 1);

    attempts++;

    // 計算実行
    switch (settings.operation) {
      case 'addition':
        [answerNumerator, answerDenominator] = addFractions(
          numerator1,
          denominator1,
          numerator2,
          denominator2
        );
        break;
      case 'subtraction':
        [answerNumerator, answerDenominator] = subtractFractions(
          numerator1,
          denominator1,
          numerator2,
          denominator2
        );
        break;
      case 'multiplication':
        [answerNumerator, answerDenominator] = multiplyFractions(
          numerator1,
          denominator1,
          numerator2,
          denominator2
        );
        break;
      case 'division':
        [answerNumerator, answerDenominator] = divideFractions(
          numerator1,
          denominator1,
          numerator2,
          denominator2
        );
        break;
      default:
        throw new Error(`Unsupported operation: ${settings.operation}`);
    }

    // 制約チェック
    if (requireSimplification) {
      // 約分が必要な問題を求める場合
      const [origNum, origDen] =
        settings.operation === 'addition'
          ? [
              numerator1 * denominator2 + numerator2 * denominator1,
              denominator1 * denominator2,
            ]
          : [answerNumerator, answerDenominator];
      if (gcd(origNum, origDen) === 1) continue;
    }

    // 答えが0になるケースは避ける（同値の減算など）
    if (answerNumerator === 0) continue;

    // 答えが仮分数で、それが許可されていない場合は続行
    if (!allowImproper && answerNumerator >= answerDenominator) continue;

    // 有効な問題が生成できた
    break;
  }

  return {
    id: generateId(),
    type: 'fraction',
    operation: settings.operation,
    numerator1,
    denominator1,
    numerator2,
    denominator2,
    answerNumerator,
    answerDenominator,
    simplified: true, // 計算結果は常に約分済み
  };
}

/**
 * 複数の分数問題を生成
 */
export function generateFractionProblems(
  settings: WorksheetSettings,
  count: number,
  options: FractionOptions = {}
): FractionProblem[] {
  const problems: FractionProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let problem: FractionProblem;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      problem = generateFractionProblem(settings, options);
      const key = `${problem.numerator1}/${problem.denominator1}${settings.operation === 'addition' ? '+' : settings.operation === 'subtraction' ? '-' : settings.operation === 'multiplication' ? '×' : '÷'}${problem.numerator2}/${problem.denominator2}`;

      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    problems.push(problem);
  }

  return problems;
}

/**
 * 学年に応じた分数問題を生成
 */
export function generateGradeFractionProblems(
  grade: number,
  count: number
): FractionProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: grade as 1 | 2 | 3 | 4 | 5 | 6,
    problemType: 'fraction',
    operation: 'addition',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (grade) {
    case 1:
      // 1年生: 分数は学習しない
      return [];

    case 2:
      // 2年生: 簡単な分数の概念（1/2、1/3、1/4など）
      return generateFractionProblems(baseSettings, count, {
        maxNumerator: 1,
        maxDenominator: 4,
        commonDenominator: true,
        allowImproper: false,
      });

    case 3: {
      // 3年生: 単位分数、同分母分数の加減
      const operation = Math.random() < 0.5 ? 'addition' : 'subtraction';
      return generateFractionProblems({ ...baseSettings, operation }, count, {
        maxNumerator: 6,
        maxDenominator: 8,
        commonDenominator: true,
        allowImproper: false,
      });
    }

    case 4: {
      // 4年生: 同分母分数の加減、真分数・仮分数
      const op4 = Math.random() < 0.5 ? 'addition' : 'subtraction';
      return generateFractionProblems(
        { ...baseSettings, operation: op4 },
        count,
        {
          maxNumerator: 10,
          maxDenominator: 12,
          commonDenominator: Math.random() < 0.7, // 70%は同分母
          allowImproper: true,
        }
      );
    }

    case 5: {
      // 5年生: 異分母分数の加減、約分・通分
      const op5 = Math.random() < 0.5 ? 'addition' : 'subtraction';
      return generateFractionProblems(
        { ...baseSettings, operation: op5 },
        count,
        {
          maxNumerator: 12,
          maxDenominator: 15,
          commonDenominator: false,
          allowImproper: true,
          requireSimplification: Math.random() < 0.3, // 30%は約分必要
        }
      );
    }

    case 6: {
      // 6年生: 分数の乗除、複雑な計算
      const operations: Array<
        'addition' | 'subtraction' | 'multiplication' | 'division'
      > = ['addition', 'subtraction', 'multiplication', 'division'];
      const op6 = operations[Math.floor(Math.random() * operations.length)];
      return generateFractionProblems(
        { ...baseSettings, operation: op6 },
        count,
        {
          maxNumerator: 15,
          maxDenominator: 20,
          commonDenominator: false,
          allowImproper: true,
          requireSimplification: Math.random() < 0.4, // 40%は約分必要
        }
      );
    }

    default:
      return generateFractionProblems(baseSettings, count, {
        maxNumerator: 8,
        maxDenominator: 10,
        commonDenominator: true,
        allowImproper: false,
      });
  }
}

/**
 * 帯分数問題を生成
 */
export function generateMixedNumberProblem(
  settings: WorksheetSettings,
  options: FractionOptions = {}
): MixedNumberProblem {
  const { maxDenominator = 8 } = options;

  // 帯分数を生成
  const whole1 = randomInt(1, 3);
  const denominator1 = randomInt(2, maxDenominator);
  const numerator1 = randomInt(1, denominator1 - 1);

  const whole2 = randomInt(1, 3);
  const denominator2 = randomInt(2, maxDenominator);
  const numerator2 = randomInt(1, denominator2 - 1);

  // 仮分数に変換して計算
  const improperNum1 = whole1 * denominator1 + numerator1;
  const improperNum2 = whole2 * denominator2 + numerator2;

  let resultNum: number, resultDen: number;

  switch (settings.operation) {
    case 'addition':
      [resultNum, resultDen] = addFractions(
        improperNum1,
        denominator1,
        improperNum2,
        denominator2
      );
      break;
    case 'subtraction':
      [resultNum, resultDen] = subtractFractions(
        improperNum1,
        denominator1,
        improperNum2,
        denominator2
      );
      break;
    default:
      throw new Error(
        `Unsupported operation for mixed numbers: ${settings.operation}`
      );
  }

  // 帯分数に変換
  const [answerWhole, answerNumerator, answerDenominator] = toMixedNumber(
    resultNum,
    resultDen
  );

  return {
    id: generateId(),
    type: 'mixed',
    operation: settings.operation,
    whole1,
    numerator1,
    denominator1,
    whole2,
    numerator2,
    denominator2,
    answerWhole,
    answerNumerator,
    answerDenominator,
  };
}
