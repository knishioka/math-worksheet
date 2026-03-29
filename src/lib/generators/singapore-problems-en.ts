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
      const value = randomInt(base.min, base.max);

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

  return problems;
}
