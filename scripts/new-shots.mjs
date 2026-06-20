import puppeteer from "puppeteer-core";

const URL = process.env.URL || "http://localhost:3000/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-profile2",
  args: ["--no-sandbox", "--disable-gpu", "--no-first-run", "--no-default-browser-check"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();

async function shoot(prefix) {
  const targets = [
    ["hero", "#top"],
    ["brand", "#thuong-hieu"],
    ["products", "#hanh-trinh"],
    ["contact", "#lien-he"],
  ];
  for (const [name, sel] of targets) {
    await page.evaluate((s) => {
      let y = 0;
      const el = document.querySelector(s);
      if (el) y = el.getBoundingClientRect().top + window.scrollY;
      const l = window.__lenis;
      if (l) l.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    }, sel);
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: `scripts/${prefix}-${name}.png` });
  }
}

// dark (default)
await page.goto(URL, { waitUntil: "networkidle2", timeout: 45000 });
await new Promise((r) => setTimeout(r, 2500));
await shoot("dark");

// light
await page.evaluate(() => {
  document.documentElement.classList.add("light");
  try { localStorage.setItem("perlunas-theme", "light"); } catch {}
});
await new Promise((r) => setTimeout(r, 900));
await shoot("light");

await browser.close();
console.log("shots saved");
