import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/fan-shots";
mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-fan", args: ["--no-sandbox", "--disable-gpu"], defaultViewport: { width: 1440, height: 900 } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  const p = await b.newPage();
  await p.goto("http://localhost:3332/", { waitUntil: "domcontentloaded" });
  await sleep(5000);

  async function shoot(sel, tag) {
    const y = await p.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const top = r.top + (window.__lenis?.scroll ?? window.scrollY);
      const target = top - (900 - r.height) / 2; // center it
      if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
      else window.scrollTo(0, target);
      return Math.round(target);
    }, sel);
    if (y === null) { console.log(tag, "NOT FOUND"); return; }
    await sleep(1300);
    await p.mouse.move(40, 40);
    await sleep(400);
    await p.screenshot({ path: `${OUT}/${tag}-default.png` });
    // hover over a card on the right side of the fan
    await p.mouse.move(880, 470);
    await sleep(900);
    await p.screenshot({ path: `${OUT}/${tag}-hover.png` });
    return true;
  }

  await shoot("#hanh-trinh", "boarding");
  // click to open the hovered boarding pass
  await p.mouse.click(880, 470);
  await sleep(1000);
  await p.screenshot({ path: `${OUT}/boarding-click.png` });

  await shoot(".mem-reveal", "memories");
  console.log("DONE");
} catch (e) {
  console.error("ERROR:", e.message);
} finally {
  await b.close();
}
