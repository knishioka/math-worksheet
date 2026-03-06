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
// 各学年の代表的な問題タイプをカバーするシナリオ
// pattern: null は学年デフォルト（四則演算混合）を意味する
const SCENARIOS = [
  // 低学年: 1桁のたし算・ひき算
  { grade: 1, pattern: null, label: '1年生 基本計算' },
  { grade: 2, pattern: 'anzan-pair-sum', label: '2年生 ペアで10を作る' },
  // 中学年: 3桁の筆算、かけ算・わり算が加わる
  { grade: 3, pattern: null, label: '3年生 基本計算' },
  { grade: 3, pattern: 'hissan-add-triple', label: '3年生 3桁のたし算筆算' },
  { grade: 4, pattern: 'hissan-div-basic', label: '4年生 わり算の筆算' },
  { grade: 4, pattern: 'anzan-pair-sum', label: '4年生 ペアで10/100を作る' },
  { grade: 4, pattern: 'anzan-reorder', label: '4年生 順序入れ替え' },
  // 高学年: 暗算混合
  { grade: 5, pattern: 'anzan-mixed', label: '5年生 暗算混合' },
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
      timeout: 30000,
    });
    const out = result.stdout ?? '';
    const m = out.match(/### Result\n([\s\S]*?)(?:\n### |$)/);
    if (!m) return null;
    return m[1].trim().replace(/^"|"$/g, '');
  } catch (e) {
    console.error('playwright-cli execution failed:', e.message ?? e);
    return null;
  }
}

/** playwright-cli コマンドを実行（spawnSync でシェルを経由しない） */
function cli(...args) {
  try {
    spawnSync('playwright-cli', args, {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 10000,
    });
  } catch (e) {
    console.warn('playwright-cli command failed:', args[0], e.message ?? e);
  }
}

/** テンプレートリテラルの改行・余分な空白を除去して1行のJSにする */
function collapse(code) {
  return code.replace(/\n\s*/g, ' ').trim();
}

/**
 * パターン選択用JSコードを生成する。
 * ラジオボタンをクリックし、アコーディオン内の場合は展開してからクリックする。
 */
function buildPatternSelectionJs(pattern) {
  if (!pattern) return '';
  // clickRadio: ラジオボタンの親label/要素をクリック
  // expandAndRetry: アコーディオンを展開して再試行
  return collapse(`
    async function clickRadio(sel) {
      const el = await page.$(sel);
      if (!el) return false;
      await el.evaluate(e => { const lb = e.closest('label') || e.parentElement; if (lb) lb.click(); });
      return page.waitForFunction(
        (v) => document.querySelector('input[value="' + v + '"]:checked'),
        '${pattern}', { timeout: 3000 }
      ).then(() => true).catch(() => false);
    }
    if (!(await clickRadio('input[value="${pattern}"]'))) {
      const btn = await page.$('button[aria-expanded="false"]');
      if (btn) await btn.click();
      await page.waitForSelector('input[value="${pattern}"]', { timeout: 3000 })
        .catch((e) => console.warn('wait timed out:', e.message));
      await clickRadio('input[value="${pattern}"]');
    }
  `);
}

/**
 * 1シナリオを単一の rc() 呼び出しで計測する。
 * playwright-cli は run-code のたびにページを再ナビゲートするため、
 * 学年選択・パターン選択・高さ計測を1行のJSにまとめる。
 */
async function measureScenario(s) {
  const patternJs = buildPatternSelectionJs(s.pattern);

  // 学年選択 + パターン選択 + 推奨問題数選択 + 印刷モード計測（テンプレートリテラルで記述し1行化）
  // page.emulateMedia('print') で @media print CSS を適用し、実際の印刷レイアウトを計測する。
  // App.tsx の最外側 div が no-print クラスを持つため、計測前に上書きして非表示を防ぐ。
  const code = collapse(`
    const sel = await page.$('select');
    if (sel) {
      await sel.selectOption(String(${s.grade}));
      await page.waitForFunction(
        (g) => { const s = document.querySelector('select'); return s && s.value === String(g); },
        ${s.grade},
        { timeout: 3000 }
      ).catch((e) => console.warn('wait timed out:', e.message));
    }
    ${patternJs}
    await page.waitForTimeout(500);
    const recBtn = await page.$('button:has-text("推奨")');
    if (recBtn) await recBtn.click();
    await page.waitForTimeout(500);
    await page.waitForSelector('[data-a4-sheet]', { timeout: 5000 }).catch((e) => console.warn('wait timed out:', e.message));
    await page.addStyleTag({ content: '.no-print { display: block !important; }' });
    await page.emulateMedia({ media: 'print' });
    await page.waitForSelector('[data-a4-sheet]', { state: 'visible', timeout: 3000 }).catch((e) => console.warn('wait timed out:', e.message));
    const el = await page.$('[data-a4-sheet]');
    if (!el) { await page.emulateMedia({ media: null }); return '0'; }
    const b = await el.boundingBox();
    await page.emulateMedia({ media: null });
    return b ? String(Math.round(b.height)) : '0';
  `);

  const h = rc(code);
  const parsed = parseInt((h ?? '0').replace(/\D/g, ''), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function main() {
  console.log('\n📐 印刷レイアウトチェック');
  console.log('   URL: ' + BASE_URL);
  console.log('   A4高さ基準: ' + Math.round(A4_PX) + 'px (297mm @ 96dpi)\n');

  cli('open', BASE_URL);
  cli('resize', '1280', '900');
  // ページ読み込み完了を待つ（cli はページオブジェクトを返さないため rc() で確認）
  rc(
    collapse(`
    await page.waitForSelector('select', { timeout: 10000 });
    return 'ready';
  `)
  );

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
