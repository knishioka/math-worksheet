import type { BasicProblem, WorksheetSettings } from '../../../types';
import { generateId, randomInt } from '../../utils/math';

// 1年生: たし算の虫食い算
export function generateAddSingleMissing(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    // 答えが10以下になるようにする
    const answer = randomInt(3, 10);
    // 虫食い算では operand1 または operand2 のみを空白にする（答えを求める普通の計算問題は除外）
    const missingPosition = (['operand1', 'operand2'] as const)[
      randomInt(0, 1)
    ];

    let operand1: number | null = null;
    let operand2: number | null = null;
    let answerValue: number | null = answer;

    if (missingPosition === 'operand1') {
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
export function generateSubSingleMissing(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    // 虫食い算では operand1 または operand2 のみを空白にする（答えを求める普通の計算問題は除外）
    const missingPosition = (['operand1', 'operand2'] as const)[
      randomInt(0, 1)
    ];

    let operand1: number | null = null;
    let operand2: number | null = null;
    let answer: number | null = null;

    if (missingPosition === 'operand1') {
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
export function generateAddDoubleMissing(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    // 答えが100以下になるようにする
    const answer = randomInt(20, 99);
    // 虫食い算では operand1 または operand2 のみを空白にする（答えを求める普通の計算問題は除外）
    const missingPosition = (['operand1', 'operand2'] as const)[
      randomInt(0, 1)
    ];

    let operand1: number | null = null;
    let operand2: number | null = null;
    let answerValue: number | null = answer;

    if (missingPosition === 'operand1') {
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
export function generateSubDoubleMissing(
  _settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    // 虫食い算では operand1 または operand2 のみを空白にする（答えを求める普通の計算問題は除外）
    const missingPosition = (['operand1', 'operand2'] as const)[
      randomInt(0, 1)
    ];

    let operand1: number | null = null;
    let operand2: number | null = null;
    let answer: number | null = null;

    if (missingPosition === 'operand1') {
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
export function generateMultSingleMissing(
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
      // 虫食い算では operand1 または operand2 のみを空白にする（答えを求める普通の計算問題は除外）
      missingPosition = (['operand1', 'operand2'] as const)[randomInt(0, 1)];

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
