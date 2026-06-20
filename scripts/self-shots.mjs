import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const URL = process.env.URL || "http://localhost:3338/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/self-shots";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-self",
  args: ["--no-sandbox", "--disable-gpu", "--no-first-run", "--no-default-browser-check"],
  defaultViewport: { width: 1440, height: 900 },
});

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERR: " + e.message));
  page.setDefaultNavigationTimeout(60000);
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4500)); // loading curtain + first reveals

  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log("scrollHeight:", height);
  const steps = Number(process.env.STEPS || 26);
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((height - 900) * (i / steps));
    await page.evaluate((yy) => {
      if (window.__lenis) window.__lenis.scrollTo(yy, { immediate: true });
      else window.scrollTo(0, yy);
    }, y);
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `${OUT}/s-${String(i).padStart(2, "0")}.png` });
  }
  console.log("DONE shots:", steps + 1);
  console.log("CONSOLE ERRORS:", errors.length);
  errors.slice(0, 15).forEach((e) => console.log("  -", e));
} catch (e) {
  console.error("ERROR:", e.message);
} finally {
  await browser.close();
}
