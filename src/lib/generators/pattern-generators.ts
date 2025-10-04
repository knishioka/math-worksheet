import type {
  BasicProblem,
  FractionProblem,
  WordProblem,
  WorksheetSettings,
  Problem,
  HissanProblem,
} from '../../types';
import { generateId, randomInt } from '../utils/math';
import { generateHissanProblem } from './hissan';

/**
 * 計算パターンに基づいて問題を生成
 */
export function generatePatternProblems(
  settings: WorksheetSettings,
  count: number
): Problem[] {
  const pattern = settings.calculationPattern;

  if (!pattern) {
    throw new Error('Calculation pattern is not specified');
  }

  switch (pattern) {
    // 1年生のパターン
    case 'add-single-digit':
      return generateAddSingleDigit(settings, count);
    case 'add-single-digit-carry':
      return generateAddSingleDigitCarry(settings, count);
    case 'add-to-10':
      return generateAddTo10(settings, count);
    case 'add-10-plus':
      return generateAdd10Plus(settings, count);
    case 'sub-single-digit':
      return generateSubSingleDigit(settings, count);
    case 'sub-single-digit-borrow':
      return generateSubSingleDigitBorrow(settings, count);
    case 'sub-from-10':
      return generateSubFrom10(settings, count);
    case 'add-sub-mixed-basic':
      return generateAddSubMixedBasic(settings, count);
    case 'add-single-missing':
      return generateAddSingleMissing(settings, count);
    case 'sub-single-missing':
      return generateSubSingleMissing(settings, count);

    // 2年生のパターン
    case 'add-double-digit-no-carry':
      return generateAddDoubleDigitNoCarry(settings, count);
    case 'add-double-digit-carry':
      return generateAddDoubleDigitCarry(settings, count);
    case 'sub-double-digit-no-borrow':
      return generateSubDoubleDigitNoBorrow(settings, count);
    case 'sub-double-digit-borrow':
      return generateSubDoubleDigitBorrow(settings, count);
    case 'add-sub-double-mixed':
      return generateAddSubDoubleMixed(settings, count);
    case 'mult-single-digit':
      return generateMultSingleDigit(settings, count);
    case 'add-hundreds-simple':
      return generateAddHundredsSimple(settings, count);
    case 'add-double-missing':
      return generateAddDoubleMissing(settings, count);
    case 'sub-double-missing':
      return generateSubDoubleMissing(settings, count);
    case 'mult-single-missing':
      return generateMultSingleMissing(settings, count);
    case 'hissan-add-double':
      return generateHissanAddDouble(settings, count);
    case 'hissan-sub-double':
      return generateHissanSubDouble(settings, count);

    // 3年生のパターン
    case 'add-triple-digit':
      return generateAddTripleDigit(settings, count);
    case 'sub-triple-digit':
      return generateSubTripleDigit(settings, count);
    case 'mult-double-digit':
      return generateMultDoubleDigit(settings, count);
    case 'div-basic':
      return generateDivBasic(settings, count);
    case 'add-dec-simple':
      return generateAddDecSimple(settings, count);
    case 'sub-dec-simple':
      return generateSubDecSimple(settings, count);
    case 'frac-same-denom':
      return generateFracSameDenom(settings, count);
    case 'hissan-add-triple':
      return generateHissanAddTriple(settings, count);
    case 'hissan-sub-triple':
      return generateHissanSubTriple(settings, count);
    case 'hissan-mult-basic':
      return generateHissanMultBasic(settings, count);

    // 4年生のパターン
    case 'add-large-numbers':
      return generateAddLargeNumbers(settings, count);
    case 'sub-large-numbers':
      return generateSubLargeNumbers(settings, count);
    case 'mult-triple-digit':
      return generateMultTripleDigit(settings, count);
    case 'div-with-remainder':
      return generateDivWithRemainder(settings, count);
    case 'mult-dec-int':
      return generateMultDecInt(settings, count);
    case 'div-dec-int':
      return generateDivDecInt(settings, count);
    case 'frac-mixed-number':
      return generateFracMixedNumber(settings, count);
    case 'hissan-mult-advanced':
      return generateHissanMultAdvanced(settings, count);
    case 'hissan-div-basic':
      return generateHissanDivBasic(settings, count);

    // 5年生のパターン
    case 'mult-dec-dec':
      return generateMultDecDec(settings, count);
    case 'div-dec-dec':
      return generateDivDecDec(settings, count);
    case 'frac-different-denom':
      return generateFracDifferentDenom(settings, count);
    case 'frac-simplify':
      return generateFracSimplify(settings, count);
    case 'percent-basic':
      return generatePercentBasic(settings, count);
    case 'area-volume':
      return generateAreaVolume(settings, count);

    // 6年生のパターン
    case 'frac-mult':
      return generateFracMult(settings, count);
    case 'frac-div':
      return generateFracDiv(settings, count);
    case 'ratio-proportion':
      return generateRatioProportion(settings, count);
    case 'speed-time-distance':
      return generateSpeedTimeDistance(settings, count);
    case 'complex-calc':
      return generateComplexCalc(settings, count);

    default:
      throw new Error(`Pattern ${pattern} is not implemented yet`);
  }
}

