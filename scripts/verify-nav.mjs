import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/nav-shots";
mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-nav", args: ["--no-sandbox", "--disable-gpu"], defaultViewport: { width: 1440, height: 900 } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  const p = await b.newPage();
  await p.goto("http://localhost:3349/", { waitUntil: "domcontentloaded" });
  await sleep(5000);
  const h = await p.evaluate(() => document.body.scrollHeight);
  console.log("height", h);
  const stops = [0.18, 0.34, 0.5, 0.6, 0.74, 0.86, 0.97];
  let n = 0;
  for (const f of stops) {
    const y = Math.round((h - 900) * f);
    await p.evaluate((yy) => window.__lenis ? window.__lenis.scrollTo(yy, { immediate: true }) : window.scrollTo(0, yy), y);
    await sleep(600);
    // which nav item is active?
    const act = await p.evaluate(() => {
      const btns = [...document.querySelectorAll("header nav button")];
      const a = btns.find((b) => b.querySelector("span")?.classList.contains("w-full"));
      return a ? a.textContent : "(none)";
    });
    await p.screenshot({ path: `${OUT}/nav-${n}-${Math.round(f * 100)}.png`, clip: { x: 300, y: 0, width: 840, height: 70 } });
    console.log(`f=${f} y=${y} active="${act}"`);
    n++;
  }
  console.log("DONE");
} catch (e) { console.error("ERR:", e.message); } finally { await b.close(); }
