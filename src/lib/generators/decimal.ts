import type { DecimalProblem, WorksheetSettings } from '../../types';
import { randomInt, generateId } from '../utils/math';

export interface DecimalOptions {
  minValue?: number;
  maxValue?: number;
  decimalPlaces?: number;
  maxDecimalPlaces?: number;
  allowZero?: boolean;
  wholeNumberRange?: [number, number];
}

/**
 * 指定された小数点以下桁数で小数を生成
 */
function generateDecimal(
  minValue: number,
  maxValue: number,
  decimalPlaces: number
): number {
  const multiplier = Math.pow(10, decimalPlaces);
  const min = Math.round(minValue * multiplier);
  const max = Math.round(maxValue * multiplier);
  const randomValue = randomInt(min, max);
  return randomValue / multiplier;
}

/**
 * 小数の桁数を取得
 */
function getDecimalPlaces(num: number): number {
  const str = num.toString();
  const decimalIndex = str.indexOf('.');
  return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
}

/**
 * 小数を指定桁数に丸める
 */
function roundToDecimalPlaces(num: number, places: number): number {
  const multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * 小数問題を生成
 */
export function generateDecimalProblem(
  settings: WorksheetSettings,
  options: DecimalOptions = {}
): DecimalProblem {
  const {
    minValue = 0.1,
    maxValue = 99.9,
    decimalPlaces = 1,
    maxDecimalPlaces = 2,
    allowZero = false,
    wholeNumberRange = [0, 99],
  } = options;

  let operand1: number, operand2: number, answer: number;
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    // 小数点以下の桁数を決定
    const places1 = randomInt(1, maxDecimalPlaces);
    const places2 = randomInt(1, maxDecimalPlaces);
    const maxPlaces = Math.max(places1, places2);

    switch (settings.operation) {
      case 'addition':
      case 'subtraction':
        // 加減算: 比較的簡単な小数を生成
        operand1 = generateDecimal(minValue, maxValue, places1);
        operand2 = generateDecimal(minValue, maxValue, places2);
        
        if (settings.operation === 'addition') {
          answer = operand1 + operand2;
        } else {
          // 引き算で負の数にならないよう調整
          if (operand1 < operand2) {
            [operand1, operand2] = [operand2, operand1];
          }
          answer = operand1 - operand2;
        }
        
        // 答えを適切な桁数に丸める
        answer = roundToDecimalPlaces(answer, maxPlaces);
        break;

      case 'multiplication':
        // 掛け算: 一方を整数、他方を小数にすることが多い
        if (Math.random() < 0.6) {
          // 整数 × 小数
          operand1 = randomInt(wholeNumberRange[0] + 1, wholeNumberRange[1]);
          operand2 = generateDecimal(0.1, 9.9, Math.min(places2, 2));
        } else {
          // 小数 × 小数
          operand1 = generateDecimal(0.1, 9.9, places1);
          operand2 = generateDecimal(0.1, 9.9, places2);
        }
        
        answer = operand1 * operand2;
        answer = roundToDecimalPlaces(answer, maxDecimalPlaces);
        break;

      case 'division':
        // 割り算: 整数÷小数または小数÷整数
        if (Math.random() < 0.5) {
          // 整数 ÷ 小数
          operand1 = randomInt(wholeNumberRange[0] + 1, wholeNumberRange[1]);
          operand2 = generateDecimal(0.1, 9.9, Math.min(places2, 2));
        } else {
          // 小数 ÷ 整数
          operand1 = generateDecimal(1.0, 99.9, places1);
          operand2 = randomInt(2, 9);
        }
        
        answer = operand1 / operand2;
        answer = roundToDecimalPlaces(answer, maxDecimalPlaces);
        break;

      default:
        throw new Error(`Unsupported operation: ${settings.operation}`);
    }

    attempts++;

    // 制約チェック
    if (!allowZero && (operand1 === 0 || operand2 === 0 || answer === 0)) continue;
    if (answer < 0) continue;
    if (answer > 1000) continue; // 答えが大きすぎる場合は再生成

    // 有効な問題が生成できた
    break;
  }

  const finalDecimalPlaces = Math.max(
    getDecimalPlaces(operand1),
    getDecimalPlaces(operand2),
    getDecimalPlaces(answer)
  );

  return {
    id: generateId(),
    type: 'decimal',
    operation: settings.operation,
    operand1,
    operand2,
    answer,
    decimalPlaces: finalDecimalPlaces,
  };
}

/**
 * 複数の小数問題を生成
 */
