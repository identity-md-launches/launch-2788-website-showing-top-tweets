import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, extname, dirname } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
const html = await readFile(join(root, 'index.html'), 'utf8');
const checked = new Set();
const suffixes = new Set(['.html', '.css', '.js', '.svg', '.json']);
async function filesIn(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) files.push(...await filesIn(path));
    else files.push(path);
  }
  return files;
}

assert.match(html, /<title>[^<]+<\/title>/);
for (const pattern of [/name="description"/, /rel="icon"/, /property="og:title"/, /property="og:image"/]) assert.match(html, pattern);
assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/, 'Root-relative assets would fail on gateway subpaths.');
for (const file of await filesIn(root)) {
  assert.ok(!/node_modules|\.tgz$|\.map$/.test(file), `Unexpected packaged dependency: ${file}`);
  if (!suffixes.has(extname(file))) continue;
  const content = await readFile(file, 'utf8');
  for (const match of content.matchAll(/(?:src|href)=["']([^"']+)["']|url\(["']?([^\s)'";]+)["']?\)/g)) {
    const reference = match[1] || match[2];
    if (/^(https?:|data:|#|mailto:)/.test(reference)) continue;
    assert.ok(!reference.startsWith('/'), `Root-relative reference: ${file}: ${reference}`);
    const target = resolve(dirname(file), reference.split(/[?#]/)[0]);
    assert.ok(target.startsWith(root), `Asset escapes export: ${reference}`);
    assert.ok((await stat(target)).isFile(), `Missing local asset: ${target}`);
    checked.add(target);
  }
}
const all = await filesIn(root);
const bytes = (await Promise.all(all.map(file => stat(file)))).reduce((sum, value) => sum + value.size, 0);
assert.ok(bytes < 2400000, `Export exceeds its 2.4 MB path budget: ${bytes}`);
assert.ok((await stat(join(root, 'art/social.png'))).size > 1000, 'Social card is missing or empty.');
console.log(JSON.stringify({ passed: true, files: all.length, resolvedAssets: checked.size, exportBytes: bytes, relativeAssets: true, metadata: 'title, favicon, description, og:title, og:image' }, null, 2));
