import type { Problem, WorksheetSettings, Operation } from '../../types';
import { generateAdditionProblems, generateGradeAdditionProblems } from './addition';
import { generateSubtractionProblems, generateGradeSubtractionProblems } from './subtraction';
import { generateMultiplicationProblems, generateGradeMultiplicationProblems } from './multiplication';
import { generateDivisionProblems, generateGradeDivisionProblems } from './division';
import { generateGradeFractionProblems } from './fraction';
import { generateGradeDecimalProblems } from './decimal';

/**
 * Main problem generator that routes to appropriate operation generator
 */
export function generateProblems(settings: WorksheetSettings): Problem[] {
  const { operation, problemType, problemCount, grade } = settings;

  // 問題タイプ別の処理
  if (problemType === 'fraction') {
    return generateGradeFractionProblems(grade, problemCount);
  }
  
  if (problemType === 'decimal') {
    return generateGradeDecimalProblems(grade, problemCount);
  }

  // 従来の基本計算
  switch (operation) {
    case 'addition':
      return generateGradeAdditionProblems(grade, problemCount);
    
    case 'subtraction':
      return generateGradeSubtractionProblems(grade, problemCount);
    
    case 'multiplication':
      return generateGradeMultiplicationProblems(grade, problemCount);
    
    case 'division':
      return generateGradeDivisionProblems(grade, problemCount);
    
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

/**
 * Generate mixed operation problems
 */
export function generateMixedProblems(
  settings: WorksheetSettings,
  operations: Operation[]
): Problem[] {
  const problemsPerOperation = Math.floor(settings.problemCount / operations.length);
  const remainingProblems = settings.problemCount % operations.length;
  
  const allProblems: Problem[] = [];

  operations.forEach((operation, index) => {
    const count = problemsPerOperation + (index < remainingProblems ? 1 : 0);
    const operationSettings = { ...settings, operation };
    
    const problems = generateProblems(operationSettings);
    allProblems.push(...problems.slice(0, count));
  });

  // Shuffle the problems to mix operations randomly
  return shuffleArray(allProblems);
}

/**
 * Generate problems with custom difficulty levels
 */
export function generateCustomProblems(
  settings: WorksheetSettings,
  customOptions: {
    minNumber?: number;
    maxNumber?: number;
    includeCarryOver?: boolean;
    operation: Operation;
  }
): Problem[] {
  const customSettings = {
    ...settings,
    ...customOptions,
  };

  switch (customOptions.operation) {
    case 'addition':
      return generateAdditionProblems(customSettings, settings.problemCount, {
        minNumber: customOptions.minNumber,
        maxNumber: customOptions.maxNumber,
        includeCarryOver: customOptions.includeCarryOver,
      });
    
    case 'subtraction':
      return generateSubtractionProblems(customSettings, settings.problemCount, {
        minNumber: customOptions.minNumber,
        maxNumber: customOptions.maxNumber,
        includeBorrow: customOptions.includeCarryOver,
      });
    
    case 'multiplication':
      return generateMultiplicationProblems(customSettings, settings.problemCount, {
        minNumber: customOptions.minNumber,
        maxNumber: customOptions.maxNumber,
      });
    
    case 'division':
      return generateDivisionProblems(customSettings, settings.problemCount, {
        minDividend: customOptions.minNumber,
        maxDividend: customOptions.maxNumber,
      });
    
    default:
      throw new Error(`Unsupported operation: ${customOptions.operation}`);
  }
}

/**
 * Generate problems for specific educational patterns
 */
export function generateEducationalProblems(
  _operation: Operation,
  _count: number,
  _pattern: string
): Problem[] {
  // This function will be implemented when educational patterns are needed
  // For now, return empty array to satisfy the interface
  return [];
}

/**
 * Utility function to shuffle an array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Validate problem settings
 */
export function validateSettings(settings: WorksheetSettings): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (settings.problemCount <= 0) {
    errors.push('Problem count must be greater than 0');
  }

  if (settings.problemCount > 100) {
    errors.push('Problem count should not exceed 100');
  }

  if (settings.grade < 1 || settings.grade > 6) {
    errors.push('Grade must be between 1 and 6');
  }

  if (settings.minNumber && settings.maxNumber && settings.minNumber > settings.maxNumber) {
    errors.push('Minimum number cannot be greater than maximum number');
  }

  if (settings.layoutColumns < 1 || settings.layoutColumns > 3) {
    errors.push('Layout columns must be between 1 and 3');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Re-export all generator functions for convenience
export * from './addition';
export * from './subtraction';
export * from './multiplication';
export * from './division';
export * from './fraction';
export * from './decimal';