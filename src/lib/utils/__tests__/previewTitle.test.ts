import { describe, it, expect } from 'vitest';
import type { WorksheetSettings } from '../../../types';
import { PATTERN_LABELS } from '../../../types';
import { buildPreviewTitle } from '../previewTitle';

const baseSettings: WorksheetSettings = {
  grade: 3,
  problemType: 'basic',
  operation: 'addition',
  problemCount: 10,
  layoutColumns: 2,
};

describe('buildPreviewTitle', () => {
  const worksheetFormat = { description: 'worksheet preview title' } as const;
  const problemListFormat = {
    description: 'problem list header',
    format: { gradeFirst: true, wrapGradeInParentheses: false },
  } as const;

  const permutations: Array<{
    description: string;
    settings: WorksheetSettings;
    expectedTopic: string;
  }> = [
    {
      description: 'calculation pattern label takes priority',
      settings: { ...baseSettings, calculationPattern: 'add-single-digit' },
      expectedTopic: PATTERN_LABELS['add-single-digit'],
    },
    {
      description: 'fraction problems prefix the operation',
      settings: { ...baseSettings, problemType: 'fraction' },
      expectedTopic: '分数のたし算',
    },
    {
      description: 'decimal problems prefix the operation',
      settings: { ...baseSettings, problemType: 'decimal' },
      expectedTopic: '小数のたし算',
    },
    {
      description: 'mixed number problems prefix the operation',
      settings: { ...baseSettings, problemType: 'mixed' },
      expectedTopic: '帯分数のたし算',
    },
    {
      description: 'basic problems default to the operation name',
      settings: { ...baseSettings },
      expectedTopic: 'たし算',
    },
  ];

  const formats = [worksheetFormat, problemListFormat] as const;

  formats.forEach((formatConfig) => {
    const { description } = formatConfig;
    const format = 'format' in formatConfig ? formatConfig.format : undefined;

    describe(description, () => {
      permutations.forEach(({ description: permutationDescription, settings, expectedTopic }) => {
        it(`matches current output for ${permutationDescription}`, () => {
          const title = buildPreviewTitle({ settings, format });

          if (format?.gradeFirst) {
            expect(title).toBe(`3年生 ${expectedTopic}`);
          } else {
            expect(title).toBe(`${expectedTopic} (3年生)`);
          }
        });
      });
    });
  });

  it('falls back to suffix formatting without parentheses when requested', () => {
    const title = buildPreviewTitle({
      settings: baseSettings,
      format: { wrapGradeInParentheses: false },
    });

    expect(title).toBe('たし算 3年生');
  });

  it('respects label overrides and custom operation names', () => {
    const title = buildPreviewTitle({
      settings: { ...baseSettings, calculationPattern: 'add-single-digit' },
      labels: {
        patternLabels: { 'add-single-digit': 'カスタムラベル' },
        gradeSuffix: '年級',
      },
      operationNameFn: () => 'オリジナル演算',
    });

    expect(title).toBe('カスタムラベル (3年級)');
  });
});
