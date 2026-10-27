// Preview screenshots of built pages at phone, tablet, and desktop widths.
// Requires the preview server to be running (python3 tools/preview_server.py)
// and Playwright (pre-installed in Claude Code cloud sessions).
//
//   node tools/screenshots.js articles/my-essay/ [more paths...] [--out DIR]
//
// Saves full-page PNGs named <page>-<device>.png into DIR (default: preview/).
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "http://127.0.0.1:4000/personal-blog/";
const DEVICES = [
  ["phone", 412, 915],
  ["tablet", 800, 1280],
  ["desktop", 1440, 900],
];

(async () => {
  const args = process.argv.slice(2);
  const outIndex = args.indexOf("--out");
  const outDir = outIndex >= 0 ? args.splice(outIndex, 2)[1] : "preview";
  const pages = args.length ? args : [""];
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  for (const [device, width, height] of DEVICES) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    for (const p of pages) {
      await page.goto(BASE + p.replace(/^\//, ""), { waitUntil: "networkidle" });
      // Scroll through the page so lazy-loaded images appear in the screenshot.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
      const name = (p.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "home") + "-" + device + ".png";
      await page.screenshot({ path: path.join(outDir, name), fullPage: true });
      console.log("saved", path.join(outDir, name));
    }
    await context.close();
  }
  await browser.close();
})();
