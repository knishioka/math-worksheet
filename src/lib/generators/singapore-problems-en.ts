import type {
  Grade,
  Operation,
  SingaporeProblem,
  BarModelPartWholeDiagram,
  BarModelComparisonDiagram,
  NumberBondDiagram,
  ComparisonDiagram,
} from '../../types';
import { generateId, randomInt } from '../utils/math';
import { assertValidProblem } from './assertions';

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

function pickDifferentName(names: string[], firstName: string): string {
  if (names.length <= 1) {
    return firstName;
  }

  let secondName = firstName;
  while (secondName === firstName) {
    secondName = names[randomInt(0, names.length - 1)];
  }

  return secondName;
}

type FractionUsageStep = {
  usedFirst: number;
  usedSecond: number;
  remainingAfterSecond: number;
};

export function calculateSequentialFractionUsage(
  total: number,
  scenario: FractionScenario
): FractionUsageStep | null {
  const usedFirst =
    (total * scenario.fraction1Numerator) / scenario.fraction1Denominator;
  if (!Number.isInteger(usedFirst)) {
    return null;
  }

  const remainingAfterFirst = total - usedFirst;
  const usedSecond =
    (remainingAfterFirst * scenario.fraction2Numerator) /
    scenario.fraction2Denominator;
  if (!Number.isInteger(usedSecond)) {
    return null;
  }

  const remainingAfterSecond = remainingAfterFirst - usedSecond;
  if (!Number.isInteger(remainingAfterSecond) || remainingAfterSecond <= 0) {
    return null;
  }

  return {
    usedFirst,
    usedSecond,
    remainingAfterSecond,
  };
}

function pickValidSequentialTotal(
  scenario: FractionScenario,
  multiplierMin: number,
  multiplierMax: number
): { total: number; usage: FractionUsageStep } {
  const validTotals: { total: number; usage: FractionUsageStep }[] = [];

  for (
    let multiplier = multiplierMin;
    multiplier <= multiplierMax;
    multiplier++
  ) {
    const total = scenario.lcm * multiplier;
    const usage = calculateSequentialFractionUsage(total, scenario);
    if (usage) {
      validTotals.push({ total, usage });
    }
  }

  if (validTotals.length === 0) {
    let multiplier = Math.max(1, multiplierMax + 1);
    while (true) {
      const total = scenario.lcm * multiplier;
      const usage = calculateSequentialFractionUsage(total, scenario);
      if (usage) {
        return { total, usage };
      }
      multiplier++;
    }
  }

  return validTotals[randomInt(0, validTotals.length - 1)];
}

/**
 * Part-whole and comparison bar model problems with visual diagrams.
 */
export function generateSingaporeBarModel(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const names = ['Aiden', 'Maya', 'Noah', 'Emma', 'Liam', 'Zoe'];
  const items = ['stickers', 'marbles', 'books', 'cards', 'erasers'];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    const item = items[randomInt(0, items.length - 1)];

    if (problemType === 0) {
      // Part-whole bar model
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
        // Ask for total: hide totalValue, show both segments
        const diagram: BarModelPartWholeDiagram = {
          diagramType: 'bar-model',
          variant: 'part-whole',
          totalValue: total,
          segments: [{ value: part }, { value: remaining }],
          hidden: 'total',
        };
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'addition' as Operation,
          problemText: `How many ${item} are there in all?`,
          answer: total,
          category: 'bar-model',
          diagram,
          showCalculation: true,
          language: 'en',
        });
      } else {
        // Ask for a part: hide segment[1], show total and segment[0]
        const nameA = names[randomInt(0, names.length - 1)];
        const diagram: BarModelPartWholeDiagram = {
          diagramType: 'bar-model',
          variant: 'part-whole',
          totalValue: total,
          segments: [{ value: part, label: 'red' }, { value: remaining }],
          hidden: 1,
        };
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `${nameA} has ${total} ${item}. ${part} are red. How many are not red?`,
          answer: remaining,
          category: 'bar-model',
          diagram,
          showCalculation: true,
          language: 'en',
        });
      }
    } else {
      // Comparison bar model
      const nameA = names[randomInt(0, names.length - 1)];
      const nameB = pickDifferentName(names, nameA);
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
        // Ask how many nameA has: hide nameA's bar (index 0), show nameB and difference
        const diagram: BarModelComparisonDiagram = {
          diagramType: 'bar-model',
          variant: 'comparison',
          bars: [
            { value: bigger, label: nameA },
            { value: smaller, label: nameB },
          ],
          differenceValue: difference,
          hidden: 0,
        };
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'addition' as Operation,
          problemText: `${nameB} has ${smaller} ${item}. ${nameA} has ${difference} more. How many does ${nameA} have?`,
          answer: bigger,
          category: 'bar-model',
          diagram,
          showCalculation: true,
          language: 'en',
        });
      } else {
        // Ask for the difference: hide difference, show both bars
        const diagram: BarModelComparisonDiagram = {
          diagramType: 'bar-model',
          variant: 'comparison',
          bars: [
            { value: bigger, label: nameA },
            { value: smaller, label: nameB },
          ],
          differenceValue: difference,
          hidden: 'difference',
        };
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `How many more ${item} does ${nameA} have than ${nameB}?`,
          answer: difference,
          category: 'bar-model',
          diagram,
          showCalculation: true,
          language: 'en',
        });
      }
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-bar-model'));
  return problems;
}

