import type { Grade, Operation, WordProblemEn } from '../../types';
import { generateId, randomInt } from '../utils/math';

type FractionScenario = {
  fraction1Numerator: number;
  fraction1Denominator: number;
  fraction2Numerator: number;
  fraction2Denominator: number;
  lcm: number;
};

function getGradeRange(
  grade: Grade,
  lower: { min: number; max: number },
  middle: { min: number; max: number },
  upper: { min: number; max: number }
): { min: number; max: number } {
  if (grade <= 2) {
    return lower;
  }
  if (grade <= 4) {
    return middle;
  }
  return upper;
}

/**
 * Part-whole and comparison bar model problems.
 */
export function generateSingaporeBarModel(
  grade: Grade,
  count: number
): WordProblemEn[] {
  const problems: WordProblemEn[] = [];
  const names = ['Aiden', 'Maya', 'Noah', 'Emma', 'Liam', 'Zoe'];
  const items = ['stickers', 'marbles', 'books', 'cards', 'erasers'];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    const nameA = names[randomInt(0, names.length - 1)];
    const nameB = names[randomInt(0, names.length - 1)];
    const item = items[randomInt(0, items.length - 1)];

    if (problemType === 0) {
      const totalRange = getGradeRange(
        grade,
        { min: 12, max: 40 },
        { min: 30, max: 120 },
        { min: 80, max: 240 }
      );
      const total = randomInt(totalRange.min, totalRange.max);
      const part = randomInt(5, Math.max(6, total - 4));
      const remaining = total - part;
      const askWhole = randomInt(0, 1) === 1;

      if (askWhole) {
        problems.push({
          id: generateId(),
          type: 'word-en',
          operation: 'addition' as Operation,
          problemText: `A bar model shows ${part} ${item} and ${remaining} ${item}. How many ${item} are there in all?`,
          answer: total,
          category: 'word-story',
          showCalculation: true,
          language: 'en',
        });
      } else {
        problems.push({
          id: generateId(),
          type: 'word-en',
          operation: 'subtraction' as Operation,
          problemText: `In a bar model, ${nameA} has ${total} ${item} in total. ${part} are red. How many are not red?`,
          answer: remaining,
          category: 'word-story',
          showCalculation: true,
          language: 'en',
        });
      }
    } else {
      const smallRange = getGradeRange(
        grade,
        { min: 8, max: 25 },
        { min: 20, max: 90 },
        { min: 60, max: 180 }
      );
      const smaller = randomInt(smallRange.min, smallRange.max);
      const difference = randomInt(3, Math.max(4, Math.floor(smaller * 0.7)));
      const bigger = smaller + difference;
      const askBigger = randomInt(0, 1) === 1;

      if (askBigger) {
        problems.push({
          id: generateId(),
          type: 'word-en',
          operation: 'addition' as Operation,
          problemText: `A comparison bar model shows ${nameB} has ${smaller} ${item}. ${nameA} has ${difference} more than ${nameB}. How many ${item} does ${nameA} have?`,
          answer: bigger,
          category: 'comparison',
          showCalculation: true,
          language: 'en',
        });
      } else {
        problems.push({
          id: generateId(),
          type: 'word-en',
          operation: 'subtraction' as Operation,
          problemText: `A comparison bar model shows ${nameA} has ${bigger} ${item} and ${nameB} has ${smaller} ${item}. How many more ${item} does ${nameA} have?`,
          answer: difference,
          category: 'comparison',
          showCalculation: true,
          language: 'en',
        });
      }
    }
  }

  return problems;
}

/**
 * Number bond decomposition problems.
 */
