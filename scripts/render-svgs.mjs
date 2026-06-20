import puppeteer from "puppeteer-core";
import { readdirSync, readFileSync } from "node:fs";

const DIR = process.env.DIR || "C:/Users/Admin/AppData/Local/Temp/svgcand";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-svg",
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 600, height: 400, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
const files = readdirSync(DIR).filter((f) => f.endsWith(".svg"));
for (const f of files) {
  const svg = readFileSync(`${DIR}/${f}`, "utf8");
  const html = `<!doctype html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:400px;background:#cfd8d0">${svg.replace(/width="[^"]*"/, 'width="500"').replace(/height="[^"]*"/, "")}</body>`;
  await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 15000 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: `${DIR}/${f.replace(".svg", ".png")}` });
  console.log("rendered", f);
}
await browser.close();