/**
 * Number bond decomposition problems with visual diagrams.
 */
export function generateSingaporeNumberBond(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];

  for (let i = 0; i < count; i++) {
    const maxProblemType = grade <= 2 ? 1 : 2;
    const problemType = randomInt(0, maxProblemType);

    if (problemType === 0) {
      // Simple 2-part bond
      const totalRange = getGradeRange(
        grade,
        { min: 10, max: 40 },
        { min: 30, max: 200 },
        { min: 120, max: 500 }
      );
      const total = randomInt(totalRange.min, totalRange.max);
      const part = randomInt(5, Math.max(6, total - 5));
      const missingPart = total - part;

      const diagram: NumberBondDiagram = {
        diagramType: 'number-bond',
        whole: total,
        parts: [part, missingPart],
        hidden: 1,
      };

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'subtraction' as Operation,
        problemText: `What is the missing number in the number bond?`,
        answer: missingPart,
        category: 'number-bond',
        diagram,
        showCalculation: false,
        language: 'en',
      });
      continue;
    }

    if (problemType === 1) {
      // Place value decomposition
      const base = getGradeRange(
        grade,
        { min: 10, max: 99 },
        { min: 100, max: 900 },
        { min: 1000, max: 9000 }
      );
      // Ensure the hidden part (ones digit) is non-zero
      let value = randomInt(base.min, base.max);
      while (value % 10 === 0) {
        value = randomInt(base.min, base.max);
      }

      if (grade <= 2) {
        const tens = Math.floor(value / 10) * 10;
        const ones = value % 10;

        const diagram: NumberBondDiagram = {
          diagramType: 'number-bond',
          whole: value,
          parts: [tens, ones],
          hidden: 1,
        };

        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'addition' as Operation,
          problemText: `What is the missing part of ${value}?`,
          answer: ones,
          category: 'number-bond',
          diagram,
          showCalculation: false,
          language: 'en',
        });
      } else {
        const hundreds = Math.floor(value / 100) * 100;
        const tens = Math.floor((value % 100) / 10) * 10;
        const ones = value % 10;

        const diagram: NumberBondDiagram = {
          diagramType: 'number-bond',
          whole: value,
          parts: [hundreds, tens, ones],
          hidden: 2,
        };

        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'addition' as Operation,
          problemText: `What is the missing part of ${value}?`,
          answer: ones,
          category: 'number-bond',
          diagram,
          showCalculation: false,
          language: 'en',
        });
      }
      continue;
    }

    // 3-part bond (grade 3+)
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

    const diagram: NumberBondDiagram = {
      diagramType: 'number-bond',
      whole: total,
      parts: [partA, partB, missingPart],
      hidden: 2,
    };

    problems.push({
      id: generateId(),
      type: 'singapore',
      operation: 'subtraction' as Operation,
      problemText: `Find the missing part in the number bond.`,
      answer: missingPart,
      category: 'number-bond',
      diagram,
      showCalculation: false,
      language: 'en',
    });
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-number-bond'));
  return problems;
}

/**
 * Comparison problems with visual diagrams.
 * Grade 2 uses additive comparison, Grade 3+ uses multiplicative comparison.
 */