// 1年生: 1桁のたし算（10まで）
function generateAddSingleDigit(
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

      // 答えが10を超えないようにする
      if (operand1 + operand2 > 10) {
        operand2 = randomInt(1, 10 - operand1);
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
      carryOver: false,
    });
  }

  return problems;
}

// 1年生: 1桁のたし算（繰り上がりあり、20まで）
function generateAddSingleDigitCarry(
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
      operand1 = randomInt(2, 9);
      operand2 = randomInt(2, 9);

      // 繰り上がりが発生する（答えが11以上）ようにする
      if (operand1 + operand2 <= 10) {
        operand2 = randomInt(11 - operand1, 9);
      }

      // 答えが20を超えないようにする
      if (operand1 + operand2 > 20) {
        continue;
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
      carryOver: true,
    });
  }

  return problems;
}

// 1年生: 10を作る計算
function generateAddTo10(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const pairs = [
    [1, 9],
    [2, 8],
    [3, 7],
    [4, 6],
    [5, 5],
    [6, 4],
    [7, 3],
    [8, 2],
    [9, 1],
  ];

  // ペアをシャッフル
  const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    const pair = shuffledPairs[i % shuffledPairs.length];
    const [operand1, operand2] =
      Math.random() < 0.5 ? pair : [pair[1], pair[0]];

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2,
      answer: 10,
      carryOver: false,
    });
  }

  return problems;
}

// 1年生: 10＋□の計算
function generateAdd10Plus(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    const operand2 = randomInt(1, 9);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1: 10,
      operand2,
      answer: 10 + operand2,
      carryOver: false,
    });
  }

  return problems;
}

// 1年生: 1桁のひき算（繰り下がりなし）
function generateSubSingleDigit(
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
      operand1 = randomInt(2, 10);
      operand2 = randomInt(1, operand1 - 1);

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

// 1年生: 繰り下がりのあるひき算（20まで）
function generateSubSingleDigitBorrow(
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
      // 11〜20の範囲から選ぶ
      operand1 = randomInt(11, 20);
      // 繰り下がりが発生するように、一の位より大きい数を引く
      const onesDigit = operand1 % 10;
      operand2 = randomInt(onesDigit + 1, 9);

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
      carryOver: true,
    });
  }

  return problems;
}

// 1年生: 10－□の計算
function generateSubFrom10(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    const operand2 = randomInt(1, 9);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'subtraction',
      operand1: 10,
      operand2,
      answer: 10 - operand2,
      carryOver: false,
    });
  }

  return problems;
}

