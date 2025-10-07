import type { ProblemType, LayoutColumns } from '../types';

/**
 * プリントテンプレート定義
 * 問題タイプごとに最適なレイアウト設定を提供
 */
export interface PrintTemplate {
  /** 問題タイプ */
  type: ProblemType;

  /** 表示名 */
  displayName: string;

  /** 説明 */
  description: string;

  /** レイアウト設定 */
  layout: {
    /** 行間隔（問題間の縦方向の間隔） */
    rowGap: string;
    /** 列間隔（列同士の横方向の間隔） */
    colGap: string;
    /** フォントサイズ */
    fontSize: string;
    /** 問題の高さ（最小値） */
    minProblemHeight: string;
  };

  /** 推奨問題数（列数ごと） */
  recommendedCounts: Record<LayoutColumns, number>;

  /** 最大問題数（列数ごと） */
  maxCounts: Record<LayoutColumns, number>;

  /** A4用紙1枚に収まるかの判定基準 */
  fitsInA4: {
    /** この問題数以下ならA4 1枚に収まる */
    threshold: Record<LayoutColumns, number>;
  };
}

/**
 * 問題タイプ別のプリントテンプレート定義
 */
export const PRINT_TEMPLATES: Record<ProblemType, PrintTemplate> = {
  // 基本計算（整数）
  basic: {
    type: 'basic',
    displayName: '基本計算',
    description: '整数の四則演算。標準的な問題間隔。',
    layout: {
      rowGap: '24px',
      colGap: '32px',
      fontSize: '18px',
      minProblemHeight: '40px',
    },
    recommendedCounts: {
      1: 10,
      2: 20,
      3: 30,
    },
    maxCounts: {
      1: 10,
      2: 20,
      3: 30,
    },
    fitsInA4: {
      threshold: {
        1: 10,
        2: 20,
        3: 30,
      },
    },
  },

  // 分数
  fraction: {
    type: 'fraction',
    displayName: '分数',
    description: '分数の計算。MathML表示のため標準より少し広め。',
    layout: {
      rowGap: '24px',
      colGap: '32px',
      fontSize: '18px',
      minProblemHeight: '50px',
    },
    recommendedCounts: {
      1: 10,
      2: 18,
      3: 27,
    },
    maxCounts: {
      1: 10,
      2: 18,
      3: 27,
    },
    fitsInA4: {
      threshold: {
        1: 10,
        2: 18,
        3: 27,
      },
    },
  },

  // 小数
  decimal: {
    type: 'decimal',
    displayName: '小数',
    description: '小数の計算。基本計算と同様の間隔。',
    layout: {
      rowGap: '24px',
      colGap: '32px',
      fontSize: '18px',
      minProblemHeight: '40px',
    },
    recommendedCounts: {
      1: 10,
      2: 20,
      3: 30,
    },
    maxCounts: {
      1: 10,
      2: 20,
      3: 30,
    },
    fitsInA4: {
      threshold: {
        1: 10,
        2: 20,
        3: 30,
      },
    },
  },

  // 帯分数
  mixed: {
    type: 'mixed',
    displayName: '帯分数',
    description: '帯分数の計算。MathML表示のため広めの間隔。',
    layout: {
      rowGap: '24px',
      colGap: '32px',
      fontSize: '18px',
      minProblemHeight: '55px',
    },
    recommendedCounts: {
      1: 8,
      2: 16,
      3: 24,
    },
    maxCounts: {
      1: 10,
      2: 18,
      3: 27,
    },
    fitsInA4: {
      threshold: {
        1: 8,
        2: 16,
        3: 24,
      },
    },
  },

  // 筆算
  hissan: {
    type: 'hissan',
    displayName: '筆算',
    description: '筆算形式。縦書きのため大きなスペースが必要。lineHeight: 1.2で最適化。',
    layout: {
      rowGap: '32px',
      colGap: '32px',
      fontSize: '18px',
      minProblemHeight: '100px',
    },
    recommendedCounts: {
      1: 6,
      2: 12,
      3: 18,
    },
    maxCounts: {
      1: 6,
      2: 12,
      3: 18,
    },
    fitsInA4: {
      threshold: {
        1: 6,
        2: 12,
        3: 18,
      },
    },
  },

  // 虫食い算
  missing: {
    type: 'missing',
    displayName: '虫食い算',
    description: '虫食い算。ボックス表示のため標準よりやや広め。',
    layout: {
      rowGap: '18px',
      colGap: '32px',
      fontSize: '18px',
      minProblemHeight: '45px',
    },
    recommendedCounts: {
      1: 10,
      2: 20,
      3: 30,
    },
    maxCounts: {
      1: 10,
      2: 20,
      3: 30,
    },
    fitsInA4: {
      threshold: {
        1: 10,
        2: 20,
        3: 30,
      },
    },
  },

  // 文章問題
  word: {
    type: 'word',
    displayName: '文章問題',
    description: '文章問題。複数行表示のため大きなスペースが必要。',
    layout: {
      rowGap: '12px',
      colGap: '20px',
      fontSize: '16px',
      minProblemHeight: '80px',
    },
    recommendedCounts: {
      1: 8,
      2: 16,
      3: 24,
    },
    maxCounts: {
      1: 10,
      2: 20,
      3: 24,
    },
    fitsInA4: {
      threshold: {
        1: 8,
        2: 16,
        3: 24,
      },
    },
  },

  // 英語文章問題
  'word-en': {
    type: 'word-en',
    displayName: 'English Word Problems',
    description: 'Word problems for international school students. Compact spacing for efficient layout.',
    layout: {
      rowGap: '8px',
      colGap: '20px',
      fontSize: '18px',
      minProblemHeight: '80px',
    },
    recommendedCounts: {
      1: 8,
      2: 16,
      3: 18,
    },
    maxCounts: {
      1: 10,
      2: 20,
      3: 18,
    },
    fitsInA4: {
      threshold: {
        1: 8,
        2: 16,
        3: 18,
      },
    },
  },
};

/**
 * 問題タイプに応じたテンプレートを取得
 * @param problemType 問題タイプ
 * @returns プリントテンプレート
 */
export function getPrintTemplate(problemType: ProblemType): PrintTemplate {
  return PRINT_TEMPLATES[problemType];
}

/**
 * 問題配列から主要な問題タイプを判定
 * @param problems 問題配列
 * @returns 主要な問題タイプ
 */
export function detectPrimaryProblemType(
  problems: Array<{ type: ProblemType }>
): ProblemType {
  if (problems.length === 0) return 'basic';

  // 問題タイプの出現頻度をカウント
  const typeCounts: Partial<Record<ProblemType, number>> = {};
  problems.forEach((p) => {
    typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
  });

  // 最も多い問題タイプを返す
  let maxCount = 0;
  let primaryType: ProblemType = 'basic';
  (Object.keys(typeCounts) as ProblemType[]).forEach((type) => {
    const count = typeCounts[type] || 0;
    if (count > maxCount) {
      maxCount = count;
      primaryType = type;
    }
  });

  return primaryType;
}

/**
 * 問題数がA4用紙1枚に収まるかを判定
 * @param problemType 問題タイプ
 * @param layoutColumns 列数
 * @param problemCount 問題数
 * @returns A4 1枚に収まる場合true
 */
export function fitsInA4(
  problemType: ProblemType,
  layoutColumns: LayoutColumns,
  problemCount: number
): boolean {
  const template = getPrintTemplate(problemType);
  return problemCount <= template.fitsInA4.threshold[layoutColumns];
}
