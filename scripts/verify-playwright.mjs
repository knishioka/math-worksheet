#!/usr/bin/env node

/**
 * Extended Playwright verification script for ALL problem types.
 * Extends the original Singapore-only script to cover every pattern/grade combo.
 *
 * Usage:
 *   node scripts/verify-playwright.mjs [BASE_URL]
 *   node scripts/verify-playwright.mjs http://127.0.0.1:5173/
 *
 * Options:
 *   --singapore-only   Only check Singapore Math patterns (fast mode)
 *   --pattern=<name>   Only check a specific pattern (e.g. --pattern=word-en)
 *
 * Screenshots are saved to artifacts/playwright-verify/
 * NOT run in CI - local only, triggered manually or by AI agent before push.
 */

import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const BASE_URL =
  process.argv.find(
    (a) => !a.startsWith('--') && a !== process.argv[0] && a !== process.argv[1]
  ) ?? 'http://127.0.0.1:5173/';
const OUTPUT_DIR = join(process.cwd(), 'artifacts', 'playwright-verify');
const SINGAPORE_ONLY = process.argv.includes('--singapore-only');
const PATTERN_FILTER = process.argv
  .find((a) => a.startsWith('--pattern='))
  ?.split('=')[1];

// ─── Combo definitions ───────────────────────────────────────────────

const SINGAPORE_COMBOS = [
  { grade: 1, pattern: 'singapore-bar-model', slug: 'grade1-bar-model' },
  { grade: 1, pattern: 'singapore-number-bond', slug: 'grade1-number-bond' },
  { grade: 2, pattern: 'singapore-bar-model', slug: 'grade2-bar-model' },
  { grade: 2, pattern: 'singapore-number-bond', slug: 'grade2-number-bond' },
  { grade: 2, pattern: 'singapore-comparison', slug: 'grade2-comparison' },
  { grade: 3, pattern: 'singapore-bar-model', slug: 'grade3-bar-model' },
  { grade: 3, pattern: 'singapore-number-bond', slug: 'grade3-number-bond' },
  { grade: 3, pattern: 'singapore-comparison', slug: 'grade3-comparison' },
  { grade: 3, pattern: 'singapore-multi-step', slug: 'grade3-multi-step' },
  { grade: 4, pattern: 'singapore-bar-model', slug: 'grade4-bar-model' },
  { grade: 4, pattern: 'singapore-number-bond', slug: 'grade4-number-bond' },
  { grade: 4, pattern: 'singapore-comparison', slug: 'grade4-comparison' },
  { grade: 4, pattern: 'singapore-multi-step', slug: 'grade4-multi-step' },
  { grade: 5, pattern: 'singapore-bar-model', slug: 'grade5-bar-model' },
  { grade: 5, pattern: 'singapore-number-bond', slug: 'grade5-number-bond' },
  { grade: 5, pattern: 'singapore-comparison', slug: 'grade5-comparison' },
  { grade: 5, pattern: 'singapore-multi-step', slug: 'grade5-multi-step' },
  { grade: 6, pattern: 'singapore-bar-model', slug: 'grade6-bar-model' },
  { grade: 6, pattern: 'singapore-number-bond', slug: 'grade6-number-bond' },
  { grade: 6, pattern: 'singapore-comparison', slug: 'grade6-comparison' },
  { grade: 6, pattern: 'singapore-multi-step', slug: 'grade6-multi-step' },
];

const ENGLISH_WORD_COMBOS = [
  { grade: 1, pattern: 'word-en', slug: 'grade1-word-en' },
  { grade: 2, pattern: 'word-en', slug: 'grade2-word-en' },
  { grade: 3, pattern: 'word-en', slug: 'grade3-word-en' },
  { grade: 4, pattern: 'word-en', slug: 'grade4-word-en' },
  { grade: 5, pattern: 'word-en', slug: 'grade5-word-en' },
  { grade: 6, pattern: 'word-en', slug: 'grade6-word-en' },
];

// Representative English pattern combos (grade 3 has the widest coverage)
const ENGLISH_PATTERN_COMBOS = [
  { grade: 2, pattern: 'money-change-en', slug: 'grade2-money-change-en' },
  { grade: 2, pattern: 'time-reading-en', slug: 'grade2-time-reading-en' },
  { grade: 2, pattern: 'calendar-days-en', slug: 'grade2-calendar-days-en' },
  { grade: 3, pattern: 'money-payment-en', slug: 'grade3-money-payment-en' },
  { grade: 3, pattern: 'time-calc-en', slug: 'grade3-time-calc-en' },
  { grade: 3, pattern: 'unit-length-en', slug: 'grade3-unit-length-en' },
  {
    grade: 3,
    pattern: 'shopping-discount-en',
    slug: 'grade3-shopping-discount-en',
  },
  {
    grade: 3,
    pattern: 'temperature-diff-en',
    slug: 'grade3-temperature-diff-en',
  },
  { grade: 3, pattern: 'distance-walk-en', slug: 'grade3-distance-walk-en' },
  {
    grade: 3,
    pattern: 'cooking-ingredients-en',
    slug: 'grade3-cooking-ingredients-en',
  },
  { grade: 4, pattern: 'energy-usage-en', slug: 'grade4-energy-usage-en' },
  { grade: 3, pattern: 'transport-fare-en', slug: 'grade3-transport-fare-en' },
  {
    grade: 2,
    pattern: 'allowance-saving-en',
    slug: 'grade2-allowance-saving-en',
  },
];

