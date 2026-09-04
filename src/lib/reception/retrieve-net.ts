import { type CatalogEntry, mapCatalog } from "./catalog.ts";
import {
  type FetchedExtract,
  paragraphsFromHtml,
  pickParagraphs,
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

const FETCH_MS = 7_000;
const MAX_BYTES = 180_000;

function allowed(url: string): boolean {
  try {
    return HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

async function getPage(url: string): Promise<string | null> {
  if (!allowed(url)) return null;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "TheosLogos/1.0 (primary-source retrieval; educational)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(FETCH_MS),
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const slice = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
    return new TextDecoder("utf-8", { fatal: false }).decode(slice);
  } catch {
    return null;
  }
}

export async function fetchEntry(
  entry: CatalogEntry,
  query: string,
): Promise<FetchedExtract | null> {
  for (const url of [entry.url, entry.altUrl].filter(Boolean) as string[]) {
    const html = await getPage(url);
    if (!html) continue;
    const paras = pickParagraphs(paragraphsFromHtml(html), query, 4);
    if (!paras.length) continue;
    return { entry, url, paragraphs: paras };
  }
  return null;
}

export async function retrieveExtracts(opts: {
  question: string;
  bookId?: string;
  chapter?: number;
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
  const found = await Promise.all(take.map((e) => fetchEntry(e, query)));
  return found.filter((x): x is FetchedExtract => x != null);
}