export function generateSingaporeComparison(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const subjects = ['pencils', 'marbles', 'stickers', 'toy cars', 'notebooks'];
  const names = ['Ryan', 'Chloe', 'Ethan', 'Sofia', 'Lucas', 'Mia'];

  for (let i = 0; i < count; i++) {
    const subject = subjects[randomInt(0, subjects.length - 1)];

    if (grade <= 2) {
      // Additive comparison
      const nameA = names[randomInt(0, names.length - 1)];
      const nameB = pickDifferentName(names, nameA);
      const smallerRange = getGradeRange(
        grade,
        { min: 8, max: 30 },
        { min: 20, max: 90 },
        { min: 60, max: 180 }
      );
      const smaller = randomInt(smallerRange.min, smallerRange.max);
      const difference = randomInt(2, Math.max(3, Math.floor(smaller * 0.6)));
      const bigger = smaller + difference;
      const askBigger = randomInt(0, 1) === 1;

      if (askBigger) {
        // Ask for bigger: hide bar[0] (the bigger one)
        const diagram: ComparisonDiagram = {
          diagramType: 'comparison',
          bars: [
            { label: nameB, value: bigger },
            { label: nameA, value: smaller },
          ],
          differenceValue: difference,
          hidden: 0,
        };
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'addition' as Operation,
          problemText: `${nameA} has ${smaller} ${subject}. ${nameB} has ${difference} more. How many does ${nameB} have?`,
          answer: bigger,
          category: 'comparison',
          diagram,
          showCalculation: true,
          language: 'en',
        });
      } else {
        // Ask for smaller: hide bar[1] (the smaller one)
        const diagram: ComparisonDiagram = {
          diagramType: 'comparison',
          bars: [
            { label: nameB, value: bigger },
            { label: nameA, value: smaller },
          ],
          differenceValue: difference,
          hidden: 1,
        };
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `${nameB} has ${bigger} ${subject}. ${nameA} has ${difference} fewer. How many does ${nameA} have?`,
          answer: smaller,
          category: 'comparison',
          diagram,
          showCalculation: true,
          language: 'en',
        });
      }
      continue;
    }

    // Multiplicative comparison (grade 3+)
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
    let text: string;
    // Ask for the result (bigger bar): hide bar[0]
    let bars: ComparisonDiagram['bars'];
    if (variant === 0) {
      const nameA = names[randomInt(0, names.length - 1)];
      const nameB = pickDifferentName(names, nameA);
      bars = [
        { label: nameB, value: result },
        { label: nameA, value: baseAmount },
      ];
      text = `${nameA} has ${baseAmount} ${subject}. ${nameB} has ${multiplier} times as many. How many does ${nameB} have?`;
    } else {
      bars = [
        { label: 'Big box', value: result },
        { label: 'Small box', value: baseAmount },
      ];
      text = `One box has ${baseAmount} crayons. A big box has ${multiplier} times as many. How many crayons are in the big box?`;
    }
    const diagram: ComparisonDiagram = {
      diagramType: 'comparison',
      bars,
      differenceValue: result - baseAmount,
      multiplicative: true,
      multiplier,
      hidden: 0,
    };

    problems.push({
      id: generateId(),
      type: 'singapore',
      operation: 'multiplication' as Operation,
      problemText: text,
      answer: result,
      category: 'comparison',
      diagram,
      showCalculation: true,
      language: 'en',
    });
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-comparison'));
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
 * Multi-step word problems with fractions (text-only, no diagram).
 */
export function generateSingaporeMultiStep(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
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
    const { total, usage } = pickValidSequentialTotal(
      scenario,
      multiplierRange.min,
      multiplierRange.max
    );
    const remaining = usage.remainingAfterSecond;

    const problemType = randomInt(0, 1);
    if (problemType === 0) {
      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'subtraction' as Operation,
        problemText: `A container has ${total} ${context}. In the morning, ${scenario.fraction1Numerator}/${scenario.fraction1Denominator} is used. In the afternoon, ${scenario.fraction2Numerator}/${scenario.fraction2Denominator} of the remaining amount is used. How much ${context} is left?`,
        answer: remaining,
        category: 'multi-step',
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
      type: 'singapore',
      operation: 'division' as Operation,
      problemText: `There are ${total} ${context} in a box. First, ${scenario.fraction1Numerator}/${scenario.fraction1Denominator} of them are used. Then ${scenario.fraction2Numerator}/${scenario.fraction2Denominator} of the remaining amount is used. The rest are shared equally among ${groups} students. How many ${context} does each student get?`,
      answer: eachShare,
      category: 'multi-step',
      showCalculation: true,
      language: 'en',
    });
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-multi-step'));
  return problems;
}

