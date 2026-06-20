import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const URL = process.env.URL || "http://localhost:3312/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/flight-shots";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-flight",
  args: ["--no-sandbox", "--disable-gpu", "--no-first-run", "--no-default-browser-check"],
  defaultViewport: { width: 1440, height: 900 },
});

try {
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERR: " + e.message));
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 5000));

  // Flight opening pins ~520% → first ~5.5 screens. Step finely through it.
  const top = 5200;
  const steps = 22;
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((top * i) / steps);
    await page.evaluate((yy) => {
      if (window.__lenis) window.__lenis.scrollTo(yy, { immediate: true });
      else window.scrollTo(0, yy);
    }, y);
    await new Promise((r) => setTimeout(r, 650));
    await page.screenshot({ path: `${OUT}/f-${String(i).padStart(2, "0")}.png` });
  }
  console.log("DONE", steps + 1, "errors:", errors.length);
  errors.slice(0, 10).forEach((e) => console.log("  -", e));
} catch (e) {
  console.error("ERROR:", e.message);
} finally {
  await browser.close();
}
