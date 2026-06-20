import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const URL = "https://canalclub-wickside.com/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/canal-shots";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-canal",
  args: ["--no-sandbox", "--disable-gpu", "--no-first-run", "--no-default-browser-check"],
  defaultViewport: { width: 1440, height: 900 },
});

try {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 5000));

  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log("page height:", height);
  let i = 0;
  for (let y = 0; y <= height; y += Math.round(900 * 0.8)) {
    await page.evaluate((yy) => {
      if (window.lenis) window.lenis.scrollTo(yy, { immediate: true });
      else window.scrollTo(0, yy);
    }, y);
    await new Promise((r) => setTimeout(r, 1100));
    await page.screenshot({ path: `${OUT}/c-${String(i).padStart(2, "0")}.png` });
    i++;
  }
  // Find headings of interest
  const heads = await page.evaluate(() =>
    [...document.querySelectorAll("h1,h2,h3")]
      .map((h) => h.textContent.trim())
      .filter(Boolean)
      .slice(0, 40),
  );
  console.log("HEADINGS:\n" + heads.join("\n"));
  console.log("DONE", i);
} catch (e) {
  console.error("ERROR:", e.message);
} finally {
  await browser.close();
}
