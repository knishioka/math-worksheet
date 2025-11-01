/**
 * カレンダー・日付の計算問題生成器（英語）
 * Calendar and date calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 日数の計算問題を生成（英語）
 * Generate days calculation problems (English)
 */
export function generateCalendarDaysEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  const months = [
    { name: 'January', days: 31 },
    { name: 'February', days: 28 },
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 31 },
    { name: 'August', days: 31 },
    { name: 'September', days: 30 },
    { name: 'October', days: 31 },
    { name: 'November', days: 30 },
    { name: 'December', days: 31 },
  ];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);
    let problemText: string;
    let answer: number | string;

    if (problemType === 0) {
      // Calculate date after N days
      const startDay = randomInt(1, 20); // 1-20
      const daysToAdd = randomInt(5, 15); // 5-15 days later
      const month = months[randomInt(0, 11)];
      const endDay = startDay + daysToAdd;

      const ordinal = (n: number): string => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };

      if (endDay <= month.days) {
        problemText = `Today is ${month.name} ${ordinal(startDay)}. What date is it ${daysToAdd} days later?`;
        answer = `${month.name} ${ordinal(endDay)}`;
      } else {
        const nextMonthIndex = (months.findIndex(m => m.name === month.name) + 1) % 12;
        const nextMonth = months[nextMonthIndex];
        const nextMonthDay = endDay - month.days;
        problemText = `Today is ${month.name} ${ordinal(startDay)}. What date is it ${daysToAdd} days later?`;
        answer = `${nextMonth.name} ${ordinal(nextMonthDay)}`;
      }
    } else if (problemType === 1) {
      // Calculate difference between dates
      const startDay = randomInt(1, 15); // 1-15
      const endDay = randomInt(20, 30); // 20-30
      const daysDiff = endDay - startDay;

      const month = months[randomInt(0, 11)].name;
      problemText = `How many days are there from ${month} ${startDay} to ${month} ${endDay}?`;
      answer = daysDiff;
    } else {
      // Days in a month
      const month = months[randomInt(0, 11)];
      problemText = `How many days are there in ${month.name}?`;
      answer = month.days;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 2 ? ('addition' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '' : 'days',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 週数の計算問題を生成（英語）
 * Generate weeks calculation problems (English)
 */
export function generateCalendarWeekEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Convert days to weeks
      const days = randomInt(2, 8) * 7; // 14-56 days (2-8 weeks)
      const weeks = days / 7;

      problemText = `How many weeks are there in ${days} days?`;
      answer = weeks;
    } else {
      // Convert weeks to days
      const weeks = randomInt(2, 8); // 2-8 weeks
      const days = weeks * 7;

      problemText = `How many days are there in ${weeks} week${weeks > 1 ? 's' : ''}?`;
      answer = days;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 0 ? ('division' as Operation) : ('multiplication' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? 'weeks' : 'days',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 年齢の計算問題を生成（英語）
 * Generate age calculation problems (English)
 */
export function generateCalendarAgeEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  const currentYear = new Date().getFullYear();

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Calculate age from birth year
      const birthYear = currentYear - randomInt(6, 12); // 6-12 years old
      const age = currentYear - birthYear;

      problemText = `Someone was born in ${birthYear}. How old are they this year (${currentYear})?`;
      answer = age;
    } else {
      // Calculate age difference
      const age1 = randomInt(8, 12); // 8-12 years old
      const age2 = randomInt(6, age1 - 2); // younger age
      const ageDiff = age1 - age2;

      problemText = `Ali is ${age1} years old and Maya is ${age2} years old. What is the age difference?`;
      answer = ageDiff;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: 'years',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じたカレンダー問題を生成（英語）
 * Generate grade-appropriate calendar problems (English)
 */
export function generateGradeCalendarProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'calendar-days-en' | 'calendar-week-en' | 'calendar-age-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'calendar-days-en':
      return generateCalendarDaysEn(grade, count);
    case 'calendar-week-en':
      return generateCalendarWeekEn(grade, count);
    case 'calendar-age-en':
      return generateCalendarAgeEn(grade, count);
    default:
      return generateCalendarDaysEn(grade, count);
  }
}
