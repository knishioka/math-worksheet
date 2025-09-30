import type { BasicProblem } from '../../types';

/**
 * 虫食い算で operand1 が空欄の場合、答えと operand2 から逆算
 * @param problem - 基本問題データ
 * @returns 計算されたoperand1の値（文字列）
 * @example
 * // □ + 3 = 7 の場合
 * calculateMissingOperand1({ operation: 'addition', operand2: 3, answer: 7 }) // => '4'
 */
export function calculateMissingOperand1(problem: BasicProblem): string {
  if (problem.answer === null || problem.operand2 === null) {
    return '';
  }

  switch (problem.operation) {
    case 'addition':
      return (problem.answer - problem.operand2).toString();
    case 'subtraction':
      return (problem.answer + problem.operand2).toString();
    case 'multiplication':
      return (problem.answer / problem.operand2).toString();
    case 'division':
      return (problem.answer * problem.operand2).toString();
    default:
      return '';
  }
}

/**
 * 虫食い算で operand2 が空欄の場合、答えと operand1 から逆算
 * @param problem - 基本問題データ
 * @returns 計算されたoperand2の値（文字列）
 * @example
 * // 8 - □ = 5 の場合
 * calculateMissingOperand2({ operation: 'subtraction', operand1: 8, answer: 5 }) // => '3'
 */
export function calculateMissingOperand2(problem: BasicProblem): string {
  if (problem.answer === null || problem.operand1 === null) {
    return '';
  }

  switch (problem.operation) {
    case 'addition':
      return (problem.answer - problem.operand1).toString();
    case 'subtraction':
      return (problem.operand1 - problem.answer).toString();
    case 'multiplication':
      return (problem.answer / problem.operand1).toString();
    case 'division':
      return (problem.operand1 / problem.answer).toString();
    default:
      return '';
  }
}

/**
 * 虫食い算で答えが空欄の場合、operand1 と operand2 から答えを計算
 * @param problem - 基本問題データ
 * @returns 計算された答えの値（文字列、わり算の場合は「商あまり余り」形式）
 * @example
 * // 4 + 2 = □ の場合
 * calculateMissingAnswer({ operation: 'addition', operand1: 4, operand2: 2 }) // => '6'
 * // 7 ÷ 2 = □ の場合（あまりあり）
 * calculateMissingAnswer({ operation: 'division', operand1: 7, operand2: 2 }) // => '3あまり1'
 */
export function calculateMissingAnswer(problem: BasicProblem): string {
  if (problem.operand1 === null || problem.operand2 === null) {
    // フォールバック: problemのanswerを使用
    if (problem.answer !== null) {
      return problem.answer.toString();
    }
    return '';
  }

  switch (problem.operation) {
    case 'addition':
      return (problem.operand1 + problem.operand2).toString();
    case 'subtraction':
      return (problem.operand1 - problem.operand2).toString();
    case 'multiplication':
      return (problem.operand1 * problem.operand2).toString();
    case 'division': {
      const quotient = Math.floor(problem.operand1 / problem.operand2);
      const remainder = problem.operand1 % problem.operand2;
      if (remainder === 0) {
        return quotient.toString();
      } else {
        return `${quotient}あまり${remainder}`;
      }
    }
    default:
      // フォールバック
      if (problem.answer !== null) {
        return problem.answer.toString();
      }
      return '';
  }
}
