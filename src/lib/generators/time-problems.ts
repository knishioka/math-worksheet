/**
 * 時刻・時間の計算問題生成器（日本語）
 * Time and clock problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 時刻の計算問題（○分後）を生成
 * Generate time calculation problems (minutes after)
 */
export function generateTimeReading(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const startHour = randomInt(1, 11);
    const startMinute = grade === 2 ? randomInt(0, 11) * 5 : randomInt(0, 5) * 10;

    // 経過時間（分）
    const elapsedMinutes = grade === 2 ? randomInt(1, 6) * 10 : randomInt(1, 12) * 5;

    // 終了時刻を計算
    const endTotalMinutes = startHour * 60 + startMinute + elapsedMinutes;
    const endHour = Math.floor(endTotalMinutes / 60);
    const endMinute = endTotalMinutes % 60;

    const startTime = startMinute === 0 ? `${startHour}時` : `${startHour}時${startMinute}分`;
    const endTime = endMinute === 0 ? `${endHour}時` : `${endHour}時${endMinute}分`;

    const problemText = `今${startTime}です。${elapsedMinutes}分後は何時何分ですか？`;

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'addition' as Operation,
      problemText,
      answer: endTime,
      unit: '',
    });
  }

  return problems;
}

/**
 * 経過時間の問題を生成
 * Generate elapsed time problems
 */
export function generateTimeElapsed(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const startHour = randomInt(1, 10);
    const startMinute = grade === 2 ? randomInt(0, 11) * 5 : randomInt(0, 5) * 10;

    let elapsedHours: number;
    let elapsedMinutes: number;

    if (grade === 2) {
      // 2年生: 時間単位
      elapsedHours = randomInt(1, 3);
      elapsedMinutes = 0;
    } else if (grade === 3) {
      // 3年生: 時間と分
      elapsedHours = randomInt(1, 3);
      elapsedMinutes = randomInt(0, 5) * 10;
    } else {
      // 4年生: より複雑な時間
      elapsedHours = randomInt(1, 5);
      elapsedMinutes = randomInt(0, 11) * 5;
    }

    const endMinute = startMinute + elapsedMinutes;
    const extraHour = Math.floor(endMinute / 60);
    const finalMinute = endMinute % 60;
    const finalHour = startHour + elapsedHours + extraHour;

    const startTime = startMinute === 0 ? `${startHour}時` : `${startHour}時${startMinute}分`;
    const elapsedTime =
      elapsedMinutes === 0
        ? `${elapsedHours}時間`
        : `${elapsedHours}時間${elapsedMinutes}分`;
    const endTime = finalMinute === 0 ? `${finalHour}時` : `${finalHour}時${finalMinute}分`;

    const problemText = `${startTime}から${elapsedTime}後は何時ですか？`;

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'addition' as Operation,
      problemText,
      answer: endTime,
      unit: '',
    });
  }

  return problems;
}

/**
 * 時間の計算問題を生成
 * Generate time calculation problems
 */
export function generateTimeCalc(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const startHour = randomInt(7, 11); // 午前
    const endHour = randomInt(13, 17); // 午後
    const startMinute = grade === 3 ? 0 : randomInt(0, 5) * 10;
    const endMinute = grade === 3 ? 0 : randomInt(0, 5) * 10;

    // 時間差を計算
    const diffHours = endHour - startHour;
    const diffMinutes = endMinute - startMinute;

    let answer: string;
    if (diffMinutes >= 0) {
      answer = diffMinutes === 0 ? `${diffHours}時間` : `${diffHours}時間${diffMinutes}分`;
    } else {
      const adjustedHours = diffHours - 1;
      const adjustedMinutes = 60 + diffMinutes;
      answer = `${adjustedHours}時間${adjustedMinutes}分`;
    }

    const startTime = startMinute === 0 ? `午前${startHour}時` : `午前${startHour}時${startMinute}分`;
    const endTime = endMinute === 0 ? `午後${endHour - 12}時` : `午後${endHour - 12}時${endMinute}分`;

    const problemText = `${startTime}から${endTime}まで何時間ですか？`;

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: '',
    });
  }

  return problems;
}

/**
 * 学年に応じた時刻・時間の問題を生成
 * Generate grade-appropriate time problems
 */
export function generateGradeTimeProblems(
  grade: Grade,
  count: number,
  pattern: 'time-reading-jap' | 'time-elapsed-jap' | 'time-calc-jap'
): WordProblem[] {
  switch (pattern) {
    case 'time-reading-jap':
      return generateTimeReading(grade, count);
    case 'time-elapsed-jap':
      return generateTimeElapsed(grade, count);
    case 'time-calc-jap':
      return generateTimeCalc(grade, count);
    default:
      return generateTimeReading(grade, count);
  }
}