export function generateSingaporeNumberBond(
  grade: Grade,
  count: number
): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const maxProblemType = grade <= 2 ? 1 : 2;
    const problemType = randomInt(0, maxProblemType);

    if (problemType === 0) {
      const totalRange = getGradeRange(
        grade,
        { min: 10, max: 40 },
        { min: 30, max: 200 },
        { min: 120, max: 500 }
      );
      const total = randomInt(totalRange.min, totalRange.max);
      const part = randomInt(5, Math.max(6, total - 5));
      const missingPart = total - part;

      problems.push({
        id: generateId(),
        type: 'word-en',
        operation: 'subtraction' as Operation,
        problemText: `Use a number bond: ${total} is split into ${part} and ____. What number is missing?`,
        answer: missingPart,
        category: 'missing-number',
        showCalculation: false,
        language: 'en',
      });
      continue;
    }

    if (problemType === 1) {
      const base = getGradeRange(
        grade,
        { min: 10, max: 99 },
        { min: 100, max: 900 },
        { min: 1000, max: 9000 }
      );
      const value = randomInt(base.min, base.max);
      if (grade <= 2) {
        const tens = Math.floor(value / 10) * 10;
        const ones = value % 10;
        problems.push({
          id: generateId(),
          type: 'word-en',
          operation: 'addition' as Operation,
          problemText: `Complete the number bond for ${value}: ${tens} + ____ = ${value}.`,
          answer: ones,
          category: 'missing-number',
          showCalculation: false,
          language: 'en',
        });
      } else {
        const hundreds = Math.floor(value / 100) * 100;
        const tens = Math.floor((value % 100) / 10) * 10;
        const ones = value % 10;
        problems.push({
          id: generateId(),
          type: 'word-en',
          operation: 'addition' as Operation,
          problemText: `Complete the number bond for ${value}: ${hundreds} + ${tens} + ____ = ${value}.`,
          answer: ones,
          category: 'missing-number',
          showCalculation: false,
          language: 'en',
        });
      }
      continue;
    }

    const totalRange = getGradeRange(
      grade,
      { min: 15, max: 60 },
      { min: 50, max: 250 },
      { min: 200, max: 800 }
    );
    const total = randomInt(totalRange.min, totalRange.max);
    const partA = randomInt(5, total - 2);
    const partB = randomInt(1, total - partA - 1);
    const missingPart = total - partA - partB;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'subtraction' as Operation,
      problemText: `A number bond has whole ${total} and parts ${partA}, ${partB}, and ____. Find the missing part.`,
      answer: missingPart,
      category: 'missing-number',
      showCalculation: false,
      language: 'en',
    });
  }

  return problems;
}

/**
 * Multiplication comparison ("times as many") problems.
 */
export function generateSingaporeComparison(
  grade: Grade,
  count: number
): WordProblemEn[] {
  const problems: WordProblemEn[] = [];
  const subjects = ['pencils', 'marbles', 'stickers', 'toy cars', 'notebooks'];
  const names = ['Ryan', 'Chloe', 'Ethan', 'Sofia', 'Lucas', 'Mia'];

  for (let i = 0; i < count; i++) {
    const subject = subjects[randomInt(0, subjects.length - 1)];
    const nameA = names[randomInt(0, names.length - 1)];
    const nameB = names[randomInt(0, names.length - 1)];
    const baseRange = getGradeRange(
      grade,
      { min: 2, max: 9 },
      { min: 4, max: 18 },
      { min: 6, max: 30 }
    );
    const multiplierRange = getGradeRange(
      grade,
      { min: 2, max: 4 },
      { min: 2, max: 6 },
      { min: 3, max: 8 }
    );
    const baseAmount = randomInt(baseRange.min, baseRange.max);
    const multiplier = randomInt(multiplierRange.min, multiplierRange.max);
    const result = baseAmount * multiplier;

    const variant = randomInt(0, 1);
    const text =
      variant === 0
        ? `${nameA} has ${baseAmount} ${subject}. ${nameB} has ${multiplier} times as many as ${nameA}. How many ${subject} does ${nameB} have?`
        : `One box has ${baseAmount} crayons. A big box has ${multiplier} times as many crayons. How many crayons are in the big box?`;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'multiplication' as Operation,
      problemText: text,
      answer: result,
      category: 'comparison',
      showCalculation: true,
      language: 'en',
    });
  }

  return problems;
}

