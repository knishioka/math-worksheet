import type { WordTopic } from './word-topics';
import type { PrintRows } from '../types';

export interface EntranceTopic {
  grade: 4 | 5 | 6;
  difficulty?: 2 | 3;
  topics: readonly [WordTopic, ...WordTopic[]];
  printRows: { ja: PrintRows; en: PrintRows };
  ja: readonly [string, string];
  en: readonly [string, string];
}

interface EntranceDefinition {
  label: string;
  description: string;
  grade: EntranceTopic['grade'];
  type: 'word' | 'word-en';
  category: 'entrance';
  difficulty: 2 | 3;
  topics: readonly WordTopic[];
  printRows: PrintRows;
}

export function entranceDefinitions<K extends string, L extends 'en' | 'jap'>(
  units: Record<K, EntranceTopic>,
  language: L
): Record<`entrance-${K}-${L}`, EntranceDefinition> {
  return Object.fromEntries(
    (Object.keys(units) as K[]).map((key) => {
      const unit = units[key];
      const locale = language === 'en' ? 'en' : 'ja';
      const [label, description] = unit[locale];
      const definition: EntranceDefinition = {
        label,
        description,
        grade: unit.grade,
        difficulty: unit.difficulty ?? 3,
        topics: unit.topics,
        printRows: unit.printRows[locale],
        category: 'entrance',
        type: language === 'en' ? 'word-en' : 'word',
      };
      return [`entrance-${key}-${language}`, definition];
    })
  ) as Record<`entrance-${K}-${L}`, EntranceDefinition>;
}
