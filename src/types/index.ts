export type Operation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division';

export type ProblemType = 'basic' | 'hissan' | 'missing' | 'word';

export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type LayoutColumns = 1 | 2 | 3;

export interface BasicProblem {
  id: string;
  type: 'basic';
  operation: Operation;
  operand1: number;
  operand2: number;
  answer: number;
  carryOver?: boolean;
}

export interface HissanProblem {
  id: string;
  type: 'hissan';
  operation: Operation;
  operand1: number;
  operand2: number;
  answer: number;
  showProcess?: boolean;
  carryOverDisplay?: boolean;
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

export type Problem = BasicProblem | HissanProblem | MissingNumberProblem;

export interface WorksheetSettings {
  grade: Grade;
  problemType: ProblemType;
  operation: Operation;
  problemCount: number;
  layoutColumns: LayoutColumns;
  includeCarryOver?: boolean;
  minNumber?: number;
  maxNumber?: number;
  title?: string;
  studentName?: string;
  date?: string;
}

export interface WorksheetData {
  settings: WorksheetSettings;
  problems: Problem[];
  generatedAt: Date;
}
