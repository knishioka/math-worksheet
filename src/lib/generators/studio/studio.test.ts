import { afterEach, describe, expect, it, vi } from 'vitest';
import { getLearningStages } from '../../../config/learning-paths';
import { STUDIO_TOPICS, type StudioTopic } from '../../../config/studio-topics';
import { generateProblems } from '../index';

type Solver = (values: number[], english: boolean) => number | string;
// Each solver reads the quantities on the printed page, in order.
const solvers: Record<StudioTopic, Solver[]> = {
  cycle: [
    ([, p, n]): number => n % p || p,
    ([a, b, n]): number =>
      Array.from({ length: n }, (_, i) => i + 1).filter(
        (i) => i % a === 0 && i % b === 0
      ).length,
  ],
  sequence: [
    ([a, d, n]): number =>
      Array.from({ length: n }, (_, i) => a + i * d).reduce((s, x) => s + x, 0),
    (v): number => Math.ceil((Math.sqrt(1 + 8 * v[v.length - 1]) - 1) / 2),
  ],
  sets: [
    ([t, a, b, c]): number => t - a - b + c,
    ([t, a, b]): number => a + b - t,
  ],
  'polygon-angles': [
    ([a, b]): number => a + b,
    ([n]): number => ((n - 2) * 180) / n,
  ],
  'composite-area': [
    ([w, h, x, y]): number => w * h - x * y,
    ([w, h, p]): number => w * p + h * p - p * p,
  ],
  'changing-counts': [
    ([n, r, p, s]): number => (n * r - s) / (r + p),
    ([l, g]): number => (3 * l) / g + 1,
    ([e, l, n, h, s]): number => (l + s - h * n) / (h - e),
    ([ab, bc, ca]): number => (ab + ca - bc) / 2,
  ],
  averages: [
    ([a, b, c, d]): number => (a * b + c * d) / (a + c),
    ([n, m, o, d]): number => (m + d) * n - (m * n - o),
  ],
  divisibility: [
    ([a, b]): number =>
      Array.from({ length: a }, (_, i) => a - i).find(
        (i) => a % i === 0 && b % i === 0
      )!,
    ([a, b, c]): number =>
      Array.from({ length: a * b * c }, (_, i) => i + 1).find(
        (i) => i % a === 0 && i % b === 0 && i % c === 0
      )!,
  ],
  'percent-change': [
    ([a, b, r]): number => (r * 10000) / ((100 - a) * (100 - b)),
  ],
  'speed-units': [
    (v, en): number => (en ? (v[0] / v[1]) * 3.6 : (v[1] / v[0]) * 3.6),
    ([d, a, b]): number => (2 * d) / (d / a + d / b),
  ],
  'equal-area': [
    ([b, h]): number => (b * h) / 2,
    ([a, b, c]): number => (2 * a * b) / c,
  ],
  'triangle-ratio': [
    ([t, a, b]): number => (t * a) / (a + b),
    ([a, b, t]): number => t * (1 + b / a) ** 2,
  ],
  exchange: [
    ([n, p, s, t]): number => (t - n * s) / (p - s),
    ([a, b, c], en): number => (en ? (b * (a - c)) / a : (a * (b - c)) / b),
    ([, a, b]): number => (a + (a + 2 * b) / 3) / 2,
    ([a, b, t, n, d]): number => (t * a) / (a - ((a + b) * n) / d),
  ],
  'similar-area': [
    ([s, l, a]): number => (a * l * l) / (s * s),
    ([s, l, a]): number => (a * (l * l - s * s)) / (l * l),
  ],
  sectors: [
    ([r, a, pi]): number => (pi * r * r * a) / 360,
    ([r, a, pi]): number => (2 * pi * r * a) / 360,
  ],
  motion: [
    ([w, h, s]): number => w * h + s * h,
    ([a, b]): number => (a + b) / 2,
    ([a, b]): number => 2 * a - b,
    ([s, h]): number => s * h,
  ],
  'solid-nets': [
    ([l, w, h, x, y, z]): number => l * w * h + x * y * z,
    ([a, b, c, d, n]): number => [c, d, a, b][n - a],
  ],
  'cube-section': [
    ([e]): number => e * e,
    (): number => 3,
    ([s]): number => ((s * s) / 2) * s,
  ],
  'digit-count': [
    ([, d]): number =>
      Array.from({ length: 90 }, (_, i) => i + 10).filter(
        (n) =>
          Math.floor(n / 10) <= d &&
          n % 10 <= d &&
          Math.floor(n / 10) !== n % 10
      ).length,
    ([, d, x]): number =>
      Array.from({ length: 90 }, (_, i) => i + 10).filter(
        (n) =>
          Math.floor(n / 10) <= d &&
          n % 10 >= 1 &&
          n % 10 <= d &&
          (Math.floor(n / 10) !== n % 10 || n % 10 === x)
      ).length,
  ],
  'clock-hands': [
    ([h, m]): number => {
      const diff = Math.abs((360 * ((h % 12) + m / 60)) / 12 - (360 * m) / 60);
      return Math.min(diff, 360 - diff);
    },
    ([h]): string => String(60 * h) + '/11',
    ([h]): string => String(2 * (h * 30 + 90)) + '/11',
    ([h]): string => String(2 * (360 - h * 30)) + '/13',
  ],
  'water-depth': [
    ([a, b, c, v], en): number =>
      en ? b + (v - a * b) / c : a + (v - b * a) / c,
    ([a, b, i, o, t], en): number =>
      en ? a + ((i - o) * t) / b : b + ((i - o) * t) / a,
    ([t1, t2, h1, h2]): number => (h2 - h1) / (t2 - t1),
  ],
  'staged-rates': [
    ([q, i, a, t, b]): number => t + (q - t * (a - i)) / (b - i),
    ([d, t, c, v]): number => t + (d - t * c) / v,
    ([b, t, l, s]): number => ((b + l) * t) / (t + s) - b,
    ([d, a, b]): number => (3 * d) / (a + b),
    ([a, b, t, n]): number => t - (n - a * t) / b,
  ],
};

