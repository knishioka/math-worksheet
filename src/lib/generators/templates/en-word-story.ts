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

const WORD_STORY_NAMES = [
  'Tom',
  'Jen',
  'Sam',
  'Ann',
  'Max',
  'Lily',
  'Ben',
  'Emma',
  'Jack',
  'Kate',
  'Leo',
  'Mia',
  'Noah',
  'Zoe',
  'Finn',
  'Lucy',
] as const;

/**
 * Helper function to get random name
 */
function getRandomName(): string {
  return WORD_STORY_NAMES[randomInt(0, WORD_STORY_NAMES.length - 1)];
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

const COLLECTION_ITEMS = [
  'stickers',
  'trading cards',
  'photos',
  'postcards',
  'coins',
  'stamps',
] as const;

function getRandomCollectionItem(): string {
  return COLLECTION_ITEMS[randomInt(0, COLLECTION_ITEMS.length - 1)];
}

const FEMALE_NAMES = new Set([
  'Jen',
  'Ann',
  'Lily',
  'Emma',
  'Kate',
  'Mia',
  'Zoe',
  'Lucy',
]);

function isFemaleName(name: string): boolean {
  return FEMALE_NAMES.has(name);
}

function getSubjectPronoun(name: string): 'He' | 'She' {
  return isFemaleName(name) ? 'She' : 'He';
}

function getLowerSubjectPronoun(name: string): 'he' | 'she' {
  return isFemaleName(name) ? 'she' : 'he';
}

function getPossessivePronoun(name: string): 'his' | 'her' {
  return isFemaleName(name) ? 'her' : 'his';
}

function getPronouns(name: string): {
  subject: 'He' | 'She';
  lowerSubject: 'he' | 'she';
  possessive: 'his' | 'her';
} {
  return {
    subject: getSubjectPronoun(name),
    lowerSubject: getLowerSubjectPronoun(name),
    possessive: getPossessivePronoun(name),
  };
}

interface GradeRangeBand {
  upTo: number;
  min: number;
  max: number;
}

function selectGradeRange(
  grade: number,
  bands: GradeRangeBand[],
  fallback: GradeRangeBand
): [number, number] {
  const band = bands.find((candidate) => grade <= candidate.upTo) ?? fallback;
  return [band.min, band.max];
}

function gradeRandomInt(
  grade: number,
  bands: GradeRangeBand[],
  fallback: GradeRangeBand
): number {
  const [min, max] = selectGradeRange(grade, bands, fallback);
  return randomInt(min, max);
}

function generateFriendlyPayment(price: number, maxPaid: number): number {
  const candidates = new Set<number>();
  const addCandidate = (value: number) => {
    if (value > price && value <= maxPaid) {
      candidates.add(value);
    }
  };

  const nextMultipleOfFive = Math.ceil(price / 5) * 5;
  addCandidate(nextMultipleOfFive);

  addCandidate(price + 5);

  const nextMultipleOfTen = Math.ceil(price / 10) * 10;
  if (nextMultipleOfTen - price <= 5) {
    addCandidate(nextMultipleOfTen);
  }

  const nextMultipleOfTwenty = Math.ceil(price / 20) * 20;
  if (nextMultipleOfTwenty - price <= 10) {
    addCandidate(nextMultipleOfTwenty);
  }

  [50, 100].forEach((bill) => {
    if (bill >= price && bill - price <= 30) {
      addCandidate(bill);
    }
  });

  if (candidates.size === 0) {
    addCandidate(Math.min(maxPaid, price + 5));
  }

  const options = Array.from(candidates);
  return options[randomInt(0, options.length - 1)];
}

function getDifferentName(exclude: string | string[]): string {
  const excludedNames = Array.isArray(exclude) ? exclude : [exclude];
  if (excludedNames.length >= WORD_STORY_NAMES.length) {
    throw new Error('Cannot select a unique name: all names are excluded');
  }
  const excludedSet = new Set(excludedNames);

  let name = getRandomName();
  while (excludedSet.has(name)) {
    name = getRandomName();
  }
  return name;
}

/**
 * Grade 1-2: Simple addition/subtraction stories
 */
export const SIMPLE_ADDITION_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const pronouns = getPronouns(name);
      const initial = gradeRandomInt(
        grade,
        [
          { upTo: 1, min: 5, max: 12 },
          { upTo: 3, min: 12, max: 45 },
          { upTo: 5, min: 20, max: 90 },
        ],
        { upTo: 6, min: 30, max: 150 }
      );
      const added = gradeRandomInt(
        grade,
        [
          { upTo: 1, min: 2, max: 8 },
          { upTo: 3, min: 5, max: 20 },
          { upTo: 5, min: 8, max: 35 },
        ],
        { upTo: 6, min: 10, max: 60 }
      );
      const answer = initial + added;

      return {
        text: `${name} has ${initial} ${item}. ${pronouns.subject} gets ${added} more. How many ${item} does ${pronouns.lowerSubject} have now?`,
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
      const pronouns = getPronouns(name);
      const initial = gradeRandomInt(
        grade,
        [
          { upTo: 1, min: 10, max: 18 },
          { upTo: 3, min: 18, max: 55 },
          { upTo: 5, min: 30, max: 110 },
        ],
        { upTo: 6, min: 45, max: 160 }
      );
      const removedUpperBound = gradeRandomInt(
        grade,
        [
          { upTo: 1, min: 2, max: 6 },
          { upTo: 3, min: 5, max: 25 },
          { upTo: 5, min: 10, max: 40 },
        ],
        { upTo: 6, min: 12, max: 60 }
      );
      const maxRemoved = Math.min(removedUpperBound, initial - 1);
      const removed = randomInt(2, Math.max(2, maxRemoved));
      const answer = initial - removed;

      return {
        text: `${name} has ${initial} ${item}. ${pronouns.subject} gives away ${removed}. How many ${item} are left?`,
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
 * Grade 2-4: Multi-step and categorization problems
 */
export const MULTI_STEP_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const total = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 18, max: 36 },
          { upTo: 3, min: 24, max: 50 },
          { upTo: 4, min: 28, max: 60 },
        ],
        { upTo: 6, min: 36, max: 90 }
      );
      const red = randomInt(
        Math.max(3, Math.floor(total * 0.2)),
        Math.max(4, Math.floor(total * 0.35))
      );
      const green = randomInt(
        Math.max(3, Math.floor(total * 0.2)),
        Math.max(4, Math.floor(total * 0.35))
      );
      const answer = red + green;

      return {
        text: `${name} has ${total} ${item}. ${red} of them are red, ${green} are green and the rest are blue. How many red and green ${item} does ${name} have?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 4,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getDifferentName(name1);
      const item = getRandomItem(true);
      const count1 = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 14, max: 32 },
          { upTo: 3, min: 18, max: 48 },
          { upTo: 4, min: 22, max: 60 },
        ],
        { upTo: 6, min: 28, max: 90 }
      );
      const count2 = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 8, max: 18 },
          { upTo: 3, min: 10, max: 25 },
          { upTo: 4, min: 12, max: 30 },
        ],
        { upTo: 6, min: 14, max: 36 }
      );
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
      const pronouns = getPronouns(name);
      const friendName = getDifferentName(name);
      const friendPronouns = getPronouns(friendName);
      const multiplier = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 7 },
          { upTo: 4, min: 3, max: 9 },
        ],
        { upTo: 6, min: 4, max: 12 }
      );
      const base = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 4, min: 3, max: 12 },
        ],
        { upTo: 6, min: 4, max: 14 }
      );
      const answer = multiplier * base;

      return {
        text: `${name} has ${multiplier} times as many ${item} as ${friendPronouns.possessive} friend ${friendName}, who has ${base}. How many ${item} does ${pronouns.lowerSubject} have?`,
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
      const pronouns = getPronouns(name);
      const perDay = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 2, max: 6 },
          { upTo: 4, min: 4, max: 10 },
        ],
        { upTo: 6, min: 5, max: 14 }
      );
      const days = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 2, max: 6 },
          { upTo: 4, min: 3, max: 8 },
        ],
        { upTo: 6, min: 4, max: 12 }
      );
      const answer = perDay * days;

      return {
        text: `${name} reads ${perDay} pages every day. How many pages does ${pronouns.lowerSubject} read in ${days} days?`,
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
      const pronouns = getPronouns(name);
      const totalCost = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 24, max: 72 },
          { upTo: 4, min: 32, max: 96 },
        ],
        { upTo: 6, min: 40, max: 144 }
      );
      const numItems = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 5, min: 3, max: 10 },
        ],
        { upTo: 6, min: 4, max: 12 }
      );
      // Ensure division is exact
      const unitPrice = Math.floor(totalCost / numItems);
      const actualTotal = unitPrice * numItems;
      const answer = unitPrice;
      const item = getRandomItem(true);

      return {
        text: `${name} pays $${actualTotal} for ${numItems} ${item}. How much does one ${item.replace('s', '')} cost for ${pronouns.lowerSubject}?`,
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
      const pronouns = getPronouns(name);
      const totalPages = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 18, max: 63 },
          { upTo: 4, min: 30, max: 84 },
        ],
        { upTo: 6, min: 42, max: 120 }
      );
      const pagesPerDay = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 4, min: 3, max: 10 },
        ],
        { upTo: 6, min: 4, max: 12 }
      );
      // Ensure division is exact
      const days = Math.floor(totalPages / pagesPerDay);
      const actualTotal = pagesPerDay * days;
      const answer = days;

      return {
        text: `${name} needs to read ${actualTotal} pages. If ${pronouns.lowerSubject} reads ${pagesPerDay} pages each day, how many days will it take?`,
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
 * These are basic problems suitable only for grades 1-2
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
    maxGrade: 1,
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
    maxGrade: 1,
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
    maxGrade: 1,
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
    maxGrade: 1,
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
    maxGrade: 1,
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
    maxGrade: 1,
    category: 'word-story',
  },
];

/**
 * Grade 2: Context-rich addition and subtraction stories
 */
export const SECOND_GRADE_CONTEXT_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: () => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const morning = randomInt(14, 35);
      const afternoon = randomInt(9, 28);
      const answer = morning + afternoon;

      return {
        text: `${name} collected ${morning} ${item} in the morning and ${afternoon} more in the afternoon. How many ${item} did ${getLowerSubjectPronoun(name)} collect in total?`,
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
      const name = getRandomName();
      const item = getRandomItem(true);
      const startAmount = randomInt(32, 68);
      const givenAway = randomInt(8, Math.max(10, Math.floor(startAmount / 2)));
      const received = randomInt(5, 18);
      const answer = startAmount - givenAway + received;

      return {
        text: `${name} had ${startAmount} ${item}. ${getSubjectPronoun(name)} gave ${givenAway} to a friend and then got ${received} more. How many ${item} does ${getLowerSubjectPronoun(name)} have now?`,
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
      const name = getRandomName();
      const otherName = getDifferentName(name);
      const totalStudents = randomInt(24, 40);
      const busOne = randomInt(12, totalStudents - 8);
      const busTwo = totalStudents - busOne;
      const moved = randomInt(3, Math.min(8, busTwo - 2));
      const answer = busOne + moved;

      return {
        text: `${name}'s class of ${totalStudents} takes two buses. ${busOne} ride bus A with ${name}, ${busTwo} ride bus B with ${otherName}. Then ${moved} move to bus A. How many are on bus A now?`,
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
      const name = getRandomName();
      const subjectPronoun = getSubjectPronoun(name);
      const possessivePronoun = getPossessivePronoun(name);
      const booksStart = randomInt(28, 60);
      const borrowed = randomInt(9, Math.min(24, booksStart - 5));
      const returned = randomInt(4, 12);
      const answer = booksStart - borrowed + returned;

      return {
        text: `${name} sorted ${booksStart} library books. ${subjectPronoun} lent ${borrowed} books to classmates. Later ${returned} books came back. How many books stay on ${possessivePronoun} shelf now?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 3,
    category: 'word-story',
  },
];

/**
 * Grade 2-5: Time problems
 */
export const TIME_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const startHour = randomInt(8, 15);
      const duration = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 1, max: 3 },
          { upTo: 4, min: 1, max: 4 },
        ],
        { upTo: 5, min: 2, max: 5 }
      );
      const answer = startHour + duration;

      return {
        text: `${name} starts playing at ${startHour}:00. ${pronouns.subject} plays for ${duration} ${duration === 1 ? 'hour' : 'hours'}. What time does ${pronouns.lowerSubject} finish?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const startMinute = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 10, max: 30 },
          { upTo: 4, min: 12, max: 40 },
        ],
        { upTo: 5, min: 15, max: 50 }
      );
      const duration = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 5, max: 15 },
          { upTo: 4, min: 8, max: 20 },
        ],
        { upTo: 5, min: 10, max: 30 }
      );
      const answer = startMinute + duration;

      return {
        text: `${name} starts homework at ${startMinute} minutes past the hour. It takes ${duration} minutes. How many minutes past the hour does ${pronouns.lowerSubject} finish?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const activity = ['a movie', 'a game', 'practice', 'class'][randomInt(0, 3)];
      const duration = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 30, max: 75 },
          { upTo: 4, min: 40, max: 100 },
        ],
        { upTo: 5, min: 55, max: 130 }
      );
      const passed = randomInt(
        Math.max(10, Math.floor(duration * 0.25)),
        Math.max(12, duration - Math.max(12, Math.floor(duration * 0.3)))
      );
      const answer = duration - passed;

      return {
        text: `${activity.charAt(0).toUpperCase() + activity.slice(1)} lasts ${duration} minutes. ${passed} minutes have passed. How many minutes are left?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const timePerTask = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 5, max: 15 },
          { upTo: 4, min: 6, max: 18 },
        ],
        { upTo: 5, min: 8, max: 22 }
      );
      const numTasks = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 3, max: 5 },
        ],
        { upTo: 5, min: 4, max: 6 }
      );
      const answer = timePerTask * numTasks;

      return {
        text: `${name} does ${numTasks} homework tasks. Each task takes ${timePerTask} minutes. How many minutes does ${pronouns.lowerSubject} spend on homework?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const totalMinutes = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 36, max: 72 },
          { upTo: 4, min: 50, max: 110 },
        ],
        { upTo: 5, min: 60, max: 150 }
      );
      const numPeople = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 3, max: 5 },
        ],
        { upTo: 5, min: 4, max: 6 }
      );
      // Ensure division is exact
      const minutesEach = Math.floor(totalMinutes / numPeople);
      const actualTotal = minutesEach * numPeople;
      const answer = minutesEach;

      return {
        text: `${numPeople} friends share ${actualTotal} minutes of play time equally. How many minutes does each friend get?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
];

