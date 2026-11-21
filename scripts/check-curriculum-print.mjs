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
const { isEnglishUnitPattern } = await vite.ssrLoadModule(
  '/src/lib/generators/templates/en-word-story.ts'
);
await vite.close();
const base = process.argv[2] ?? 'http://127.0.0.1:5174/';
const printOnly = process.argv.includes('--print-only');
const measureOnly = process.argv.includes('--measure-only');
const equation = !process.argv.includes('--no-equation');
const overflow = [];
const maxValues = process.argv.includes('--max-values');
const minValues = process.argv.includes('--min-values');
const patternPrefix = process.argv
  .find((argument) => argument.startsWith('--pattern-prefix='))
  ?.slice('--pattern-prefix='.length);
const curriculumPatterns = [
  ...Object.entries(SUPPLEMENTAL_PATTERNS),
  ...Object.entries(PATTERNS_BY_GRADE).flatMap(([grade, patterns]) =>
    patterns
      .filter(isEnglishUnitPattern)
      .map((pattern) => [pattern, { grade: Number(grade), type: 'word-en' }])
  ),
];
const selectedPatterns = curriculumPatterns.filter(
  ([pattern]) => !patternPrefix || pattern.startsWith(patternPrefix)
);
assert.ok(selectedPatterns.length > 0, 'Pattern filter must match a material');
const output = '.playwright-cli/curriculum-check';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const pdfPage = await browser.newPage();
if (maxValues || minValues) {
  await page.addInitScript(
    (value) => {
      if (
        new URLSearchParams(location.search)
          .get('pattern')
          ?.startsWith('entrance-')
      ) {
        Math.random = () => value;
      }
    },
    maxValues ? 0.999999 : 0
  );
}
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
let checked = 0;
let checkedPdfs = 0;
await mkdir(`${output}/entrance-pdfs`, { recursive: true });

async function loadPrintDocument(target, html) {
  // 印刷 iframe と同じ URL を使い、本番ビルドの相対 CSS も読み込む。
  await target.route(
    base,
    (route) =>
      route.fulfill({ contentType: 'text/html; charset=utf-8', body: html }),
    { times: 1 }
  );
  await target.emulateMedia({ media: 'print' });
  await target.goto(base, { waitUntil: 'load' });
  await target.evaluate(async () => {
    await document.fonts.ready;
    for (const link of document.querySelectorAll(
      'link[rel~="stylesheet"][href]'
    )) {
      if (!link.disabled && !link.sheet) {
        throw new Error(`Print stylesheet failed to load: ${link.href}`);
      }
    }
  });
}

async function capturePrintDocument(copies) {
  await page.evaluate(() => {
    delete window.__printedHTML;
    if (window.__printCaptureInstalled) return;
    window.__printCaptureInstalled = true;
    new MutationObserver(() => {
      const frame = document.getElementById('printWindow');
      if (!frame) return;
      const capture = () => {
        frame.contentWindow.print = () => {
          const doc = frame.contentDocument;
          const doctype = new XMLSerializer().serializeToString(doc.doctype);
          window.__printedHTML = doctype + doc.documentElement.outerHTML;
        };
      };
      capture();
      frame.addEventListener('load', capture, { once: true });
    }).observe(document.body, { childList: true });
  });
  await page
    .getByRole('button', { name: '印刷（複数ページにも対応）' })
    .click();
  await page.getByLabel('印刷枚数').fill(String(copies));
  await page.getByRole('button', { name: '印刷する', exact: true }).click();
  await page.waitForFunction(
    () =>
      typeof window.__printedHTML === 'string' ||
      document.querySelector('.preview-toolbar [role="alert"]')?.textContent
  );
  const printError = await page
    .locator('.preview-toolbar [role="alert"]')
    .allTextContents();
  assert.equal(printError.length, 0, `${page.url()}: ${printError.join(' ')}`);
  return page.evaluate(() => window.__printedHTML);
}

