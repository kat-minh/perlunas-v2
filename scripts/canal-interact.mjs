import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const URL = "https://canalclub-wickside.com/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/canal-shots";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-canal2",
  args: ["--no-sandbox", "--disable-gpu", "--no-first-run"],
  defaultViewport: { width: 1440, height: 900 },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await sleep(4000);

  // Accept cookies
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button,a")].find((e) =>
      /accept cookies/i.test(e.textContent),
    );
    if (b) b.click();
  });
  await sleep(1000);

  async function studySection(rx, tag) {
    const box = await page.evaluate((rxs) => {
      const re = new RegExp(rxs, "i");
      const h = [...document.querySelectorAll("h1,h2,h3,h4")].find((e) => re.test(e.textContent));
      if (!h) return null;
      h.scrollIntoView({ block: "center" });
      // climb to a container that holds multiple card-ish children
      let sec = h.closest("section") || h.parentElement;
      return { ok: true };
    }, rx);
    if (!box) { console.log(tag, "NOT FOUND"); return; }
    await sleep(1400);
    await page.screenshot({ path: `${OUT}/${tag}-default.png` });

    // hover across the card row (3 spots), screenshot each
    for (const fx of [0.28, 0.5, 0.72]) {
      await page.mouse.move(Math.round(1440 * fx), 470);
      await sleep(900);
      await page.screenshot({ path: `${OUT}/${tag}-hover-${Math.round(fx * 100)}.png` });
    }
    // click the middle card
    await page.mouse.click(720, 470);
    await sleep(1200);
    await page.screenshot({ path: `${OUT}/${tag}-click.png` });

    // dump geometry of the card-like elements near the row
    const geo = await page.evaluate(() => {
      const els = [...document.querySelectorAll("*")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.top > 180 && r.top < 760 && r.width > 120 && r.width < 520 && r.height > 140 && r.height < 620;
      });
      return els.slice(0, 8).map((e) => {
        const cs = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        return {
          tag: e.tagName,
          cls: (e.getAttribute("class") || "").slice(0, 50),
          x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height),
          transform: cs.transform.slice(0, 60),
          transition: cs.transition.slice(0, 60),
          margin: cs.margin,
        };
      });
    });
    console.log(`\n=== ${tag} CARD GEOMETRY ===`);
    geo.forEach((g) => console.log(JSON.stringify(g)));
  }

  await studySection("a gateway to anywhere", "gateway");
  await studySection("explore", "explore");
  console.log("DONE");
} catch (e) {
  console.error("ERROR:", e.message);
} finally {
  await browser.close();
}
