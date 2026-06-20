import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = process.env.PORT || "3317";
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-probe2", args: ["--no-sandbox", "--disable-gpu"], defaultViewport: { width: 1440, height: 900 } });
const p = await b.newPage();
await p.goto("http://localhost:" + PORT + "/", { waitUntil: "domcontentloaded" });
await new Promise((r) => setTimeout(r, 6000));
await p.evaluate(() => window.__lenis && window.__lenis.scrollTo(700, { immediate: true }));
await new Promise((r) => setTimeout(r, 1200));
await p.screenshot({ path: "C:/Users/Admin/AppData/Local/Temp/svgcand/probe2.png" });
const info = await p.evaluate(() => {
  const out = [];
  out.push("lenis=" + Math.round(window.__lenis?.scroll ?? -1));
  // The circle in the screenshot sits near (690,470). Walk the stack there.
  for (const [x, y] of [[720, 432]]) {
    const els = document.elementsFromPoint(x, y);
    out.push(`STACK at ${x},${y}:`);
    els.slice(0, 10).forEach((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out.push(`  <${el.tagName}> .${(el.getAttribute("class")||"").slice(0,34)} [${Math.round(r.width)}x${Math.round(r.height)}] vis=${cs.visibility} op=${cs.opacity} bg=${cs.backgroundColor.slice(0,20)}`);
    });
  }
  return out.join("\n");
});
console.log(info);
await b.close();
