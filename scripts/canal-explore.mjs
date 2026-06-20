import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/exp-shots";
mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-exp2", args: ["--no-sandbox", "--disable-gpu"], defaultViewport: { width: 1440, height: 900 } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DECODE = `function decode(t){if(!t||t==="none")return"none";const m=t.match(/matrix\\(([^)]+)\\)/);if(!m)return t.slice(0,40);const[a,bb,c,d,e,f]=m[1].split(",").map(Number);return"rot="+(Math.round(Math.atan2(bb,a)*1800/Math.PI)/10)+" sc="+(Math.round(Math.sqrt(a*a+bb*bb)*100)/100)+" tx="+Math.round(e)+" ty="+Math.round(f);}`;

function cardsAt() {
  // returns decoded geometry of "bedroom" property cards currently in viewport
  return [...document.querySelectorAll("*")].filter(e => {
    const r = e.getBoundingClientRect();
    return /bedroom/i.test(e.textContent) && r.top > 60 && r.top < 820 && r.width > 150 && r.width < 640 && r.height > 180 && e.querySelector("img");
  });
}

try {
  const p = await b.newPage();
  await p.goto("https://canalclub-wickside.com/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(4500);
  // accept cookies via real button
  for (const h of await p.$$("button, a")) {
    const tx = await p.evaluate((e) => e.textContent, h);
    if (/accept cookies/i.test(tx)) { await h.click().catch(() => {}); break; }
  }
  await sleep(1000);

  // step-scroll until the homes cards are mid-viewport
  let foundY = -1;
  for (let y = 0; y < 6000; y += 300) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(450);
    const n = await p.evaluate(`(${cardsAt.toString()})().length`);
    if (n >= 2) { foundY = y; break; }
  }
  console.log("cards visible at scrollY =", foundY);
  // nudge to center them
  await p.evaluate((yy) => window.scrollTo(0, yy + 120), foundY);
  await sleep(900);
  await p.mouse.move(20, 20); await sleep(400);
  await p.screenshot({ path: `${OUT}/exp-default.png` });

  const rest = await p.evaluate(`${DECODE}; (${cardsAt.toString()})().slice(0,6).map(e=>{const r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),t:decode(getComputedStyle(e).transform)};})`);
  console.log("REST:"); rest.forEach((c) => console.log("  " + JSON.stringify(c)));

  if (rest.length) {
    // hover the 2nd card
    const c2 = rest[Math.min(1, rest.length - 1)];
    await p.mouse.move(c2.x + c2.w / 2, c2.y + c2.h / 2); await sleep(900);
    await p.screenshot({ path: `${OUT}/exp-hover.png` });
    const hov = await p.evaluate(`${DECODE}; (${cardsAt.toString()})().slice(0,6).map(e=>{const r=e.getBoundingClientRect();return{x:Math.round(r.x),w:Math.round(r.width),h:Math.round(r.height),t:decode(getComputedStyle(e).transform)};})`);
    console.log("HOVER:"); hov.forEach((c) => console.log("  " + JSON.stringify(c)));
    // click
    await p.mouse.click(c2.x + c2.w / 2, c2.y + c2.h / 2); await sleep(1300);
    await p.screenshot({ path: `${OUT}/exp-click.png` });
    const clk = await p.evaluate(`${DECODE}; (${cardsAt.toString()})().slice(0,6).map(e=>{const r=e.getBoundingClientRect();return{x:Math.round(r.x),w:Math.round(r.width),h:Math.round(r.height),t:decode(getComputedStyle(e).transform)};})`);
    console.log("CLICK:"); clk.forEach((c) => console.log("  " + JSON.stringify(c)));
  }
  console.log("DONE");
} catch (e) { console.error("ERR:", e.message); } finally { await b.close(); }
