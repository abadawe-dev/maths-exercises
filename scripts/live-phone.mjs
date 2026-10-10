// Quick phone check of a deployed site:  node scripts/live-phone.mjs <base-url>
// Loads every page on an emulated iPhone, counts exercises and widgets, and reports script errors,
// failed requests and sideways scrolling.
import {chromium, devices} from 'playwright';

const base = (process.argv[2] ?? 'https://abadawe-dev.github.io/maths-exercises/').replace(/\/?$/, '/');
const browser = await chromium.launch();
const ctx = await browser.newContext({...devices['iPhone 13']});
let bad = 0;
for (const route of ['', 'binomial', 'division', 'rational', 'identities', 'inequalities']) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('requestfailed', (r) => errors.push('failed: ' + r.url()));
  page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()}: ${r.url()}`));
  await page.goto(`${base}?v=${Date.now()}#/${route}`, {waitUntil: 'networkidle'});
  const info = await page.evaluate(() => ({
    title: document.title,
    exercises: document.querySelectorAll('.exercise').length,
    widgets: document.querySelectorAll('.widget').length,
    cards: document.querySelectorAll('.concept-card').length,
    sideways: document.documentElement.scrollWidth - window.innerWidth,
  }));
  if (errors.length || info.sideways > 1) bad++;
  console.log(route || 'home', JSON.stringify(info), errors.length ? errors : 'ok');
  await page.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
