import type { Operation, WordProblemEn } from '../../types';
import type { EntranceExamEnPattern } from '../../config/entrance-exam-patterns';
import { randomInt } from '../utils/math';
import { UPPER_ENTRANCE_EN_GENERATORS } from './entrance-exam-upper-en';

/**
 * 4年生向け受験文章題の英語版。
 *
 * 出題ロジック（数の範囲・条件の巡回）は日本語版 entrance-exam.ts と同じにし、
 * 文章と解き方だけを英語にする。金額はアプリの他の英語教材に合わせて RM。
 */
export type EntranceEnContent = Omit<WordProblemEn, 'id'>;

export function entranceWordEn(
  problemText: string,
  answer: number,
  unit: string,
  solutionSteps: string[],
  operation: Operation = 'division'
): EntranceEnContent {
  return {
    type: 'word-en',
    operation,
    problemText,
    answer,
    unit,
    solutionSteps,
    showCalculation: true,
    category: 'word-story',
    language: 'en',
  };
}

const word = entranceWordEn;

/** "1 pencil" / "2 pencils" */
export function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function sumDifference(index: number): EntranceEnContent {
  const small = randomInt(10, 80);
  const difference = randomInt(5, 40);
  const large = small + difference;
  const total = small + large;
  const askLarge = index % 2 === 0;
  return word(
    `Aoi and Ken have ${total} marbles altogether. Aoi has ${difference} more marbles than Ken. How many marbles does ${askLarge ? 'Aoi' : 'Ken'} have?`,
    askLarge ? large : small,
    'marbles',
    [
      `Taking the difference away from the total leaves twice the smaller amount: ${total} − ${difference} = ${small * 2}.`,
      `Ken has ${small * 2} ÷ 2 = ${small} marbles.`,
      ...(askLarge
        ? [`Aoi has ${small} + ${difference} = ${large} marbles.`]
        : []),
    ]
  );
}

function treePlanting(index: number): EntranceEnContent {
  const gaps = randomInt(5, 25);
  const interval = randomInt(2, 8);
  const length = gaps * interval;
  const variant = index % 4;
  const settings = [
    `A road is ${length} m long. Trees are planted along one side of the road, including both ends.`,
    `A road is ${length} m long. Trees are planted along one side of the road. One end has a tree, but the other end does not.`,
    `A road is ${length} m long. Trees are planted along one side of the road, but not at either end.`,
    `The distance around a pond is ${length} m. Trees are planted all the way around the pond.`,
  ];
  const adjustment = variant === 0 ? 1 : variant === 2 ? -1 : 0;
  const answer = gaps + adjustment;
  const reason = [
    `With trees at both ends, there is 1 more tree than gaps: ${gaps} + 1 = ${answer}.`,
    `With a tree at only one end, the number of trees equals the number of gaps: ${answer} trees.`,
    `With no trees at the ends, there is 1 fewer tree than gaps: ${gaps} − 1 = ${answer}.`,
    `Around a loop, the number of trees equals the number of gaps: ${answer} trees.`,
  ][variant];
  const endSpacing =
    variant === 1
      ? ` The end without a tree is also ${interval} m from the nearest tree.`
      : variant === 2
        ? ` Each end of the road is also ${interval} m from the nearest tree.`
        : '';
  return word(
    `${settings[variant]} The trees are spaced ${interval} m apart.${endSpacing} How many trees are needed in total?`,
    answer,
    'trees',
    [`Number of gaps: ${length} ÷ ${interval} = ${gaps}.`, reason]
  );
}

function craneTurtle(index: number): EntranceEnContent {
  const lowCount = randomInt(2, 20);
  const highCount = randomInt(2, 20);
  const count = lowCount + highCount;
  if (index % 2 === 0) {
    const legs = lowCount * 2 + highCount * 4;
    return word(
      `There are ${count} cranes and turtles altogether, and they have ${legs} legs in total. A crane has 2 legs and a turtle has 4 legs. How many turtles are there?`,
      highCount,
      'turtles',
      [
        `If all ${count} animals were cranes, there would be ${count} × 2 = ${count * 2} legs.`,
        `There are ${legs} − ${count * 2} = ${highCount * 2} extra legs.`,
        `Swapping one crane for a turtle adds 4 − 2 = 2 legs, so there are ${highCount * 2} ÷ 2 = ${highCount} turtles.`,
      ]
    );
  }
  const lowPrice = randomInt(3, 8);
  const difference = randomInt(1, 4);
  const highPrice = lowPrice + difference;
  const total = lowPrice * lowCount + highPrice * highCount;
  const extra = difference * highCount;
  return word(
    `An eraser costs RM${lowPrice} and a pencil costs RM${highPrice}. Mia bought ${count} of these items altogether and paid RM${total}. How many pencils did she buy?`,
    highCount,
    'pencils',
    [
      `If all ${count} items were erasers, the cost would be ${lowPrice} × ${count} = RM${lowPrice * count}.`,
      `The actual cost is ${total} − ${lowPrice * count} = RM${extra} more.`,
      `Swapping one eraser for a pencil adds ${highPrice} − ${lowPrice} = RM${difference}, so she bought ${extra} ÷ ${difference} = ${highCount} pencils.`,
    ]
  );
}

