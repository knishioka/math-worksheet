import type { Grade, WordProblemEn } from '../../types';
import { generateId, randomInt } from '../utils/math';
import {
  getTemplatesForGrade,
  type MissingNumberTemplate,
} from './templates/en-missing-number';
import { getStoriesForGrade } from './templates/en-word-story';

/**
 * Generate missing number problems in English
 * Examples: "6 and [] makes 16", "[] plus 3 equals 8"
 */
export function generateEnMissingNumber(
  grade: Grade,
  count: number
): WordProblemEn[] {
  const problems: WordProblemEn[] = [];
  const templates = getTemplatesForGrade(grade);
  const usedProblems = new Set<string>();

  for (let i = 0; i < count; i++) {
    let problem: WordProblemEn | null = null;
    let attempts = 0;
    const maxAttempts = 50;

    while (!problem && attempts < maxAttempts) {
      // Select random template
      const template =
        templates[randomInt(0, templates.length - 1)];

      // Generate numbers based on operation
      const { problemText, answer, key } = generateProblemFromTemplate(
        template,
        grade
      );

      // Avoid duplicates
      if (!usedProblems.has(key)) {
        usedProblems.add(key);
        problem = {
          id: generateId(),
          type: 'word-en',
          operation: template.operation,
          problemText,
          answer,
          category: 'missing-number',
          showCalculation: false,
          language: 'en',
        };
      }

      attempts++;
    }

    if (problem) {
      problems.push(problem);
    }
  }

  return problems;
}

/**
 * Generate word story problems in English
 * Examples: "Jen has 19 paper clips. 6 are red, 3 are green..."
 */
export function generateEnWordStory(
  grade: Grade,
  count: number
): WordProblemEn[] {
  const problems: WordProblemEn[] = [];
  const stories = getStoriesForGrade(grade);

  if (stories.length === 0) {
    // Fallback to missing number for grades without stories
    return generateEnMissingNumber(grade, count);
  }

  for (let i = 0; i < count; i++) {
    // Select random story template
    const story = stories[randomInt(0, stories.length - 1)];
    const { text, answer, operation } = story.generateProblem(grade);

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation,
      problemText: text,
      answer,
      category: story.category,
      showCalculation: true,
      language: 'en',
    });
  }

  return problems;
}

/**
 * Generate grade-appropriate English word problems
 * Only generates word story problems (not missing number problems)
 */
export function generateGradeEnWordProblems(
  grade: Grade,
  count: number
): WordProblemEn[] {
  // Generate only word story problems for a cleaner experience
  return generateEnWordStory(grade, count);
}

/**
 * Helper: Generate problem from template
 */
function generateProblemFromTemplate(
  template: MissingNumberTemplate,
  grade: Grade
): { problemText: string; answer: number; key: string } {
  const maxNum = Math.min(
    template.maxNumber,
    grade === 1 ? 20 : grade === 2 ? 100 : 1000
  );

  let a: number, b: number, answer: number;

  switch (template.operation) {
    case 'addition': {
      answer = randomInt(3, maxNum);
      a = randomInt(1, answer - 1);
      b = answer - a;
      break;
    }

    case 'subtraction': {
      a = randomInt(5, maxNum);
      b = randomInt(1, a - 1);
      answer = a - b;
      break;
    }

    case 'multiplication': {
      const maxFactor = Math.min(9, Math.floor(Math.sqrt(maxNum)));
      a = randomInt(2, maxFactor);
      b = randomInt(2, maxFactor);
      answer = a * b;
      break;
    }

    case 'division': {
      const maxFactor = Math.min(9, Math.floor(Math.sqrt(maxNum)));
      b = randomInt(2, maxFactor);
      answer = randomInt(2, maxFactor);
      a = b * answer;
      break;
    }

    default:
      throw new Error(`Unsupported operation: ${template.operation}`);
  }

  const problemText = template.template
    .replace('{a}', String(a))
    .replace('{b}', String(b))
    .replace('{answer}', String(answer));

  const key = `${template.operation}-${a}-${b}-${answer}`;

  return { problemText, answer, key };
}

