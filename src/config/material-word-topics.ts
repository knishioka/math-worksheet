import type { CalculationPattern } from '../types';
import {
  SUPPLEMENTAL_PATTERNS,
  isSupplementalPattern,
} from './supplemental-patterns';
import type { PatternCategory } from './pattern-categories';
import type { WordTopic } from './word-topics';
import {
  ENGLISH_STORY_UNITS,
  isEnglishUnitPattern,
} from '../lib/generators/templates/en-word-story';

// 従来の生活教材は、日英で共通の教材IDとシリーズ名を使う。
const lifeSeries: Record<string, readonly WordTopic[]> = {
  money: ['money'],
  shopping: ['money'],
  allowance: ['money'],
  transport: ['money'],
  time: ['time'],
  calendar: ['time'],
  unit: ['measurement'],
  distance: ['measurement'],
  temperature: ['measurement'],
  cooking: ['measurement'],
  energy: ['measurement'],
};
const specificTopics: Record<string, readonly WordTopic[]> = {
  'cooking-serving': ['division', 'multiplication'],
  'cooking-time': ['time'],
  'cooking-ingredients': ['ratio', 'measurement'],
  'distance-map-scale': ['ratio', 'measurement'],
  'calendar-age': ['age', 'time'],
  'shopping-discount': ['money', 'percent'],
  'speed-time-distance': ['speed'],
};

export function getMaterialWordTopics(
  pattern: CalculationPattern,
  key: string,
  category: PatternCategory
): readonly WordTopic[] {
  if (isSupplementalPattern(pattern)) {
    const definition = SUPPLEMENTAL_PATTERNS[pattern];
    if ('topics' in definition && definition.topics) return definition.topics;
  }
  if (isEnglishUnitPattern(pattern)) return [ENGLISH_STORY_UNITS[pattern]];
  if (specificTopics[key]) return specificTopics[key];
  if (category === 'life')
    return lifeSeries[key.split('-')[0]] ?? ['reasoning'];
  if (category === 'geometry') return ['geometry'];
  if (category === 'data') return ['data'];
  if (category === 'singapore') return ['arithmetic'];
  if (category === 'word' && pattern !== 'word-en') return ['reasoning'];
  return [];
}
