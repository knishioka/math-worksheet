import { entranceDefinitions, type EntranceTopic } from './entrance-topic';

// 公開済みの算数教材に対応する日英の演習。配当と教材IDを両言語で共有する。
export const STUDIO_TOPICS = {
  cycle: {
    grade: 4,
    printRows: { ja: [6, 5, 4], en: [7, 5, 3] },
    topics: ['patterns'],
    ja: ['周期算', 'くり返しの中の位置と個数を求める。'],
    en: [
      'Repeating Patterns',
      'Find a position or a count in a repeating pattern.',
    ],
  },
  sequence: {
    grade: 4,
    printRows: { ja: [7, 5, 4], en: [7, 6, 4] },
    topics: ['patterns'],
    ja: ['等差数列・群数列', '段ごとの増え方と、組の切れ目を調べる。'],
    en: [
      'Number Sequences',
      'Use equal steps or groups to find a term or a sum.',
    ],
  },
  sets: {
    grade: 4,
    printRows: { ja: [6, 5, 4], en: [7, 6, 4] },
    topics: ['counting'],
    ja: ['集合算', '両方に入る人を一度だけ数える。'],
    en: ['Overlapping Sets', 'Count students in overlapping groups.'],
  },
  'polygon-angles': {
    grade: 4,
    printRows: { ja: [7, 6, 4], en: [7, 5, 4] },
    topics: ['geometry'],
    ja: ['三角形と多角形の角', '内角と外角の関係から角度を求める。'],
    en: [
      'Angles in Polygons',
      'Find missing angles using interior and exterior angles.',
    ],
  },
  'composite-area': {
    grade: 4,
    printRows: { ja: [4, 3, 3], en: [4, 3, 3] },
    topics: ['geometry'],
    ja: ['複合図形と道の面積', '図形を分け、欠けた部分や道の重なりを引く。'],
    en: [
      'Composite Areas',
      'Split a garden into rectangles and account for overlaps.',
    ],
  },
  'changing-counts': {
    grade: 4,
    printRows: { ja: [6, 5, 4], en: [7, 5, 3] },
    topics: ['arithmetic', 'reasoning'],
    ja: [
      '個数と差の応用',
      '弁償算や分かれ道など、個数の重複と差に注意して解く。',
    ],
    en: [
      'Counting with Constraints',
      'Track shared endpoints, transfers and changes in counts.',
    ],
  },
  averages: {
    grade: 5,
    printRows: { ja: [7, 5, 4], en: [7, 5, 3] },
    topics: ['data'],
    ja: ['平均とならし', '人数の違う組や入れ替わりを合計に戻して考える。'],
    en: [
      'Combining Averages',
      'Recover totals to combine groups or replace a score.',
    ],
  },
  divisibility: {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [7, 5, 4] },
    topics: ['patterns'],
    ja: [
      '約数・倍数の利用',
      '同じ大きさに分ける条件と、周期がそろう条件を区別する。',
    ],
    en: [
      'Factors and Multiples',
      'Use common factors for tiles and common multiples for schedules.',
    ],
  },
  'percent-change': {
    grade: 5,
    printRows: { ja: [7, 6, 4], en: [7, 5, 4] },
    topics: ['percent'],
    ja: ['割合の変化', '割合をかける基準が変わる問題を解く。'],
    en: [
      'Successive Percentages',
      'Track a changing base through successive percentages.',
    ],
  },
  'speed-units': {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [7, 5, 4] },
    topics: ['speed', 'measurement'],
    ja: [
      '速さの換算と往復',
      '長さと時間の単位をそろえ、往復の平均の速さを求める。',
    ],
    en: [
      'Speed Units and Round Trips',
      'Convert speeds and find average speed over a whole trip.',
    ],
  },
  'equal-area': {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [7, 5, 4] },
    topics: ['geometry'],
    ja: ['等積変形', '面積を保つときの底辺と高さを求める。'],
    en: ['Equal Areas', 'Use equal areas to find a missing base or height.'],
  },
  'triangle-ratio': {
    grade: 5,
    printRows: { ja: [4, 3, 3], en: [4, 3, 2] },
    topics: ['geometry', 'ratio'],
    ja: ['三角形の面積比', '高さが等しい三角形を底辺の比で分ける。'],
    en: [
      'Triangle Area Ratios',
      'Divide an area using triangles with the same height.',
    ],
  },
  exchange: {
    grade: 5,
    printRows: { ja: [6, 5, 4], en: [7, 4, 3] },
    topics: ['percent', 'ratio'],
    ja: [
      'やりとりと割合の応用',
      '売り方や食塩水のやりとりを段階に分けて考える。',
    ],
    en: [
      'Transfers and Mixtures',
      'Account for sales at different prices and exchanges between mixtures.',
    ],
  },
  'digit-count': {
    grade: 6,
    printRows: { ja: [6, 5, 4], en: [7, 5, 4] },
    topics: ['counting'],
    ja: ['条件のある場合の数', '先頭の0や同じ数字の重複に注意して数を作る。'],
    en: [
      'Counting Possible Numbers',
      'Count numbers while accounting for zero and repeated digits.',
    ],
  },
  'clock-hands': {
    grade: 6,
    printRows: { ja: [6, 5, 4], en: [7, 5, 3] },
    topics: ['time', 'speed'],
    ja: ['時計算', '針の動く角度から、なす角や重なる時刻を求める。'],
    en: [
      'Clock Hands',
      'Use the motion of both hands to find angles and meeting times.',
    ],
  },
  'water-depth': {
    grade: 6,
    printRows: { ja: [3, 3, 2], en: [3, 3, 2] },
    topics: ['work', 'data'],
    ja: [
      '水そうの深さと流量',
      '水の出入りや途中で変わる底面積から深さを求める。',
    ],
    en: [
      'Water Depth and Flow',
      'Follow a changing water level through different filling stages.',
    ],
  },
  'similar-area': {
    grade: 6,
    printRows: { ja: [6, 5, 4], en: [7, 5, 3] },
    topics: ['ratio', 'geometry'],
    ja: ['相似と面積比', '対応する長さの比を面積の比に直す。'],
    en: [
      'Similar Figures',
      'Use the square of the scale factor to compare areas.',
    ],
  },
  sectors: {
    grade: 6,
    printRows: { ja: [4, 3, 3], en: [4, 3, 3] },
    topics: ['geometry'],
    ja: [
      '円とおうぎ形',
      '図の中心角を読み、面積・弧の長さ・周りの長さを求める。',
    ],
    en: [
      'Circular Sectors',
      'Read a central angle to find an area, arc length or perimeter.',
    ],
  },
  motion: {
    grade: 6,
    printRows: { ja: [6, 5, 4], en: [7, 5, 3] },
    topics: ['geometry'],
    ja: ['図形の移動と対称', '平行移動・回転・対称移動の前後を比べる。'],
    en: [
      'Moving Shapes',
      'Track lengths and positions under slides, turns and reflections.',
    ],
  },
  'solid-nets': {
    grade: 6,
    printRows: { ja: [3, 3, 2], en: [3, 3, 2] },
    topics: ['geometry'],
    ja: [
      '立体の体積と展開図',
      '段に分けて体積を求め、展開図を折った面を考える。',
    ],
    en: [
      'Solids and Nets',
      'Build a solid in layers or fold a labelled cube net.',
    ],
  },
  'cube-section': {
    grade: 6,
    printRows: { ja: [4, 3, 3], en: [4, 3, 2] },
    topics: ['geometry'],
    ja: [
      '立方体の切断',
      '同じ面にある点を結び、切り口の面積や辺の数を求める。',
    ],
    en: [
      'Cube Sections',
      'Trace a plane across cube faces to find the section.',
    ],
  },
  'staged-rates': {
    grade: 6,
    printRows: { ja: [6, 4, 3], en: [6, 4, 3] },
    topics: ['work', 'speed'],
    ja: ['仕事・速さの条件変化', '途中で変わる処理量や速さから時間を求める。'],
    en: [
      'Changing Rates',
      'Work through changes in flow, work rates and relative speed.',
    ],
  },
} as const satisfies Record<string, EntranceTopic>;

export type StudioTopic = keyof typeof STUDIO_TOPICS;
export type StudioPattern<L extends 'jap' | 'en'> =
  `entrance-${StudioTopic}-${L}`;

export function mapStudioTopics<L extends 'jap' | 'en', T>(
  language: L,
  build: (topic: StudioTopic) => T
): Record<StudioPattern<L>, T> {
  const topics = Object.keys(STUDIO_TOPICS) as StudioTopic[];
  return Object.fromEntries(
    topics.map((topic) => [`entrance-${topic}-${language}`, build(topic)])
  ) as Record<StudioPattern<L>, T>;
}

export const STUDIO_JA_PATTERNS = entranceDefinitions(STUDIO_TOPICS, 'jap');
export const STUDIO_EN_PATTERNS = entranceDefinitions(STUDIO_TOPICS, 'en');
