const fs = require('fs');
const assert = require('assert/strict');
const AxeBuilder = require('@axe-core/playwright').default;
const { views, withBrowser, openPage } = require('./browser.cjs');
(async () => {
    const results = [];
    await withBrowser(async (browser, base) => {
        for (const view of views) {
            const page = await openPage(browser, base, view);
            // Decorative watermark is aria-hidden and conveys no content.
            const scan = await new AxeBuilder({ page }).exclude('.jh-join-mark[aria-hidden="true"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
            await page.keyboard.press('Tab');
            assert(await page.evaluate(() => document.activeElement !== document.body), `${view[0]}: keyboard focus missing`);
            results.push({ page: view[0], violations: scan.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })) });
            await page.context().close();
        }
    });
    fs.mkdirSync('automation-results', { recursive: true });
    fs.writeFileSync('automation-results/accessibility.json', JSON.stringify(results, null, 2));
    const serious = results.flatMap(result => result.violations).filter(item => ['critical', 'serious'].includes(item.impact));
    console.log(`${serious.length} serious/critical accessibility findings; see automation-results/accessibility.json.`);
    if (serious.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
