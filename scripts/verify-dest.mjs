import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/dest-shots";
mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-dest", args: ["--no-sandbox", "--disable-gpu"], defaultViewport: { width: 1440, height: 900 } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  const p = await b.newPage();
  await p.goto("http://localhost:3354/", { waitUntil: "domcontentloaded" });
  await sleep(5000);
  let best = null;
  for (let y = 5400; y < 9500; y += 180) {
    await p.evaluate((yy) => window.__lenis ? window.__lenis.scrollTo(yy, { immediate: true }) : window.scrollTo(0, yy), y);
    await sleep(320);
    const vis = await p.evaluate(() => {
      const el = document.elementFromPoint(720, 450);
      const panel = el?.closest?.(".km-panel");
      if (!panel) return null;
      const h2 = panel.querySelector("h2");
      return { hOp: h2 ? parseFloat(getComputedStyle(h2).opacity) : 0, place: h2?.textContent ?? "" };
    });
    if (vis && vis.hOp > 0.7) { best = { y, place: vis.place }; break; }
  }
  console.log("dest visible at", JSON.stringify(best));
  if (best) {
    await p.mouse.click(720, 430); // open the destination's activities
    await sleep(900);
    await p.screenshot({ path: `${OUT}/dest-open.png` });
    // hover the first visible activity chip
    const box = await p.evaluate(() => {
      const btns = [...document.querySelectorAll(".km-panel button")].filter((b) => {
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.top > 600 && parseFloat(getComputedStyle(b).opacity) > 0.5;
      });
      if (!btns.length) return null;
      const r = btns[0].getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), label: btns[0].textContent };
    });
    console.log("chip:", JSON.stringify(box));
    if (box) {
      await p.mouse.move(box.x, box.y);
      await sleep(800);
      await p.screenshot({ path: `${OUT}/dest-projector.png` });
    }
  }
  console.log("DONE");
} catch (e) { console.error("ERR:", e.message); } finally { await b.close(); }
