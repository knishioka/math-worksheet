import type {
  WorksheetSettings,
  CalculationPattern,
  Operation,
} from '../../types';
import { PATTERN_LABELS } from '../../types/calculation-patterns';
import { getOperationName } from './formatting';

export interface PreviewTitleFormatOptions {
  gradeFirst?: boolean;
  wrapGradeInParentheses?: boolean;
  separator?: string;
}

export interface PreviewTitleLabelOverrides {
  gradeSuffix?: string;
  fractionPrefix?: string;
  decimalPrefix?: string;
  mixedNumberPrefix?: string;
  patternLabels?: Partial<Record<CalculationPattern, string>>;
}

export interface BuildPreviewTitleOptions {
  settings: WorksheetSettings;
  format?: PreviewTitleFormatOptions;
  labels?: PreviewTitleLabelOverrides;
  operationNameFn?: (
    operation: Operation,
    calculationPattern?: CalculationPattern
  ) => string;
}

const DEFAULT_FORMAT: Required<PreviewTitleFormatOptions> = {
  gradeFirst: false,
  wrapGradeInParentheses: true,
  separator: ' ',
};

const DEFAULT_LABELS: Required<Omit<PreviewTitleLabelOverrides, 'patternLabels'>> = {
  gradeSuffix: '年生',
  fractionPrefix: '分数の',
  decimalPrefix: '小数の',
  mixedNumberPrefix: '帯分数の',
};

export function buildPreviewTitle({
  settings,
  format,
  labels,
  operationNameFn = getOperationName,
}: BuildPreviewTitleOptions): string {
  const effectiveFormat = { ...DEFAULT_FORMAT, ...format };
  const { patternLabels, ...labelOverrides } = labels ?? {};
  const effectiveLabels: Required<
    Omit<PreviewTitleLabelOverrides, 'patternLabels'>
  > = { ...DEFAULT_LABELS, ...labelOverrides };
  const gradeLabel = `${settings.grade}${effectiveLabels.gradeSuffix}`;

  const patternLabel = settings.calculationPattern
    ? patternLabels?.[settings.calculationPattern] ??
      PATTERN_LABELS[settings.calculationPattern]
    : undefined;

  const operationName = operationNameFn(
    settings.operation,
    settings.calculationPattern
  );

  const topic = getTitleTopic({
    patternLabel,
    problemType: settings.problemType,
    operationName,
    labels: effectiveLabels,
  });

  if (effectiveFormat.gradeFirst) {
    return `${gradeLabel}${effectiveFormat.separator}${topic}`;
  }

  if (effectiveFormat.wrapGradeInParentheses) {
    return `${topic} (${gradeLabel})`;
  }

  return `${topic}${effectiveFormat.separator}${gradeLabel}`;
}

function getTitleTopic({
  patternLabel,
  problemType,
  operationName,
  labels,
}: {
  patternLabel?: string;
  problemType: WorksheetSettings['problemType'];
  operationName: string;
  labels: Required<Omit<PreviewTitleLabelOverrides, 'patternLabels'>>;
}): string {
  if (patternLabel) {
    return patternLabel;
  }

  switch (problemType) {
    case 'fraction':
      return `${labels.fractionPrefix}${operationName}`;
    case 'decimal':
      return `${labels.decimalPrefix}${operationName}`;
    case 'mixed':
      return `${labels.mixedNumberPrefix}${operationName}`;
    default:
      return operationName;
  }
}
