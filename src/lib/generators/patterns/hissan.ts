import type { HissanProblem, WorksheetSettings } from '../../../types';
import { generateId } from '../../utils/math';
import { generateHissanProblem } from '../hissan';

/**
 * 2桁のたし算の筆算
 */
export function generateHissanAddDouble(
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
export function generateHissanSubDouble(
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
export function generateHissanAddTriple(
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
export function generateHissanSubTriple(
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
export function generateHissanMultBasic(
  _settings: WorksheetSettings,
  count: number
): HissanProblem[] {
  const problems: HissanProblem[] = [];
  for (let i = 0; i < count; i++) {
    // 2桁×1桁のかけ算の筆算
    const operand1 = Math.floor(Math.random() * 90) + 10; // 10-99
    const operand2 = Math.floor(Math.random() * 9) + 1; // 1-9
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
export function generateHissanMultAdvanced(
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
export function generateHissanDivBasic(
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
