import { STUDIO_EN_PATTERNS, STUDIO_JA_PATTERNS } from './studio-topics';
import { entranceDefinitions, type EntranceTopic } from './entrance-topic';

const elementaryTopics = {
  'sum-difference': {
    grade: 4,
    printRows: { ja: [6, 5, 4], en: [7, 6, 3] },
    difficulty: 2,
    topics: ['arithmetic'],
    ja: [
      '和差算',
      '合計と差から、大きい数・小さい数を求める。中学受験の基礎。',
    ],
    en: [
      'Sum and Difference',
      'Find two numbers from their total and their difference.',
    ],
  },
  'tree-planting': {
    grade: 4,
    printRows: { ja: [6, 5, 4], en: [6, 4, 3] },
    difficulty: 2,
    topics: ['counting'],
    ja: ['植木算', '両端・片端・輪の条件を読み、木の本数と間の数を区別する。'],
    en: [
      'Tree Planting',
      'Count trees along a road or around a pond by telling trees from gaps.',
    ],
  },
  'crane-turtle': {
    grade: 4,
    printRows: { ja: [6, 5, 3], en: [7, 4, 3] },
    difficulty: 3,
    topics: ['arithmetic', 'reasoning'],
    ja: ['鶴亀算', '動物の足や買い物を、全部同じ種類だったらと考えて解く。'],
    en: [
      'Cranes and Turtles',
      'Suppose every animal (or item) were the same kind, then fix the difference.',
    ],
  },
  'difference-gathering': {
    grade: 4,
    printRows: { ja: [6, 5, 4], en: [6, 5, 3] },
    difficulty: 3,
    topics: ['arithmetic'],
    ja: ['差集め算', '1つあたりの差と全体の差から、個数や日数を求める。'],
    en: [
      'Collecting Differences',
      'Divide the total difference by the difference per item to find how many.',
    ],
  },
  'excess-shortage': {
    grade: 4,
    printRows: { ja: [6, 5, 4], en: [6, 4, 2] },
    difficulty: 3,
    topics: ['arithmetic'],
    ja: ['過不足算', '2つの配り方で余る・足りない量を比べ、人数を求める。'],
    en: [
      'Excess and Shortage',
      'Compare two ways of sharing, with leftovers or shortages, to find the group size.',
    ],
  },
  elimination: {
    grade: 4,
    printRows: { ja: [6, 4, 3], en: [7, 4, 3] },
    difficulty: 3,
    topics: ['arithmetic', 'reasoning'],
    ja: ['消去算', '2種類の買い物の個数をそろえて引き、1個の値段を求める。'],
    en: [
      'Elimination',
      'Line up two purchases so one item cancels out, then find the unit price.',
    ],
  },
} as const satisfies Record<string, EntranceTopic>;

