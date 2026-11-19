import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://127.0.0.1:5174/';
const output = '.playwright-cli/missing-number-check';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const printedPage = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

async function checkLayout(target, count, answers) {
  const sheet = target.locator('[data-a4-sheet]').first();
  assert.equal(await sheet.locator('[data-problem-number]').count(), count);
  const bounds = await sheet.evaluate((element) => ({
    width: element.offsetWidth,
    height: Math.max(element.clientHeight, element.scrollHeight),
    clipped: [...element.querySelectorAll('[data-problem-grid] > div')].some(
      (cell) => cell.scrollWidth > cell.clientWidth + 2
    ),
    boxes: [...element.querySelectorAll('.missing-number-box')].map((box) => ({
      width: box.offsetWidth,
      height: box.offsetHeight,
    })),
  }));
  assert.ok(
    Math.abs(bounds.width - 794) <= 1 &&
      bounds.height <= 1123 &&
      !bounds.clipped,
    `A4 bounds: ${JSON.stringify(bounds)}`
  );
  assert.equal(bounds.boxes.length, answers ? 0 : count);
  for (const box of bounds.boxes) {
    assert.deepEqual(box, { width: 36, height: 36 });
  }
}

async function checkPrint(label, count, answers, pages = 1) {
  await page.evaluate(() => {
    delete window.__printedHTML;
    if (window.__printCaptureInstalled) return;
    window.__printCaptureInstalled = true;
    new MutationObserver(() => {
      const frame = document.getElementById('printWindow');
      if (!frame) return;
      const capture = () => {
        frame.contentWindow.print = () => {
          window.__printedHTML =
            frame.contentDocument.documentElement.outerHTML;
        };
      };
      capture();
      frame.addEventListener('load', capture, { once: true });
    }).observe(document.body, { childList: true });
  });
  await page
    .getByRole('button', { name: '印刷（複数ページにも対応）' })
    .click();
  await page.getByLabel('印刷枚数').fill(String(pages));
  await page.getByRole('button', { name: '印刷する', exact: true }).click();
  await page.waitForFunction(() => typeof window.__printedHTML === 'string');
  await printedPage.setContent(await page.evaluate(() => window.__printedHTML));
  await printedPage.emulateMedia({ media: 'print' });
  await printedPage.evaluate(async () => {
    await document.fonts.ready;
  });
  assert.equal(await printedPage.locator('[data-a4-sheet]').count(), pages);
  assert.equal(
    await printedPage.locator('[data-problem-number]').count(),
    count * pages
  );
  await checkLayout(printedPage, count, answers);
  const pdf = await printedPage.pdf({
    path: `${output}/${label}.pdf`,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
  });
  assert.equal(
    (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length,
    pages
  );
}

try {
  for (const [grade, pattern] of [
    [1, 'add-single-missing'],
    [1, 'sub-single-missing'],
    [2, 'add-double-missing'],
    [2, 'sub-double-missing'],
    [2, 'mult-single-missing'],
    [3, 'div-single-missing'],
  ]) {
    for (const cols of [1, 2, 3]) {
      const count = cols * 10;
      const url = new URL(base);
      url.search = new URLSearchParams({
        grade,
        type: 'basic',
        pattern,
        cols,
        count,
      });
      await page.goto(url.href, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-a4-sheet]');
      for (const answers of [false, true]) {
        await page
          .getByRole('checkbox', { name: '解答表示' })
          .setChecked(answers);
        await checkLayout(page, count, answers);
        const label = `${pattern}-${cols}cols-${answers ? 'answers' : 'questions'}`;
        await checkPrint(label, count, answers);
        if (pattern === 'add-double-missing' && cols === 3 && !answers) {
          await printedPage
            .locator('[data-a4-sheet]')
            .screenshot({ path: `${output}/printed-boxes.png` });
          await checkPrint('three-pages', count, answers, 3);
        }
        console.log(`PASS ${label}: ${count} problems, A4 1 page`);
      }
    }
  }
  assert.deepEqual(errors, []);
  console.log('PASS: 36 single-page PDFs and one three-page PDF');
} finally {
  await browser.close();
}
