// Video check:  node scripts/video-check.mjs [base-url]     (default: serves ./dist locally)
// On every concept page, on a desktop and an emulated phone, plays the video for a moment and checks
// that it decodes, has captions, and fits the screen. Uses installed Google Chrome, because the
// Chromium that ships with Playwright cannot decode H.264.
import {mkdirSync} from 'node:fs';
import {chromium, devices} from 'playwright';
import {preview} from 'vite';

let base = process.argv[2];
let server;
if (!base) {
  server = await preview({logLevel: 'error', preview: {port: 4990}});
  base = server.resolvedUrls.local[0];
}
base = base.replace(/\/?$/, '/');
mkdirSync('shots/video', {recursive: true});
const browser = await chromium.launch({channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required']});
const SCREENS = {desktop: {viewport: {width: 1366, height: 800}}, phone: devices['iPhone 13']};
let bad = 0;
try {
  for (const route of ['binomial', 'division', 'rational', 'identities', 'inequalities']) {
    for (const [name, device] of Object.entries(SCREENS)) {
      const page = await (await browser.newContext({...device})).newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()}: ${r.url()}`));
      await page.goto(`${base}?v=${Date.now()}#/${route}`, {waitUntil: 'networkidle'});
      const video = page.locator('.watch video');
      if (!(await video.count())) {
        bad++;
        console.log(route, name, 'NO VIDEO SECTION', errors);
        continue;
      }
      await video.scrollIntoViewIfNeeded();
      const info = await video.evaluate(async (v) => {
        v.muted = true;
        v.textTracks[0].mode = 'showing';
        await v.play().catch((e) => (v.dataset.err = e.message));
        const t0 = Date.now();
        while (v.currentTime < 1.5 && Date.now() - t0 < 15000) await new Promise((r) => setTimeout(r, 100));
        v.currentTime = v.duration / 2; // seeking needs byte-range requests to work
        await new Promise((r) => v.addEventListener('seeked', r, {once: true}));
        await new Promise((r) => setTimeout(r, 800));
        const box = v.getBoundingClientRect();
        return {
          err: v.dataset.err ?? null,
          time: Math.round(v.currentTime),
          minutes: +(v.duration / 60).toFixed(2),
          size: `${v.videoWidth}x${v.videoHeight}`,
          cues: v.textTracks[0].cues?.length ?? 0,
          shown: `${Math.round(box.width)}x${Math.round(box.height)}`,
          fits: box.left >= 0 && box.right <= window.innerWidth + 1,
          sideways: document.documentElement.scrollWidth - window.innerWidth,
        };
      });
      await page.screenshot({path: `shots/video/${route}-${name}.png`});
      const ok = !info.err && info.time > 60 && info.size === '1920x1080' && info.cues > 10 && info.fits && info.sideways <= 1 && !errors.length;
      if (!ok) bad++;
      console.log(ok ? 'ok ' : 'BAD', route, name, JSON.stringify(info), errors.length ? errors : '');
      await page.context().close();
    }
  }
} finally {
  await browser.close();
  await server?.close();
}
process.exit(bad ? 1 : 0);
