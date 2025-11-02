import type { Grade } from '../../types';
import { randomInt } from '../utils/math';

export type GradeBand = 'lower' | 'middle' | 'upper';

type GradeBandRecord<T> = Record<GradeBand, T>;

export function getGradeBand(grade: Grade): GradeBand {
  if (grade <= 2) {
    return 'lower';
  }
  if (grade <= 4) {
    return 'middle';
  }
  return 'upper';
}

export function pickByGrade<T>(grade: Grade, values: GradeBandRecord<T>): T {
  return values[getGradeBand(grade)];
}

export function rangeByGrade(
  grade: Grade,
  ranges: GradeBandRecord<{ min: number; max: number }>
): { min: number; max: number } {
  return pickByGrade(grade, ranges);
}

export function randomIntByGrade(
  grade: Grade,
  ranges: GradeBandRecord<{ min: number; max: number }>
): number {
  const { min, max } = rangeByGrade(grade, ranges);
  return randomInt(min, max);
}

export function scaleByGrade(
  grade: Grade,
  values: GradeBandRecord<number>
): number {
  return pickByGrade(grade, values);
}
