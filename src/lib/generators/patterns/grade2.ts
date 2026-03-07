import type { BasicProblem, WorksheetSettings } from '../../../types';
import { generateId, randomInt } from '../../utils/math';

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

// 2年生: 2桁のたし算・ひき算混合（繰り上がり/下がり混在）
export function generateAddSubDoubleMixed(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number = 0,
      operand2: number = 0;
    let operation: 'addition' | 'subtraction';
    let carryOver: boolean = false;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      attempts++;
      // ランダムにたし算かひき算を選択
      operation = Math.random() < 0.5 ? 'addition' : 'subtraction';

      if (operation === 'addition') {
        // ランダムに繰り上がりあり/なしを選択
        const hasCarry = Math.random() < 0.5;

        if (hasCarry) {
          // 繰り上がりありのたし算
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
          carryOver = true;
        } else {
          // 繰り上がりなしのたし算
          const tens1 = randomInt(1, 8);
          const ones1 = randomInt(0, 9);
          operand1 = tens1 * 10 + ones1;

          const tens2 = randomInt(1, 9 - tens1);
          const ones2 = randomInt(0, 9 - ones1);
          operand2 = tens2 * 10 + ones2;
          carryOver = false;
        }

        key = `${operand1}+${operand2}`;
        const reverseKey = `${operand2}+${operand1}`;

        if (!usedCombinations.has(key) && !usedCombinations.has(reverseKey)) {
          usedCombinations.add(key);
          break;
        }
      } else {
        // ランダムに繰り下がりあり/なしを選択
        const hasBorrow = Math.random() < 0.5;

        if (hasBorrow) {
          // 繰り下がりありのひき算
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
          carryOver = true;
        } else {
          // 繰り下がりなしのひき算
          const tens1 = randomInt(2, 9);
          const ones1 = randomInt(0, 9);
          operand1 = tens1 * 10 + ones1;

          const tens2 = randomInt(1, tens1 - 1);
          const ones2 = randomInt(0, ones1);
          operand2 = tens2 * 10 + ones2;
          carryOver = false;
        }

        key = `${operand1}-${operand2}`;

        if (!usedCombinations.has(key)) {
          usedCombinations.add(key);
          break;
        }
      }
    } while (attempts < maxAttempts);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation,
      operand1,
      operand2,
      answer:
        operation === 'addition' ? operand1 + operand2 : operand1 - operand2,
      carryOver,
    });
  }

  return problems;
}

// 2年生: 100単位の計算
export function generateAddHundredsSimple(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() < 0.7; // 70%でたし算

    if (isAddition) {
      const hundreds1 = randomInt(1, 8);
      const hundreds2 = randomInt(1, 9 - hundreds1);

      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'addition',
        operand1: hundreds1 * 100,
        operand2: hundreds2 * 100,
        answer: (hundreds1 + hundreds2) * 100,
        carryOver: false,
      });
    } else {
      const hundreds1 = randomInt(2, 9);
      const hundreds2 = randomInt(1, hundreds1 - 1);

      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'subtraction',
        operand1: hundreds1 * 100,
        operand2: hundreds2 * 100,
        answer: (hundreds1 - hundreds2) * 100,
        carryOver: false,
      });
    }
  }

  return problems;
}
