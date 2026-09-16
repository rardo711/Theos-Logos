/**
 * Durable translation cache keyed by content_hash + engine + target_locale.
 * Layers: process memory → filesystem (.data/translation-cache) → Neon when
 * DATABASE_URL is set. Avoids importing src/lib/db.ts (PGLite/Vite glob) so
 * unit tests stay hermetic.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { TRANSLATE_ENGINE, type TranslateEngine } from "./engine.ts";

export function contentHash(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

const memory = new Map<string, string>();

function memKey(hash: string, engine: TranslateEngine, target: string): string {
  return `${engine}:${target}:${hash}`;
}

function fsPath(hash: string, engine: TranslateEngine, target: string): string {
  return join(
    process.cwd(),
    ".data",
    "translation-cache",
    engine,
    target,
    `${hash}.txt`,
  );
}

async function readFs(
  hash: string,
  engine: TranslateEngine,
  target: string,
): Promise<string | null> {
  try {
    return await readFile(fsPath(hash, engine, target), "utf8");
  } catch {
    return null;
  }
}

async function writeFs(
  hash: string,
  engine: TranslateEngine,
  target: string,
  translated: string,
): Promise<void> {
  try {
    const file = fsPath(hash, engine, target);
    await mkdir(join(file, ".."), { recursive: true });
    await writeFile(file, translated, "utf8");
  } catch (err) {
    console.warn(
      `[translate] fs cache write failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

async function readNeon(
  hash: string,
  engine: TranslateEngine,
  target: string,
): Promise<string | null> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  try {
    const { default: pg } = await import("pg");
    const pool = new pg.Pool({ connectionString: url, max: 1 });
    try {
      const res = await pool.query<{ translated: string }>(
        `select translated from translation_cache
         where content_hash = $1 and engine = $2 and target_locale = $3
         limit 1`,
        [hash, engine, target],
      );
      return res.rows[0]?.translated ?? null;
    } finally {
      await pool.end();
    }
  } catch (err) {
    console.warn(
      `[translate] neon cache read failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
}

async function writeNeon(opts: {
  hash: string;
  engine: TranslateEngine;
  target: string;
  source: string;
  translated: string;
}): Promise<void> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return;
  try {
    const { default: pg } = await import("pg");
    const pool = new pg.Pool({ connectionString: url, max: 1 });
    try {
      await pool.query(
        `create table if not exists translation_cache (
          content_hash text not null,
          engine text not null,
          target_locale text not null,
          source_locale text not null default 'en',
          translated text not null,
          created_at timestamptz not null default now(),
          primary key (content_hash, engine, target_locale)
        )`,
      );
      await pool.query(
        `insert into translation_cache
           (content_hash, engine, target_locale, source_locale, translated)
         values ($1, $2, $3, $4, $5)
         on conflict (content_hash, engine, target_locale)
         do update set translated = excluded.translated`,
        [opts.hash, opts.engine, opts.target, opts.source, opts.translated],
      );
    } finally {
      await pool.end();
    }
  } catch (err) {
    console.warn(
      `[translate] neon cache write failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

export async function getCachedTranslation(opts: {
  text: string;
  engine?: TranslateEngine;
  targetLocale: string;
}): Promise<string | null> {
  const engine = opts.engine ?? TRANSLATE_ENGINE;
  const hash = contentHash(opts.text);
  const mk = memKey(hash, engine, opts.targetLocale);
  const hit = memory.get(mk);
  if (hit != null) return hit;

  const fromFs = await readFs(hash, engine, opts.targetLocale);
  if (fromFs != null) {
    memory.set(mk, fromFs);
    return fromFs;
  }

  const fromNeon = await readNeon(hash, engine, opts.targetLocale);
  if (fromNeon != null) {
    memory.set(mk, fromNeon);
    void writeFs(hash, engine, opts.targetLocale, fromNeon);
    return fromNeon;
  }
  return null;
}

export async function saveCachedTranslation(opts: {
  text: string;
  translated: string;
  engine?: TranslateEngine;
  targetLocale: string;
  sourceLocale?: string;
}): Promise<void> {
  const engine = opts.engine ?? TRANSLATE_ENGINE;
  const hash = contentHash(opts.text);
  const mk = memKey(hash, engine, opts.targetLocale);
  memory.set(mk, opts.translated);
  await writeFs(hash, engine, opts.targetLocale, opts.translated);
  await writeNeon({
    hash,
    engine,
    target: opts.targetLocale,
    source: opts.sourceLocale ?? "en",
    translated: opts.translated,
  });
}

/** Test helper — clear in-process memo between cases. */
export function clearTranslationMemory(): void {
  memory.clear();
}
