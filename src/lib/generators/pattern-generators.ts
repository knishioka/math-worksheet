import type { BasicProblem, WorksheetSettings } from '../../types';
import { generateId, randomInt } from '../utils/math';

/**
 * 計算パターンに基づいて問題を生成
 */
export function generatePatternProblems(
  settings: WorksheetSettings,
  count: number
): BasicProblem[] {
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
    
    // 2年生のパターン
    case 'add-double-digit-no-carry':
      return generateAddDoubleDigitNoCarry(settings, count);
    case 'add-double-digit-carry':
      return generateAddDoubleDigitCarry(settings, count);
    case 'sub-double-digit-no-borrow':
      return generateSubDoubleDigitNoBorrow(settings, count);
    case 'sub-double-digit-borrow':
      return generateSubDoubleDigitBorrow(settings, count);
    case 'mult-single-digit':
      return generateMultSingleDigit(settings, count);
    case 'add-hundreds-simple':
      return generateAddHundredsSimple(settings, count);
    
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
function generateAddSingleDigit(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateAddSingleDigitCarry(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateAddTo10(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const pairs = [
    [1, 9], [2, 8], [3, 7], [4, 6], [5, 5],
    [6, 4], [7, 3], [8, 2], [9, 1]
  ];
  
  // ペアをシャッフル
  const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < count; i++) {
    const pair = shuffledPairs[i % shuffledPairs.length];
    const [operand1, operand2] = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
    
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
function generateAdd10Plus(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateSubSingleDigit(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateSubSingleDigitBorrow(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateSubFrom10(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateAddSubMixedBasic(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateAddDoubleDigitNoCarry(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateAddDoubleDigitCarry(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateSubDoubleDigitNoBorrow(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateSubDoubleDigitBorrow(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateMultSingleDigit(_settings: WorksheetSettings, count: number): BasicProblem[] {
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

// 2年生: 100単位の計算
function generateAddHundredsSimple(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateAddTripleDigit(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
      carryOver: operand1 % 10 + operand2 % 10 >= 10 || 
                 Math.floor(operand1 / 10) % 10 + Math.floor(operand2 / 10) % 10 >= 10,
    });
  }

  return problems;
}

// 3年生: 3桁のひき算
function generateSubTripleDigit(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
      carryOver: operand1 % 10 < operand2 % 10 || 
                 Math.floor(operand1 / 10) % 10 < Math.floor(operand2 / 10) % 10,
    });
  }

  return problems;
}

// 3年生: 2桁×1桁のかけ算
function generateMultDoubleDigit(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateDivBasic(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateAddDecSimple(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
        operand2 = Math.floor(randomInt(1, (100 - operand1 * 10))) / 10;
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
function generateSubDecSimple(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateFracSameDenom(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() < 0.5;
    const denominator = randomInt(2, 10);
    
    if (isAddition) {
      const numerator1 = randomInt(1, denominator - 1);
      const numerator2 = randomInt(1, denominator - numerator1);
      
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'addition',
        operand1: numerator1 / denominator,
        operand2: numerator2 / denominator,
        answer: (numerator1 + numerator2) / denominator,
      });
    } else {
      const numerator1 = randomInt(2, denominator - 1);
      const numerator2 = randomInt(1, numerator1 - 1);
      
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'subtraction',
        operand1: numerator1 / denominator,
        operand2: numerator2 / denominator,
        answer: (numerator1 - numerator2) / denominator,
      });
    }
  }

  return problems;
}

// 4年生: 大きな数のたし算
function generateAddLargeNumbers(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateSubLargeNumbers(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateMultTripleDigit(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateDivWithRemainder(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateMultDecInt(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateDivDecInt(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateFracMixedNumber(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() < 0.5;
    const denominator = randomInt(2, 8);
    
    if (isAddition) {
      const whole1 = randomInt(1, 5);
      const numerator1 = randomInt(1, denominator - 1);
      const whole2 = randomInt(1, 5);
      const numerator2 = randomInt(1, denominator - 1);
      
      const totalNumerator = whole1 * denominator + numerator1 + whole2 * denominator + numerator2;
      const answerWhole = Math.floor(totalNumerator / denominator);
      const answerNumerator = totalNumerator % denominator;
      
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'addition',
        operand1: whole1 + numerator1 / denominator,
        operand2: whole2 + numerator2 / denominator,
        answer: answerWhole + answerNumerator / denominator,
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
        type: 'basic',
        operation: 'subtraction',
        operand1: whole1 + numerator1 / denominator,
        operand2: whole2 + numerator2 / denominator,
        answer: answerWhole + answerNumerator / denominator,
      });
    }
  }

  return problems;
}

// 5年生: 小数×小数
function generateMultDecDec(_settings: WorksheetSettings, count: number): BasicProblem[] {
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
function generateDivDecDec(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number, operand2: number;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      operand2 = Math.floor(randomInt(10, 99)) / 10;
      const quotient = Math.floor(randomInt(10, 99)) / 10;
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
      answer: Math.round(operand1 / operand2 * 10) / 10,
    });
  }

  return problems;
}

// 5年生: 異分母分数の加減算
function generateFracDifferentDenom(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
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
        type: 'basic',
        operation: 'addition',
        operand1: numerator1 / denominator1,
        operand2: numerator2 / denominator2,
        answer: (answerNum / g) / (commonDenom / g),
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
      const g = gcd(answerNum, commonDenom);
      
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'subtraction',
        operand1: numerator1 / denominator1,
        operand2: numerator2 / denominator2,
        answer: answerNum === 0 ? 0 : (answerNum / g) / (commonDenom / g),
      });
    }
  }

  return problems;
}

// 5年生: 分数の約分
function generateFracSimplify(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    // 約分できる分数を生成
    const factor = randomInt(2, 6);
    const simplifiedNum = randomInt(1, 9);
    const simplifiedDenom = randomInt(simplifiedNum + 1, 12);
    
    const numerator = simplifiedNum * factor;
    const denominator = simplifiedDenom * factor;
    
    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'division', // 約分は除算として扱う
      operand1: numerator,
      operand2: denominator,
      answer: simplifiedNum / simplifiedDenom,
    });
  }

  return problems;
}

// 5年生: 百分率の基本
function generatePercentBasic(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    const patternType = randomInt(0, 2);
    
    if (patternType === 0) {
      // パーセントを小数に変換
      const percent = randomInt(1, 20) * 5; // 5%, 10%, 15%...100%
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'division',
        operand1: percent,
        operand2: 100,
        answer: percent / 100,
      });
    } else if (patternType === 1) {
      // ある数の○%を求める
      const base = randomInt(2, 10) * 10; // 20, 30, 40...100
      const percent = randomInt(1, 10) * 10; // 10%, 20%...100%
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'multiplication',
        operand1: base,
        operand2: percent / 100,
        answer: base * percent / 100,
      });
    } else {
      // ○は△の何%かを求める
      const part = randomInt(1, 9) * 5;
      const whole = randomInt(part + 10, 100);
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'division',
        operand1: part,
        operand2: whole,
        answer: (part / whole) * 100,
      });
    }
  }

  return problems;
}