async function checkSinglePagePdf(path, count, answers) {
  console.log(`Checking ${path}`);
  const html = await capturePrintDocument(1);
  await loadPrintDocument(pdfPage, html);
  assert.equal(await pdfPage.locator('[data-a4-sheet]').count(), 1);
  assert.equal(await pdfPage.locator('[data-problem-number]').count(), count);
  assert.equal(
    await pdfPage.getByRole('list', { name: /^(解き方|Solution)$/ }).count(),
    answers ? count : 0,
    `${path}: Solution visibility in the actual print output`
  );
  const sheet = pdfPage.locator('[data-a4-sheet]');
  assert.equal(
    await sheet.isVisible(),
    true,
    `${path}: Printable sheet visible`
  );
  const bounds = await sheet.evaluate((element) => ({
    width: element.offsetWidth,
    height: Math.max(element.clientHeight, element.scrollHeight),
    clipped: [...element.querySelectorAll('[data-problem-grid] > div')].some(
      (cell) => cell.scrollWidth > cell.clientWidth + 2
    ),
  }));
  assert.ok(
    Math.abs(bounds.width - 794) <= 1 &&
      bounds.height <= 1123 &&
      !bounds.clipped,
    `${path}: Actual print layout ${JSON.stringify(bounds)}`
  );
  const pdf = await pdfPage.pdf({
    path,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
  });
  assert.equal(
    (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length,
    1,
    `${path}: Exactly one A4 page`
  );
  assert.ok(
    pdf.length > 5000 && /\/Font\b/.test(pdf.toString('latin1')),
    `${path}: PDF must contain rendered text, not a blank page`
  );
  checkedPdfs++;
}

async function verifyCurriculum() {
  for (const [pattern, definition] of printOnly ? [] : selectedPatterns) {
    for (const cols of [1, 2, 3]) {
      const count = getEffectiveCounts(
        definition.type,
        pattern,
        definition.grade,
        equation
      ).maxCounts[cols];
      const url = new URL(base);
      url.search = new URLSearchParams({
        grade: String(definition.grade),
        type: 'basic',
        pattern,
        cols: String(cols),
        count: String(count),
        eq: equation ? '1' : '0',
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
      for (const answers of [false, true]) {
        await page
          .getByRole('checkbox', { name: '解答表示' })
          .setChecked(answers);
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
        const fits =
          Math.abs(result.width - 794) <= 1 &&
          result.height <= 1123 &&
          !result.clipped;
        if (measureOnly) {
          if (!fits)
            overflow.push({
              pattern,
              grade: definition.grade,
              cols,
              count,
              answers,
              ...result,
            });
        } else {
          assert.ok(
            fits,
            `${pattern}/${cols}/${answers}: ${JSON.stringify(result)}`
          );
        }
        if (!measureOnly && pattern.startsWith('entrance-')) {
          await checkSinglePagePdf(
            `${output}/entrance-pdfs/${pattern}-${cols}cols-${answers ? 'answers' : 'questions'}.pdf`,
            count,
            answers
          );
        }
        checked++;
      }
    }
  }
  if (measureOnly) {
    console.log(JSON.stringify({ checked, overflow }, null, 2));
    assert.equal(overflow.length, 0, 'A4 overflow');
    return;
  }
  if (selectedPatterns.some(([pattern]) => pattern.startsWith('entrance-'))) {
    await page.goto(
      `${base}?grade=4&type=basic&pattern=entrance-crane-turtle-jap&cols=2&count=4&eq=1`
    );
    await page
      .getByRole('heading', { name: '4年生の中学受験の道すじ' })
      .waitFor();
    assert.equal(await page.getByRole('list', { name: '解き方' }).count(), 0);
    const writingSpace = await page
      .locator('[data-problem-number]')
      .evaluateAll((cells) =>
        cells.map(
          (cell) => cell.clientHeight - cell.firstElementChild.offsetHeight
        )
      );
    assert.equal(writingSpace.length, 4);
    assert.ok(
      Math.min(...writingSpace) >= 38,
      'Leave at least 1 cm below each of the four short problems'
    );
    const questionText = await page.locator('[data-problem-grid]').innerText();
    await page.getByRole('button', { name: '学校算数', exact: true }).click();
    await page.getByRole('heading', { name: '4年生の学習の道すじ' }).waitFor();
    assert.equal(
      await page.locator('[data-problem-grid]').innerText(),
      questionText
    );
    await page.getByRole('button', { name: '中学受験', exact: true }).click();
    await page.getByRole('checkbox', { name: '解答表示' }).check();
    assert.equal(await page.getByRole('list', { name: '解き方' }).count(), 4);
    await page.locator('[data-a4-sheet]').screenshot({
      path: `${output}/entrance-with-answers.png`,
    });
    await checkSinglePagePdf(`${output}/entrance-with-answers.pdf`, 4, true);
    await page.getByRole('button', { name: /次の教材/ }).click();
    assert.equal(
      new URL(page.url()).searchParams.get('pattern'),
      'entrance-difference-gathering-jap'
    );
    await page.getByRole('button', { name: '問題を変更' }).click();
    await page.getByLabel('キーワードで探す').fill('消去算');
    await page
      .locator('#pattern-picker')
      .getByText('消去算', { exact: true })
      .click();
    await page
      .getByRole('heading', { name: '4年生の中学受験の道すじ' })
      .waitFor();
    assert.equal(
      new URL(page.url()).searchParams.get('pattern'),
      'entrance-elimination-jap'
    );
    await page.reload();
    await page
      .getByRole('heading', { name: '4年生の中学受験の道すじ' })
      .waitFor();
  }
  for (const [grade, pattern, next] of [
    [5, 'entrance-profit-loss-jap', 'entrance-salt-water-jap'],
    [6, 'entrance-newton-jap', 'entrance-advanced-crane-turtle-jap'],
  ]) {
    if (
      !selectedPatterns.some(
        ([key, definition]) =>
          key.startsWith('entrance-') && definition.grade === grade
      )
    )
      continue;
    await page.goto(
      `${base}?grade=${grade}&type=basic&pattern=${pattern}&cols=2&count=4&eq=1`
    );
    await page
      .getByRole('heading', { name: `${grade}年生の中学受験の道すじ` })
      .waitFor();
    assert.equal(await page.getByRole('list', { name: '解き方' }).count(), 0);
    await page.getByRole('checkbox', { name: '解答表示' }).check();
    assert.equal(await page.getByRole('list', { name: '解き方' }).count(), 4);
    await page
      .locator('[data-a4-sheet]')
      .screenshot({ path: `${output}/entrance-grade${grade}-answers.png` });
    const pdfPath = `${output}/entrance-grade${grade}-answers.pdf`;
    await checkSinglePagePdf(pdfPath, 4, true);
    await page.getByRole('button', { name: /次の教材/ }).click();
    assert.equal(new URL(page.url()).searchParams.get('pattern'), next);
    await page.reload();
    await page
      .getByRole('heading', { name: `${grade}年生の中学受験の道すじ` })
      .waitFor();
    const gradeSelect = page.getByRole('combobox', { name: '学年を選ぶ' });
    await gradeSelect.selectOption('3');
    assert.equal(
      await page.getByRole('group', { name: '学習コース' }).count(),
      0
    );
    await gradeSelect.selectOption(String(grade));
    await page.getByRole('button', { name: '中学受験', exact: true }).click();
    await page
      .getByRole('heading', { name: `${grade}年生の中学受験の道すじ` })
      .waitFor();
  }
  if (!patternPrefix) {
    // 動画配信のネットワーク状態に依存せず、再生操作と印刷対象を確認する。
    await page.route('https://www.youtube-nocookie.com/embed/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<title>Lesson</title>' })
    );
    await page.goto(
      `${base}?grade=4&type=basic&pattern=entrance-tree-planting-jap`
    );
    const player = page.locator('iframe[title^="日本語の解説動画"]');
    const play = page.getByRole('button', { name: '解説動画を見る（日本語）' });
    assert.equal(await player.count(), 0);
    await play.click();
    await page
      .getByRole('combobox', { name: '解説動画を選ぶ' })
      .selectOption('SRtVoQWwXaU');
    assert.match(await player.getAttribute('src'), /\/embed\/SRtVoQWwXaU\?/);
    assert.equal(
      await page
        .getByRole('link', { name: 'YouTubeで開く' })
        .getAttribute('href'),
      'https://www.youtube.com/watch?v=SRtVoQWwXaU'
    );
    await page.getByRole('button', { name: '動画を閉じる' }).click();
    assert.equal(await player.count(), 0);
    await play.click();
    assert.match(await player.getAttribute('src'), /\/embed\/SRtVoQWwXaU\?/);
    await page.getByRole('button', { name: /次の教材/ }).click();
    assert.equal(await player.count(), 0);

    // 共有URLの問題数を維持し、同じ画面から新しい推奨数を選べる。
    for (const [pattern, oldCount, recommended] of [
      ['entrance-sum-difference-en', 6, 12],
      ['word-unit-patterns-en', 8, 16],
    ]) {
      await page.goto(
        `${base}?grade=4&type=basic&pattern=${pattern}&cols=2&count=${oldCount}#worksheet-preview`
      );
      await page.locator(`[data-problem-number="${oldCount}"]`).waitFor();
      assert.equal(
        await page.locator('[data-problem-number]').count(),
        oldCount
      );
      await page
        .getByRole('button', { name: `2列: ${recommended}問`, exact: true })
        .click();
      await page.locator(`[data-problem-number="${recommended}"]`).waitFor();
      await play.click();
      for (const answers of [false, true]) {
        await page
          .getByRole('checkbox', { name: '解答表示' })
          .setChecked(answers);
        await checkSinglePagePdf(
          `${output}/${pattern}-${answers ? 'answers' : 'questions'}.pdf`,
          recommended,
          answers && pattern === 'entrance-sum-difference-en'
        );
        assert.equal(
          await pdfPage.locator('output').count(),
          answers ? recommended : 0
        );
        assert.equal(await pdfPage.locator('iframe').count(), 0);
      }
      await page.getByRole('checkbox', { name: '解答表示' }).uncheck();
      await page.getByRole('checkbox', { name: '式を書く欄' }).check();
      await page
        .getByRole('button', { name: '2列: 12問', exact: true })
        .waitFor();
      await checkSinglePagePdf(`${output}/${pattern}-equations.pdf`, 12, false);
      assert.equal(
        await pdfPage.getByText('Equation:', { exact: true }).count(),
        12
      );
    }
    for (const [pattern, title] of [
      ['word-unit-percent-en', 'Percentages'],
      ['word-en', 'Mixed Word Problems'],
    ]) {
      const count = getEffectiveCounts('word-en', pattern, 5)
        .recommendedCounts[2];
      await page.goto(
        `${base}?grade=5&type=basic&pattern=${pattern}&cols=2&count=${count}`
      );
      await page.getByRole('checkbox', { name: '解答表示' }).check();
      await checkSinglePagePdf(`${output}/${pattern}.pdf`, count, false);
      assert.equal(
        await page.getByRole('region', { name: '解説動画' }).count(),
        pattern === 'word-en' ? 0 : 1
      );
      const sheet = pdfPage.locator('[data-a4-sheet]');
      assert.equal(await sheet.getAttribute('lang'), 'en');
      assert.ok((await sheet.innerText()).includes('Grade 5 · ' + title));
      assert.equal(await sheet.locator('output').count(), count);
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
  const html = await capturePrintDocument(3);
  const printPage = await browser.newPage();
  await loadPrintDocument(printPage, html);
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
  // 学習順の候補をカテゴリ・テーマごとに探せ、絞り込みでは教材を変更しない。
  await page.getByRole('button', { name: '問題を変更' }).click();
  await page.getByRole('heading', { name: /基本計算 ·/ }).waitFor();
  await page
    .locator('#pattern-picker')
    .getByRole('group', { name: '九九', exact: true })
    .waitFor();
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
  await page.getByRole('button', { name: '★ やさしい' }).click();
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
    checkedPdfs,
    patterns: new Set(curriculumPatterns.map(([pattern]) => pattern)).size,
    checkedPatterns: new Set(selectedPatterns.map(([pattern]) => pattern)).size,
    maxValues,
    gradeCounts: Object.fromEntries(
      Object.entries(PATTERNS_BY_GRADE).map(([grade, patterns]) => [
        grade,
        patterns.length,
      ])
    ),
    actualPrintPages: 3,
  };
  await writeFile(
    `${output}/${printOnly ? 'print-only-summary' : maxValues ? 'summary-max-values' : 'summary'}.json`,
    JSON.stringify(summary, null, 2)
  );
  console.log(JSON.stringify(summary));
}

try {
  await verifyCurriculum();
} finally {
  await browser.close();
}
