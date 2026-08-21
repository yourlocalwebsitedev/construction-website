import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3001/#/', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/trust-desktop.png' });
  await browser.close();
})();
