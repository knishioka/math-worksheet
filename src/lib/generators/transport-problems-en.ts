/**
 * 交通費の計算問題生成器（英語）
 * Transportation fare calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { pickByGrade, randomIntByGrade, rangeByGrade } from './grade-utils';

/**
 * 運賃の計算問題を生成（英語）
 * Generate fare calculation problems (English)
 */
export function generateTransportFareEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  const transports = [
    { name: 'bus' },
    { name: 'train' },
    { name: 'LRT' },
  ];

  const fareBands = pickByGrade(grade, {
    lower: [1.0, 1.5, 2.0],
    middle: [1.5, 2.0, 2.5, 3.0],
    upper: [2.0, 2.5, 3.0, 3.5],
  });

  const tripRange = rangeByGrade(grade, {
    lower: { min: 2, max: 5 },
    middle: { min: 3, max: 7 },
    upper: { min: 4, max: 10 },
  });

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Fare per trip × number of trips
      const transport = transports[randomInt(0, transports.length - 1)];
      const fare = fareBands[randomInt(0, fareBands.length - 1)];
      const times = randomInt(tripRange.min, tripRange.max);
      const totalFare = fare * times;

      problemText = `A ${transport.name} ride costs RM${fare.toFixed(2)}. How much for ${times} trips?`;
      answer = Math.round(totalFare * 100) / 100;
    } else {
      // Round trip fare
      const transport = transports[randomInt(0, transports.length - 1)];
      const oneWayFare = fareBands[randomInt(0, fareBands.length - 1)];
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
    const ticketOptions = pickByGrade(grade, {
      lower: [1.0, 1.5, 2.0, 2.5],
      middle: [1.5, 2.0, 2.5, 3.0, 3.5],
      upper: [2.5, 3.0, 3.5, 4.0, 4.5],
    });
    const paymentOptions = pickByGrade(grade, {
      lower: [3, 4, 5],
      middle: [4, 5, 6, 8],
      upper: [5, 6, 8, 10],
    });
    const ticketPrice = ticketOptions[randomInt(0, ticketOptions.length - 1)];
    const affordablePayments = paymentOptions.filter((amount) => amount > ticketPrice);
    const paymentPool = affordablePayments.length > 0 ? affordablePayments : paymentOptions;
    const payment = paymentPool[randomInt(0, paymentPool.length - 1)];
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
      const tripsOptions = grade <= 3 ? [8, 10] : [10, 12, 15];
      const trips = tripsOptions[randomInt(0, tripsOptions.length - 1)];
      const passPrice = randomIntByGrade(grade, {
        lower: { min: 18, max: 30 },
        middle: { min: 22, max: 35 },
        upper: { min: 28, max: 45 },
      });
      const perTrip = Math.round((passPrice / trips) * 100) / 100;

      problemText = `A ${trips}-trip pass costs RM${passPrice}. What is the cost per trip?`;
      answer = perTrip;
    } else {
      // Monthly pass vs single tickets savings
      const dailyFare = randomIntByGrade(grade, {
        lower: { min: 18, max: 25 },
        middle: { min: 20, max: 30 },
        upper: { min: 25, max: 35 },
      }) / 10;
      const daysRange = rangeByGrade(grade, {
        lower: { min: 15, max: 18 },
        middle: { min: 18, max: 22 },
        upper: { min: 20, max: 24 },
      });
      const commuteDays = randomInt(daysRange.min, daysRange.max);
      const normalTotal = dailyFare * commuteDays;
      const passPrice = randomIntByGrade(grade, {
        lower: { min: 25, max: 35 },
        middle: { min: 30, max: 45 },
        upper: { min: 35, max: 55 },
      });
      const saving = Math.round((normalTotal - passPrice) * 100) / 100;

      problemText = `Daily fare is RM${dailyFare.toFixed(2)} for ${commuteDays} days. A monthly pass costs RM${passPrice}. How much do you save with the pass?`;
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
