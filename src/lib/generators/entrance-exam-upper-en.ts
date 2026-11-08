import type { UpperEntranceExamEnPattern } from '../../config/entrance-exam-patterns';
import { randomInt } from '../utils/math';
import { gcd, lcm } from './entrance-exam-shared';
import {
  entranceWordEn as word,
  plural,
  type EntranceEnContent,
} from './entrance-exam-en';

/**
 * 5・6年生向け受験文章題の英語版。
 * 数の範囲と条件の巡回は entrance-exam-upper.ts と同じ。金額は RM。
 */

function multiples(index: number): EntranceEnContent {
  const a = randomInt(1, 3);
  const b = a + randomInt(2, 4);
  const unit = randomInt(3, 12);
  const change = randomInt(1, b - a - 1);
  const amount = change * unit;
  const transfer = index % 2 === 0;
  const nextA = a + change;
  const nextB = transfer ? b - change : b + change;
  return word(
    `At first, the ratio of Aoi's cards to Ken's cards is ${a}:${b}. ${transfer ? `After Ken gives Aoi ${amount} cards` : `After each of them receives ${amount} more cards`}, the ratio becomes ${nextA}:${nextB}. How many cards did Aoi have at first?`,
    a * unit,
    'cards',
    [
      transfer
        ? `The total stays the same, and so does the total of the ratio: ${a} + ${b} = ${nextA} + ${nextB}. So one part is the same before and after.`
        : `The difference stays the same, and so does the difference of the ratio: ${b} − ${a} = ${nextB} − ${nextA}. So one part is the same before and after.`,
      `Aoi gained ${nextA} − ${a} = ${change} parts, so one part is ${amount} ÷ ${change} = ${unit} cards.`,
      `At first Aoi had ${unit} × ${a} = ${a * unit} cards.`,
    ]
  );
}

function ratioSharing(index: number): EntranceEnContent {
  const a = randomInt(1, 4);
  const b = randomInt(2, 5);
  const unit = randomInt(3, 12);
  if (index % 2 === 0) {
    const total = (a + b) * unit;
    return word(
      `${total} cards are shared between Aoi and Ken in the ratio ${a}:${b}. How many cards does Aoi get?`,
      a * unit,
      'cards',
      [
        `The total of the ratio is ${a} + ${b} = ${a + b}.`,
        `One part is ${total} ÷ ${a + b} = ${unit} cards, so Aoi gets ${unit} × ${a} = ${a * unit} cards.`,
      ]
    );
  }
  const c = randomInt(2, 5);
  const d = randomInt(1, 4);
  const middle = lcm(b, c);
  const first = (a * middle) / b;
  const last = (d * middle) / c;
  const parts = first + middle + last;
  const total = parts * unit;
  return word(
    `The ratio of Aoi's cards to Ken's cards is ${a}:${b}, and the ratio of Ken's cards to Mio's cards is ${c}:${d}. The three of them have ${total} cards in total. How many cards does Ken have?`,
    middle * unit,
    'cards',
    [
      `Make Ken's part ${middle} in both ratios: Aoi : Ken : Mio = ${first}:${middle}:${last}.`,
      `The total of the ratio is ${first} + ${middle} + ${last} = ${parts}, so one part is ${total} ÷ ${parts} = ${unit} cards.`,
      `Ken has ${unit} × ${middle} = ${middle * unit} cards.`,
    ]
  );
}

function age(index: number): EntranceEnContent {
  const factor = randomInt(3, 4);
  const childAtTarget = randomInt(10, 15);
  const years = randomInt(2, 6);
  const future = index % 2 === 0;
  const child = childAtTarget + (future ? -years : years);
  const parent = childAtTarget * factor + (future ? -years : years);
  const difference = parent - child;
  return word(
    `Right now, a father is ${parent} years old and his child is ${child} years old. ${future ? `How many years from now will the father's age be ${factor} times the child's age?` : `How many years ago was the father's age ${factor} times the child's age?`}`,
    years,
    'years',
    [
      `The age difference ${parent} − ${child} = ${difference} never changes.`,
      `When the father is ${factor} times as old, the difference is ${factor - 1} times the child's age, so the child is ${difference} ÷ ${factor - 1} = ${childAtTarget}.`,
      future
        ? `${childAtTarget} − ${child} = ${years} years from now.`
        : `${child} − ${childAtTarget} = ${years} years ago.`,
    ]
  );
}

