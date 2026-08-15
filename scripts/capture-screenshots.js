const path = require('path');
const { chromium } = require('playwright');

const baseUrl = process.env.SCREENSHOT_BASE_URL || 'http://localhost:4173';
const outputDir = path.resolve(__dirname, '..', 'docs', 'screenshots');

const shots = [
  {
    name: 'home-desktop',
    route: '/#/',
    viewport: { width: 1440, height: 950 },
  },
  {
    name: 'journal-desktop',
    route: '/#/journal',
    viewport: { width: 1440, height: 950 },
  },
  {
    name: 'article-desktop',
    route: '/#/schoolhousesecrets',
    viewport: { width: 1440, height: 950 },
  },
  {
    name: 'home-mobile',
    route: '/#/',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  },
];

async function capture() {
  const browser = await chromium.launch();

  for (const shot of shots) {
    const context = await browser.newContext({
      viewport: shot.viewport,
      deviceScaleFactor: shot.deviceScaleFactor || 1,
      isMobile: shot.isMobile || false,
    });
    const page = await context.newPage();

    await page.goto(`${baseUrl}${shot.route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(outputDir, `${shot.name}.png`),
      fullPage: false,
    });

    await context.close();
    console.log(`Captured ${shot.name}.png`);
  }

  await browser.close();
}

capture().catch(error => {
  console.error(error);
  process.exit(1);
});