// 1年生: たし算・ひき算ミックス（10まで）
function generateAddSubMixedBasic(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() < 0.5;

    if (isAddition) {
      // たし算（答えが10まで）
      const operand1 = randomInt(1, 9);
      const operand2 = randomInt(1, 10 - operand1);

      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'addition',
        operand1,
        operand2,
        answer: operand1 + operand2,
        carryOver: false,
      });
    } else {
      // ひき算（繰り下がりなし）
      const operand1 = randomInt(2, 10);
      const operand2 = randomInt(1, operand1 - 1);

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
  }

  return problems;
}

// 2年生: 2桁のたし算（繰り上がりなし）
function generateAddDoubleDigitNoCarry(
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
function generateAddDoubleDigitCarry(
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

      attempts++;
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
function generateSubDoubleDigitNoBorrow(
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
function generateSubDoubleDigitBorrow(
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

      attempts++;
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
function generateMultSingleDigit(
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
function generateAddSubDoubleMixed(
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

      attempts++;
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
function generateAddHundredsSimple(
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

// 3年生: 3桁のたし算
function generateAddTripleDigit(
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
function generateSubTripleDigit(
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
function generateMultDoubleDigit(
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
function generateDivBasic(
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
function generateAddDecSimple(
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
function generateSubDecSimple(
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
function generateFracSameDenom(
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

// 4年生: 大きな数のたし算
function generateAddLargeNumbers(
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
function generateSubLargeNumbers(
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
function generateMultTripleDigit(
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
function generateDivWithRemainder(
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
function generateMultDecInt(
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
function generateDivDecInt(
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
function generateFracMixedNumber(
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

// 5年生: 小数×小数
function generateMultDecDec(
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
function generateDivDecDec(
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
function generateFracDifferentDenom(
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

  for (let i = 0; i < count; i++) {
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
function generateFracSimplify(
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
function generatePercentBasic(
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
function generateAreaVolume(
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

// 6年生: 分数×分数
function generateFracMult(
  _settings: WorksheetSettings,
  count: number
): FractionProblem[] {
  const problems: FractionProblem[] = [];

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  for (let i = 0; i < count; i++) {
    const numerator1 = randomInt(1, 9);
    const denominator1 = randomInt(2, 10);
    const numerator2 = randomInt(1, 9);
    const denominator2 = randomInt(2, 10);

    const answerNum = numerator1 * numerator2;
    const answerDenom = denominator1 * denominator2;

    // 約分
    const g = gcd(answerNum, answerDenom);

    problems.push({
      id: generateId(),
      type: 'fraction',
      operation: 'multiplication',
      numerator1: numerator1,
      denominator1: denominator1,
      numerator2: numerator2,
      denominator2: denominator2,
      answerNumerator: answerNum / g,
      answerDenominator: answerDenom / g,
      simplified: true,
    });
  }

  return problems;
}

// 6年生: 分数÷分数
function generateFracDiv(
  _settings: WorksheetSettings,
  count: number
): FractionProblem[] {
  const problems: FractionProblem[] = [];

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  for (let i = 0; i < count; i++) {
    const numerator1 = randomInt(1, 9);
    const denominator1 = randomInt(2, 10);
    const numerator2 = randomInt(1, 9);
    const denominator2 = randomInt(2, 10);

    // 分数の除算は逆数をかける
    const answerNum = numerator1 * denominator2;
    const answerDenom = denominator1 * numerator2;

    // 約分
    const g = gcd(answerNum, answerDenom);

    problems.push({
      id: generateId(),
      type: 'fraction',
      operation: 'division',
      numerator1: numerator1,
      denominator1: denominator1,
      numerator2: numerator2,
      denominator2: denominator2,
      answerNumerator: answerNum / g,
      answerDenominator: answerDenom / g,
      simplified: true,
    });
  }

  return problems;
}

// 6年生: 比と比例
function generateRatioProportion(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  for (let i = 0; i < count; i++) {
    const patternType = randomInt(0, 2);

    if (patternType === 0) {
      // 比を簡単にする
      const factor = randomInt(2, 5);
      const a = randomInt(2, 10) * factor;
      const b = randomInt(2, 10) * factor;
      const g = gcd(a, b);

      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `${a}:${b}をもっとも簡単な整数の比に直すと？`,
        answer: `${a / g}:${b / g}`,
        showCalculation: true,
      });
    } else {
      // 比例式を解く
      const a = randomInt(2, 10);
      const b = randomInt(2, 10);
      const c = randomInt(2, 10);
      const x = (b * c) / a;

      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `${a}:${b} = ${c}:□ の□にあてはまる数は？`,
        answer: x,
        showCalculation: true,
      });
    }
  }

  return problems;
}

// 6年生: 速さ・時間・距離
function generateSpeedTimeDistance(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 3);

    if (problemType === 0) {
      // 速さを求める（距離÷時間）
      const distance = randomInt(10, 50) * 10; // 100km, 200km...
      const time = randomInt(2, 10); // 2時間, 3時間...
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `${distance}kmを${time}時間で走る車の時速は？`,
        answer: distance / time,
        unit: 'km/時',
        showCalculation: true,
      });
    } else if (problemType === 1) {
      // 時間を求める（距離÷速さ）
      const distance = randomInt(10, 50) * 10;
      const speed = randomInt(40, 80);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `時速${speed}kmで${distance}km走るのにかかる時間は？`,
        answer: Math.round((distance / speed) * 10) / 10,
        unit: '時間',
        showCalculation: true,
      });
    } else {
      // 距離を求める（速さ×時間）
      const speed = randomInt(40, 80);
      const time = randomInt(2, 8);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `時速${speed}kmで${time}時間走ったときの距離は？`,
        answer: speed * time,
        unit: 'km',
        showCalculation: true,
      });
    }
  }

  return problems;
}

// 6年生: 複雑な計算
function generateComplexCalc(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const patternType = randomInt(0, 3);

    if (patternType === 0) {
      // 四則混合（整数）
      const a = randomInt(10, 50);
      const b = randomInt(2, 10);
      const c = randomInt(5, 20);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'addition',
        problemText: `${a} + ${b} × ${c} = ？`,
        answer: a + b * c,
        showCalculation: true,
      });
    } else if (patternType === 1) {
      // 割合の応用問題
      const original = randomInt(5, 20) * 100;
      const percent = randomInt(2, 4) * 10;
      const discounted = (original * (100 - percent)) / 100;
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `${original}円の商品を${percent}%引きで買うと何円？`,
        answer: discounted,
        unit: '円',
        showCalculation: true,
      });
    } else {
      // 単位の変換を含む問題
      const meters = randomInt(2, 20) * 100;
      const minutes = randomInt(2, 10);
      const speedMPerMin = meters / minutes;
      const speedKmPerHour = (speedMPerMin * 60) / 1000;
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `${meters}mを${minutes}分で歩く人の時速は？`,
        answer: Math.round(speedKmPerHour * 10) / 10,
        unit: 'km/時',
        showCalculation: true,
      });
    }
  }

  return problems;
}

// 1年生: たし算の虫食い算
function generateAddSingleMissing(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    // 答えが10以下になるようにする
    const answer = randomInt(3, 10);
    const missingPosition = (['operand1', 'operand2', 'answer'] as const)[
      randomInt(0, 2)
    ];

    let operand1: number | null = null;
    let operand2: number | null = null;
    let answerValue: number | null = answer;

    if (missingPosition === 'answer') {
      // □ の位置が答えの場合: 3 + 4 = □
      operand1 = randomInt(1, answer - 1);
      operand2 = answer - operand1;
      answerValue = null;
    } else if (missingPosition === 'operand1') {
      // □ の位置が最初の数の場合: □ + 3 = 7
      operand2 = randomInt(1, answer - 1);
      operand1 = null;
      answerValue = answer;
    } else {
      // □ の位置が2番目の数の場合: 5 + □ = 8
      operand1 = randomInt(1, answer - 1);
      operand2 = null;
      answerValue = answer;
    }

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2,
      answer: answerValue,
      missingPosition,
      carryOver: false,
    });
  }

  return problems;
}

// 1年生: ひき算の虫食い算
function generateSubSingleMissing(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    const missingPosition = (['operand1', 'operand2', 'answer'] as const)[
      randomInt(0, 2)
    ];

    let operand1: number | null = null;
    let operand2: number | null = null;
    let answer: number | null = null;

    if (missingPosition === 'answer') {
      // □ の位置が答えの場合: 8 - 3 = □
      operand1 = randomInt(4, 10);
      operand2 = randomInt(1, operand1 - 1);
      answer = null;
    } else if (missingPosition === 'operand1') {
      // □ の位置が最初の数の場合: □ - 3 = 5
      answer = randomInt(1, 7);
      operand2 = randomInt(1, 3);
      operand1 = null;
    } else {
      // □ の位置が2番目の数の場合: 9 - □ = 6
      operand1 = randomInt(4, 10);
      answer = randomInt(1, operand1 - 1);
      operand2 = null;
    }

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'subtraction',
      operand1,
      operand2,
      answer,
      missingPosition,
      carryOver: false,
    });
  }

  return problems;
}

// 2年生: 2桁たし算の虫食い算
function generateAddDoubleMissing(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    // 答えが100以下になるようにする
    const answer = randomInt(20, 99);
    const missingPosition = (['operand1', 'operand2', 'answer'] as const)[
      randomInt(0, 2)
    ];

    let operand1: number | null = null;
    let operand2: number | null = null;
    let answerValue: number | null = answer;

    if (missingPosition === 'answer') {
      // □ の位置が答えの場合
      operand1 = randomInt(10, Math.min(89, answer - 10));
      operand2 = answer - operand1;
      answerValue = null;
    } else if (missingPosition === 'operand1') {
      // □ の位置が最初の数の場合
      operand2 = randomInt(10, Math.min(89, answer - 10));
      operand1 = null;
      answerValue = answer;
    } else {
      // □ の位置が2番目の数の場合
      operand1 = randomInt(10, Math.min(89, answer - 10));
      operand2 = null;
      answerValue = answer;
    }

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2,
      answer: answerValue,
      missingPosition,
    });
  }

  return problems;
}

