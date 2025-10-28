/**
 * 交通費の計算問題生成器（日本語）
 * Transportation fare calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

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
      const fare = transport.fare[randomInt(0, transport.fare.length - 1)];
      const times = randomInt(3, 10); // 3-10回
      const totalFare = fare * times;

      problemText = `${transport.name}に1回${fare}円で乗ります。${times}回乗ると全部でいくらですか？`;
      answer = totalFare;
    } else {
      // 往復の運賃
      const transport = transports[randomInt(0, transports.length - 1)];
      const oneWayFare = transport.fare[randomInt(0, transport.fare.length - 1)];
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
    const ticketPrice = [140, 160, 180, 200, 220, 240, 280][randomInt(0, 6)];
    const payment = [500, 1000][randomInt(0, 1)];
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
      const times = [10, 11][randomInt(0, 1)]; // 10回分または11回分
      const ticketPrice = randomInt(10, 20) * 100; // 1000-2000円
      const perTicket = Math.floor(ticketPrice / times);

      problemText = `${times}回分で${ticketPrice}円の回数券があります。1回あたり何円ですか？`;
      answer = perTicket;
    } else {
      // 定期券とばら買いの差
      const dailyFare = randomInt(15, 25) * 10; // 150-250円
      const days = 20; // 20日間
      const normalTotal = dailyFare * days;
      const passPrice = randomInt(25, 40) * 100; // 2500-4000円
      const saving = normalTotal - passPrice;

      problemText = `1日${dailyFare}円のバスに20日間乗ります。定期券は${passPrice}円です。定期券を買うと何円お得ですか？`;
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
