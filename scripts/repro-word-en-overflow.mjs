#!/usr/bin/env node
/**
 * English Word Problems の A4 オーバーフロー実測スクリプト。
 *
 *   node scripts/repro-word-en-overflow.mjs [grade] [cols] [samples] [url]
 *
 * 学年を一旦別学年へ切り替えてから対象学年へ戻すことで毎回フレッシュな
 * 問題を生成し、アプリが自動設定する推奨問題数のまま @media print 下の
 * シート実測高さをサンプリングする（問題数ドロップダウンは操作しない）。
 */
import { chromium } from '@playwright/test';

const GRADE = Number(process.argv[2] ?? 4);
const COLS = Number(process.argv[3] ?? 3);
const SAMPLES = Number(process.argv[4] ?? 40);
const BASE_URL = process.argv[5] ?? 'http://localhost:5174/';
const OTHER_GRADE = GRADE === 1 ? 2 : 1; // 再生成トリガ用の別学年
const A4_PX = 297 * (96 / 25.4); // 1122.5px
const TOLERANCE_PX = 5;

async function selectWordEn(page, grade, cols) {
  await page.$('select').then((s) => s.selectOption(String(grade)));
  await page.waitForTimeout(80);
  const radio = await page.$('input[value="word-en"]');
  await radio.evaluate((el) =>
    (el.closest('label') || el.parentElement).click()
  );
  await page.waitForTimeout(120);
  const btn = await page.$(`button:has-text("${cols}列")`);
  if (btn) await btn.click();
  await page.waitForTimeout(120);
}

async function measure(page) {
  await page.emulateMedia({ media: 'print' });
  await page.addStyleTag({ content: '.no-print{display:block !important;}' });
  await page.waitForTimeout(30);
  const data = await page.evaluate(() => {
    const sheet = document.querySelector('[data-a4-sheet]');
    if (!sheet) return null;
    const h = Math.max(
      sheet.getBoundingClientRect().height,
      sheet.scrollHeight
    );
    const grid = document.querySelector('[data-problem-grid]');
    const count = grid ? grid.children.length : 0;
    let maxCell = 0;
    if (grid) {
      for (const cell of grid.children) {
        maxCell = Math.max(maxCell, cell.getBoundingClientRect().height);
      }
    }
    return { h, count, maxCell };
  });
  await page.emulateMedia({ media: null });
  return data;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser
    .newContext({ viewport: { width: 1280, height: 900 } })
    .then((c) => c.newPage());
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('select');

  const heights = [];
  let overflowCount = 0;
  let usedCount = 0;
  for (let i = 0; i < SAMPLES; i++) {
    await page.$('select').then((s) => s.selectOption(String(OTHER_GRADE)));
    await page.waitForTimeout(50);
    await selectWordEn(page, GRADE, COLS);
    const m = await measure(page);
    if (!m) {
      console.log(`#${i}: 計測失敗`);
      continue;
    }
    usedCount = m.count;
    const over = m.h > A4_PX + TOLERANCE_PX;
    if (over) overflowCount++;
    heights.push(m.h);
    console.log(
      `#${String(i).padStart(2)}: sheet=${m.h.toFixed(0)}px (${((m.h / A4_PX) * 100).toFixed(0)}% A4) q=${m.count} maxCell=${m.maxCell.toFixed(0)}px ${over ? '❌OVERFLOW' : '✅'}`
    );
  }

  heights.sort((a, b) => a - b);
  console.log('\n--- 集計 ---');
  console.log(
    `grade=${GRADE} cols=${COLS} count=${usedCount}  A4=${A4_PX.toFixed(0)}px(+${TOLERANCE_PX})`
  );
  console.log(`サンプル数: ${heights.length}`);
  console.log(
    `min=${heights[0]?.toFixed(0)} median=${heights[Math.floor(heights.length / 2)]?.toFixed(0)} max=${heights[heights.length - 1]?.toFixed(0)}`
  );
  console.log(
    `オーバーフロー: ${overflowCount}/${heights.length} (${((overflowCount / heights.length) * 100).toFixed(0)}%)`
  );

  await browser.close();
}

main();
