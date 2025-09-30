import type { Operation, CalculationPattern } from '../../types';

/**
 * 演算タイプを日本語名に変換
 * @param operation - 演算タイプ ('addition' | 'subtraction' | 'multiplication' | 'division')
 * @param calculationPattern - 計算パターン（混合問題の判定に使用）
 * @returns 演算名の日本語表記（例: 'たし算', 'たし算・ひき算'）
 * @example
 * getOperationName('addition') // => 'たし算'
 * getOperationName('addition', 'add-sub-mixed-basic') // => 'たし算・ひき算'
 */
export function getOperationName(
  operation: Operation,
  calculationPattern?: CalculationPattern
): string {
  // 混合パターンの場合は特別な表示
  if (
    calculationPattern === 'add-sub-mixed-basic' ||
    calculationPattern === 'add-sub-double-mixed'
  ) {
    return 'たし算・ひき算';
  }

  switch (operation) {
    case 'addition':
      return 'たし算';
    case 'subtraction':
      return 'ひき算';
    case 'multiplication':
      return 'かけ算';
    case 'division':
      return 'わり算';
    default:
      return '計算';
  }
}

/**
 * 演算タイプを数学記号に変換
 * @param operation - 演算タイプ ('addition' | 'subtraction' | 'multiplication' | 'division')
 * @returns 演算記号（例: '+', '-', '×', '÷'）
 * @example
 * getOperatorSymbol('addition') // => '+'
 * getOperatorSymbol('multiplication') // => '×'
 */
export function getOperatorSymbol(operation: Operation): string {
  switch (operation) {
    case 'addition':
      return '+';
    case 'subtraction':
      return '-';
    case 'multiplication':
      return '×';
    case 'division':
      return '÷';
    default:
      return '';
  }
}
