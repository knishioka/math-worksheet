/**
 * カレンダー・日付の計算問題生成器（日本語）
 * Calendar and date calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { rangeByGrade, randomIntByGrade, scaleByGrade } from './grade-utils';

/**
 * 日数の計算問題を生成
 * Generate days calculation problems
 */
export function generateCalendarDays(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  const months = [
    { name: '1月', days: 31 },
    { name: '2月', days: 28 },
    { name: '3月', days: 31 },
    { name: '4月', days: 30 },
    { name: '5月', days: 31 },
    { name: '6月', days: 30 },
    { name: '7月', days: 31 },
    { name: '8月', days: 31 },
    { name: '9月', days: 30 },
    { name: '10月', days: 31 },
    { name: '11月', days: 30 },
    { name: '12月', days: 31 },
  ];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);
    let problemText: string;
    let answer: number | string;

    if (problemType === 0) {
      // 何日後の日付を計算
      const startRange = rangeByGrade(grade, {
        lower: { min: 1, max: 18 },
        middle: { min: 1, max: 22 },
        upper: { min: 1, max: 25 },
      });
      const startDay = randomInt(startRange.min, startRange.max);
      const daysToAdd = randomIntByGrade(grade, {
        lower: { min: 3, max: 10 },
        middle: { min: 6, max: 18 },
        upper: { min: 10, max: 24 },
      });
      const month = months[randomInt(0, 11)];
      const endDay = startDay + daysToAdd;

      if (endDay <= month.days) {
        problemText = `${month.name}${startDay}日の${daysToAdd}日後は何月何日ですか？`;
        answer = `${month.name}${endDay}日`;
      } else {
        const nextMonthIndex = (months.findIndex(m => m.name === month.name) + 1) % 12;
        const nextMonth = months[nextMonthIndex];
        const nextMonthDay = endDay - month.days;
        problemText = `${month.name}${startDay}日の${daysToAdd}日後は何月何日ですか？`;
        answer = `${nextMonth.name}${nextMonthDay}日`;
      }
    } else if (problemType === 1) {
      // 日数の差を計算
      const monthData = months[randomInt(0, 11)];
      const startDay = randomIntByGrade(grade, {
        lower: { min: 1, max: Math.min(14, monthData.days - 6) },
        middle: { min: 3, max: Math.min(18, monthData.days - 6) },
        upper: { min: 5, max: Math.min(22, monthData.days - 6) },
      });
      const gapRange = rangeByGrade(grade, {
        lower: { min: 6, max: 12 },
        middle: { min: 8, max: 16 },
        upper: { min: 10, max: 20 },
      });
      const maxGap = Math.min(gapRange.max, monthData.days - startDay);
      const daysDiff = randomInt(gapRange.min, Math.max(gapRange.min, maxGap));
      const endDay = startDay + daysDiff;

      const month = monthData.name;
      problemText = `${month}${startDay}日から${month}${endDay}日まで何日ありますか？`;
      answer = daysDiff;
    } else {
      // ある月の日数を計算
      const month = months[randomInt(0, 11)];
      problemText = `${month.name}は全部で何日ありますか？`;
      answer = month.days;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 2 ? ('addition' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '' : '日',
    });
  }

  return problems;
}

/**
 * 週数の計算問題を生成
 * Generate weeks calculation problems
 */
export function generateCalendarWeek(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number | string;

    if (problemType === 0) {
      // 日数から週数を計算
      const weeks = randomIntByGrade(grade, {
        lower: { min: 2, max: 5 },
        middle: { min: 3, max: 7 },
        upper: { min: 4, max: 9 },
      });
      const days = weeks * 7;

      problemText = `${days}日は何週間ですか？`;
      answer = weeks;
    } else {
      // 週数から日数を計算
      const weeks = randomIntByGrade(grade, {
        lower: { min: 2, max: 5 },
        middle: { min: 3, max: 7 },
        upper: { min: 4, max: 9 },
      });
      const days = weeks * 7;

      problemText = `${weeks}週間は何日ですか？`;
      answer = days;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 0 ? ('division' as Operation) : ('multiplication' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '週間' : '日',
    });
  }

  return problems;
}

/**
 * 年齢の計算問題を生成
 * Generate age calculation problems
 */
export function generateCalendarAge(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  const currentYear = new Date().getFullYear();

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 生まれ年から年齢を計算
      const age = randomIntByGrade(grade, {
        lower: { min: 6, max: 10 },
        middle: { min: 8, max: 13 },
        upper: { min: 10, max: 16 },
      });
      const birthYear = currentYear - age;

      problemText = `${birthYear}年生まれの人は、今年（${currentYear}年）何歳ですか？`;
      answer = age;
    } else {
      // 年齢差を計算
      const age1 = randomIntByGrade(grade, {
        lower: { min: 7, max: 11 },
        middle: { min: 9, max: 13 },
        upper: { min: 11, max: 16 },
      });
      const youngerBuffer = scaleByGrade(grade, {
        lower: 2,
        middle: 3,
        upper: 4,
      });
      const youngerMax = age1 - youngerBuffer;
      const youngerMin = Math.max(5, youngerMax - scaleByGrade(grade, {
        lower: 2,
        middle: 3,
        upper: 4,
      }));
      const age2 = randomInt(Math.min(youngerMin, youngerMax - 1), youngerMax);
      const ageDiff = age1 - age2;

      problemText = `太郎さんは${age1}歳、花子さんは${age2}歳です。何歳違いますか？`;
      answer = ageDiff;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: '歳',
    });
  }

  return problems;
}

/**
 * 学年に応じたカレンダー問題を生成
 * Generate grade-appropriate calendar problems
 */
export function generateGradeCalendarProblems(
  grade: Grade,
  count: number,
  pattern: 'calendar-days-jap' | 'calendar-week-jap' | 'calendar-age-jap'
): WordProblem[] {
  switch (pattern) {
    case 'calendar-days-jap':
      return generateCalendarDays(grade, count);
    case 'calendar-week-jap':
      return generateCalendarWeek(grade, count);
    case 'calendar-age-jap':
      return generateCalendarAge(grade, count);
    default:
      return generateCalendarDays(grade, count);
  }
}
