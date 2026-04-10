#!/usr/bin/env node
/**
 * 印刷レイアウトチェックスクリプト
 *
 * Playwright Node.js API を使ってビルド済みサイトの
 * 印刷プレビューエリアの高さをA4と比較し、オーバーフローを検出する。
 *
 * 使い方:
 *   node scripts/check-print-layout.mjs [url]
 *   node scripts/check-print-layout.mjs https://knishioka.github.io/math-worksheet/
 *   node scripts/check-print-layout.mjs http://localhost:4173/math-worksheet/
 *
 * スクリーンショットは常に .playwright-cli/layout-check/ に保存される。
 */

import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = join(__dirname, '..', '.playwright-cli', 'layout-check');

async function ensureScreenshotDir() {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
}

const BASE_URL =
  process.argv[2] ?? 'https://knishioka.github.io/math-worksheet/';

// A4 @ 96dpi: 297mm * (96 / 25.4)
const A4_PX = 297 * (96 / 25.4); // 1122.5px

const SCENARIOS = [
  { grade: 1, pattern: null, label: '1年生 基本計算', minFillRatio: 0.25 },
  {
    grade: 2,
    pattern: 'anzan-pair-sum',
    label: '2年生 ペアで10を作る',
    minFillRatio: 0.45,
  },
  { grade: 3, pattern: null, label: '3年生 基本計算', minFillRatio: 0.25 },
  {
    grade: 3,
    pattern: 'hissan-add-triple',
    label: '3年生 3桁のたし算筆算',
    minFillRatio: 0.25,
  },
  {
    grade: 4,
    pattern: 'hissan-div-basic',
    label: '4年生 わり算の筆算',
    minFillRatio: 0.25,
  },
  {
    grade: 4,
    pattern: 'anzan-pair-sum',
    label: '4年生 ペアで10/100を作る',
    minFillRatio: 0.45,
  },
  {
    grade: 5,
    pattern: 'anzan-reorder',
    label: '5年生 順序入れ替え',
    minFillRatio: 0.45,
  },
  {
    grade: 6,
    pattern: 'anzan-mixed',
    label: '6年生 暗算混合',
    minFillRatio: 0.45,
  },
  // Singapore Math layout checks
  {
    grade: 1,
    pattern: 'singapore-bar-model',
    label: '1年生 Singapore Bar Model',
    minFillRatio: 0.25,
  },
  {
    grade: 4,
    pattern: 'singapore-bar-model',
    label: '4年生 Singapore Bar Model',
    minFillRatio: 0.25,
  },
  {
    grade: 6,
    pattern: 'singapore-number-bond',
    label: '6年生 Singapore Number Bond',
    minFillRatio: 0.25,
  },
  {
    grade: 5,
    pattern: 'singapore-comparison',
    label: '5年生 Singapore Comparison',
    minFillRatio: 0.25,
  },
];

/**
 * パターンのラジオボタンを選択する。
 * アコーディオン内の場合は全セクションを展開してからクリックする。
 */
async function selectPattern(page, pattern) {
  if (!pattern) return;

  // まずラジオボタンが見えるか確認
  let radio = await page.$(`input[value="${pattern}"]`);

  if (!radio) {
    // アコーディオンを全て展開
    const collapsed = await page.$$('button[aria-expanded="false"]');
    for (const btn of collapsed) {
      await btn.click();
      await page.waitForTimeout(100);
    }
    // 再度ラジオボタンを探す
    radio = await page.$(`input[value="${pattern}"]`);
  }

  if (!radio) {
    console.warn(
      `    [warn] パターン "${pattern}" のラジオボタンが見つかりません`
    );
    return;
  }

  // ラジオボタンの親要素（label）をクリック
  await radio.evaluate((el) => {
    const label = el.closest('label') || el.parentElement;
    if (label) label.click();
  });

  // ラジオボタンがチェックされるのを待つ
  await page
    .waitForFunction(
      (v) => document.querySelector(`input[value="${v}"]:checked`),
      pattern,
      { timeout: 3000 }
    )
    .catch(() => {
      console.warn(
        `    [warn] パターン "${pattern}" の選択を確認できませんでした`
      );
    });

  // React の状態更新を待つ（useEffect による recommendedCount 反映）
  await page.waitForTimeout(1000);
}

/**
 * シナリオラベルをファイル名に変換する。
 */
function labelToFilename(label) {
  return label.replace(/[^\w\u3040-\u9fff]/g, '_').replace(/_+/g, '_') + '.png';
}

/**
 * 1シナリオの印刷レイアウトを計測する。
 */
