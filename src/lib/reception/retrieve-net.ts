import { type CatalogEntry, mapCatalog } from "./catalog.ts";
import {
  type FetchedExtract,
  paragraphsFromHtml,
  pickVerseParagraphs,
} from "./retrieve-html.ts";

const HOSTS = new Set([
  "www.newadvent.org",
  "newadvent.org",
  "ccel.org",
  "www.ccel.org",
  "bookofconcord.org",
  "www.bookofconcord.org",
  "biblehub.com",
  "www.biblehub.com",
  "godrules.net",
  "www.godrules.net",
]);

const FETCH_MS = 10_000;
const MAX_BYTES = 180_000;
/**
 * New Advent serves whole treatises on one page: the Enchiridion, single books
 * of the City of God, and each Chrysostom homily. Section 98 of the Enchiridion
 * sits well past the default cap, so the passage never reached the librarian.
 */
const MAX_BYTES_LONG_PAGE = 600_000;
const LONG_PAGE_HOSTS = new Set(["www.newadvent.org", "newadvent.org"]);

function byteCapFor(url: string): number {
  try {
    return LONG_PAGE_HOSTS.has(new URL(url).hostname)
      ? MAX_BYTES_LONG_PAGE
      : MAX_BYTES;
  } catch {
    return MAX_BYTES;
  }
}

function allowed(url: string): boolean {
  try {
    return HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

async function getPage(url: string): Promise<string | null> {
  if (!allowed(url)) {
    console.warn(`[reception] host not allowed: ${url}`);
    return null;
  }
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "TheosLogos/1.0 (primary-source retrieval; educational)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(FETCH_MS),
    });
    if (!res.ok) {
      console.warn(`[reception] fetch ${res.status} ${url}`);
      return null;
    }
    const buf = await res.arrayBuffer();
    const cap = byteCapFor(url);
    const slice = buf.byteLength > cap ? buf.slice(0, cap) : buf;
    return new TextDecoder("utf-8", { fatal: false }).decode(slice);
  } catch (err) {
    const why = err instanceof Error ? err.name : "unknown";
    console.warn(`[reception] fetch failed (${why}) ${url}`);
    return null;
  }
}

export async function fetchEntry(
  entry: CatalogEntry,
  query: string,
  target?: { chapter?: number; verse?: number | null },
): Promise<FetchedExtract | null> {
  for (const url of [entry.url, entry.altUrl].filter(Boolean) as string[]) {
    const html = await getPage(url);
    if (!html) continue;
    const paras = pickVerseParagraphs(
      paragraphsFromHtml(html),
      target?.chapter,
      target?.verse ?? undefined,
      query,
      4,
    );
    if (!paras.length) continue;
    return { entry, url, paragraphs: paras };
  }
  return null;
}

export async function retrieveExtracts(opts: {
  question: string;
  bookId?: string;
  chapter?: number;
  verse?: number | null;
  verseText?: string;
  mode?: "reception" | "traditions";
  excludeUrls?: string[];
}): Promise<FetchedExtract[]> {
  const query = [opts.question, opts.verseText].filter(Boolean).join(" ");
  const focused = Boolean(opts.question.trim());
  const limit = focused ? 8 : 7;
  const exclude = new Set((opts.excludeUrls ?? []).filter(Boolean));
  const mapped = mapCatalog({
    ...opts,
    limit: exclude.size ? limit + 6 : limit,
  }).filter(
    (e) => !exclude.has(e.url) && !(e.altUrl && exclude.has(e.altUrl)),
  );
  const take = mapped.slice(0, limit);
  const found = await Promise.all(
    take.map((e) =>
      fetchEntry(e, query, { chapter: opts.chapter, verse: opts.verse }),
    ),
  );
  const extracts = found.filter((x): x is FetchedExtract => x != null);
  if (take.length && !extracts.length) {
    console.warn(
      `[reception] all ${take.length} catalog pages failed to yield extracts`,
    );
  }
  return extracts;
}
