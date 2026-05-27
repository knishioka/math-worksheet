/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Operation } from '../../../types';

/**
 * Word story problem templates for English
 */

export interface WordStoryTemplate {
  generateProblem: (grade: number) => {
    text: string;
    answer: number | string;
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

const ITEMS = [
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
] as const;

/**
 * Helper function to get random item
 */
function getRandomItem(plural = false): string {
  const item = ITEMS[randomInt(0, ITEMS.length - 1)];
  return plural ? item.plural : item.singular;
}

/**
 * Helper function to get random item with both forms
 */
function getRandomItemPair(): { singular: string; plural: string } {
  return ITEMS[randomInt(0, ITEMS.length - 1)];
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

/**
 * Grade 4+ advanced vocabulary: longer names, school/community contexts,
 * event-themed scenarios. Used inside grade>=4 branches and ADVANCED_STORIES.
 */
const ADVANCED_NAMES = [
  'Olivia',
  'Sophia',
  'Isabella',
  'Aiden',
  'Ethan',
  'Lucas',
  'Mason',
  'Hannah',
  'Charlotte',
  'Amelia',
  'Daniel',
  'Henry',
  'Caleb',
  'Nora',
  'Ava',
] as const;

const ADVANCED_VENUES = [
  'school library',
  'auditorium',
  'cafeteria',
  'gymnasium',
  'playground',
  'science lab',
  'art studio',
  'computer lab',
  'community center',
] as const;

const ADVANCED_EVENTS = [
  'school festival',
  'spring concert',
  'science fair',
  'sports tournament',
  'art exhibition',
  'reading marathon',
  'recycling drive',
  'fundraiser',
  'charity walk',
  'talent show',
] as const;

const ADVANCED_ITEMS = [
  { singular: 'notebook', plural: 'notebooks' },
  { singular: 'calculator', plural: 'calculators' },
  { singular: 'science kit', plural: 'science kits' },
  { singular: 'bottle cap', plural: 'bottle caps' },
  { singular: 'donation can', plural: 'donation cans' },
  { singular: 'concert ticket', plural: 'concert tickets' },
  { singular: 'medal', plural: 'medals' },
  { singular: 'trophy', plural: 'trophies' },
  { singular: 'auditorium chair', plural: 'auditorium chairs' },
  { singular: 'science book', plural: 'science books' },
] as const;

function getAdvancedName(): string {
  return ADVANCED_NAMES[randomInt(0, ADVANCED_NAMES.length - 1)];
}

function getDifferentAdvancedName(exclude: string | string[]): string {
  const excludedNames = Array.isArray(exclude) ? exclude : [exclude];
  if (excludedNames.length >= ADVANCED_NAMES.length) {
    throw new Error('Cannot select a unique advanced name: all excluded');
  }
  const excludedSet = new Set(excludedNames);
  let name = getAdvancedName();
  while (excludedSet.has(name)) {
    name = getAdvancedName();
  }
  return name;
}

function getAdvancedVenue(): string {
  return ADVANCED_VENUES[randomInt(0, ADVANCED_VENUES.length - 1)];
}

function getAdvancedEvent(): string {
  return ADVANCED_EVENTS[randomInt(0, ADVANCED_EVENTS.length - 1)];
}

function getAdvancedItem(plural = false): string {
  const item = ADVANCED_ITEMS[randomInt(0, ADVANCED_ITEMS.length - 1)];
  return plural ? item.plural : item.singular;
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
  // Advanced (grade 4+) female names
  'Olivia',
  'Sophia',
  'Isabella',
  'Hannah',
  'Charlotte',
  'Amelia',
  'Nora',
  'Ava',
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

/**
 * Per-grade scalar (e.g. for max factor in multiplication / division).
 * Lets us replace inline ternaries with a single readable call.
 * Grade 3 is its own tier so curriculum-appropriate ranges can diverge from G1-2.
 */
function gradeFactor(
  grade: number,
  g1to2: number,
  g3: number,
  g4: number,
  g5: number,
  g6: number
): number {
  if (grade <= 2) return g1to2;
  if (grade === 3) return g3;
  if (grade === 4) return g4;
  if (grade === 5) return g5;
  return g6;
}

/**
 * Greatest common divisor for fraction reduction.
 */
function gcd(a: number, b: number): number {
  const aAbs = Math.abs(a);
  const bAbs = Math.abs(b);
  if (bAbs === 0) return aAbs;
  return gcd(bAbs, aAbs % bAbs);
}

/**
 * Reduce a fraction to lowest terms.
 */
function reduceFraction(n: number, d: number): { n: number; d: number } {
  if (d === 0) return { n, d };
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

/**
 * Format a fraction as a plain string. Returns "n" when denominator is 1.
 */
function formatFraction(n: number, d: number): string {
  if (d === 1) return String(n);
  return `${n}/${d}`;
}

/**
 * Format a decimal value, trimming trailing zeros (but keeping at least one
 * digit after the point when the value is non-integer).
 */
function formatDecimal(value: number, places: number): string {
  const fixed = value.toFixed(places);
  if (!fixed.includes('.')) return fixed;
  return fixed.replace(/0+$/, '').replace(/\.$/, '');
}

/**
 * Format "quotient remainder" answers. Returns just the quotient when r === 0.
 */
function formatRemainder(q: number, r: number): string {
  return r === 0 ? String(q) : `${q} R ${r}`;
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

  [50, 100, 200, 500, 1000, 2000, 5000].forEach((bill) => {
    if (
      bill >= price &&
      bill - price <= Math.max(30, Math.floor(price * 0.3))
    ) {
      addCandidate(bill);
    }
  });

  // High-price fallbacks: next round hundred / thousand
  if (price > 100) {
    const nextHundred = Math.ceil(price / 100) * 100;
    if (nextHundred > price) addCandidate(nextHundred);
    if (nextHundred + 50 > price) addCandidate(nextHundred + 50);
  }
  if (price > 500) {
    const nextThousand = Math.ceil(price / 1000) * 1000;
    if (nextThousand > price) addCandidate(nextThousand);
  }

  if (candidates.size === 0) {
    // Last-resort: next multiple of 5 strictly greater than price.
    // We intentionally ignore maxPaid here so the helper never returns
    // a value <= price (which would produce a non-positive change).
    const safeMultipleOfFive =
      price % 5 === 0 ? price + 5 : Math.ceil(price / 5) * 5;
    addCandidate(safeMultipleOfFive);
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
    maxGrade: 3,
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
    maxGrade: 3,
    category: 'word-story',
  },
];

/**
 * Grade 2-6: Multi-step and categorization problems
 */
export const MULTI_STEP_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = grade >= 4 ? getAdvancedName() : getRandomName();
      const useAdvanced = grade >= 4;
      const item = useAdvanced ? getAdvancedItem(true) : getRandomItem(true);
      const event = useAdvanced ? getAdvancedEvent() : null;
      const total = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 18, max: 36 },
          { upTo: 3, min: 24, max: 50 },
          { upTo: 4, min: 60, max: 140 },
          { upTo: 5, min: 120, max: 280 },
        ],
        { upTo: 6, min: 200, max: 480 }
      );
      const red = randomInt(
        Math.max(3, Math.floor(total * 0.2)),
        Math.max(4, Math.floor(total * 0.35))
      );
      const green = randomInt(
        Math.max(3, Math.floor(total * 0.2)),
        Math.max(4, Math.floor(total * 0.35))
      );
      const blue = total - red - green;

      const text = useAdvanced
        ? `After the ${event}, ${name} sorted ${total} ${item} from the donation box. ${red} were red and ${green} were green, while the rest were blue. How many blue ${item} were there?`
        : `${name} has ${total} ${item}. ${red} of them are red and ${green} are green. The rest are blue. How many blue ${item} are there?`;

      return {
        text,
        answer: blue,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 4,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const useAdvanced = grade >= 4;
      const name1 = useAdvanced ? getAdvancedName() : getRandomName();
      const name2 = useAdvanced
        ? getDifferentAdvancedName(name1)
        : getDifferentName(name1);
      const item = useAdvanced ? getAdvancedItem(true) : getRandomItem(true);
      const event = useAdvanced ? getAdvancedEvent() : null;
      const count1 = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 14, max: 32 },
          { upTo: 3, min: 18, max: 48 },
          { upTo: 4, min: 55, max: 160 },
          { upTo: 5, min: 120, max: 320 },
        ],
        { upTo: 6, min: 240, max: 680 }
      );
      const count2 = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 8, max: 18 },
          { upTo: 3, min: 10, max: 25 },
          { upTo: 4, min: 35, max: 90 },
          { upTo: 5, min: 60, max: 180 },
        ],
        { upTo: 6, min: 120, max: 360 }
      );
      const answer = count1 + count2;

      const text = useAdvanced
        ? `For the ${event}, ${name1} contributed ${count1} ${item} while ${name2} contributed ${count2} ${item}. How many ${item} did the two of them contribute altogether?`
        : `${name1} has ${count1} ${item} and ${name2} has ${count2} ${item}. How many ${item} do they have together?`;

      return {
        text,
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
 * Grade 2-6: Multiplication stories
 */
export const MULTIPLICATION_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const factorMax = gradeFactor(grade, 9, 9, 30, 60, 80);
      const groups = randomInt(2, factorMax);
      const perGroup = randomInt(2, factorMax);
      const answer = groups * perGroup;

      return {
        text: `There are ${groups} boxes. Each box has ${perGroup} ${item}. How many ${item} are there in total?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 4,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const factorMax = gradeFactor(grade, 9, 9, 30, 60, 80);
      const groups = randomInt(2, factorMax);
      const perGroup = randomInt(2, factorMax);
      const answer = groups * perGroup;

      return {
        text: `There are ${groups} groups of ${perGroup} ${item}. How many ${item} are there altogether?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 4,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const factorMax = gradeFactor(grade, 9, 9, 30, 60, 80);
      const rows = randomInt(2, factorMax);
      const cols = randomInt(2, factorMax);
      const answer = rows * cols;

      return {
        text: `${item.charAt(0).toUpperCase() + item.slice(1)} are arranged in ${rows} rows with ${cols} in each row. How many ${item} are there in total?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 2,
    maxGrade: 4,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const useAdvanced = grade >= 4;
      const name = useAdvanced ? getAdvancedName() : getRandomName();
      const item = useAdvanced ? getAdvancedItem(true) : getRandomItem(true);
      const pronouns = getPronouns(name);
      const friendName = useAdvanced
        ? getDifferentAdvancedName(name)
        : getDifferentName(name);
      const multiplier = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 7 },
          { upTo: 4, min: 4, max: 14 },
          { upTo: 5, min: 6, max: 20 },
        ],
        { upTo: 6, min: 8, max: 30 }
      );
      const base = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 4, min: 8, max: 25 },
          { upTo: 5, min: 15, max: 60 },
        ],
        { upTo: 6, min: 25, max: 120 }
      );
      const answer = multiplier * base;

      const text = useAdvanced
        ? `Since ${name} has ${multiplier} times as many ${item} as ${pronouns.possessive} friend ${friendName}, who already owns ${base}, how many ${item} does ${pronouns.lowerSubject} have in total?`
        : `${name} has ${multiplier} times as many ${item} as ${pronouns.possessive} friend ${friendName}, who has ${base}. How many ${item} does ${pronouns.lowerSubject} have?`;

      return {
        text,
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
      const useAdvanced = grade >= 4;
      const name = useAdvanced ? getAdvancedName() : getRandomName();
      const pronouns = getPronouns(name);
      const perDay = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 2, max: 6 },
          { upTo: 3, min: 4, max: 10 },
          { upTo: 4, min: 8, max: 22 },
          { upTo: 5, min: 15, max: 40 },
        ],
        { upTo: 6, min: 20, max: 60 }
      );
      const days = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 2, max: 6 },
          { upTo: 3, min: 3, max: 8 },
          { upTo: 4, min: 5, max: 14 },
          { upTo: 5, min: 7, max: 21 },
        ],
        { upTo: 6, min: 10, max: 30 }
      );
      const answer = perDay * days;

      const text = useAdvanced
        ? `Since ${name} reads ${perDay} pages each evening, how many pages will ${pronouns.lowerSubject} have read after ${days} days of the summer reading challenge?`
        : `${name} reads ${perDay} pages every day. How many pages does ${pronouns.lowerSubject} read in ${days} days?`;

      return {
        text,
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
      const useAdvanced = grade >= 4;
      const price = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 2, max: 9 },
          { upTo: 3, min: 2, max: 12 },
          { upTo: 4, min: 4, max: 18 },
          { upTo: 5, min: 8, max: 30 },
        ],
        { upTo: 6, min: 12, max: 50 }
      );
      const quantity = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 2, max: 9 },
          { upTo: 3, min: 2, max: 12 },
          { upTo: 4, min: 5, max: 14 },
          { upTo: 5, min: 6, max: 20 },
        ],
        { upTo: 6, min: 8, max: 28 }
      );
      const answer = price * quantity;
      const item = useAdvanced
        ? ADVANCED_ITEMS[randomInt(0, ADVANCED_ITEMS.length - 1)]
        : getRandomItemPair();

      return {
        text: `One ${item.singular} costs $${price}. How much do ${quantity} ${item.plural} cost?`,
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
      const divisorMax = gradeFactor(grade, 9, 9, 15, 30, 50);
      const quotientMax = gradeFactor(grade, 9, 80, 120, 250, 400);
      const groups = randomInt(2, divisorMax);
      const perGroup = randomInt(2, quotientMax);
      const total = groups * perGroup;
      const answer = perGroup;

      return {
        text: `${total} ${item} are shared equally among ${groups} friends. How many ${item} does each friend get?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const divisorMax = gradeFactor(grade, 9, 9, 15, 30, 50);
      const quotientMax = gradeFactor(grade, 9, 80, 120, 250, 400);
      const perBox = randomInt(2, divisorMax);
      const numBoxes = randomInt(2, quotientMax);
      const total = perBox * numBoxes;
      const answer = numBoxes;

      return {
        text: `There are ${total} ${item}. If you put ${perBox} ${item} in each box, how many boxes do you need?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const item = getRandomItem(true);
      const divisorMax = gradeFactor(grade, 9, 9, 15, 30, 50);
      const quotientMax = gradeFactor(grade, 9, 80, 120, 250, 400);
      const perRow = randomInt(2, quotientMax);
      const numRows = randomInt(2, divisorMax);
      const total = perRow * numRows;
      const answer = perRow;

      return {
        text: `${total} ${item} are arranged in ${numRows} equal rows. How many ${item} are in each row?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const useAdvanced = grade >= 4;
      const name = useAdvanced ? getAdvancedName() : getRandomName();
      const numItems = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 4, min: 4, max: 12 },
          { upTo: 5, min: 6, max: 18 },
        ],
        { upTo: 6, min: 8, max: 24 }
      );
      const unitPrice = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 3, max: 9 },
          { upTo: 4, min: 6, max: 30 },
          { upTo: 5, min: 12, max: 80 },
        ],
        { upTo: 6, min: 20, max: 180 }
      );
      const actualTotal = unitPrice * numItems;
      const answer = unitPrice;
      const item = useAdvanced
        ? ADVANCED_ITEMS[randomInt(0, ADVANCED_ITEMS.length - 1)]
        : getRandomItemPair();

      const text = useAdvanced
        ? `${name} bought ${numItems} ${item.plural} at the school store. The total bill came to $${actualTotal}, and every ${item.singular} cost the same amount. How much did one ${item.singular} cost?`
        : `${name} pays $${actualTotal} for ${numItems} ${item.plural}. How much does one ${item.singular} cost?`;

      return {
        text,
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
      const pagesPerDay = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 4, min: 6, max: 20 },
          { upTo: 5, min: 10, max: 40 },
        ],
        { upTo: 6, min: 15, max: 60 }
      );
      const days = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 3, max: 8 },
          { upTo: 4, min: 5, max: 14 },
          { upTo: 5, min: 7, max: 21 },
        ],
        { upTo: 6, min: 10, max: 30 }
      );
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
      const divisorMax = gradeFactor(grade, 9, 9, 15, 30, 50);
      const quotientMax = gradeFactor(grade, 9, 80, 120, 250, 400);
      const perBag = randomInt(2, quotientMax);
      const numBags = randomInt(2, divisorMax);
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
      const duration = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 1, max: 3 },
          { upTo: 4, min: 2, max: 6 },
          { upTo: 5, min: 3, max: 8 },
        ],
        { upTo: 6, min: 4, max: 10 }
      );
      const startHour = randomInt(7, Math.max(8, 22 - duration));
      const answer = startHour + duration;

      return {
        text: `${name} starts playing at ${startHour}:00. ${pronouns.subject} plays for ${duration} ${duration === 1 ? 'hour' : 'hours'}. What time does ${pronouns.lowerSubject} finish?`,
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
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const duration = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 5, max: 15 },
          { upTo: 4, min: 8, max: 20 },
        ],
        { upTo: 6, min: 10, max: 30 }
      );
      const startMinuteRaw = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 10, max: 30 },
          { upTo: 4, min: 12, max: 40 },
        ],
        { upTo: 6, min: 15, max: 50 }
      );
      // The answer is "minutes past the same hour", so we must keep
      // startMinute + duration < 60. Without this clamp, grade 5-6 ranges
      // can yield nonsensical answers like "80 minutes past the hour".
      const startMinute = Math.max(5, Math.min(startMinuteRaw, 59 - duration));
      const answer = startMinute + duration;

      return {
        text: `${name} starts homework at ${startMinute} minutes past the hour. It takes ${duration} minutes. How many minutes past the hour does ${pronouns.lowerSubject} finish?`,
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
      const activities = ['a movie', 'a game', 'practice', 'class'];
      const activity = activities[randomInt(0, activities.length - 1)];
      const duration = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 30, max: 75 },
          { upTo: 4, min: 75, max: 240 },
          { upTo: 5, min: 150, max: 420 },
        ],
        { upTo: 6, min: 200, max: 600 }
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
    maxGrade: 6,
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
          { upTo: 4, min: 10, max: 30 },
          { upTo: 5, min: 15, max: 45 },
        ],
        { upTo: 6, min: 20, max: 60 }
      );
      const numTasks = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 4, max: 8 },
          { upTo: 5, min: 5, max: 10 },
        ],
        { upTo: 6, min: 6, max: 12 }
      );
      const answer = timePerTask * numTasks;

      return {
        text: `${name} does ${numTasks} homework tasks. Each task takes ${timePerTask} minutes. How many minutes does ${pronouns.lowerSubject} spend on homework?`,
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
      const numPeople = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 4, max: 8 },
          { upTo: 5, min: 5, max: 12 },
        ],
        { upTo: 6, min: 6, max: 20 }
      );
      const minutesEach = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 8, max: 18 },
          { upTo: 4, min: 15, max: 45 },
          { upTo: 5, min: 25, max: 80 },
        ],
        { upTo: 6, min: 40, max: 120 }
      );
      const actualTotal = minutesEach * numPeople;
      const answer = minutesEach;

      return {
        text: `${numPeople} friends share ${actualTotal} minutes of play time equally. How many minutes does each friend get?`,
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
 * Grade 2-5: Money problems
 */
export const MONEY_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const useAdvanced = grade >= 4;
      const name = useAdvanced ? getAdvancedName() : getRandomName();
      const pronouns = getPronouns(name);
      const price = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 5, max: 30 },
          { upTo: 3, min: 8, max: 45 },
          { upTo: 4, min: 18, max: 120 },
          { upTo: 5, min: 30, max: 280 },
        ],
        { upTo: 6, min: 50, max: 500 }
      );
      const paidUpperBound =
        Math.ceil(price / 10) * 10 +
        gradeRandomInt(
          grade,
          [
            { upTo: 2, min: 5, max: 15 },
            { upTo: 3, min: 5, max: 25 },
            { upTo: 4, min: 10, max: 50 },
            { upTo: 5, min: 20, max: 150 },
          ],
          { upTo: 6, min: 50, max: 300 }
        );
      const paid = generateFriendlyPayment(
        price,
        Math.max(paidUpperBound, price + 5)
      );
      const answer = paid - price;

      const text = useAdvanced
        ? `If ${name} buys a toy for $${price} and pays with $${paid}, how much change does ${pronouns.lowerSubject} get back?`
        : `${name} buys a toy for $${price}. ${pronouns.subject} pays with $${paid}. How much change does ${pronouns.lowerSubject} get?`;

      return {
        text,
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
      const pronouns = getPronouns(name);
      const saved = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 10, max: 35 },
          { upTo: 3, min: 15, max: 60 },
          { upTo: 4, min: 35, max: 180 },
          { upTo: 5, min: 60, max: 400 },
        ],
        { upTo: 6, min: 120, max: 900 }
      );
      const earned = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 5, max: 15 },
          { upTo: 3, min: 8, max: 25 },
          { upTo: 4, min: 20, max: 80 },
          { upTo: 5, min: 40, max: 180 },
        ],
        { upTo: 6, min: 80, max: 400 }
      );
      const answer = saved + earned;

      return {
        text: `${name} has $${saved} saved. ${pronouns.subject} earns $${earned} more. How much money does ${pronouns.lowerSubject} have now?`,
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
      const schoolItems = [
        { singular: 'notebook', plural: 'notebooks' },
        { singular: 'pencil', plural: 'pencils' },
        { singular: 'eraser', plural: 'erasers' },
        { singular: 'ruler', plural: 'rulers' },
      ] as const;
      const item = schoolItems[randomInt(0, schoolItems.length - 1)];
      const price = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 4, min: 4, max: 18 },
          { upTo: 5, min: 8, max: 30 },
        ],
        { upTo: 6, min: 12, max: 50 }
      );
      const quantity = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 6 },
          { upTo: 4, min: 5, max: 12 },
          { upTo: 5, min: 6, max: 18 },
        ],
        { upTo: 6, min: 8, max: 25 }
      );
      const answer = price * quantity;

      return {
        text: `Each ${item.singular} costs $${price}. How much do ${quantity} ${item.plural} cost in total?`,
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
      const weeklyAmount = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 5, max: 12 },
          { upTo: 3, min: 6, max: 15 },
          { upTo: 4, min: 10, max: 30 },
          { upTo: 5, min: 15, max: 50 },
        ],
        { upTo: 6, min: 25, max: 80 }
      );
      const weeks = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 2, max: 4 },
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 4, max: 8 },
          { upTo: 5, min: 6, max: 12 },
        ],
        { upTo: 6, min: 8, max: 20 }
      );
      const answer = weeklyAmount * weeks;

      return {
        text: `${name} gets $${weeklyAmount} allowance each week. How much does ${pronouns.lowerSubject} get in ${weeks} weeks?`,
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
      const numFriends = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 3, max: 8 },
          { upTo: 5, min: 4, max: 12 },
        ],
        { upTo: 6, min: 5, max: 15 }
      );
      const costEach = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 6, max: 18 },
          { upTo: 4, min: 12, max: 60 },
          { upTo: 5, min: 30, max: 150 },
        ],
        { upTo: 6, min: 60, max: 400 }
      );
      const actualTotal = costEach * numFriends;
      const answer = costEach;

      return {
        text: `${numFriends} friends share the cost of a gift that costs $${actualTotal}. How much does each friend pay?`,
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
 * Grade 2-5: Measurement and distance problems
 */
export const MEASUREMENT_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const useAdvanced = grade >= 4;
      const name = useAdvanced ? getAdvancedName() : getRandomName();
      const pronouns = getPronouns(name);
      const venue = useAdvanced ? getAdvancedVenue() : null;
      const distance1 = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 10, max: 40 },
          { upTo: 3, min: 15, max: 60 },
          { upTo: 4, min: 80, max: 350 },
          { upTo: 5, min: 180, max: 900 },
        ],
        { upTo: 6, min: 400, max: 1800 }
      );
      const distance2 = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 5, max: 20 },
          { upTo: 3, min: 8, max: 40 },
          { upTo: 4, min: 60, max: 240 },
          { upTo: 5, min: 120, max: 600 },
        ],
        { upTo: 6, min: 300, max: 1500 }
      );
      const answer = distance1 + distance2;

      const text = useAdvanced
        ? `After morning assembly, ${name} walked ${distance1} meters to the ${venue} and then ${distance2} meters more to the field. How many meters did ${pronouns.lowerSubject} walk in total?`
        : `${name} walks ${distance1} meters to school and then ${distance2} meters more to the library. How many meters does ${pronouns.lowerSubject} walk in total?`;

      return {
        text,
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
      const name1 = getRandomName();
      const name2 = getDifferentName(name1);
      const height1 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 100, max: 135 },
          { upTo: 4, min: 115, max: 150 },
          { upTo: 5, min: 130, max: 165 },
        ],
        { upTo: 6, min: 145, max: 180 }
      );
      const difference = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 6, max: 18 },
          { upTo: 4, min: 8, max: 28 },
          { upTo: 5, min: 10, max: 40 },
        ],
        { upTo: 6, min: 12, max: 55 }
      );
      const answer = height1 - difference;

      return {
        text: `${name1} is ${height1} cm tall. ${name2} is ${difference} cm shorter than ${name1}. How tall is ${name2}?`,
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
      const item = ['rope', 'ribbon', 'string', 'wire'][randomInt(0, 3)];
      const lengthEach = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 6, max: 22 },
          { upTo: 4, min: 18, max: 60 },
          { upTo: 5, min: 30, max: 120 },
        ],
        { upTo: 6, min: 50, max: 250 }
      );
      const numPieces = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 4, max: 10 },
          { upTo: 5, min: 6, max: 15 },
        ],
        { upTo: 6, min: 8, max: 25 }
      );
      const answer = lengthEach * numPieces;

      return {
        text: `There are ${numPieces} pieces of ${item}. Each piece is ${lengthEach} cm long. What is the total length of all pieces?`,
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
      const item = ['water', 'juice', 'milk', 'paint'][randomInt(0, 3)];
      const numContainers = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 3, max: 6 },
          { upTo: 3, min: 3, max: 8 },
          { upTo: 4, min: 4, max: 12 },
          { upTo: 5, min: 5, max: 15 },
        ],
        { upTo: 6, min: 6, max: 20 }
      );
      const mlEach = gradeRandomInt(
        grade,
        [
          { upTo: 2, min: 30, max: 120 },
          { upTo: 3, min: 40, max: 180 },
          { upTo: 4, min: 60, max: 240 },
          { upTo: 5, min: 100, max: 480 },
        ],
        { upTo: 6, min: 200, max: 900 }
      );
      const actualTotal = mlEach * numContainers;
      const answer = mlEach;

      return {
        text: `${actualTotal} ml of ${item} is poured equally into ${numContainers} containers. How much ${item} is in each container?`,
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
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 4, max: 10 },
          { upTo: 5, min: 6, max: 14 },
        ],
        { upTo: 6, min: 8, max: 20 }
      );
      const perBox = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 3, max: 8 },
          { upTo: 4, min: 6, max: 18 },
          { upTo: 5, min: 10, max: 30 },
        ],
        { upTo: 6, min: 15, max: 50 }
      );
      const extra = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 12 },
          { upTo: 4, min: 8, max: 40 },
          { upTo: 5, min: 20, max: 90 },
        ],
        { upTo: 6, min: 40, max: 200 }
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
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 3, max: 8 },
          { upTo: 5, min: 4, max: 12 },
        ],
        { upTo: 6, min: 6, max: 18 }
      );
      const perGroup = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 3, max: 8 },
          { upTo: 4, min: 6, max: 16 },
          { upTo: 5, min: 10, max: 25 },
        ],
        { upTo: 6, min: 14, max: 40 }
      );
      const total = groups * perGroup;
      const maxGiven = Math.max(2, Math.floor(total * 0.6));
      const given = randomInt(2, maxGiven);
      const answer = total - given;

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
          { upTo: 4, min: 5, max: 18 },
          { upTo: 5, min: 8, max: 35 },
        ],
        { upTo: 6, min: 12, max: 60 }
      );
      const quantity = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 4, max: 10 },
          { upTo: 5, min: 5, max: 14 },
        ],
        { upTo: 6, min: 6, max: 20 }
      );
      const totalCost = price * quantity;
      const paidUpperBound =
        Math.ceil(totalCost / 10) * 10 +
        gradeRandomInt(
          grade,
          [
            { upTo: 4, min: 10, max: 50 },
            { upTo: 5, min: 20, max: 150 },
          ],
          { upTo: 6, min: 50, max: 300 }
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
      const groups = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 3, max: 6 },
          { upTo: 5, min: 4, max: 8 },
        ],
        { upTo: 6, min: 5, max: 10 }
      );
      const perFriend = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 8, max: 25 },
          { upTo: 5, min: 12, max: 50 },
        ],
        { upTo: 6, min: 18, max: 90 }
      );
      const totalGiven = perFriend * groups;
      const left = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 5, max: 30 },
          { upTo: 5, min: 10, max: 60 },
        ],
        { upTo: 6, min: 15, max: 120 }
      );
      const initial = totalGiven + left;
      const answer = perFriend;

      return {
        text: `${name} had ${initial} ${item}. After giving ${groups} friends equal amounts, ${pronouns.lowerSubject} has ${left} left. How many ${item} did each friend get?`,
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
          { upTo: 4, min: 60, max: 200 },
          { upTo: 5, min: 140, max: 480 },
        ],
        { upTo: 6, min: 300, max: 1200 }
      );
      const more = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 5, max: 18 },
          { upTo: 4, min: 20, max: 90 },
          { upTo: 5, min: 40, max: 180 },
        ],
        { upTo: 6, min: 80, max: 400 }
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
      const useAdvanced = grade >= 4;
      const name1 = useAdvanced ? getAdvancedName() : getRandomName();
      const name2 = useAdvanced
        ? getDifferentAdvancedName(name1)
        : getDifferentName(name1);
      const item = useAdvanced ? getAdvancedItem(true) : getRandomItem(true);
      const event = useAdvanced ? getAdvancedEvent() : null;
      const count1 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 24, max: 60 },
          { upTo: 4, min: 80, max: 280 },
          { upTo: 5, min: 200, max: 720 },
        ],
        { upTo: 6, min: 400, max: 1800 }
      );
      const maxFewer = Math.min(
        gradeRandomInt(
          grade,
          [
            { upTo: 3, min: 8, max: 18 },
            { upTo: 4, min: 25, max: 120 },
            { upTo: 5, min: 60, max: 280 },
          ],
          { upTo: 6, min: 120, max: 600 }
        ),
        count1 - 1
      );
      const fewer = randomInt(5, Math.max(5, maxFewer));
      const answer = count1 - fewer;

      const text = useAdvanced
        ? `Although ${name1}'s class collected ${count1} ${item} for the ${event}, ${name2}'s class collected ${fewer} fewer. How many ${item} did ${name2}'s class collect?`
        : `${name1} has ${count1} ${item}. ${name2} has ${fewer} fewer than ${name1}. How many ${item} does ${name2} have?`;

      return {
        text,
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
          { upTo: 4, min: 60, max: 200 },
          { upTo: 5, min: 140, max: 480 },
        ],
        { upTo: 6, min: 280, max: 1100 }
      );
      const more = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 5, max: 16 },
          { upTo: 4, min: 18, max: 80 },
          { upTo: 5, min: 35, max: 160 },
        ],
        { upTo: 6, min: 70, max: 360 }
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
          { upTo: 4, min: 80, max: 280 },
          { upTo: 5, min: 200, max: 700 },
        ],
        { upTo: 6, min: 400, max: 1500 }
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
          { upTo: 4, min: 35, max: 140 },
          { upTo: 5, min: 80, max: 360 },
        ],
        { upTo: 6, min: 160, max: 900 }
      );
      const count2 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 10, max: 26 },
          { upTo: 4, min: 30, max: 120 },
          { upTo: 5, min: 70, max: 320 },
        ],
        { upTo: 6, min: 140, max: 800 }
      );
      const count3 = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 8, max: 22 },
          { upTo: 4, min: 25, max: 100 },
          { upTo: 5, min: 60, max: 280 },
        ],
        { upTo: 6, min: 120, max: 700 }
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
          { upTo: 4, min: 60, max: 220 },
          { upTo: 5, min: 140, max: 560 },
        ],
        { upTo: 6, min: 300, max: 1200 }
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
          { upTo: 4, min: 25, max: 120 },
          { upTo: 5, min: 60, max: 300 },
        ],
        { upTo: 6, min: 120, max: 800 }
      );
      const step = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 6 },
          { upTo: 4, min: 6, max: 18 },
          { upTo: 5, min: 10, max: 30 },
        ],
        { upTo: 6, min: 15, max: 50 }
      );
      const numSteps = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 3 },
          { upTo: 4, min: 4, max: 7 },
          { upTo: 5, min: 5, max: 10 },
        ],
        { upTo: 6, min: 6, max: 14 }
      );
      const answer = start + step * numSteps;

      return {
        text: `A pattern starts at ${start} and goes up by ${step} each time: ${start}, ${start + step}, ${start + step * 2}, ... What is the number after ${numSteps} steps?`,
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
      const step = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 6 },
          { upTo: 4, min: 6, max: 15 },
          { upTo: 5, min: 10, max: 25 },
        ],
        { upTo: 6, min: 15, max: 40 }
      );
      const numSteps = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 3, max: 8 },
          { upTo: 4, min: 6, max: 18 },
          { upTo: 5, min: 8, max: 30 },
        ],
        { upTo: 6, min: 12, max: 50 }
      );
      const current = step * numSteps;
      const answer = current + step;

      return {
        text: `Count by ${step}s: ${step}, ${step * 2}, ${step * 3}, ... What comes after ${current}?`,
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
 * Grade 2+: Shape and geometry problems (NEW)
 */
export const GEOMETRY_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const numShapes = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 5, max: 12 },
          { upTo: 5, min: 8, max: 20 },
        ],
        { upTo: 6, min: 12, max: 30 }
      );
      // Limit to shapes with known names (3-8 sides)
      const sidesPerShape = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 3, max: 4 },
          { upTo: 4, min: 3, max: 6 },
        ],
        { upTo: 6, min: 4, max: 8 }
      );
      const answer = numShapes * sidesPerShape;

      const shapeNames: Record<number, string> = {
        3: 'triangle',
        4: 'square',
        5: 'pentagon',
        6: 'hexagon',
        7: 'heptagon',
        8: 'octagon',
      };
      const shapeName = shapeNames[sidesPerShape] ?? 'polygon';
      const plural = numShapes === 1 ? shapeName : shapeName + 's';

      return {
        text: `There are ${numShapes} ${plural}. How many sides are there in total?`,
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
      const useAdvanced = grade >= 4;
      const venue = useAdvanced ? getAdvancedVenue() : null;
      const length = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 5, max: 15 },
          { upTo: 4, min: 14, max: 45 },
          { upTo: 5, min: 25, max: 90 },
        ],
        { upTo: 6, min: 40, max: 160 }
      );
      const widthMax = Math.max(3, Math.floor(length * 0.8));
      const width = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 3, max: Math.min(12, widthMax) },
          { upTo: 4, min: 8, max: Math.min(35, widthMax) },
          { upTo: 5, min: 15, max: Math.min(70, widthMax) },
        ],
        { upTo: 6, min: 25, max: Math.min(140, widthMax) }
      );
      const answer = (length + width) * 2;

      const text = useAdvanced
        ? `If the new ${venue} floor is shaped like a rectangle that is ${length} m long and ${width} m wide, what is the perimeter of the room in meters?`
        : `A rectangle is ${length} cm long and ${width} cm wide. What is the perimeter?`;

      return {
        text,
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
      const side = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 5, max: 12 },
          { upTo: 4, min: 12, max: 35 },
          { upTo: 5, min: 20, max: 75 },
        ],
        { upTo: 6, min: 30, max: 140 }
      );
      const answer = side * 4;

      return {
        text: `Each side of a square is ${side} cm. What is the perimeter of the square?`,
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
 * Grade 3+: Collection and grouping problems
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
          { upTo: 4, min: 5, max: 14 },
          { upTo: 5, min: 8, max: 21 },
        ],
        { upTo: 6, min: 10, max: 30 }
      );
      const perDay = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 8 },
          { upTo: 4, min: 6, max: 20 },
          { upTo: 5, min: 10, max: 40 },
        ],
        { upTo: 6, min: 15, max: 75 }
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
      const shelves = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 4 },
          { upTo: 4, min: 4, max: 10 },
          { upTo: 5, min: 6, max: 15 },
        ],
        { upTo: 6, min: 8, max: 22 }
      );
      const perShelf = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 6, max: 14 },
          { upTo: 4, min: 15, max: 45 },
          { upTo: 5, min: 25, max: 80 },
        ],
        { upTo: 6, min: 40, max: 150 }
      );
      const answer = shelves * perShelf;

      return {
        text: `A library has ${shelves} shelves. Each shelf holds ${perShelf} books. How many books are there in total?`,
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
          { upTo: 4, min: 100, max: 360 },
          { upTo: 5, min: 200, max: 900 },
        ],
        { upTo: 6, min: 400, max: 2400 }
      );
      const redPercent = randomInt(20, 50);
      const red = Math.floor((total * redPercent) / 100);
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
          { upTo: 4, min: 5, max: 14 },
          { upTo: 5, min: 8, max: 20 },
        ],
        { upTo: 6, min: 10, max: 30 }
      );
      const perPage = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 4, max: 9 },
          { upTo: 4, min: 10, max: 25 },
          { upTo: 5, min: 15, max: 40 },
        ],
        { upTo: 6, min: 20, max: 60 }
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
          { upTo: 4, min: 5, max: 10 },
          { upTo: 5, min: 6, max: 14 },
        ],
        { upTo: 6, min: 8, max: 20 }
      );
      const peoplePerTrip = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 12, max: 36 },
          { upTo: 4, min: 30, max: 90 },
          { upTo: 5, min: 50, max: 180 },
        ],
        { upTo: 6, min: 80, max: 320 }
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
          { upTo: 4, min: 80, max: 300 },
          { upTo: 5, min: 200, max: 900 },
        ],
        { upTo: 6, min: 400, max: 1800 }
      );
      const back = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 8, max: 25 },
          { upTo: 4, min: 70, max: 280 },
          { upTo: 5, min: 180, max: 800 },
        ],
        { upTo: 6, min: 350, max: 1600 }
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
      const useAdvanced = grade >= 4;
      const venue = useAdvanced ? getAdvancedVenue() : null;
      const rows = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 2, max: 5 },
          { upTo: 4, min: 5, max: 12 },
          { upTo: 5, min: 8, max: 18 },
        ],
        { upTo: 6, min: 12, max: 28 }
      );
      const seatsPerRow = gradeRandomInt(
        grade,
        [
          { upTo: 3, min: 4, max: 8 },
          { upTo: 4, min: 8, max: 18 },
          { upTo: 5, min: 12, max: 28 },
        ],
        { upTo: 6, min: 18, max: 40 }
      );
      const total = rows * seatsPerRow;
      const maxEmpty = Math.max(2, Math.floor(total * 0.4));
      const empty = randomInt(2, maxEmpty);
      const answer = total - empty;

      const text = useAdvanced
        ? `If the school ${venue} has ${rows} rows with ${seatsPerRow} seats in each row and ${empty} seats are reserved for staff, how many seats remain for the audience?`
        : `A bus has ${rows} rows with ${seatsPerRow} seats in each row. ${empty} seats are empty. How many people are on the bus?`;

      return {
        text,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 4+: Advanced word-story templates. These add area/perimeter,
 * elapsed time, average, ratio, fraction-of, multi-step shopping, and
 * narrative-style problems with subordinate clauses and richer vocabulary.
 */
export const ADVANCED_STORIES: WordStoryTemplate[] = [
  // T4-AREA-1: Rectangle area in a school context (grade 4+)
  {
    generateProblem: (grade) => {
      const venue = getAdvancedVenue();
      const length = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 12, max: 35 },
          { upTo: 5, min: 20, max: 80 },
        ],
        { upTo: 6, min: 30, max: 150 }
      );
      const width = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 8, max: Math.min(25, length) },
          { upTo: 5, min: 12, max: Math.min(50, length) },
        ],
        { upTo: 6, min: 18, max: Math.min(90, length) }
      );
      const answer = length * width;

      return {
        text: `The ${venue} floor is being retiled. The room is ${length} meters long and ${width} meters wide. How many square meters of tile are needed to cover the entire floor?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
  // T4-AREA-2: Composite (L-shaped) area (grade 5+)
  {
    generateProblem: (grade) => {
      const aLen = gradeRandomInt(grade, [{ upTo: 5, min: 14, max: 40 }], {
        upTo: 6,
        min: 20,
        max: 80,
      });
      const aWid = gradeRandomInt(
        grade,
        [{ upTo: 5, min: 8, max: Math.min(25, aLen) }],
        { upTo: 6, min: 15, max: Math.min(60, aLen) }
      );
      const bLen = gradeRandomInt(
        grade,
        [{ upTo: 5, min: 6, max: Math.min(20, aLen - 2) }],
        { upTo: 6, min: 10, max: Math.min(45, aLen - 2) }
      );
      const bWid = gradeRandomInt(
        grade,
        [{ upTo: 5, min: 5, max: Math.min(15, aWid) }],
        { upTo: 6, min: 8, max: Math.min(35, aWid) }
      );
      const answer = aLen * aWid + bLen * bWid;

      return {
        text: `A community garden is shaped like the letter L. The longer rectangle is ${aLen} m by ${aWid} m, and the shorter rectangle attached to it is ${bLen} m by ${bWid} m. What is the total area of the garden in square meters?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
  // T4-ELAPSED-1: Elapsed time across the hour (grade 4+)
  {
    generateProblem: (grade) => {
      const venue = getAdvancedVenue();
      const duration = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 60, max: 180 },
          { upTo: 5, min: 90, max: 300 },
        ],
        { upTo: 6, min: 120, max: 480 }
      );
      // Pick a start time that fits in the day
      const dayMinutesMax = 21 * 60; // 21:00 latest end
      const earliestStart = 8 * 60;
      const latestStart = Math.max(
        earliestStart + 30,
        dayMinutesMax - duration
      );
      const startMinutes =
        earliestStart + randomInt(0, Math.max(0, latestStart - earliestStart));
      const snappedStart = Math.floor(startMinutes / 5) * 5;
      const endMinutes = snappedStart + duration;
      const startH = Math.floor(snappedStart / 60);
      const startM = snappedStart % 60;
      const endH = Math.floor(endMinutes / 60);
      const endM = endMinutes % 60;
      const startStr = `${startH}:${String(startM).padStart(2, '0')}`;
      const endStr = `${endH}:${String(endM).padStart(2, '0')}`;
      const answer = duration;

      return {
        text: `An orchestra rehearsal at the ${venue} started at ${startStr} and ended at ${endStr}. How many minutes did the rehearsal last?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
  // T4-AVG-1: Average (grade 5+)
  {
    generateProblem: (grade) => {
      const event = getAdvancedEvent();
      const numClasses = 4;
      const avg = gradeRandomInt(grade, [{ upTo: 5, min: 80, max: 260 }], {
        upTo: 6,
        min: 150,
        max: 900,
      });
      // Generate 4 values around avg whose mean = avg exactly
      const deltas = [
        randomInt(-20, 20),
        randomInt(-20, 20),
        randomInt(-20, 20),
      ];
      const fourth = -(deltas[0] + deltas[1] + deltas[2]);
      const values = [
        avg + deltas[0],
        avg + deltas[1],
        avg + deltas[2],
        avg + fourth,
      ].map((v) => Math.max(10, v));
      const sum = values.reduce((a, b) => a + b, 0);
      // Adjust to make exactly divisible if rounding moved it
      const answer = Math.floor(sum / numClasses);

      return {
        text: `During the ${event}, four classes raised $${values[0]}, $${values[1]}, $${values[2]}, and $${values[3]} for the school library. What was the average amount raised per class?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
  // T4-RATIO-1: Ratio scaling (grade 5+)
  {
    generateProblem: (grade) => {
      const event = getAdvancedEvent();
      const ratios: Array<[number, number]> = [
        [2, 3],
        [3, 4],
        [3, 5],
        [4, 5],
        [5, 6],
        [2, 5],
      ];
      const [rA, rB] = ratios[randomInt(0, ratios.length - 1)];
      const k = gradeRandomInt(grade, [{ upTo: 5, min: 12, max: 80 }], {
        upTo: 6,
        min: 25,
        max: 200,
      });
      const aCount = rA * k;
      const bCount = rB * k;
      const answer = bCount;

      return {
        text: `At the ${event}, the ratio of students to parents in the auditorium was ${rA} to ${rB}. If there were ${aCount} students, how many parents attended?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
  // T4-MULTI-1: Multi-step shopping (grade 4+)
  {
    generateProblem: (grade) => {
      const name = getAdvancedName();
      const pronouns = getPronouns(name);
      const itemObj = ADVANCED_ITEMS[randomInt(0, ADVANCED_ITEMS.length - 1)];
      // Pick a fixed-cost item that is NOT the same as the main item so the
      // sentence never asks about two of the same thing.
      const fixedItemPool = [
        'calculator',
        'science kit',
        'sketchbook',
        'pencil case',
      ] as const;
      const fixedItemCandidates = fixedItemPool.filter(
        (c) => c !== itemObj.singular
      );
      const fixedItem =
        fixedItemCandidates[randomInt(0, fixedItemCandidates.length - 1)];
      const price = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 2, max: 12 },
          { upTo: 5, min: 4, max: 25 },
        ],
        { upTo: 6, min: 8, max: 50 }
      );
      const quantity = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 2, max: 8 },
          { upTo: 5, min: 3, max: 12 },
        ],
        { upTo: 6, min: 4, max: 18 }
      );
      const fixedCost = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 5, max: 30 },
          { upTo: 5, min: 10, max: 60 },
        ],
        { upTo: 6, min: 20, max: 120 }
      );
      const spent = price * quantity + fixedCost;
      const budgetMin = spent + 5;
      const budget = Math.ceil(budgetMin / 10) * 10 + randomInt(0, 3) * 10;
      const answer = budget - spent;

      return {
        text: `${name} went to the school supply store with $${budget}. ${pronouns.subject} bought ${quantity} ${itemObj.plural} at $${price} each and one ${fixedItem} for $${fixedCost}. How much money did ${pronouns.lowerSubject} have left?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
  // T4-FRACTION-1: Fraction of a quantity (grade 4+)
  {
    generateProblem: (grade) => {
      const event = getAdvancedEvent();
      const fractions: Array<[number, number]> = [
        [1, 2],
        [1, 3],
        [2, 3],
        [1, 4],
        [3, 4],
        [1, 5],
        [2, 5],
        [3, 5],
        [1, 8],
        [3, 8],
        [5, 8],
        [1, 10],
        [3, 10],
        [7, 10],
      ];
      const [num, denom] = fractions[randomInt(0, fractions.length - 1)];
      const k = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 8, max: 40 },
          { upTo: 5, min: 20, max: 150 },
        ],
        { upTo: 6, min: 40, max: 400 }
      );
      const total = denom * k;
      const firstGroup = num * k;
      const answer = total - firstGroup;

      return {
        text: `Of the ${total} students who signed up for the ${event}, ${num}/${denom} chose basketball and the rest chose soccer. How many students chose soccer?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
  // T4-DIV-1: Sequenced narrative division (grade 4+)
  {
    generateProblem: (grade) => {
      const name = getAdvancedName();
      const pronouns = getPronouns(name);
      const divisor = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 6, max: 18 },
          { upTo: 5, min: 10, max: 35 },
        ],
        { upTo: 6, min: 15, max: 60 }
      );
      const quotient = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 8, max: 45 },
          { upTo: 5, min: 15, max: 90 },
        ],
        { upTo: 6, min: 25, max: 180 }
      );
      const total = divisor * quotient;
      const answer = quotient;

      return {
        text: `On Saturday morning, ${name} helped at the community library. ${pronouns.subject} sorted ${total} returned books into ${divisor} equal stacks before placing them on the shelves. How many books were in each stack?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
  // T4-EVENT-1: School festival multi-step (grade 4+)
  {
    generateProblem: (grade) => {
      const event = getAdvancedEvent();
      const morning = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 15, max: 60 },
          { upTo: 5, min: 40, max: 200 },
        ],
        { upTo: 6, min: 80, max: 500 }
      );
      const afternoon = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 15, max: 60 },
          { upTo: 5, min: 40, max: 200 },
        ],
        { upTo: 6, min: 80, max: 500 }
      );
      const perBox = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 10, max: 30 },
          { upTo: 5, min: 20, max: 60 },
        ],
        { upTo: 6, min: 30, max: 100 }
      );
      const answer = (morning + afternoon) * perBox;

      return {
        text: `At the ${event}, the cafeteria sold ${morning} boxes of cookies in the morning and ${afternoon} boxes in the afternoon. Each box contained ${perBox} cookies. How many cookies were sold in total during the event?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
  // T4-DIST-1: Three-leg round trip (grade 4+)
  {
    generateProblem: (grade) => {
      const venue = getAdvancedVenue();
      const leg1 = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 80, max: 600 },
          { upTo: 5, min: 200, max: 2000 },
        ],
        { upTo: 6, min: 500, max: 5000 }
      );
      const leg2 = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 80, max: 600 },
          { upTo: 5, min: 200, max: 2000 },
        ],
        { upTo: 6, min: 500, max: 5000 }
      );
      const leg3 = gradeRandomInt(
        grade,
        [
          { upTo: 4, min: 80, max: 600 },
          { upTo: 5, min: 200, max: 2000 },
        ],
        { upTo: 6, min: 500, max: 5000 }
      );
      const answer = leg1 + leg2 + leg3;

      return {
        text: `After the field trip to the museum, the school bus traveled ${leg1} meters from the ${venue} to the main road, then ${leg2} meters along the highway, and finally ${leg3} meters to the parking lot. How many meters did the bus travel in total?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 3-4: 2-3 digit × 1-digit multiplication (curriculum: G3 introduces
 * "2桁×1桁" / "3桁×1桁" hissan-style multiplication, beyond the 9×9 table).
 */
export const GRADE3_DIGIT_MULTIPLICATION_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const itemObj = getRandomItemPair();
      const twoDigit = gradeRandomInt(grade, [{ upTo: 3, min: 12, max: 99 }], {
        upTo: 6,
        min: 100,
        max: 400,
      });
      const oneDigit = randomInt(2, 9);
      const answer = twoDigit * oneDigit;

      return {
        text: `A pack has ${twoDigit} ${itemObj.plural}. There are ${oneDigit} packs. How many ${itemObj.plural} in total?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 4,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const perDay = gradeRandomInt(grade, [{ upTo: 3, min: 15, max: 95 }], {
        upTo: 6,
        min: 80,
        max: 350,
      });
      const days = randomInt(3, 9);
      const answer = perDay * days;

      return {
        text: `${name} saves ${perDay} yen every day. How much money does ${pronouns.lowerSubject} save in ${days} days?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 4,
    category: 'word-story',
  },
];

