/**
 * 時刻・時間の計算問題生成器（英語）
 * Time and clock problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 時刻の読み方問題を生成（英語）
 * Generate time reading problems (English)
 */
export function generateTimeReadingEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const hour = randomInt(1, 12);
    const minute = grade === 2 ? randomInt(0, 11) * 5 : randomInt(0, 59);

    const ampm = randomInt(0, 1) === 0 ? 'AM' : 'PM';
    const minuteText = minute === 0 ? "o'clock" : minute < 10 ? `0${minute}` : `${minute}`;

    const problemText =
      minute === 0
        ? `The clock shows ${hour} ${ampm}. What time is it?`
        : `The clock shows ${hour}:${minuteText} ${ampm}. What time is it?`;

    const answer = minute === 0 ? `${hour}:00 ${ampm}` : `${hour}:${minuteText} ${ampm}`;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'addition' as Operation,
      problemText,
      answer,
      unit: '',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 経過時間の問題を生成（英語）
 * Generate elapsed time problems (English)
 */
export function generateTimeElapsedEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const startHour = randomInt(1, 10);
    const startMinute = grade === 2 ? randomInt(0, 11) * 5 : randomInt(0, 5) * 10;

    let elapsedHours: number;
    let elapsedMinutes: number;

    if (grade === 2) {
      // Grade 2: hours only
      elapsedHours = randomInt(1, 3);
      elapsedMinutes = 0;
    } else if (grade === 3) {
      // Grade 3: hours and minutes
      elapsedHours = randomInt(1, 3);
      elapsedMinutes = randomInt(0, 5) * 10;
    } else {
      // Grade 4: more complex times
      elapsedHours = randomInt(1, 5);
      elapsedMinutes = randomInt(0, 11) * 5;
    }

    const endMinute = startMinute + elapsedMinutes;
    const extraHour = Math.floor(endMinute / 60);
    const finalMinute = endMinute % 60;
    const finalHour = startHour + elapsedHours + extraHour;

    const formatTime = (h: number, m: number) => {
      const ampm = h < 12 ? 'AM' : 'PM';
      const displayHour = h > 12 ? h - 12 : h;
      return m === 0 ? `${displayHour}:00 ${ampm}` : `${displayHour}:${m < 10 ? '0' + m : m} ${ampm}`;
    };

    const startTime = formatTime(startHour, startMinute);
    const endTime = formatTime(finalHour, finalMinute);

    const elapsedText =
      elapsedMinutes === 0
        ? `${elapsedHours} hour${elapsedHours > 1 ? 's' : ''}`
        : `${elapsedHours} hour${elapsedHours > 1 ? 's' : ''} ${elapsedMinutes} minutes`;

    const problemText = `It is ${startTime}. What time will it be in ${elapsedText}?`;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'addition' as Operation,
      problemText,
      answer: endTime,
      unit: '',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 時間の計算問題を生成（英語）
 * Generate time calculation problems (English)
 */
export function generateTimeCalcEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const startHour = randomInt(7, 11); // morning
    const endHour = randomInt(13, 17); // afternoon
    const startMinute = grade === 3 ? 0 : randomInt(0, 5) * 10;
    const endMinute = grade === 3 ? 0 : randomInt(0, 5) * 10;

    // Calculate time difference
    const diffHours = endHour - startHour;
    const diffMinutes = endMinute - startMinute;

    let answerHours: number;
    let answerMinutes: number;

    if (diffMinutes >= 0) {
      answerHours = diffHours;
      answerMinutes = diffMinutes;
    } else {
      answerHours = diffHours - 1;
      answerMinutes = 60 + diffMinutes;
    }

    const answer =
      answerMinutes === 0
        ? `${answerHours} hours`
        : `${answerHours} hours ${answerMinutes} minutes`;

    const formatTime = (h: number, m: number, ampm: string) => {
      return m === 0 ? `${h}:00 ${ampm}` : `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
    };

    const startTime = formatTime(startHour, startMinute, 'AM');
    const endTime = formatTime(endHour - 12, endMinute, 'PM');

    const problemText = `How much time passes from ${startTime} to ${endTime}?`;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: '',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じた時刻・時間の問題を生成（英語）
 * Generate grade-appropriate time problems (English)
 */
export function generateGradeTimeProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'time-reading-en' | 'time-elapsed-en' | 'time-calc-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'time-reading-en':
      return generateTimeReadingEn(grade, count);
    case 'time-elapsed-en':
      return generateTimeElapsedEn(grade, count);
    case 'time-calc-en':
      return generateTimeCalcEn(grade, count);
    default:
      return generateTimeReadingEn(grade, count);
  }
}
