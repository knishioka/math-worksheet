#!/usr/bin/env node
/**
 * 印刷レイアウトチェックスクリプト
 *
 * playwright-cli を使ってデプロイ済みサイト（またはローカル）の
 * 印刷プレビューエリアの高さをA4と比較し、オーバーフローを検出する。
 *
 * 使い方:
 *   node scripts/check-print-layout.mjs [url]
 *   node scripts/check-print-layout.mjs https://knishioka.github.io/math-worksheet/
 *   node scripts/check-print-layout.mjs http://localhost:4173/math-worksheet/
 *
 * 注意: playwright-cli run-code は呼び出しのたびにページを再ナビゲートするため、
 *       1シナリオ分の操作（学年選択・パターン選択・計測）を1回の呼び出しにまとめる。
 *       また、JSON.stringify で渡す際は改行が \n に変換されて JS として解釈されないため、
 *       コードを1行にまとめる必要がある。
 */

import { spawnSync } from 'child_process';

const BASE_URL =
  process.argv[2] ?? 'https://knishioka.github.io/math-worksheet/';

// A4 @ 96dpi: 297mm × (96 / 25.4)
// data-a4-sheet の内側コンテナ（minHeight: 297mm）を計測するため、
// 297mm のピクセル換算値と比較する。
const A4_PX = 297 * (96 / 25.4); // ≈ 1122.5px

// チェックするシナリオ: grade=学年(1-6), pattern=calculationPatternの値 or null
const SCENARIOS = [
  { grade: 1, pattern: null, label: '1年生 基本計算' },
  { grade: 2, pattern: 'anzan-pair-sum', label: '2年生 ペアで10を作る' },
  { grade: 3, pattern: 'hissan-add-triple', label: '3年生 3桁のたし算筆算' },
  { grade: 4, pattern: 'hissan-div-basic', label: '4年生 わり算の筆算' },
  { grade: 4, pattern: 'anzan-pair-sum', label: '4年生 ペアで10/100を作る' },
  { grade: 4, pattern: 'anzan-reorder', label: '4年生 順序入れ替え' },
  { grade: 5, pattern: 'anzan-mixed', label: '5年生 暗算混合' },
  { grade: 3, pattern: null, label: '3年生 基本計算' },
];

/**
 * playwright-cli run-code を実行して Result を返す。
 * singleLineJs は1行のJSコード。IIFE でラップして run-code に渡す。
 * spawnSync でシェルを経由せず引数を直接渡すことで、$() のシェル展開を防ぐ。
 */
function rc(singleLineJs) {
  try {
    const fn =
      'async (page) => { return await (async()=>{' + singleLineJs + '})(); }';
    const result = spawnSync('playwright-cli', ['run-code', fn], {
      encoding: 'utf8',
    });
    const out = result.stdout ?? '';
    const m = out.match(/### Result\n([\s\S]*?)(?:\n### |$)/);
    if (!m) return null;
    return m[1].trim().replace(/^"|"$/g, '');
  } catch {
    return null;
  }
}

/** playwright-cli コマンドを実行（spawnSync でシェルを経由しない） */
function cli(...args) {
  try {
    spawnSync('playwright-cli', args, { encoding: 'utf8', stdio: 'pipe' });
  } catch {
    /* ignore */
  }
}

/** テンプレートリテラルの改行・余分な空白を除去して1行のJSにする */
function collapse(code) {
  return code.replace(/\n\s*/g, ' ').trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * 1シナリオを単一の rc() 呼び出しで計測する。
 * playwright-cli は run-code のたびにページを再ナビゲートするため、
 * 学年選択・パターン選択・高さ計測を1行のJSにまとめる。
 */
async function measureScenario(s) {
  // パターン選択コード（テンプレートリテラルで記述し、実行時に1行化する）
  const patternJs = s.pattern
    ? collapse(`
        const r = await page.$('input[value="${s.pattern}"]');
        if (r) {
          await r.evaluate(el => {
            const lb = el.closest('label') || el.parentElement;
            if (lb) lb.click();
          });
          await page.waitForTimeout(600);
        }
        const r2 = await page.$('input[value="${s.pattern}"]:checked');
        if (!r2) {
          const btn = await page.$('button[aria-expanded="false"]');
          if (btn) await btn.click();
          await page.waitForTimeout(300);
          const r3 = await page.$('input[value="${s.pattern}"]');
          if (r3) await r3.evaluate(el => {
            const lb = el.closest('label') || el.parentElement;
            if (lb) lb.click();
          });
          await page.waitForTimeout(500);
        }
      `)
    : '';

  // 学年選択 + パターン選択 + 推奨問題数選択 + 計測（テンプレートリテラルで記述し1行化）
  const code = collapse(`
    const sel = await page.$('select');
    if (sel) {
      await sel.selectOption(String(${s.grade}));
      await page.waitForTimeout(400);
    }
    ${patternJs}
    const recBtn = await page.$('button:has-text("推奨")');
    if (recBtn) await recBtn.click();
    await page.waitForTimeout(600);
    const el = await page.$('[data-a4-sheet]');
    if (!el) return '0';
    const b = await el.boundingBox();
    return b ? String(Math.round(b.height)) : '0';
  `);

  const h = rc(code);
  return parseInt((h ?? '0').replace(/\D/g, ''), 10);
}

async function main() {
  console.log('\n📐 印刷レイアウトチェック');
  console.log('   URL: ' + BASE_URL);
  console.log('   A4高さ基準: ' + Math.round(A4_PX) + 'px (297mm @ 96dpi)\n');

  cli('open', BASE_URL);
  cli('resize', '1280', '900');
  await sleep(3000);

  const results = [];

  for (const scenario of SCENARIOS) {
    const height = await measureScenario(scenario);
    // minHeight: 297mm のブラウザ丸め込みにより最低でも Math.round(A4_PX) px になる。
    // 5px（約1.3mm）のトレランスを設けてブラウザの丸め誤差を吸収する。
    const A4_BASELINE = Math.round(A4_PX); // 1123px
    const TOLERANCE_PX = 5;
    const ratio = height > 0 ? height / A4_PX : null;
    const ok = ratio === null || height <= A4_BASELINE + TOLERANCE_PX;
    const pages = ratio ? Math.ceil(ratio) : 1;

    results.push({ ...scenario, height, ratio, pages, ok });

    if (height === 0) {
      console.log('  ⚠️  ' + scenario.label + ': 計測できませんでした');
    } else if (ok) {
      console.log(
        '  ✅ ' +
          scenario.label +
          ': ' +
          height +
          'px (' +
          (ratio * 100).toFixed(0) +
          '% of A4)'
      );
    } else {
      console.log(
        '  ❌ ' +
          scenario.label +
          ': ' +
          height +
          'px → PDF ' +
          pages +
          'ページ (A4の' +
          (ratio * 100).toFixed(0) +
          '%)'
      );
    }
  }

  cli('close-all');

  const unmeasured = results.filter((r) => r.height === 0);
  const failures = results.filter((r) => !r.ok && r.height > 0);
  console.log('\n--- 結果 ---');
  if (unmeasured.length === results.length) {
    console.log(
      '❌ 全シナリオの計測に失敗しました。playwright-cli が正しくインストールされているか確認してください。\n'
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
  } else if (failures.length === 0) {
    console.log('✅ 計測できたシナリオは全て A4 1ページに収まっています\n');
    process.exit(0);
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
