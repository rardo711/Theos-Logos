/**
 * Rasterize the Theos Logos seal to PWA / iOS / Android icons.
 * Run: node scripts/render-app-icons.mjs
 */
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const OXBLOOD = "#821111";
const SPINE = "#4a0c0c";
const CREAM = "#fffaf6";

function sealSvg({ size, maskable = false }) {
  const s = size;
  const inset = maskable ? s * 0.18 : 0;
  const field = s - inset * 2;
  const rx = maskable ? 0 : Math.round(s * 0.18);
  const spineW = maskable ? 0 : Math.round(field * 0.14);
  const pageW = maskable ? 0 : Math.round(field * 0.07);
  const textX = maskable
    ? s / 2
    : inset + spineW + (field - spineW - pageW) / 2;
  const font = Math.round(s * (maskable ? 0.34 : 0.38));
  const textY = s / 2 + font * 0.36;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${rx}" fill="${OXBLOOD}"/>
  ${
    maskable
      ? ""
      : `<rect x="${inset}" y="${inset}" width="${spineW}" height="${field}" fill="${SPINE}"/>
  <rect x="${inset + spineW}" y="${inset}" width="${Math.max(1, Math.round(s * 0.012))}" height="${field}" fill="${CREAM}" opacity="0.28"/>
  <rect x="${s - inset - pageW}" y="${inset + field * 0.16}" width="${pageW}" height="${field * 0.68}" rx="${Math.round(s * 0.012)}" fill="${CREAM}" opacity="0.9"/>`
  }
  <text x="${textX}" y="${textY}" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', Times, serif"
    font-size="${font}" font-weight="700" fill="${CREAM}">TL</text>
</svg>`;
}

async function raster(browser, svg, size, file) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<!doctype html><html><head><style>
      html,body{margin:0;width:${size}px;height:${size}px;background:${OXBLOOD};overflow:hidden}
      svg{display:block}
    </style></head><body>${svg}</body></html>`,
    { waitUntil: "load" },
  );
  const buf = await page.screenshot({
    type: "png",
    clip: { x: 0, y: 0, width: size, height: size },
    omitBackground: false,
  });
  writeFileSync(file, buf);
  await page.close();
  console.log("wrote", file, buf.length);
}

const browser = await chromium.launch();
try {
  await raster(browser, sealSvg({ size: 180 }), 180, "public/apple-touch-icon.png");
  await raster(browser, sealSvg({ size: 180 }), 180, "public/__grok/icon-180.png");
  await raster(browser, sealSvg({ size: 192 }), 192, "public/icon-192.png");
  await raster(browser, sealSvg({ size: 512 }), 512, "public/icon-512.png");
  await raster(
    browser,
    sealSvg({ size: 512, maskable: true }),
    512,
    "public/icon-512-maskable.png",
  );
} finally {
  await browser.close();
}
