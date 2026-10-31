const path = require('path');
const { chromium } = require('playwright');
const { startBuildServer } = require('../build-preview-server');
const views = [
    ['home', '/', 1440, 950], ['journal', '/journal', 1440, 950],
    ['issue', '/journal/issue/2026-1', 1440, 950], ['announcements', '/announcements', 1440, 950],
    ['signin', '/alumni/signin', 1440, 950],
    ['home-mobile', '/', 390, 844], ['issue-mobile', '/journal/issue/2026-1', 390, 844],
    ['announcements-mobile', '/announcements', 390, 844]
];
async function withBrowser(run) {
    const server = await startBuildServer(path.resolve('build'));
    const browser = await chromium.launch();
    try { await run(browser, server.url); }
    finally { await browser.close(); await server.close(); }
}
async function openPage(browser, base, [, route, width, height]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.route('**/rest/v1/**', handler => handler.fulfill({ json: [] }));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
    });
    return page;
}
module.exports = { views, withBrowser, openPage };
