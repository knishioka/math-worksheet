import type { CalculationPattern, Grade } from '../types';

export interface LearningStage {
  title: string;
  goal: string;
  check: string;
  patterns: CalculationPattern[];
}
export const LEARNING_PATHS: Record<Exclude<Grade, 0>, LearningStage[]> = {
  1: [
    {
      title: '数と計算の入り口',
      goal: '数を数え、増える・減るを確かめよう。',
      check: '指や○を使って、答えの理由を話してみよう。',
      patterns: [
        'add-counting',
        'counting-add',
        'counting-sub',
        'add-plus-one',
        'sub-minus-one',
        'sub-counting-back',
        'add-sub-zero',
        'data-count-jap',
      ],
    },
    {
      title: 'たす・ひくを対に',
      goal: '同じ数を足す練習と引く練習を、行き来しよう。',
      check: '8＋3＝11なら、11−3はいくつ？ 10のまとまりも使おう。',
      patterns: [
        'add-to-10',
        'sub-from-10',
        'add-10-plus',
        'sub-take-10',
        'add-plus-two',
        'sub-minus-two',
        'add-plus-three',
        'sub-minus-three',
        'add-plus-four',
        'sub-minus-four',
        'add-plus-five',
        'sub-minus-five',
        'add-plus-six',
        'sub-minus-six',
        'add-plus-seven',
        'sub-minus-seven',
        'add-plus-eight',
        'sub-minus-eight',
        'add-plus-nine',
        'sub-minus-nine',
      ],
    },
    {
      title: '使い分けて考える',
      goal: '繰り上がり・繰り下がりから、文章を式にする練習へ。',
      check: 'まちがえた問題を○や式で説明し、もう一度解こう。',
      patterns: [
        'add-single-digit',
        'sub-single-digit',
        'add-single-digit-carry',
        'sub-single-digit-borrow',
        'add-single-digit-mixed',
        'sub-single-digit-mixed',
        'add-sub-mixed-basic',
        'add-single-missing',
        'sub-single-missing',
        'word-add-sub-jap',
      ],
    },
  ],
  2: [
    {
      title: '位をそろえる',
      goal: '2桁の加減を、繰り上がり・繰り下がりの順に。',
      check: '十の位と一の位を分けて説明してみよう。',
      patterns: [
        'add-double-digit-no-carry',
        'sub-double-digit-no-borrow',
        'add-double-digit-carry',
        'sub-double-digit-borrow',
        'hissan-add-double',
        'hissan-sub-double',
        'add-hundreds-simple',
        'sub-hundreds-simple',
      ],
    },
    {
      title: '九九を一段ずつ',
      goal: '2・5の段から始め、同じ数のまとまりを考えよう。',
      check: '6×4を、6が4つある図に表してみよう。',
      patterns: [
        'mult-table-two',
        'mult-table-five',
        'mult-table-three',
        'mult-table-four',
        'mult-table-six',
        'mult-table-seven',
        'mult-table-eight',
        'mult-table-nine',
        'mult-table-one',
        'mult-single-digit',
      ],
    },
    {
      title: '計算を使ってみる',
      goal: '虫食い算・時刻・かたち・人数に取り組もう。',
      check: '答えの単位と、使った計算が合っているか確かめよう。',
      patterns: [
        'add-sub-double-mixed',
        'mult-single-missing',
        'add-double-missing',
        'sub-double-missing',
        'time-reading-jap',
        'geometry-shapes-jap',
        'data-table-jap',
      ],
    },
  ],
  3: [
    {
      title: '整数の計算を広げる',
      goal: '3桁の加減と、かけ算・わり算の関係を学ぼう。',
      check: 'わり算の答えを、かけ算でも確かめよう。',
      patterns: [
        'add-triple-digit',
        'sub-triple-digit',
        'hissan-add-triple',
        'hissan-sub-triple',
        'mult-double-digit',
        'hissan-mult-basic',
        'div-basic',
        'div-remainder-intro',
        'div-single-missing',
      ],
    },
    {
      title: '小数・分数の基礎',
      goal: '足す練習、引く練習、その後に混合問題へ。',
      check: '0.1がいくつ、1/5がいくつかを説明しよう。',
      patterns: [
        'add-dec-simple',
        'sub-dec-simple',
        'frac-same-add',
        'frac-same-sub',
        'frac-same-denom',
      ],
    },
    {
      title: '量と長さを考える',
      goal: '長さ・重さ・かさと、まわりの長さを求めよう。',
      check: '単位をそろえてから計算できたか振り返ろう。',
      patterns: [
        'unit-length-jap',
        'unit-weight-jap',
        'unit-capacity-jap',
        'geometry-perimeter-jap',
        'data-bar-chart-jap',
        'time-calc-jap',
      ],
    },
  ],
  4: [
    {
      title: '大きな数と筆算',
      goal: '桁が増えても、位をそろえて計算しよう。',
      check: 'わり算は「わる数×商＋あまり」で検算しよう。',
      patterns: [
        'add-large-numbers',
        'number-rounding-jap',
        'sub-large-numbers',
        'add-sub-large-mixed',
        'mult-triple-digit',
        'hissan-mult-advanced',
        'div-with-remainder',
        'hissan-div-basic',
      ],
    },
    {
      title: '小数・帯分数へ',
      goal: '小数に整数をかける・整数で割る計算に進もう。',
      check: '答えの大きさを、整数の計算と比べて予想しよう。',
      patterns: ['mult-dec-int', 'div-dec-int', 'frac-mixed-number'],
    },
    {
      title: '面積・角・単位',
      goal: '単位の意味を確かめて、図形の量を求めよう。',
      check: '長さのcmと面積のcm²のちがいを説明しよう。',
      patterns: [
        'geometry-rectangle-area-jap',
        'geometry-angle-jap',
        'data-change-jap',
        'unit-length-jap',
        'unit-weight-jap',
        'unit-capacity-jap',
      ],
    },
  ],
  5: [
    {
      title: '小数の乗除',
      goal: '小数をかける・小数で割る計算を身につけよう。',
      check: '1より小さい数で割ったとき、答えはどうなる？',
      patterns: ['mult-dec-dec', 'div-dec-dec'],
    },
    {
      title: '通分と約分',
      goal: '分数の大きさを保って、分母をそろえよう。',
      check: '分子と分母を同じ数でかける理由を説明しよう。',
      patterns: [
        'number-gcd-jap',
        'number-lcm-jap',
        'frac-simplify',
        'frac-different-add',
        'frac-different-sub',
        'frac-different-denom',
      ],
    },
    {
      title: '割合・量・平均',
      goal: '割合、面積・体積、速さ、平均を場面で使おう。',
      check: 'もとにする量や単位を書き、答えが自然か確かめよう。',
      patterns: [
        'percent-basic',
        'area-volume',
        'data-average-jap',
        'speed-time-distance',
        'shopping-discount-jap',
      ],
    },
  ],
  6: [
    {
      title: '分数の乗除',
      goal: '分数のかけ算・わり算の意味を確かめよう。',
      check: '途中で約分できるか、答えが適切な大きさか確かめよう。',
      patterns: ['frac-mult-int', 'frac-div-int', 'frac-mult', 'frac-div'],
    },
    {
      title: '関係と図形',
      goal: '比で数量の関係を捉え、円の面積を求めよう。',
      check: '円の半径と直径を区別し、比は順番にも注意しよう。',
      patterns: [
        'ratio-proportion',
        'geometry-circle-jap',
        'speed-time-distance',
      ],
    },
    {
      title: 'データと総合問題',
      goal: 'データの特徴を読み、計算方法を選んで使おう。',
      check: '答えだけでなく、考え方を別の人に説明してみよう。',
      patterns: [
        'data-median-jap',
        'data-combinations-jap',
        'complex-calc',
        'distance-map-scale-jap',
        'anzan-mixed',
      ],
    },
  ],
};

export function getLearningStages(grade: Grade): LearningStage[] {
  return grade === 0 ? [] : LEARNING_PATHS[grade];
}