// ── Grade 4+ generators ──────────────────────────────────────────────

/**
 * Fraction of a set and equivalent fractions (Primary 4+).
 */
export function generateSingaporeFractionSet(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const items = ['marbles', 'stickers', 'pencils', 'books', 'cookies'];
  const names = ['Aiden', 'Maya', 'Noah', 'Emma', 'Liam', 'Zoe'];

  const denominators =
    grade <= 4 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 8, 10, 12];

  for (let i = 0; i < count; i++) {
    const item = items[randomInt(0, items.length - 1)];
    const name = names[randomInt(0, names.length - 1)];
    const problemType = randomInt(0, 1);

    if (problemType === 0) {
      // Fraction of a set: find N/D of total
      const denom = denominators[randomInt(0, denominators.length - 1)];
      const numer = randomInt(1, denom - 1);
      const multiplierRange = getGradeRange(
        grade,
        { min: 2, max: 5 },
        { min: 3, max: 10 },
        { min: 5, max: 20 }
      );
      const multiplier = randomInt(multiplierRange.min, multiplierRange.max);
      const total = denom * multiplier;
      const answer = numer * multiplier;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'multiplication' as Operation,
        problemText: `${name} has ${total} ${item}. What is ${numer}/${denom} of the ${item}?`,
        answer,
        category: 'fraction-set',
        showCalculation: true,
        language: 'en',
      });
    } else {
      // Equivalent fractions: find missing numerator or denominator
      const denom1 = denominators[randomInt(0, denominators.length - 1)];
      const numer1 = randomInt(1, denom1 - 1);
      const scale = randomInt(2, grade <= 4 ? 4 : 6);
      const denom2 = denom1 * scale;
      const numer2 = numer1 * scale;
      const askNumerator = randomInt(0, 1) === 1;

      if (askNumerator) {
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'multiplication' as Operation,
          problemText: `Find the missing number: ${numer1}/${denom1} = ?/${denom2}`,
          answer: numer2,
          category: 'fraction-set',
          showCalculation: true,
          language: 'en',
        });
      } else {
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'multiplication' as Operation,
          problemText: `Find the missing number: ${numer1}/${denom1} = ${numer2}/?`,
          answer: denom2,
          category: 'fraction-set',
          showCalculation: true,
          language: 'en',
        });
      }
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-fraction-set'));
  return problems;
}

/**
 * Decimal addition and subtraction word problems (Primary 4+).
 */
export function generateSingaporeDecimal(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const names = ['Aiden', 'Maya', 'Noah', 'Emma', 'Liam', 'Zoe'];
  const contexts: Array<{ item: string; unit: string }> = [
    { item: 'water', unit: 'litres' },
    { item: 'ribbon', unit: 'metres' },
    { item: 'flour', unit: 'kg' },
    { item: 'rope', unit: 'metres' },
    { item: 'juice', unit: 'litres' },
  ];

  for (let i = 0; i < count; i++) {
    const ctx = contexts[randomInt(0, contexts.length - 1)];
    const nameA = names[randomInt(0, names.length - 1)];
    const nameB = pickDifferentName(names, nameA);
    const isAddition = randomInt(0, 1) === 1;

    // Generate decimals with 1 or 2 decimal places
    const places = grade <= 4 ? 1 : randomInt(1, 2);
    const factor = places === 1 ? 10 : 100;
    const maxRange = getGradeRange(
      grade,
      { min: 20, max: 50 },
      { min: 30, max: 100 },
      { min: 50, max: 200 }
    );

    if (isAddition) {
      const aInt = randomInt(10, maxRange.max);
      const bInt = randomInt(10, maxRange.max);
      const a = aInt / factor;
      const b = bInt / factor;
      const answer = Math.round((a + b) * factor) / factor;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'addition' as Operation,
        problemText: `${nameA} has ${a} ${ctx.unit} of ${ctx.item}. ${nameB} has ${b} ${ctx.unit}. How many ${ctx.unit} do they have altogether?`,
        answer,
        category: 'decimal',
        showCalculation: true,
        language: 'en',
      });
    } else {
      const bInt = randomInt(10, Math.floor(maxRange.max * 0.6));
      const aInt = bInt + randomInt(5, Math.floor(maxRange.max * 0.4));
      const a = aInt / factor;
      const b = bInt / factor;
      const answer = Math.round((a - b) * factor) / factor;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'subtraction' as Operation,
        problemText: `${nameA} has ${a} ${ctx.unit} of ${ctx.item}. ${nameA} gives ${b} ${ctx.unit} to ${nameB}. How many ${ctx.unit} does ${nameA} have left?`,
        answer,
        category: 'decimal',
        showCalculation: true,
        language: 'en',
      });
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-decimal'));
  return problems;
}

