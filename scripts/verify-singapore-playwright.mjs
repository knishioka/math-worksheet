#!/usr/bin/env node

import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const BASE_URL = process.argv[2] ?? 'http://127.0.0.1:5173/';
const OUTPUT_DIR = join(process.cwd(), 'artifacts', 'playwright-singapore');

const COMBOS = [
  { grade: 1, pattern: 'singapore-bar-model', slug: 'grade1-bar-model' },
  { grade: 1, pattern: 'singapore-number-bond', slug: 'grade1-number-bond' },
  { grade: 2, pattern: 'singapore-bar-model', slug: 'grade2-bar-model' },
  { grade: 2, pattern: 'singapore-number-bond', slug: 'grade2-number-bond' },
  { grade: 2, pattern: 'singapore-comparison', slug: 'grade2-comparison' },
  { grade: 3, pattern: 'singapore-bar-model', slug: 'grade3-bar-model' },
  { grade: 3, pattern: 'singapore-number-bond', slug: 'grade3-number-bond' },
  { grade: 3, pattern: 'singapore-comparison', slug: 'grade3-comparison' },
  { grade: 3, pattern: 'singapore-multi-step', slug: 'grade3-multi-step' },
  // Grade 4
  { grade: 4, pattern: 'singapore-bar-model', slug: 'grade4-bar-model' },
  { grade: 4, pattern: 'singapore-number-bond', slug: 'grade4-number-bond' },
  { grade: 4, pattern: 'singapore-comparison', slug: 'grade4-comparison' },
  { grade: 4, pattern: 'singapore-multi-step', slug: 'grade4-multi-step' },
  { grade: 4, pattern: 'singapore-fraction-set', slug: 'grade4-fraction-set' },
  { grade: 4, pattern: 'singapore-decimal', slug: 'grade4-decimal' },
  // Grade 5
  { grade: 5, pattern: 'singapore-fraction-set', slug: 'grade5-fraction-set' },
  { grade: 5, pattern: 'singapore-decimal', slug: 'grade5-decimal' },
  { grade: 5, pattern: 'singapore-ratio', slug: 'grade5-ratio' },
  { grade: 5, pattern: 'singapore-percentage', slug: 'grade5-percentage' },
  { grade: 5, pattern: 'singapore-rate', slug: 'grade5-rate' },
  { grade: 5, pattern: 'singapore-volume', slug: 'grade5-volume' },
  // Grade 6
  { grade: 6, pattern: 'singapore-ratio', slug: 'grade6-ratio' },
  { grade: 6, pattern: 'singapore-percentage', slug: 'grade6-percentage' },
  { grade: 6, pattern: 'singapore-rate', slug: 'grade6-rate' },
  { grade: 6, pattern: 'singapore-volume', slug: 'grade6-volume' },
  { grade: 6, pattern: 'singapore-algebra', slug: 'grade6-algebra' },
  {
    grade: 6,
    pattern: 'singapore-ratio-advanced',
    slug: 'grade6-ratio-advanced',
  },
  { grade: 6, pattern: 'singapore-circle', slug: 'grade6-circle' },
  {
    grade: 6,
    pattern: 'singapore-data-analysis',
    slug: 'grade6-data-analysis',
  },
];

const SELF_REFERENCE_RE =
  /\b([A-Z][a-z]+)\b has \d+ (?:more than|times as many as) \1\b/;
const PROBLEM_SELECTOR = '[data-problem-grid] .problem-item';

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function validateNameAndDifficulty(combo, renderedProblems) {
  renderedProblems.forEach((renderedProblem) => {
    if (SELF_REFERENCE_RE.test(renderedProblem)) {
      throw new Error(
        `Self-referential name found for ${combo.slug}: "${renderedProblem}"`
      );
    }
  });

  if (combo.pattern === 'singapore-comparison' && combo.grade === 2) {
    renderedProblems.forEach((renderedProblem) => {
      if (renderedProblem.includes('times as many')) {
        throw new Error(
          `Grade 2 comparison used multiplicative phrasing in ${combo.slug}: "${renderedProblem}"`
        );
      }
    });
  }

  if (combo.pattern === 'singapore-comparison' && combo.grade >= 3) {
    renderedProblems.forEach((renderedProblem) => {
      if (!renderedProblem.includes('times as many')) {
        throw new Error(
          `Grade 3+ comparison missed multiplicative phrasing in ${combo.slug}: "${renderedProblem}"`
        );
      }
    });
  }
}