function equivalent(index: number): EntranceEnContent {
  const denominator = randomInt(3, 8);
  const numerator = randomInt(1, denominator - 2);
  const unit = randomInt(5, 20);
  const remainingParts = denominator - numerator;
  if (index % 2 === 0) {
    const remaining = remainingParts * unit;
    return word(
      `Aoi read ${numerator}/${denominator} of a book, and ${remaining} pages were left. How many pages does the book have in total?`,
      denominator * unit,
      'pages',
      [
        `The pages left are ${remainingParts}/${denominator} of the whole book.`,
        `One part is ${remaining} ÷ ${remainingParts} = ${unit} pages, so the book has ${unit} × ${denominator} = ${denominator * unit} pages.`,
      ]
    );
  }
  const secondDenominator = randomInt(2, 5);
  const secondNumerator = randomInt(1, secondDenominator - 1);
  const remaining =
    remainingParts * (secondDenominator - secondNumerator) * unit;
  const afterFirst = remainingParts * secondDenominator * unit;
  const total = denominator * secondDenominator * unit;
  return word(
    `On the first day, Aoi read ${numerator}/${denominator} of a book. On the second day, she read ${secondNumerator}/${secondDenominator} of what was left. There are still ${remaining} pages left. How many pages does the book have in total?`,
    total,
    'pages',
    [
      `The pages still left are ${secondDenominator - secondNumerator}/${secondDenominator} of what was left after the first day.`,
      `After the first day, ${remaining} ÷ ${secondDenominator - secondNumerator} × ${secondDenominator} = ${afterFirst} pages were left.`,
      `The whole book is ${afterFirst} ÷ ${remainingParts} × ${denominator} = ${total} pages.`,
    ]
  );
}

function reverse(index: number): EntranceEnContent {
  const factor = randomInt(2, 5);
  const addition = randomInt(5, 30);
  if (index % 2 === 0) {
    const original = randomInt(10, 60);
    const result = original * factor + addition;
    return word(
      `A number is multiplied by ${factor}, and then ${addition} is added. The result is ${result}. What is the original number?`,
      original,
      '',
      [
        `Undo the addition: ${result} − ${addition} = ${original * factor}.`,
        `Undo the multiplication: ${original * factor} ÷ ${factor} = ${original}.`,
      ]
    );
  }
  const subtraction = randomInt(5, 30);
  const quotient = randomInt(5, 20);
  const original = quotient * factor + subtraction;
  const result = quotient + addition;
  return word(
    `${subtraction} is subtracted from a number, the result is divided by ${factor}, and then ${addition} is added. The final result is ${result}. What is the original number?`,
    original,
    '',
    [
      `Undo the addition: ${result} − ${addition} = ${quotient}.`,
      `Undo the division: ${quotient} × ${factor} = ${quotient * factor}.`,
      `Undo the subtraction: ${quotient * factor} + ${subtraction} = ${original}.`,
    ]
  );
}

