// Screenshot pages for visual review:  node scripts/shots.mjs [route ...]
//   routes are hash paths, e.g. "" (home), "binomial", "division"
// Starts its own dev server on a free port and writes shots/<route>-desktop.png and -mobile.png (full page).
// Add :solve to a route (e.g. "binomial:solve") to also open every hint and solution.
import {mkdirSync} from 'node:fs';
import {chromium} from 'playwright';
import {createServer} from 'vite';

const routes = process.argv.slice(2);
if (!routes.length) routes.push('');
const server = await createServer({logLevel: 'error', server: {port: 4300 + Math.floor(Math.random() * 500)}});
await server.listen();
const port = server.config.server.port;
mkdirSync('shots', {recursive: true});
const browser = await chromium.launch();
const errors = [];
try {
  for (const spec of routes) {
    const [route, mode] = spec.split(':');
    for (const [name, viewport] of [
      ['desktop', {width: 1360, height: 900}],
      ['mobile', {width: 390, height: 844}],
    ]) {
      const page = await browser.newPage({viewport, deviceScaleFactor: name === 'mobile' ? 2 : 1});
      page.on('console', (m) => m.type() === 'error' && errors.push(`${route}: ${m.text()}`));
      page.on('pageerror', (e) => errors.push(`${route}: ${e.message}`));
      await page.goto(`http://localhost:${port}/#/${route}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      if (mode === 'solve') {
        for (const b of await page.getByRole('button', {name: 'Show solution'}).all()) await b.click();
        for (let i = 0; i < 4; i++) for (const b of await page.getByRole('button', {name: /hint/i}).all()) await b.click().catch(() => {});
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) errors.push(`${route} ${name}: page scrolls sideways by ${overflow}px`);
      await page.screenshot({path: `shots/${route || 'home'}${mode ? '-' + mode : ''}-${name}.png`, fullPage: true});
      await page.close();
    }
  }
} finally {
  await browser.close();
  await server.close();
}
console.log(errors.length ? 'PROBLEMS:\n' + errors.join('\n') : 'no console errors, no sideways scroll');
