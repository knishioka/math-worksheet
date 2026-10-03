import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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
          result.height <= 1123 && !result.clipped,
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
        return (
          params.get('cols') === String(cols) &&
          params.get('count') === String(count)
        );
      },
      { cols, count }
    );
  }
  await page.getByRole('checkbox', { name: '解答表示' }).check();
  await page.getByRole('radio', { name: /よこ順/ }).check();
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
  assert.deepEqual(
    await printPage
      .locator('[data-a4-sheet]')
      .first()
      .locator('[data-problem-number]')
      .evaluateAll((cells) =>
        cells.map((cell) => Number(cell.getAttribute('data-problem-number')))
      ),
    [1, 2, 3, 4, 5, 6],
    'The final PDF uses the selected row order'
  );
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
  const pdf = await readFile(`${output}/three-pages-with-answers.pdf`);
  assert.equal(
    (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length,
    3,
    'PDF must contain exactly three A4 pages'
  );
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
  await page.getByRole('button', { name: '印刷する', exact: true }).click();
  await page
    .getByRole('alert')
    .filter({ hasText: '印刷・PDF保存を中止しました' })
    .waitFor();
  await page.waitForFunction(() => !document.getElementById('printWindow'));
  assert.equal(await page.evaluate(() => window.__printedHTML), undefined);
  // 用紙内でも問題が隣の列に重なる場合は出力を止める。
  await page.reload();
  await page.addStyleTag({
    content:
      '[data-problem-grid] > div::after { content: ""; display: block; width: 1000px; height: 1px; }',
  });
  await page
    .getByRole('button', { name: '印刷（複数ページにも対応）' })
    .click();
  await page.getByRole('button', { name: '印刷する', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: '列数を減らして' }).waitFor();
  await page.waitForFunction(() => !document.getElementById('printWindow'));

  // 列数や式欄を変えても、確認中の問題文を維持する。
  await page.goto(
    `${base}?grade=3&type=basic&pattern=data-bar-chart-jap&cols=2&count=3`
  );
  const originalProblems = await page
    .locator('[data-problem-grid] .worksheet-bar-chart')
    .evaluateAll((charts) =>
      charts.map((chart) => chart.getAttribute('aria-label')).sort()
    );
  assert.equal(originalProblems.length, 3);
  await page.getByRole('button', { name: '3列', exact: true }).click();
  await page.getByRole('checkbox', { name: '式を書く欄' }).check();
  assert.deepEqual(
    await page
      .locator('[data-problem-grid] .worksheet-bar-chart')
      .evaluateAll((charts) =>
        charts.map((chart) => chart.getAttribute('aria-label')).sort()
      ),
    originalProblems
  );
  await page.goto(
    `${base}?grade=2&type=basic&pattern=mult-table-five&cols=3&count=4`
  );
  const numberOrder = () =>
    page
      .locator('[data-problem-number]')
      .evaluateAll((cells) =>
        cells.map((cell) => Number(cell.getAttribute('data-problem-number')))
      );
  const problemContents = () =>
    page
      .locator('[data-problem-number]')
      .evaluateAll((cells) =>
        cells
          .map(
            (cell) =>
              `${cell.getAttribute('data-problem-number')}:${cell.textContent}`
          )
          .sort()
      );
  assert.deepEqual(await numberOrder(), [1, 3, 4, 2]);
  const beforeOrderChange = await problemContents();
  await page.getByRole('radio', { name: /よこ順/ }).check();
  assert.deepEqual(await numberOrder(), [1, 2, 3, 4]);
  assert.deepEqual(await problemContents(), beforeOrderChange);
  await page.reload();
  assert.deepEqual(await numberOrder(), [1, 2, 3, 4]);
  // 学習順の候補をカテゴリごとに探せ、並べ替えでは教材を変更しない。
  await page.getByRole('button', { name: '問題を変更' }).click();
  await page.getByRole('heading', { name: /基本計算 ·/ }).waitFor();
  await page.getByLabel('キーワードで探す').fill('九九');
  const tablePatterns = await page
    .locator('#pattern-picker input[name="calculationPattern"]')
    .evaluateAll((inputs) =>
      inputs
        .map((input) => input.value)
        .filter((pattern) => pattern.startsWith('mult-table-'))
    );
  assert.deepEqual(tablePatterns.slice(0, 2), [
    'mult-table-two',
    'mult-table-five',
  ]);
  await page.getByLabel('教材の並び順').selectOption('difficulty');
  assert.equal(
    new URL(page.url()).searchParams.get('pattern'),
    'mult-table-five'
  );
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#pattern-picker').count(), 0);
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
  const pageExtent = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    footerBottom:
      document.querySelector('.app-footer').getBoundingClientRect().bottom +
      scrollY,
    viewportHeight: innerHeight,
    frames: document.querySelectorAll('iframe').length,
    sheetViewportHeight: document.querySelector('.sheet-viewport').clientHeight,
    furthestElements: [...document.body.querySelectorAll('*')]
      .map((element) => ({
        tag: element.tagName,
        className: element.getAttribute('class'),
        bottom: element.getBoundingClientRect().bottom + scrollY,
      }))
      .sort((a, b) => b.bottom - a.bottom)
      .slice(0, 5),
  }));
  assert.ok(
    pageExtent.height <=
      Math.max(pageExtent.viewportHeight, pageExtent.footerBottom + 100),
    `No blank scroll area below the footer: ${JSON.stringify(pageExtent)}`
  );
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
