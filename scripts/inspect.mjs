import puppeteer from "puppeteer-core";

const URL = process.env.URL || "http://localhost:3221/";
const CHROME =
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-profile",
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1440,900",
  ],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
await page.setCacheEnabled(false);
const errors = [];
const failed = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push("CONSOLE: " + m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("response", (r) => {
  if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
});
page.on("requestfailed", (r) =>
  failed.push(`FAIL ${r.failure()?.errorText} ${r.url()}`),
);

page.setDefaultNavigationTimeout(45000);
await page.goto(URL, { waitUntil: "networkidle2", timeout: 45000 });
await new Promise((r) => setTimeout(r, 3500)); // wait out loading screen + reveals

// Step-scroll the whole document via Lenis so ScrollTriggers fire.
const height = await page.evaluate(() => document.body.scrollHeight);
const vh = 900;
for (let y = 0; y <= height; y += Math.round(vh * 0.6)) {
  await page.evaluate((yy) => {
    const l = window.__lenis;
    if (l) l.scrollTo(yy, { immediate: true });
    else window.scrollTo(0, yy);
  }, y);
  await new Promise((r) => setTimeout(r, 350));
}
await new Promise((r) => setTimeout(r, 600));

// Detect horizontal overflow.
const overflow = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  innerW: window.innerWidth,
}));

// Check every split-text heading actually revealed (token not stuck off-screen).
const hidden = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll("[aria-label] [data-tok]").forEach((tok) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(tok).transform);
    const op = parseFloat(getComputedStyle(tok).opacity);
    if (Math.abs(m.m42) > 6 || op < 0.5) {
      const label = tok.closest("[aria-label]")?.getAttribute("aria-label");
      bad.push({ label, ty: Math.round(m.m42), op });
    }
  });
  // de-dupe by label
  const seen = new Set();
  return bad.filter((b) => !seen.has(b.label) && seen.add(b.label));
});

// Check any element with opacity 0 that looks like stuck reveal content.
const stuckSections = await page.evaluate(() => {
  const ids = [
    "cau-chuyen", "vi-sao", "nguoi-dan-loi", "hanh-trinh",
    "hanh-trinh-noi-bat", "diem-den", "trai-nghiem", "lien-he",
  ];
  return ids
    .map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const op = parseFloat(getComputedStyle(el).opacity);
      return { id, opacity: op };
    })
    .filter((s) => s.missing || s.opacity < 0.99);
});

console.log("\n===== INSPECTION REPORT =====");
console.log("URL:", URL);
console.log("Console/page errors:", errors.length);
errors.slice(0, 20).forEach((e) => console.log("  -", e));
console.log("\nFailed requests:", failed.length);
[...new Set(failed)].slice(0, 20).forEach((f) => console.log("  -", f));
console.log(
  "\nHorizontal overflow:",
  overflow.scrollW > overflow.innerW + 2
    ? `YES (scrollW ${overflow.scrollW} > innerW ${overflow.innerW})`
    : "no",
);
console.log("\nUnrevealed split-text headings:", hidden.length);
hidden.forEach((h) => console.log("  -", JSON.stringify(h)));
console.log("\nSection wrappers with opacity<1:", JSON.stringify(stuckSections));
console.log("===== END =====\n");

await browser.close();