// ── Grade 5+ generators ──────────────────────────────────────────────

/**
 * Ratio and proportion problems (Primary 5+).
 */
export function generateSingaporeRatio(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const names = ['Ryan', 'Chloe', 'Ethan', 'Sofia', 'Lucas', 'Mia'];
  const items = ['marbles', 'stickers', 'beads', 'cards', 'stamps'];

  for (let i = 0; i < count; i++) {
    const item = items[randomInt(0, items.length - 1)];
    const nameA = names[randomInt(0, names.length - 1)];
    const nameB = pickDifferentName(names, nameA);
    const problemType = randomInt(0, 2);

    if (problemType === 0) {
      // Given ratio and one quantity, find the other
      const ratioA = randomInt(2, grade <= 5 ? 5 : 8);
      const ratioB = randomInt(2, grade <= 5 ? 5 : 8);
      const multiplier = randomInt(2, grade <= 5 ? 6 : 10);
      const quantityA = ratioA * multiplier;
      const quantityB = ratioB * multiplier;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'multiplication' as Operation,
        problemText: `The ratio of ${nameA}'s ${item} to ${nameB}'s ${item} is ${ratioA} : ${ratioB}. If ${nameA} has ${quantityA} ${item}, how many does ${nameB} have?`,
        answer: quantityB,
        category: 'ratio',
        showCalculation: true,
        language: 'en',
      });
    } else if (problemType === 1) {
      // Given ratio and total, find one quantity
      const ratioA = randomInt(2, 5);
      const ratioB = randomInt(2, 5);
      const multiplier = randomInt(3, grade <= 5 ? 8 : 12);
      const total = (ratioA + ratioB) * multiplier;
      const quantityA = ratioA * multiplier;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `${nameA} and ${nameB} share ${total} ${item} in the ratio ${ratioA} : ${ratioB}. How many ${item} does ${nameA} get?`,
        answer: quantityA,
        category: 'ratio',
        showCalculation: true,
        language: 'en',
      });
    } else {
      // Simplify a ratio
      const gcdBase = randomInt(2, grade <= 5 ? 5 : 8);
      const a = randomInt(2, 5);
      const b = randomInt(2, 5);
      const bigA = a * gcdBase;
      const bigB = b * gcdBase;
      // a and b may share a common factor, so reduce to true simplest form
      const commonFactor = gcd(a, b);
      const simplifiedA = a / commonFactor;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `Simplify the ratio ${bigA} : ${bigB}. What is the first term in the simplest form?`,
        answer: simplifiedA,
        category: 'ratio',
        showCalculation: true,
        language: 'en',
      });
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-ratio'));
  return problems;
}

/**
 * Percentage problems (Primary 5+).
 */