function profitLoss(index: number): EntranceEnContent {
  const variant = index % 3;
  const cost = randomInt(4, 20) * 100;
  const markup = randomInt(5, 6) * 10;
  const discount = (variant === 2 ? randomInt(5, 6) : randomInt(1, 2)) * 10;
  const listPrice = (cost * (100 + markup)) / 100;
  const salePercent = ((100 + markup) * (100 - discount)) / 100;
  const salePrice = (cost * salePercent) / 100;
  const profit = salePrice - cost;
  if (variant === 2)
    return word(
      `An item costs RM${cost}. Its list price is set to give a profit of ${markup}% of the cost. If it is sold at ${discount}% off the list price, what is the loss?`,
      -profit,
      'RM',
      [
        `The list price is ${cost} × ${100 + markup} ÷ 100 = RM${listPrice}.`,
        `The selling price is ${listPrice} × ${100 - discount} ÷ 100 = RM${salePrice}, so the loss is ${cost} − ${salePrice} = RM${-profit}.`,
      ]
    );
  if (variant === 0)
    return word(
      `An item costs RM${cost}. Its list price is set to give a profit of ${markup}% of the cost. If it is sold at ${discount}% off the list price, what is the profit?`,
      profit,
      'RM',
      [
        `The list price is ${cost} × ${100 + markup} ÷ 100 = RM${listPrice}.`,
        `The selling price is ${listPrice} × ${100 - discount} ÷ 100 = RM${salePrice}, so the profit is ${salePrice} − ${cost} = RM${profit}.`,
      ]
    );
  return word(
    `An item's list price is set to give a profit of ${markup}% of the cost. When it is sold at ${discount}% off the list price, the profit is RM${profit}. What is the cost of the item?`,
    cost,
    'RM',
    [
      `The selling price is ${100 - discount}% of ${100 + markup}% of the cost, which is ${salePercent}% of the cost.`,
      `The profit is ${salePercent} − 100 = ${salePercent - 100}% of the cost.`,
      `The cost is ${profit} × 100 ÷ ${salePercent - 100} = RM${cost}.`,
    ]
  );
}

function saltWater(index: number): EntranceEnContent {
  const base = randomInt(1, 5) * 100;
  if (index % 2 === 0) {
    const a = randomInt(1, 3);
    const b = randomInt(1, 3);
    const low = randomInt(1, 6);
    const differenceUnit = randomInt(1, 2);
    const high = low + (a + b) * differenceUnit;
    const massA = a * base;
    const massB = b * base;
    const salt = (massA * low + massB * high) / 100;
    const concentration = low + b * differenceUnit;
    return word(
      `${massA} g of ${low}% salt water is mixed with ${massB} g of ${high}% salt water. What is the concentration of the mixture?`,
      concentration,
      '%',
      [
        `The total salt is ${massA} × ${low} ÷ 100 + ${massB} × ${high} ÷ 100 = ${salt} g.`,
        `The mixture weighs ${massA} + ${massB} = ${massA + massB} g, so the concentration is ${salt} × 100 ÷ ${massA + massB} = ${concentration}%.`,
      ]
    );
  }
  const target = randomInt(2, 5);
  const factor = randomInt(2, 3);
  const initial = target * factor;
  const salt = (base * initial) / 100;
  return word(
    `Only water is added to ${base} g of ${initial}% salt water to make ${target}% salt water. How many grams of water are added?`,
    base * (factor - 1),
    'g',
    [
      `Adding water does not change the salt: ${base} × ${initial} ÷ 100 = ${salt} g.`,
      `For ${target}% salt water, the whole mixture must weigh ${salt} × 100 ÷ ${target} = ${base * factor} g.`,
      `The water added is ${base * factor} − ${base} = ${base * (factor - 1)} g.`,
    ]
  );
}

function traveler(index: number): EntranceEnContent {
  const slow = randomInt(4, 8) * 10;
  const fast = slow + randomInt(1, 4) * 10;
  const minutes = randomInt(5, 20);
  const meeting = index % 2 === 0;
  const closingSpeed = meeting ? slow + fast : fast - slow;
  const distance = closingSpeed * minutes;
  return word(
    meeting
      ? `Two people are ${distance} m apart and start walking towards each other at the same time. Their speeds are ${slow} m per minute and ${fast} m per minute. After how many minutes do they meet?`
      : `Aoi is ${distance} m ahead of Ken. They start walking in the same direction at the same time. Aoi walks at ${slow} m per minute and Ken walks at ${fast} m per minute. After how many minutes does Ken catch up?`,
    minutes,
    'minutes',
    [
      `The distance between them changes by ${meeting ? `${slow} + ${fast}` : `${fast} − ${slow}`} = ${closingSpeed} m every minute.`,
      `${distance} ÷ ${closingSpeed} = ${minutes} minutes.`,
    ]
  );
}

