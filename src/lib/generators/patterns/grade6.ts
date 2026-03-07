import type {
  FractionProblem,
  WordProblem,
  WorksheetSettings,
} from '../../../types';
import { generateId, randomInt } from '../../utils/math';

// 6年生: 分数×分数
export function generateFracMult(
  _settings: WorksheetSettings,
  count: number
): FractionProblem[] {
  const problems: FractionProblem[] = [];

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  for (let i = 0; i < count; i++) {
    const numerator1 = randomInt(1, 9);
    const denominator1 = randomInt(2, 10);
    const numerator2 = randomInt(1, 9);
    const denominator2 = randomInt(2, 10);

    const answerNum = numerator1 * numerator2;
    const answerDenom = denominator1 * denominator2;

    // 約分
    const g = gcd(answerNum, answerDenom);

    problems.push({
      id: generateId(),
      type: 'fraction',
      operation: 'multiplication',
      numerator1: numerator1,
      denominator1: denominator1,
      numerator2: numerator2,
      denominator2: denominator2,
      answerNumerator: answerNum / g,
      answerDenominator: answerDenom / g,
      simplified: true,
    });
  }

  return problems;
}

// 6年生: 分数÷分数
export function generateFracDiv(
  _settings: WorksheetSettings,
  count: number
): FractionProblem[] {
  const problems: FractionProblem[] = [];

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  for (let i = 0; i < count; i++) {
    const numerator1 = randomInt(1, 9);
    const denominator1 = randomInt(2, 10);
    const numerator2 = randomInt(1, 9);
    const denominator2 = randomInt(2, 10);

    // 分数の除算は逆数をかける
    const answerNum = numerator1 * denominator2;
    const answerDenom = denominator1 * numerator2;

    // 約分
    const g = gcd(answerNum, answerDenom);

    problems.push({
      id: generateId(),
      type: 'fraction',
      operation: 'division',
      numerator1: numerator1,
      denominator1: denominator1,
      numerator2: numerator2,
      denominator2: denominator2,
      answerNumerator: answerNum / g,
      answerDenominator: answerDenom / g,
      simplified: true,
    });
  }

  return problems;
}

// 6年生: 比と比例
export function generateRatioProportion(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  for (let i = 0; i < count; i++) {
    const patternType = randomInt(0, 2);

    if (patternType === 0) {
      // 比を簡単にする
      const factor = randomInt(2, 5);
      const a = randomInt(2, 10) * factor;
      const b = randomInt(2, 10) * factor;
      const g = gcd(a, b);

      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `${a}:${b}をもっとも簡単な整数の比に直すと？`,
        answer: `${a / g}:${b / g}`,
        showCalculation: true,
      });
    } else {
      // 比例式を解く
      const a = randomInt(2, 10);
      const b = randomInt(2, 10);
      const c = randomInt(2, 10);
      const x = (b * c) / a;

      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `${a}:${b} = ${c}:□ の□にあてはまる数は？`,
        answer: x,
        showCalculation: true,
      });
    }
  }

  return problems;
}

// 6年生: 速さ・時間・距離
export function generateSpeedTimeDistance(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 3);

    if (problemType === 0) {
      // 速さを求める（距離÷時間）
      const distance = randomInt(10, 50) * 10; // 100km, 200km...
      const time = randomInt(2, 10); // 2時間, 3時間...
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `${distance}kmを${time}時間で走る車の時速は？`,
        answer: distance / time,
        unit: 'km/時',
        showCalculation: true,
      });
    } else if (problemType === 1) {
      // 時間を求める（距離÷速さ）
      const distance = randomInt(10, 50) * 10;
      const speed = randomInt(40, 80);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `時速${speed}kmで${distance}km走るのにかかる時間は？`,
        answer: Math.round((distance / speed) * 10) / 10,
        unit: '時間',
        showCalculation: true,
      });
    } else {
      // 距離を求める（速さ×時間）
      const speed = randomInt(40, 80);
      const time = randomInt(2, 8);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `時速${speed}kmで${time}時間走ったときの距離は？`,
        answer: speed * time,
        unit: 'km',
        showCalculation: true,
      });
    }
  }

  return problems;
}

// 6年生: 複雑な計算
export function generateComplexCalc(
  _settings: WorksheetSettings,
  count: number
): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const patternType = randomInt(0, 3);

    if (patternType === 0) {
      // 四則混合（整数）
      const a = randomInt(10, 50);
      const b = randomInt(2, 10);
      const c = randomInt(5, 20);
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'addition',
        problemText: `${a} + ${b} × ${c} = ？`,
        answer: a + b * c,
        showCalculation: true,
      });
    } else if (patternType === 1) {
      // 割合の応用問題
      const original = randomInt(5, 20) * 100;
      const percent = randomInt(2, 4) * 10;
      const discounted = (original * (100 - percent)) / 100;
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'multiplication',
        problemText: `${original}円の商品を${percent}%引きで買うと何円？`,
        answer: discounted,
        unit: '円',
        showCalculation: true,
      });
    } else {
      // 単位の変換を含む問題
      const meters = randomInt(2, 20) * 100;
      const minutes = randomInt(2, 10);
      const speedMPerMin = meters / minutes;
      const speedKmPerHour = (speedMPerMin * 60) / 1000;
      problems.push({
        id: generateId(),
        type: 'word',
        operation: 'division',
        problemText: `${meters}mを${minutes}分で歩く人の時速は？`,
        answer: Math.round(speedKmPerHour * 10) / 10,
        unit: 'km/時',
        showCalculation: true,
      });
    }
  }

  return problems;
}
