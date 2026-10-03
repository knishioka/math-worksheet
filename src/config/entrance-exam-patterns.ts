interface EntranceExamDefinition {
  label: string;
  description: string;
  grade: 4 | 5 | 6;
  type: 'word';
  category: 'entrance';
  difficulty: 2 | 3;
}

const upper = (
  grade: 5 | 6,
  label: string,
  description: string
): EntranceExamDefinition => ({
  grade,
  label,
  description,
  type: 'word',
  category: 'entrance',
  difficulty: 3,
});

export const UPPER_ENTRANCE_EXAM_PATTERNS = {
  'entrance-multiples-jap': upper(
    5,
    '倍数算',
    'やりとりで変わらない合計や差を使い、もとの個数を求める。'
  ),
  'entrance-ratio-sharing-jap': upper(
    5,
    '比の分配',
    '合計を比で分ける。2つの比をそろえる問題にも取り組む。'
  ),
  'entrance-age-jap': upper(
    5,
    '年齢算',
    '変わらない年齢の差から、指定の倍数になる年を求める。'
  ),
  'entrance-equivalent-jap': upper(
    5,
    '相当算',
    '全体や残りの何分のいくつかを読み、残った量から全体を求める。'
  ),
  'entrance-reverse-jap': upper(
    5,
    '還元算',
    '増やす・減らす・倍にする操作を逆にたどり、もとの数を求める。'
  ),
  'entrance-profit-loss-jap': upper(
    5,
    '売買損益',
    '原価・定価・売価の関係から利益・損失や原価を求める。'
  ),
  'entrance-salt-water-jap': upper(
    5,
    '食塩水',
    '食塩の量をもとに、混ぜた濃度や追加する水の量を求める。'
  ),
  'entrance-traveler-jap': upper(
    5,
    '旅人算',
    '出会い・追いつきを、速さの和や差で考える。'
  ),
  'entrance-train-passing-jap': upper(
    5,
    '通過算',
    '列車と橋、2本の列車の長さから、通過・すれ違いの時間を求める。'
  ),
  'entrance-river-jap': upper(
    5,
    '流水算',
    '船の速さと川の流れを区別し、上り・下りの時間を求める。'
  ),
  'entrance-work-jap': upper(
    6,
    '仕事算',
    '1日あたりの仕事量から、共同作業や途中から協力する日数を求める。'
  ),
  'entrance-newton-jap': upper(
    6,
    'ニュートン算',
    '増え続ける量と処理する量を比べ、流入量や必要な人数を求める。'
  ),
  'entrance-advanced-crane-turtle-jap': upper(
    6,
    '鶴亀算の応用（3種類）',
    '3種類の合計と足の数、個数の関係を組み合わせて解く。'
  ),
  'entrance-advanced-ratio-age-jap': upper(
    6,
    '比と年齢の複合問題',
    '現在と将来の比、変わらない年齢の差を使って考える。'
  ),
  'entrance-advanced-speed-jap': upper(
    6,
    '速さの複合問題',
    '出発時刻のずれや途中の速さの変化を、場面ごとに整理する。'
  ),
} satisfies Record<string, EntranceExamDefinition>;

export type UpperEntranceExamPattern =
  keyof typeof UPPER_ENTRANCE_EXAM_PATTERNS;

export const ENTRANCE_EXAM_PATTERNS = {
  'entrance-sum-difference-jap': {
    label: '和差算',
    description: '合計と差から、大きい数・小さい数を求める。中学受験の基礎。',
    grade: 4,
    type: 'word',
    category: 'entrance',
    difficulty: 2,
  },
  'entrance-tree-planting-jap': {
    label: '植木算',
    description: '両端・片端・輪の条件を読み、木の本数と間の数を区別する。',
    grade: 4,
    type: 'word',
    category: 'entrance',
    difficulty: 2,
  },
  'entrance-crane-turtle-jap': {
    label: '鶴亀算',
    description: '動物の足や買い物を、全部同じ種類だったらと考えて解く。',
    grade: 4,
    type: 'word',
    category: 'entrance',
    difficulty: 3,
  },
  'entrance-difference-gathering-jap': {
    label: '差集め算',
    description: '1つあたりの差と全体の差から、個数や日数を求める。',
    grade: 4,
    type: 'word',
    category: 'entrance',
    difficulty: 3,
  },
  'entrance-excess-shortage-jap': {
    label: '過不足算',
    description: '2つの配り方で余る・足りない量を比べ、人数を求める。',
    grade: 4,
    type: 'word',
    category: 'entrance',
    difficulty: 3,
  },
  'entrance-elimination-jap': {
    label: '消去算',
    description: '2種類の買い物の個数をそろえて引き、1個の値段を求める。',
    grade: 4,
    type: 'word',
    category: 'entrance',
    difficulty: 3,
  },
  ...UPPER_ENTRANCE_EXAM_PATTERNS,
} satisfies Record<string, EntranceExamDefinition>;

export type EntranceExamPattern = keyof typeof ENTRANCE_EXAM_PATTERNS;

export function isEntranceExamPattern(
  pattern?: string
): pattern is EntranceExamPattern {
  return (
    pattern !== undefined &&
    Object.prototype.hasOwnProperty.call(ENTRANCE_EXAM_PATTERNS, pattern)
  );
}