// 5年生: 面積・体積
function generateAreaVolume(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    const shapeType = randomInt(0, 3);
    
    if (shapeType === 0) {
      // 長方形の面積
      const length = randomInt(2, 20);
      const width = randomInt(2, 20);
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'multiplication',
        operand1: length,
        operand2: width,
        answer: length * width,
      });
    } else if (shapeType === 1) {
      // 三角形の面積（底辺×高さ÷2）
      const base = randomInt(4, 20);
      const height = randomInt(2, 16);
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'division',
        operand1: base * height,
        operand2: 2,
        answer: (base * height) / 2,
      });
    } else if (shapeType === 2) {
      // 直方体の体積
      const length = randomInt(2, 10);
      const width = randomInt(2, 10);
      const height = randomInt(2, 10);
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'multiplication',
        operand1: length * width,
        operand2: height,
        answer: length * width * height,
      });
    } else {
      // 立方体の体積
      const side = randomInt(2, 10);
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'multiplication',
        operand1: side * side,
        operand2: side,
        answer: side * side * side,
      });
    }
  }

  return problems;
}

// 6年生: 分数×分数
function generateFracMult(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
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
      type: 'basic',
      operation: 'multiplication',
      operand1: numerator1 / denominator1,
      operand2: numerator2 / denominator2,
      answer: (answerNum / g) / (answerDenom / g),
    });
  }

  return problems;
}

