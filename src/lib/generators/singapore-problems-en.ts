import type { Grade, Operation, SingaporeProblem } from '../../types';
import { generateId, randomInt } from '../utils/math';
import { assertValidProblem } from './assertions';

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
    const item = items[randomInt(0, items.length - 1)];

    if (grade <= 2) {
      // Grade 1-2: simple part-whole or comparison
      const problemType = randomInt(0, 1);
      if (problemType === 0) {
        const total = randomInt(12, 40);
        const part = randomInt(5, Math.max(6, total - 4));
        const remaining = total - part;
        const askWhole = randomInt(0, 1) === 1;
        if (askWhole) {
          problems.push({
            id: generateId(),
            type: 'singapore',
            operation: 'addition' as Operation,
            problemText: `How many ${item} are there in all?`,
            answer: total,
            category: 'bar-model',
            language: 'en',
            showCalculation: true,
            diagram: {
              diagramType: 'bar-model',
              variant: 'part-whole',
              totalValue: total,
              segments: [{ value: part }, { value: remaining }],
              hidden: 'total',
            },
          });
        } else {
          const nameA = names[randomInt(0, names.length - 1)];
          problems.push({
            id: generateId(),
            type: 'singapore',
            operation: 'subtraction' as Operation,
            problemText: `${nameA} has ${total} ${item}. ${part} are red. How many are not red?`,
            answer: remaining,
            category: 'bar-model',
            language: 'en',
            showCalculation: true,
            diagram: {
              diagramType: 'bar-model',
              variant: 'part-whole',
              totalValue: total,
              segments: [{ value: part, label: 'red' }, { value: remaining }],
              hidden: 1,
            },
          });
        }
      } else {
        const nameA = names[randomInt(0, names.length - 1)];
        const nameB = pickDifferentName(names, nameA);
        const smaller = randomInt(8, 25);
        const difference = randomInt(3, Math.max(4, Math.floor(smaller * 0.7)));
        const bigger = smaller + difference;
        const askBigger = randomInt(0, 1) === 1;
        if (askBigger) {
          problems.push({
            id: generateId(),
            type: 'singapore',
            operation: 'addition' as Operation,
            problemText: `${nameB} has ${smaller} ${item}. ${nameA} has ${difference} more. How many does ${nameA} have?`,
            answer: bigger,
            category: 'bar-model',
            language: 'en',
            showCalculation: true,
            diagram: {
              diagramType: 'bar-model',
              variant: 'comparison',
              bars: [
                { value: bigger, label: nameA },
                { value: smaller, label: nameB },
              ],
              differenceValue: difference,
              hidden: 0,
            },
          });
        } else {
          problems.push({
            id: generateId(),
            type: 'singapore',
            operation: 'subtraction' as Operation,
            problemText: `How many more ${item} does ${nameA} have than ${nameB}?`,
            answer: difference,
            category: 'bar-model',
            language: 'en',
            showCalculation: true,
            diagram: {
              diagramType: 'bar-model',
              variant: 'comparison',
              bars: [
                { value: bigger, label: nameA },
                { value: smaller, label: nameB },
              ],
              differenceValue: difference,
              hidden: 'difference',
            },
          });
        }
      }
    } else if (grade <= 4) {
      // Grade 3-4: multi-step, 3-part split, before/after (text-only)
      const variant = randomInt(0, 2);
      if (variant === 0) {
        const multiplier = randomInt(2, 4);
        const unitValue = randomInt(50, 500);
        const bValue = unitValue;
        const total = unitValue * multiplier + bValue;
        const nameA = names[randomInt(0, names.length - 1)];
        const nameB = pickDifferentName(names, nameA);
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'division' as Operation,
          problemText: `${nameA} has ${multiplier} times as many ${item} as ${nameB}. Together they have ${total}. How many does ${nameB} have?`,
          answer: bValue,
          category: 'bar-model',
          language: 'en',
          showCalculation: true,
        });
      } else if (variant === 1) {
        const a = randomInt(100, 800);
        const b = randomInt(100, 800);
        const c = randomInt(100, 800);
        const total = a + b + c;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `A rope is ${total} cm. It is cut into 3 pieces. The first piece is ${a} cm and the second is ${b} cm. How long is the third piece?`,
          answer: c,
          category: 'bar-model',
          language: 'en',
          showCalculation: true,
        });
      } else {
        const denominators = [2, 4, 5, 10];
        const denom = denominators[randomInt(0, denominators.length - 1)];
        const multiplier = randomInt(10, 100);
        const total = denom * multiplier;
        const gaveAway = total / denom;
        const remaining = total - gaveAway;
        const nameA = names[randomInt(0, names.length - 1)];
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `${nameA} had ${total} ${item}. ${nameA} gave away 1/${denom} of them. How many are left?`,
          answer: remaining,
          category: 'bar-model',
          language: 'en',
          showCalculation: true,
        });
      }
    } else {
      // Grade 5-6: ratio-based, transfer, fraction multi-step (text-only)
      const variant = randomInt(0, 2);
      if (variant === 0) {
        const r1 = randomInt(2, 5);
        const r2 = randomInt(r1 + 1, r1 + 4);
        const unitValue = randomInt(50, 400);
        const aValue = r1 * unitValue;
        const bValue = r2 * unitValue;
        const diff = bValue - aValue;
        const nameA = names[randomInt(0, names.length - 1)];
        const nameB = pickDifferentName(names, nameA);
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'multiplication' as Operation,
          problemText: `The ratio of ${nameA}'s ${item} to ${nameB}'s ${item} is ${r1} : ${r2}. The difference is ${diff}. How many does ${nameA} have?`,
          answer: aValue,
          category: 'bar-model',
          language: 'en',
          showCalculation: true,
        });
      } else if (variant === 1) {
        const nameA = names[randomInt(0, names.length - 1)];
        const nameB = pickDifferentName(names, nameA);
        const equalValue = randomInt(100, 500);
        const transfer = randomInt(20, Math.max(21, equalValue - 10));
        const aOriginal = equalValue + transfer;
        const bOriginal = equalValue - transfer;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'addition' as Operation,
          problemText: `${nameA} has ${aOriginal} ${item} and ${nameB} has ${bOriginal}. ${nameA} gives some to ${nameB} so they have the same number. How many does each have now?`,
          answer: equalValue,
          category: 'bar-model',
          language: 'en',
          showCalculation: true,
        });
      } else {
        const denom1 = randomInt(2, 5);
        const denom2 = randomInt(2, 4);
        const lcm = denom1 * denom2;
        const multiplier = randomInt(5, 30);
        const total = lcm * multiplier;
        const usedFirst = total / denom1;
        const afterFirst = total - usedFirst;
        const usedSecond = afterFirst / denom2;
        const remaining = afterFirst - usedSecond;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `There are ${total} ${item}. First, 1/${denom1} are used. Then 1/${denom2} of the remainder are given away. How many are left?`,
          answer: remaining,
          category: 'bar-model',
          language: 'en',
          showCalculation: true,
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
    if (grade === 1) {
      // Grade 1 only: diagram for concept introduction
      const variant = randomInt(0, 1);
      if (variant === 0) {
        const total = randomInt(10, 20);
        const part = randomInt(2, Math.max(3, total - 2));
        const missingPart = total - part;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `What is the missing number in the number bond?`,
          answer: missingPart,
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
          diagram: {
            diagramType: 'number-bond',
            whole: total,
            parts: [part, missingPart],
            hidden: 1,
          },
        });
      } else {
        let value = randomInt(10, 20);
        while (value % 10 === 0) value = randomInt(11, 19);
        const tens = Math.floor(value / 10) * 10;
        const ones = value % 10;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'addition' as Operation,
          problemText: `What is the missing part of ${value}?`,
          answer: ones,
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
          diagram: {
            diagramType: 'number-bond',
            whole: value,
            parts: [tens, ones],
            hidden: 1,
          },
        });
      }
    } else if (grade === 2) {
      // Grade 2: text-only, slightly harder numbers
      const variant = randomInt(0, 1);
      if (variant === 0) {
        const total = randomInt(20, 100);
        const part = randomInt(5, Math.max(6, total - 5));
        const missingPart = total - part;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `${total} is split into ${part} and another number. What is the other number?`,
          answer: missingPart,
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
        });
      } else {
        let value = randomInt(10, 99);
        while (value % 10 === 0) value = randomInt(10, 99);
        const tens = Math.floor(value / 10) * 10;
        const ones = value % 10;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'addition' as Operation,
          problemText: `${tens} + ? = ${value}. What is the missing number?`,
          answer: ones,
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
        });
      }
    } else if (grade <= 4) {
      // Grade 3-4: text-only number bond problems
      const variant = randomInt(0, 2);
      if (variant === 0) {
        let value = randomInt(1111, 9999);
        while (
          value % 10 === 0 ||
          Math.floor((value % 100) / 10) === 0 ||
          Math.floor((value % 1000) / 100) === 0
        ) {
          value = randomInt(1111, 9999);
        }
        const thousands = Math.floor(value / 1000) * 1000;
        const hundreds = Math.floor((value % 1000) / 100) * 100;
        const tens = Math.floor((value % 100) / 10) * 10;
        const ones = value % 10;
        const parts = [thousands, hundreds, tens, ones];
        const hiddenIdx = randomInt(1, 3);
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'addition' as Operation,
          problemText: `${value} = ${parts.map((p, idx) => (idx === hiddenIdx ? '?' : p)).join(' + ')}. What is the missing number?`,
          answer: parts[hiddenIdx],
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
        });
      } else if (variant === 1) {
        const half = randomInt(20, 200);
        const offset = randomInt(5, Math.max(6, half - 5));
        const a = half + offset;
        const b = half - offset;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `Two numbers add up to ${a + b}. One number is ${a}. What is the other?`,
          answer: b,
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
        });
      } else {
        const total = randomInt(200, 2000);
        const partA = randomInt(50, Math.floor(total * 0.5));
        const partB = randomInt(50, Math.max(51, total - partA - 50));
        const partC = total - partA - partB;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `${total} = ${partA} + ${partB} + ?. What is the missing number?`,
          answer: partC,
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
        });
      }
    } else {
      // Grade 5-6: text-only fraction decomposition, complement problems
      const variant = randomInt(0, 2);
      if (variant === 0) {
        const denom = [4, 5, 8, 10][randomInt(0, 3)];
        const numer1 = randomInt(1, denom - 1);
        const multiplier = randomInt(2, 20);
        const total = denom * multiplier;
        const part1 = numer1 * multiplier;
        const part2 = total - part1;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `${total} items are split into ${numer1}/${denom} and the rest. How many are in the rest?`,
          answer: part2,
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
        });
      } else if (variant === 1) {
        const total = randomInt(200, 2000);
        const part1 = randomInt(50, total - 50);
        const part2 = total - part1;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `${total} = ${part1} + ?. What is the missing number?`,
          answer: part2,
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
        });
      } else {
        const targets = [100, 1000, 10000];
        const target = targets[randomInt(0, targets.length - 1)];
        const part = randomInt(
          Math.floor(target * 0.1),
          Math.floor(target * 0.9)
        );
        const complement = target - part;
        problems.push({
          id: generateId(),
          type: 'singapore',
          operation: 'subtraction' as Operation,
          problemText: `What number added to ${part} makes ${target}?`,
          answer: complement,
          category: 'number-bond',
          language: 'en',
          showCalculation: false,
        });
      }
    }
  }

  problems.forEach((p) => assertValidProblem(p, 'singapore-number-bond'));
  return problems;
}
