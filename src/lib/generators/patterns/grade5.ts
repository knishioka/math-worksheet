import type {
  BasicProblem,
  FractionProblem,
  WordProblem,
  WorksheetSettings,
} from '../../../types';
import { generateId, randomInt } from '../../utils/math';

// 5年生: 小数×小数
export function generateMultDecDec(
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
      operand1 = Math.floor(randomInt(10, 999)) / 10;
      operand2 = Math.floor(randomInt(10, 99)) / 10;

      key = `${operand1}×${operand2}`;
      const reverseKey = `${operand2}×${operand1}`;

      if (!usedCombinations.has(key) && !usedCombinations.has(reverseKey)) {
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
      answer: Math.round(operand1 * operand2 * 100) / 100,
    });
  }

  return problems;
}

// 5年生: 小数÷小数
export function generateDivDecDec(
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
      // 割り切れるように商を先に決める
      const quotient = Math.floor(randomInt(10, 99)) / 10;
      operand2 = Math.floor(randomInt(10, 99)) / 10;

      // operand1 = operand2 × quotientで割り切れるようにする
      operand1 = Math.round(operand2 * quotient * 100) / 100;

      // 小数点以下の桁数を適切に調整
      if (operand1.toString().split('.')[1]?.length > 2) {
        operand1 = Math.round(operand1 * 100) / 100;
      }

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
      answer: Math.round((operand1 / operand2) * 100) / 100,
    });
  }

  return problems;
}

// 5年生: 異分母分数の加減算
export function generateFracDifferentDenom(
  _settings: WorksheetSettings,
  count: number
): FractionProblem[] {
  const problems: FractionProblem[] = [];

  // 最大公約数を求める
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  // 最小公倍数を求める
  function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
  }

  while (problems.length < count) {
    const isAddition = Math.random() < 0.5;
    const denominator1 = randomInt(2, 12);
    let denominator2 = randomInt(2, 12);

    // 異なる分母にする
    while (denominator2 === denominator1) {
      denominator2 = randomInt(2, 12);
    }

    const commonDenom = lcm(denominator1, denominator2);

    if (isAddition) {
      const numerator1 = randomInt(1, denominator1 - 1);
      const numerator2 = randomInt(1, denominator2 - 1);

      const convertedNum1 = numerator1 * (commonDenom / denominator1);
      const convertedNum2 = numerator2 * (commonDenom / denominator2);
      const answerNum = convertedNum1 + convertedNum2;

      // 約分
      const g = gcd(answerNum, commonDenom);

      problems.push({
        id: generateId(),
        type: 'fraction',
        operation: 'addition',
        numerator1: numerator1,
        denominator1: denominator1,
        numerator2: numerator2,
        denominator2: denominator2,
        answerNumerator: answerNum / g,
        answerDenominator: commonDenom / g,
        simplified: true,
      });
    } else {
      const numerator1 = randomInt(1, denominator1 - 1);
      const numerator2 = randomInt(1, denominator2 - 1);

      const convertedNum1 = numerator1 * (commonDenom / denominator1);
      const convertedNum2 = numerator2 * (commonDenom / denominator2);

      // 引けるように調整
      if (convertedNum1 < convertedNum2) {
        continue;
      }

      const answerNum = convertedNum1 - convertedNum2;

      // 約分
      const g = answerNum === 0 ? 1 : gcd(answerNum, commonDenom);

      problems.push({
        id: generateId(),
        type: 'fraction',
        operation: 'subtraction',
        numerator1: numerator1,
        denominator1: denominator1,
        numerator2: numerator2,
        denominator2: denominator2,
        answerNumerator: answerNum === 0 ? 0 : answerNum / g,
        answerDenominator: answerNum === 0 ? 1 : commonDenom / g,
        simplified: true,
      });
    }
  }

  return problems;
}

// 5年生: 分数の約分
export function generateFracSimplify(
  _settings: WorksheetSettings,
  count: number
): FractionProblem[] {
  const problems: FractionProblem[] = [];

  for (let i = 0; i < count; i++) {
    // 約分できる分数を生成
    const factor = randomInt(2, 6);
    const simplifiedNum = randomInt(1, 9);
    const simplifiedDenom = randomInt(simplifiedNum + 1, 12);

    const numerator = simplifiedNum * factor;
    const denominator = simplifiedDenom * factor;

    problems.push({
      id: generateId(),
      type: 'fraction',
      operation: 'division', // 約分問題
      numerator1: numerator,
      denominator1: denominator,
      answerNumerator: simplifiedNum,
      answerDenominator: simplifiedDenom,
      simplified: true,
    });
  }

  return problems;
}

// 5年生: 百分率の基本
export function generatePercentBasic(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const patternType = randomInt(0, 2);

    if (patternType === 0) {
      // パーセントを小数に変換
      const percent = randomInt(1, 20) * 5; // 5%, 10%, 15%...100%
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `${percent}%を小数で表すと？`,
        answer: percent / 100,
        showCalculation: true,
      });
    } else if (patternType === 1) {
      // ある数の○%を求める
      const base = randomInt(2, 10) * 10; // 20, 30, 40...100
      const percent = randomInt(1, 10) * 10; // 10%, 20%...100%
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `${base}の${percent}%は？`,
        answer: (base * percent) / 100,
        showCalculation: true,
      });
    } else {
      // ○は△の何%かを求める
      const part = randomInt(1, 9) * 5;
      const whole = randomInt(part + 10, 100);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `${part}は${whole}の何%？`,
        answer: (part / whole) * 100,
        unit: '%',
        showCalculation: true,
      });
    }
  }

  return problems;
}

// 5年生: 面積・体積
export function generateAreaVolume(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const shapeType = randomInt(0, 3);

    if (shapeType === 0) {
      // 長方形の面積
      const length = randomInt(2, 20);
      const width = randomInt(2, 20);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `たて${length}cm、よこ${width}cmの長方形の面積は？`,
        answer: length * width,
        unit: 'cm²',
        showCalculation: true,
      });
    } else if (shapeType === 1) {
      // 三角形の面積（底辺×高さ÷2）
      const base = randomInt(4, 20);
      const height = randomInt(2, 16);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `底辺${base}cm、高さ${height}cmの三角形の面積は？`,
        answer: (base * height) / 2,
        unit: 'cm²',
        showCalculation: true,
      });
    } else if (shapeType === 2) {
      // 直方体の体積
      const length = randomInt(2, 10);
      const width = randomInt(2, 10);
      const height = randomInt(2, 10);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `たて${length}cm、よこ${width}cm、高さ${height}cmの直方体の体積は？`,
        answer: length * width * height,
        unit: 'cm³',
        showCalculation: true,
      });
    } else {
      // 立方体の体積
      const side = randomInt(2, 10);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `1辺が${side}cmの立方体の体積は？`,
        answer: side * side * side,
        unit: 'cm³',
        showCalculation: true,
      });
    }
  }

  return problems;
}
