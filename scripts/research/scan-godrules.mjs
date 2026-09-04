/**
 * Godrules currently supplies only Wesley's Explanatory Notes on Revelation
 * (catalog-weak-nt.ts, wesleyrev{1-22}.htm) and Geneva Bible notes on
 * Revelation. Wesley's Notes cover the whole New Testament; if the same host
 * uses a predictable filename per book, that is a real, cheap expansion.
 * This checks the existing rows still resolve and probes a handful of other
 * books before anyone builds a generator on top of an unverified guess.
 */
import { politeGet } from "./lib/fetch.mjs";

export async function verifyExistingRevelationRows() {
  const results = [];
  for (let ch = 1; ch <= 22; ch++) {
    const url = `https://www.godrules.net/library/wesley/wesleyrev${ch}.htm`;
    const res = await politeGet(url, { delayMs: 300 });
    results.push({ chapter: ch, url, status: res.status, ok: res.ok });
  }
  return results;
}

// Book abbreviations guessed from the confirmed "rev" pattern; unverified.
const PROBE_BOOKS = [
  ["mat", "MAT"],
  ["joh", "JHN"],
  ["rom", "ROM"],
  ["gal", "GAL"],
  ["heb", "HEB"],
  ["jam", "JAS"],
];

export async function probeOtherBooks() {
  const results = [];
  for (const [abbrev, bookId] of PROBE_BOOKS) {
    const url = `https://www.godrules.net/library/wesley/wesley${abbrev}1.htm`;
    const res = await politeGet(url, { delayMs: 300 });
    results.push({ bookId, abbrev, url, status: res.status, ok: res.ok });
  }
  return results;
}

export async function scanGodrules() {
  return {
    host: "godrules.net",
    generatedAt: new Date().toISOString(),
    existingRevelationRows: await verifyExistingRevelationRows(),
    otherBookProbe: await probeOtherBooks(),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await scanGodrules();
  console.log(JSON.stringify(result, null, 2));
}
