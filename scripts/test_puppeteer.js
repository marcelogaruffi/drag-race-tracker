const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://rupaulsdragrace.fandom.com/wiki/Drag_Queens', { waitUntil: 'networkidle2' });
  
  const title = await page.title();
  console.log("Title:", title);
  
  // Try to find tables
  const tables = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table.wikitable')).length;
  });
  console.log("Wikitables found:", tables);
  
  await browser.close();
}

run();
