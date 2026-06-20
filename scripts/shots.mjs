import puppeteer from "puppeteer-core";

const URL = process.env.URL || "http://localhost:3229/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-profile",
  args: ["--no-sandbox", "--disable-gpu", "--no-first-run", "--no-default-browser-check"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto(URL, { waitUntil: "networkidle2", timeout: 45000 });
await new Promise((r) => setTimeout(r, 3200));

// Scroll by section id so framing is correct regardless of pins.
const targets = [
  ["hero", "#hero"],
  ["manifesto", null], // just under hero
  ["story", "#cau-chuyen"],
  ["why", "#vi-sao"],
  ["founder", "#nguoi-dan-loi"],
  ["categories", "#hanh-trinh"],
  ["tours", "#hanh-trinh-noi-bat"],
  ["map", "#diem-den"],
  ["stories", "#trai-nghiem"],
  ["cta", "#lien-he"],
];

for (const [name, sel] of targets) {
  await page.evaluate((s) => {
    const l = window.__lenis;
    let y = window.innerHeight * 1.05;
    if (s) {
      const el = document.querySelector(s);
      if (el) y = el.getBoundingClientRect().top + (window.__lenis?.scroll ?? window.scrollY);
    }
    if (l) l.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, sel);
  await new Promise((r) => setTimeout(r, 1100));
  await page.screenshot({ path: `scripts/shot-${name}.png` });
}
await browser.close();
console.log("shots saved");
