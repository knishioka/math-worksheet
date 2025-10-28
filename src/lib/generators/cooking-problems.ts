/**
 * 料理の計算問題生成器（日本語）
 * Cooking calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 材料の量の計算問題を生成
 * Generate ingredient quantity problems
 */
export function generateCookingIngredients(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  const ingredients = [
    { name: '砂糖', unit: 'g', baseAmount: [20, 30, 40, 50] },
    { name: '塩', unit: 'g', baseAmount: [5, 10, 15, 20] },
    { name: '小麦粉', unit: 'g', baseAmount: [100, 150, 200, 250] },
    { name: 'バター', unit: 'g', baseAmount: [30, 40, 50, 60] },
    { name: '牛乳', unit: 'mL', baseAmount: [100, 150, 200, 250] },
  ];

  for (let i = 0; i < count; i++) {
    const ingredient = ingredients[randomInt(0, ingredients.length - 1)];
    const baseServings = randomInt(2, 4); // 2-4人分
    const targetServings = randomInt(4, 8); // 4-8人分
    const baseAmount = ingredient.baseAmount[randomInt(0, ingredient.baseAmount.length - 1)];
    const targetAmount = Math.round((baseAmount * targetServings) / baseServings);

    const problemText = `${baseServings}人分のレシピで${ingredient.name}が${baseAmount}${ingredient.unit}必要です。${targetServings}人分作るには何${ingredient.unit}必要ですか？`;
    const answer = targetAmount;

    problems.push({
      id: generateId(),
      type: 'word',
      operation: grade >= 4 ? ('multiplication' as Operation) : ('addition' as Operation),
      problemText,
      answer,
      unit: ingredient.unit,
    });
  }

  return problems;
}

/**
 * 調理時間の計算問題を生成
 * Generate cooking time problems
 */
export function generateCookingTime(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);
    let problemText: string;
    let answer: number | string;

    if (problemType === 0) {
      // 調理開始時刻を計算
      const cookingMinutes = [20, 30, 40, 50, 60][randomInt(0, 4)];
      const targetHour = randomInt(12, 18); // 12-18時
      const targetMinute = [0, 30][randomInt(0, 1)]; // 0分または30分

      let startHour = targetHour;
      let startMinute = targetMinute - cookingMinutes;

      if (startMinute < 0) {
        startMinute += 60;
        startHour -= 1;
      }

      problemText = `ケーキを焼くのに${cookingMinutes}分かかります。${targetHour}時${targetMinute === 0 ? 'ちょうど' : '30分'}に食べたいとき、何時何分にオーブンに入れればよいですか？`;
      answer = `${startHour}時${startMinute}分`;
    } else if (problemType === 1) {
      // 合計調理時間を計算
      const prepMinutes = randomInt(10, 30); // 準備10-30分
      const cookMinutes = randomInt(20, 60); // 調理20-60分
      const totalMinutes = prepMinutes + cookMinutes;

      problemText = `料理の準備に${prepMinutes}分、調理に${cookMinutes}分かかります。合計何分かかりますか？`;
      answer = totalMinutes;
    } else {
      // 時間から分への変換
      const hours = randomInt(1, 2); // 1-2時間
      const minutes = randomInt(0, 30); // 0-30分
      const totalMinutes = hours * 60 + minutes;

      problemText = `煮込み料理に${hours}時間${minutes === 0 ? '' : minutes + '分'}かかります。全部で何分ですか？`;
      answer = totalMinutes;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 2 ? ('multiplication' as Operation) : ('addition' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '' : '分',
    });
  }

  return problems;
}

/**
 * 人数分の計算問題を生成
 * Generate serving size problems
 */
export function generateCookingServing(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 均等に分ける
      const totalItems = randomInt(8, 24); // 8-24個
      const people = [2, 3, 4, 6, 8][randomInt(0, 4)]; // 割り切れる数
      const perPerson = totalItems / people;

      const items = ['クッキー', 'ドーナツ', 'おにぎり', 'サンドイッチ'][randomInt(0, 3)];
      problemText = `${totalItems}個の${items}を${people}人で同じ数ずつ分けます。1人何個ずつになりますか？`;
      answer = perPerson;
    } else {
      // 必要な総量を計算
      const perPerson = randomInt(100, 300); // 100-300g/mL
      const people = randomInt(3, 6); // 3-6人
      const total = perPerson * people;

      const item = ['ごはん', 'スープ'][randomInt(0, 1)];
      const unit = item === 'ごはん' ? 'g' : 'mL';
      problemText = `${item}を1人${perPerson}${unit}ずつ${people}人分用意します。全部で何${unit}必要ですか？`;
      answer = total;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 0 ? ('division' as Operation) : ('multiplication' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '個' : '',
    });
  }

  return problems;
}

/**
 * 学年に応じた料理問題を生成
 * Generate grade-appropriate cooking problems
 */
export function generateGradeCookingProblems(
  grade: Grade,
  count: number,
  pattern: 'cooking-ingredients-jap' | 'cooking-time-jap' | 'cooking-serving-jap'
): WordProblem[] {
  switch (pattern) {
    case 'cooking-ingredients-jap':
      return generateCookingIngredients(grade, count);
    case 'cooking-time-jap':
      return generateCookingTime(grade, count);
    case 'cooking-serving-jap':
      return generateCookingServing(grade, count);
    default:
      return generateCookingIngredients(grade, count);
  }
}