const upperTopics = {
  multiples: {
    grade: 5,
    printRows: { ja: [6, 4, 3], en: [6, 4, 3] },
    difficulty: 3,
    topics: ['ratio'],
    ja: ['倍数算', 'やりとりで変わらない合計や差を使い、もとの個数を求める。'],
    en: [
      'Changing Ratios',
      'Use the total or difference that stays the same to find the original amount.',
    ],
  },
  'ratio-sharing': {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [7, 4, 3] },
    difficulty: 3,
    topics: ['ratio'],
    ja: ['比の分配', '合計を比で分ける。2つの比をそろえる問題にも取り組む。'],
    en: [
      'Sharing in a Ratio',
      'Share a total in a given ratio, including problems that link two ratios.',
    ],
  },
  age: {
    grade: 5,
    printRows: { ja: [7, 6, 4], en: [7, 4, 3] },
    difficulty: 3,
    topics: ['age', 'ratio'],
    ja: ['年齢算', '変わらない年齢の差から、指定の倍数になる年を求める。'],
    en: [
      'Age Problems',
      'Use the age difference that never changes to find when one age is a multiple of another.',
    ],
  },
  equivalent: {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [7, 4, 3] },
    difficulty: 3,
    topics: ['fractions', 'ratio'],
    ja: [
      '相当算',
      '全体や残りの何分のいくつかを読み、残った量から全体を求める。',
    ],
    en: [
      'Fraction of a Whole',
      'Read what fraction of the whole or of the rest is used, and find the whole from what is left.',
    ],
  },
  reverse: {
    grade: 5,
    printRows: { ja: [7, 6, 4], en: [7, 5, 3] },
    difficulty: 3,
    topics: ['arithmetic', 'reasoning'],
    ja: [
      '還元算',
      '増やす・減らす・倍にする操作を逆にたどり、もとの数を求める。',
    ],
    en: [
      'Working Backwards',
      'Undo adding, subtracting, multiplying and dividing in reverse order to find the original number.',
    ],
  },
  'profit-loss': {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [7, 5, 3] },
    difficulty: 3,
    topics: ['money', 'percent'],
    ja: ['売買損益', '原価・定価・売価の関係から利益・損失や原価を求める。'],
    en: [
      'Profit and Loss',
      'Relate cost, list price and selling price to find the profit, loss or cost.',
    ],
  },
  'salt-water': {
    grade: 5,
    printRows: { ja: [7, 5, 4], en: [7, 5, 3] },
    difficulty: 3,
    topics: ['percent'],
    ja: ['食塩水', '食塩の量をもとに、混ぜた濃度や追加する水の量を求める。'],
    en: [
      'Salt Water',
      'Keep track of the amount of salt to find the concentration of a mixture or the water to add.',
    ],
  },
  traveler: {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [6, 5, 3] },
    difficulty: 3,
    topics: ['speed'],
    ja: ['旅人算', '出会い・追いつきを、速さの和や差で考える。'],
    en: [
      'Meeting and Catching Up',
      'Use the sum or difference of two speeds for meeting and catching-up problems.',
    ],
  },
  'train-passing': {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [6, 5, 3] },
    difficulty: 3,
    topics: ['speed'],
    ja: [
      '通過算',
      '列車と橋、2本の列車の長さから、通過・すれ違いの時間を求める。',
    ],
    en: [
      'Passing Trains',
      'Use the lengths of a train and a bridge, or of two trains, to find the time to pass.',
    ],
  },
  river: {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [6, 4, 3] },
    difficulty: 3,
    topics: ['speed'],
    ja: ['流水算', '船の速さと川の流れを区別し、上り・下りの時間を求める。'],
    en: [
      'Boats on a River',
      'Separate the speed of the boat from the speed of the current for upstream and downstream trips.',
    ],
  },
  work: {
    grade: 6,
    printRows: { ja: [6, 4, 3], en: [6, 4, 2] },
    difficulty: 3,
    topics: ['work'],
    ja: [
      '仕事算',
      '1日あたりの仕事量から、共同作業や途中から協力する日数を求める。',
    ],
    en: [
      'Work Problems',
      'Use the amount of work done per day to find how long people take working together.',
    ],
  },
  newton: {
    grade: 6,
    printRows: { ja: [6, 4, 3], en: [6, 3, 2] },
    difficulty: 3,
    topics: ['work'],
    ja: [
      'ニュートン算',
      '増え続ける量と処理する量を比べ、流入量や必要な人数を求める。',
    ],
    en: [
      'Newton Problems',
      'Compare an amount that keeps growing with the rate it is cleared to find the inflow or the people needed.',
    ],
  },
  'advanced-crane-turtle': {
    grade: 6,
    printRows: { ja: [6, 4, 3], en: [6, 3, 2] },
    difficulty: 3,
    topics: ['arithmetic', 'reasoning'],
    ja: [
      '鶴亀算の応用（3種類）',
      '3種類の合計と足の数、個数の関係を組み合わせて解く。',
    ],
    en: [
      'Cranes and Turtles (3 Kinds)',
      'Combine a total count, a total number of legs and a relation between two kinds.',
    ],
  },
  'advanced-ratio-age': {
    grade: 6,
    printRows: { ja: [7, 5, 4], en: [7, 4, 3] },
    difficulty: 3,
    topics: ['ratio', 'age'],
    ja: [
      '比と年齢の複合問題',
      '現在と将来の比、変わらない年齢の差を使って考える。',
    ],
    en: [
      'Ratios and Ages',
      'Use the present ratio and the unchanging age difference to find when a future ratio is reached.',
    ],
  },
  'advanced-speed': {
    grade: 6,
    printRows: { ja: [6, 4, 3], en: [6, 3, 2] },
    difficulty: 3,
    topics: ['speed', 'reasoning'],
    ja: [
      '速さの複合問題',
      '出発時刻のずれや途中の速さの変化を、場面ごとに整理する。',
    ],
    en: [
      'Speed in Stages',
      'Split a journey at a late start or a change of speed and handle each stage in turn.',
    ],
  },
} as const satisfies Record<string, EntranceTopic>;

export const UPPER_ENTRANCE_EXAM_EN_PATTERNS = entranceDefinitions(
  upperTopics,
  'en'
);
export const UPPER_ENTRANCE_EXAM_PATTERNS = entranceDefinitions(
  upperTopics,
  'jap'
);
export const ENTRANCE_EXAM_EN_PATTERNS = {
  ...UPPER_ENTRANCE_EXAM_EN_PATTERNS,
  ...STUDIO_EN_PATTERNS,
  ...entranceDefinitions(elementaryTopics, 'en'),
};
export const ENTRANCE_EXAM_PATTERNS = {
  ...entranceDefinitions(elementaryTopics, 'jap'),
  ...ENTRANCE_EXAM_EN_PATTERNS,
  ...UPPER_ENTRANCE_EXAM_PATTERNS,
  ...STUDIO_JA_PATTERNS,
};

export type UpperEntranceExamEnPattern =
  keyof typeof UPPER_ENTRANCE_EXAM_EN_PATTERNS;
export type UpperEntranceExamPattern =
  keyof typeof UPPER_ENTRANCE_EXAM_PATTERNS;
export type EntranceExamEnPattern = keyof typeof ENTRANCE_EXAM_EN_PATTERNS;
export type EntranceExamPattern = keyof typeof ENTRANCE_EXAM_PATTERNS;

export function isEntranceExamEnPattern(
  pattern?: string
): pattern is EntranceExamEnPattern {
  return (
    pattern !== undefined &&
    Object.prototype.hasOwnProperty.call(ENTRANCE_EXAM_EN_PATTERNS, pattern)
  );
}

export function isEntranceExamPattern(
  pattern?: string
): pattern is EntranceExamPattern {
  return (
    pattern !== undefined &&
    Object.prototype.hasOwnProperty.call(ENTRANCE_EXAM_PATTERNS, pattern)
  );
}
