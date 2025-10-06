/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Operation } from '../../../types';

/**
 * Word story problem templates for English
 */

export interface WordStoryTemplate {
  generateProblem: (grade: number) => {
    text: string;
    answer: number;
    operation: Operation;
  };
  minGrade: number;
  maxGrade: number;
  category: 'word-story' | 'comparison';
}

/**
 * Helper function to generate random integer
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Helper function to get random name
 */
function getRandomName(): string {
  const names = [
    'Tom', 'Jen', 'Sam', 'Ann', 'Max', 'Lily', 'Ben', 'Emma',
    'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Zoe', 'Finn', 'Lucy',
  ];
  return names[randomInt(0, names.length - 1)];
}

/**
 * Helper function to get random item
 */
function getRandomItem(plural = false): string {
  const items = [
    { singular: 'apple', plural: 'apples' },
    { singular: 'pencil', plural: 'pencils' },
    { singular: 'book', plural: 'books' },
    { singular: 'toy', plural: 'toys' },
    { singular: 'sticker', plural: 'stickers' },
    { singular: 'marble', plural: 'marbles' },
    { singular: 'cookie', plural: 'cookies' },
    { singular: 'crayon', plural: 'crayons' },
    { singular: 'paper clip', plural: 'paper clips' },
    { singular: 'stamp', plural: 'stamps' },
  ];
  const item = items[randomInt(0, items.length - 1)];
  return plural ? item.plural : item.singular;
}

/**
 * Grade 1-2: Simple addition/subtraction stories
 */
export const SIMPLE_ADDITION_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const initial = randomInt(grade === 1 ? 5 : 10, grade === 1 ? 10 : 50);
      const added = randomInt(2, grade === 1 ? 5 : 20);
      const answer = initial + added;

      return {
        text: `${name} has ${initial} ${item}. ${name === 'Jen' || name === 'Ann' || name === 'Emma' || name === 'Kate' || name === 'Lily' || name === 'Mia' || name === 'Zoe' || name === 'Lucy' ? 'She' : 'He'} gets ${added} more. How many ${item} does ${name === 'Jen' || name === 'Ann' || name === 'Emma' || name === 'Kate' || name === 'Lily' || name === 'Mia' || name === 'Zoe' || name === 'Lucy' ? 'she' : 'he'} have now?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 1,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const initial = randomInt(grade === 1 ? 10 : 15, grade === 1 ? 20 : 100);
      // Ensure removed is less than initial to avoid negative answers
      const maxRemoved = Math.min(grade === 1 ? 5 : 30, initial - 1);
      const removed = randomInt(2, maxRemoved);
      const answer = initial - removed;

      return {
        text: `${name} has ${initial} ${item}. ${name === 'Jen' || name === 'Ann' || name === 'Emma' || name === 'Kate' || name === 'Lily' || name === 'Mia' || name === 'Zoe' || name === 'Lucy' ? 'She' : 'He'} gives away ${removed}. How many ${item} are left?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 1,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 2: Multi-step and categorization problems
 */
export const MULTI_STEP_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: () => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const total = randomInt(15, 30);
      const red = randomInt(3, Math.floor(total / 3));
      const green = randomInt(3, Math.floor(total / 3));
      const answer = red + green;

      return {
        text: `${name} has ${total} ${item}. ${red} of them are red, ${green} are green and the rest are blue. How many red and green ${item} does ${name} have?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 3,
    category: 'word-story',
  },
  {
    generateProblem: () => {
      const name1 = getRandomName();
      const name2 = getRandomName();
      const item = getRandomItem(true);
      const count1 = randomInt(10, 30);
      const count2 = randomInt(5, 15);
      const answer = count1 + count2;

      return {
        text: `${name1} has ${count1} ${item} and ${name2} has ${count2} ${item}. How many ${item} do they have together?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 4,
    category: 'word-story',
  },
];

/**
 * Grade 2-3: Multiplication stories
 */
