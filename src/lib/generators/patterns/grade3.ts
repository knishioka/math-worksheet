import type {
  BasicProblem,
  FractionProblem,
  WorksheetSettings,
} from '../../../types';
import { generateId, randomInt } from '../../utils/math';

// 3年生: 3桁のたし算
export function generateAddTripleDigit(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number, operand2: number;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      operand1 = randomInt(100, 999);
      operand2 = randomInt(100, 999);

      // 答えが1000を超えないようにする
      if (operand1 + operand2 > 999) {
        operand2 = randomInt(100, 999 - operand1);
      }

      key = `${operand1}+${operand2}`;
      const reverseKey = `${operand2}+${operand1}`;

      if (!usedCombinations.has(key) && !usedCombinations.has(reverseKey)) {
        usedCombinations.add(key);
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2,
      answer: operand1 + operand2,
      carryOver:
        (operand1 % 10) + (operand2 % 10) >= 10 ||
        (Math.floor(operand1 / 10) % 10) + (Math.floor(operand2 / 10) % 10) >=
          10,
    });
  }

  return problems;
}

// 3年生: 3桁のひき算
export function generateSubTripleDigit(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number, operand2: number;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      operand1 = randomInt(200, 999);
      operand2 = randomInt(100, operand1 - 100);

      key = `${operand1}-${operand2}`;

      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'subtraction',
      operand1,
      operand2,
      answer: operand1 - operand2,
      carryOver:
        operand1 % 10 < operand2 % 10 ||
        Math.floor(operand1 / 10) % 10 < Math.floor(operand2 / 10) % 10,
    });
  }

  return problems;
}

// 3年生: 2桁×1桁のかけ算
export function generateMultDoubleDigit(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number, operand2: number;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      operand1 = randomInt(10, 99);
      operand2 = randomInt(2, 9);

      key = `${operand1}×${operand2}`;

      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'multiplication',
      operand1,
      operand2,
      answer: operand1 * operand2,
    });
  }

  return problems;
}

// 3年生: 基本的なわり算（九九の範囲）
export function generateDivBasic(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number, operand2: number;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      // 九九の範囲で割り切れる数を生成
      operand2 = randomInt(2, 9);
      const quotient = randomInt(1, 9);
      operand1 = operand2 * quotient;

      key = `${operand1}÷${operand2}`;

      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'division',
      operand1,
      operand2,
      answer: operand1 / operand2,
    });
  }

  return problems;
}

// 3年生: 小数のたし算（0.1の位まで）
export function generateAddDecSimple(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number, operand2: number;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      // 0.1 から 9.9 までの小数を生成
      operand1 = Math.floor(randomInt(1, 99)) / 10;
      operand2 = Math.floor(randomInt(1, 99)) / 10;

      // 答えが10を超えないようにする
      if (operand1 + operand2 > 10) {
        operand2 = Math.floor(randomInt(1, 100 - operand1 * 10)) / 10;
      }

      key = `${operand1}+${operand2}`;
      const reverseKey = `${operand2}+${operand1}`;

      if (!usedCombinations.has(key) && !usedCombinations.has(reverseKey)) {
        usedCombinations.add(key);
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2,
      answer: Math.round((operand1 + operand2) * 10) / 10,
    });
  }

  return problems;
}

// 3年生: 小数のひき算（0.1の位まで）
export function generateSubDecSimple(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number, operand2: number;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      // 大きい方の数を生成
      operand1 = Math.floor(randomInt(20, 99)) / 10;
      operand2 = Math.floor(randomInt(1, operand1 * 10 - 1)) / 10;

      key = `${operand1}-${operand2}`;

      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'subtraction',
      operand1,
      operand2,
      answer: Math.round((operand1 - operand2) * 10) / 10,
    });
  }

  return problems;
}

// 3年生: 同分母分数の加減算
export function generateFracSameDenom(
  _settings: WorksheetSettings,
  count: number
): FractionProblem[] {
  const problems: FractionProblem[] = [];

  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() < 0.5;
    const denominator = randomInt(2, 10);

    if (isAddition) {
      const numerator1 = randomInt(1, denominator - 1);
      const numerator2 = randomInt(1, denominator - numerator1);

      problems.push({
        id: generateId(),
        type: 'fraction',
        operation: 'addition',
        numerator1: numerator1,
        denominator1: denominator,
        numerator2: numerator2,
        denominator2: denominator,
        answerNumerator: numerator1 + numerator2,
        answerDenominator: denominator,
        simplified: true,
      });
    } else {
      const numerator1 = randomInt(2, denominator - 1);
      const numerator2 = randomInt(1, numerator1 - 1);

      problems.push({
        id: generateId(),
        type: 'fraction',
        operation: 'subtraction',
        numerator1: numerator1,
        denominator1: denominator,
        numerator2: numerator2,
        denominator2: denominator,
        answerNumerator: numerator1 - numerator2,
        answerDenominator: denominator,
        simplified: true,
      });
    }
  }

  return problems;
}
