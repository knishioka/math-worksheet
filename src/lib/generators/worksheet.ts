import type { WorksheetData, WorksheetSettings } from '../../types';
import { generateProblems, validateSettings } from './index';

/** レイアウト変更では問題を保ち、問題数の増減では末尾だけを調整する。 */
export function buildWorksheet(
  settings: WorksheetSettings,
  previous?: WorksheetData
): WorksheetData {
  const validation = validateSettings(settings);
  if (!validation.valid) throw new Error(validation.errors.join('\n'));

  const sameMaterial =
    previous &&
    previous.settings.grade === settings.grade &&
    previous.settings.problemType === settings.problemType &&
    previous.settings.operation === settings.operation &&
    previous.settings.calculationPattern === settings.calculationPattern;

  if (!sameMaterial) {
    return {
      settings: { ...settings },
      problems: generateProblems(settings),
      generatedAt: new Date(),
    };
  }

  const count =
    settings.problemType === 'number-tracing' ? 10 : settings.problemCount;
  const problems =
    previous.problems.length === count
      ? previous.problems
      : previous.problems.slice(0, count);
  if (problems.length < count) {
    problems.push(
      ...generateProblems({
        ...settings,
        problemCount: count - problems.length,
      })
    );
  }
  return {
    settings: { ...settings },
    problems,
    generatedAt: previous.generatedAt,
  };
}
