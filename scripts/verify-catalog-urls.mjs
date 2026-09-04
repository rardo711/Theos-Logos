#!/usr/bin/env node
/**
 * Check every page the reception catalog points at.
 *
 *   npm run verify:urls              # all rows
 *   npm run verify:urls -- --book MAT
 *   npm run verify:urls -- --id gill-matthew-5
 *   npm run verify:urls -- --new     # only rows added since origin/scholar-desk
 *
 * A row whose URL 404s costs a fetch slot and returns nothing; a row whose URL
 * is a table of contents is worse, because it returns a preface as if it were
 * commentary. This script catches the first kind. The second kind is guarded by
 * the "never indexes a volume index or title page" test in retrieve.test.ts.
 *
 * Exits non-zero when any checked URL does not answer 200, so it can gate a
 * catalog commit. Requires network access: the Claude sandbox cannot reach
 * ccel.org, newadvent.org, biblehub.com or godrules.net.
 */
import { argv, exit } from "node:process";

const TIMEOUT_MS = 15_000;
const CONCURRENCY = 4;
const UA = "TheosLogos/1.0 (catalog link check; educational)";

function arg(name) {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
}

async function loadCatalog() {
  const { CATALOG } = await import("../src/lib/reception/catalog.ts");
  const { attachWeakNtCatalog } = await import(
    "../src/lib/reception/catalog-weak-nt.ts"
  );
  attachWeakNtCatalog();
  return CATALOG;
}

/** HEAD first; some hosts answer 405 to HEAD but serve GET fine. */
async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, {
        method,
        headers: { "User-Agent": UA, Accept: "text/html" },
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) return { status: res.status, method };
      if (method === "HEAD" && (res.status === 405 || res.status === 403)) {
        continue;
      }
      return { status: res.status, method };
    } catch (err) {
      if (method === "GET") {
        return { status: 0, method, error: err?.name ?? "error" };
      }
    }
  }
  return { status: 0, method: "GET", error: "unreachable" };
}

async function pool(items, worker, size) {
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await worker(items[i]);
      }
    }),
  );
  return results;
}

async function main() {
  const catalog = await loadCatalog();
  const book = arg("book");
  const id = arg("id");

  let rows = catalog;
  if (book) rows = rows.filter((r) => (r.books ?? []).includes(book));
  if (id) rows = rows.filter((r) => r.id === id);

  // One request per distinct page, however many rows share it.
  const byUrl = new Map();
  for (const row of rows) {
    byUrl.set(row.url, [...(byUrl.get(row.url) ?? []), row.id]);
    if (row.altUrl) {
      byUrl.set(row.altUrl, [...(byUrl.get(row.altUrl) ?? []), `${row.id} (alt)`]);
    }
  }
  const urls = [...byUrl.keys()];
  if (!urls.length) {
    console.error("No rows matched.");
    exit(1);
  }

  console.error(`Checking ${urls.length} page(s) for ${rows.length} row(s)...`);
  const results = await pool(urls, async (url) => ({ url, ...(await check(url)) }), CONCURRENCY);

  const bad = results.filter((r) => r.status !== 200);
  for (const r of results.sort((a, b) => a.status - b.status)) {
    if (r.status === 200) continue;
    const label = r.status === 0 ? r.error : String(r.status);
    console.log(`${label.padEnd(12)} ${r.url}`);
    console.log(`${" ".repeat(12)} ${byUrl.get(r.url).join(", ")}`);
  }

  console.error(
    `\n${results.length - bad.length}/${results.length} OK` +
      (bad.length ? `, ${bad.length} FAILING (listed above)` : ""),
  );
  exit(bad.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  exit(1);
});