// 6年生: 分数÷分数
function generateFracDiv(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
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
      type: 'basic',
      operation: 'division',
      operand1: numerator1 / denominator1,
      operand2: numerator2 / denominator2,
      answer: (answerNum / g) / (answerDenom / g),
    });
  }

  return problems;
}

// 6年生: 比と比例
function generateRatioProportion(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }
  
  for (let i = 0; i < count; i++) {
    const patternType = randomInt(0, 2);
    
    if (patternType === 0) {
      // 比の値を求める (a:b = a/b)
      const a = randomInt(2, 20);
      const b = randomInt(2, 20);
      const g = gcd(a, b);
      
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'division',
        operand1: a / g,
        operand2: b / g,
        answer: a / b,
      });
    } else {
      // 比例式を解く (a:b = c:x)
      const a = randomInt(2, 10);
      const b = randomInt(2, 10);
      const c = randomInt(2, 10);
      const x = (b * c) / a;
      
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'multiplication',
        operand1: b * c,
        operand2: 1 / a,
        answer: x,
      });
    }
  }

  return problems;
}

// 6年生: 速さ・時間・距離
function generateSpeedTimeDistance(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 3);
    
    if (problemType === 0) {
      // 速さを求める（距離÷時間）
      const distance = randomInt(10, 100) * 10; // 100km, 200km...
      const time = randomInt(2, 10); // 2時間, 3時間...
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'division',
        operand1: distance,
        operand2: time,
        answer: distance / time,
      });
    } else if (problemType === 1) {
      // 時間を求める（距離÷速さ）
      const distance = randomInt(10, 100) * 10;
      const speed = randomInt(20, 80);
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'division',
        operand1: distance,
        operand2: speed,
        answer: distance / speed,
      });
    } else {
      // 距離を求める（速さ×時間）
      const speed = randomInt(20, 80);
      const time = randomInt(2, 10);
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'multiplication',
        operand1: speed,
        operand2: time,
        answer: speed * time,
      });
    }
  }

  return problems;
}

// 6年生: 複雑な計算
function generateComplexCalc(_settings: WorksheetSettings, count: number): BasicProblem[] {
  const problems: BasicProblem[] = [];
  
  for (let i = 0; i < count; i++) {
    const patternType = randomInt(0, 3);
    
    if (patternType === 0) {
      // 四則混合（整数）
      const a = randomInt(10, 50);
      const b = randomInt(2, 10);
      const c = randomInt(5, 20);
      // a + b × c の形
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'addition',
        operand1: a,
        operand2: b * c,
        answer: a + b * c,
      });
    } else if (patternType === 1) {
      // 四則混合（小数）
      const a = Math.floor(randomInt(10, 99)) / 10;
      const b = Math.floor(randomInt(10, 99)) / 10;
      const c = Math.floor(randomInt(2, 20)) / 10;
      // (a + b) × c の形
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'multiplication',
        operand1: a + b,
        operand2: c,
        answer: Math.round((a + b) * c * 100) / 100,
      });
    } else {
      // 四則混合（分数）
      const num1 = randomInt(1, 9);
      const denom1 = randomInt(2, 10);
      const multiplier = randomInt(2, 5);
      
      // 分数 × 整数 の形
      problems.push({
        id: generateId(),
        type: 'basic',
        operation: 'multiplication',
        operand1: num1 / denom1,
        operand2: multiplier,
        answer: (num1 * multiplier) / denom1,
      });
    }
  }

  return problems;
}