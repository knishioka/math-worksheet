import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const base = process.argv[2] ?? 'http://127.0.0.1:4173/math-worksheet/';
const output = '.playwright-cli/catalog';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1360, height: 900 },
  });
  const errors = [];
  page.setDefaultTimeout(10000);
  page.on('pageerror', (error) => errors.push(error.message));
  const nav = page.getByRole('navigation', { name: 'メインメニュー' });
  const search = page.getByRole('searchbox', { name: 'キーワード' });
  const worksheetGrade = page.getByRole('combobox', { name: '学年を選ぶ' });
  const result = page.getByRole('region', { name: '検索結果' });
  await page.goto(
    base +
      '?grade=4&type=basic&pattern=entrance-crane-turtle-jap&count=3&cols=1'
  );
  const grid = page.locator('[data-problem-grid]');
  await page.getByRole('checkbox', { name: '解答表示' }).check();
  const original = await grid.innerText();
  await nav.getByRole('link', { name: '教材一覧' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('教材一覧');
  for (const language of ['', 'en']) {
    await page.getByLabel('言語', { exact: true }).selectOption(language);
    const rows = result.getByRole('listitem');
    const count = await rows.count();
    assert.ok(count > 0);
    await rows.locator('details').evaluateAll((items) => {
      for (const item of items) item.open = true;
    });
    await expect(result.locator('.catalog-sample:has(> *)')).toHaveCount(count);
    await rows.locator('details').evaluateAll((items) => {
      for (const item of items) item.open = false;
    });
  }
  await nav.getByRole('link', { name: 'プリント作成' }).click();
  await expect(grid).toHaveText(original, { useInnerText: true });
  await expect(page.getByRole('checkbox', { name: '解答表示' })).toBeChecked();
  await nav.getByRole('link', { name: '教材一覧' }).click();
  await page.getByLabel('学年', { exact: true }).selectOption('6');
  await page.getByLabel('分野', { exact: true }).selectOption('entrance');
  await page.getByLabel('言語', { exact: true }).selectOption('en');
  await search.fill('水そう');
  await expect(result.getByRole('listitem')).toHaveCount(1);
  await page.reload();
  await expect(search).toHaveValue('水そう');
  await result.getByText('例題を見る').click();
  await expect(result.locator('.catalog-sample')).toBeVisible();
  assert.doesNotMatch(
    await result.locator('.catalog-sample').innerText(),
    /[ぁ-んァ-ン一-龥]/
  );
  await page.screenshot({ path: output + '/desktop.png' });
  await result.getByRole('link', { name: /Water Depth and Flow/ }).click();
  await expect(page.locator('[data-a4-sheet]')).toHaveAttribute('lang', 'en');
  await expect(worksheetGrade).toHaveValue('6');
  assert.equal(
    new URL(page.url()).searchParams.get('pattern'),
    'entrance-water-depth-en'
  );
  await page.goBack();
  await expect(search).toHaveValue('水そう');
  await expect(result.getByRole('listitem')).toHaveCount(1);
  await search.fill('該当なしabcxyz');
  await expect(result.getByRole('listitem')).toHaveCount(0);
  await result.getByRole('button', { name: 'すべての教材を表示' }).click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await page.setViewportSize({ width: 360, height: 780 });
  await search.fill('bar model');
  const model = result
    .getByRole('listitem')
    .filter({ has: page.locator('a[href*="pattern=singapore-bar-model"]') });
  await model.getByRole('combobox').selectOption('5');
  await model.getByRole('link').click();
  await expect(worksheetGrade).toHaveValue('5');
  await page.goBack();
  await expect(model.getByRole('combobox')).toHaveValue('5');
  await page.getByRole('button', { name: '条件をクリア' }).click();
  await page.getByLabel('分野', { exact: true }).selectOption('entrance');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: output + '/mobile.png' });
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth),
    360
  );
  await page.goto(base + '#catalog?grade=0');
  await expect(result.getByRole('listitem')).toHaveCount(1);
  await result.getByText('例題を見る').click();
  await expect(result.locator('.catalog-sample svg').first()).toBeVisible();
  await result.getByRole('link').click();
  await expect(worksheetGrade).toHaveValue('0');
  await expect(page.locator('[data-a4-sheet]')).toBeVisible();
  await nav.getByRole('link', { name: '教材一覧' }).click();
  await page.getByRole('link', { name: '文章題から探す' }).click();
  await page.getByLabel('学年', { exact: true }).selectOption('5');
  await page.getByLabel('言語', { exact: true }).selectOption('en');
  await page.getByLabel('単元', { exact: true }).selectOption('speed');
  await expect(
    result.getByRole('heading', { name: 'Meeting and Catching Up' })
  ).toBeVisible();
  await page.getByLabel('コース', { exact: true }).selectOption('school');
  const speed = result
    .getByRole('listitem')
    .filter({ hasText: '速さの文章題（英語）' });
  await speed.getByText('例題を見る').click();
  await expect(speed.locator('.catalog-sample')).toContainText(/km|minute/);
  await page.screenshot({ path: output + '/story-units-mobile.png' });
  await speed.getByRole('link').click();
  const sheet = page.locator('[data-a4-sheet]');
  await expect(sheet).toHaveAttribute('lang', 'en');
  await expect(sheet).toContainText('Grade 5 · Speed');
  await page.getByRole('checkbox', { name: '解答表示' }).check();
  await expect(sheet.locator('output').first()).toBeVisible();
  await page.goBack();
  await expect(page.getByLabel('単元', { exact: true })).toHaveValue('speed');
  await page.getByRole('radio', { name: '学年別の総合演習' }).check();
  await expect(result.getByRole('listitem')).toHaveCount(1);
  await result.getByRole('link').click();
  assert.equal(new URL(page.url()).searchParams.get('pattern'), 'word-en');
  await expect(sheet).toContainText('Grade 5 · Mixed Word Problems');
  await page.goto(
    base + '#catalog?practice=unit&topic=age&course=entrance&lang=en&grade=6'
  );
  await expect(
    result.getByRole('heading', { name: 'Ratios and Ages' })
  ).toBeVisible();
  await page.reload();
  await page.getByLabel('単元', { exact: true }).selectOption('ratio');
  await expect(
    result.getByRole('heading', { name: 'Ratios and Ages' })
  ).toBeVisible();
  await page.setViewportSize({ width: 1360, height: 900 });
  await page.screenshot({ path: output + '/story-units-desktop.png' });
  await page.getByText('単元ごとの日英の教材数', { exact: true }).click();
  const coverage = page.getByRole('table', { name: '単元と言語ごとの教材数' });
  const japaneseAge = coverage.getByRole('button', { name: /^年齢・日本語の/ });
  const expected = Number.parseInt(await japaneseAge.innerText(), 10);
  await page.screenshot({ path: output + '/story-coverage.png' });
  await japaneseAge.click();
  await expect(coverage).toHaveCount(0);
  await expect(page.getByLabel('言語', { exact: true })).toHaveValue('ja');
  await expect(page.getByLabel('単元', { exact: true })).toHaveValue('age');
  await expect(result.getByRole('listitem')).toHaveCount(expected);
  await expect(
    result.getByRole('heading', { name: '比と年齢の複合問題' })
  ).toBeVisible();
  assert.deepEqual(errors, []);
  console.log(
    '教材一覧の検索・例題・日英と学年の選択・URL復元・スマートフォン表示を確認しました。'
  );
} finally {
  await browser.close();
}