afterEach(() => vi.restoreAllMocks());

describe.each(Object.keys(STUDIO_TOPICS) as StudioTopic[])('%s', (topic) => {
  it.each([0, 0.37, 0.999999, 'varied'] as const)(
    'solves both worksheets from their printed conditions (random %s)',
    (sample) => {
      const random = vi.spyOn(Math, 'random');
      const grade = STUDIO_TOPICS[topic].grade;
      const checks = solvers[topic];
      const start = sample === 'varied' ? 0 : Math.floor(sample * 12);
      const count = checks.length * (sample === 'varied' ? 20 : 2);
      expect(
        getLearningStages(grade, 'entrance').flatMap((s) => s.patterns)
      ).toContain(`entrance-${topic}-jap`);
      for (const language of ['jap', 'en'] as const) {
        if (sample === 'varied') {
          let seed = 1741;
          random.mockReturnValueOnce(0).mockImplementation(() => {
            seed = (seed * 16807) % 2147483647;
            return seed / 2147483647;
          });
        } else random.mockReturnValue(sample);
        const problems = generateProblems({
          grade,
          problemType: 'basic',
          calculationPattern: `entrance-${topic}-${language}`,
          operation: 'division',
          problemCount: count,
          layoutColumns: 2,
        });
        expect(problems).toHaveLength(count);
        for (const [index, problem] of problems.entries()) {
          if (problem.type !== 'word' && problem.type !== 'word-en')
            throw new Error('Expected word problem');
          const english = language === 'en';
          expect(problem.type).toBe(english ? 'word-en' : 'word');
          if (english)
            expect(
              [
                problem.problemText,
                problem.unit,
                ...(problem.solutionSteps ?? []),
              ].join(' ')
            ).not.toMatch(/[ぁ-んァ-ン一-龥]/);
          const values = (
            problem.problemText.match(/\d+(?:\.\d+)?/g) ?? []
          ).map(Number);
          if (problem.figure?.kind === 'depth-graph')
            values.push(problem.figure.firstDepth, problem.figure.lastDepth);
          if (problem.figure?.kind === 'cube-net') {
            const first = problem.figure.first;
            values.unshift(first, first + 1, first + 2, first + 3);
          }
          const answer = checks[(index + start) % checks.length](
            values,
            english
          );
          if (typeof answer === 'number')
            expect(problem.answer, problem.problemText).toBeCloseTo(answer);
          else expect(problem.answer, problem.problemText).toBe(answer);
        }
      }
    }
  );
});
