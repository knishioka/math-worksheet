import type {
  BasicProblem,
  WordProblem,
  WorksheetSettings,
} from '../../../types';
import { generateId, randomInt } from '../../utils/math';

// Fisher-Yatesシャッフル
function shuffleArray(arr: number[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// 1年生（入門）: +N のたし算（共通関数）
function generateAddPlusN(
  count: number,
  n: number,
  maxOperand1: number
): BasicProblem[] {
  // シャッフルプールで重複なしを保証
  const pool: number[] = [];
  for (let i = 0; i <= maxOperand1; i++) pool.push(i);
  shuffleArray(pool);

  const problems: BasicProblem[] = [];
  for (let i = 0; i < count; i++) {
    // プールを使い切ったら再シャッフルして構造的重複を防ぐ
    if (i > 0 && i % pool.length === 0) {
      shuffleArray(pool);
    }
    const operand1 = pool[i % pool.length];
    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2: n,
      answer: operand1 + n,
      carryOver: false,
    });
  }
  return problems;
}

// 1年生（入門）: +1のたし算
export function generateAddPlusOne(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  return generateAddPlusN(count, 1, 9);
}

// 1年生（入門）: +2のたし算
export function generateAddPlusTwo(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  return generateAddPlusN(count, 2, 8);
}

// 1年生（入門）: かずをかぞえよう（○を数える）
const COUNTING_SYMBOLS = ['○', '●', '★', '♥', '△', '□', '◆', '☆'];

export function generateAddCounting(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];
  const usedCounts = new Set<string>();

  for (let i = 0; i < count; i++) {
    let num: number;
    let symbolIndex: number;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      num = randomInt(1, 10);
      symbolIndex = randomInt(0, COUNTING_SYMBOLS.length - 1);
      key = `${num}-${symbolIndex}`;
      if (!usedCounts.has(key)) {
        usedCounts.add(key);
        break;
      }
      attempts++;
    } while (attempts < maxAttempts);

    const symbol = COUNTING_SYMBOLS[symbolIndex];
    // 5個ごとに改行を入れる
    const lines: string[] = [];
    for (let j = 0; j < num; j += 5) {
      const lineCount = Math.min(5, num - j);
      lines.push(symbol.repeat(lineCount));
    }
    const symbolText = lines.join('\n');

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'addition',
      problemText: `${symbolText}\nは いくつ？`,
      answer: num,
      isSymbolProblem: true,
    });
  }

  return problems;
}

// 1年生（入門）: ○を使ったたし算
export function generateCountingAdd(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number, operand2: number;
    let symbolIndex: number;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      operand1 = randomInt(1, 5);
      operand2 = randomInt(1, 5);
      symbolIndex = randomInt(0, COUNTING_SYMBOLS.length - 1);
      const key = `${operand1}+${operand2}-${symbolIndex}`;
      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        break;
      }
      attempts++;
    } while (attempts < maxAttempts);

    const symbol = COUNTING_SYMBOLS[symbolIndex];
    const group1 = symbol.repeat(operand1);
    const group2 = symbol.repeat(operand2);

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'addition',
      problemText: `${group1} と ${group2} で\nあわせて いくつ？`,
      answer: operand1 + operand2,
      isSymbolProblem: true,
    });
  }

  return problems;
}

// 1年生（入門）: ○を使ったひき算
export function generateCountingSub(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number, operand2: number;
    let symbolIndex: number;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      operand1 = randomInt(3, 10);
      operand2 = randomInt(1, operand1 - 1);
      symbolIndex = randomInt(0, COUNTING_SYMBOLS.length - 1);
      const key = `${operand1}-${operand2}-${symbolIndex}`;
      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        break;
      }
      attempts++;
    } while (attempts < maxAttempts);

    const symbol = COUNTING_SYMBOLS[symbolIndex];
    // 全体を表示し、取る分を示す
    const lines: string[] = [];
    for (let j = 0; j < operand1; j += 5) {
      const lineCount = Math.min(5, operand1 - j);
      lines.push(symbol.repeat(lineCount));
    }
    const allSymbols = lines.join('\n');
    const removeSymbols = symbol.repeat(operand2);

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'subtraction',
      problemText: `${allSymbols}\nから ${removeSymbols} とると\nのこりは いくつ？`,
      answer: operand1 - operand2,
      isSymbolProblem: true,
    });
  }

  return problems;
}

// 1年生: 1桁のたし算（10まで）
export function generateAddSingleDigit(
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
export function generateAddSingleDigitCarry(
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
export function generateAddTo10(
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
    // プールを使い切ったら再シャッフルして構造的重複を防ぐ
    if (i > 0 && i % shuffledPairs.length === 0) {
      shuffledPairs.sort(() => Math.random() - 0.5);
    }
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
export function generateAdd10Plus(
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
export function generateSubSingleDigit(
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
export function generateSubSingleDigitBorrow(
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
export function generateSubFrom10(
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
export function generateAddSubMixedBasic(
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
