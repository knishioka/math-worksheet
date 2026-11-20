import type { Grade } from '../types';

export const GRADE_LABELS: Record<Grade, string> = {
  0: '幼児（年長）',
  1: '1年生',
  2: '2年生',
  3: '3年生',
  4: '4年生',
  5: '5年生',
  6: '6年生',
};

export const GRADES = Object.keys(GRADE_LABELS).map(Number) as Grade[];

export function getGradeProblemType(grade: Grade): 'basic' | 'number-tracing' {
  return grade === 0 ? 'number-tracing' : 'basic';
}
