/**
 * カレンダー・日付の計算問題生成器（日本語）
 * Calendar and date calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

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
      const startDay = randomInt(1, 20); // 1-20日
      const daysToAdd = randomInt(5, 15); // 5-15日後
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
      const startDay = randomInt(1, 15); // 1-15日
      const endDay = randomInt(20, 30); // 20-30日
      const daysDiff = endDay - startDay;

      const month = months[randomInt(0, 11)].name;
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
      const days = randomInt(2, 8) * 7; // 14-56日（2-8週間）
      const weeks = days / 7;

      problemText = `${days}日は何週間ですか？`;
      answer = weeks;
    } else {
      // 週数から日数を計算
      const weeks = randomInt(2, 8); // 2-8週間
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
      const birthYear = currentYear - randomInt(6, 12); // 6-12歳
      const age = currentYear - birthYear;

      problemText = `${birthYear}年生まれの人は、今年（${currentYear}年）何歳ですか？`;
      answer = age;
    } else {
      // 年齢差を計算
      const age1 = randomInt(8, 12); // 8-12歳
      const age2 = randomInt(6, age1 - 2); // より若い年齢
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
