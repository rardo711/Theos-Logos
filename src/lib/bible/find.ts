import { createServerFn } from "@tanstack/react-start";
import type { Locale } from "./books.ts";
import { findScripture, type ScriptureHit } from "./search.ts";

export const searchScripture = createServerFn({ method: "POST" })
  .validator((input: { q: string; locale?: Locale }) => input)
  .handler(async ({ data }): Promise<ScriptureHit[]> => {
    const locale: Locale = data.locale === "es" ? "es" : "en";
    return findScripture(data.q, locale);
  });