// 2年生: 2桁ひき算の虫食い算
function generateSubDoubleMissing(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    const missingPosition = (['operand1', 'operand2', 'answer'] as const)[
      randomInt(0, 2)
    ];

    let operand1: number | null = null;
    let operand2: number | null = null;
    let answer: number | null = null;

    if (missingPosition === 'answer') {
      // □ の位置が答えの場合
      operand1 = randomInt(30, 99);
      operand2 = randomInt(10, operand1 - 10);
      answer = null;
    } else if (missingPosition === 'operand1') {
      // □ の位置が最初の数の場合
      answer = randomInt(10, 80);
      operand2 = randomInt(10, 40);
      operand1 = null;
    } else {
      // □ の位置が2番目の数の場合
      operand1 = randomInt(30, 99);
      answer = randomInt(10, operand1 - 10);
      operand2 = null;
    }

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'subtraction',
      operand1,
      operand2,
      answer,
      missingPosition,
    });
  }

  return problems;
}

// 2年生: 九九の虫食い算
function generateMultSingleMissing(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number | null = null;
    let operand2: number | null = null;
    let answer: number | null = null;
    let missingPosition: 'operand1' | 'operand2' | 'answer';
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      missingPosition = (['operand1', 'operand2', 'answer'] as const)[
        randomInt(0, 2)
      ];

      if (missingPosition === 'answer') {
        // □ の位置が答えの場合: 3 × 4 = □
        operand1 = randomInt(2, 9);
        operand2 = randomInt(2, 9);
        answer = null;
      } else {
        // 答えから逆算
        const validProducts = [];
        for (let a = 2; a <= 9; a++) {
          for (let b = 2; b <= 9; b++) {
            validProducts.push({ a, b, product: a * b });
          }
        }

        const selected = validProducts[randomInt(0, validProducts.length - 1)];

        if (missingPosition === 'operand1') {
          // □ × 4 = 12
          operand1 = null;
          operand2 = selected.b;
          answer = selected.product;
        } else {
          // 3 × □ = 12
          operand1 = selected.a;
          operand2 = null;
          answer = selected.product;
        }
      }

      key = `${operand1}×${operand2}=${answer}`;

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
      answer,
      missingPosition,
    });
  }

  return problems;
}

