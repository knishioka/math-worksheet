// 計算パターンの定義
export type CalculationPattern = 
  // 1年生のパターン
  | 'add-single-digit'              // 1桁＋1桁（答えが10まで）
  | 'add-single-digit-carry'        // 1桁＋1桁（繰り上がりあり、答えが20まで）
  | 'add-to-10'                     // 10を作る計算（□＋△＝10）
  | 'add-10-plus'                   // 10＋□の計算
  | 'sub-single-digit'              // 1桁－1桁（繰り下がりなし）
  | 'sub-single-digit-borrow'       // 繰り下がりのある引き算（20まで）
  | 'sub-from-10'                   // 10－□の計算
  | 'add-sub-mixed-basic'           // たし算・ひき算混合（10まで）
  | 'add-single-missing'            // □＋△＝答え の虫食い算
  | 'sub-single-missing'            // □－△＝答え の虫食い算
  
  // 2年生のパターン
  | 'add-double-digit-no-carry'     // 2桁＋2桁（繰り上がりなし）
  | 'add-double-digit-carry'        // 2桁＋2桁（繰り上がりあり）
  | 'sub-double-digit-no-borrow'    // 2桁－2桁（繰り下がりなし）
  | 'sub-double-digit-borrow'       // 2桁－2桁（繰り下がりあり）
  | 'add-sub-double-mixed'          // 2桁の足し算・引き算混合（繰り上がり/下がり混在）
  | 'mult-single-digit'             // 九九（1×1〜9×9）
  | 'add-hundreds-simple'           // 100単位の簡単な計算
  | 'add-double-missing'            // 2桁の虫食い算（たし算）
  | 'sub-double-missing'            // 2桁の虫食い算（ひき算）
  | 'mult-single-missing'           // 九九の虫食い算
  
  // 3年生のパターン
  | 'add-triple-digit'              // 3桁の足し算
  | 'sub-triple-digit'              // 3桁の引き算
  | 'mult-double-digit'             // 2桁×1桁
  | 'div-basic'                     // 基本的なわり算（九九の範囲）
  | 'add-dec-simple'                // 小数のたし算（0.1の位まで）
  | 'sub-dec-simple'                // 小数のひき算（0.1の位まで）
  | 'frac-same-denom'               // 同分母分数の加減
  
  // 4年生のパターン
  | 'add-large-numbers'             // 大きな数の足し算
  | 'sub-large-numbers'             // 大きな数の引き算
  | 'mult-triple-digit'             // 3桁×1桁
  | 'div-with-remainder'            // あまりのあるわり算
  | 'mult-dec-int'                  // 整数×小数
  | 'div-dec-int'                   // 整数÷小数
  | 'frac-mixed-number'             // 帯分数の計算
  
  // 5年生のパターン
  | 'mult-dec-dec'                  // 小数×小数
  | 'div-dec-dec'                   // 小数÷小数
  | 'frac-different-denom'          // 異分母分数の加減算
  | 'frac-simplify'                 // 分数の約分
  | 'percent-basic'                 // 百分率の基本
  | 'area-volume'                   // 面積・体積
  
  // 6年生のパターン
  | 'frac-mult'                     // 分数×分数
  | 'frac-div'                      // 分数÷分数
  | 'ratio-proportion'              // 比と比例
  | 'speed-time-distance'           // 速さ・時間・距離
  | 'complex-calc';                 // 複雑な計算

// 学年別の利用可能なパターン
export const PATTERNS_BY_GRADE: Record<number, CalculationPattern[]> = {
  1: [
    'add-single-digit',
    'add-single-digit-carry',
    'add-to-10',
    'add-10-plus',
    'sub-single-digit',
    'sub-single-digit-borrow',
    'sub-from-10',
    'add-sub-mixed-basic',
    'add-single-missing',
    'sub-single-missing'
  ],
  2: [
    'add-double-digit-no-carry',
    'add-double-digit-carry',
    'sub-double-digit-no-borrow',
    'sub-double-digit-borrow',
    'add-sub-double-mixed',
    'mult-single-digit',
    'add-hundreds-simple',
    'add-double-missing',
    'sub-double-missing',
    'mult-single-missing'
  ],
  3: [
    'add-triple-digit',
    'sub-triple-digit',
    'mult-double-digit',
    'div-basic',
    'add-dec-simple',
    'sub-dec-simple',
    'frac-same-denom'
  ],
  4: [
    'add-large-numbers',
    'sub-large-numbers',
    'mult-triple-digit',
    'div-with-remainder',
    'mult-dec-int',
    'div-dec-int',
    'frac-mixed-number'
  ],
  5: [
    'mult-dec-dec',
    'div-dec-dec',
    'frac-different-denom',
    'frac-simplify',
    'percent-basic',
    'area-volume'
  ],
  6: [
    'frac-mult',
    'frac-div',
    'ratio-proportion',
    'speed-time-distance',
    'complex-calc'
  ]
};

