import type { BasicProblem, WorksheetSettings } from '../../../types';
import { generateId, randomInt } from '../../utils/math';

// 暗算かけ算の共通ヘルパー: 重複排除付きの問題生成
function generateUniqueMultiplicationProblems(
  count: number,
  generateOperands: () => { operand1: number; operand2: number }
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1: number;
    let operand2: number;
    let key: string;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      ({ operand1, operand2 } = generateOperands());
      key = `${operand1}×${operand2}`;
      attempts++;
    } while (usedCombinations.has(key) && attempts < maxAttempts);

    usedCombinations.add(key);

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

// ×5の暗算（半分×10のテクニック）
export function generateAnzanMul5(
  settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const grade = settings.grade;
  return generateUniqueMultiplicationProblems(count, () => {
    const operand2 =
      grade <= 3
        ? randomInt(1, 10) * 2 // 3年生: 5×偶数, 数値範囲2〜20
        : randomInt(2, 99); // 4年生以上: 5×任意の1〜2桁
    return { operand1: 5, operand2 };
  });
}

// ×9の暗算（×10−元の数のテクニック）
export function generateAnzanMul9(
  settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const grade = settings.grade;
  return generateUniqueMultiplicationProblems(count, () => {
    if (grade <= 3) {
      // 3年生: 9×1桁
      return { operand1: 9, operand2: randomInt(2, 9) };
    }
    // 4年生以上: 9×2桁 or 99×1桁
    if (Math.random() < 0.5) {
      return { operand1: 9, operand2: randomInt(10, 99) };
    }
    return { operand1: 99, operand2: randomInt(2, 9) };
  });
}

// ×11の暗算（A,(A+B),Bのテクニック）
export function generateAnzanMul11(
  settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const grade = settings.grade;
  return generateUniqueMultiplicationProblems(count, () => {
    let operand2: number;
    if (grade <= 4) {
      // 4年生: 11×2桁 (A+B<10、繰り上がりなし)
      const a = randomInt(1, 9);
      const b = randomInt(0, 9 - a);
      operand2 = a * 10 + b;
    } else {
      // 5年生以上: 11×2桁（繰り上がりあり含む）
      operand2 = randomInt(10, 99);
    }
    return { operand1: 11, operand2 };
  });
}

// ×25の暗算（÷4×100のテクニック）
export function generateAnzanMul25(
  settings: WorksheetSettings,
  count: number
): BasicProblem[] {
  const grade = settings.grade;
  return generateUniqueMultiplicationProblems(count, () => {
    const operand2 =
      grade <= 4
        ? randomInt(1, 24) * 4 // 4年生: 25×4の倍数 (4,8,...,96)
        : randomInt(2, 99); // 5年生以上: 25×任意の1〜2桁
    return { operand1: 25, operand2 };
  });
}