// ==================== 筆算パターン ====================

/**
 * 2桁のたし算の筆算
 */
function generateHissanAddDouble(
  settings: WorksheetSettings,
  count: number
): HissanProblem[] {
  const problems: HissanProblem[] = [];
  for (let i = 0; i < count; i++) {
    problems.push(
      generateHissanProblem({
        grade: settings.grade,
        operation: 'addition',
        showCarry: false,
      })
    );
  }
  return problems;
}

/**
 * 2桁のひき算の筆算
 */
function generateHissanSubDouble(
  settings: WorksheetSettings,
  count: number
): HissanProblem[] {
  const problems: HissanProblem[] = [];
  for (let i = 0; i < count; i++) {
    problems.push(
      generateHissanProblem({
        grade: settings.grade,
        operation: 'subtraction',
        showCarry: false,
      })
    );
  }
  return problems;
}

/**
 * 3桁のたし算の筆算
 */
function generateHissanAddTriple(
  settings: WorksheetSettings,
  count: number
): HissanProblem[] {
  const problems: HissanProblem[] = [];
  for (let i = 0; i < count; i++) {
    problems.push(
      generateHissanProblem({
        grade: settings.grade,
        operation: 'addition',
        showCarry: false,
      })
    );
  }
  return problems;
}

/**
 * 3桁のひき算の筆算
 */
