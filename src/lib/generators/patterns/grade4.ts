import type { BasicProblem, Problem, WorksheetSettings } from '../../../types';
import { generateId, randomInt } from '../../utils/math';

// 4年生: 大きな数のたし算
export function generateAddLargeNumbers(
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
      operand1 = randomInt(1000, 9999);
      operand2 = randomInt(1000, 9999);

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
    });
  }

  return problems;
}

// 4年生: 大きな数のひき算
export function generateSubLargeNumbers(
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
      operand1 = randomInt(2000, 9999);
      operand2 = randomInt(1000, operand1 - 1000);

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
    });
  }

  return problems;
}

// 4年生: 3桁×1桁のかけ算
export function generateMultTripleDigit(
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

// 4年生: あまりのあるわり算
export function generateDivWithRemainder(
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
      operand2 = randomInt(2, 9);
      const quotient = randomInt(10, 99);
      const remainder = randomInt(1, operand2 - 1);
      operand1 = operand2 * quotient + remainder;

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
      answer: Math.floor(operand1 / operand2),
    });
  }

  return problems;
}

// 4年生: 整数×小数
export function generateMultDecInt(
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
      operand1 = randomInt(2, 99);
      operand2 = Math.floor(randomInt(1, 99)) / 10;

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
      answer: Math.round(operand1 * operand2 * 10) / 10,
    });
  }

  return problems;
}

// 4年生: 整数÷小数
export function generateDivDecInt(
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
      operand2 = Math.floor(randomInt(2, 20)) / 10;
      const quotient = randomInt(2, 50);
      operand1 = Math.round(operand2 * quotient * 10) / 10;

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
      answer: Math.round(operand1 / operand2),
    });
  }

  return problems;
}

// 4年生: 帯分数の計算
export function generateFracMixedNumber(
  _settings: WorksheetSettings,
  count: number
): Problem[] {
  const problems: Problem[] = [];

  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() < 0.5;
    const denominator = randomInt(2, 8);

    if (isAddition) {
      const whole1 = randomInt(1, 5);
      const numerator1 = randomInt(1, denominator - 1);
      const whole2 = randomInt(1, 5);
      const numerator2 = randomInt(1, denominator - 1);

      const totalNumerator =
        whole1 * denominator + numerator1 + whole2 * denominator + numerator2;
      const answerWhole = Math.floor(totalNumerator / denominator);
      const answerNumerator = totalNumerator % denominator;

      problems.push({
        id: generateId(),
        type: 'mixed',
        operation: 'addition',
        whole1: whole1,
        numerator1: numerator1,
        denominator1: denominator,
        whole2: whole2,
        numerator2: numerator2,
        denominator2: denominator,
        answerWhole: answerWhole,
        answerNumerator: answerNumerator,
        answerDenominator: denominator,
      });
    } else {
      const whole1 = randomInt(2, 8);
      const numerator1 = randomInt(1, denominator - 1);
      const whole2 = randomInt(1, whole1 - 1);
      const numerator2 = randomInt(1, denominator - 1);

      const totalNumerator1 = whole1 * denominator + numerator1;
      const totalNumerator2 = whole2 * denominator + numerator2;

      const resultNumerator = totalNumerator1 - totalNumerator2;
      const answerWhole = Math.floor(resultNumerator / denominator);
      const answerNumerator = resultNumerator % denominator;

      problems.push({
        id: generateId(),
        type: 'mixed',
        operation: 'subtraction',
        whole1: whole1,
        numerator1: numerator1,
        denominator1: denominator,
        whole2: whole2,
        numerator2: numerator2,
        denominator2: denominator,
        answerWhole: answerWhole,
        answerNumerator: answerNumerator,
        answerDenominator: denominator,
      });
    }
  }

  return problems;
}
