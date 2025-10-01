export type Operation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division';

export type ProblemType =
  | 'basic'
  | 'fraction'
  | 'decimal'
  | 'mixed'
  | 'hissan'
  | 'missing'
  | 'word';

export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type LayoutColumns = 1 | 2 | 3;

// 計算パターンの型をインポート
export type { CalculationPattern } from './calculation-patterns';
export {
  PATTERNS_BY_GRADE,
  PATTERN_LABELS,
  PATTERN_DESCRIPTIONS,
} from './calculation-patterns';
import type { CalculationPattern } from './calculation-patterns';

export interface BasicProblem {
  id: string;
  type: 'basic';
  operation: Operation;
  operand1: number | null;
  operand2: number | null;
  answer: number | null;
  carryOver?: boolean;
  missingPosition?: 'operand1' | 'operand2' | 'answer';
}

export interface HissanProblem {
  id: string;
  type: 'hissan';
  operation: Operation;
  operand1: number;
  operand2: number;
  answer: number;
  showProcess?: boolean; // 計算過程を表示するか
  showCarry?: boolean; // 繰り上がり・繰り下がりを表示するか
  showPartialProducts?: boolean; // 部分積を表示するか（かけ算）
  remainder?: number; // 余り（わり算）
}

export interface FractionProblem {
  id: string;
  type: 'fraction';
  operation: Operation;
  numerator1: number;
  denominator1: number;
  numerator2?: number;
  denominator2?: number;
  answerNumerator: number;
  answerDenominator: number;
  simplified?: boolean; // 約分済みかどうか
}

export interface DecimalProblem {
  id: string;
  type: 'decimal';
  operation: Operation;
  operand1: number; // 12.5 など
  operand2: number; // 3.7 など
  answer: number;
  decimalPlaces: number; // 小数点以下の桁数
}

export interface MixedNumberProblem {
  id: string;
  type: 'mixed';
  operation: Operation;
  whole1: number;
  numerator1: number;
  denominator1: number;
  whole2?: number;
  numerator2?: number;
  denominator2?: number;
  answerWhole: number;
  answerNumerator: number;
  answerDenominator: number;
}

export interface MissingNumberProblem {
  id: string;
  type: 'missing';
  operation: Operation;
  operand1: number | null;
  operand2: number | null;
  answer: number | null;
  missingPosition: 'operand1' | 'operand2' | 'answer';
}

export interface WordProblem {
  id: string;
  type: 'word';
  operation: Operation;
  problemText: string;
  answer: number | string;
  unit?: string;
  showCalculation?: boolean;
}

export type Problem =
  | BasicProblem
  | FractionProblem
  | DecimalProblem
  | MixedNumberProblem
  | HissanProblem
  | MissingNumberProblem
  | WordProblem;

export interface WorksheetSettings {
  grade: Grade;
  problemType: ProblemType;
  operation: Operation;
  calculationPattern?: CalculationPattern;
  problemCount: number;
  layoutColumns: LayoutColumns;
  title?: string;
  studentName?: string;
  date?: string;
}

export interface WorksheetData {
  settings: WorksheetSettings;
  problems: Problem[];
  generatedAt: Date;
}
