import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

// A bounded foreground check. The preview and browser always close in finally.
const engine = process.argv.includes('--webkit') ? 'webkit' : 'chromium';
const root = resolve('dist');
const evidenceRoot = resolve('test/scratch/validation');
await mkdir(evidenceRoot, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!requestPath.startsWith('/preview/')) { response.writeHead(404).end(); return; }
    const path = resolve(root, requestPath.slice('/preview/'.length) || 'index.html');
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const file = (await stat(path)).isDirectory() ? resolve(path, 'index.html') : path;
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(file));
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const base = `http://127.0.0.1:${address.port}/preview/`;
const results = [];
let browser;
const check = async (name, action) => {
  await action(); results.push({ name, passed: true }); console.log(`PASS ${name}`);
};
try {
  browser = await (engine === 'webkit' ? webkit : chromium).launch({ headless: true, ...(process.env.SWAMP_BROWSER_EXECUTABLE ? { executablePath: process.env.SWAMP_BROWSER_EXECUTABLE } : {}) });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  // The site must work with all external network access blocked.
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  const page = await context.newPage();
  const errors = [], failedResources = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) failedResources.push({ url: response.url(), status: response.status() }); });
  page.on('requestfailed', request => { const reason = request.failure()?.errorText || ''; if (!/ERR_ABORTED|cancelled|canceled/i.test(reason)) failedResources.push({ url: request.url(), reason }); });
  const articles = page.locator('.post-card');
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await check('390px first screen includes product, search, first tweet and View on X', async () => {
    assert.equal(await page.title(), 'The Swamp · Top IdentityMD tweets');
    assert.equal(await articles.count(), 6);
    for (const target of [page.locator('h1'), page.getByRole('searchbox'), articles.first().locator('blockquote'), articles.first().getByRole('link', { name: /^View on X:/ })]) {
      const box = await target.boundingBox(); assert.ok(box && box.y >= 0 && box.y + box.height <= 844, `Outside first screen: ${await target.textContent()} ${JSON.stringify(box)}`);
    }
    assert.ok((await articles.first().getAttribute('data-post-id')) === '2107939454396567581');
    await page.screenshot({ path: `${evidenceRoot}/${engine}-390-first-screen.png`, fullPage: false });
  });
  await check('keyword search and recoverable empty state', async () => {
    await page.getByRole('searchbox').fill('mac app');
    assert.equal(await articles.count(), 1);
    assert.match(await articles.first().textContent(), /menu bar/);
    await page.getByRole('searchbox').fill('a deliberately unmatched search');
    assert.equal(await articles.count(), 0);
    assert.ok(await page.getByRole('heading', { name: 'No posts found.' }).isVisible());
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    assert.equal(await articles.count(), 6);
  });
  await check('native topic filter, combined search and topic-chip filter', async () => {
    await page.getByLabel('Topic', { exact: true }).selectOption('Building');
    assert.equal(await articles.count(), 2);
    await page.getByRole('searchbox').fill('mac');
    assert.equal(await articles.count(), 1);
    await page.getByRole('button', { name: 'Clear search', exact: true }).click();
    await page.getByLabel('Topic', { exact: true }).selectOption('All topics');
    await articles.first().getByRole('button', { name: 'Filter by Community', exact: true }).click();
    assert.equal(await articles.count(), 4);
    assert.equal(await page.getByLabel('Topic', { exact: true }).inputValue(), 'Community');
    await page.getByLabel('Topic', { exact: true }).selectOption('All topics');
  });
  await check('latest sorting and top ranking', async () => {
    await page.getByRole('button', { name: 'Latest', exact: true }).click();
    assert.equal(await articles.first().getAttribute('data-post-id'), '2116290108060275184');
    await page.getByRole('button', { name: 'Top tweets', exact: true }).click();
    assert.equal(await articles.first().getAttribute('data-post-id'), '2107939454396567581');
  });
  await check('bookmark save, saved route, reload persistence and removal', async () => {
    await articles.first().getByRole('button', { name: 'Save post by Adam', exact: true }).click();
    assert.equal(await articles.first().getByRole('button', { name: 'Unsave post by Adam', exact: true }).getAttribute('aria-pressed'), 'true');
    await page.getByRole('link', { name: 'Saved posts, 1', exact: true }).click();
    await page.getByRole('heading', { name: 'Saved posts', exact: true }).waitFor();
    assert.equal(await articles.count(), 1);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await articles.count(), 1);
    await page.locator('.skip-link').focus();
    await page.keyboard.press('Enter');
    assert.ok(await page.getByRole('heading', { name: 'Saved posts', exact: true }).isVisible());
    assert.equal(await page.locator(':focus').getAttribute('id'), 'feed');
    await articles.first().getByRole('button', { name: 'Unsave post by Adam', exact: true }).click();
    assert.equal(await articles.count(), 0);
    assert.ok(await page.getByRole('heading', { name: 'Keep the good ones.' }).isVisible());
    await page.waitForFunction(() => document.activeElement?.matches('.empty-state a'));
    await page.locator('.empty-state').getByRole('link', { name: 'Explore the feed' }).click();
    await page.getByRole('heading', { name: 'From the timeline', exact: true }).waitFor();
    assert.equal(await articles.count(), 6);
  });
  await check('load more appends remaining posts and moves focus to new content', async () => {
    await page.getByRole('button', { name: 'Load 6 more posts', exact: true }).click();
    assert.equal(await articles.count(), 12);
    assert.equal(await page.getByRole('button', { name: /^Load/ }).count(), 0);
    await page.waitForFunction(() => document.activeElement?.closest('[data-post-id]')?.getAttribute('data-post-id'));
  });
  await check('source links lead to real tweet permalinks and use safe new tabs', async () => {
    const links = await page.locator('.post-link').evaluateAll(elements => elements.map(link => ({ href: link.href, rel: link.rel, target: link.target })));
    assert.equal(links.length, 12);
    for (const link of links) { assert.match(link.href, /^https:\/\/x\.com\/[\w]+\/status\/\d+$/); assert.equal(link.target, '_blank'); assert.match(link.rel, /noreferrer/); }
  });
  await check('about dialog, Escape, focus containment and focus return', async () => {
    const trigger = page.getByRole('button', { name: 'Snapshot', exact: true });
    await trigger.click();
    assert.ok(await page.getByRole('dialog').isVisible());
    assert.ok(await page.getByText('How “Top tweets” works').isVisible());
    await page.screenshot({ path: `${evidenceRoot}/${engine}-about.png`, fullPage: false });
    await page.keyboard.press('Shift+Tab');
    assert.ok(await page.evaluate(() => !!document.activeElement?.closest('dialog')));
    for (let i = 0; i < 5; i++) { await page.keyboard.press('Tab'); assert.ok(await page.evaluate(() => !!document.activeElement?.closest('dialog'))); }
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(), 0);
    await trigger.evaluate(element => new Promise(resolve => requestAnimationFrame(() => resolve(element === document.activeElement))));
    assert.ok(await trigger.evaluate(element => element === document.activeElement));
    await trigger.click();
    await page.getByRole('button', { name: 'Close about the feed' }).click();
    assert.ok(await trigger.evaluate(element => element === document.activeElement));
    await trigger.click();
    await page.mouse.click(4, 4);
    assert.equal(await page.getByRole('dialog').count(), 0);
  });
  await check('keyboard skip link and visible focus', async () => {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(), 'Skip to the feed');
    const style = await page.locator(':focus').evaluate(element => ({ outline: getComputedStyle(element).outlineStyle, rect: element.getBoundingClientRect().toJSON() }));
    assert.equal(style.outline, 'solid'); assert.ok(style.rect.y >= 0);
    await page.screenshot({ path: `${evidenceRoot}/${engine}-keyboard.png`, fullPage: false });
    await page.keyboard.press('Enter');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'feed');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'search-posts');
    await page.screenshot({ path: `${evidenceRoot}/${engine}-search-focus.png`, fullPage: false });
  });
  await check('320, 390, 768, 1024 and 1440px reflow without overflow', async () => {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width > 900 ? 1000 : 844 });
      await page.evaluate(() => scrollTo(0, 0));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
      const clipped = await page.locator('input, select, .post-link, .post-author').evaluateAll(elements => elements.filter(element => { const r = element.getBoundingClientRect(); return r.x < 0 || r.right > innerWidth; }).map(element => element.outerHTML));
      assert.deepEqual(clipped, [], `Clipped controls at ${width}px`);
      await page.screenshot({ path: `${evidenceRoot}/${engine}-${width}.png`, fullPage: false });
    }
  });
  await check('automated WCAG 2.2 AA scan of feed and dialog', async () => {
    const feed = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    await writeFile(`${evidenceRoot}/${engine}-axe-feed.json`, JSON.stringify({ violations: feed.violations, passes: feed.passes.map(item => item.id), incomplete: feed.incomplete.map(item => item.id) }, null, 2));
    assert.deepEqual(feed.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);
    const pairs = await page.evaluate(() => {
      const luminance = color => {
        const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(channel => { const value = channel / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; });
        return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
      };
      return ['html', '.post-card blockquote', '.post-meta', '.topic-tag', '.button-primary', '.hero-caption', '.project-section p'].map(selector => {
        const element = document.querySelector(selector), foreground = getComputedStyle(element).color;
        let parent = element, background = 'rgba(0, 0, 0, 0)';
        while (parent && background === 'rgba(0, 0, 0, 0)') { background = getComputedStyle(parent).backgroundColor; parent = parent.parentElement; }
        const a = luminance(foreground), b = luminance(background);
        return { selector, foreground, background, ratio: Math.round(((Math.max(a, b) + .05) / (Math.min(a, b) + .05)) * 100) / 100 };
      });
    });
    assert.ok(pairs.every(pair => pair.ratio >= 4.5));
    await writeFile(`${evidenceRoot}/${engine}-contrast.json`, JSON.stringify(pairs, null, 2));
    await page.getByRole('button', { name: 'Snapshot', exact: true }).click();
    const dialog = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    await writeFile(`${evidenceRoot}/${engine}-axe-dialog.json`, JSON.stringify({ violations: dialog.violations, passes: dialog.passes.map(item => item.id), incomplete: dialog.incomplete.map(item => item.id) }, null, 2));
    assert.deepEqual(dialog.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), []);
    await page.keyboard.press('Escape');
  });
  await check('200% text enlargement keeps controls reachable', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addStyleTag({ content: ':root{font-size:200% !important}' });
    await page.screenshot({ path: `${evidenceRoot}/${engine}-text-200.png`, fullPage: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), JSON.stringify(await page.locator('body *').evaluateAll(elements => elements.filter(element => { const r = element.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 1 && !element.classList.contains('hero-art'); }).map(element => element.tagName + '.' + element.className))));
    await page.goto(base, { waitUntil: 'networkidle' });
  });
  await check('corrupt bookmarks recover safely', async () => {
    await page.evaluate(() => localStorage.setItem('the-swamp:saved:v1', '{invalid-json'));
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await articles.count(), 6);
    assert.equal(await page.getByRole('link', { name: 'Saved posts, 0', exact: true }).count(), 1);
    assert.equal(await page.locator('.storage-notice').count(), 0);
  });
  await check('storage denial keeps session bookmarks usable and explains persistence', async () => {
    const denied = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await denied.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
      Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
    });
    const deniedPage = await denied.newPage();
    await deniedPage.goto(base, { waitUntil: 'networkidle' });
    assert.ok(await deniedPage.getByText('Browser storage is unavailable. Bookmarks will last for this visit.').isVisible());
    await deniedPage.locator('.post-card').first().getByRole('button', { name: 'Save post by Adam', exact: true }).click();
    await deniedPage.getByRole('link', { name: 'Saved posts, 1', exact: true }).click();
    await deniedPage.getByRole('heading', { name: 'Saved posts', exact: true }).waitFor();
    assert.equal(await deniedPage.locator('.post-card').count(), 1);
    await denied.close();
  });
  await check('zero script errors or missing production resources with external network blocked', async () => {
    // Force below-fold lazy avatars to load before checking every bundled image.
    await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    assert.deepEqual(errors, []); assert.deepEqual(failedResources, []);
    assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
  });
  console.log(`${results.length} interaction groups passed in ${engine}.`);
} catch (error) {
  results.push({ name: 'execution', passed: false, error: String(error.stack || error) });
  console.error(error); process.exitCode = 1;
} finally {
  await writeFile(`${evidenceRoot}/interactions-${engine}.json`, JSON.stringify({ engine, results, passed: results.every(result => result.passed) }, null, 2));
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