function validateMultiStepAnswer(renderedProblem, combo) {
  if (combo.pattern !== 'singapore-multi-step') {
    return;
  }

  const answerMatch = renderedProblem.match(/Answer:\s*([0-9]+(?:\.[0-9]+)?)/);
  const totalMatch = renderedProblem.match(/(?:has|are) (\d+) /);
  const fractions = [...renderedProblem.matchAll(/(\d+)\/(\d+)/g)];
  if (!answerMatch || !totalMatch || fractions.length < 2) {
    throw new Error(
      `Could not parse multi-step problem in ${combo.slug}: "${renderedProblem}"`
    );
  }

  const answer = Number(answerMatch[1]);
  const total = Number(totalMatch[1]);
  const numerator1 = Number(fractions[0][1]);
  const denominator1 = Number(fractions[0][2]);
  const numerator2 = Number(fractions[1][1]);
  const denominator2 = Number(fractions[1][2]);

  const usedFirst = (total * numerator1) / denominator1;
  const remainingAfterFirst = total - usedFirst;
  const usedSecond = (remainingAfterFirst * numerator2) / denominator2;
  const remainingAfterSecond = remainingAfterFirst - usedSecond;

  let expectedAnswer = remainingAfterSecond;
  if (renderedProblem.includes('shared equally among')) {
    const groupsMatch = renderedProblem.match(/among (\d+) students/);
    if (!groupsMatch) {
      throw new Error(
        `Could not parse group count in ${combo.slug}: "${renderedProblem}"`
      );
    }
    const groups = Number(groupsMatch[1]);
    expectedAnswer = remainingAfterSecond / groups;
  }

  if (
    !Number.isFinite(expectedAnswer) ||
    Math.abs(answer - expectedAnswer) > 1e-9
  ) {
    throw new Error(
      `Multi-step answer mismatch in ${combo.slug}: expected ${expectedAnswer}, got ${answer}, text="${renderedProblem}"`
    );
  }
}

async function captureCombo(page, combo) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.selectOption('select', String(combo.grade));
  await page.waitForTimeout(200);
  await page.evaluate((pattern) => {
    const input = document.querySelector(
      `input[name="calculationPattern"][value="${pattern}"]`
    );
    if (!(input instanceof HTMLInputElement)) {
      throw new Error(`Pattern input not found: ${pattern}`);
    }
    input.click();
  }, combo.pattern);

  await page
    .locator('[data-a4-sheet]')
    .waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForFunction(
    ({ pattern }) => {
      const patternInput = document.querySelector(
        `input[name="calculationPattern"][value="${pattern}"]`
      );
      const firstProblem = document.querySelector(
        '[data-problem-grid] .problem-item'
      );
      return (
        patternInput instanceof HTMLInputElement &&
        patternInput.checked &&
        firstProblem instanceof HTMLElement &&
        /[A-Za-z]/.test(firstProblem.innerText)
      );
    },
    { pattern: combo.pattern },
    { timeout: 10000 }
  );
  await page.waitForTimeout(250);

  const problemLocator = page.locator(PROBLEM_SELECTOR);
  const renderedOff = (await problemLocator.allInnerTexts()).map(normalizeText);
  validateNameAndDifficulty(combo, renderedOff);

  const answerToggle = page.getByLabel('解答表示');
  if (await answerToggle.isChecked()) {
    await answerToggle.uncheck({ force: true });
  }
  await page.waitForTimeout(150);
  await page.screenshot({
    path: join(OUTPUT_DIR, `${combo.slug}-answers-off.png`),
    fullPage: true,
  });

  await answerToggle.check({ force: true });
  await page.waitForTimeout(200);
  const renderedOn = (await problemLocator.allInnerTexts()).map(normalizeText);
  renderedOn.forEach((renderedProblem) =>
    validateMultiStepAnswer(renderedProblem, combo)
  );
  await page.screenshot({
    path: join(OUTPUT_DIR, `${combo.slug}-answers-on.png`),
    fullPage: true,
  });
}

async function run() {
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1200 },
  });
  const page = await context.newPage();

  try {
    for (const combo of COMBOS) {
      console.log(`Checking grade ${combo.grade} / ${combo.pattern}`);
      await captureCombo(page, combo);
    }
    console.log(`Screenshots saved to ${OUTPUT_DIR}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
