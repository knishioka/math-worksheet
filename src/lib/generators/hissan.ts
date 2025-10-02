import type { Grade, Operation, HissanProblem } from '../../types';
import { generateId } from '../utils/math';

/**
 * 筆算問題生成関数
 * 学年に応じた適切な桁数と難易度で生成
 */

interface HissanGeneratorOptions {
  grade: Grade;
  operation: Operation;
  showCarry?: boolean;
  showPartialProducts?: boolean;
}

/**
 * 学年に応じた数値範囲を取得
 */
function getNumberRange(grade: Grade, operation: Operation): [number, number] {
  switch (grade) {
    case 1:
      // 1年生: 1桁 + 1桁（繰り上がりあり）
      return operation === 'addition' ? [10, 20] : [1, 10];

    case 2:
      // 2年生: 2桁 + 2桁
      return operation === 'multiplication' ? [2, 9] : [10, 99];

    case 3:
      // 3年生: 3桁 × 1桁、3桁 ÷ 1桁
      if (operation === 'multiplication') {
        return [100, 999]; // operand1は3桁
      } else if (operation === 'division') {
        return [100, 999];
      }
      return [100, 999];

    case 4:
      // 4年生: 3桁 × 2桁
      if (operation === 'multiplication') {
        return [100, 999];
      } else if (operation === 'division') {
        return [100, 999];
      }
      return [100, 999];

    case 5:
    case 6:
      // 5-6年生: より大きな数
      return [100, 9999];

    default:
      return [10, 99];
  }
}

/**
 * 筆算のたし算問題を生成
 */
function generateHissanAddition(options: HissanGeneratorOptions): HissanProblem {
  const [min, max] = getNumberRange(options.grade, 'addition');

  const operand1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const operand2 = Math.floor(Math.random() * (max - min + 1)) + min;
  const answer = operand1 + operand2;

  return {
    id: generateId(),
    type: 'hissan',
    operation: 'addition',
    operand1,
    operand2,
    answer,
    showCarry: options.showCarry ?? false,
  };
}

/**
 * 筆算のひき算問題を生成
 */
function generateHissanSubtraction(
  options: HissanGeneratorOptions
): HissanProblem {
  const [min, max] = getNumberRange(options.grade, 'subtraction');

  // operand1 > operand2 になるように生成
  let operand1 = Math.floor(Math.random() * (max - min + 1)) + min;
  let operand2 = Math.floor(Math.random() * (max - min + 1)) + min;

  if (operand1 < operand2) {
    [operand1, operand2] = [operand2, operand1];
  }

  const answer = operand1 - operand2;

  return {
    id: generateId(),
    type: 'hissan',
    operation: 'subtraction',
    operand1,
    operand2,
    answer,
    showCarry: options.showCarry ?? false,
  };
}

/**
 * 筆算のかけ算問題を生成
 */
function generateHissanMultiplication(
  options: HissanGeneratorOptions
): HissanProblem {
  let operand1: number;
  let operand2: number;

  if (options.grade === 2) {
    // 2年生: 九九の範囲
    operand1 = Math.floor(Math.random() * 9) + 1;
    operand2 = Math.floor(Math.random() * 9) + 1;
  } else if (options.grade === 3) {
    // 3年生: 3桁 × 1桁
    operand1 = Math.floor(Math.random() * 900) + 100;
    operand2 = Math.floor(Math.random() * 9) + 1;
  } else {
    // 4年生以上: 3桁 × 2桁
    const [min, max] = getNumberRange(options.grade, 'multiplication');
    operand1 = Math.floor(Math.random() * (max - min + 1)) + min;
    operand2 = Math.floor(Math.random() * 90) + 10;
  }

  const answer = operand1 * operand2;

  return {
    id: generateId(),
    type: 'hissan',
    operation: 'multiplication',
    operand1,
    operand2,
    answer,
    showPartialProducts: options.showPartialProducts ?? false,
  };
}

/**
 * 筆算のわり算問題を生成
 */
function generateHissanDivision(
  options: HissanGeneratorOptions
): HissanProblem {
  let divisor: number;
  let quotient: number;

  if (options.grade === 3) {
    // 3年生: 九九の範囲で割り切れる
    divisor = Math.floor(Math.random() * 9) + 1;
    quotient = Math.floor(Math.random() * 9) + 1;
  } else {
    // 4年生以上: より大きな数、余りあり
    divisor = Math.floor(Math.random() * 9) + 1;
    quotient = Math.floor(Math.random() * 90) + 10;
  }

  const dividend = divisor * quotient;
  const remainder = options.grade >= 4 ? Math.floor(Math.random() * divisor) : 0;
  const finalDividend = dividend + remainder;

  return {
    id: generateId(),
    type: 'hissan',
    operation: 'division',
    operand1: finalDividend, // 被除数
    operand2: divisor, // 除数
    answer: quotient, // 商
    remainder,
  };
}

/**
 * メイン生成関数
 */
export function generateHissanProblem(
  options: HissanGeneratorOptions
): HissanProblem {
  switch (options.operation) {
    case 'addition':
      return generateHissanAddition(options);
    case 'subtraction':
      return generateHissanSubtraction(options);
    case 'multiplication':
      return generateHissanMultiplication(options);
    case 'division':
      return generateHissanDivision(options);
    default:
      throw new Error(`Unsupported operation: ${options.operation}`);
  }
}
