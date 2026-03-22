import type { Problem, WorksheetSettings } from '../../../types';
import { generateGradeEnWordProblems } from '../word-problem-en';
import { generateGradeMoneyProblems } from '../money-problems';
import { generateGradeMoneyProblemsEn } from '../money-problems-en';
import { generateGradeTimeProblems } from '../time-problems';
import { generateGradeTimeProblemsEn } from '../time-problems-en';
import { generateGradeUnitProblems } from '../unit-problems';
import { generateGradeUnitProblemsEn } from '../unit-problems-en';
import { generateGradeShoppingProblems } from '../shopping-problems';
import { generateGradeShoppingProblemsEn } from '../shopping-problems-en';
import { generateGradeTemperatureProblems } from '../temperature-problems';
import { generateGradeTemperatureProblemsEn } from '../temperature-problems-en';
import { generateGradeDistanceProblems } from '../distance-problems';
import { generateGradeDistanceProblemsEn } from '../distance-problems-en';
import { generateGradeCookingProblems } from '../cooking-problems';
import { generateGradeCookingProblemsEn } from '../cooking-problems-en';
import { generateGradeCalendarProblems } from '../calendar-problems';
import { generateGradeCalendarProblemsEn } from '../calendar-problems-en';
import { generateGradeEnergyProblems } from '../energy-problems';
import { generateGradeEnergyProblemsEn } from '../energy-problems-en';
import { generateGradeTransportProblems } from '../transport-problems';
import { generateGradeTransportProblemsEn } from '../transport-problems-en';
import { generateGradeAllowanceProblems } from '../allowance-problems';
import { generateGradeAllowanceProblemsEn } from '../allowance-problems-en';
import {
  generateComplement10,
  generateComplement100,
  generateChangeMaking,
  generateGradeAnzanRoundingProblems,
  generateAnzanDecompositionProblems,
  generateAnzanSequentialProblems,
} from '../anzan-problems';

import {
  generateAddPlusOne,
  generateAddPlusTwo,
  generateAddCounting,
  generateCountingAdd,
  generateCountingSub,
  generateAddSingleDigit,
  generateAddSingleDigitCarry,
  generateAddTo10,
  generateAdd10Plus,
  generateSubSingleDigit,
  generateSubSingleDigitBorrow,
  generateSubFrom10,
  generateAddSubMixedBasic,
} from './grade1';

import {
  generateAddDoubleDigitNoCarry,
  generateAddDoubleDigitCarry,
  generateSubDoubleDigitNoBorrow,
  generateSubDoubleDigitBorrow,
  generateMultSingleDigit,
  generateAddSubDoubleMixed,
  generateAddHundredsSimple,
} from './grade2';

import {
  generateAddTripleDigit,
  generateSubTripleDigit,
  generateMultDoubleDigit,
  generateDivBasic,
  generateAddDecSimple,
  generateSubDecSimple,
  generateFracSameDenom,
} from './grade3';

import {
  generateAddLargeNumbers,
  generateSubLargeNumbers,
  generateMultTripleDigit,
  generateDivWithRemainder,
  generateMultDecInt,
  generateDivDecInt,
  generateFracMixedNumber,
} from './grade4';

import {
  generateMultDecDec,
  generateDivDecDec,
  generateFracDifferentDenom,
  generateFracSimplify,
  generatePercentBasic,
  generateAreaVolume,
} from './grade5';

import {
  generateFracMult,
  generateFracDiv,
  generateRatioProportion,
  generateSpeedTimeDistance,
  generateComplexCalc,
} from './grade6';

import {
  generateAddSingleMissing,
  generateSubSingleMissing,
  generateAddDoubleMissing,
  generateSubDoubleMissing,
  generateMultSingleMissing,
} from './missing-numbers';

import {
  generateHissanAddDouble,
  generateHissanSubDouble,
  generateHissanAddTriple,
  generateHissanSubTriple,
  generateHissanMultBasic,
  generateHissanMultAdvanced,
  generateHissanDivBasic,
} from './hissan';

import {
  generateAnzanMul5,
  generateAnzanMul9,
  generateAnzanMul11,
  generateAnzanMul25,
} from './anzan-special';

/**
 * 計算パターンに基づいて問題を生成
 */
