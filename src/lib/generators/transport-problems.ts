/**
 * 交通費の計算問題生成器（日本語）
 * Transportation fare calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { pickByGrade, randomIntByGrade, rangeByGrade, scaleByGrade } from './grade-utils';

type TransportChangeScenario = {
  transportName: string;
  fare: number;
  passengerCount: number;
  tripMultiplier: number;
  payment: number;
  totalCost: number;
};

const TRANSPORT_CHANGE_LINES = [
  { name: 'バス', fares: [130, 150, 170, 190, 210, 230] },
  { name: '電車', fares: [140, 160, 180, 200, 220, 240, 260] },
  { name: '地下鉄', fares: [150, 170, 190, 210, 230, 250, 270] },
  { name: 'モノレール', fares: [150, 170, 190, 210, 230, 250] },
];

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

export function buildTransportChangeScenarios(grade: Grade): TransportChangeScenario[] {
  const scenarios: TransportChangeScenario[] = [];
  const passengerCounts = grade <= 2 ? [1, 2] : [1, 2, 3];
  const tripMultipliers = grade <= 2 ? [1, 2] : [1, 2];
  const paymentOptions = pickByGrade(grade, {
    lower: [200, 300, 400, 500, 600, 700, 800, 900, 1000],
    middle: [300, 400, 500, 600, 700, 800, 1000, 1200, 1500, 2000],
    upper: [400, 500, 700, 800, 1000, 1200, 1500, 2000, 2500, 3000],
  });
  const seen = new Set<string>();

  TRANSPORT_CHANGE_LINES.forEach((line) => {
    const fareLimit = scaleByGrade(grade, {
      lower: 4,
      middle: 5,
      upper: line.fares.length,
    });
    const fareOptions = line.fares.slice(0, fareLimit);

    fareOptions.forEach((fare) => {
      passengerCounts.forEach((passengers) => {
        tripMultipliers.forEach((tripMultiplier) => {
          if (grade <= 2 && passengers > 1 && tripMultiplier > 1) {
            return;
          }

          const totalCost = fare * passengers * tripMultiplier;
          const viablePayments = paymentOptions.filter(
            (amount) => amount > totalCost
          );
          const fallbackBase = Math.ceil(totalCost / 100) * 100;
          const paymentPool =
            viablePayments.length > 0
              ? viablePayments
              : [fallbackBase + 100, fallbackBase + 200];

          paymentPool.forEach((payment) => {
            const key = `${line.name}-${fare}-${passengers}-${tripMultiplier}-${payment}`;
            if (seen.has(key)) {
              return;
            }
            seen.add(key);
            scenarios.push({
              transportName: line.name,
              fare,
              passengerCount: passengers,
              tripMultiplier,
              payment,
              totalCost,
            });
          });
        });
      });
    });
  });

  return scenarios;
}

function formatTripWord(tripMultiplier: number): string {
  return tripMultiplier === 2 ? '往復' : '片道';
}

function formatPassengerLabel(passengerCount: number): string {
  return passengerCount === 1 ? '1人' : `${passengerCount}人`;
}

/**
 * おつりの計算問題を生成
 * Generate change calculation problems
 */
export function generateTransportChange(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];
  const templates = [
    (scenario: TransportChangeScenario): string => {
      const tripWord = formatTripWord(scenario.tripMultiplier);
      const passengerLabel = formatPassengerLabel(scenario.passengerCount);
      const ticketWord = tripWord === '往復' ? '往復きっぷ' : 'きっぷ';
      return `${scenario.transportName}の${tripWord}きっぷは1人${scenario.fare}円です。${passengerLabel}分の${ticketWord}を${scenario.payment}円で買いました。おつりはいくらですか？`;
    },
    (scenario: TransportChangeScenario): string => {
      const tripWord = formatTripWord(scenario.tripMultiplier);
      const passengerLabel = formatPassengerLabel(scenario.passengerCount);
      const rideText = tripWord === '往復' ? '行きと帰りに' : '片道で';
      return `${passengerLabel}で${scenario.transportName}に${rideText}乗ります。1人${scenario.fare}円のきっぷを${scenario.payment}円で買いました。おつりはいくらですか？`;
    },
  ];
  const scenarioPool = shuffleArray(buildTransportChangeScenarios(grade));

  if (scenarioPool.length === 0) {
    return problems;
  }

  for (let i = 0; i < count; i++) {
    const scenario = scenarioPool[i % scenarioPool.length];
    const template = templates[randomInt(0, templates.length - 1)];
    const problemText = template(scenario);
    const answer = scenario.payment - scenario.totalCost;

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

function shuffleArray<T>(values: T[]): T[] {
  const array = [...values];
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