export const MULTIPLICATION_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const groups = randomInt(2, grade === 2 ? 9 : 12);
      const perGroup = randomInt(2, grade === 2 ? 9 : 12);
      const answer = groups * perGroup;

      return {
        text: `There are ${groups} boxes. Each box has ${perGroup} ${item}. How many ${item} are there in total?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const groups = randomInt(2, grade === 2 ? 9 : 12);
      const perGroup = randomInt(2, grade === 2 ? 9 : 12);
      const answer = groups * perGroup;

      return {
        text: `There are ${groups} groups of ${perGroup} ${item}. How many ${item} are there altogether?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const rows = randomInt(2, grade === 2 ? 9 : 12);
      const cols = randomInt(2, grade === 2 ? 9 : 12);
      const answer = rows * cols;

      return {
        text: `${item.charAt(0).toUpperCase() + item.slice(1)} are arranged in ${rows} rows with ${cols} in each row. How many ${item} are there in total?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const multiplier = randomInt(2, grade === 2 ? 9 : 12);
      const base = randomInt(2, grade === 2 ? 9 : 12);
      const answer = multiplier * base;

      return {
        text: `${name} has ${multiplier} times as many ${item} as ${name === 'Tom' || name === 'Sam' || name === 'Max' || name === 'Ben' || name === 'Jack' || name === 'Leo' || name === 'Noah' || name === 'Finn' ? 'his' : 'her'} friend who has ${base}. How many ${item} does ${name} have?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const perDay = randomInt(2, grade === 2 ? 9 : 12);
      const days = randomInt(2, grade === 2 ? 7 : 10);
      const answer = perDay * days;

      return {
        text: `${name} reads ${perDay} pages every day. How many pages does ${name === 'Tom' || name === 'Sam' || name === 'Max' || name === 'Ben' || name === 'Jack' || name === 'Leo' || name === 'Noah' || name === 'Finn' ? 'he' : 'she'} read in ${days} days?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const price = randomInt(2, grade === 2 ? 9 : 12);
      const quantity = randomInt(2, grade === 2 ? 9 : 12);
      const answer = price * quantity;
      const item = getRandomItem(true);

      return {
        text: `One ${item.replace('s', '')} costs $${price}. How much do ${quantity} ${item} cost?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 3+: Division stories
 */
export const DIVISION_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const groups = randomInt(2, grade === 3 ? 9 : 12);
      const perGroup = randomInt(2, grade === 3 ? 9 : 12);
      const total = groups * perGroup;
      const answer = perGroup;

      return {
        text: `${total} ${item} are shared equally among ${groups} friends. How many ${item} does each friend get?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const perBox = randomInt(2, grade === 3 ? 9 : 12);
      const numBoxes = randomInt(2, grade === 3 ? 9 : 12);
      const total = perBox * numBoxes;
      const answer = numBoxes;

      return {
        text: `There are ${total} ${item}. If you put ${perBox} ${item} in each box, how many boxes do you need?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const perRow = randomInt(2, grade === 3 ? 9 : 12);
      const numRows = randomInt(2, grade === 3 ? 9 : 12);
      const total = perRow * numRows;
      const answer = perRow;

      return {
        text: `${total} ${item} are arranged in ${numRows} equal rows. How many ${item} are in each row?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const totalCost = randomInt(4, grade === 3 ? 72 : 96);
      const numItems = randomInt(2, grade === 3 ? 9 : 12);
      // Ensure division is exact
      const unitPrice = Math.floor(totalCost / numItems);
      const actualTotal = unitPrice * numItems;
      const answer = unitPrice;
      const item = getRandomItem(true);

      return {
        text: `${name} pays $${actualTotal} for ${numItems} ${item}. How much does one ${item.replace('s', '')} cost?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const totalPages = randomInt(12, grade === 3 ? 63 : 84);
      const pagesPerDay = randomInt(2, grade === 3 ? 9 : 12);
      // Ensure division is exact
      const days = Math.floor(totalPages / pagesPerDay);
      const actualTotal = pagesPerDay * days;
      const answer = days;

      return {
        text: `${name} needs to read ${actualTotal} pages. If ${name === 'Tom' || name === 'Sam' || name === 'Max' || name === 'Ben' || name === 'Jack' || name === 'Leo' || name === 'Noah' || name === 'Finn' ? 'he' : 'she'} reads ${pagesPerDay} pages each day, how many days will it take?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const perBag = randomInt(2, grade === 3 ? 9 : 12);
      const numBags = randomInt(2, grade === 3 ? 9 : 12);
      const total = perBag * numBags;
      const answer = perBag;

      return {
        text: `A store has ${total} ${item} packed in ${numBags} bags. Each bag has the same number of ${item}. How many ${item} are in one bag?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 1-2: Number sequence and order problems
 */
export const NUMBER_SEQUENCE_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const target = randomInt(grade === 1 ? 2 : 5, grade === 1 ? 20 : 100);
      const answer = target - 1;

      return {
        text: `What number comes just before ${target}?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 1,
    maxGrade: 3,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const target = randomInt(grade === 1 ? 1 : 5, grade === 1 ? 19 : 99);
      const answer = target + 1;

      return {
        text: `What number comes just after ${target}?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 1,
    maxGrade: 3,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const middle = randomInt(grade === 1 ? 2 : 10, grade === 1 ? 19 : 99);
      const before = middle - 1;
      const answer = middle + 1;

      return {
        text: `${middle} is between ${before} and ___.`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 1,
    maxGrade: 3,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const middle = randomInt(grade === 1 ? 2 : 10, grade === 1 ? 19 : 99);
      const answer = middle - 1;
      const after = middle + 1;

      return {
        text: `${middle} is between ___ and ${after}.`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 1,
    maxGrade: 3,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const start = randomInt(grade === 1 ? 5 : 10, grade === 1 ? 15 : 50);
      const steps = randomInt(1, grade === 1 ? 3 : 5);
      const answer = start + steps;

      return {
        text: `Count ${steps} ${steps === 1 ? 'step' : 'steps'} forward from ${start}. What number do you reach?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 1,
    maxGrade: 3,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const start = randomInt(grade === 1 ? 10 : 15, grade === 1 ? 20 : 50);
      const steps = randomInt(1, grade === 1 ? 3 : 5);
      const answer = start - steps;

      return {
        text: `Count ${steps} ${steps === 1 ? 'step' : 'steps'} backward from ${start}. What number do you reach?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 1,
    maxGrade: 3,
    category: 'word-story',
  },
];

/**
 * Grade 3+: Comparison problems
 */
export const COMPARISON_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getRandomName();
      const item = getRandomItem(true);
      const count1 = randomInt(10, grade >= 5 ? 80 : 40);
      const more = randomInt(5, grade >= 5 ? 60 : 20);
      const answer = count1 + more;

      return {
        text: `${name1} has ${count1} ${item}. ${name2} has ${more} more than ${name1}. How many ${item} does ${name2} have?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'comparison',
  },
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getRandomName();
      const item = getRandomItem(true);
      const count1 = randomInt(20, grade >= 5 ? 100 : 50);
      // Ensure fewer is less than count1 to avoid negative answers
      const maxFewer = Math.min(grade >= 5 ? 30 : 15, count1 - 1);
      const fewer = randomInt(5, maxFewer);
      const answer = count1 - fewer;

      return {
        text: `${name1} has ${count1} ${item}. ${name2} has ${fewer} fewer than ${name1}. How many ${item} does ${name2} have?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'comparison',
  },
];

/**
 * Get appropriate story templates for a grade level
 */
export function getStoriesForGrade(grade: number): WordStoryTemplate[] {
  const stories: WordStoryTemplate[] = [];

  // Add stories appropriate for the grade
  const allStories = [
    ...SIMPLE_ADDITION_STORIES,
    ...NUMBER_SEQUENCE_STORIES,
    ...MULTI_STEP_STORIES,
    ...MULTIPLICATION_STORIES,
    ...DIVISION_STORIES,
    ...COMPARISON_STORIES,
  ];

  allStories.forEach((story) => {
    if (grade >= story.minGrade && grade <= story.maxGrade) {
      stories.push(story);
    }
  });

  return stories;
}
