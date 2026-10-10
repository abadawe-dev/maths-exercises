// Phone audit:  node scripts/mobile.mjs [route ...]      (default: every route)
// Emulates touch phones (iPhone 13, and a narrow 360 px Android), then for each page:
//   - layout: sideways scroll, elements poking out of the viewport, tiny tap targets, tiny text
//   - function: taps through every exercise type (typed answer + keypad, choice, proof step, hint, solution)
//     and every widget control, watching for script errors and layout breaking afterwards
// Writes viewport-sized screenshots to shots/mobile/<route>-<device>-<n>.png for a visual check.
import {mkdirSync} from 'node:fs';
import {chromium, devices} from 'playwright';
import {createServer} from 'vite';

const PHONES = {
  iphone: devices['iPhone 13'],
  narrow: {...devices['Galaxy S9+'], viewport: {width: 360, height: 740}},
};
const routes = process.argv.slice(2);
if (!routes.length) routes.push('', 'binomial', 'division', 'rational', 'identities', 'inequalities');

const server = await createServer({logLevel: 'error', server: {port: 4800 + Math.floor(Math.random() * 150)}});
await server.listen();
const base = `http://localhost:${server.config.server.port}/#/`;
mkdirSync('shots/mobile', {recursive: true});
const browser = await chromium.launch();
const problems = [];

const audit = (page) =>
  page.evaluate(() => {
    const vw = window.innerWidth;
    const out = [];
    const label = (el) =>
      `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} "${(el.textContent || '').trim().slice(0, 40)}"`;
    if (document.documentElement.scrollWidth > vw + 1) out.push(`page scrolls sideways (${document.documentElement.scrollWidth}px wide)`);
    // An element may be wider than the screen only if an ancestor scrolls it horizontally on purpose.
    const scrolls = (el) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'auto' || o === 'scroll' || o === 'hidden') return true;
      }
      return false;
    };
    for (const el of document.querySelectorAll('main *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if ((r.right > vw + 2 || r.left < -2) && !scrolls(el)) out.push(`sticks out of the screen: ${label(el)}`);
    }
    for (const el of document.querySelectorAll('main button, main a, main input, main select, main [role=button]')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (el.matches('input[type=range]') ? r.height < 24 : r.height < 30 || r.width < 30) {
        out.push(`tap target too small (${Math.round(r.width)}x${Math.round(r.height)}): ${label(el)}`);
      }
    }
    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
    const small = new Set();
    while (walker.nextNode()) {
      const el = walker.currentNode.parentElement;
      if (!walker.currentNode.textContent.trim() || el.closest('.katex, svg')) continue;
      if (parseFloat(getComputedStyle(el).fontSize) < 11.5) small.add(label(el));
    }
    for (const s of small) out.push(`text under 11.5px: ${s}`);
    for (const el of document.querySelectorAll('main svg text')) {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.height < 9) small.add(`svg text "${el.textContent.trim().slice(0, 30)}" is ${r.height.toFixed(1)}px tall`);
    }
    return [...new Set(out)].slice(0, 25);
  });

try {
  for (const route of routes) {
    for (const [phone, device] of Object.entries(PHONES)) {
      const ctx = await browser.newContext({...device});
      const page = await ctx.newPage();
      page.setDefaultTimeout(4000);
      const tag = `${route || 'home'} [${phone}]`;
      const note = (m) => problems.push(`${tag}: ${m}`);
      page.on('pageerror', (e) => note(`script error: ${e.message}`));
      page.on('console', (m) => m.type() === 'error' && note(`console: ${m.text().slice(0, 160)}`));
      await page.goto(base + route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(400);
      (await audit(page)).forEach(note);

      if (route) {
        // typed answer: tap the box, use the keypad, check
        const input = page.locator('.field:has(.keypad) input').first();
        if (await input.count()) {
          const card = page.locator('.exercise:has(.keypad)').first();
          await input.scrollIntoViewIfNeeded();
          await input.tap();
          await input.fill('x');
          await card.locator('.field:has(.keypad)').first().locator('.keypad button').first().tap();
          if ((await input.inputValue()) !== 'x^2') note('keypad did not insert into the answer box');
          await card.getByRole('button', {name: 'Check'}).tap();
          await page.waitForTimeout(150);
          if (!(await card.locator('.field.wrong, .field.right').count())) note('Check gave no feedback');
        }
        // choice: tap an option
        const opt = page.locator('.exercise:not(:has(.proof)) .option').first();
        if (await opt.count()) {
          await opt.scrollIntoViewIfNeeded();
          await opt.tap();
          await page.waitForTimeout(100);
          if (!(await page.locator('.exercise:not(:has(.proof)) .verdict').count())) note('choice gave no feedback');
        }
        // proof: tap every option of the first step until it advances
        const proof = page.locator('.exercise:has(.proof)').first();
        if (await proof.count()) {
          await proof.scrollIntoViewIfNeeded();
          const n = await proof.locator('.option').count();
          for (let i = 0; i < n && !(await proof.locator('.proof-lines li').count()); i++) {
            const b = proof.locator('.option:not(:disabled)').first();
            if (await b.count()) await b.tap();
          }
          if (!(await proof.locator('.proof-lines li').count())) note('proof step never advanced');
        }
        // hints and solutions everywhere, then widgets
        // each tap renames or removes the button, so always take the first one still on offer
        for (let k = 0; k < 400 && (await page.getByRole('button', {name: /hint/i}).count()); k++) {
          await page.getByRole('button', {name: /hint/i}).first().tap({timeout: 1500}).catch(() => {});
        }
        for (let k = 0; k < 200 && (await page.getByRole('button', {name: 'Show solution'}).count()); k++) {
          await page.getByRole('button', {name: 'Show solution'}).first().tap({timeout: 1500}).catch(() => {});
        }
        for (const r of await page.locator('.widget input[type=range]').all()) {
          await r.scrollIntoViewIfNeeded();
          const box = await r.boundingBox();
          if (box) await page.touchscreen.tap(box.x + box.width * 0.8, box.y + box.height / 2);
        }
        for (const b of await page.locator('.widget button:not(:disabled)').all()) await b.tap({timeout: 1500}).catch(() => {});
        await page.waitForTimeout(300);
        (await audit(page)).forEach((m) => note(`after interacting: ${m}`));
      }

      // viewport-sized frames down the page
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      const vh = device.viewport.height;
      const stops = route ? [0, 0.12, 0.3, 0.5, 0.7, 0.9] : [0, 0.5, 1];
      let i = 0;
      for (const s of stops) {
        await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, Math.min(height - vh, s * height)));
        await page.waitForTimeout(120);
        await page.screenshot({path: `shots/mobile/${route || 'home'}-${phone}-${i++}.png`});
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  await server.close();
}
const unique = [...new Set(problems)];
console.log(unique.length ? `${unique.length} PROBLEMS\n` + unique.join('\n') : 'mobile audit clean');
process.exit(unique.length ? 1 : 0);
