import { createServerFn } from "@tanstack/react-start";
import { geminiApiKey, generateGeminiJson } from "@/lib/ai/gemini";
import type { LexiconResult } from "@/lib/bible/types";
import { getLocalLexicon } from "./local";

const SYSTEM = `You write brief lexical notes in the style of a student glossary, not BDAG itself.
JSON only: {"word","lemma","language":"hebrew"|"greek"|"aramaic", "gloss","range","citation","caution"}
- Identify the likely original-language lemma behind the English word in this verse.
- gloss: one or two sentences of sense in context.
- range: short semantic range.
- citation: name a real lexicon (BDB, HALOT, BDAG, LSJ) and say this is an approximation.
- Never claim to quote BDAG/HALOT verbatim (copyright). Always caution to verify the printed work.
- No sermon.`;

export const askLexicon = createServerFn({ method: "POST" })
  .validator(
    (input: {
      word: string;
      reference: string;
      verseText: string;
    }) => input,
  )
  .handler(async ({ data }): Promise<LexiconResult> => {
    const local = getLocalLexicon(data.word, data.reference);
    if (!geminiApiKey()) {
      if (local) return local;
      return {
        word: data.word,
        gloss: "No desk note for this English word yet.",
        range: "",
        citation: "",
        caution: "Consult BDAG or HALOT for formal study.",
      };
    }

    let raw: string;
    try {
      raw = await generateGeminiJson({
        system: SYSTEM,
        user: `Word: "${data.word}"\nReference: ${data.reference}\nVerse: ${data.verseText}`,
        temperature: 0.1,
        maxOutputTokens: 500,
      });
    } catch (err) {
      if (local) return local;
      throw err instanceof Error ? err : new Error("Lexicon request failed.");
    }

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) {
      if (local) return local;
      throw new Error("Could not parse lexical note.");
    }
    const parsed = JSON.parse(raw.slice(start, end + 1)) as Partial<LexiconResult>;
    return {
      word: String(parsed.word ?? data.word),
      lemma: parsed.lemma ? String(parsed.lemma) : undefined,
      language:
        parsed.language === "hebrew" ||
        parsed.language === "greek" ||
        parsed.language === "aramaic"
          ? parsed.language
          : undefined,
      gloss: String(parsed.gloss ?? "").slice(0, 500),
      range: String(parsed.range ?? "").slice(0, 400),
      citation: String(parsed.citation ?? "").slice(0, 200),
      caution:
        String(parsed.caution ?? "").slice(0, 240) ||
        "Approximate note only. Confirm in BDAG or HALOT.",
    };
  });
