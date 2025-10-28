/**
 * 交通費の計算問題生成器（英語）
 * Transportation fare calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 運賃の計算問題を生成（英語）
 * Generate fare calculation problems (English)
 */
export function generateTransportFareEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  const transports = [
    { name: 'bus', fare: [1.5, 2.0, 2.5, 3.0] },
    { name: 'train', fare: [2.0, 2.5, 3.0, 3.5] },
    { name: 'LRT', fare: [1.5, 2.0, 2.5, 3.0] },
  ];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Fare per trip × number of trips
      const transport = transports[randomInt(0, transports.length - 1)];
      const fare = transport.fare[randomInt(0, transport.fare.length - 1)];
      const times = randomInt(4, 10); // 4-10 trips
      const totalFare = fare * times;

      problemText = `A ${transport.name} ride costs RM${fare.toFixed(2)}. How much for ${times} trips?`;
      answer = Math.round(totalFare * 100) / 100;
    } else {
      // Round trip fare
      const transport = transports[randomInt(0, transports.length - 1)];
      const oneWayFare = transport.fare[randomInt(0, transport.fare.length - 1)];
      const roundTripFare = oneWayFare * 2;

      problemText = `A one-way ${transport.name} fare is RM${oneWayFare.toFixed(2)}. What is the round trip cost?`;
      answer = Math.round(roundTripFare * 100) / 100;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'multiplication' as Operation,
      problemText,
      answer,
      unit: 'RM',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * おつりの計算問題を生成（英語）
 * Generate change calculation problems (English)
 */
export function generateTransportChangeEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const ticketPrice = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0][randomInt(0, 5)];
    const payment = [5, 10][randomInt(0, 1)];
    const change = payment - ticketPrice;

    const problemText = `You buy a ticket for RM${ticketPrice.toFixed(2)} with RM${payment}. What is your change?`;
    const answer = Math.round(change * 100) / 100;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: 'RM',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 回数券・パスの計算問題を生成（英語）
 * Generate pass/ticket calculation problems (English)
 */
export function generateTransportDiscountEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Multi-trip pass price per trip
      const trips = [10, 12][randomInt(0, 1)]; // 10 or 12 trips
      const passPrice = randomInt(20, 35); // RM20-35
      const perTrip = Math.round((passPrice / trips) * 100) / 100;

      problemText = `A ${trips}-trip pass costs RM${passPrice}. What is the cost per trip?`;
      answer = perTrip;
    } else {
      // Monthly pass vs single tickets savings
      const dailyFare = [2.0, 2.5, 3.0][randomInt(0, 2)];
      const days = 20; // 20 days
      const normalTotal = dailyFare * days;
      const passPrice = randomInt(30, 45); // RM30-45
      const saving = Math.round((normalTotal - passPrice) * 100) / 100;

      problemText = `Daily fare is RM${dailyFare.toFixed(2)} for 20 days. A monthly pass costs RM${passPrice}. How much do you save with the pass?`;
      answer = saving;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 0 ? ('division' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: 'RM',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じた交通費問題を生成（英語）
 * Generate grade-appropriate transportation problems (English)
 */
export function generateGradeTransportProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'transport-fare-en' | 'transport-change-en' | 'transport-discount-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'transport-fare-en':
      return generateTransportFareEn(grade, count);
    case 'transport-change-en':
      return generateTransportChangeEn(grade, count);
    case 'transport-discount-en':
      return generateTransportDiscountEn(grade, count);
    default:
      return generateTransportFareEn(grade, count);
  }
}
