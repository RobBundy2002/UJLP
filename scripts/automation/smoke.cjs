const assert = require('assert/strict');
const { chromium } = require('playwright');
const origin = process.env.SITE_URL || 'https://ujlawandpolitics.org';
(async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        for (const route of ['/', '/journal', '/journal/issue/2026-1', '/announcements']) {
            const response = await page.goto(origin + route, { waitUntil: 'networkidle', timeout: 60000 });
            // GitHub Pages returns its 404 redirect shell for SPA deep links.
            assert(response.ok() || response.status() === 404, `${route}: HTTP ${response.status()}`);
            await page.locator('main').waitFor({ timeout: 30000 });
            assert.equal(new URL(page.url()).pathname, route, `${route}: route was lost during recovery`);
            assert(await page.locator('main').innerText(), `${route}: empty page`);
            const headings = { '/': /law|politics/i, '/journal': /journal/i, '/journal/issue/2026-1': /issue|volume/i, '/announcements': /announcements/i };
            assert(await page.getByRole('heading', { name: headings[route] }).count(), `${route}: expected content missing`);
            if (route.includes('/issue/')) {
                const href = await page.locator('a[href$=".pdf"]').first().getAttribute('href');
                const pdf = await page.request.get(new URL(href, origin).href);
                assert(pdf.ok(), 'Issue PDF request failed');
                assert((await pdf.body()).subarray(0, 5).toString() === '%PDF-', 'Issue download is not a PDF');
            }
            if (route === '/announcements') assert.equal(await page.getByText(/could not find the table|could not load recaps|recaps are unavailable|couldn’t load the archive/i).count(), 0, 'Recap API unavailable');
            console.log(`OK ${route}`);
        }
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