export function generateSingaporePercentage(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const names = ['Aiden', 'Maya', 'Noah', 'Emma', 'Liam', 'Zoe'];

  const percentages =
    grade <= 5
      ? [10, 20, 25, 50, 75]
      : [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80];

  for (let i = 0; i < count; i++) {
    const name = names[randomInt(0, names.length - 1)];
    const problemType = randomInt(0, 1);

    if (problemType === 0) {
      // Find X% of a number
      const percent = percentages[randomInt(0, percentages.length - 1)];
      // Ensure whole number answer: total must be divisible by (100/gcd(percent,100))
      const base = 100 / gcd(percent, 100);
      const multiplier = randomInt(grade <= 5 ? 1 : 2, grade <= 5 ? 8 : 15);
      const total = base * multiplier;
      const answer = (total * percent) / 100;

      const contexts = [
        `${name} scored ${percent}% on a test with ${total} questions. How many questions did ${name} get right?`,
        `A shop gives a ${percent}% discount on a $${total} item. How much is the discount?`,
        `${name} saved ${percent}% of $${total}. How much did ${name} save?`,
      ];
      const text = contexts[randomInt(0, contexts.length - 1)];

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'multiplication' as Operation,
        problemText: text,
        answer,
        category: 'percentage',
        showCalculation: true,
        language: 'en',
      });
    } else {
      // Find what percentage one number is of another
      // Constructive: pick percent, compute base that guarantees integer part
      const percent = percentages[randomInt(0, percentages.length - 1)];
      const base = 100 / gcd(percent, 100);
      const multiplier = randomInt(grade <= 5 ? 1 : 2, grade <= 5 ? 5 : 10);
      const total = base * multiplier;
      const part = (total * percent) / 100;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `${name} answered ${part} out of ${total} questions correctly. What percentage is that?`,
        answer: percent,
        category: 'percentage',
        showCalculation: true,
        language: 'en',
      });
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-percentage'));
  return problems;
}

function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Speed, distance, and time problems (Primary 5+).
 */
export function generateSingaporeRate(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const names = ['Ryan', 'Chloe', 'Ethan', 'Sofia', 'Lucas', 'Mia'];
  const vehicles = ['car', 'bus', 'train', 'bicycle', 'van'];

  for (let i = 0; i < count; i++) {
    const name = names[randomInt(0, names.length - 1)];
    const vehicle = vehicles[randomInt(0, vehicles.length - 1)];
    const problemType = randomInt(0, 2);

    if (problemType === 0) {
      // Find distance: d = s × t
      const speed = randomInt(grade <= 5 ? 30 : 40, grade <= 5 ? 80 : 120);
      const hours = randomInt(2, grade <= 5 ? 5 : 8);
      const distance = speed * hours;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'multiplication' as Operation,
        problemText: `A ${vehicle} travels at ${speed} km/h. How far does it travel in ${hours} hours?`,
        answer: distance,
        category: 'rate',
        showCalculation: true,
        language: 'en',
      });
    } else if (problemType === 1) {
      // Find time: t = d / s
      const speed = randomInt(grade <= 5 ? 30 : 40, grade <= 5 ? 80 : 100);
      const hours = randomInt(2, grade <= 5 ? 6 : 8);
      const distance = speed * hours;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `${name} drives a ${vehicle} at ${speed} km/h. How many hours does it take to travel ${distance} km?`,
        answer: hours,
        category: 'rate',
        showCalculation: true,
        language: 'en',
      });
    } else {
      // Find speed: s = d / t
      const hours = randomInt(2, grade <= 5 ? 5 : 8);
      const speed = randomInt(grade <= 5 ? 30 : 40, grade <= 5 ? 80 : 120);
      const distance = speed * hours;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `A ${vehicle} travels ${distance} km in ${hours} hours. What is its speed in km/h?`,
        answer: speed,
        category: 'rate',
        showCalculation: true,
        language: 'en',
      });
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-rate'));
  return problems;
}

/**
 * Volume of rectangular prism problems (Primary 5+).
 */
export function generateSingaporeVolume(
  grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    const maxDim = grade <= 5 ? 12 : 20;

    if (problemType === 0) {
      // Find volume: V = l × w × h
      const length = randomInt(2, maxDim);
      const width = randomInt(2, maxDim);
      const height = randomInt(2, maxDim);
      const volume = length * width * height;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'multiplication' as Operation,
        problemText: `A rectangular tank is ${length} cm long, ${width} cm wide and ${height} cm tall. What is its volume in cm³?`,
        answer: volume,
        category: 'volume',
        showCalculation: true,
        language: 'en',
      });
    } else {
      // Find missing dimension: given V and 2 dims
      const dims = [
        { name: 'length', value: randomInt(2, maxDim) },
        { name: 'width', value: randomInt(2, maxDim) },
        { name: 'height', value: randomInt(2, maxDim) },
      ];
      const volume = dims[0].value * dims[1].value * dims[2].value;
      const hiddenIdx = randomInt(0, 2);
      const shown = dims.filter((_, idx) => idx !== hiddenIdx);
      const text = `A rectangular box has a volume of ${volume} cm³. Its ${shown[0].name} is ${shown[0].value} cm and its ${shown[1].name} is ${shown[1].value} cm. What is its ${dims[hiddenIdx].name}?`;
      const answer = dims[hiddenIdx].value;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: text,
        answer,
        category: 'volume',
        showCalculation: true,
        language: 'en',
      });
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-volume'));
  return problems;
}

