import type { Operation } from '../../../types';

/**
 * Missing number problem templates for English
 */

export interface MissingNumberTemplate {
  template: string; // Template with {a}, {b}, {answer}, []
  operation: Operation;
  minGrade: number;
  maxNumber: number; // Maximum number for this template
}

/**
 * Grade 1: Simple missing number problems (1-20)
 */
export const GRADE_1_TEMPLATES: MissingNumberTemplate[] = [
  // Addition
  { template: '{a} and [] makes {answer}', operation: 'addition', minGrade: 1, maxNumber: 20 },
  { template: '[] and {b} makes {answer}', operation: 'addition', minGrade: 1, maxNumber: 20 },
  { template: '{a} plus [] equals {answer}', operation: 'addition', minGrade: 1, maxNumber: 20 },
  { template: '[] plus {b} equals {answer}', operation: 'addition', minGrade: 1, maxNumber: 20 },
  { template: '{a} + [] = {answer}', operation: 'addition', minGrade: 1, maxNumber: 20 },
  { template: '[] + {b} = {answer}', operation: 'addition', minGrade: 1, maxNumber: 20 },

  // Subtraction
  { template: '{a} take away [] is {answer}', operation: 'subtraction', minGrade: 1, maxNumber: 20 },
  { template: '{a} minus [] equals {answer}', operation: 'subtraction', minGrade: 1, maxNumber: 20 },
  { template: '{a} - [] = {answer}', operation: 'subtraction', minGrade: 1, maxNumber: 20 },
  { template: '[] - {b} = {answer}', operation: 'subtraction', minGrade: 1, maxNumber: 20 },
];

/**
 * Grade 2: Multiplication and larger numbers (1-100)
 */
export const GRADE_2_TEMPLATES: MissingNumberTemplate[] = [
  ...GRADE_1_TEMPLATES.map(t => ({ ...t, maxNumber: 100 })),

  // Multiplication
  { template: '{a} times [] equals {answer}', operation: 'multiplication', minGrade: 2, maxNumber: 81 },
  { template: '[] times {b} equals {answer}', operation: 'multiplication', minGrade: 2, maxNumber: 81 },
  { template: '{a} × [] = {answer}', operation: 'multiplication', minGrade: 2, maxNumber: 81 },
  { template: '[] × {b} = {answer}', operation: 'multiplication', minGrade: 2, maxNumber: 81 },
];

/**
 * Grade 3+: Division and complex patterns (1-1000)
 */
export const GRADE_3_PLUS_TEMPLATES: MissingNumberTemplate[] = [
  ...GRADE_2_TEMPLATES.map(t => ({ ...t, maxNumber: t.operation === 'multiplication' ? 81 : 1000 })),

  // Division
  { template: '{a} divided by [] equals {answer}', operation: 'division', minGrade: 3, maxNumber: 81 },
  { template: '[] divided by {b} equals {answer}', operation: 'division', minGrade: 3, maxNumber: 81 },
  { template: '{a} ÷ [] = {answer}', operation: 'division', minGrade: 3, maxNumber: 81 },
];

/**
 * Get appropriate templates for a grade level
 */
export function getTemplatesForGrade(grade: number): MissingNumberTemplate[] {
  if (grade === 1) {
    return GRADE_1_TEMPLATES;
  } else if (grade === 2) {
    return GRADE_2_TEMPLATES;
  } else {
    return GRADE_3_PLUS_TEMPLATES;
  }
}
