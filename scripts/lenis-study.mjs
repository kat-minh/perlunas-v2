import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const URL = process.env.URL || "https://lenis.darkroom.engineering/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/lenis-shots";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-lenis",
  args: ["--no-sandbox", "--disable-gpu", "--no-first-run", "--no-default-browser-check"],
  defaultViewport: { width: 1440, height: 900 },
});

try {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));

  const height = await page.evaluate(() => document.body.scrollHeight);
  const vh = 900;
  console.log("page height:", height);

  let i = 0;
  for (let y = 0; y <= height; y += Math.round(vh * 0.85)) {
    await page.evaluate((yy) => {
      if (window.lenis) window.lenis.scrollTo(yy, { immediate: true });
      else if (window.__lenis) window.__lenis.scrollTo(yy, { immediate: true });
      else window.scrollTo(0, yy);
    }, y);
    await new Promise((r) => setTimeout(r, 1400));
    await page.screenshot({ path: `${OUT}/lenis-${String(i).padStart(2, "0")}.png` });
    console.log("shot", i, "at y", y);
    i++;
  }
  console.log("DONE", i, "shots");
} catch (e) {
  console.error("ERROR:", e.message);
} finally {
  await browser.close();
}
