const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const { views, withBrowser, openPage } = require('./browser.cjs');
const mode = process.argv[2];
const directory = process.argv[3] || 'automation-results/visual';
(async () => {
    fs.mkdirSync(directory, { recursive: true });
    if (mode === 'capture') {
        await withBrowser(async (browser, base) => {
            for (const view of views) {
                const page = await openPage(browser, base, view);
                await page.screenshot({ path: path.join(directory, `${view[0]}.png`), fullPage: true, animations: 'disabled' });
                await page.context().close();
            }
        });
    } else if (mode === 'compare') {
        const pixelmatch = (await import('pixelmatch')).default;
        const baseline = process.argv[4];
        const results = views.map(([name]) => {
            const before = PNG.sync.read(fs.readFileSync(path.join(baseline, `${name}.png`)));
            const after = PNG.sync.read(fs.readFileSync(path.join(directory, `${name}.png`)));
            const width = Math.max(before.width, after.width), height = Math.max(before.height, after.height);
            function canvas(image) { const result = new PNG({ width, height }); PNG.bitblt(image, result, 0, 0, image.width, image.height, 0, 0); return result; }
            const diff = new PNG({ width, height });
            const changed = pixelmatch(canvas(before).data, canvas(after).data, diff.data, width, height, { threshold: 0.2 });
            fs.writeFileSync(path.join(directory, `${name}-diff.png`), PNG.sync.write(diff));
            return `| ${name} | ${(100 * changed / (width * height)).toFixed(2)}% |`;
        });
        fs.writeFileSync(path.join(directory, 'comparison.md'), `## Visual comparison\n\nReview the before, after, and highlighted diff images in the workflow artifacts. Changes require human review; they do not automatically approve a new baseline.\n\n| Page | Changed pixels |\n| --- | --- |\n${results.join('\n')}\n`);
    } else throw new Error('Use capture or compare.');
})().catch(error => { console.error(error); process.exitCode = 1; });