function differenceGathering(index: number): EntranceEnContent {
  const count = randomInt(5, 30);
  if (index % 2 === 0) {
    const lowPrice = randomInt(4, 12);
    const difference = randomInt(1, 5);
    const highPrice = lowPrice + difference;
    const extra = count * difference;
    return word(
      `Ken is buying some notebooks. Buying notebooks that cost RM${highPrice} each would cost RM${extra} more than buying the same number of notebooks that cost RM${lowPrice} each. How many notebooks is he buying?`,
      count,
      'notebooks',
      [
        `The difference per notebook is ${highPrice} − ${lowPrice} = RM${difference}.`,
        `Divide the total difference by the difference per notebook: ${extra} ÷ ${difference} = ${count}.`,
      ]
    );
  }
  const low = randomInt(3, 8);
  const difference = randomInt(2, 6);
  const high = low + difference;
  const extra = count * difference;
  return word(
    `Aoi practises math for the same number of days either way. Solving ${high} problems a day would give ${extra} more problems in total than solving ${low} problems a day. How many days does she practise?`,
    count,
    'days',
    [
      `The difference per day is ${high} − ${low} = ${difference} problems.`,
      `Divide the total difference by the difference per day: ${extra} ÷ ${difference} = ${count}.`,
    ]
  );
}

function excessShortage(index: number): EntranceEnContent {
  const people = randomInt(8, 30);
  const low = randomInt(3, 8);
  const difference = randomInt(2, 5);
  const high = low + difference;
  const adjustment = randomInt(1, people - 1);
  const variant = index % 3;
  const total =
    variant === 0
      ? low * people + adjustment
      : variant === 1
        ? high * people + adjustment
        : low * people - adjustment;
  const lowBalance = total - low * people;
  const highBalance = total - high * people;
  const describeBalance = (balance: number): string =>
    balance > 0
      ? `${balance} candies are left over`
      : `there are ${-balance} candies too few`;
  const surplusDifference = lowBalance - highBalance;
  const calculation =
    variant === 0
      ? `${lowBalance} + ${-highBalance}`
      : variant === 1
        ? `${lowBalance} − ${highBalance}`
        : `${-highBalance} − ${-lowBalance}`;
  return word(
    `Some candies are shared among a group of children. If each child gets ${low} candies, ${describeBalance(lowBalance)}. If each child gets ${high} candies, ${describeBalance(highBalance)}. How many children are there?`,
    people,
    'children',
    [
      `The difference per child is ${high} − ${low} = ${difference} candies.`,
      `${
        variant === 0
          ? 'Adding the leftover and the shortage'
          : variant === 1
            ? 'Taking the difference between the leftovers'
            : 'Taking the difference between the shortages'
      } gives the extra candies needed: ${calculation} = ${surplusDifference}.`,
      `Number of children: ${surplusDifference} ÷ ${difference} = ${people}.`,
    ]
  );
}

function elimination(index: number): EntranceEnContent {
  const pencilPrice = randomInt(5, 12);
  const eraserPrice = randomInt(2, 6);
  const pencils = randomInt(1, 4);
  const erasers = randomInt(1, 4);
  const scale = index % 2 === 0 ? 1 : randomInt(2, 3);
  const extra = randomInt(1, 4);
  const secondPencils = pencils * scale;
  const secondErasers = erasers * scale + extra;
  const firstTotal = pencils * pencilPrice + erasers * eraserPrice;
  const secondTotal = secondPencils * pencilPrice + secondErasers * eraserPrice;
  const extraCost = extra * eraserPrice;
  return word(
    `${plural(pencils, 'pencil')} and ${plural(erasers, 'eraser')} cost RM${firstTotal}. ${plural(secondPencils, 'pencil')} and ${plural(secondErasers, 'eraser')} cost RM${secondTotal}. Items of the same kind all have the same price. How much does one eraser cost?`,
    eraserPrice,
    'RM',
    [
      ...(scale === 1
        ? [`Both purchases have the same number of pencils: ${pencils}.`]
        : [
            `Multiply the first purchase by ${scale}: ${secondPencils} pencils and ${erasers * scale} erasers cost ${firstTotal} × ${scale} = RM${firstTotal * scale}.`,
          ]),
      `Subtracting, the extra ${secondErasers} − ${erasers * scale} = ${extra} erasers cost ${secondTotal} − ${firstTotal * scale} = RM${extraCost}.`,
      `One eraser costs ${extraCost} ÷ ${extra} = RM${eraserPrice}.`,
    ]
  );
}

export const ENTRANCE_EN_GENERATORS: Record<
  EntranceExamEnPattern,
  (index: number) => EntranceEnContent
> = {
  ...UPPER_ENTRANCE_EN_GENERATORS,
  'entrance-sum-difference-en': sumDifference,
  'entrance-tree-planting-en': treePlanting,
  'entrance-crane-turtle-en': craneTurtle,
  'entrance-difference-gathering-en': differenceGathering,
  'entrance-excess-shortage-en': excessShortage,
  'entrance-elimination-en': elimination,
};
