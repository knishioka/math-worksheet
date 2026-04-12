import type {
  WorksheetSettings,
  Grade,
  ProblemType,
  CalculationPattern,
  LayoutColumns,
} from '../../types';
import { PATTERN_LABELS } from '../../types';
import { getPrintTemplate } from '../../config/print-templates';
import { getEffectiveProblemType } from './problem-type-detector';

const VALID_GRADES: readonly number[] = [0, 1, 2, 3, 4, 5, 6];
const VALID_PROBLEM_TYPES: readonly string[] = [
  'basic',
  'fraction',
  'decimal',
  'mixed',
  'hissan',
  'hissan-div',
  'missing',
  'word',
  'word-en',
  'anzan',
  'number-tracing',
];
const VALID_COLUMNS: readonly number[] = [1, 2, 3];

export function getOperationFromPattern(
  pattern: CalculationPattern
): WorksheetSettings['operation'] {
  if (pattern.includes('add')) return 'addition';
  if (pattern.includes('sub')) return 'subtraction';
  if (pattern.includes('mult')) return 'multiplication';
  if (pattern.includes('div')) return 'division';
  return 'addition';
}

export function parseUrlSettings(
  search: string,
  defaults: WorksheetSettings
): Partial<WorksheetSettings> {
  const params = new URLSearchParams(search);
  const result: Partial<WorksheetSettings> = {};

  const gradeParam = params.get('grade');
  if (gradeParam !== null) {
    const grade = Number(gradeParam);
    result.grade = VALID_GRADES.includes(grade)
      ? (grade as Grade)
      : defaults.grade;
  }

  const typeParam = params.get('type');
  if (typeParam !== null) {
    result.problemType = VALID_PROBLEM_TYPES.includes(typeParam)
      ? (typeParam as ProblemType)
      : defaults.problemType;
  }

  const patternParam = params.get('pattern');
  if (patternParam !== null) {
    if (patternParam in PATTERN_LABELS) {
      result.calculationPattern = patternParam as CalculationPattern;
      result.operation = getOperationFromPattern(result.calculationPattern);
    }
    // Invalid pattern is silently ignored (no calculationPattern set)
  }

  const colsParam = params.get('cols');
  if (colsParam !== null) {
    const cols = Number(colsParam);
    result.layoutColumns = VALID_COLUMNS.includes(cols)
      ? (cols as LayoutColumns)
      : defaults.layoutColumns;
  }

  const countParam = params.get('count');
  if (countParam !== null) {
    const count = Number(countParam);
    if (Number.isFinite(count) && count > 0) {
      const effectiveType = getEffectiveProblemType(
        result.problemType ?? defaults.problemType,
        result.calculationPattern
      );
      const template = getPrintTemplate(effectiveType);
      const cols = result.layoutColumns ?? defaults.layoutColumns;
      const maxCount = template.maxCounts[cols];
      result.problemCount = Math.min(count, maxCount);
    }
  }

  return result;
}

export function settingsToUrlParams(settings: WorksheetSettings): string {
  const params = new URLSearchParams();
  params.set('grade', String(settings.grade));
  params.set('type', settings.problemType);
  if (settings.calculationPattern) {
    params.set('pattern', settings.calculationPattern);
  }
  params.set('cols', String(settings.layoutColumns));
  params.set('count', String(settings.problemCount));
  return params.toString();
}

export function syncUrlFromSettings(settings: WorksheetSettings): void {
  const queryString = settingsToUrlParams(settings);
  const newUrl = `${window.location.pathname}?${queryString}`;
  window.history.replaceState(null, '', newUrl);
}