function getFractionScenariosByGrade(grade: Grade): FractionScenario[] {
  if (grade <= 2) {
    return [
      {
        fraction1Numerator: 1,
        fraction1Denominator: 2,
        fraction2Numerator: 1,
        fraction2Denominator: 4,
        lcm: 4,
      },
      {
        fraction1Numerator: 1,
        fraction1Denominator: 3,
        fraction2Numerator: 1,
        fraction2Denominator: 6,
        lcm: 6,
      },
    ];
  }

  if (grade <= 4) {
    return [
      {
        fraction1Numerator: 1,
        fraction1Denominator: 2,
        fraction2Numerator: 1,
        fraction2Denominator: 4,
        lcm: 4,
      },
      {
        fraction1Numerator: 1,
        fraction1Denominator: 3,
        fraction2Numerator: 1,
        fraction2Denominator: 6,
        lcm: 6,
      },
      {
        fraction1Numerator: 2,
        fraction1Denominator: 5,
        fraction2Numerator: 1,
        fraction2Denominator: 5,
        lcm: 5,
      },
    ];
  }

  return [
    {
      fraction1Numerator: 1,
      fraction1Denominator: 2,
      fraction2Numerator: 1,
      fraction2Denominator: 4,
      lcm: 4,
    },
    {
      fraction1Numerator: 1,
      fraction1Denominator: 3,
      fraction2Numerator: 1,
      fraction2Denominator: 6,
      lcm: 6,
    },
    {
      fraction1Numerator: 2,
      fraction1Denominator: 5,
      fraction2Numerator: 1,
      fraction2Denominator: 5,
      lcm: 5,
    },
    {
      fraction1Numerator: 3,
      fraction1Denominator: 8,
      fraction2Numerator: 1,
      fraction2Denominator: 4,
      lcm: 8,
    },
  ];
}

/**
 * Multi-step word problems with fractions.
 */
export function generateSingaporeMultiStep(
  grade: Grade,
  count: number
): WordProblemEn[] {
  const problems: WordProblemEn[] = [];
  const scenarios = getFractionScenariosByGrade(grade);
  const contexts = ['juice', 'rice', 'water', 'fruit slices', 'stickers'];

  for (let i = 0; i < count; i++) {
    const scenario = scenarios[randomInt(0, scenarios.length - 1)];
    const context = contexts[randomInt(0, contexts.length - 1)];
    const multiplierRange = getGradeRange(
      grade,
      { min: 3, max: 8 },
      { min: 5, max: 12 },
      { min: 8, max: 20 }
    );
    const multiplier = randomInt(multiplierRange.min, multiplierRange.max);
    const total = scenario.lcm * multiplier;

    const used1 =
      (total * scenario.fraction1Numerator) / scenario.fraction1Denominator;
    const used2 =
      (total * scenario.fraction2Numerator) / scenario.fraction2Denominator;
    const remaining = total - used1 - used2;

    const problemType = randomInt(0, 1);
    if (problemType === 0) {
      problems.push({
        id: generateId(),
        type: 'word-en',
        operation: 'subtraction' as Operation,
        problemText: `A container has ${total} ${context}. In the morning, ${scenario.fraction1Numerator}/${scenario.fraction1Denominator} is used. In the afternoon, ${scenario.fraction2Numerator}/${scenario.fraction2Denominator} is used. How much ${context} is left?`,
        answer: remaining,
        category: 'word-story',
        showCalculation: true,
        language: 'en',
      });
      continue;
    }

    const groupRange = getGradeRange(
      grade,
      { min: 2, max: 4 },
      { min: 3, max: 6 },
      { min: 4, max: 8 }
    );
    const possibleGroups: number[] = [];
    for (let groups = groupRange.min; groups <= groupRange.max; groups++) {
      if (remaining % groups === 0) {
        possibleGroups.push(groups);
      }
    }
    const groups =
      possibleGroups.length > 0
        ? possibleGroups[randomInt(0, possibleGroups.length - 1)]
        : Math.max(1, remaining);
    const eachShare = remaining / groups;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'division' as Operation,
      problemText: `There are ${total} ${context} in a box. First, ${scenario.fraction1Numerator}/${scenario.fraction1Denominator} of them are used. Then ${scenario.fraction2Numerator}/${scenario.fraction2Denominator} of the whole amount are used. The rest are shared equally among ${groups} students. How many ${context} does each student get?`,
      answer: eachShare,
      category: 'word-story',
      showCalculation: true,
      language: 'en',
    });
  }

  return problems;
}
