/**
 * カレンダー・日付の計算問題生成器（英語）
 * Calendar and date calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { rangeByGrade, randomIntByGrade, scaleByGrade } from './grade-utils';

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
      const weeks = randomIntByGrade(grade, {
        lower: { min: 2, max: 5 },
        middle: { min: 3, max: 7 },
        upper: { min: 4, max: 9 },
      });
      const days = weeks * 7; // 2-9 weeks
      problemText = `How many weeks are there in ${days} days?`;
      answer = weeks;
    } else {
      // Convert weeks to days
      const weeks = randomIntByGrade(grade, {
        lower: { min: 2, max: 5 },
        middle: { min: 3, max: 7 },
        upper: { min: 4, max: 9 },
      });
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
      const age = randomIntByGrade(grade, {
        lower: { min: 6, max: 10 },
        middle: { min: 8, max: 13 },
        upper: { min: 10, max: 16 },
      });
      const birthYear = currentYear - age; // 6-16 years old
      problemText = `Someone was born in ${birthYear}. How old are they this year (${currentYear})?`;
      answer = age;
    } else {
      // Calculate age difference
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
