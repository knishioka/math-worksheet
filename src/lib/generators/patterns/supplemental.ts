import type {
  BasicProblem,
  FractionProblem,
  Operation,
  Problem,
  WordProblem,
} from '../../../types';
import type { SupplementalPattern } from '../../../config/supplemental-patterns';
import { generateId, randomInt } from '../../utils/math';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function basic(a: number, b: number, operation: Operation): BasicProblem {
  const answer =
    operation === 'addition'
      ? a + b
      : operation === 'subtraction'
        ? a - b
        : operation === 'multiplication'
          ? a * b
          : a / b;
  return {
    id: generateId(),
    type: 'basic',
    operation,
    operand1: a,
    operand2: b,
    answer,
    carryOver:
      operation === 'subtraction'
        ? a % 10 < b % 10
        : operation === 'addition'
          ? (a % 10) + (b % 10) > 10
          : undefined,
  };
}
function word(
  problemText: string,
  answer: number | string,
  operation: Operation = 'addition',
  unit?: string
): WordProblem {
  return {
    id: generateId(),
    type: 'word',
    operation,
    problemText,
    answer,
    unit,
    showCalculation: true,
  };
}
function shuffle<T>(values: T[]): T[] {
  for (let i = values.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}
const NUMBER_NAMES = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

export function generateSupplementalProblems(
  pattern: SupplementalPattern,
  count: number
): Problem[] {
  const pool = shuffle(
    Array.from(
      { length: pattern.startsWith('mult-table-') ? 9 : 10 },
      (_, i) => i
    )
  );
  return Array.from({ length: count }, (_, i): Problem => {
    if (i > 0 && i % pool.length === 0) shuffle(pool);
    const value = pool[i % pool.length];
    if (pattern.startsWith('sub-minus-')) {
      const n = NUMBER_NAMES.indexOf(pattern.slice('sub-minus-'.length)) + 1;
      return basic(n + value, n, 'subtraction');
    }
    if (pattern.startsWith('mult-table-')) {
      const n = NUMBER_NAMES.indexOf(pattern.slice('mult-table-'.length)) + 1;
      return basic(n, value + 1, 'multiplication');
    }
    switch (pattern) {
      case 'number-rounding-jap': {
        const place = i % 2 === 0 ? 10 : 100,
          n = randomInt(10, 9999);
        return word(
          `${n}を四捨五入して、${place === 10 ? '十' : '百'}の位までのがい数にしましょう。`,
          Math.round(n / place) * place
        );
      }
      case 'number-gcd-jap':
      case 'number-lcm-jap': {
        const a = randomInt(2, 12),
          b = randomInt(2, 12),
          factor = randomInt(1, 3);
        const x = a * factor,
          y = b * factor,
          divisor = gcd(x, y);
        return word(
          `${x}と${y}の${pattern === 'number-gcd-jap' ? '最大公約数' : '最小公倍数'}は？`,
          pattern === 'number-gcd-jap' ? divisor : (x * y) / divisor,
          'division'
        );
      }
      case 'frac-mult-int':
      case 'frac-div-int': {
        const d = randomInt(2, 12),
          n = randomInt(1, d - 1),
          b = randomInt(2, 9);
        const mult = pattern === 'frac-mult-int',
          numerator = mult ? n * b : n,
          denominator = mult ? d : d * b;
        const factor = gcd(numerator, denominator);
        return {
          id: generateId(),
          type: 'fraction',
          operation: mult ? 'multiplication' : 'division',
          numerator1: n,
          denominator1: d,
          numerator2: b,
          denominator2: 1,
          answerNumerator: numerator / factor,
          answerDenominator: denominator / factor,
          simplified: true,
        };
      }
      case 'data-combinations-jap': {
        const shirts = randomInt(2, 5),
          hats = randomInt(2, 5);
        return word(
          `色のちがうシャツ${shirts}種類と帽子${hats}種類。1つずつ選ぶ組み合わせは何通り？`,
          shirts * hats,
          'multiplication',
          '通り'
        );
      }
      case 'data-bar-chart-jap': {
        const a = randomInt(1, 5),
          b = a + randomInt(1, 4);
        return {
          ...word(
            '好きな遊びを調べました。なわとびは、おにごっこより何人多い？',
            b - a,
            'subtraction',
            '人'
          ),
          dataDisplay: {
            kind: 'bar',
            label: '好きな遊び',
            unit: '人',
            entries: [
              { label: 'おにごっこ', value: a },
              { label: 'なわとび', value: b },
            ],
          },
        };
      }
      case 'data-change-jap': {
        const a = randomInt(10, 20),
          b = a + randomInt(2, 8),
          c = b - randomInt(1, 5);
        return {
          ...word(
            i % 2 === 0
              ? '9時から12時までに気温は何度上がりましたか？'
              : '12時から15時までに気温は何度下がりましたか？',
            i % 2 === 0 ? b - a : b - c,
            'subtraction',
            '℃'
          ),
          dataDisplay: {
            kind: 'table',
            label: '時刻と気温',
            unit: '℃',
            entries: [
              { label: '9時', value: a },
              { label: '12時', value: b },
              { label: '15時', value: c },
            ],
          },
        };
      }
      case 'sub-counting-back':
        return basic(10 - (i % 10), 1, 'subtraction');
      case 'sub-take-10':
        return basic(10 + value, 10, 'subtraction');
      case 'sub-single-digit-mixed': {
        if (i % 2 === 0) {
          const a = randomInt(1, 9);
          return basic(a, randomInt(0, a), 'subtraction');
        }
        const b = randomInt(2, 9);
        return basic(randomInt(11, 9 + b), b, 'subtraction');
      }
      case 'add-sub-zero':
        return i % 3 === 0
          ? basic(value, 0, 'addition')
          : basic(value, i % 3 === 1 ? 0 : value, 'subtraction');
      case 'sub-hundreds-simple': {
        const a = randomInt(1, 9);
        return basic(a * 100, randomInt(0, a) * 100, 'subtraction');
      }
      case 'div-single-missing': {
        const b = randomInt(2, 9),
          q = randomInt(1, 9);
        const problem = basic(b * q, b, 'division');
        return {
          ...problem,
          [i % 2 === 0 ? 'operand1' : 'operand2']: null,
          missingPosition: i % 2 === 0 ? 'operand1' : 'operand2',
        };
      }
      case 'div-remainder-intro': {
        const b = randomInt(2, 9),
          q = randomInt(1, 9),
          r = randomInt(1, b - 1);
        return word(
          `${b * q + r} ÷ ${b} ＝ □ あまり □`,
          `${q} あまり ${r}`,
          'division'
        );
      }
      case 'frac-same-add':
      case 'frac-same-sub':
      case 'frac-different-add':
      case 'frac-different-sub': {
        const same = pattern.startsWith('frac-same');
        const add = pattern.endsWith('add');
        let d1 = randomInt(3, 10),
          d2 = same ? d1 : randomInt(2, 9);
        if (!same && d2 === d1) d2 = d1 + 1;
        let n1 = randomInt(1, d1 - 1),
          n2 = randomInt(1, same && add ? d1 - n1 : d2 - 1);
        if (!add && n1 * d2 < n2 * d1) {
          [n1, n2] = [n2, n1];
          [d1, d2] = [d2, d1];
        }
        const numerator = add ? n1 * d2 + n2 * d1 : n1 * d2 - n2 * d1;
        const denominator = d1 * d2;
        const factor = same ? d1 : gcd(numerator, denominator);
        const problem: FractionProblem = {
          id: generateId(),
          type: 'fraction',
          operation: add ? 'addition' : 'subtraction',
          numerator1: n1,
          denominator1: d1,
          numerator2: n2,
          denominator2: d2,
          answerNumerator: numerator / factor,
          answerDenominator: denominator / factor,
          simplified: !same,
        };
        return problem;
      }
      case 'word-add-sub-jap': {
        const a = randomInt(2, 9),
          b = randomInt(1, a);
        if (i % 3 === 0)
          return word(
            `あめが ${a}こ あります。${b}こ もらうと、ぜんぶで なんこ？`,
            a + b,
            'addition',
            'こ'
          );
        if (i % 3 === 1)
          return word(
            `あめが ${a}こ あります。${b}こ たべると、のこりは なんこ？`,
            a - b,
            'subtraction',
            'こ'
          );
        return word(
          `あかい はなが ${a}ほん、しろい はなが ${b}ほん。あかい はなは なんぼん おおい？`,
          a - b,
          'subtraction',
          'ほん'
        );
      }
      case 'geometry-shapes-jap': {
        const triangle = i % 2 === 0;
        return i % 4 < 2
          ? word(
              `${triangle ? '三角形' : '四角形'}の ${i % 2 === 0 ? '辺' : '頂点'}は いくつ？`,
              triangle ? 3 : 4,
              'addition',
              'つ'
            )
          : word(
              `まっすぐな ${triangle ? 3 : 4}本の 辺で かこまれた かたちは？`,
              triangle ? '三角形' : '四角形'
            );
      }
      case 'geometry-perimeter-jap': {
        const a = randomInt(2, 12),
          b = randomInt(2, 12);
        return word(
          `たて${a}cm、よこ${b}cmの長方形。まわりの長さは？`,
          2 * (a + b),
          'addition',
          'cm'
        );
      }
      case 'geometry-rectangle-area-jap': {
        const a = randomInt(2, 20),
          b = i % 2 === 0 ? a : randomInt(2, 20);
        return word(
          `たて${a}cm、よこ${b}cmの${a === b ? '正方形' : '長方形'}。面積は？`,
          a * b,
          'multiplication',
          'cm²'
        );
      }
      case 'geometry-angle-jap': {
        const total = i % 2 === 0 ? 90 : 180,
          a = randomInt(1, total / 10 - 1) * 10;
        return word(
          `${total === 90 ? '直角' : '一直線の角'}を2つに分けました。一方が${a}°のとき、もう一方は何度？`,
          total - a,
          'subtraction',
          '°'
        );
      }
      case 'geometry-circle-jap': {
        const r = randomInt(1, 10);
        return word(
          `半径${r}cmの円の面積は？ 円周率は3.14とします。`,
          Math.round(r * r * 314) / 100,
          'multiplication',
          'cm²'
        );
      }
      case 'data-count-jap': {
        const a = randomInt(1, 9),
          b = a + randomInt(1, 5);
        return i % 2 === 0
          ? word(`りんご ${a}こ、みかん ${b}こ。おおいのは どちら？`, 'みかん')
          : word(`りんご ${b}こ、みかん ${a}こ。おおいのは どちら？`, 'りんご');
      }
      case 'data-table-jap': {
        const a = randomInt(10, 25),
          b = randomInt(10, 25),
          c = randomInt(10, 25);
        return word(
          `赤組${a}人、白組${b}人、青組${c}人。${i % 2 === 0 ? '3つの組で何人？' : '赤組と白組の人数のちがいは？'}`,
          i % 2 === 0 ? a + b + c : Math.abs(a - b),
          i % 2 === 0 ? 'addition' : 'subtraction',
          '人'
        );
      }
      case 'data-average-jap': {
        const mean = randomInt(5, 20),
          d = randomInt(1, 4),
          e = randomInt(1, 4);
        const values = shuffle([mean - d, mean + d, mean - e, mean + e]);
        return word(
          `4日間に読んだページ数は${values.join('、')}ページです。1日平均は何ページ？`,
          mean,
          'division',
          'ページ'
        );
      }
      case 'data-median-jap': {
        const values = Array.from({ length: 5 }, () => randomInt(1, 20));
        const median = [...values].sort((a, b) => a - b)[2];
        return word(
          `5人の読書時間は${values.join('、')}分です。中央値は何分？`,
          median,
          'addition',
          '分'
        );
      }
      default:
        throw new Error(`Unknown supplemental pattern: ${pattern}`);
    }
  });
}