/**
 * Grade 2-5: Money problems
 */
export const MONEY_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const price = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 5, max: 30 },
          { upTo: 3, min: 8, max: 45 },
        ],
        { upTo: 5, min: 12, max: 75 }
      );
      const paidUpperBound = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: price + 5, max: Math.max(price + 10, 40) },
          { upTo: 3, min: price + 5, max: Math.max(price + 20, 70) },
        ],
        { upTo: 5, min: price + 5, max: Math.max(price + 30, 100) }
      );
      const paid = generateFriendlyPayment(price, Math.max(paidUpperBound, price + 5));
      const answer = paid - price;

      return {
        text: `${name} buys a toy for $${price}. ${pronouns.subject} pays with $${paid}. How much change does ${pronouns.lowerSubject} get?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const saved = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 10, max: 35 },
          { upTo: 3, min: 15, max: 60 },
        ],
        { upTo: 5, min: 20, max: 90 }
      );
      const earned = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 5, max: 15 },
          { upTo: 3, min: 8, max: 25 },
        ],
        { upTo: 5, min: 10, max: 35 }
      );
      const answer = saved + earned;

      return {
        text: `${name} has $${saved} saved. ${pronouns.subject} earns $${earned} more. How much money does ${pronouns.lowerSubject} have now?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = ['notebooks', 'pencils', 'erasers', 'rulers'][randomInt(0, 3)];
      const price = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 4, min: 3, max: 10 },
        ],
        { upTo: 5, min: 4, max: 12 }
      );
      const quantity = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 6 },
          { upTo: 4, min: 3, max: 7 },
        ],
        { upTo: 5, min: 4, max: 9 }
      );
      const answer = price * quantity;

      return {
        text: `Each ${item.replace('s', '')} costs $${price}. How much do ${quantity} ${item} cost in total?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const weeklyAmount = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 5, max: 12 },
          { upTo: 3, min: 6, max: 15 },
        ],
        { upTo: 5, min: 8, max: 22 }
      );
      const weeks = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 2, max: 4 },
          { upTo: 3, min: 2, max: 5 },
        ],
        { upTo: 5, min: 3, max: 6 }
      );
      const answer = weeklyAmount * weeks;

      return {
        text: `${name} gets $${weeklyAmount} allowance each week. How much does ${pronouns.lowerSubject} get in ${weeks} weeks?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const totalCost = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 24, max: 60 },
          { upTo: 4, min: 30, max: 80 },
        ],
        { upTo: 5, min: 40, max: 100 }
      );
      const numFriends = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 3, max: 6 },
        ],
        { upTo: 5, min: 4, max: 6 }
      );
      // Ensure division is exact
      const costEach = Math.floor(totalCost / numFriends);
      const actualTotal = costEach * numFriends;
      const answer = costEach;

      return {
        text: `${numFriends} friends share the cost of a gift that costs $${actualTotal}. How much does each friend pay?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
];

/**
 * Grade 2-5: Measurement and distance problems
 */
export const MEASUREMENT_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const distance1 = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 10, max: 40 },
          { upTo: 3, min: 15, max: 60 },
        ],
        { upTo: 5, min: 20, max: 120 }
      );
      const distance2 = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 5, max: 20 },
          { upTo: 3, min: 8, max: 40 },
        ],
        { upTo: 5, min: 12, max: 90 }
      );
      const answer = distance1 + distance2;

      return {
        text: `${name} walks ${distance1} meters to school and then ${distance2} meters more to the library. How many meters does ${pronouns.lowerSubject} walk in total?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getDifferentName(name1);
      const height1 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 100, max: 135 },
          { upTo: 4, min: 115, max: 150 },
        ],
        { upTo: 5, min: 125, max: 170 }
      );
      const difference = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 6, max: 18 },
          { upTo: 4, min: 8, max: 24 },
        ],
        { upTo: 5, min: 10, max: 30 }
      );
      const answer = height1 - difference;

      return {
        text: `${name1} is ${height1} cm tall. ${name2} is ${difference} cm shorter than ${name1}. How tall is ${name2}?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = ['rope', 'ribbon', 'string', 'wire'][randomInt(0, 3)];
      const lengthEach = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 6, max: 22 },
          { upTo: 4, min: 10, max: 28 },
        ],
        { upTo: 5, min: 12, max: 36 }
      );
      const numPieces = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 3, max: 6 },
        ],
        { upTo: 5, min: 4, max: 8 }
      );
      const answer = lengthEach * numPieces;

      return {
        text: `There are ${numPieces} pieces of ${item}. Each piece is ${lengthEach} cm long. What is the total length of all pieces?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = ['water', 'juice', 'milk', 'paint'][randomInt(0, 3)];
      const totalML = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 180, max: 360 },
          { upTo: 3, min: 240, max: 720 },
        ],
        { upTo: 5, min: 400, max: 2000 }
      );
      const numContainers = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 3, max: 6 },
          { upTo: 3, min: 3, max: 8 },
        ],
        { upTo: 5, min: 4, max: 10 }
      );
      // Ensure division is exact
      const mlEach = Math.floor(totalML / numContainers);
      const actualTotal = mlEach * numContainers;
      const answer = mlEach;

      return {
        text: `${actualTotal} ml of ${item} is poured equally into ${numContainers} containers. How much ${item} is in each container?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
];

/**
 * Grade 3-6: Mixed operation problems
 */
export const MIXED_OPERATION_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const pronouns = getPronouns(name);
      const boxCount = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 2, max: 5 },
          { upTo: 5, min: 3, max: 7 },
        ],
        { upTo: 6, min: 4, max: 8 }
      );
      const perBox = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 3, max: 8 },
          { upTo: 5, min: 4, max: 10 },
        ],
        { upTo: 6, min: 5, max: 12 }
      );
      const extra = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 2, max: 12 },
          { upTo: 5, min: 4, max: 16 },
        ],
        { upTo: 6, min: 6, max: 24 }
      );
      const answer = boxCount * perBox + extra;

      return {
        text: `${name} has ${boxCount} boxes with ${perBox} ${item} in each box, plus ${extra} extra ${item}. How many ${item} does ${pronouns.lowerSubject} have in total?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const pronouns = getPronouns(name);
      const groups = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 2, max: 4 },
          { upTo: 5, min: 3, max: 5 },
        ],
        { upTo: 6, min: 3, max: 6 }
      );
      const perGroup = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 3, max: 8 },
          { upTo: 5, min: 4, max: 10 },
        ],
        { upTo: 6, min: 5, max: 12 }
      );
      const given = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 2, max: 10 },
          { upTo: 5, min: 3, max: 14 },
        ],
        { upTo: 6, min: 4, max: 18 }
      );
      const answer = groups * perGroup - given;

      return {
        text: `${name} makes ${groups} groups of ${perGroup} ${item}. ${pronouns.subject} gives away ${given} ${item}. How many ${item} does ${pronouns.lowerSubject} have left?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const price = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 3, max: 9 },
          { upTo: 5, min: 4, max: 11 },
        ],
        { upTo: 6, min: 5, max: 12 }
      );
      const quantity = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 2, max: 6 },
          { upTo: 5, min: 3, max: 7 },
        ],
        { upTo: 6, min: 3, max: 8 }
      );
      const totalCost = price * quantity;
      const paidUpperBound =
        Math.ceil(totalCost / 10) * 10 +
        gradeRandomInt(
          grade,
          [
            { upTo: 4, min: 5, max: 15 },
            { upTo: 5, min: 8, max: 18 },
          ],
          { upTo: 6, min: 10, max: 20 }
        );
      const paid = generateFriendlyPayment(
        totalCost,
        Math.max(paidUpperBound, totalCost + 5)
      );
      const answer = paid - totalCost;

      return {
        text: `${name} buys ${quantity} items at $${price} each. ${pronouns.subject} pays with $${paid}. How much change does ${pronouns.lowerSubject} get?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const item = getRandomItem(true);
      const pronouns = getPronouns(name);
      const initial = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 20, max: 50 },
          { upTo: 5, min: 30, max: 70 },
        ],
        { upTo: 6, min: 40, max: 90 }
      );
      const groups = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 2, max: 4 },
          { upTo: 5, min: 3, max: 5 },
        ],
        { upTo: 6, min: 4, max: 6 }
      );
      // Ensure division is exact
      const given = Math.floor(initial / groups);
      const actualInitial = given * groups;
      const left = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 2, max: 10 },
          { upTo: 5, min: 3, max: 12 },
        ],
        { upTo: 6, min: 4, max: 15 }
      );
      const totalGiven = actualInitial - left;
      const answer = totalGiven / groups;

      return {
        text: `${name} had ${actualInitial} ${item}. After giving ${groups} friends equal amounts, ${pronouns.subject} has ${left} left. How many ${item} did each friend get?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 2+: Comparison problems (expanded)
 */
export const COMPARISON_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getDifferentName(name1);
      const item = getRandomItem(true);
      const count1 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 12, max: 36 },
          { upTo: 4, min: 20, max: 50 },
        ],
        { upTo: 6, min: 28, max: 90 }
      );
      const more = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 5, max: 18 },
          { upTo: 4, min: 8, max: 24 },
        ],
        { upTo: 6, min: 10, max: 36 }
      );
      const answer = count1 + more;

      return {
        text: `${name1} has ${count1} ${item}. ${name2} has ${more} more than ${name1}. How many ${item} does ${name2} have?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'comparison',
  },
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getDifferentName(name1);
      const item = getRandomItem(true);
      const count1 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 24, max: 60 },
          { upTo: 4, min: 28, max: 80 },
        ],
        { upTo: 6, min: 36, max: 120 }
      );
      const maxFewer = Math.min(
        gradeRandomInt(
          grade,
          [
            { upTo: 3, min: 8, max: 18 },
            { upTo: 4, min: 10, max: 24 },
          ],
          { upTo: 6, min: 12, max: 36 }
        ),
        count1 - 1
      );
      const fewer = randomInt(5, Math.max(5, maxFewer));
      const answer = count1 - fewer;

      return {
        text: `${name1} has ${count1} ${item}. ${name2} has ${fewer} fewer than ${name1}. How many ${item} does ${name2} have?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'comparison',
  },
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getDifferentName(name1);
      const item = getRandomItem(true);
      const count2 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 10, max: 32 },
          { upTo: 4, min: 16, max: 45 },
        ],
        { upTo: 6, min: 22, max: 70 }
      );
      const more = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 5, max: 16 },
          { upTo: 4, min: 8, max: 22 },
        ],
        { upTo: 6, min: 10, max: 32 }
      );
      const answer = count2 + more;

      return {
        text: `${name2} has ${count2} ${item}. ${name1} has ${more} more ${item} than ${name2}. How many ${item} does ${name1} have?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'comparison',
  },
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getDifferentName(name1);
      const item = getRandomItem(true);
      const count1 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 18, max: 48 },
          { upTo: 4, min: 24, max: 70 },
        ],
        { upTo: 6, min: 30, max: 110 }
      );
      const count2 = randomInt(10, count1 - 5);
      const answer = count1 - count2;

      return {
        text: `${name1} has ${count1} ${item} and ${name2} has ${count2} ${item}. How many more ${item} does ${name1} have than ${name2}?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'comparison',
  },
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getDifferentName(name1);
      const name3 = getDifferentName([name1, name2]);
      const item = getRandomItem(true);
      const count1 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 12, max: 30 },
          { upTo: 4, min: 18, max: 42 },
        ],
        { upTo: 6, min: 24, max: 60 }
      );
      const count2 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 10, max: 26 },
          { upTo: 4, min: 14, max: 36 },
        ],
        { upTo: 6, min: 20, max: 52 }
      );
      const count3 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 8, max: 22 },
          { upTo: 4, min: 12, max: 30 },
        ],
        { upTo: 6, min: 16, max: 44 }
      );
      const answer = count1 + count2 + count3;

      return {
        text: `${name1} has ${count1} ${item}, ${name2} has ${count2}, and ${name3} has ${count3}. How many ${item} do they have in total?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'comparison',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const containers = ['basket', 'box', 'bag', 'jar'] as const;
      const container1 = containers[randomInt(0, containers.length - 1)];
      let container2 = containers[randomInt(0, containers.length - 1)];
      while (container2 === container1) {
        container2 = containers[randomInt(0, containers.length - 1)];
      }
      const count1 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 14, max: 36 },
          { upTo: 4, min: 20, max: 60 },
        ],
        { upTo: 6, min: 26, max: 90 }
      );
      const count2 = randomInt(8, count1 - 4);
      const answer = count1 - count2;

      return {
        text: `There are ${count1} ${item} in a ${container1} and ${count2} ${item} in a ${container2}. How many more ${item} are in the ${container1} than in the ${container2}?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'comparison',
  },
];

/**
 * Grade 2+: Pattern and sequence problems (NEW)
 */
export const PATTERN_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const start = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 12 },
          { upTo: 4, min: 5, max: 24 },
        ],
        { upTo: 6, min: 8, max: 40 }
      );
      const step = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 6 },
          { upTo: 4, min: 3, max: 9 },
        ],
        { upTo: 6, min: 4, max: 12 }
      );
      const numSteps = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 3 },
          { upTo: 4, min: 3, max: 4 },
        ],
        { upTo: 6, min: 4, max: 5 }
      );
      const answer = start + step * numSteps;

      return {
        text: `A pattern starts at ${start} and goes up by ${step} each time: ${start}, ${start + step}, ${start + step * 2}, ... What is the number after ${numSteps} steps?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const total = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 24, max: 48 },
          { upTo: 4, min: 36, max: 80 },
        ],
        { upTo: 6, min: 48, max: 120 }
      );
      const step = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 6 },
          { upTo: 4, min: 3, max: 9 },
        ],
        { upTo: 6, min: 4, max: 12 }
      );
      const current = randomInt(step * 2, total - step * 2);
      const answer = current + step;

      return {
        text: `A number pattern goes from 0 to ${total} by ${step}s. What comes after ${current}?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 2+: Shape and geometry problems (NEW)
 */
export const GEOMETRY_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const numShapes = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 3, max: 6 },
        ],
        { upTo: 6, min: 4, max: 8 }
      );
      const sidesPerShape = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 3, max: 4 },
          { upTo: 4, min: 3, max: 6 },
        ],
        { upTo: 6, min: 4, max: 8 }
      );
      const answer = numShapes * sidesPerShape;

      const shapeName = sidesPerShape === 3 ? 'triangle' : sidesPerShape === 4 ? 'square' : sidesPerShape === 5 ? 'pentagon' : 'hexagon';
      const plural = numShapes === 1 ? shapeName : shapeName + 's';

      return {
        text: `There are ${numShapes} ${plural}. How many sides are there in total?`,
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
      const length = randomInt(grade <= 3 ? 5 : 10, grade <= 3 ? 15 : 25);
      const width = randomInt(grade <= 3 ? 3 : 8, grade <= 3 ? 12 : 20);
      const answer = (length + width) * 2;

      return {
        text: `A rectangle is ${length} cm long and ${width} cm wide. What is the perimeter?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const side = randomInt(grade <= 3 ? 5 : 8, grade <= 3 ? 12 : 18);
      const answer = side * 4;

      return {
        text: `Each side of a square is ${side} cm. What is the perimeter of the square?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 2+: Collection and grouping problems (NEW)
 */
export const COLLECTION_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const days = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 3, max: 6 },
        ],
        { upTo: 6, min: 4, max: 7 }
      );
      const perDay = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 4, min: 3, max: 10 },
        ],
        { upTo: 6, min: 4, max: 12 }
      );
      const answer = days * perDay;

      return {
        text: `${name} collects ${perDay} shells every day. How many shells does ${pronouns.lowerSubject} have after ${days} days?`,
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
      const shelves = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 3, max: 6 },
        ],
        { upTo: 6, min: 4, max: 8 }
      );
      const perShelf = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 6, max: 14 },
          { upTo: 4, min: 8, max: 18 },
        ],
        { upTo: 6, min: 10, max: 24 }
      );
      const answer = shelves * perShelf;

      return {
        text: `A library has ${shelves} shelves. Each shelf holds ${perShelf} ${item}. How many ${item} are there in total?`,
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
      const total = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 24, max: 60 },
          { upTo: 4, min: 36, max: 90 },
        ],
        { upTo: 6, min: 48, max: 120 }
      );
      const redPercent = randomInt(20, 50);
      const red = Math.floor(total * redPercent / 100);
      const answer = total - red;

      return {
        text: `${name} has ${total} ${item}. ${red} are red and the rest are blue. How many blue ${item} are there?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const collectionItem = getRandomCollectionItem();
      const pages = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 3, max: 7 },
        ],
        { upTo: 6, min: 4, max: 9 }
      );
      const perPage = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 4, max: 9 },
          { upTo: 4, min: 5, max: 11 },
        ],
        { upTo: 6, min: 6, max: 14 }
      );
      const answer = pages * perPage;

      return {
        text: `${name} has a collector album with ${pages} pages. Each page holds ${perPage} ${collectionItem}. How many ${collectionItem} are in the album?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 2+: Transportation and travel problems (NEW)
 */
export const TRAVEL_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const vehicle = ['bus', 'train', 'boat', 'plane'][randomInt(0, 3)];
      const trips = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 3, max: 5 },
        ],
        { upTo: 6, min: 4, max: 7 }
      );
      const peoplePerTrip = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 12, max: 36 },
          { upTo: 4, min: 18, max: 48 },
        ],
        { upTo: 6, min: 24, max: 72 }
      );
      const answer = trips * peoplePerTrip;

      return {
        text: `A ${vehicle} makes ${trips} trips. Each trip carries ${peoplePerTrip} people. How many people travel in total?`,
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
      const pronouns = getPronouns(name);
      const to = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 10, max: 30 },
          { upTo: 4, min: 12, max: 40 },
        ],
        { upTo: 6, min: 15, max: 60 }
      );
      const back = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 8, max: 25 },
          { upTo: 4, min: 10, max: 35 },
        ],
        { upTo: 6, min: 12, max: 45 }
      );
      const answer = to + back;

      return {
        text: `${name} walks ${to} meters to the park and ${back} meters back home. How far does ${pronouns.lowerSubject} walk in total?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const rows = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 3, max: 6 },
        ],
        { upTo: 6, min: 4, max: 8 }
      );
      const seatsPerRow = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 4, max: 8 },
          { upTo: 4, min: 5, max: 10 },
        ],
        { upTo: 6, min: 6, max: 12 }
      );
      const empty = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 6 },
          { upTo: 4, min: 3, max: 8 },
        ],
        { upTo: 6, min: 4, max: 10 }
      );
      const total = rows * seatsPerRow;
      const answer = total - empty;

      return {
        text: `A bus has ${rows} rows with ${seatsPerRow} seats in each row. ${empty} seats are empty. How many people are on the bus?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 6,
    category: 'word-story',
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
    ...SECOND_GRADE_CONTEXT_STORIES,
    ...MULTI_STEP_STORIES,
    ...MULTIPLICATION_STORIES,
    ...DIVISION_STORIES,
    ...COMPARISON_STORIES,
    ...TIME_STORIES,
    ...MONEY_STORIES,
    ...MEASUREMENT_STORIES,
    ...MIXED_OPERATION_STORIES,
    ...PATTERN_STORIES,
    ...GEOMETRY_STORIES,
    ...COLLECTION_STORIES,
    ...TRAVEL_STORIES,
  ];

  allStories.forEach((story) => {
    if (grade >= story.minGrade && grade <= story.maxGrade) {
      stories.push(story);
    }
  });

  return stories;
}
