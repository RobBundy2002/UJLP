const assert = require('assert/strict');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const build = path.resolve(__dirname, '../build');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
const server = http.createServer((req, res) => {
    const file = path.resolve(build, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(build + path.sep) && file !== build) { res.writeHead(403).end(); return; }
    const target = fs.existsSync(file) && fs.statSync(file).isFile() ? file : path.join(build, 'index.html');
    res.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
    fs.createReadStream(target).pipe(res);
});

(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const slug of ['unequalopportunity', 'schoolhousesecrets']) {
            const manuscript = require(`../src/Data/articleTexts/${slug}.json`);
            const refs = manuscript.sections.flatMap(s => s.paragraphs.flatMap(p => p.filter(t => t.note).map(t => t.note)));
            assert.deepEqual([...new Set(refs)].sort(), Object.keys(manuscript.footnotes).sort());
            assert.equal(Object.keys(manuscript.footnotes).length, slug === 'unequalopportunity' ? 54 : 34);
            await page.goto(`${base}/${slug}`, {waitUntil:'domcontentloaded'});
            console.log('Checking', slug);
            await page.locator('.pdf-object').waitFor();
            assert.equal(await page.getByRole('tab', { name: 'Original PDF', exact: true }).getAttribute('aria-selected'), 'true');
            await page.getByRole('tab', { name: 'Read online', exact: true }).click();
            await page.locator('.article-reader-text').waitFor();
            assert.equal(await page.locator('.article-endnotes li').count(), Object.keys(manuscript.footnotes).length);
            const toc = page.locator('.article-desktop-contents');
            await toc.getByRole('button', { name: manuscript.sections[1].title, exact: true }).click();
            await page.waitForFunction(id => document.getElementById(id).getBoundingClientRect().top < 190, `${slug}-section-2`);
            assert.equal(await toc.getByRole('button', { name: manuscript.sections[1].title, exact: true }).getAttribute('aria-current'), 'location');
            await page.screenshot({ animations: 'disabled', path: `/tmp/ujlp-reader-${slug}.png` });
            assert(await toc.evaluate(el => el.getBoundingClientRect().top >= 90 && el.getBoundingClientRect().top < 190), 'Desktop contents must stay visible while reading');
            const firstRef = page.getByRole('button', { name: 'Read footnote 1', exact: true });
            await firstRef.click();
            const dialog = page.getByRole('dialog');
            await dialog.waitFor({ state: 'visible' });
            assert((await dialog.innerText()).includes(manuscript.footnotes['1'].slice(0, 45)));
            if (slug === 'schoolhousesecrets') assert.equal(await dialog.locator('a').first().getAttribute('href'), 'https://www.pewresearch.org/social-trends/2022/06/28/americans-complex-views-on-gender-identity-and-transgender-issues');
            await page.screenshot({ animations: 'disabled', path: `/tmp/ujlp-footnote-${slug}.png` });
            await page.keyboard.press('Escape');
            await dialog.waitFor({ state: 'hidden' });
            assert(await firstRef.evaluate(el => el === document.activeElement));
            await page.getByRole('tab', { name: 'Original PDF', exact: true }).click();
            await page.locator('.pdf-object').waitFor();
            assert.equal(await page.locator('.pdf-object').getAttribute('data'), manuscript.sourcePdf);
            await page.getByRole('tab', { name: 'Original PDF', exact: true }).press('ArrowLeft');
            await page.locator('.article-reader-text').waitFor();
            await page.setViewportSize({ width: 390, height: 844 });
            await page.locator('.article-mobile-contents summary').click();
            await page.locator('.article-mobile-contents').getByRole('button', { name: manuscript.sections[2].title, exact: true }).click();
            assert.equal(await page.locator('.article-mobile-contents').getAttribute('open'), null);
            assert(await page.locator('.article-reading-room').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
            await page.getByRole('button', { name: 'Read footnote 1', exact: true }).click();
            await dialog.waitFor({ state: 'visible' });
            assert(await dialog.evaluate(el => el.getBoundingClientRect().width <= window.innerWidth));
            await page.screenshot({ animations: 'disabled', path: `/tmp/ujlp-mobile-footnote-${slug}.png` });
            await dialog.getByRole('button', { name: 'Close citation preview' }).click();
            await page.setViewportSize({ width: 1440, height: 1000 });
        }
        await page.goto(`${base}/journal/issue/2026-1`, {waitUntil:'domcontentloaded'});
        await page.locator('.issue-landing-cover').waitFor();
        assert.equal(await page.locator('.issue-edition-list li').count(), 2);
        const download = page.getByRole('link', { name: 'Download complete issue' });
        const response = await page.request.get(base + await download.getAttribute('href'));
        assert.equal(response.status(), 200);
        assert((await response.body()).subarray(0, 5).equals(Buffer.from('%PDF-')));
        await page.screenshot({ animations: 'disabled', path: '/tmp/ujlp-issue-desktop.png', fullPage: true });
        await page.setViewportSize({ width: 390, height: 844 });
        assert(await page.locator('.issue-landing-intro').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
        await page.screenshot({ animations: 'disabled', path: '/tmp/ujlp-issue-mobile.png', fullPage: true });
        for (const width of [320, 375, 390, 430, 768]) {
            await page.setViewportSize({ width, height: 844 });
            const geometry = await page.locator('.jh-issue').evaluate(root => {
                const selectors = ['.issue-edition-hero h1', '.issue-landing-cover', '.issue-landing-overview', '.issue-edition-featured', '.issue-edition-contents'];
                return selectors.map(selector => {
                    const element = root.querySelector(selector);
                    const rect = element.getBoundingClientRect();
                    return { selector, left: rect.left, right: rect.right, center: rect.left + rect.width / 2, overflow: element.scrollWidth > element.clientWidth + 1 };
                });
            });
            for (const item of geometry) {
                assert(Math.abs(item.center - width / 2) <= 2, `${item.selector} off-center at ${width}px: ${JSON.stringify(item)}`);
                assert(item.left >= -1 && item.right <= width + 1, `${item.selector} exceeds ${width}px viewport`);
                assert(!item.overflow, `${item.selector} overflows at ${width}px`);
            }
            await page.screenshot({ animations: 'disabled', path: `/tmp/ujlp-issue-mobile-${width}.png`, fullPage: true });
        }
        await page.getByRole('link', {name:'Explore the contents'}).click();
        await page.waitForFunction(() => document.getElementById('issue-contents').getBoundingClientRect().top < 150);
        assert.equal(new URL(page.url()).hash, '');
        await page.goto(`${base}/journal/issue/all`, {waitUntil:'domcontentloaded'});
        await page.waitForURL('**/journal/index');
        assert.deepEqual(errors, []);
        console.log('PASS: section navigation, active section, all 88 footnotes, source links, dialog keyboard/focus, PDF toggle, mobile layout, issue contents/download, invalid issue redirect, no JS errors.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
