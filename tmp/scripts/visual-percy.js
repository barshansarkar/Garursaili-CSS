// // src/scripts/visual-percy.js
// // Puppeteer + Percy snapshot script. Requires PERCY_TOKEN in CI environment.
// // Usage: node src/scripts/visual-percy.js
// import puppeteer from 'puppeteer';
// import PercyScript from '@percy/puppeteer';
export {};
// (async () => {
//   const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
//   const page = await browser.newPage();
//   const demo = `file://${process.cwd()}/dist/docs/index.html`;
//   await page.goto(demo, { waitUntil: 'networkidle0' });
//   await PercyScript.snapshot(page, 'Garur docs - index');
//   await browser.close();
//   console.log("Percy snapshot completed (requires PERCY_TOKEN in env)");
// })();