// Basic math combos (representative samples)
const BASIC_MATH_COMBOS = [
  { grade: 1, pattern: 'add-single-digit', slug: 'grade1-add-single' },
  { grade: 1, pattern: 'sub-single-digit', slug: 'grade1-sub-single' },
  { grade: 2, pattern: 'mult-single-digit', slug: 'grade2-mult-single' },
  { grade: 2, pattern: 'hissan-add-double', slug: 'grade2-hissan-add' },
  { grade: 3, pattern: 'div-basic', slug: 'grade3-div-basic' },
  { grade: 3, pattern: 'frac-same-denom', slug: 'grade3-frac-same' },
  { grade: 3, pattern: 'add-dec-simple', slug: 'grade3-dec-add' },
  { grade: 4, pattern: 'hissan-div-basic', slug: 'grade4-hissan-div' },
  { grade: 5, pattern: 'frac-different-denom', slug: 'grade5-frac-diff' },
  { grade: 6, pattern: 'frac-mult', slug: 'grade6-frac-mult' },
];

// Anzan combos
const ANZAN_COMBOS = [
  { grade: 1, pattern: 'anzan-complement-10', slug: 'grade1-anzan-comp10' },
  { grade: 3, pattern: 'anzan-mul-5', slug: 'grade3-anzan-mul5' },
  { grade: 3, pattern: 'anzan-mul-9', slug: 'grade3-anzan-mul9' },
  { grade: 4, pattern: 'anzan-mul-11', slug: 'grade4-anzan-mul11' },
];

// ─── Validators ──────────────────────────────────────────────────────

const SELF_REFERENCE_RE =
  /\b([A-Z][a-z]+)\b has \d+[^.]*?(?:more than|fewer than|times as many as) \1\b/;

const PROBLEM_SELECTOR = '[data-problem-grid] .problem-item';

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function validateRenderedProblems(combo, renderedProblems) {
  if (renderedProblems.length === 0) {
    throw new Error(`No problems rendered for ${combo.slug}`);
  }

  renderedProblems.forEach((text) => {
    if (SELF_REFERENCE_RE.test(text)) {
      throw new Error(
        `Self-referential name found for ${combo.slug}: "${text}"`
      );
    }
  });

  // Singapore-specific validations
  if (combo.pattern === 'singapore-comparison' && combo.grade === 2) {
    renderedProblems.forEach((text) => {
      if (text.includes('times as many')) {
        throw new Error(
          `Grade 2 comparison used multiplicative phrasing in ${combo.slug}: "${text}"`
        );
      }
    });
  }

  if (combo.pattern === 'singapore-comparison' && combo.grade >= 3) {
    renderedProblems.forEach((text) => {
      if (!text.includes('times as many')) {
        throw new Error(
          `Grade 3+ comparison missed multiplicative phrasing in ${combo.slug}: "${text}"`
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

// ─── Capture & verify ────────────────────────────────────────────────

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

  // Wait for problems to render
  const firstProblemLocator = page.locator(PROBLEM_SELECTOR).first();
  await firstProblemLocator.waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(250);

  const problemLocator = page.locator(PROBLEM_SELECTOR);
  const count = await problemLocator.count();

  if (count === 0) {
    throw new Error(`No problems rendered for ${combo.slug}`);
  }

  const renderedOff = (await problemLocator.allInnerTexts()).map(normalizeText);
  validateRenderedProblems(combo, renderedOff);

  // Screenshot with answers off
  const answerToggle = page.getByLabel('解答表示');
  if (await answerToggle.isChecked()) {
    await answerToggle.uncheck({ force: true });
  }
  await page.waitForTimeout(150);
  await page.screenshot({
    path: join(OUTPUT_DIR, `${combo.slug}-answers-off.png`),
    fullPage: true,
  });

  // Screenshot with answers on
  await answerToggle.check({ force: true });
  await page.waitForTimeout(200);
  const renderedOn = (await problemLocator.allInnerTexts()).map(normalizeText);

  // Validate multi-step answers when answers are visible
  renderedOn.forEach((text) => validateMultiStepAnswer(text, combo));

  await page.screenshot({
    path: join(OUTPUT_DIR, `${combo.slug}-answers-on.png`),
    fullPage: true,
  });
}

// ─── Main ────────────────────────────────────────────────────────────

async function run() {
  let combos;
  if (SINGAPORE_ONLY) {
    combos = SINGAPORE_COMBOS;
    console.log('Running Singapore Math patterns only');
  } else if (PATTERN_FILTER) {
    combos = [
      ...SINGAPORE_COMBOS,
      ...ENGLISH_WORD_COMBOS,
      ...ENGLISH_PATTERN_COMBOS,
      ...BASIC_MATH_COMBOS,
      ...ANZAN_COMBOS,
    ].filter((c) => c.pattern === PATTERN_FILTER);
    console.log(
      `Filtered to pattern: ${PATTERN_FILTER} (${combos.length} combos)`
    );
  } else {
    combos = [
      ...SINGAPORE_COMBOS,
      ...ENGLISH_WORD_COMBOS,
      ...ENGLISH_PATTERN_COMBOS,
      ...BASIC_MATH_COMBOS,
      ...ANZAN_COMBOS,
    ];
    console.log(`Running ALL patterns (${combos.length} combos)`);
  }

  if (combos.length === 0) {
    console.error('No matching combos found');
    process.exitCode = 1;
    return;
  }

  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1200 },
  });
  const page = await context.newPage();

  const startTime = Date.now();
  let passed = 0;
  let failed = 0;

  try {
    for (const combo of combos) {
      try {
        process.stdout.write(`  ${combo.slug} ... `);
        await captureCombo(page, combo);
        console.log('OK');
        passed++;
      } catch (err) {
        console.log(`FAIL: ${err.message}`);
        failed++;
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\nDone in ${elapsed}s: ${passed} passed, ${failed} failed`);
    console.log(`Screenshots: ${OUTPUT_DIR}`);

    if (failed > 0) {
      process.exitCode = 1;
    }
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
