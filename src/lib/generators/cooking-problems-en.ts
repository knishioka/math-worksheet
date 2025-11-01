/**
 * 料理の計算問題生成器（英語）
 * Cooking calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { rangeByGrade, randomIntByGrade, scaleByGrade } from './grade-utils';

/**
 * 材料の量の計算問題を生成（英語）
 * Generate ingredient quantity problems (English)
 */
export function generateCookingIngredientsEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  const ingredients = [
    { name: 'sugar', unit: 'g', baseAmount: [50, 100, 150, 200] },
    { name: 'salt', unit: 'g', baseAmount: [5, 10, 15, 20] },
    { name: 'flour', unit: 'g', baseAmount: [200, 250, 300, 400] },
    { name: 'butter', unit: 'g', baseAmount: [50, 75, 100, 125] },
    { name: 'milk', unit: 'mL', baseAmount: [200, 250, 300, 400] },
  ];

  for (let i = 0; i < count; i++) {
    const ingredient = ingredients[randomInt(0, ingredients.length - 1)];
    const baseServings = randomIntByGrade(grade, {
      lower: { min: 2, max: 3 },
      middle: { min: 3, max: 4 },
      upper: { min: 3, max: 5 },
    });
    const targetServings = randomIntByGrade(grade, {
      lower: { min: 4, max: 6 },
      middle: { min: 5, max: 8 },
      upper: { min: 6, max: 10 },
    });
    const amountChoices = ingredient.baseAmount.slice(
      0,
      Math.min(ingredient.baseAmount.length, scaleByGrade(grade, {
        lower: 2,
        middle: 3,
        upper: ingredient.baseAmount.length,
      }))
    );
    const baseAmount = amountChoices[randomInt(0, amountChoices.length - 1)];
    const targetAmount = Math.round((baseAmount * targetServings) / baseServings);

    const problemText = `A recipe for ${baseServings} people uses ${baseAmount}${ingredient.unit} of ${ingredient.name}. How much do you need for ${targetServings} people?`;
    const answer = targetAmount;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: grade >= 4 ? ('multiplication' as Operation) : ('addition' as Operation),
      problemText,
      answer,
      unit: ingredient.unit,
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 調理時間の計算問題を生成（英語）
 * Generate cooking time problems (English)
 */
export function generateCookingTimeEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);
    let problemText: string;
    let answer: number | string;

    if (problemType === 0) {
      // Calculate start time for cooking
      const cookingChoices = grade <= 3 ? [25, 30, 35, 40] : [35, 45, 50, 60];
      const cookingMinutes = cookingChoices[randomInt(0, cookingChoices.length - 1)];
      const targetHourRange = rangeByGrade(grade, {
        lower: { min: 12, max: 16 },
        middle: { min: 13, max: 17 },
        upper: { min: 14, max: 19 },
      });
      const targetHour = randomInt(targetHourRange.min, targetHourRange.max);
      const targetMinute = [0, 30][randomInt(0, 1)]; // 0 or 30 minutes

      let startHour = targetHour;
      let startMinute = targetMinute - cookingMinutes;

      if (startMinute < 0) {
        startMinute += 60;
        startHour -= 1;
      }

      const targetTime = targetMinute === 0 ? `${targetHour}:00` : `${targetHour}:30`;
      const startTime = startMinute === 0 ? `${startHour}:00` : `${startHour}:${startMinute}`;

      problemText = `Baking a cake takes ${cookingMinutes} minutes. You want to eat at ${targetTime}. What time should you start?`;
      answer = startTime;
    } else if (problemType === 1) {
      // Calculate total cooking time
      const prepMinutes = randomIntByGrade(grade, {
        lower: { min: 10, max: 20 },
        middle: { min: 15, max: 30 },
        upper: { min: 20, max: 35 },
      });
      const cookMinutes = randomIntByGrade(grade, {
        lower: { min: 20, max: 40 },
        middle: { min: 30, max: 60 },
        upper: { min: 35, max: 80 },
      });
      const totalMinutes = prepMinutes + cookMinutes;

      problemText = `Preparation takes ${prepMinutes} minutes and cooking takes ${cookMinutes} minutes. What is the total time?`;
      answer = totalMinutes;
    } else {
      // Convert hours to minutes
      const hours = randomIntByGrade(grade, {
        lower: { min: 1, max: 2 },
        middle: { min: 1, max: 3 },
        upper: { min: 2, max: 3 },
      });
      const minutes = randomIntByGrade(grade, {
        lower: { min: 0, max: 20 },
        middle: { min: 0, max: 40 },
        upper: { min: 10, max: 50 },
      });
      const totalMinutes = hours * 60 + minutes;

      const timeStr = minutes === 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
      problemText = `Stewing takes ${timeStr}. How many minutes in total?`;
      answer = totalMinutes;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 2 ? ('multiplication' as Operation) : ('addition' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '' : 'minutes',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 人数分の計算問題を生成（英語）
 * Generate serving size problems (English)
 */
export function generateCookingServingEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Divide equally
      const totalItems = randomIntByGrade(grade, {
        lower: { min: 12, max: 20 },
        middle: { min: 18, max: 28 },
        upper: { min: 24, max: 36 },
      });
      const peopleChoices = grade <= 2 ? [2, 3, 4] : [3, 4, 6, 8];
      const people = peopleChoices[randomInt(0, peopleChoices.length - 1)];
      const perPerson = totalItems / people;

      const items = ['cookies', 'donuts', 'sandwiches', 'muffins'][randomInt(0, 3)];
      problemText = `Share ${totalItems} ${items} equally among ${people} people. How many each?`;
      answer = perPerson;
    } else {
      // Calculate total needed
      const perPerson = randomIntByGrade(grade, {
        lower: { min: 80, max: 200 },
        middle: { min: 120, max: 300 },
        upper: { min: 180, max: 400 },
      });
      const people = randomIntByGrade(grade, {
        lower: { min: 2, max: 4 },
        middle: { min: 3, max: 6 },
        upper: { min: 4, max: 8 },
      });
      const total = perPerson * people;

      const item = ['rice', 'soup'][randomInt(0, 1)];
      const unit = item === 'rice' ? 'g' : 'mL';
      problemText = `Each person needs ${perPerson}${unit} of ${item}. How much for ${people} people?`;
      answer = total;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 0 ? ('division' as Operation) : ('multiplication' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '' : '',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じた料理問題を生成（英語）
 * Generate grade-appropriate cooking problems (English)
 */
export function generateGradeCookingProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'cooking-ingredients-en' | 'cooking-time-en' | 'cooking-serving-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'cooking-ingredients-en':
      return generateCookingIngredientsEn(grade, count);
    case 'cooking-time-en':
      return generateCookingTimeEn(grade, count);
    case 'cooking-serving-en':
      return generateCookingServingEn(grade, count);
    default:
      return generateCookingIngredientsEn(grade, count);
  }
}