function trainPassing(index: number): EntranceEnContent {
  const speed = randomInt(10, 20);
  if (index % 2 === 0) {
    const seconds = randomInt(10, 30);
    const length = speed * randomInt(2, 5);
    const bridge = speed * seconds - length;
    return word(
      `A train ${length} m long travels at ${speed} m per second across a bridge ${bridge} m long. How many seconds pass from when the front of the train enters the bridge until the end of the train leaves it?`,
      seconds,
      'seconds',
      [
        `The front of the train travels the length of the train plus the bridge: ${length} + ${bridge} = ${length + bridge} m.`,
        `The time is ${length + bridge} ÷ ${speed} = ${seconds} seconds.`,
      ]
    );
  }
  const otherSpeed = randomInt(10, 20);
  const seconds = randomInt(4, 10);
  const lengthA = (speed + otherSpeed) * randomInt(1, seconds - 1);
  const lengthB = (speed + otherSpeed) * seconds - lengthA;
  return word(
    `A train ${lengthA} m long travelling at ${speed} m per second and a train ${lengthB} m long travelling at ${otherSpeed} m per second move in opposite directions. How many seconds pass from when their fronts meet until their ends part?`,
    seconds,
    'seconds',
    [
      `Together they must cover ${lengthA} + ${lengthB} = ${lengthA + lengthB} m.`,
      `Their closing speed is ${speed} + ${otherSpeed} = ${speed + otherSpeed} m per second, so the time is ${lengthA + lengthB} ÷ ${speed + otherSpeed} = ${seconds} seconds.`,
    ]
  );
}

function river(index: number): EntranceEnContent {
  const still = randomInt(8, 15) * 10;
  const current = randomInt(2, 5) * 10;
  const downstream = still + current;
  const upstream = still - current;
  const distance = lcm(downstream, upstream) * randomInt(2, 4);
  const down = index % 2 === 0;
  const speed = down ? downstream : upstream;
  return word(
    `A boat travels at ${still} m per minute in still water. It goes ${distance} m ${down ? 'downstream' : 'upstream'} on a river whose current flows at ${current} m per minute. The speeds of the boat and the current are constant. How many minutes does the trip take?`,
    distance / speed,
    'minutes',
    [
      `The ${down ? 'downstream' : 'upstream'} speed is ${still} ${down ? '+' : '−'} ${current} = ${speed} m per minute.`,
      `The time is ${distance} ÷ ${speed} = ${distance / speed} minutes.`,
    ]
  );
}

function work(index: number): EntranceEnContent {
  const a = randomInt(2, 4);
  const b = randomInt(1, 3);
  const common = lcm(a, b);
  const togetherDays = common * randomInt(2, 4);
  const firstDays = index % 2 === 0 ? 0 : (a + b) * b * randomInt(1, 2);
  const whole = (a + b) * togetherDays + a * firstDays;
  const aloneA = whole / a;
  const aloneB = whole / b;
  const modelWhole = lcm(aloneA, aloneB);
  const rateA = modelWhole / aloneA;
  const rateB = modelWhole / aloneB;
  const remaining = modelWhole - rateA * firstDays;
  return word(
    `A job takes A ${aloneA} days working alone and B ${aloneB} days working alone. Each of them works at a constant rate. ${firstDays === 0 ? 'If they work together from the start, how many days does the job take?' : `A works alone for the first ${firstDays} days, and then they finish the rest together. For how many days do they work together?`}`,
    togetherDays,
    'days',
    [
      `Let the whole job be ${modelWhole}. In one day A does ${rateA} and B does ${rateB}.`,
      ...(firstDays > 0
        ? [
            `The work left is ${modelWhole} − ${rateA} × ${firstDays} = ${remaining}.`,
          ]
        : []),
      `Together they do ${rateA} + ${rateB} = ${rateA + rateB} a day, so ${remaining} ÷ ${rateA + rateB} = ${togetherDays} days.`,
    ]
  );
}

