const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { startBuildServer } = require('./build-preview-server');

const outputDir = path.resolve(__dirname, '../docs/screenshots');
const date = process.env.SCREENSHOT_DATE || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('SCREENSHOT_DATE must be YYYY-MM-DD.');
const historyDir = path.resolve(__dirname, `../docs/changelog-assets/history-screenshots/${date}`);
const shots = [
    ['home-desktop', '/', 1440, 950],
    ['journal-desktop', '/journal', 1440, 950],
    ['article-desktop', '/schoolhousesecrets', 1440, 950],
    ['issue-desktop', '/journal/issue/2026-1', 1440, 950],
    ['announcements-desktop', '/announcements', 1440, 950],
    ['home-mobile', '/', 390, 844],
    ['issue-mobile', '/journal/issue/2026-1', 390, 844],
    ['announcements-mobile', '/announcements', 390, 844]
];

(async () => {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(historyDir, { recursive: true });
    const server = process.env.SCREENSHOT_BASE_URL ? null : await startBuildServer(path.resolve(__dirname, '../build'));
    const browser = await chromium.launch();
    try {
        for (const [name, route, width, height] of shots) {
            const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
            // No production network data is fetched for documentation screenshots.
            await page.route('**/rest/v1/**', handler => handler.fulfill({ json: [] }));
            await page.goto(`${process.env.SCREENSHOT_BASE_URL || server.url}${route}`, { waitUntil: 'domcontentloaded' });
            if (route === '/announcements') await page.getByText('No meeting recaps published yet.').waitFor();
            await page.screenshot({ path: path.join(outputDir, `${name}.png`), animations: 'disabled', fullPage: true });
            fs.copyFileSync(path.join(outputDir, `${name}.png`), path.join(historyDir, `${name}.png`));
            await page.close();
            console.log(`Captured ${name}`);
        }
        fs.writeFileSync(path.join(historyDir, 'manifest.json'), JSON.stringify({
            date, sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
            workingTreeChanges: Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()),
            description: 'Local working-tree snapshot. Public backend requests use empty fixtures; no real member data or invented meetings.',
            screenshots: shots.map(([name, route, width, height]) => ({ file: `${name}.png`, route, viewport: { width, height } }))
        }, null, 2) + '\n');
    } finally { await browser.close(); await server?.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
