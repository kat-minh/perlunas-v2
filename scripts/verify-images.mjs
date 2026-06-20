import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ids = {
  camp_tent: "1504280390367-361c6d9f38f4",
  strawberry: "1464965911861-746a04b4bca6",
  bike_forest: "1541625602330-2277a4c46182",
  scuba: "1544551763-46a013bb70d5",
  boat_night: "1513415277900-a62401e19be4",
  kayak: "1502933691298-84fc14542831",
  mocchau_field: "1570366583862-f91883984fde",
  trek_group: "1533692328991-08159ff19fca",
  turquoise: "1507525428034-b723cf961d3e",
};
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, userDataDir: "C:/Users/Admin/AppData/Local/Temp/pptr-img", args: ["--no-sandbox", "--disable-gpu"] });
const p = await b.newPage();
for (const [k, id] of Object.entries(ids)) {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=60`;
  let status = "ERR";
  try {
    const resp = await p.goto(url, { waitUntil: "load", timeout: 12000 });
    status = resp ? resp.status() : "null";
  } catch {
    status = "timeout";
  }
  console.log(`${status === 200 ? "OK  " : "FAIL"} ${k} -> ${status}  photo-${id}`);
}
await b.close();