export function generateDecimalProblems(
  settings: WorksheetSettings,
  count: number,
  options: DecimalOptions = {}
): DecimalProblem[] {
  const problems: DecimalProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let problem: DecimalProblem;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      problem = generateDecimalProblem(settings, options);
      const key = `${problem.operand1}${settings.operation === 'addition' ? '+' : settings.operation === 'subtraction' ? '-' : settings.operation === 'multiplication' ? '×' : '÷'}${problem.operand2}`;

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
 * 学年に応じた小数問題を生成
 */
export function generateGradeDecimalProblems(
  grade: number,
  count: number
): DecimalProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: grade as 1 | 2 | 3 | 4 | 5 | 6,
    problemType: 'decimal',
    operation: 'addition',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (grade) {
    case 1:
    case 2:
      // 1・2年生: 小数は学習しない
      return [];

    case 3:
      // 3年生: 0.1の位までの小数、小数のたし算・ひき算
      const operation3 = Math.random() < 0.5 ? 'addition' : 'subtraction';
      return generateDecimalProblems(
        { ...baseSettings, operation: operation3 },
        count,
        {
          minValue: 0.1,
          maxValue: 9.9,
          decimalPlaces: 1,
          maxDecimalPlaces: 1,
          allowZero: false,
        }
      );

    case 4:
      // 4年生: 整数×小数、整数÷小数
      const operation4 = Math.random() < 0.5 ? 'multiplication' : 'division';
      return generateDecimalProblems(
        { ...baseSettings, operation: operation4 },
        count,
        {
          minValue: 0.1,
          maxValue: 9.9,
          decimalPlaces: 1,
          maxDecimalPlaces: 2,
          allowZero: false,
          wholeNumberRange: [1, 20],
        }
      );

    case 5:
      // 5年生: 小数×小数、小数÷小数
      const operations5: Array<'addition' | 'subtraction' | 'multiplication' | 'division'> = 
        ['addition', 'subtraction', 'multiplication', 'division'];
      const operation5 = operations5[Math.floor(Math.random() * operations5.length)];
      return generateDecimalProblems(
        { ...baseSettings, operation: operation5 },
        count,
        {
          minValue: 0.01,
          maxValue: 99.99,
          decimalPlaces: 2,
          maxDecimalPlaces: 2,
          allowZero: false,
          wholeNumberRange: [1, 50],
        }
      );

    case 6:
      // 6年生: より複雑な小数計算
      const operations6: Array<'addition' | 'subtraction' | 'multiplication' | 'division'> = 
        ['addition', 'subtraction', 'multiplication', 'division'];
      const operation6 = operations6[Math.floor(Math.random() * operations6.length)];
      return generateDecimalProblems(
        { ...baseSettings, operation: operation6 },
        count,
        {
          minValue: 0.001,
          maxValue: 999.999,
          decimalPlaces: 3,
          maxDecimalPlaces: 3,
          allowZero: false,
          wholeNumberRange: [1, 100],
        }
      );

    default:
      return generateDecimalProblems(baseSettings, count, {
        minValue: 0.1,
        maxValue: 9.9,
        decimalPlaces: 1,
        maxDecimalPlaces: 1,
        allowZero: false,
      });
  }
}

/**
 * 教育的な小数問題パターンを生成
 */
export function generateEducationalDecimalProblems(
  count: number,
  pattern: 'simple-addition' | 'simple-subtraction' | 'multiply-by-integer' | 'divide-by-integer'
): DecimalProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: 3,
    problemType: 'decimal',
    operation: 'addition',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (pattern) {
    case 'simple-addition':
      return generateDecimalProblems(
        { ...baseSettings, operation: 'addition' },
        count,
        {
          minValue: 0.1,
          maxValue: 9.9,
          decimalPlaces: 1,
          maxDecimalPlaces: 1,
        }
      );

    case 'simple-subtraction':
      return generateDecimalProblems(
        { ...baseSettings, operation: 'subtraction' },
        count,
        {
          minValue: 0.1,
          maxValue: 9.9,
          decimalPlaces: 1,
          maxDecimalPlaces: 1,
        }
      );

    case 'multiply-by-integer':
      return generateDecimalProblems(
        { ...baseSettings, operation: 'multiplication' },
        count,
        {
          minValue: 0.1,
          maxValue: 9.9,
          decimalPlaces: 1,
          maxDecimalPlaces: 2,
          wholeNumberRange: [2, 9],
        }
      );

    case 'divide-by-integer':
      return generateDecimalProblems(
        { ...baseSettings, operation: 'division' },
        count,
        {
          minValue: 1.0,
          maxValue: 99.0,
          decimalPlaces: 1,
          maxDecimalPlaces: 2,
          wholeNumberRange: [2, 9],
        }
      );

    default:
      return generateDecimalProblems(baseSettings, count);
  }
}