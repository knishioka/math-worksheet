import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  parseUrlSettings,
  settingsToUrlParams,
  syncUrlFromSettings,
} from '../url-state';
import type { WorksheetSettings } from '../../../types';

const defaults: WorksheetSettings = {
  grade: 1,
  problemType: 'basic',
  operation: 'addition',
  problemCount: 30,
  layoutColumns: 3,
};

describe('parseUrlSettings', () => {
  it('returns empty object when no URL params', () => {
    expect(parseUrlSettings('', defaults)).toEqual({});
  });

  it('parses valid grade', () => {
    const result = parseUrlSettings('?grade=4', defaults);
    expect(result.grade).toBe(4);
  });

  it('falls back to default for invalid grade', () => {
    const result = parseUrlSettings('?grade=99', defaults);
    expect(result.grade).toBe(1);
  });

  it('falls back to default for non-numeric grade', () => {
    const result = parseUrlSettings('?grade=abc', defaults);
    expect(result.grade).toBe(1);
  });

  it('parses valid problemType', () => {
    const result = parseUrlSettings('?type=fraction', defaults);
    expect(result.problemType).toBe('fraction');
  });

  it('falls back to default for invalid problemType', () => {
    const result = parseUrlSettings('?type=invalid', defaults);
    expect(result.problemType).toBe('basic');
  });

  it('parses valid calculationPattern', () => {
    const result = parseUrlSettings('?pattern=add-single-digit', defaults);
    expect(result.calculationPattern).toBe('add-single-digit');
    expect(result.operation).toBe('addition');
  });

  it('derives operation from pattern', () => {
    const result = parseUrlSettings('?pattern=sub-single-digit', defaults);
    expect(result.operation).toBe('subtraction');
  });

  it('derives division operation for conversion patterns', () => {
    const fracToDecimal = parseUrlSettings(
      '?pattern=frac-to-decimal',
      defaults
    );
    const decimalToFrac = parseUrlSettings(
      '?pattern=decimal-to-frac',
      defaults
    );

    expect(fracToDecimal.operation).toBe('division');
    expect(decimalToFrac.operation).toBe('division');
  });

  it('ignores invalid calculationPattern', () => {
    const result = parseUrlSettings('?pattern=does-not-exist', defaults);
    expect(result.calculationPattern).toBeUndefined();
    expect(result.operation).toBeUndefined();
  });

  it('parses valid layoutColumns', () => {
    const result = parseUrlSettings('?cols=2', defaults);
    expect(result.layoutColumns).toBe(2);
  });

  it('falls back to default for invalid layoutColumns', () => {
    const result = parseUrlSettings('?cols=5', defaults);
    expect(result.layoutColumns).toBe(3);
  });

  it('parses valid problemCount', () => {
    const result = parseUrlSettings('?count=15', defaults);
    expect(result.problemCount).toBe(15);
  });

  it('clamps problemCount to max for problem type', () => {
    // hissan with 1 column has maxCounts[1] = 4
    const result = parseUrlSettings('?type=hissan&cols=1&count=99', defaults);
    expect(result.problemCount).toBe(4);
  });

  it('ignores non-positive count', () => {
    const result = parseUrlSettings('?count=0', defaults);
    expect(result.problemCount).toBeUndefined();
  });

  it('ignores non-numeric count', () => {
    const result = parseUrlSettings('?count=abc', defaults);
    expect(result.problemCount).toBeUndefined();
  });

  it('parses all params together', () => {
    const result = parseUrlSettings(
      '?grade=3&type=basic&pattern=add-single-digit&cols=2&count=10',
      defaults
    );
    expect(result.grade).toBe(3);
    expect(result.problemType).toBe('basic');
    expect(result.calculationPattern).toBe('add-single-digit');
    expect(result.operation).toBe('addition');
    expect(result.layoutColumns).toBe(2);
    expect(result.problemCount).toBe(10);
  });
});

describe('settingsToUrlParams', () => {
  it('serializes settings to URL params', () => {
    const params = settingsToUrlParams(defaults);
    expect(params).toContain('grade=1');
    expect(params).toContain('type=basic');
    expect(params).toContain('cols=3');
    expect(params).toContain('count=30');
    expect(params).not.toContain('pattern=');
  });

  it('includes calculationPattern when present', () => {
    const settings: WorksheetSettings = {
      ...defaults,
      calculationPattern: 'add-single-digit',
    };
    const params = settingsToUrlParams(settings);
    expect(params).toContain('pattern=add-single-digit');
  });

  it('does not include operation in URL', () => {
    const params = settingsToUrlParams(defaults);
    expect(params).not.toContain('operation=');
  });
});

describe('syncUrlFromSettings', () => {
  const originalReplaceState = window.history.replaceState;

  beforeEach(() => {
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    window.history.replaceState = originalReplaceState;
  });

  it('calls history.replaceState with correct URL', () => {
    syncUrlFromSettings(defaults);
    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('?grade=1')
    );
  });
});
