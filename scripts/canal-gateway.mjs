import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/gw-shots";
mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-gw", args: ["--no-sandbox", "--disable-gpu"], defaultViewport: { width: 1440, height: 900 } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  const p = await b.newPage();
  await p.goto("https://canalclub-wickside.com/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(4000);
  await p.evaluate(() => { const x=[...document.querySelectorAll("button,a")].find(e=>/accept cookies/i.test(e.textContent)); if(x)x.click(); });
  await sleep(1000);

  // Scroll to the transport cards (find an element containing "By Foot"/"By Bike")
  const found = await p.evaluate(() => {
    const el = [...document.querySelectorAll("*")].find(e => /by foot|by bike|by plane/i.test(e.textContent) && e.children.length < 4);
    if (!el) return false;
    el.scrollIntoView({ block: "center" });
    return true;
  });
  console.log("cards found:", found);
  await sleep(1500);
  await p.mouse.move(30, 30); await sleep(500);
  await p.screenshot({ path: `${OUT}/gw-default.png` });

  // capture the card row geometry + computed transform at rest
  const rest = await p.evaluate(() => {
    const cards = [...document.querySelectorAll("*")].filter(e => /^(by foot|by bike|by train|by plane|by car)/i.test(e.textContent.trim().slice(0,14)) && e.getBoundingClientRect().width>120 && e.getBoundingClientRect().width<420);
    return cards.slice(0,6).map(e => { const cs=getComputedStyle(e); const r=e.getBoundingClientRect(); return {cls:(e.className||"").toString().slice(0,40), x:Math.round(r.x), w:Math.round(r.width), transform:cs.transform.slice(0,70), transition:cs.transition.slice(0,80)}; });
  });
  console.log("REST:", JSON.stringify(rest, null, 1));

  // hover the middle of the row and a couple of cards
  for (const fx of [0.4, 0.55, 0.7]) {
    await p.mouse.move(Math.round(1440*fx), 460); await sleep(900);
    await p.screenshot({ path: `${OUT}/gw-hover-${Math.round(fx*100)}.png` });
  }
  console.log("DONE");
} catch (e) { console.error("ERR:", e.message); } finally { await b.close(); }
