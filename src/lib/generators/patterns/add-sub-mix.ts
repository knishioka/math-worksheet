import type { BasicProblem } from '../../../types';
import { generateId, randomInt } from '../../utils/math';

/** 1問分の被演算子ペアを作る関数 */
export type OperandPairFactory = () => readonly [number, number];

export interface AddSubMixGenerators {
  /** 繰り上がりのないたし算 */
  addPlain: OperandPairFactory;
  /** 繰り上がりのあるたし算 */
  addCarry: OperandPairFactory;
  /** 繰り下がりのないひき算 */
  subPlain: OperandPairFactory;
  /** 繰り下がりのあるひき算 */
  subBorrow: OperandPairFactory;
}

type MixKind = keyof AddSubMixGenerators;

const MAX_ATTEMPTS = 50;

function shuffle<T>(items: T[]): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [items[i], items[j]] = [items[j], items[i]];
  }
}

/**
 * 「たし算/ひき算」×「繰り上がり・繰り下がりあり/なし」の4種類を
 * バランスよく混ぜた問題セットを作る。
 *
 * - たし算 ceil(count/2) 問、ひき算 floor(count/2) 問
 * - それぞれの半分（端数は繰り上がり・繰り下がり側）を「あり」にする
 * - 出題順はシャッフルし、規則的な並びで答えを予測できないようにする
 */
export function generateAddSubMix(
  count: number,
  generators: AddSubMixGenerators
): BasicProblem[] {
  const additionCount = Math.ceil(count / 2);
  const subtractionCount = count - additionCount;
  const carryCount = Math.ceil(additionCount / 2);
  const borrowCount = Math.ceil(subtractionCount / 2);

  const kinds: MixKind[] = [
    ...Array<MixKind>(carryCount).fill('addCarry'),
    ...Array<MixKind>(additionCount - carryCount).fill('addPlain'),
    ...Array<MixKind>(borrowCount).fill('subBorrow'),
    ...Array<MixKind>(subtractionCount - borrowCount).fill('subPlain'),
  ];
  shuffle(kinds);

  const used = new Set<string>();

  return kinds.map((kind): BasicProblem => {
    const isAddition = kind === 'addPlain' || kind === 'addCarry';
    let pair = generators[kind]();

    for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
      const key = isAddition
        ? `+${Math.min(...pair)},${Math.max(...pair)}`
        : `-${pair[0]},${pair[1]}`;
      if (!used.has(key)) {
        used.add(key);
        break;
      }
      pair = generators[kind]();
    }

    const [operand1, operand2] = pair;
    return {
      id: generateId(),
      type: 'basic',
      operation: isAddition ? 'addition' : 'subtraction',
      operand1,
      operand2,
      answer: isAddition ? operand1 + operand2 : operand1 - operand2,
      carryOver: kind === 'addCarry' || kind === 'subBorrow',
    };
  });
}