// パターンの表示名
export const PATTERN_LABELS: Record<CalculationPattern, string> = {
  // 1年生
  'add-single-digit': '1桁のたし算（10まで）',
  'add-single-digit-carry': '1桁のたし算（繰り上がりあり）',
  'add-to-10': '10を作る計算',
  'add-10-plus': '10＋□の計算',
  'sub-single-digit': '1桁のひき算（繰り下がりなし）',
  'sub-single-digit-borrow': '1桁のひき算（繰り下がりあり）',
  'sub-from-10': '10－□の計算',
  'add-sub-mixed-basic': 'たし算・ひき算ミックス',
  'add-single-missing': 'たし算の虫食い算',
  'sub-single-missing': 'ひき算の虫食い算',
  
  // 2年生
  'add-double-digit-no-carry': '2桁のたし算（繰り上がりなし）',
  'add-double-digit-carry': '2桁のたし算（繰り上がりあり）',
  'sub-double-digit-no-borrow': '2桁のひき算（繰り下がりなし）',
  'sub-double-digit-borrow': '2桁のひき算（繰り下がりあり）',
  'add-sub-double-mixed': '2桁のたし算・ひき算混合',
  'mult-single-digit': '九九（かけ算）',
  'add-hundreds-simple': '100単位の計算',
  'add-double-missing': '2桁たし算の虫食い算',
  'sub-double-missing': '2桁ひき算の虫食い算',
  'mult-single-missing': '九九の虫食い算',
  
  // 3年生
  'add-triple-digit': '3桁のたし算',
  'sub-triple-digit': '3桁のひき算',
  'mult-double-digit': '2桁×1桁のかけ算',
  'div-basic': '基本的なわり算',
  'add-dec-simple': '小数のたし算',
  'sub-dec-simple': '小数のひき算',
  'frac-same-denom': '同じ分母の分数',
  
  // 4年生
  'add-large-numbers': '大きな数のたし算',
  'sub-large-numbers': '大きな数のひき算',
  'mult-triple-digit': '3桁×1桁のかけ算',
  'div-with-remainder': 'あまりのあるわり算',
  'mult-dec-int': '整数×小数',
  'div-dec-int': '整数÷小数',
  'frac-mixed-number': '帯分数の計算',
  
  // 5年生
  'mult-dec-dec': '小数×小数',
  'div-dec-dec': '小数÷小数',
  'frac-different-denom': '異なる分母の分数',
  'frac-simplify': '分数の約分',
  'percent-basic': '百分率（％）',
  'area-volume': '面積・体積',
  
  // 6年生
  'frac-mult': '分数×分数',
  'frac-div': '分数÷分数',
  'ratio-proportion': '比と比例',
  'speed-time-distance': '速さ・時間・距離',
  'complex-calc': '複雑な計算'
};

// パターンの説明
export const PATTERN_DESCRIPTIONS: Record<CalculationPattern, string> = {
  // 1年生
  'add-single-digit': '5＋3などの基本的なたし算',
  'add-single-digit-carry': '8＋7などの繰り上がりのあるたし算',
  'add-to-10': '□＋△＝10になる組み合わせ',
  'add-10-plus': '10＋5などの計算',
  'sub-single-digit': '8－3などの基本的なひき算',
  'sub-single-digit-borrow': '13－5などの繰り下がりのあるひき算',
  'sub-from-10': '10から引く計算',
  'add-sub-mixed-basic': 'たし算とひき算を混ぜた問題',
  'add-single-missing': '□＋3＝7 のような虫食い算',
  'sub-single-missing': '8－□＝3 のような虫食い算',
  
  // 2年生
  'add-double-digit-no-carry': '23＋45などの繰り上がりのないたし算',
  'add-double-digit-carry': '67＋58などの繰り上がりのあるたし算',
  'sub-double-digit-no-borrow': '86－32などの繰り下がりのないひき算',
  'sub-double-digit-borrow': '72－38などの繰り下がりのあるひき算',
  'add-sub-double-mixed': 'たし算・ひき算の混合（繰り上がり/下がり混在）',
  'mult-single-digit': '1×1から9×9までの九九',
  'add-hundreds-simple': '300＋200などの100単位の計算',
  'add-double-missing': '□＋23＝45 のような2桁の虫食い算',
  'sub-double-missing': '56－□＝23 のような2桁の虫食い算',
  'mult-single-missing': '□×3＝12 のような九九の虫食い算',
  
  // 3年生
  'add-triple-digit': '234＋567などの3桁のたし算',
  'sub-triple-digit': '876－432などの3桁のひき算',
  'mult-double-digit': '34×6などの2桁×1桁の計算',
  'div-basic': '48÷6などの九九範囲のわり算',
  'add-dec-simple': '1.2＋0.5などの小数のたし算',
  'sub-dec-simple': '3.5－1.2などの小数のひき算',
  'frac-same-denom': '2/5＋1/5などの同じ分母の分数',
  
  // 4年生
  'add-large-numbers': '1234＋5678などの大きな数のたし算',
  'sub-large-numbers': '8765－4321などの大きな数のひき算',
  'mult-triple-digit': '234×5などの3桁×1桁のかけ算',
  'div-with-remainder': '50÷7などのあまりのあるわり算',
  'mult-dec-int': '25×2.3などの整数×小数',
  'div-dec-int': '7.2÷2.4などの整数÷小数',
  'frac-mixed-number': '1と2/3＋2と1/4などの帯分数',
  
  // 5年生
  'mult-dec-dec': '1.2×3.4などの小数同士のかけ算',
  'div-dec-dec': '5.6÷1.4などの小数同士のわり算',
  'frac-different-denom': '1/2＋1/3などの異なる分母の分数',
  'frac-simplify': '6/9を24/3に約分する計算',
  'percent-basic': '50％は0.5など百分率の計算',
  'area-volume': '長方形の面積や直方体の体積',
  
  // 6年生
  'frac-mult': '2/3×3/4などの分数同士のかけ算',
  'frac-div': '3/5÷2/3などの分数同士のわり算',
  'ratio-proportion': '2:3の比の値や比例式',
  'speed-time-distance': '速さ・時間・距離の関係',
  'complex-calc': '12＋8×3－15÷5などの四則混合'
};