/**
 * Grade 3-4: Division with remainder (curriculum: G3 "あまりのある割り算").
 * Answer is a string in the form "q R r" (or just "q" if r === 0).
 */
export const DIVISION_REMAINDER_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const itemObj = getRandomItemPair();
      const pronouns = getPronouns(name);
      const d = randomInt(3, 9);
      const q = gradeRandomInt(grade, [{ upTo: 3, min: 4, max: 30 }], {
        upTo: 6,
        min: 8,
        max: 80,
      });
      const r = randomInt(1, d - 1);
      const dividend = d * q + r;
      const answer = formatRemainder(q, r);

      return {
        text: `${name} has ${dividend} ${itemObj.plural}. ${pronouns.subject} packs them into bags of ${d}. How many bags are full, and how many ${itemObj.plural} are left over?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 4,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const d = randomInt(3, 9);
      const q = gradeRandomInt(grade, [{ upTo: 3, min: 4, max: 20 }], {
        upTo: 6,
        min: 8,
        max: 60,
      });
      const r = randomInt(1, d - 1);
      const dividend = d * q + r;
      const answer = formatRemainder(q, r);

      return {
        text: `${dividend} cookies are shared equally among ${d} children. How many cookies does each child get, and how many are left over?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 4,
    category: 'word-story',
  },
];