function generateHissanSubTriple(
  settings: WorksheetSettings,
  count: number
): HissanProblem[] {
  const problems: HissanProblem[] = [];
  for (let i = 0; i < count; i++) {
    problems.push(
      generateHissanProblem({
        grade: settings.grade,
        operation: 'subtraction',
        showCarry: false,
      })
    );
  }
  return problems;
}

/**
 * 2桁×1桁のかけ算の筆算
 */
function generateHissanMultBasic(
  settings: WorksheetSettings,
  count: number
): HissanProblem[] {
  const problems: HissanProblem[] = [];
  for (let i = 0; i < count; i++) {
    // 2桁×1桁のかけ算の筆算
    const operand1 = Math.floor(Math.random() * 90) + 10; // 10-99
    const operand2 = Math.floor(Math.random() * 9) + 1;   // 1-9
    const answer = operand1 * operand2;

    problems.push({
      id: generateId(),
      type: 'hissan',
      operation: 'multiplication',
      operand1,
      operand2,
      answer,
      showPartialProducts: false,
    });
  }
  return problems;
}

/**
 * 3桁×2桁のかけ算の筆算
 */
function generateHissanMultAdvanced(
  settings: WorksheetSettings,
  count: number
): HissanProblem[] {
  const problems: HissanProblem[] = [];
  for (let i = 0; i < count; i++) {
    problems.push(
      generateHissanProblem({
        grade: settings.grade,
        operation: 'multiplication',
        showPartialProducts: false,
      })
    );
  }
  return problems;
}

/**
 * わり算の筆算
 */
function generateHissanDivBasic(
  settings: WorksheetSettings,
  count: number
): HissanProblem[] {
  const problems: HissanProblem[] = [];
  for (let i = 0; i < count; i++) {
    problems.push(
      generateHissanProblem({
        grade: settings.grade,
        operation: 'division',
      })
    );
  }
  return problems;
}
