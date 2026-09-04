import type { Locale } from "../bible/books.ts";
import type { DeskSynthesis, SourceCard } from "../bible/types.ts";
// Relative, not "@/lib/...": this is a value import, and the alias is a Vite
// resolution that node --experimental-strip-types does not apply, which kept
// synthesize.test.ts from running at all.
import { geminiApiKey, generateGeminiJson } from "../ai/gemini.ts";
import { validateReceptionOutput } from "./retrieve.ts";
import { longQuotedSpans } from "./quoted.ts";

/**
 * Below this, a quoted span is a phrase rather than an attributed quotation:
 * a word from the verse under discussion, a term of art. Above it, the span
 * has to be found on the desk or in the verse before the reader sees it.
 */
const ATTRIBUTABLE_QUOTE = 24;

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

  return `You are a desk librarian for Theos Logos. You synthesize ONLY from the source cards already on the desk. You are not a preacher and you do not invent theology.\n\nSTRICT RULES:\n1. ZERO EXTERNAL MEMORY. Use only the cards in DESK CARDS. Do not recall Church Fathers, Reformers, or doctrines from training data.\n2. Do not claim \"most theologians\" or \"the church teaches\" unless the provided cards actually converge on that point. If they disagree, say they disagree and name the voices.\n3. Every material claim must name at least one card voice from DESK CARDS.\n4. If you include a quotation, it MUST be an exact substring of that card's quote field, or of the verse text given above. Ellipses may only bridge clauses inside that same quote. Quoting the verse under discussion is allowed and often clearest; quoting anything neither on a card nor in the verse is not.\n5. Do not scrape the web. Do not add sources that are not on the desk.\n6. Two to five short paragraphs. No homily. No altar call.\n7. ${language}\n8. Return valid JSON only:\n{\n  \"answer\": string,\n  \"cited\": string[],\n  \"quotes\": [{ \"voice\": string, \"quote\": string }]\n}`;
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
  verseText = "",
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
    // The verse under discussion belongs in the haystack. Quoting the passage
    // being expounded is not a fabrication, and leaving it out rejected honest
    // answers to the plainest question a reader can ask of a verse.
    const grounds = [...cards.map((c) => c.quote), verseText]
      .filter(Boolean)
      .join(" \n\n ");

    // What the reader actually sees is `answer`. It was never checked: a
    // fabricated quotation inside the prose passed as long as the model left
    // it out of the `quotes` array. Every attributable span in the answer now
    // has to be found on the desk or in the verse.
    for (const span of longQuotedSpans(answer, ATTRIBUTABLE_QUOTE)) {
      if (!validateReceptionOutput({ status: "valid", quote: span }, grounds)) {
        return null;
      }
    }

    // `quotes` is metadata and is never rendered. A single unverifiable entry
    // here used to discard a sound answer, which is how a correct synthesis
    // became "could not be verified" on screen. Drop the entry instead; the
    // prose it would have supported has already been checked above.
    if (Array.isArray(parsed.quotes)) {
      for (const q of parsed.quotes) {
        const quote = String(q.quote ?? "").trim();
        if (!quote) continue;
        const card = q.voice
          ? byVoice.get(String(q.voice).trim().toLowerCase())
          : undefined;
        const haystack = card?.quote ?? grounds;
        if (!validateReceptionOutput({ status: "valid", quote }, haystack)) {
          console.warn(
            `[reception] dropped an unverifiable quotes[] entry from ${q.voice ?? "an unnamed voice"}`,
          );
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
    const parsed = parseSynthesis(raw, opts.cards, question, opts.verseText);
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
