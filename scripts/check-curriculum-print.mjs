import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { createServer } from 'vite';

// レジストリから列挙して、新しい教材を検証対象から取りこぼさない。
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
});
const { SUPPLEMENTAL_PATTERNS } = await vite.ssrLoadModule(
  '/src/config/supplemental-patterns.ts'
);
const { getEffectiveCounts } = await vite.ssrLoadModule(
  '/src/config/print-templates.ts'
);
const { PATTERNS_BY_GRADE } = await vite.ssrLoadModule(
  '/src/types/calculation-patterns.ts'
);
await vite.close();
const base = process.argv[2] ?? 'http://127.0.0.1:5174/';
const printOnly = process.argv.includes('--print-only');
const output = '.playwright-cli/curriculum-check';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
let checked = 0;
try {
  for (const [pattern, definition] of printOnly
    ? []
    : Object.entries(SUPPLEMENTAL_PATTERNS)) {
    for (const cols of [1, 2, 3]) {
      const count = getEffectiveCounts(
        definition.type,
        pattern,
        definition.grade
      ).maxCounts[cols];
      const url = new URL(base);
      url.search = new URLSearchParams({
        grade: String(definition.grade),
        type: 'basic',
        pattern,
        cols: String(cols),
        count: String(count),
        eq: '1',
      });
      await page.goto(url.href, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-a4-sheet]');
      await page.waitForFunction(
        ({ pattern, cols, count }) => {
          const params = new URLSearchParams(location.search);
          return (
            params.get('pattern') === pattern &&
            params.get('cols') === String(cols) &&
            params.get('count') === String(count)
          );
        },
        { pattern, cols, count }
      );
      await page.addStyleTag({
        content: '.no-print { display: block !important; }',
      });
      await page.emulateMedia({ media: 'print' });
      for (const answers of [false, true]) {
        // 印刷メディア中の非表示コントロールはDOMイベントで切り替える。
        await page
          .getByRole('checkbox', { name: '解答表示' })
          .setChecked(answers, { force: true });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
          );
        });
        const result = await page
          .locator('[data-a4-sheet]')
          .evaluate((sheet) => {
            const width = sheet.offsetWidth,
              height = Math.max(sheet.clientHeight, sheet.scrollHeight);
            const clipped = [
              ...sheet.querySelectorAll('[data-problem-grid] > div'),
            ].some((el) => el.scrollWidth > el.clientWidth + 2);
            return { width, height, clipped };
          });
        assert.ok(
          Math.abs(result.width - 794) <= 1,
          `${pattern}/${cols}: A4 width ${result.width}`
        );
        assert.ok(
          result.height <= 1128 && !result.clipped,
          `${pattern}/${cols}/${answers}: ${JSON.stringify(result)}`
        );
        checked++;
      }
      await page.emulateMedia({ media: 'screen' });
    }
  }
  // 実際の印刷ボタンで作られるiframeを捕捉し、複数枚のページ分割も検証する。
  await page.goto(
    `${base}?grade=3&type=basic&pattern=data-bar-chart-jap&cols=2&count=6&eq=1`
  );
  for (const cols of [1, 2]) {
    const count = getEffectiveCounts('word', 'data-bar-chart-jap', 3)
      .recommendedCounts[cols];
    await page
      .getByRole('button', { name: `${cols}列: ${count}問`, exact: true })
      .click();
    await page.waitForFunction(
      ({ cols, count }) => {
        const params = new URLSearchParams(location.search);
        return params.get('cols') === String(cols) && params.get('count') === String(count);
      },
      { cols, count }
    );
  }
  await page.getByRole('checkbox', { name: '解答表示' }).check();
  await page.evaluate(() => {
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
  await page.getByLabel('印刷枚数').fill('3');
  await page.getByRole('button', { name: '印刷する', exact: true }).click();
  await page.waitForFunction(() => typeof window.__printedHTML === 'string');
  const html = await page.evaluate(() => window.__printedHTML);
  const printPage = await browser.newPage();
  await printPage.setContent(html, { waitUntil: 'load' });
  await printPage.emulateMedia({ media: 'print' });
  assert.equal(await printPage.locator('[data-a4-sheet]').count(), 3);
  assert.equal(
    await printPage.locator('.path-stages, .app-header, .sheet-scaled').count(),
    0
  );
  await printPage.pdf({
    path: `${output}/three-pages-with-answers.pdf`,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
  });
  await printPage
    .locator('[data-a4-sheet]')
    .first()
    .screenshot({ path: `${output}/printed-chart.png` });
  await printPage.close();
  await page.evaluate(() => {
    delete window.__printedHTML;
  });
  await page.addStyleTag({
    content: '[data-a4-sheet] { min-height: 400mm !important; }',
  });
  await page
    .getByRole('button', { name: '印刷（複数ページにも対応）' })
    .click();
  const warningPromise = page.waitForEvent('dialog').then(async (warning) => {
    assert.match(warning.message(), /A4サイズ/);
    await warning.dismiss();
  });
  await Promise.all([
    warningPromise,
    page.getByRole('button', { name: '印刷する', exact: true }).click(),
  ]);
  await page.waitForFunction(() => !document.getElementById('printWindow'));
  assert.equal(await page.evaluate(() => window.__printedHTML), undefined);
  await page.goto(
    `${base}?grade=1&type=basic&pattern=sub-minus-three&cols=2&count=20`
  );
  await page
    .getByRole('button', { name: 'この教材を「練習した」にする' })
    .click();
  await page.reload();
  await page.getByRole('button', { name: '✓ 練習済み（取り消す）' }).click();
  await page.getByRole('button', { name: /次の教材/ }).click();
  assert.equal(
    new URL(page.url()).searchParams.get('pattern'),
    'add-plus-four'
  );
  await page.getByRole('combobox', { name: '学年を選ぶ' }).selectOption('2');
  await page.getByRole('button', { name: /九九を一段ずつ/ }).click();
  await page.getByRole('button', { name: /未記録 九九・5の段/ }).click();
  await page.waitForFunction(
    () =>
      new URLSearchParams(location.search).get('pattern') === 'mult-table-five'
  );
  assert.match(await page.locator('[data-problem-grid]').innerText(), /5 ×/);
  await page
    .getByRole('button', { name: '印刷（複数ページにも対応）' })
    .click();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  await page.screenshot({ path: `${output}/desktop.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: '道すじを閉じる' }).click();
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth),
    390
  );
  await page.getByRole('button', { name: '原寸で見る' }).click();
  assert.ok(
    await page
      .locator('.sheet-viewport')
      .evaluate((el) => el.scrollWidth > el.clientWidth)
  );
  await page.getByRole('button', { name: '用紙全体' }).click();
  await page.screenshot({ path: `${output}/mobile.png`, fullPage: true });
  assert.deepEqual(errors, []);
  const summary = {
    checked,
    patterns: Object.keys(SUPPLEMENTAL_PATTERNS).length,
    gradeCounts: Object.fromEntries(
      Object.entries(PATTERNS_BY_GRADE).map(([grade, patterns]) => [
        grade,
        patterns.length,
      ])
    ),
    actualPrintPages: 3,
  };
  await writeFile(
    `${output}/${printOnly ? 'print-only-summary' : 'summary'}.json`,
    JSON.stringify(summary, null, 2)
  );
  console.log(JSON.stringify(summary));
} finally {
  await browser.close();
}
