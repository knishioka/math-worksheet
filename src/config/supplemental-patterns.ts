// 学習の片側だけが欠けないよう、追加教材の表示・配当・印刷種別を一元管理する。
interface SupplementalDefinition {
  label: string;
  description: string;
  grade: number;
  type: 'basic' | 'fraction' | 'word';
  category: 'basic' | 'fraction' | 'word' | 'geometry' | 'data';
  difficulty: 1 | 2 | 3;
}

const subtraction = (n: number): SupplementalDefinition => ({
  label: `−${n}のひき算`,
  description: `${n}から${n + 9}までの数から${n}を引く。答えは0〜9（${n > 1 ? '繰り下がりを含む' : '1つ前の数'}）。`,
  grade: 1,
  type: 'basic',
  category: 'basic',
  difficulty: n === 1 ? 1 : 2,
});
const table = (n: number): SupplementalDefinition => ({
  label: `九九・${n}の段`,
  description: `${n}×1〜${n}×9を、重複なく一巡して練習する。`,
  grade: 2,
  type: 'basic',
  category: 'basic',
  difficulty: 1,
});

export const SUPPLEMENTAL_PATTERNS = {
  'number-rounding-jap': {
    label: 'がい数（四捨五入）',
    description: '十の位・百の位までのがい数に直す。',
    grade: 4,
    type: 'word',
    category: 'basic',
    difficulty: 2,
  },
  'number-gcd-jap': {
    label: '最大公約数',
    description: '共通する約数のうち、いちばん大きい数を求める。',
    grade: 5,
    type: 'word',
    category: 'basic',
    difficulty: 2,
  },
  'number-lcm-jap': {
    label: '最小公倍数',
    description: '共通する倍数のうち、いちばん小さい正の数を求める。',
    grade: 5,
    type: 'word',
    category: 'basic',
    difficulty: 2,
  },
  'frac-mult-int': {
    label: '分数×整数',
    description: '分数を整数倍する。分数同士のかけ算の前に練習。',
    grade: 6,
    type: 'fraction',
    category: 'fraction',
    difficulty: 1,
  },
  'frac-div-int': {
    label: '分数÷整数',
    description: '分数を等しく分ける。分数同士のわり算の前に練習。',
    grade: 6,
    type: 'fraction',
    category: 'fraction',
    difficulty: 1,
  },
  'data-combinations-jap': {
    label: '場合の数（組み合わせ）',
    description: '2つの種類から1つずつ選ぶ組み合わせを、順序よく調べる。',
    grade: 6,
    type: 'word',
    category: 'data',
    difficulty: 2,
  },
  'data-bar-chart-jap': {
    label: '棒グラフを読もう',
    description: '目盛りと棒の長さから人数の差を読み取る。',
    grade: 3,
    type: 'word',
    category: 'data',
    difficulty: 2,
  },
  'data-change-jap': {
    label: '表から変化を読もう',
    description: '時刻ごとの気温の表から、変化の大きさを読み取る。',
    grade: 4,
    type: 'word',
    category: 'data',
    difficulty: 2,
  },
  'sub-minus-one': subtraction(1),
  'sub-minus-two': subtraction(2),
  'sub-minus-three': subtraction(3),
  'sub-minus-four': subtraction(4),
  'sub-minus-five': subtraction(5),
  'sub-minus-six': subtraction(6),
  'sub-minus-seven': subtraction(7),
  'sub-minus-eight': subtraction(8),
  'sub-minus-nine': subtraction(9),
  'sub-counting-back': {
    label: 'かずをもどろう（−1ずつ）',
    description: '10から0まで、1つずつ前の数を考える。',
    grade: 1,
    type: 'basic',
    category: 'basic',
    difficulty: 1,
  },
  'sub-take-10': {
    label: '10をひく計算',
    description: '15−10など、十のまとまりを取り去る。',
    grade: 1,
    type: 'basic',
    category: 'basic',
    difficulty: 1,
  },
  'sub-single-digit-mixed': {
    label: 'ひき算（繰り下がり混在）',
    description: '10までのひき算と、繰り下がりのあるひき算を半分ずつ練習。',
    grade: 1,
    type: 'basic',
    category: 'basic',
    difficulty: 3,
  },
  'add-sub-zero': {
    label: '0のたし算・ひき算',
    description: '0を足す・0を引く・同じ数を引く計算を確かめる。',
    grade: 1,
    type: 'basic',
    category: 'basic',
    difficulty: 1,
  },
  'mult-table-one': table(1),
  'mult-table-two': table(2),
  'mult-table-three': table(3),
  'mult-table-four': table(4),
  'mult-table-five': table(5),
  'mult-table-six': table(6),
  'mult-table-seven': table(7),
  'mult-table-eight': table(8),
  'mult-table-nine': table(9),
  'sub-hundreds-simple': {
    label: '100単位のひき算',
    description: '700−300など、100をひとまとまりとして引く。',
    grade: 2,
    type: 'basic',
    category: 'basic',
    difficulty: 1,
  },
  'div-single-missing': {
    label: 'わり算の虫食い算',
    description: '□÷3＝4、12÷□＝4から、かけ算との関係を考える。',
    grade: 3,
    type: 'basic',
    category: 'basic',
    difficulty: 3,
  },
  'div-remainder-intro': {
    label: 'はじめてのあまり',
    description: '14÷3など、九九の範囲の商とあまりを求める。',
    grade: 3,
    type: 'word',
    category: 'basic',
    difficulty: 2,
  },
  'frac-same-add': {
    label: '同じ分母のたし算',
    description: '1/5＋2/5など、分母を変えずに分子を足す（答えは1まで）。',
    grade: 3,
    type: 'fraction',
    category: 'fraction',
    difficulty: 1,
  },
  'frac-same-sub': {
    label: '同じ分母のひき算',
    description: '3/5−1/5など、分母を変えずに分子を引く。',
    grade: 3,
    type: 'fraction',
    category: 'fraction',
    difficulty: 1,
  },
  'frac-different-add': {
    label: '異なる分母のたし算',
    description: '通分して足し、答えを約分する。',
    grade: 5,
    type: 'fraction',
    category: 'fraction',
    difficulty: 2,
  },
  'frac-different-sub': {
    label: '異なる分母のひき算',
    description: '通分して引き、答えを約分する。',
    grade: 5,
    type: 'fraction',
    category: 'fraction',
    difficulty: 2,
  },
  'word-add-sub-jap': {
    label: 'あわせて・のこり・ちがい',
    description: '短い日本語の文章から、たし算かひき算かを考える。',
    grade: 1,
    type: 'word',
    category: 'word',
    difficulty: 3,
  },
  'geometry-shapes-jap': {
    label: 'かたちをしらべよう',
    description: '三角形と四角形を、辺や頂点の数から見分ける。',
    grade: 2,
    type: 'word',
    category: 'geometry',
    difficulty: 1,
  },
  'geometry-perimeter-jap': {
    label: 'まわりの長さ',
    description: '正方形と長方形の辺の長さを足して求める。',
    grade: 3,
    type: 'word',
    category: 'geometry',
    difficulty: 2,
  },
  'geometry-rectangle-area-jap': {
    label: '長方形・正方形の面積',
    description: '1cm²をもとに、たて×よこで面積を求める。',
    grade: 4,
    type: 'word',
    category: 'geometry',
    difficulty: 1,
  },
  'geometry-angle-jap': {
    label: '角の大きさ',
    description: '直角90°・一直線180°をもとに、残りの角を求める。',
    grade: 4,
    type: 'word',
    category: 'geometry',
    difficulty: 2,
  },
  'geometry-circle-jap': {
    label: '円の面積',
    description: '半径から円の面積を求める。円周率は3.14。',
    grade: 6,
    type: 'word',
    category: 'geometry',
    difficulty: 2,
  },
  'data-count-jap': {
    label: 'かずをくらべよう',
    description: '2種類のものの数を読み、どちらが多いかを考える。',
    grade: 1,
    type: 'word',
    category: 'data',
    difficulty: 1,
  },
  'data-table-jap': {
    label: '人数を整理して読もう',
    description: '3つの組の人数から、合計や差を読み取る。',
    grade: 2,
    type: 'word',
    category: 'data',
    difficulty: 2,
  },
  'data-average-jap': {
    label: '平均を求めよう',
    description: '4日間の記録の合計を、日数で割って平均を求める。',
    grade: 5,
    type: 'word',
    category: 'data',
    difficulty: 2,
  },
  'data-median-jap': {
    label: '資料の代表値（中央値）',
    description: '5つの記録を小さい順に並べ、真ん中の値を求める。',
    grade: 6,
    type: 'word',
    category: 'data',
    difficulty: 2,
  },
} satisfies Record<string, SupplementalDefinition>;

export type SupplementalPattern = keyof typeof SUPPLEMENTAL_PATTERNS;
export function isSupplementalPattern(
  pattern: string
): pattern is SupplementalPattern {
  return Object.prototype.hasOwnProperty.call(SUPPLEMENTAL_PATTERNS, pattern);
}
export function supplementalPatternsForGrade(
  grade: number
): SupplementalPattern[] {
  return (Object.keys(SUPPLEMENTAL_PATTERNS) as SupplementalPattern[]).filter(
    (pattern) => SUPPLEMENTAL_PATTERNS[pattern].grade === grade
  );
}
export const SUPPLEMENTAL_LABELS = Object.fromEntries(
  Object.entries(SUPPLEMENTAL_PATTERNS).map(([id, item]) => [id, item.label])
) as Record<SupplementalPattern, string>;
export const SUPPLEMENTAL_DESCRIPTIONS = Object.fromEntries(
  Object.entries(SUPPLEMENTAL_PATTERNS).map(([id, item]) => [
    id,
    item.description,
  ])
) as Record<SupplementalPattern, string>;
