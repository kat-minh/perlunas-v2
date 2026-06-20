import puppeteer from "puppeteer-core";

const URL = process.env.URL || "http://localhost:3230/";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-profile",
  args: ["--no-sandbox", "--disable-gpu", "--no-first-run", "--no-default-browser-check"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const errs = [];
page.on("console", (m) => {
  if (m.type() === "error") errs.push("CONSOLE: " + m.text());
});
page.on("pageerror", (e) => errs.push("PAGEERROR: " + (e.stack || e.message)));

// Reload several times to stress the Strict-Mode double-invoke path.
for (let pass = 0; pass < 3; pass++) {
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3500));
  for (let y = 0; y < 7; y++) {
    await page.evaluate((i) => {
      const t = window.innerHeight * i * 0.8;
      window.__lenis ? window.__lenis.scrollTo(t, { immediate: true }) : window.scrollTo(0, t);
    }, y);
    await new Promise((r) => setTimeout(r, 300));
  }
}

console.log("=== ERRORS:", errs.length, "===");
[...new Set(errs)].slice(0, 8).forEach((e) => console.log(e, "\n---"));
await browser.close();
