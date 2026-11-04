import type { BasicProblem, WorksheetSettings } from '../../../types';
import { generateId, randomInt } from '../../utils/math';
import { generateAddSubMix } from './add-sub-mix';

// 2年生: 2桁のたし算（繰り上がりなし）
export function generateAddDoubleDigitNoCarry(
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
      // 10の位と1の位を別々に生成
      const tens1 = randomInt(1, 8);
      const ones1 = randomInt(0, 9);
      operand1 = tens1 * 10 + ones1;

      const tens2 = randomInt(1, 9 - tens1);
      const ones2 = randomInt(0, 9 - ones1);
      operand2 = tens2 * 10 + ones2;

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
      carryOver: false,
    });
  }

  return problems;
}

// 2年生: 2桁のたし算（繰り上がりあり）
export function generateAddDoubleDigitCarry(
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
      attempts++;
      // 10の位と1の位を別々に生成（繰り上がりが発生するように）
      const tens1 = randomInt(1, 8);
      const ones1 = randomInt(2, 9);
      operand1 = tens1 * 10 + ones1;

      const tens2 = randomInt(1, 8);
      const ones2 = randomInt(10 - ones1 + 1, 9);
      operand2 = tens2 * 10 + ones2;

      // 答えが100を超えないようにする
      if (operand1 + operand2 >= 100) {
        continue;
      }

      key = `${operand1}+${operand2}`;
      const reverseKey = `${operand2}+${operand1}`;

      if (!usedCombinations.has(key) && !usedCombinations.has(reverseKey)) {
        usedCombinations.add(key);
        break;
      }
    } while (attempts < maxAttempts);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2,
      answer: operand1 + operand2,
      carryOver: true,
    });
  }

  return problems;
}

// 2年生: 2桁のひき算（繰り下がりなし）
export function generateSubDoubleDigitNoBorrow(
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
      // 10の位と1の位を別々に生成（繰り下がりが発生しないように）
      const tens1 = randomInt(2, 9);
      const ones1 = randomInt(0, 9);
      operand1 = tens1 * 10 + ones1;

      const tens2 = randomInt(1, tens1 - 1);
      const ones2 = randomInt(0, ones1);
      operand2 = tens2 * 10 + ones2;

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
      carryOver: false,
    });
  }

  return problems;
}

// 2年生: 2桁のひき算（繰り下がりあり）
export function generateSubDoubleDigitBorrow(
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
      attempts++;
      // 10の位と1の位を別々に生成（繰り下がりが発生するように）
      const tens1 = randomInt(2, 9);
      const ones1 = randomInt(0, 8);
      operand1 = tens1 * 10 + ones1;

      const tens2 = randomInt(1, tens1);
      const ones2 = randomInt(ones1 + 1, 9);
      operand2 = tens2 * 10 + ones2;

      // 結果が負にならないようにする
      if (operand1 < operand2) {
        continue;
      }

      key = `${operand1}-${operand2}`;

      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        break;
      }
    } while (attempts < maxAttempts);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'subtraction',
      operand1,
      operand2,
      answer: operand1 - operand2,
      carryOver: true,
    });
  }

  return problems;
}

// 2年生: 九九（かけ算）
export function generateMultSingleDigit(
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
      operand1 = randomInt(1, 9);
      operand2 = randomInt(1, 9);

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
      answer: operand1 * operand2,
    });
  }

  return problems;
}

// 2年生: 2桁のたし算・ひき算ミックス（繰り上がり・繰り下がりあり）
// 67＋58 / 23＋45 / 72－38 / 86－32 の4種類をバランスよくランダムな順に出す
export function generateAddSubDoubleMixed(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  return generateAddSubMix(count, {
    // どの位も繰り上がらない（答えは99まで）
    addPlain: () => {
      const tens1 = randomInt(1, 8);
      const ones1 = randomInt(0, 9);
      return [
        tens1 * 10 + ones1,
        randomInt(1, 9 - tens1) * 10 + randomInt(0, 9 - ones1),
      ];
    },
    // 一の位が繰り上がる（答えは99まで）
    addCarry: () => {
      const tens1 = randomInt(1, 7);
      const ones1 = randomInt(1, 9);
      return [
        tens1 * 10 + ones1,
        randomInt(1, 8 - tens1) * 10 + randomInt(10 - ones1, 9),
      ];
    },
    // どの位も繰り下がらない
    subPlain: () => {
      const tens1 = randomInt(2, 9);
      const ones1 = randomInt(0, 9);
      return [
        tens1 * 10 + ones1,
        randomInt(1, tens1 - 1) * 10 + randomInt(0, ones1),
      ];
    },
    // 一の位が繰り下がる
    subBorrow: () => {
      const tens1 = randomInt(2, 9);
      const ones1 = randomInt(0, 8);
      return [
        tens1 * 10 + ones1,
        randomInt(1, tens1 - 1) * 10 + randomInt(ones1 + 1, 9),
      ];
    },
  });
}

// 2年生: 100単位のたし算
export function generateAddHundredsSimple(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  return Array.from({ length: count }, (): BasicProblem => {
    const a = randomInt(1, 8);
    const b = randomInt(1, 9 - a);
    return {
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1: a * 100,
      operand2: b * 100,
      answer: (a + b) * 100,
      carryOver: false,
    };
  });
}
