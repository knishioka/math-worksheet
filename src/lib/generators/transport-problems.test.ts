import { describe, expect, it } from 'vitest';
import {
  buildTransportChangeScenarios,
  generateTransportChange,
} from './transport-problems';

describe('generateTransportChange', () => {
  it('avoids duplicate transport change problems for grade 2', () => {
    const problems = generateTransportChange(2, 12);
    const texts = problems.map((problem) => problem.problemText);

    expect(new Set(texts).size).toBe(problems.length);
    expect(
      problems.every(
        (problem) => typeof problem.answer === 'number' && problem.answer > 0
      )
    ).toBe(true);
  });

  it('builds a varied scenario pool for grade 2', () => {
    const scenarios = buildTransportChangeScenarios(2);
    const transportNames = new Set(scenarios.map((scenario) => scenario.transportName));

    expect(scenarios.length).toBeGreaterThanOrEqual(30);
    expect(transportNames.size).toBeGreaterThanOrEqual(3);
    expect(scenarios.every((scenario) => scenario.payment > scenario.totalCost)).toBe(true);
  });
});
