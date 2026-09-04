import type { Locale } from "../bible/books.ts";
import type { DeskSynthesis, SourceCard } from "../bible/types.ts";
// Relative, not "@/lib/...": this is a value import, and the alias is a Vite
// resolution that node --experimental-strip-types does not apply, which kept
// synthesize.test.ts from running at all.
import { geminiApiKey, generateGeminiJson } from "../ai/gemini.ts";
import { validateReceptionOutput } from "./retrieve.ts";

export type SynthesisResult = DeskSynthesis & { caution?: string };

function corpusFromCards(cards: SourceCard[]): string {
  return cards
    .map((c, i) => {
      const bits = [
        `CARD ${i + 1}`,
        `voice: ${c.voice}`,
        `work: ${c.work}`,
        `tradition: ${c.tradition}`,
        `citation: ${c.citation}`,
        c.url ? `url: ${c.url}` : "",
        c.contextBridge ? `context_bridge: ${c.contextBridge}` : "",
        `quote: """${c.quote}"""`,
      ];
      return bits.filter(Boolean).join("\n");
    })
    .join("\n\n");
}

export function synthesistSystem(locale: Locale): string {
  const language =
    locale === "es"
      ? "Write 'answer' in Spanish. Any quoted phrase copied from a card must stay in the source language of that card."
      : "Write 'answer' in English. Any quoted phrase copied from a card must stay in the source language of that card.";

  return `You are a desk librarian for Theos Logos. You synthesize ONLY from the source cards already on the desk. You are not a preacher and you do not invent theology.\n\nSTRICT RULES:\n1. ZERO EXTERNAL MEMORY. Use only the cards in DESK CARDS. Do not recall Church Fathers, Reformers, or doctrines from training data.\n2. Do not claim \"most theologians\" or \"the church teaches\" unless the provided cards actually converge on that point. If they disagree, say they disagree and name the voices.\n3. Every material claim must name at least one card voice from DESK CARDS.\n4. If you include a quotation, it MUST be an exact substring of that card's quote field. Ellipses may only bridge clauses inside that same quote.\n5. Do not scrape the web. Do not add sources that are not on the desk.\n6. Two to five short paragraphs. No homily. No altar call.\n7. ${language}\n8. Return valid JSON only:\n{\n  \"answer\": string,\n  \"cited\": string[],\n  \"quotes\": [{ \"voice\": string, \"quote\": string }]\n}`;
}

export function synthesistUser(opts: {
  reference: string;
  verseText: string;
  question: string;
  cards: SourceCard[];
  locale: Locale;
}): string {
  const q = opts.question.trim() || "What do these sources say this verse means?";
  const localeLine =
    opts.locale === "es"
      ? "Locale: es. Write the answer in Spanish."
      : "Locale: en.";
  return [
    localeLine,
    `Reference: ${opts.reference}`,
    opts.verseText ? `Verse: ${opts.verseText}` : "",
    `Inquiry: ${q}`,
    "",
    "DESK CARDS:",
    corpusFromCards(opts.cards),
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function parseSynthesis(
  raw: string,
  cards: SourceCard[],
  question: string,
): DeskSynthesis | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      answer?: string;
      cited?: unknown;
      quotes?: Array<{ voice?: string; quote?: string }>;
    };
    const answer = String(parsed.answer ?? "").trim();
    if (!answer) return null;

    const byVoice = new Map(
      cards.map((c) => [c.voice.trim().toLowerCase(), c] as const),
    );
    const allQuotes = cards.map((c) => c.quote).join(" \n\n ");

    if (Array.isArray(parsed.quotes)) {
      for (const q of parsed.quotes) {
        const quote = String(q.quote ?? "").trim();
        if (!quote) continue;
        const card = q.voice
          ? byVoice.get(String(q.voice).trim().toLowerCase())
          : undefined;
        const haystack = card?.quote ?? allQuotes;
        if (!validateReceptionOutput({ status: "valid", quote }, haystack)) {
          return null;
        }
      }
    }

    const cited = Array.isArray(parsed.cited)
      ? parsed.cited
          .map((v) => String(v).trim())
          .filter((v) => cards.some((c) => c.voice.toLowerCase() === v.toLowerCase()))
      : [];
    const fallbackCited = cards.slice(0, 6).map((c) => c.voice);
    return {
      question,
      answer: answer.slice(0, 2400),
      cited: (cited.length ? cited : fallbackCited).slice(0, 8),
    };
  } catch {
    return null;
  }
}

export async function synthesizeFromDesk(opts: {
  reference: string;
  verseText: string;
  question: string;
  cards: SourceCard[];
  locale: Locale;
}): Promise<SynthesisResult> {
  const locale: Locale = opts.locale === "es" ? "es" : "en";
  const question =
    opts.question.trim() ||
    (locale === "es"
      ? "¿Qué dicen estas fuentes que significa este versículo?"
      : "What do these sources say this verse means?");

  if (!opts.cards.length) {
    return {
      question,
      answer: "",
      cited: [],
      caution:
        locale === "es"
          ? "Primero reúna comentarios. Consultar solo lee las fichas que ya están en el escritorio."
          : "Gather commentaries first. Inquire only reads the cards already on this desk.",
    };
  }

  if (!geminiApiKey()) {
    return {
      question,
      answer: "",
      cited: opts.cards.map((c) => c.voice),
      caution:
        locale === "es"
          ? "No hay clave de Gemini. Las fichas del escritorio siguen visibles."
          : "No Gemini key. Desk cards remain visible.",
    };
  }

  try {
    const raw = await generateGeminiJson({
      system: synthesistSystem(locale),
      user: synthesistUser({ ...opts, question, locale }),
      temperature: 0.1,
      maxOutputTokens: 1400,
    });
    const parsed = parseSynthesis(raw, opts.cards, question);
    if (!parsed) {
      return {
        question,
        answer: "",
        cited: opts.cards.map((c) => c.voice),
        caution:
          locale === "es"
            ? "La síntesis no pudo verificarse contra las fichas. No se muestra un texto no fundamentado."
            : "The synthesis could not be verified against the desk cards. Ungrounded text is not shown.",
      };
    }
    return {
      ...parsed,
      caution:
        locale === "es"
          ? "Síntesis a partir de las fichas ya reunidas en este escritorio. No es una búsqueda en la red ni un recuerdo paramétrico."
          : "Synthesized from the cards already gathered on this desk. Not a web search and not parametric recall.",
    };
  } catch (err) {
    return {
      question,
      answer: "",
      cited: opts.cards.map((c) => c.voice),
      caution: err instanceof Error ? err.message : "Synthesis failed.",
    };
  }
}