// ── Grade 6 generators ───────────────────────────────────────────────

/**
 * Simple algebra / linear equation problems (Primary 6).
 */
export function generateSingaporeAlgebra(
  _grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const names = ['Aiden', 'Maya', 'Noah', 'Emma', 'Liam', 'Zoe'];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);

    if (problemType === 0) {
      // Solve ax + b = c
      const a = randomInt(2, 9);
      const x = randomInt(2, 15);
      const b = randomInt(1, 20);
      const c = a * x + b;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `Solve for x: ${a}x + ${b} = ${c}`,
        answer: x,
        category: 'algebra',
        showCalculation: true,
        language: 'en',
      });
    } else if (problemType === 1) {
      // Solve ax - b = c
      const a = randomInt(2, 8);
      const x = randomInt(3, 15);
      const b = randomInt(1, a * x - 1);
      const c = a * x - b;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `Solve for x: ${a}x − ${b} = ${c}`,
        answer: x,
        category: 'algebra',
        showCalculation: true,
        language: 'en',
      });
    } else {
      // Word problem → equation
      const name = names[randomInt(0, names.length - 1)];
      const x = randomInt(3, 12);
      const groups = randomInt(2, 6);
      const extra = randomInt(1, 10);
      const total = groups * x + extra;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `${name} buys ${groups} identical notebooks and a pen that costs $${extra}. The total cost is $${total}. How much does each notebook cost?`,
        answer: x,
        category: 'algebra',
        showCalculation: true,
        language: 'en',
      });
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-algebra'));
  return problems;
}

/**
 * Advanced ratio problems with before/after changes (Primary 6).
 */
export function generateSingaporeRatioAdvanced(
  _grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const names = ['Ryan', 'Chloe', 'Ethan', 'Sofia', 'Lucas', 'Mia'];
  const items = ['marbles', 'stickers', 'beads', 'cards', 'stamps'];

  for (let i = 0; i < count; i++) {
    const item = items[randomInt(0, items.length - 1)];
    const nameA = names[randomInt(0, names.length - 1)];
    const nameB = pickDifferentName(names, nameA);
    const problemType = randomInt(0, 1);

    if (problemType === 0) {
      // Before/after: one person gives some to another
      const ratioA = randomInt(3, 7);
      const ratioB = randomInt(2, ratioA - 1);
      const multiplier = randomInt(2, 8);
      const quantityA = ratioA * multiplier;
      const quantityB = ratioB * multiplier;
      const transfer = randomInt(
        1,
        Math.min(quantityA - 1, Math.floor(quantityA * 0.3))
      );
      const newB = quantityB + transfer;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'subtraction' as Operation,
        problemText: `The ratio of ${nameA}'s ${item} to ${nameB}'s ${item} is ${ratioA} : ${ratioB}. ${nameA} gives ${transfer} ${item} to ${nameB}. If ${nameA} had ${quantityA} ${item} at first, how many does ${nameB} have now?`,
        answer: newB,
        category: 'ratio-advanced',
        showCalculation: true,
        language: 'en',
      });
    } else {
      // Total stays the same, ratio changes
      const ratioA1 = randomInt(3, 6);
      const ratioB1 = randomInt(2, 5);
      const totalParts1 = ratioA1 + ratioB1;
      const multiplier = randomInt(2, 8);
      const total = totalParts1 * multiplier;
      const quantityA = ratioA1 * multiplier;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `${nameA} and ${nameB} have ${total} ${item} altogether. The ratio of ${nameA}'s ${item} to ${nameB}'s ${item} is ${ratioA1} : ${ratioB1}. How many ${item} does ${nameA} have?`,
        answer: quantityA,
        category: 'ratio-advanced',
        showCalculation: true,
        language: 'en',
      });
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-ratio-advanced'));
  return problems;
}

/**
 * Circle circumference and area problems (Primary 6).
 * Uses π = 3.14 as per Singapore P6 curriculum.
 */
