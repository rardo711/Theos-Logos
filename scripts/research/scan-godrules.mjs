/**
 * Godrules currently supplies only Wesley's Explanatory Notes on Revelation
 * (catalog-weak-nt.ts, wesleyrev{1-22}.htm) and Geneva Bible notes on
 * Revelation. This checks those 22 rows still resolve.
 *
 * An earlier version of this scanner also probed whether Wesley's Notes
 * exist for other NT books on the same host. Dropped: Wesley says in his own
 * preface that his notes draw heavily on Bengel's Gnomon, already indexed
 * separately via Bible Hub, so most of what "more Wesley" would add is a
 * shorter version of a voice already on the desk. See scan-adam-clarke.mjs
 * for the source that was substituted for it.
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

export async function scanGodrules() {
  return {
    host: "godrules.net",
    generatedAt: new Date().toISOString(),
    existingRevelationRows: await verifyExistingRevelationRows(),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await scanGodrules();
  console.log(JSON.stringify(result, null, 2));
}