export function generatePatternProblems(
  settings: WorksheetSettings,
  count: number
): Problem[] {
  const pattern = settings.calculationPattern;

  if (!pattern) {
    throw new Error('Calculation pattern is not specified');
  }

  switch (pattern) {
    // 1年生（入門）のパターン
    case 'add-plus-one':
      return generateAddPlusOne(settings, count);
    case 'add-plus-two':
      return generateAddPlusTwo(settings, count);
    case 'add-counting':
      return generateAddCounting(settings, count);
    case 'counting-add':
      return generateCountingAdd(settings, count);
    case 'counting-sub':
      return generateCountingSub(settings, count);

    // 1年生のパターン
    case 'add-single-digit':
      return generateAddSingleDigit(settings, count);
    case 'add-single-digit-carry':
      return generateAddSingleDigitCarry(settings, count);
    case 'add-to-10':
      return generateAddTo10(settings, count);
    case 'add-10-plus':
      return generateAdd10Plus(settings, count);
    case 'sub-single-digit':
      return generateSubSingleDigit(settings, count);
    case 'sub-single-digit-borrow':
      return generateSubSingleDigitBorrow(settings, count);
    case 'sub-from-10':
      return generateSubFrom10(settings, count);
    case 'add-sub-mixed-basic':
      return generateAddSubMixedBasic(settings, count);
    case 'add-single-missing':
      return generateAddSingleMissing(settings, count);
    case 'sub-single-missing':
      return generateSubSingleMissing(settings, count);

    // 2年生のパターン
    case 'add-double-digit-no-carry':
      return generateAddDoubleDigitNoCarry(settings, count);
    case 'add-double-digit-carry':
      return generateAddDoubleDigitCarry(settings, count);
    case 'sub-double-digit-no-borrow':
      return generateSubDoubleDigitNoBorrow(settings, count);
    case 'sub-double-digit-borrow':
      return generateSubDoubleDigitBorrow(settings, count);
    case 'add-sub-double-mixed':
      return generateAddSubDoubleMixed(settings, count);
    case 'mult-single-digit':
      return generateMultSingleDigit(settings, count);
    case 'add-hundreds-simple':
      return generateAddHundredsSimple(settings, count);
    case 'add-double-missing':
      return generateAddDoubleMissing(settings, count);
    case 'sub-double-missing':
      return generateSubDoubleMissing(settings, count);
    case 'mult-single-missing':
      return generateMultSingleMissing(settings, count);
    case 'hissan-add-double':
      return generateHissanAddDouble(settings, count);
    case 'hissan-sub-double':
      return generateHissanSubDouble(settings, count);

    // 3年生のパターン
    case 'add-triple-digit':
      return generateAddTripleDigit(settings, count);
    case 'sub-triple-digit':
      return generateSubTripleDigit(settings, count);
    case 'mult-double-digit':
      return generateMultDoubleDigit(settings, count);
    case 'div-basic':
      return generateDivBasic(settings, count);
    case 'add-dec-simple':
      return generateAddDecSimple(settings, count);
    case 'sub-dec-simple':
      return generateSubDecSimple(settings, count);
    case 'frac-same-denom':
      return generateFracSameDenom(settings, count);
    case 'hissan-add-triple':
      return generateHissanAddTriple(settings, count);
    case 'hissan-sub-triple':
      return generateHissanSubTriple(settings, count);
    case 'hissan-mult-basic':
      return generateHissanMultBasic(settings, count);

    // 4年生のパターン
    case 'add-large-numbers':
      return generateAddLargeNumbers(settings, count);
    case 'sub-large-numbers':
      return generateSubLargeNumbers(settings, count);
    case 'mult-triple-digit':
      return generateMultTripleDigit(settings, count);
    case 'div-with-remainder':
      return generateDivWithRemainder(settings, count);
    case 'mult-dec-int':
      return generateMultDecInt(settings, count);
    case 'div-dec-int':
      return generateDivDecInt(settings, count);
    case 'frac-mixed-number':
      return generateFracMixedNumber(settings, count);
    case 'hissan-mult-advanced':
      return generateHissanMultAdvanced(settings, count);
    case 'hissan-div-basic':
      return generateHissanDivBasic(settings, count);

    // 5年生のパターン
    case 'mult-dec-dec':
      return generateMultDecDec(settings, count);
    case 'div-dec-dec':
      return generateDivDecDec(settings, count);
    case 'frac-different-denom':
      return generateFracDifferentDenom(settings, count);
    case 'frac-simplify':
      return generateFracSimplify(settings, count);
    case 'percent-basic':
      return generatePercentBasic(settings, count);
    case 'area-volume':
      return generateAreaVolume(settings, count);

    // 6年生のパターン
    case 'frac-mult':
      return generateFracMult(settings, count);
    case 'frac-div':
      return generateFracDiv(settings, count);
    case 'ratio-proportion':
      return generateRatioProportion(settings, count);
    case 'speed-time-distance':
      return generateSpeedTimeDistance(settings, count);
    case 'complex-calc':
      return generateComplexCalc(settings, count);

    // 英語文章問題（全学年対応）
    case 'word-en':
      return generateGradeEnWordProblems(settings.grade, count);

    // お金の計算（日本円）
    case 'money-change-jap':
    case 'money-total-jap':
    case 'money-payment-jap':
      return generateGradeMoneyProblems(settings.grade, count, pattern);

    // お金の計算（リンギット）
    case 'money-change-en':
    case 'money-total-en':
    case 'money-payment-en':
      return generateGradeMoneyProblemsEn(settings.grade, count, pattern);

    // 時刻・時間（日本語）
    case 'time-reading-jap':
    case 'time-elapsed-jap':
    case 'time-calc-jap':
      return generateGradeTimeProblems(settings.grade, count, pattern);

    // 時刻・時間（英語）
    case 'time-reading-en':
    case 'time-elapsed-en':
    case 'time-calc-en':
      return generateGradeTimeProblemsEn(settings.grade, count, pattern);

    // 単位変換（日本語）
    case 'unit-length-jap':
    case 'unit-weight-jap':
    case 'unit-capacity-jap':
      return generateGradeUnitProblems(settings.grade, count, pattern);

    // 単位変換（英語）
    case 'unit-length-en':
    case 'unit-weight-en':
    case 'unit-capacity-en':
      return generateGradeUnitProblemsEn(settings.grade, count, pattern);

    // 買い物の計算（日本語）
    case 'shopping-discount-jap':
    case 'shopping-budget-jap':
    case 'shopping-comparison-jap':
      return generateGradeShoppingProblems(settings.grade, count, pattern);

    // 買い物の計算（英語）
    case 'shopping-discount-en':
    case 'shopping-budget-en':
    case 'shopping-comparison-en':
      return generateGradeShoppingProblemsEn(settings.grade, count, pattern);

    // 温度の計算（日本語）
    case 'temperature-diff-jap':
    case 'temperature-conversion-jap':
      return generateGradeTemperatureProblems(settings.grade, count, pattern);

    // 温度の計算（英語）
    case 'temperature-diff-en':
    case 'temperature-conversion-en':
      return generateGradeTemperatureProblemsEn(settings.grade, count, pattern);

    // 距離と地図の計算（日本語）
    case 'distance-walk-jap':
    case 'distance-map-scale-jap':
    case 'distance-comparison-jap':
      return generateGradeDistanceProblems(settings.grade, count, pattern);

    // 距離と地図の計算（英語）
    case 'distance-walk-en':
    case 'distance-map-scale-en':
    case 'distance-comparison-en':
      return generateGradeDistanceProblemsEn(settings.grade, count, pattern);

    // 料理の計算（日本語）
    case 'cooking-ingredients-jap':
    case 'cooking-time-jap':
    case 'cooking-serving-jap':
      return generateGradeCookingProblems(settings.grade, count, pattern);

    // 料理の計算（英語）
    case 'cooking-ingredients-en':
    case 'cooking-time-en':
    case 'cooking-serving-en':
      return generateGradeCookingProblemsEn(settings.grade, count, pattern);

    // カレンダー・日付の計算（日本語）
    case 'calendar-days-jap':
    case 'calendar-week-jap':
    case 'calendar-age-jap':
      return generateGradeCalendarProblems(settings.grade, count, pattern);

    // カレンダー・日付の計算（英語）
    case 'calendar-days-en':
    case 'calendar-week-en':
    case 'calendar-age-en':
      return generateGradeCalendarProblemsEn(settings.grade, count, pattern);

    // 省エネ・電気の計算（日本語）
    case 'energy-usage-jap':
    case 'energy-saving-jap':
      return generateGradeEnergyProblems(settings.grade, count, pattern);

    // 省エネ・電気の計算（英語）
    case 'energy-usage-en':
    case 'energy-saving-en':
      return generateGradeEnergyProblemsEn(settings.grade, count, pattern);

    // 交通費の計算（日本語）
    case 'transport-fare-jap':
    case 'transport-change-jap':
    case 'transport-discount-jap':
      return generateGradeTransportProblems(settings.grade, count, pattern);

    // 交通費の計算（英語）
    case 'transport-fare-en':
    case 'transport-change-en':
    case 'transport-discount-en':
      return generateGradeTransportProblemsEn(settings.grade, count, pattern);

    // お小遣いの管理（日本語）
    case 'allowance-saving-jap':
    case 'allowance-goal-jap':
      return generateGradeAllowanceProblems(settings.grade, count, pattern);

    // お小遣いの管理（英語）
    case 'allowance-saving-en':
    case 'allowance-goal-en':
      return generateGradeAllowanceProblemsEn(settings.grade, count, pattern);

    // 暗算のコツ - 丸めて計算
    case 'anzan-round-add':
    case 'anzan-round-sub':
    case 'anzan-round-mul':
      return generateGradeAnzanRoundingProblems(settings.grade, count, pattern);

    // 特殊数系暗算パターン（実装済み）
    case 'anzan-mul-5':
      return generateAnzanMul5(settings, count);
    case 'anzan-mul-9':
      return generateAnzanMul9(settings, count);
    case 'anzan-mul-11':
      return generateAnzanMul11(settings, count);
    case 'anzan-mul-25':
      return generateAnzanMul25(settings, count);

    // 暗算のコツ - 補数系パターン
    case 'anzan-complement-10':
      return generateComplement10(settings.grade, count);
    case 'anzan-complement-100':
      return generateComplement100(settings.grade, count);
    case 'anzan-change-making':
      return generateChangeMaking(settings.grade, count);

    // 暗算のコツ - 分解・結合系（実装済み）
    case 'anzan-distributive':
    case 'anzan-mul-decompose':
    case 'anzan-square-diff':
      return generateAnzanDecompositionProblems(settings.grade, count, pattern);

    // 暗算のコツ - 連続計算・総合系（実装済み）
    case 'anzan-pair-sum':
    case 'anzan-reorder':
    case 'anzan-mixed':
      return generateAnzanSequentialProblems(settings.grade, count, pattern);

    default:
      throw new Error(`Pattern ${pattern} is not implemented yet`);
  }
}
