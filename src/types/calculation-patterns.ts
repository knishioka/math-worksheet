// 計算パターンの定義
export type CalculationPattern =
  // 1年生のパターン
  | 'add-single-digit' // 1桁＋1桁（答えが10まで）
  | 'add-single-digit-carry' // 1桁＋1桁（繰り上がりあり、答えが20まで）
  | 'add-to-10' // 10を作る計算（□＋△＝10）
  | 'add-10-plus' // 10＋□の計算
  | 'sub-single-digit' // 1桁－1桁（繰り下がりなし）
  | 'sub-single-digit-borrow' // 繰り下がりのある引き算（20まで）
  | 'sub-from-10' // 10－□の計算
  | 'add-sub-mixed-basic' // たし算・ひき算混合（10まで）
  | 'add-single-missing' // □＋△＝答え の虫食い算
  | 'sub-single-missing' // □－△＝答え の虫食い算

  // 2年生のパターン
  | 'add-double-digit-no-carry' // 2桁＋2桁（繰り上がりなし）
  | 'add-double-digit-carry' // 2桁＋2桁（繰り上がりあり）
  | 'sub-double-digit-no-borrow' // 2桁－2桁（繰り下がりなし）
  | 'sub-double-digit-borrow' // 2桁－2桁（繰り下がりあり）
  | 'add-sub-double-mixed' // 2桁の足し算・引き算混合（繰り上がり/下がり混在）
  | 'mult-single-digit' // 九九（1×1〜9×9）
  | 'add-hundreds-simple' // 100単位の簡単な計算
  | 'add-double-missing' // 2桁の虫食い算（たし算）
  | 'sub-double-missing' // 2桁の虫食い算（ひき算）
  | 'mult-single-missing' // 九九の虫食い算
  | 'hissan-add-double' // 2桁のたし算の筆算
  | 'hissan-sub-double' // 2桁のひき算の筆算

  // 3年生のパターン
  | 'add-triple-digit' // 3桁の足し算
  | 'sub-triple-digit' // 3桁の引き算
  | 'mult-double-digit' // 2桁×1桁
  | 'div-basic' // 基本的なわり算（九九の範囲）
  | 'add-dec-simple' // 小数のたし算（0.1の位まで）
  | 'sub-dec-simple' // 小数のひき算（0.1の位まで）
  | 'frac-same-denom' // 同分母分数の加減
  | 'hissan-add-triple' // 3桁のたし算の筆算
  | 'hissan-sub-triple' // 3桁のひき算の筆算
  | 'hissan-mult-basic' // 2桁×1桁のかけ算の筆算

  // 4年生のパターン
  | 'add-large-numbers' // 大きな数の足し算
  | 'sub-large-numbers' // 大きな数の引き算
  | 'mult-triple-digit' // 3桁×1桁
  | 'div-with-remainder' // あまりのあるわり算
  | 'mult-dec-int' // 整数×小数
  | 'div-dec-int' // 整数÷小数
  | 'frac-mixed-number' // 帯分数の計算
  | 'hissan-mult-advanced' // 3桁×2桁のかけ算の筆算
  | 'hissan-div-basic' // わり算の筆算

  // 5年生のパターン
  | 'mult-dec-dec' // 小数×小数
  | 'div-dec-dec' // 小数÷小数
  | 'frac-different-denom' // 異分母分数の加減算
  | 'frac-simplify' // 分数の約分
  | 'percent-basic' // 百分率の基本
  | 'area-volume' // 面積・体積

  // 6年生のパターン
  | 'frac-mult' // 分数×分数
  | 'frac-div' // 分数÷分数
  | 'ratio-proportion' // 比と比例
  | 'speed-time-distance' // 速さ・時間・距離
  | 'complex-calc' // 複雑な計算

  // 英語文章問題（全学年対応）
  | 'word-en' // English word problems for international schools

  // お金の計算（1-4年生）
  | 'money-change-jap' // おつりの計算（日本円）
  | 'money-total-jap' // お金の合計（日本円）
  | 'money-payment-jap' // 支払い方法（日本円）
  | 'money-change-en' // Change calculation (Malaysian Ringgit)
  | 'money-total-en' // Money total (Malaysian Ringgit)
  | 'money-payment-en' // Payment methods (Malaysian Ringgit)

  // 時刻・時間の計算（2-4年生）
  | 'time-reading-jap' // 時刻の読み方（日本語）
  | 'time-elapsed-jap' // 経過時間（日本語）
  | 'time-calc-jap' // 時間の計算（日本語）
  | 'time-reading-en' // Reading time (English)
  | 'time-elapsed-en' // Elapsed time (English)
  | 'time-calc-en' // Time calculation (English)

  // 単位変換（3-6年生）
  | 'unit-length-jap' // 長さの単位変換（m, cm, mm, km）
  | 'unit-weight-jap' // 重さの単位変換（kg, g）
  | 'unit-capacity-jap' // かさの単位変換（L, dL, mL）
  | 'unit-length-en' // Length unit conversion (m, cm, mm, km)
  | 'unit-weight-en' // Weight unit conversion (kg, g)
  | 'unit-capacity-en' // Capacity unit conversion (L, mL)

  // 買い物の計算（3-6年生）
  | 'shopping-discount-jap' // 割引計算（日本円）
  | 'shopping-budget-jap' // 予算内の買い物（日本円）
  | 'shopping-comparison-jap' // 値段の比較（日本円）
  | 'shopping-discount-en' // Discount calculation (RM)
  | 'shopping-budget-en' // Shopping within budget (RM)
  | 'shopping-comparison-en' // Price comparison (RM)

  // 温度の計算（2-6年生）
  | 'temperature-diff-jap' // 温度差の計算（日本語）
  | 'temperature-conversion-jap' // 温度の変換（日本語、高学年）
  | 'temperature-diff-en' // Temperature difference (English)
  | 'temperature-conversion-en' // Temperature conversion (English)

  // 距離と地図の計算（3-6年生）
  | 'distance-walk-jap' // 歩く距離の計算（日本語）
  | 'distance-map-scale-jap' // 地図の縮尺計算（日本語、高学年）
  | 'distance-comparison-jap' // 距離の比較（日本語）
  | 'distance-walk-en' // Walking distance (English)
  | 'distance-map-scale-en' // Map scale calculation (English)
  | 'distance-comparison-en' // Distance comparison (English)

  // 料理の計算（3-6年生）
  | 'cooking-ingredients-jap' // 材料の量の計算（日本語）
  | 'cooking-time-jap' // 調理時間の計算（日本語）
  | 'cooking-serving-jap' // 人数分の計算（日本語）
  | 'cooking-ingredients-en' // Ingredient quantities (English)
  | 'cooking-time-en' // Cooking time calculation (English)
  | 'cooking-serving-en' // Serving size calculation (English)

  // カレンダー・日付の計算（2-4年生）
  | 'calendar-days-jap' // 日数の計算（日本語）
  | 'calendar-week-jap' // 週数の計算（日本語）
  | 'calendar-age-jap' // 年齢の計算（日本語）
  | 'calendar-days-en' // Days calculation (English)
  | 'calendar-week-en' // Weeks calculation (English)
  | 'calendar-age-en' // Age calculation (English)

  // 省エネ・電気の計算（4-6年生）
  | 'energy-usage-jap' // 電気使用量の計算（日本語）
  | 'energy-saving-jap' // 節約額の計算（日本語）
  | 'energy-usage-en' // Energy usage calculation (English)
  | 'energy-saving-en' // Energy saving calculation (English)

  // 交通費の計算（2-4年生）
  | 'transport-fare-jap' // 運賃の計算（日本円）
  | 'transport-change-jap' // 交通機関のおつり（日本円）
  | 'transport-discount-jap' // 回数券・定期券（日本円）
  | 'transport-fare-en' // Transportation fare (RM)
  | 'transport-change-en' // Transport change (RM)
  | 'transport-discount-en' // Ticket/Pass discounts (RM)

  // お小遣いの管理（2-4年生）
  | 'allowance-saving-jap' // 貯金の計算（日本円）
  | 'allowance-goal-jap' // 目標達成までの計算（日本円）
  | 'allowance-saving-en' // Saving calculation (RM)
  | 'allowance-goal-en'; // Savings goal (RM)

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
    'sub-single-missing',
    'word-en',
    'money-change-jap',
    'money-total-jap',
    'money-change-en',
    'money-total-en',
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
    'mult-single-missing',
    'hissan-add-double',
    'hissan-sub-double',
    'word-en',
    'money-change-jap',
    'money-total-jap',
    'money-payment-jap',
    'money-change-en',
    'money-total-en',
    'money-payment-en',
    'time-reading-jap',
    'time-elapsed-jap',
    'time-reading-en',
    'time-elapsed-en',
    'temperature-diff-jap',
    'temperature-diff-en',
    'calendar-days-jap',
    'calendar-week-jap',
    'calendar-age-jap',
    'calendar-days-en',
    'calendar-week-en',
    'calendar-age-en',
    'transport-fare-jap',
    'transport-change-jap',
    'transport-fare-en',
    'transport-change-en',
    'allowance-saving-jap',
    'allowance-goal-jap',
    'allowance-saving-en',
    'allowance-goal-en',
  ],
  3: [
    'add-triple-digit',
    'sub-triple-digit',
    'mult-double-digit',
    'div-basic',
    'add-dec-simple',
    'sub-dec-simple',
    'frac-same-denom',
    'hissan-add-triple',
    'hissan-sub-triple',
    'hissan-mult-basic',
    'word-en',
    'money-change-jap',
    'money-total-jap',
    'money-payment-jap',
    'money-change-en',
    'money-total-en',
    'money-payment-en',
    'time-reading-jap',
    'time-elapsed-jap',
    'time-calc-jap',
    'time-reading-en',
    'time-elapsed-en',
    'time-calc-en',
    'unit-length-jap',
    'unit-weight-jap',
    'unit-capacity-jap',
    'unit-length-en',
    'unit-weight-en',
    'unit-capacity-en',
    'shopping-discount-jap',
    'shopping-budget-jap',
    'shopping-comparison-jap',
    'shopping-discount-en',
    'shopping-budget-en',
    'shopping-comparison-en',
    'temperature-diff-jap',
    'temperature-diff-en',
    'distance-walk-jap',
    'distance-comparison-jap',
    'distance-walk-en',
    'distance-comparison-en',
    'cooking-ingredients-jap',
    'cooking-time-jap',
    'cooking-serving-jap',
    'cooking-ingredients-en',
    'cooking-time-en',
    'cooking-serving-en',
    'calendar-days-jap',
    'calendar-week-jap',
    'calendar-age-jap',
    'calendar-days-en',
    'calendar-week-en',
    'calendar-age-en',
    'transport-fare-jap',
    'transport-change-jap',
    'transport-discount-jap',
    'transport-fare-en',
    'transport-change-en',
    'transport-discount-en',
    'allowance-saving-jap',
    'allowance-goal-jap',
    'allowance-saving-en',
    'allowance-goal-en',
  ],
  4: [
    'add-large-numbers',
    'sub-large-numbers',
    'mult-triple-digit',
    'div-with-remainder',
    'mult-dec-int',
    'div-dec-int',
    'frac-mixed-number',
    'hissan-mult-advanced',
    'hissan-div-basic',
    'word-en',
    'money-change-jap',
    'money-total-jap',
    'money-payment-jap',
    'money-change-en',
    'money-total-en',
    'money-payment-en',
    'time-reading-jap',
    'time-elapsed-jap',
    'time-calc-jap',
    'time-reading-en',
    'time-elapsed-en',
    'time-calc-en',
    'unit-length-jap',
    'unit-weight-jap',
    'unit-capacity-jap',
    'unit-length-en',
    'unit-weight-en',
    'unit-capacity-en',
    'shopping-discount-jap',
    'shopping-budget-jap',
    'shopping-comparison-jap',
    'shopping-discount-en',
    'shopping-budget-en',
    'shopping-comparison-en',
    'temperature-diff-jap',
    'temperature-diff-en',
    'distance-walk-jap',
    'distance-comparison-jap',
    'distance-walk-en',
    'distance-comparison-en',
    'cooking-ingredients-jap',
    'cooking-time-jap',
    'cooking-serving-jap',
    'cooking-ingredients-en',
    'cooking-time-en',
    'cooking-serving-en',
    'calendar-days-jap',
    'calendar-week-jap',
    'calendar-age-jap',
    'calendar-days-en',
    'calendar-week-en',
    'calendar-age-en',
    'energy-usage-jap',
    'energy-saving-jap',
    'energy-usage-en',
    'energy-saving-en',
    'transport-fare-jap',
    'transport-change-jap',
    'transport-discount-jap',
    'transport-fare-en',
    'transport-change-en',
    'transport-discount-en',
    'allowance-saving-jap',
    'allowance-goal-jap',
    'allowance-saving-en',
    'allowance-goal-en',
  ],
  5: [
    'mult-dec-dec',
    'div-dec-dec',
    'frac-different-denom',
    'frac-simplify',
    'percent-basic',
    'area-volume',
    'word-en',
    'unit-length-jap',
    'unit-weight-jap',
    'unit-capacity-jap',
    'unit-length-en',
    'unit-weight-en',
    'unit-capacity-en',
    'shopping-discount-jap',
    'shopping-budget-jap',
    'shopping-comparison-jap',
    'shopping-discount-en',
    'shopping-budget-en',
    'shopping-comparison-en',
    'temperature-diff-jap',
    'temperature-conversion-jap',
    'temperature-diff-en',
    'temperature-conversion-en',
    'distance-walk-jap',
    'distance-map-scale-jap',
    'distance-comparison-jap',
    'distance-walk-en',
    'distance-map-scale-en',
    'distance-comparison-en',
    'cooking-ingredients-jap',
    'cooking-time-jap',
    'cooking-serving-jap',
    'cooking-ingredients-en',
    'cooking-time-en',
    'cooking-serving-en',
    'energy-usage-jap',
    'energy-saving-jap',
    'energy-usage-en',
    'energy-saving-en',
  ],
  6: [
    'frac-mult',
    'frac-div',
    'ratio-proportion',
    'speed-time-distance',
    'complex-calc',
    'word-en',
    'unit-length-jap',
    'unit-weight-jap',
    'unit-capacity-jap',
    'unit-length-en',
    'unit-weight-en',
    'unit-capacity-en',
    'shopping-discount-jap',
    'shopping-budget-jap',
    'shopping-comparison-jap',
    'shopping-discount-en',
    'shopping-budget-en',
    'shopping-comparison-en',
    'temperature-diff-jap',
    'temperature-conversion-jap',
    'temperature-diff-en',
    'temperature-conversion-en',
    'distance-walk-jap',
    'distance-map-scale-jap',
    'distance-comparison-jap',
    'distance-walk-en',
    'distance-map-scale-en',
    'distance-comparison-en',
    'cooking-ingredients-jap',
    'cooking-time-jap',
    'cooking-serving-jap',
    'cooking-ingredients-en',
    'cooking-time-en',
    'cooking-serving-en',
    'energy-usage-jap',
    'energy-saving-jap',
    'energy-usage-en',
    'energy-saving-en',
  ],
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
  'hissan-add-double': '2桁のたし算の筆算',
  'hissan-sub-double': '2桁のひき算の筆算',

  // 3年生
  'add-triple-digit': '3桁のたし算',
  'sub-triple-digit': '3桁のひき算',
  'mult-double-digit': '2桁×1桁のかけ算',
  'div-basic': '基本的なわり算',
  'add-dec-simple': '小数のたし算',
  'sub-dec-simple': '小数のひき算',
  'frac-same-denom': '同じ分母の分数',
  'hissan-add-triple': '3桁のたし算の筆算',
  'hissan-sub-triple': '3桁のひき算の筆算',
  'hissan-mult-basic': '2桁×1桁のかけ算の筆算',

  // 4年生
  'add-large-numbers': '大きな数のたし算',
  'sub-large-numbers': '大きな数のひき算',
  'mult-triple-digit': '3桁×1桁のかけ算',
  'div-with-remainder': 'あまりのあるわり算',
  'mult-dec-int': '整数×小数',
  'div-dec-int': '整数÷小数',
  'frac-mixed-number': '帯分数の計算',
  'hissan-mult-advanced': '3桁×2桁のかけ算の筆算',
  'hissan-div-basic': 'わり算の筆算',

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
  'complex-calc': '複雑な計算',

  // 英語文章問題
  'word-en': 'English Word Problems',

  // お金の計算
  'money-change-jap': 'おつりの計算',
  'money-total-jap': 'お金の合計',
  'money-payment-jap': '支払い方法',
  'money-change-en': 'Change Calculation (RM)',
  'money-total-en': 'Money Total (RM)',
  'money-payment-en': 'Payment Methods (RM)',

  // 時刻・時間
  'time-reading-jap': '時刻の読み方',
  'time-elapsed-jap': '経過時間',
  'time-calc-jap': '時間の計算',
  'time-reading-en': 'Reading Time',
  'time-elapsed-en': 'Elapsed Time',
  'time-calc-en': 'Time Calculation',

  // 単位変換
  'unit-length-jap': '長さの単位（m, cm, mm, km）',
  'unit-weight-jap': '重さの単位（kg, g）',
  'unit-capacity-jap': 'かさの単位（L, dL, mL）',
  'unit-length-en': 'Length Units (m, cm, mm, km)',
  'unit-weight-en': 'Weight Units (kg, g)',
  'unit-capacity-en': 'Capacity Units (L, mL)',

  // 買い物の計算
  'shopping-discount-jap': '割引計算',
  'shopping-budget-jap': '予算内の買い物',
  'shopping-comparison-jap': '値段の比較',
  'shopping-discount-en': 'Discount Calculation',
  'shopping-budget-en': 'Shopping within Budget',
  'shopping-comparison-en': 'Price Comparison',

  // 温度の計算
  'temperature-diff-jap': '温度差の計算',
  'temperature-conversion-jap': '温度の変換（℃⇔℉）',
  'temperature-diff-en': 'Temperature Difference',
  'temperature-conversion-en': 'Temperature Conversion (°C⇔°F)',

  // 距離と地図
  'distance-walk-jap': '歩く距離の計算',
  'distance-map-scale-jap': '地図の縮尺',
  'distance-comparison-jap': '距離の比較',
  'distance-walk-en': 'Walking Distance',
  'distance-map-scale-en': 'Map Scale',
  'distance-comparison-en': 'Distance Comparison',

  // 料理の計算
  'cooking-ingredients-jap': '材料の量（倍量・半量）',
  'cooking-time-jap': '調理時間',
  'cooking-serving-jap': '人数分の計算',
  'cooking-ingredients-en': 'Ingredient Quantities',
  'cooking-time-en': 'Cooking Time',
  'cooking-serving-en': 'Serving Size',

  // カレンダー・日付
  'calendar-days-jap': '日数の計算',
  'calendar-week-jap': '週数の計算',
  'calendar-age-jap': '年齢の計算',
  'calendar-days-en': 'Days Calculation',
  'calendar-week-en': 'Weeks Calculation',
  'calendar-age-en': 'Age Calculation',

  // 省エネ・電気
  'energy-usage-jap': '電気使用量',
  'energy-saving-jap': '節約額',
  'energy-usage-en': 'Energy Usage',
  'energy-saving-en': 'Energy Saving',

  // 交通費
  'transport-fare-jap': '運賃の計算',
  'transport-change-jap': '交通機関のおつり',
  'transport-discount-jap': '回数券・定期券',
  'transport-fare-en': 'Transportation Fare',
  'transport-change-en': 'Transport Change',
  'transport-discount-en': 'Ticket/Pass Discounts',

  // お小遣い管理
  'allowance-saving-jap': '貯金の計算',
  'allowance-goal-jap': '目標達成までの期間',
  'allowance-saving-en': 'Saving Calculation',
  'allowance-goal-en': 'Savings Goal',
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
  'hissan-add-double': '2桁＋2桁の筆算形式',
  'hissan-sub-double': '2桁－2桁の筆算形式',

  // 3年生
  'add-triple-digit': '234＋567などの3桁のたし算',
  'sub-triple-digit': '876－432などの3桁のひき算',
  'mult-double-digit': '34×6などの2桁×1桁の計算',
  'div-basic': '48÷6などの九九範囲のわり算',
  'add-dec-simple': '1.2＋0.5などの小数のたし算',
  'sub-dec-simple': '3.5－1.2などの小数のひき算',
  'frac-same-denom': '2/5＋1/5などの同じ分母の分数',
  'hissan-add-triple': '3桁＋3桁の筆算形式',
  'hissan-sub-triple': '3桁－3桁の筆算形式',
  'hissan-mult-basic': '2桁×1桁の筆算形式（例：34×6）',

  // 4年生
  'add-large-numbers': '1234＋5678などの大きな数のたし算',
  'sub-large-numbers': '8765－4321などの大きな数のひき算',
  'mult-triple-digit': '234×5などの3桁×1桁のかけ算',
  'div-with-remainder': '50÷7などのあまりのあるわり算',
  'mult-dec-int': '25×2.3などの整数×小数',
  'div-dec-int': '7.2÷2.4などの整数÷小数',
  'frac-mixed-number': '1と2/3＋2と1/4などの帯分数',
  'hissan-mult-advanced': '3桁×2桁の筆算形式（例：234×56）',
  'hissan-div-basic': 'わり算の筆算形式（例：84÷7）',

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
  'complex-calc': '12＋8×3－15÷5などの四則混合',

  // 英語文章問題
  'word-en': 'English word story problems for international school students (e.g., "Tom has 5 apples. He gets 3 more. How many apples does he have now?")',

  // お金の計算
  'money-change-jap': '100円で68円のお菓子を買ったら、おつりはいくら？',
  'money-total-jap': '50円のえんぴつと30円の消しゴムで、合計いくら？',
  'money-payment-jap': '150円の買い物を100円玉と50円玉で支払う方法',
  'money-change-en': 'Buy candy for RM2.50 with RM5. How much change?',
  'money-total-en': 'A pencil costs RM1.50 and an eraser costs RM0.80. Total?',
  'money-payment-en': 'How to pay RM3.50 using RM1 and RM0.50 coins?',

  // 時刻・時間
  'time-reading-jap': '時計の針を見て、何時何分か答える',
  'time-elapsed-jap': '8時30分から2時間30分後は何時？',
  'time-calc-jap': '午前9時から午後3時まで何時間？',
  'time-reading-en': 'Read the clock: What time is it?',
  'time-elapsed-en': '2 hours 30 minutes after 8:30 is what time?',
  'time-calc-en': 'How many hours from 9:00 AM to 3:00 PM?',

  // 単位変換
  'unit-length-jap': '3m 50cm = □cm、1.5km = □m',
  'unit-weight-jap': '2kg 300g = □g、2500g = □kg □g',
  'unit-capacity-jap': '2L 400mL = □mL、1.5L = □dL',
  'unit-length-en': '3m 50cm = □cm, 1.5km = □m',
  'unit-weight-en': '2kg 300g = □g, 2500g = □kg □g',
  'unit-capacity-en': '2L 400mL = □mL, 1.5L = □mL',

  // 買い物の計算
  'shopping-discount-jap': '800円のTシャツが20%OFF。いくらになる？',
  'shopping-budget-jap': '500円で買えるお菓子は？',
  'shopping-comparison-jap': '50g で100円と80g で150円、どちらがお得？',
  'shopping-discount-en': 'RM40 shirt with 25% discount. How much to pay?',
  'shopping-budget-en': 'What can you buy with RM10 budget?',
  'shopping-comparison-en': 'Which is better value: 50g for RM2 or 80g for RM3?',

  // 温度の計算
  'temperature-diff-jap': '朝15℃、昼25℃。何度上がった？',
  'temperature-conversion-jap': '25℃は華氏何度？（高学年）',
  'temperature-diff-en': 'Temperature rose from 20°C to 28°C. How much?',
  'temperature-conversion-en': '25°C = □°F, 77°F = □°C',

  // 距離と地図
  'distance-walk-jap': '家から学校800m、学校から公園600m。合計何km？',
  'distance-map-scale-jap': '地図の1cm が実際の500m。3cm は何m？',
  'distance-comparison-jap': '1.2km と1500m、どちらが長い？',
  'distance-walk-en': 'Home to school 1.2km, school to park 800m. Total?',
  'distance-map-scale-en': '1cm on map = 500m in reality. 3cm = ?',
  'distance-comparison-en': 'Which is longer: 1.2km or 1500m?',

  // 料理の計算
  'cooking-ingredients-jap': '4人分で砂糖50g。6人分だと何g？',
  'cooking-time-jap': 'ケーキを焼くのに40分。3時に食べるには何時に始める？',
  'cooking-serving-jap': '8個のクッキーを4人で分けると1人何個？',
  'cooking-ingredients-en': 'Recipe for 4 uses 200g flour. How much for 6 people?',
  'cooking-time-en': 'Baking takes 40 minutes. Start time to eat at 3 PM?',
  'cooking-serving-en': 'Share 12 cookies among 4 people. How many each?',

  // カレンダー・日付
  'calendar-days-jap': '5月10日から20日後は何月何日？',
  'calendar-week-jap': '28日は何週間？',
  'calendar-age-jap': '2010年生まれの人は今年何歳？',
  'calendar-days-en': 'Today is May 15. What date is 25 days later?',
  'calendar-week-en': 'How many weeks in 28 days?',
  'calendar-age-en': 'Born in 2010. How old this year?',

  // 省エネ・電気
  'energy-usage-jap': '1時間50Wh の電気を3時間使うと何Wh？',
  'energy-saving-jap': 'LED で月500円節約。1年で何円？',
  'energy-usage-en': 'Device uses 40Wh per hour. Usage in 5 hours?',
  'energy-saving-en': 'Save RM20 monthly with LED. Yearly savings?',

  // 交通費
  'transport-fare-jap': 'バス1回150円。10回乗ると何円？',
  'transport-change-jap': '280円の切符を500円で買う。おつりは？',
  'transport-discount-jap': '10回で1500円の回数券。1回あたり何円？',
  'transport-fare-en': 'Bus fare RM2.50 per trip. Cost for 8 trips?',
  'transport-change-en': 'Buy RM2.80 ticket with RM5. Change?',
  'transport-discount-en': '10-trip pass costs RM20. Price per trip?',

  // お小遣い管理
  'allowance-saving-jap': '毎週100円貯金。500円貯めるには何週間？',
  'allowance-goal-jap': '1000円のゲームを買いたい。毎月200円貯金すると何ヶ月？',
  'allowance-saving-en': 'Save RM5 weekly. How many weeks to save RM50?',
  'allowance-goal-en': 'Want to buy RM80 toy. Save RM10 monthly. How long?',
};
