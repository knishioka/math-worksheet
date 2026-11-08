#!/usr/bin/env node
/**
 * 教材ごとの A4 実測スクリプト（問題数の上限を決めるときに使う）。
 *
 *   npm run dev   # 別ターミナルで http://localhost:5174/ を起動しておく
 *   node scripts/measure-a4-counts.mjs '[{"grade":4,"pattern":"div-with-remainder","cols":2,"count":16}]' [samples] [baseUrl]
 *
 * 各組み合わせを URL パラメータで開き、@media print を適用した状態で
 * [data-a4-sheet] の高さと列のはみ出しを計測する。「作り直す」ボタンで
 * 問題を作り直しながら samples 回サンプリングし、最大高さと超過回数を出す。
 *
 * 注意: URL の count は getEffectiveCounts の最大値で丸められる。上限を
 * 探るときは一時的に PATTERN_COUNT_OVERRIDES の maxCounts を広げてから測る。
 */
import { chromium } from '@playwright/test';

const combos = JSON.parse(process.argv[2] ?? '[]');
const SAMPLES = Number(process.argv[3] ?? 4);
const BASE = process.argv[4] ?? 'http://localhost:5174/';
const A4_PX = 297 * (96 / 25.4);

if (combos.length === 0) {
  console.error("usage: node scripts/measure-a4-counts.mjs '<json combos>'");
  process.exit(1);
}

async function measure(page) {
  await page.emulateMedia({ media: 'print' });
  await page.addStyleTag({ content: '.no-print{display:block !important;}' });
  await page.waitForTimeout(30);
  const data = await page.evaluate(() => {
    const sheet = document.querySelector('[data-a4-sheet]');
    if (!sheet) return null;
    const grid = document.querySelector('[data-problem-grid]');
    let maxCell = 0;
    let clipped = false;
    if (grid) {
      for (const cell of grid.children) {
        maxCell = Math.max(maxCell, cell.getBoundingClientRect().height);
        if (cell.scrollWidth > cell.clientWidth + 1) clipped = true;
      }
    }
    return {
      h: Math.max(sheet.clientHeight, sheet.scrollHeight),
      count: grid ? grid.children.length : 0,
      maxCell,
      clipped,
    };
  });
  await page.emulateMedia({ media: null });
  return data;
}

const browser = await chromium.launch();
const page = await browser
  .newContext({ viewport: { width: 1400, height: 1000 } })
  .then((context) => context.newPage());

for (const { grade, pattern, cols, count } of combos) {
  const url = `${BASE}?grade=${grade}&type=basic&pattern=${pattern}&cols=${cols}&count=${count}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-a4-sheet]');
  const heights = [];
  let over = 0;
  let maxCell = 0;
  let actualCount = 0;
  for (let i = 0; i < SAMPLES; i++) {
    if (i > 0) {
      await page.click('button:has-text("同じ教材で問題を作り直す")');
      await page.waitForTimeout(80);
    }
    const m = await measure(page);
    if (!m) continue;
    actualCount = m.count;
    heights.push(m.h);
    maxCell = Math.max(maxCell, m.maxCell);
    if (m.h > A4_PX + 1 || m.clipped) over++;
  }
  heights.sort((a, b) => a - b);
  const max = heights.at(-1) ?? 0;
  console.log(
    `${pattern.padEnd(36)} cols=${cols} count=${String(count).padStart(2)} (q=${actualCount}) ` +
      `max=${max.toFixed(0)}px (${((max / A4_PX) * 100).toFixed(0)}% A4) ` +
      `maxCell=${maxCell.toFixed(0)}px over=${over}/${heights.length}`
  );
}
await browser.close();