function newton(index: number): EntranceEnContent {
  const firstWorkers = randomInt(2, 4);
  const secondWorkers = firstWorkers + randomInt(1, 3);
  const perWorker = randomInt(1, 3);
  const secondMinutes = randomInt(2, 6);
  const firstMinutes = (secondWorkers - firstWorkers + 1) * secondMinutes;
  const arriving = perWorker * (firstWorkers - 1);
  const initial = perWorker * firstMinutes;
  const firstTotal = firstWorkers * perWorker * firstMinutes;
  const secondTotal = secondWorkers * perWorker * secondMinutes;
  if (index % 2 === 0)
    return word(
      `Returned books are being sorted at a library. Starting with the same pile, ${firstWorkers} people take ${firstMinutes} minutes and ${secondWorkers} people take ${secondMinutes} minutes. Each person sorts ${plural(perWorker, 'book')} per minute, and books keep being returned at a constant rate while they work. How many books are returned per minute?`,
      arriving,
      'books per minute',
      [
        `The books sorted are ${firstWorkers} × ${perWorker} × ${firstMinutes} = ${firstTotal} and ${secondWorkers} × ${perWorker} × ${secondMinutes} = ${secondTotal}.`,
        `The difference of ${firstTotal - secondTotal} books was returned during the extra ${firstMinutes - secondMinutes} minutes.`,
        `${firstTotal - secondTotal} ÷ ${firstMinutes - secondMinutes} = ${arriving} books per minute.`,
      ]
    );
  return word(
    `Returned books are being sorted at a library. Each person sorts ${plural(perWorker, 'book')} per minute, and ${plural(arriving, 'book')} ${arriving === 1 ? 'is' : 'are'} returned per minute while they work. With ${firstWorkers} people, the pile is cleared in ${firstMinutes} minutes. How many people are needed to clear the same starting pile in ${secondMinutes} minutes?`,
    secondWorkers,
    'people',
    [
      `The starting pile is (${firstWorkers} × ${perWorker} − ${arriving}) × ${firstMinutes} = ${initial} books.`,
      `In ${secondMinutes} minutes they must sort ${initial} + ${arriving} × ${secondMinutes} = ${initial + arriving * secondMinutes} books.`,
      `One person sorts ${perWorker} × ${secondMinutes} = ${perWorker * secondMinutes} books, so ${initial + arriving * secondMinutes} ÷ ${perWorker * secondMinutes} = ${secondWorkers} people are needed.`,
    ]
  );
}

function advancedCraneTurtle(index: number): EntranceEnContent {
  const chickens = randomInt(5, 20);
  const spiders = randomInt(2, 10);
  const factor = index % 2 === 0 ? 1 : randomInt(2, 4);
  const dogs = spiders * factor;
  const count = chickens + dogs + spiders;
  const legs = chickens * 2 + dogs * 4 + spiders * 8;
  const bundleDifference = 2 * factor + 6;
  return word(
    `There are ${count} chickens, dogs and spiders altogether, with ${legs} legs in total. A chicken has 2 legs, a dog has 4 legs and a spider has 8 legs. The number of dogs is ${factor === 1 ? 'the same as' : `${factor} times`} the number of spiders. How many spiders are there?`,
    spiders,
    'spiders',
    [
      `If all were chickens, there would be ${count} × 2 = ${count * 2} legs. The difference is ${legs} − ${count * 2} = ${legs - count * 2}.`,
      `Group 1 spider with ${factor} dog${factor === 1 ? '' : 's'}. The group has (8 − 2) + (4 − 2) × ${factor} = ${bundleDifference} more legs than ${factor + 1} chickens.`,
      `The number of spiders equals the number of groups: ${legs - count * 2} ÷ ${bundleDifference} = ${spiders}.`,
    ]
  );
}