/**
 * Grade 3-6: Unit-fraction problems (curriculum: G3 introduces 1/n as a way
 * to split a whole into equal parts). Answer is a count (number).
 */
export const UNIT_FRACTION_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const denom = randomInt(2, 6);
      const k = gradeRandomInt(grade, [{ upTo: 3, min: 3, max: 12 }], {
        upTo: 6,
        min: 10,
        max: 40,
      });
      const total = denom * k;
      const answer = k;

      return {
        text: `A ribbon is ${total} cm long. ${name} cuts it into ${denom} equal pieces. How long is one piece, in cm?`,
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
      const itemObj = getRandomItemPair();
      const pronouns = getPronouns(name);
      const denom = randomInt(2, 5);
      const k = gradeRandomInt(grade, [{ upTo: 3, min: 3, max: 12 }], {
        upTo: 6,
        min: 10,
        max: 40,
      });
      const total = denom * k;
      const answer = k;

      return {
        text: `${name} has ${total} ${itemObj.plural}. ${pronouns.subject} gives away 1/${denom} of them. How many ${itemObj.plural} did ${pronouns.lowerSubject} give away?`,
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
 * Grade 3-5: Tenths decimal addition / subtraction (curriculum: G3 introduces
 * 小数 to the 0.1 place; G4-5 extend it). Answer is a formatted decimal string.
 */
export const DECIMAL_ADD_SUB_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const a10 = gradeRandomInt(grade, [{ upTo: 3, min: 3, max: 90 }], {
        upTo: 5,
        min: 10,
        max: 400,
      });
      const b10 = gradeRandomInt(grade, [{ upTo: 3, min: 3, max: 90 }], {
        upTo: 5,
        min: 10,
        max: 400,
      });
      const a = formatDecimal(a10 / 10, 1);
      const b = formatDecimal(b10 / 10, 1);
      const answer = formatDecimal((a10 + b10) / 10, 1);

      return {
        text: `${name} drinks ${a} L of juice in the morning and ${b} L in the afternoon. How many liters does ${pronouns.lowerSubject} drink in total?`,
        answer,
        operation: 'addition' as Operation,
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
      const total10 = gradeRandomInt(grade, [{ upTo: 3, min: 20, max: 95 }], {
        upTo: 5,
        min: 50,
        max: 500,
      });
      const used10 = randomInt(5, total10 - 3);
      const totalStr = formatDecimal(total10 / 10, 1);
      const usedStr = formatDecimal(used10 / 10, 1);
      const answer = formatDecimal((total10 - used10) / 10, 1);

      return {
        text: `${name} has ${totalStr} m of string. ${pronouns.subject} uses ${usedStr} m. How many meters of string are left?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 3,
    maxGrade: 5,
    category: 'word-story',
  },
];

/**
 * Grade 4-6: Same-denominator fraction addition / subtraction (curriculum:
 * G4 "同分母の分数の加減"). G4 keeps results unreduced; G5+ reduces.
 */
export const FRACTION_SAME_DENOM_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name1 = getRandomName();
      const name2 = getDifferentName(name1);
      const denom = randomInt(3, 8);
      const a = randomInt(1, denom - 2);
      const b = randomInt(1, denom - a - 1);
      const sum = a + b;
      const { n, d } =
        grade >= 5 ? reduceFraction(sum, denom) : { n: sum, d: denom };
      const answer = formatFraction(n, d);

      return {
        text: `${name1} ate ${a}/${denom} of a pizza and ${name2} ate ${b}/${denom} of the same pizza. How much pizza did they eat altogether?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const denom = randomInt(3, 8);
      const a = randomInt(2, denom - 1);
      const b = randomInt(1, a - 1);
      const diff = a - b;
      const { n, d } =
        grade >= 5 ? reduceFraction(diff, denom) : { n: diff, d: denom };
      const answer = formatFraction(n, d);

      return {
        text: `${name} had ${a}/${denom} of a chocolate bar. ${pronouns.subject} ate ${b}/${denom} of the bar. How much chocolate is left?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 4-6: Decimal × integer and decimal ÷ integer
 * (curriculum: G4 "小数 × ÷ 整数"). Answers are decimal strings.
 */
export const DECIMAL_INT_OP_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const dec10 = gradeRandomInt(grade, [{ upTo: 4, min: 2, max: 90 }], {
        upTo: 6,
        min: 10,
        max: 250,
      });
      const k = gradeRandomInt(grade, [{ upTo: 4, min: 2, max: 9 }], {
        upTo: 6,
        min: 3,
        max: 25,
      });
      const decStr = formatDecimal(dec10 / 10, 1);
      const answer = formatDecimal((dec10 * k) / 10, 1);

      return {
        text: `One bottle holds ${decStr} L of water. There are ${k} bottles. How many liters of water are there in total?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 4,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const divisor = gradeRandomInt(grade, [{ upTo: 4, min: 2, max: 9 }], {
        upTo: 6,
        min: 3,
        max: 25,
      });
      const quotient10 = gradeRandomInt(grade, [{ upTo: 4, min: 2, max: 90 }], {
        upTo: 6,
        min: 10,
        max: 250,
      });
      const dividend10 = quotient10 * divisor;
      const dividendStr = formatDecimal(dividend10 / 10, 1);
      const answer = formatDecimal(quotient10 / 10, 1);

      return {
        text: `${dividendStr} L of juice is poured equally into ${divisor} cups. How many liters are in each cup?`,
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
 * Grade 5-6: Decimal × decimal and decimal ÷ decimal
 * (curriculum: G5 "小数 × 小数 / 小数 ÷ 小数"). Answers are decimal strings.
 */
export const DECIMAL_DECIMAL_OP_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const a10 = gradeRandomInt(grade, [{ upTo: 5, min: 12, max: 50 }], {
        upTo: 6,
        min: 15,
        max: 90,
      });
      const b10 = gradeRandomInt(grade, [{ upTo: 5, min: 8, max: 40 }], {
        upTo: 6,
        min: 10,
        max: 70,
      });
      const aStr = formatDecimal(a10 / 10, 1);
      const bStr = formatDecimal(b10 / 10, 1);
      const answer = formatDecimal((a10 * b10) / 100, 2);

      return {
        text: `A rectangular tile is ${aStr} m long and ${bStr} m wide. What is its area in square meters?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const q10 = gradeRandomInt(grade, [{ upTo: 5, min: 12, max: 50 }], {
        upTo: 6,
        min: 15,
        max: 90,
      });
      const b10 = gradeRandomInt(grade, [{ upTo: 5, min: 12, max: 40 }], {
        upTo: 6,
        min: 15,
        max: 70,
      });
      const dividend100 = q10 * b10;
      const dividendStr = formatDecimal(dividend100 / 100, 2);
      const bStr = formatDecimal(b10 / 10, 1);
      const answer = formatDecimal(q10 / 10, 1);

      return {
        text: `A garden has area ${dividendStr} square meters. It is ${bStr} m wide. How many meters long is it?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 5-6: Different-denominator fraction addition / subtraction
 * (curriculum: G5 "異分母の分数の加減"). Answers are reduced fractions.
 */
export const FRACTION_DIFF_DENOM_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: () => {
      const denomPairs: Array<[number, number]> = [
        [2, 3],
        [2, 5],
        [3, 4],
        [3, 6],
        [4, 6],
        [3, 9],
        [4, 8],
      ];
      const [d1, d2] = denomPairs[randomInt(0, denomPairs.length - 1)];
      const lcm = (d1 * d2) / gcd(d1, d2);
      // Pick numerators so the sum stays within one whole wall
      // (a/d1 + b/d2 <= 1). 1/d1 + 1/d2 is always <= 1 for d1, d2 >= 2 with
      // (d1, d2) != (2, 2), so the (1, 1) default is always safe here.
      let a = 1;
      let b = 1;
      let attempts = 0;
      while (attempts < 20) {
        const testA = randomInt(1, d1 - 1);
        const testB = randomInt(1, d2 - 1);
        if (testA * (lcm / d1) + testB * (lcm / d2) <= lcm) {
          a = testA;
          b = testB;
          break;
        }
        attempts++;
      }
      const sumNum = a * (lcm / d1) + b * (lcm / d2);
      const { n, d } = reduceFraction(sumNum, lcm);
      const answer = formatFraction(n, d);
      const name = getRandomName();

      return {
        text: `${name} painted ${a}/${d1} of a wall in the morning and ${b}/${d2} of the same wall in the afternoon. What fraction of the wall is painted now?`,
        answer,
        operation: 'addition' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: () => {
      const denomPairs: Array<[number, number]> = [
        [2, 3],
        [3, 4],
        [3, 6],
        [4, 6],
        [4, 8],
        [3, 9],
      ];
      const [d1, d2] = denomPairs[randomInt(0, denomPairs.length - 1)];
      const lcm = (d1 * d2) / gcd(d1, d2);
      // Pick numerators so first fraction strictly exceeds the second.
      // Safe default: a = d1 - 1, b = 1 guarantees a/d1 >= 1/2 and
      // b/d2 <= 1/3 for the denomPairs above, so a/d1 > b/d2 always holds.
      let a = d1 - 1;
      let b = 1;
      let attempts = 0;
      while (attempts < 20) {
        const testA = randomInt(d1 === 2 ? 1 : 2, d1 - 1);
        const testB = randomInt(1, d2 - 1);
        if (testA * (lcm / d1) > testB * (lcm / d2)) {
          a = testA;
          b = testB;
          break;
        }
        attempts++;
      }
      const diffNum = a * (lcm / d1) - b * (lcm / d2);
      const { n, d } = reduceFraction(diffNum, lcm);
      const answer = formatFraction(n, d);
      const name = getRandomName();

      return {
        text: `${name} had ${a}/${d1} of a cake. ${getSubjectPronoun(name)} ate ${b}/${d2} of the same cake. How much cake is left?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 5-6: Speed / distance / time problems (curriculum: G5 "速さ").
 * Three variants: find distance, find time, find speed.
 * Answers are numbers (selected so divisions terminate exactly).
 */
export const SPEED_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const speed = gradeRandomInt(grade, [{ upTo: 5, min: 20, max: 70 }], {
        upTo: 6,
        min: 30,
        max: 110,
      });
      const time = randomInt(2, 6);
      const answer = speed * time;

      return {
        text: `A car travels at ${speed} km/h for ${time} hours. How far does it go, in km?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const speed = gradeRandomInt(grade, [{ upTo: 5, min: 40, max: 90 }], {
        upTo: 6,
        min: 50,
        max: 120,
      });
      const minutes = randomInt(3, 12);
      const distance = speed * minutes;
      const answer = minutes;

      return {
        text: `${name} walks ${distance} m to school at ${speed} m per minute. How many minutes does ${pronouns.lowerSubject} take?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const speed = gradeRandomInt(grade, [{ upTo: 5, min: 30, max: 80 }], {
        upTo: 6,
        min: 40,
        max: 120,
      });
      const time = randomInt(2, 6);
      const distance = speed * time;
      const answer = speed;

      return {
        text: `A train covers ${distance} km in ${time} hours. What is its speed, in km/h?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 5-6: Percent / ratio "of-a-quantity" problems
 * (curriculum: G5 "百分率 / 割合").
 */
export const PERCENT_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: (grade) => {
      const name = getRandomName();
      const itemObj = getRandomItemPair();
      const base = gradeRandomInt(grade, [{ upTo: 5, min: 50, max: 500 }], {
        upTo: 6,
        min: 100,
        max: 1500,
      });
      const baseRounded = Math.round(base / 10) * 10;
      const percents = [10, 20, 25, 50, 75, 80];
      const p = percents[randomInt(0, percents.length - 1)];
      // Ensure base * p is divisible by 100 for a clean integer answer.
      const finalBase =
        (baseRounded * p) % 100 === 0
          ? baseRounded
          : Math.round(baseRounded / 100) * 100 || 100;
      const answer = (finalBase * p) / 100;

      return {
        text: `${name} has ${finalBase} ${itemObj.plural}. ${p}% of them are red. How many red ${itemObj.plural} are there?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: (grade) => {
      const baseHundreds = gradeRandomInt(
        grade,
        [{ upTo: 5, min: 1, max: 5 }],
        { upTo: 6, min: 2, max: 12 }
      );
      const base = baseHundreds * 100;
      const percents = [10, 20, 25, 40, 60, 75];
      const p = percents[randomInt(0, percents.length - 1)];
      const present = (base * p) / 100;
      const answer = base - present;

      return {
        text: `A class has ${base} students. ${p}% of them are present today. How many students are absent?`,
        answer,
        operation: 'subtraction' as Operation,
      };
    },
    minGrade: 5,
    maxGrade: 6,
    category: 'word-story',
  },
];

/**
 * Grade 6: Fraction × fraction and fraction ÷ fraction
 * (curriculum: G6 "分数 × 分数 / 分数 ÷ 分数"). Answers are reduced fractions.
 */
export const FRACTION_MUL_DIV_STORIES: WordStoryTemplate[] = [
  {
    generateProblem: () => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const b = randomInt(2, 6);
      const a = randomInt(1, b - 1);
      const d = randomInt(2, 6);
      const c = randomInt(1, d - 1);
      const { n: rn, d: rd } = reduceFraction(a * c, b * d);
      const answer = formatFraction(rn, rd);

      return {
        text: `A recipe uses ${a}/${b} cup of flour. ${name} wants to make ${c}/${d} of the recipe. How much flour does ${pronouns.lowerSubject} need, in cups?`,
        answer,
        operation: 'multiplication' as Operation,
      };
    },
    minGrade: 6,
    maxGrade: 6,
    category: 'word-story',
  },
  {
    generateProblem: () => {
      const name = getRandomName();
      const pronouns = getPronouns(name);
      const b = randomInt(2, 6);
      const a = randomInt(1, b - 1);
      const d = randomInt(2, 6);
      const c = randomInt(1, d - 1);
      // Dividing a/b by c/d = (a*d) / (b*c).
      const { n: rn, d: rd } = reduceFraction(a * d, b * c);
      const answer = formatFraction(rn, rd);

      return {
        text: `${name} has ${a}/${b} of a meter of ribbon. ${pronouns.subject} cuts it into pieces that are ${c}/${d} of a meter each. How many pieces does ${pronouns.lowerSubject} get?`,
        answer,
        operation: 'division' as Operation,
      };
    },
    minGrade: 6,
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
    ...GRADE3_DIGIT_MULTIPLICATION_STORIES,
    ...DIVISION_STORIES,
    ...DIVISION_REMAINDER_STORIES,
    ...UNIT_FRACTION_STORIES,
    ...DECIMAL_ADD_SUB_STORIES,
    ...FRACTION_SAME_DENOM_STORIES,
    ...DECIMAL_INT_OP_STORIES,
    ...DECIMAL_DECIMAL_OP_STORIES,
    ...FRACTION_DIFF_DENOM_STORIES,
    ...SPEED_STORIES,
    ...PERCENT_STORIES,
    ...FRACTION_MUL_DIV_STORIES,
    ...COMPARISON_STORIES,
    ...TIME_STORIES,
    ...MONEY_STORIES,
    ...MEASUREMENT_STORIES,
    ...MIXED_OPERATION_STORIES,
    ...PATTERN_STORIES,
    ...GEOMETRY_STORIES,
    ...COLLECTION_STORIES,
    ...TRAVEL_STORIES,
    ...ADVANCED_STORIES,
  ];

  allStories.forEach((story) => {
    if (grade >= story.minGrade && grade <= story.maxGrade) {
      stories.push(story);
    }
  });

  return stories;
}