export function generateSingaporeCircle(
  _grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const PI = 3.14;

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);
    const radius = randomInt(2, 20);
    const diameter = radius * 2;

    if (problemType === 0) {
      // Find circumference from radius
      const circumference = Math.round(2 * PI * radius * 100) / 100;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'multiplication' as Operation,
        problemText: `A circle has a radius of ${radius} cm. Find its circumference. (Use π = 3.14)`,
        answer: circumference,
        category: 'circle',
        showCalculation: true,
        language: 'en',
      });
    } else if (problemType === 1) {
      // Find circumference from diameter
      const circumference = Math.round(PI * diameter * 100) / 100;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'multiplication' as Operation,
        problemText: `A circle has a diameter of ${diameter} cm. Find its circumference. (Use π = 3.14)`,
        answer: circumference,
        category: 'circle',
        showCalculation: true,
        language: 'en',
      });
    } else {
      // Find area from radius
      const area = Math.round(PI * radius * radius * 100) / 100;

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'multiplication' as Operation,
        problemText: `A circle has a radius of ${radius} cm. Find its area. (Use π = 3.14)`,
        answer: area,
        category: 'circle',
        showCalculation: true,
        language: 'en',
      });
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-circle'));
  return problems;
}

function shuffleArray(arr: number[]): void {
  for (let j = arr.length - 1; j > 0; j--) {
    const k = randomInt(0, j);
    [arr[j], arr[k]] = [arr[k], arr[j]];
  }
}

/**
 * Data analysis: mean, median, mode (Primary 6).
 */
export function generateSingaporeDataAnalysis(
  _grade: Grade,
  count: number
): SingaporeProblem[] {
  const problems: SingaporeProblem[] = [];
  const contexts = [
    'test scores',
    'heights in cm',
    'weights in kg',
    'points scored',
    'temperatures in °C',
  ];

  for (let i = 0; i < count; i++) {
    const context = contexts[randomInt(0, contexts.length - 1)];
    const problemType = randomInt(0, 2);
    const dataSize = randomInt(5, 7);

    if (problemType === 0) {
      // Find mean (ensure integer mean with all values in reasonable range)
      const targetMean = randomInt(10, 50);
      let data: number[];
      let lastVal: number;
      do {
        data = [];
        let sum = 0;
        for (let j = 0; j < dataSize - 1; j++) {
          const val = targetMean + randomInt(-5, 5);
          data.push(val);
          sum += val;
        }
        lastVal = targetMean * dataSize - sum;
      } while (lastVal < 1 || lastVal > 99);
      data.push(lastVal);

      shuffleArray(data);

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'division' as Operation,
        problemText: `Find the mean of these ${context}: ${data.join(', ')}.`,
        answer: targetMean,
        category: 'data-analysis',
        showCalculation: true,
        language: 'en',
      });
    } else if (problemType === 1) {
      // Find median (odd count ensures unique median)
      const oddSize = dataSize % 2 === 0 ? dataSize + 1 : dataSize;
      const data: number[] = [];
      for (let j = 0; j < oddSize; j++) {
        data.push(randomInt(10, 60));
      }
      const sorted = [...data].sort((a, b) => a - b);
      const median = sorted[Math.floor(oddSize / 2)];

      shuffleArray(data);

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'addition' as Operation,
        problemText: `Find the median of these ${context}: ${data.join(', ')}.`,
        answer: median,
        category: 'data-analysis',
        showCalculation: true,
        language: 'en',
      });
    } else {
      // Find mode: ensure a clear mode exists
      const baseVal = randomInt(10, 50);
      const data: number[] = [baseVal, baseVal, baseVal]; // mode appears 3 times
      for (let j = 3; j < dataSize; j++) {
        let val = baseVal + randomInt(1, 20);
        // Ensure no other value repeats 3+ times
        while (data.filter((d) => d === val).length >= 2) {
          val = baseVal + randomInt(1, 20);
        }
        data.push(val);
      }

      shuffleArray(data);

      problems.push({
        id: generateId(),
        type: 'singapore',
        operation: 'addition' as Operation,
        problemText: `Find the mode of these ${context}: ${data.join(', ')}.`,
        answer: baseVal,
        category: 'data-analysis',
        showCalculation: true,
        language: 'en',
      });
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-data-analysis'));
  return problems;
}
