// 単元IDは一覧の絞り込みと共有URLで共通。1つの教材が複数の単元に属せる。
export const WORD_TOPICS = {
  arithmetic: {
    ja: '四則と数量の関係',
    en: 'Arithmetic Relationships',
    description: '場面を読んで、合計・残り・差を求める。',
  },
  multiplication: {
    ja: 'かけ算',
    en: 'Multiplication',
    description: 'グループの数と、ひとつ分の量から全体を求める。',
  },
  division: {
    ja: 'わり算',
    en: 'Division',
    description: '等しく分ける場面で、ひとつ分の量やあまりを考える。',
  },
  fractions: {
    ja: '分数',
    en: 'Fractions',
    description: '分けた量や全体の何分のいくつかを読み取り、分数で考える。',
  },
  decimals: {
    ja: '小数',
    en: 'Decimals',
    description: '長さや量の小数を使って、文章に合う計算を選ぶ。',
  },
  percent: {
    ja: '割合',
    en: 'Percentages',
    description: '全体と一部の関係から、割合や値引き後の量を求める。',
  },
  ratio: {
    ja: '比',
    en: 'Ratios',
    description: '2つの量の比を使い、一方からもう一方を求める。',
  },
  age: { ja: '年齢', en: 'Ages' },
  speed: {
    ja: '速さ',
    en: 'Speed',
    description: '道のり・時間・速さのうち、分かっていない量を求める。',
  },
  work: { ja: '仕事と流量', en: 'Work and Flow' },
  time: {
    ja: '時刻・時間',
    en: 'Time',
    description: '開始・終了時刻と経過時間の関係を考える。',
  },
  money: {
    ja: 'お金・買い物',
    en: 'Money and Shopping',
    description: '代金や集めた金額を読み取り、必要な金額を求める。',
  },
  measurement: {
    ja: '量と単位',
    en: 'Measurement',
    description: '長さや重さなどの量を、単位を意識して計算する。',
  },
  geometry: {
    ja: '図形',
    en: 'Geometry',
    description: '図形の辺や面積の関係を使って解く。',
  },
  patterns: {
    ja: '数の規則性',
    en: 'Number Patterns',
    description: '数の並びを調べ、くり返しや増え方から次の数を求める。',
  },
  counting: { ja: '場合の数・数え方', en: 'Counting' },
  data: {
    ja: '表・グラフ・平均',
    en: 'Data and Averages',
    description: '複数の数値を読み取って平均を求める。',
  },
  reasoning: {
    ja: '条件の整理',
    en: 'Reasoning with Conditions',
    description: '文章の中の条件を整理し、必要な数や計算の順序を考える。',
  },
} as const;

export type WordTopic = keyof typeof WORD_TOPICS;
