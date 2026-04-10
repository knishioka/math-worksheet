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
  { grade: 3, pattern: 'singapore-bar-model', slug: 'grade3-bar-model' },
  { grade: 3, pattern: 'singapore-number-bond', slug: 'grade3-number-bond' },
  // Grade 4
  { grade: 4, pattern: 'singapore-bar-model', slug: 'grade4-bar-model' },
  { grade: 4, pattern: 'singapore-number-bond', slug: 'grade4-number-bond' },
  // Grade 5
  { grade: 5, pattern: 'singapore-bar-model', slug: 'grade5-bar-model' },
  { grade: 5, pattern: 'singapore-number-bond', slug: 'grade5-number-bond' },
  // Grade 6
  { grade: 6, pattern: 'singapore-bar-model', slug: 'grade6-bar-model' },
  { grade: 6, pattern: 'singapore-number-bond', slug: 'grade6-number-bond' },
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
