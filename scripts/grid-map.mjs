import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-grid", args: ["--no-sandbox", "--disable-gpu"], defaultViewport: { width: 640, height: 660 } });
const p = await b.newPage();
// 600x600 square box (matches vietnam.svg 1000x1000), with a 10% grid + labels.
let grid = "";
for (let i = 0; i <= 100; i += 10) {
  grid += `<div style="position:absolute;left:${i}%;top:0;bottom:0;width:1px;background:rgba(200,0,0,.5)"></div>`;
  grid += `<div style="position:absolute;top:${i}%;left:0;right:0;height:1px;background:rgba(200,0,0,.5)"></div>`;
  grid += `<div style="position:absolute;left:${i}%;top:0;color:red;font:10px monospace">${i}</div>`;
  grid += `<div style="position:absolute;top:${i}%;left:0;color:blue;font:10px monospace">${i}</div>`;
}
const html = `<!doctype html><body style="margin:10px;background:#eee">
<div style="position:relative;width:600px;height:600px;background:#cfe">
  <img src="http://localhost:PORT/vietnam.svg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain"/>
  ${grid}
</div></body>`;
await p.goto("http://localhost:" + (process.env.PORT || "3316") + "/", { waitUntil: "domcontentloaded" });
await p.setContent(html.replace("PORT", process.env.PORT || "3316"), { waitUntil: "networkidle0", timeout: 15000 });
await new Promise((r) => setTimeout(r, 600));
await p.screenshot({ path: "C:/Users/Admin/AppData/Local/Temp/svgcand/vn-grid.png" });
console.log("done");
await b.close();
