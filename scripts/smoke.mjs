// End-to-end smoke test against a running site:  node scripts/smoke.mjs <base-url>
// Opens the first concept, answers one exercise wrongly then correctly, and checks progress is recorded.
import {chromium} from 'playwright';

const base = (process.argv[2] ?? 'http://localhost:5173/').replace(/\/?$/, '/');
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(base);
await page.getByRole('link', {name: /Concept 1/}).first().click();
await page.waitForSelector('.exercise');
const first = page.locator('.exercise').first();
await first.locator('input').fill('20');
await first.getByRole('button', {name: 'Check'}).click();
await first.locator('.field.wrong').waitFor();
await first.locator('input').fill('21');
await first.getByRole('button', {name: 'Check'}).click();
await first.locator('.verdict.right').waitFor();
const solved = await page.locator('.topbar-progress').innerText();
await browser.close();
if (errors.length || !solved.startsWith('1 /')) {
  console.error('SMOKE FAILED', {solved, errors});
  process.exit(1);
}
console.log('smoke ok:', base, '-', solved);
