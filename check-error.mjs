import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // コンソールメッセージをキャプチャ
  page.on('console', (msg) => {
    console.log(`[BROWSER CONSOLE ${msg.type()}]:`, msg.text());
  });

  // エラーをキャプチャ
  page.on('pageerror', (error) => {
    console.error('[BROWSER ERROR]:', error.message);
    console.error('[STACK]:', error.stack);
  });

  try {
    console.log('Opening http://localhost:5174/...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

    console.log('\nPage loaded successfully!');
    console.log('Waiting 5 seconds to see if any errors occur...');
    await page.waitForTimeout(5000);

    // 問題生成を試す
    console.log('\nTrying to generate problems...');

    // 2年生を選択
    await page.click('select[id*="grade"]');
    await page.selectOption('select[id*="grade"]', '2');

    // 筆算を選択
    await page.click('select[id*="pattern"]');
    const options = await page.$$eval('select[id*="pattern"] option', options =>
      options.map(opt => ({ value: opt.value, text: opt.textContent }))
    );
    console.log('Available patterns:', options);

    const hissanOption = options.find(opt => opt.text.includes('筆算'));
    if (hissanOption) {
      await page.selectOption('select[id*="pattern"]', hissanOption.value);
      console.log(`Selected: ${hissanOption.text}`);

      // 問題数を30に
      await page.fill('input[type="number"]', '30');

      // 列数を3に
      const layoutSelect = await page.$('select:has(option:text("1列"))');
      if (layoutSelect) {
        await layoutSelect.selectOption('3');
      }

      // 生成ボタンをクリック
      await page.click('button:has-text("問題を生成")');

      console.log('\nWaiting for problems to generate...');
      await page.waitForTimeout(3000);

      // エラーメッセージがあるかチェック
      const errorMessage = await page.$('text=エラーが発生しました');
      if (errorMessage) {
        console.error('ERROR MESSAGE FOUND ON PAGE!');
        const errorText = await errorMessage.textContent();
        console.error('Error text:', errorText);
      } else {
        console.log('No error message found - page seems OK!');
      }
    }

    console.log('\nKeeping browser open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await browser.close();
  }
})();
