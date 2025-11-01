/**
 * 交通費の計算問題生成器（日本語）
 * Transportation fare calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { randomIntByGrade, rangeByGrade, scaleByGrade } from './grade-utils';

/**
 * 運賃の計算問題を生成
 * Generate fare calculation problems
 */
export function generateTransportFare(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  const transports = [
    { name: 'バス', fare: [150, 180, 200, 220] },
    { name: '電車', fare: [140, 160, 180, 200] },
    { name: '地下鉄', fare: [170, 190, 210, 230] },
  ];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 1回の運賃 × 回数
      const transport = transports[randomInt(0, transports.length - 1)];
      const fareOptions = transport.fare.slice(
        0,
        Math.min(transport.fare.length, scaleByGrade(grade, {
          lower: 2,
          middle: 3,
          upper: transport.fare.length,
        }))
      );
      const fare = fareOptions[randomInt(0, fareOptions.length - 1)];
      const times = randomIntByGrade(grade, {
        lower: { min: 2, max: 6 },
        middle: { min: 3, max: 8 },
        upper: { min: 4, max: 12 },
      });
      const totalFare = fare * times;

      problemText = `${transport.name}に1回${fare}円で乗ります。${times}回乗ると全部でいくらですか？`;
      answer = totalFare;
    } else {
      // 往復の運賃
      const transport = transports[randomInt(0, transports.length - 1)];
      const fareOptions = transport.fare.slice(
        0,
        Math.min(transport.fare.length, scaleByGrade(grade, {
          lower: 2,
          middle: 3,
          upper: transport.fare.length,
        }))
      );
      const oneWayFare = fareOptions[randomInt(0, fareOptions.length - 1)];
      const roundTripFare = oneWayFare * 2;

      problemText = `${transport.name}の片道の運賃は${oneWayFare}円です。往復でいくらですか？`;
      answer = roundTripFare;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'multiplication' as Operation,
      problemText,
      answer,
      unit: '円',
    });
  }

  return problems;
}

/**
 * おつりの計算問題を生成
 * Generate change calculation problems
 */
export function generateTransportChange(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const ticketOptions = grade <= 2 ? [140, 160, 180] : grade <= 4 ? [140, 160, 180, 200, 220] : [140, 160, 180, 200, 220, 240, 280, 320];
    const ticketPrice = ticketOptions[randomInt(0, ticketOptions.length - 1)];
    const paymentOptions = grade <= 3 ? [500, 1000] : [500, 1000, 2000];
    const payment = paymentOptions[randomInt(0, paymentOptions.length - 1)];
    const change = payment - ticketPrice;

    const problemText = `${ticketPrice}円の切符を${payment}円で買いました。おつりはいくらですか？`;
    const answer = change;

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: '円',
    });
  }

  return problems;
}

/**
 * 回数券・定期券の計算問題を生成
 * Generate pass/ticket calculation problems
 */
export function generateTransportDiscount(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 回数券の1回あたりの値段
      const timesOptions = grade <= 3 ? [8, 10] : [10, 11, 12];
      const times = timesOptions[randomInt(0, timesOptions.length - 1)];
      const ticketPrice = randomIntByGrade(grade, {
        lower: { min: 9, max: 16 },
        middle: { min: 10, max: 20 },
        upper: { min: 12, max: 24 },
      }) * 100;
      const perTicket = Math.floor(ticketPrice / times);

      problemText = `${times}回分で${ticketPrice}円の回数券があります。1回あたり何円ですか？`;
      answer = perTicket;
    } else {
      // 定期券とばら買いの差
      const dailyFare = randomIntByGrade(grade, {
        lower: { min: 12, max: 22 },
        middle: { min: 15, max: 25 },
        upper: { min: 18, max: 30 },
      }) * 10;
      const daysRange = rangeByGrade(grade, {
        lower: { min: 15, max: 18 },
        middle: { min: 18, max: 22 },
        upper: { min: 20, max: 24 },
      });
      const commuteDays = randomInt(daysRange.min, daysRange.max);
      const normalTotal = dailyFare * commuteDays;
      const passPrice = randomIntByGrade(grade, {
        lower: { min: 22, max: 32 },
        middle: { min: 25, max: 38 },
        upper: { min: 28, max: 45 },
      }) * 100;
      const saving = normalTotal - passPrice;

      problemText = `1日${dailyFare}円のバスに${commuteDays}日間乗ります。定期券は${passPrice}円です。定期券を買うと何円お得ですか？`;
      answer = saving;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 0 ? ('division' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: '円',
    });
  }

  return problems;
}

/**
 * 学年に応じた交通費問題を生成
 * Generate grade-appropriate transportation problems
 */
export function generateGradeTransportProblems(
  grade: Grade,
  count: number,
  pattern: 'transport-fare-jap' | 'transport-change-jap' | 'transport-discount-jap'
): WordProblem[] {
  switch (pattern) {
    case 'transport-fare-jap':
      return generateTransportFare(grade, count);
    case 'transport-change-jap':
      return generateTransportChange(grade, count);
    case 'transport-discount-jap':
      return generateTransportDiscount(grade, count);
    default:
      return generateTransportFare(grade, count);
  }
}
