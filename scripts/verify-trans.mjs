import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/trans-shots";
mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-trans", args: ["--no-sandbox", "--disable-gpu"], defaultViewport: { width: 1440, height: 900 } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  const p = await b.newPage();
  await p.goto("http://localhost:3346/", { waitUntil: "domcontentloaded" });
  await sleep(5000);
  const h = await p.evaluate(() => document.body.scrollHeight);
  console.log("height", h);
  // Sweep the journal -> suitcase zone, capture frames
  let n = 0;
  for (let y = 9400; y <= 11200; y += 150) {
    await p.evaluate((yy) => window.__lenis ? window.__lenis.scrollTo(yy, { immediate: true }) : window.scrollTo(0, yy), y);
    await sleep(450);
    await p.screenshot({ path: `${OUT}/t-${String(n).padStart(2, "0")}.png` });
    n++;
  }
  console.log("DONE", n);
} catch (e) { console.error("ERR:", e.message); } finally { await b.close(); }