async function measureScenario(page, scenario) {
  // 各シナリオごとにページを再読み込みして状態をリセット
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('select', { timeout: 10000 });

  // 学年選択
  const gradeSelect = await page.$('select');
  if (gradeSelect) {
    await gradeSelect.selectOption(String(scenario.grade));
    await page
      .waitForFunction(
        (g) => {
          const s = document.querySelector('select');
          return s && s.value === String(g);
        },
        scenario.grade,
        { timeout: 3000 }
      )
      .catch(() => {});
  }

  // パターン選択
  await selectPattern(page, scenario.pattern);

  // 問題が生成されるのを待つ
  await page
    .waitForSelector('[data-a4-sheet]', { timeout: 5000 })
    .catch(() => {});

  // no-print 要素を表示させる（印刷モードで非表示になるのを防ぐ）
  await page.addStyleTag({
    content: '.no-print { display: block !important; }',
  });

  // 印刷メディアに切り替え
  await page.emulateMedia({ media: 'print' });
  await page
    .waitForSelector('[data-a4-sheet]', { state: 'visible', timeout: 3000 })
    .catch(() => {});

  const el = await page.$('[data-a4-sheet]');
  if (!el) {
    await page.emulateMedia({ media: null });
    return { height: 0, fillRatio: null };
  }

  const containerBox = await el.boundingBox();
  const gridEl = await page.$('[data-problem-grid]');
  const gridBox = gridEl ? await gridEl.boundingBox() : null;

  await page.emulateMedia({ media: null });

  const height = containerBox ? Math.round(containerBox.height) : 0;
  const fillRatio =
    gridBox && containerBox
      ? (gridBox.y + gridBox.height - containerBox.y) / containerBox.height
      : null;

  // スクリーンショット保存
  let screenshotPath = null;
  if (el) {
    const filename = labelToFilename(scenario.label);
    screenshotPath = join(SCREENSHOT_DIR, filename);
    await el.screenshot({ path: screenshotPath }).catch(() => {});
  }

  return { height, fillRatio, screenshotPath };
}

async function main() {
  console.log('\n📐 印刷レイアウトチェック');
  console.log('   URL: ' + BASE_URL);
  console.log('   A4高さ基準: ' + Math.round(A4_PX) + 'px (297mm @ 96dpi)');
  console.log('   スクリーンショット: ' + SCREENSHOT_DIR + '\n');

  await ensureScreenshotDir();

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  const results = [];

  for (const scenario of SCENARIOS) {
    const { height, fillRatio, screenshotPath } = await measureScenario(
      page,
      scenario
    );
    const A4_BASELINE = Math.round(A4_PX); // 1123px
    const TOLERANCE_PX = 5;
    const ratio = height > 0 ? height / A4_PX : null;
    const overflowOk = ratio === null || height <= A4_BASELINE + TOLERANCE_PX;
    const fillOk =
      fillRatio === null ||
      scenario.minFillRatio === undefined ||
      fillRatio >= scenario.minFillRatio;
    const ok = overflowOk && fillOk;
    const pages = ratio ? Math.ceil(ratio) : 1;

    results.push({
      ...scenario,
      height,
      ratio,
      fillRatio,
      pages,
      ok,
      screenshotPath,
    });

    if (height === 0) {
      console.log('  ⚠️  ' + scenario.label + ': 計測できませんでした');
    } else if (!overflowOk) {
      console.log(
        '  ❌ overflow ' +
          scenario.label +
          ': ' +
          height +
          'px → PDF ' +
          pages +
          'ページ (A4の' +
          (ratio * 100).toFixed(0) +
          '%)'
      );
    } else if (!fillOk) {
      console.log(
        '  ❌ underfill ' +
          scenario.label +
          ': fill=' +
          (fillRatio * 100).toFixed(0) +
          '% (min ' +
          (scenario.minFillRatio * 100).toFixed(0) +
          '%)'
      );
    } else {
      const fillInfo =
        fillRatio !== null ? ' fill=' + (fillRatio * 100).toFixed(0) + '%' : '';
      console.log(
        '  ✅ ' +
          scenario.label +
          ': ' +
          height +
          'px (' +
          (ratio * 100).toFixed(0) +
          '% of A4)' +
          fillInfo
      );
    }
    if (screenshotPath) {
      console.log('     📸 ' + screenshotPath);
    }
  }

  await browser.close();

  const unmeasured = results.filter((r) => r.height === 0);
  const failures = results.filter((r) => !r.ok && r.height > 0);
  console.log('\n--- 結果 ---');
  if (unmeasured.length === results.length) {
    console.log(
      '❌ 全シナリオの計測に失敗しました。Playwright が正しくインストールされているか確認してください。\n'
    );
    process.exit(1);
  }
  if (unmeasured.length > 0) {
    console.log(
      '⚠️  ' + unmeasured.length + '件のシナリオが計測できませんでした'
    );
  }
  if (failures.length === 0 && unmeasured.length === 0) {
    console.log('✅ 全シナリオ A4 1ページに収まっています\n');
    process.exit(0);
  } else if (failures.length === 0 && unmeasured.length > 0) {
    console.log(
      '⚠️  計測できたシナリオは全て A4 1ページに収まっていますが、' +
        unmeasured.length +
        '件が未計測のため検証不完全です\n'
    );
    process.exit(1);
  } else {
    console.log('❌ ' + failures.length + '件のレイアウト問題を検出:\n');
    for (const f of failures) {
      console.log(
        '   ' +
          f.label +
          ': ' +
          f.height +
          'px → PDF ' +
          f.pages +
          'ページになります'
      );
    }
    console.log('');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