function advancedRatioAge(index: number): EntranceEnContent {
  const child = randomInt(8, 14);
  const factor = randomInt(3, 4);
  const parent = child * factor;
  const years = randomInt(4, 12);
  const divisor = gcd(parent + years, child + years);
  const futureParent = (parent + years) / divisor;
  const futureChild = (child + years) / divisor;
  const difference = parent - child;
  const useSum = index % 2 === 0;
  return word(
    `Right now, the ratio of a father's age to his child's age is ${factor}:1, and ${useSum ? `the sum of their ages is ${parent + child}` : `the difference between their ages is ${difference}`}. In how many years will the ratio of their ages be ${futureParent}:${futureChild}?`,
    years,
    'years',
    [
      `Now the child is ${useSum ? `${parent + child} ÷ (${factor} + 1)` : `${difference} ÷ (${factor} − 1)`} = ${child} and the father is ${parent}.`,
      `The difference of ${difference} years never changes, so one part of the future ratio is ${difference} ÷ (${futureParent} − ${futureChild}) = ${divisor} years.`,
      `The child will then be ${divisor} × ${futureChild} = ${child + years}, which is ${child + years} − ${child} = ${years} years from now.`,
    ]
  );
}

function advancedSpeed(index: number): EntranceEnContent {
  if (index % 2 === 0) {
    const difference = randomInt(1, 3) * 10;
    const factor = randomInt(2, 4);
    const slow = difference * factor;
    const fast = slow + difference;
    const delay = randomInt(3, 8);
    const gap = slow * delay;
    return word(
      `Aoi starts walking at ${slow} m per minute. ${delay} minutes later, Ken leaves the same place and follows the same path at ${fast} m per minute. Both speeds are constant. How many minutes after Ken starts does he catch up with Aoi?`,
      factor * delay,
      'minutes',
      [
        `When Ken starts, Aoi is ${slow} × ${delay} = ${gap} m ahead.`,
        `The gap closes by ${fast} − ${slow} = ${difference} m every minute.`,
        `${gap} ÷ ${difference} = ${factor * delay} minutes after Ken starts.`,
      ]
    );
  }
  const a = randomInt(4, 8) * 10;
  const b = randomInt(4, 8) * 10;
  const nextB = b + randomInt(1, 3) * 10;
  const first = randomInt(3, 8);
  const second = randomInt(4, 10);
  const firstDistance = (a + b) * first;
  const remaining = (a + nextB) * second;
  const distance = firstDistance + remaining;
  return word(
    `A and B are ${distance} m apart and start walking towards each other at the same time. A always walks at ${a} m per minute. B starts at ${b} m per minute and changes to ${nextB} m per minute ${first} minutes after starting. How many minutes after starting do they meet?`,
    first + second,
    'minutes',
    [
      `In the first ${first} minutes the gap closes by (${a} + ${b}) × ${first} = ${firstDistance} m.`,
      `${distance} − ${firstDistance} = ${remaining} m remain, and after that the gap closes by ${a} + ${nextB} = ${a + nextB} m every minute.`,
      `They meet ${first} + ${remaining} ÷ ${a + nextB} = ${first + second} minutes after starting.`,
    ]
  );
}

export const UPPER_ENTRANCE_EN_GENERATORS: Record<
  UpperEntranceExamEnPattern,
  (index: number) => EntranceEnContent
> = {
  'entrance-multiples-en': multiples,
  'entrance-ratio-sharing-en': ratioSharing,
  'entrance-age-en': age,
  'entrance-equivalent-en': equivalent,
  'entrance-reverse-en': reverse,
  'entrance-profit-loss-en': profitLoss,
  'entrance-salt-water-en': saltWater,
  'entrance-traveler-en': traveler,
  'entrance-train-passing-en': trainPassing,
  'entrance-river-en': river,
  'entrance-work-en': work,
  'entrance-newton-en': newton,
  'entrance-advanced-crane-turtle-en': advancedCraneTurtle,
  'entrance-advanced-ratio-age-en': advancedRatioAge,
  'entrance-advanced-speed-en': advancedSpeed,
};
