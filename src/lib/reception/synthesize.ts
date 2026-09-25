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

/**
 * First long quoted span in an answer that cannot be found on the desk or in
 * the verse, or null when every attributable span verifies. Exported so a
 * failed synthesis can name the offending span in its retry nudge.
 */
export function firstUnverifiableSpan(
  answer: string,
  cards: SourceCard[],
  verseText?: string,
): string | null {
  // The verse under discussion belongs in the haystack. Quoting the passage
  // being expounded is not a fabrication, and leaving it out rejected honest
  // answers to the plainest question a reader can ask of a verse.
  const grounds = [...cards.map((c) => c.quote), verseText ?? ""]
    .filter(Boolean)
    .join(" \n\n ");
  for (const span of longQuotedSpans(answer, ATTRIBUTABLE_QUOTE)) {
    if (!validateReceptionOutput({ status: "valid", quote: span }, grounds)) {
      return span;
    }
  }
  return null;
}

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

export function synthesistSystem(
  locale: Locale,
  opts?: { brief?: boolean; noCards?: boolean },
): string {
  const language =
    locale === "es"
      ? "Write 'answer' in Spanish. Any quoted phrase copied from a card must stay in the source language of that card."
      : "Write 'answer' in English. Any quoted phrase copied from a card must stay in the source language of that card.";
  // Explicit verse questions get a short direct answer; the empty-question
  // summary keeps the fuller multi-paragraph form.
  const lengthRule = opts?.brief
    ? "6. Answer the inquiry directly in one or two short sentences. No paragraph, no preamble, no outline."
    : "6. Two to five short paragraphs of connected prose. No homily. No altar call. Never reproduce a source's numbered outline (a) b) c) or 1. 2. 3.) as the answer — name the voice and say in a sentence what they claim about THIS verse. Each paragraph must develop a distinct point; do not restate the same claim in more than one paragraph.";

  // With no commentary cards on the desk, the verse text above is the only
  // source. The model must not reach for training-data theology to fill the
  // gap; if the verse alone cannot answer, it says so and points at the
  // commentaries.
  if (opts?.noCards) {
    return `You are a desk librarian for Theos Logos. There are no commentary cards on the desk; the verse text given above is your only source. You are not a preacher and you do not invent theology.\n\nSTRICT RULES:\n1. ZERO EXTERNAL MEMORY. Use only the verse text given above. Do not recall Church Fathers, Reformers, doctrines, or lexicons from training data.\n2. Do not claim \"most theologians\" or \"the church teaches\" — there are no sources on the desk for such claims.\n3. Do not invent commentators or attribute views to anyone.\n4. If you include a quotation, it MUST be an exact substring of the verse text given above. Quoting anything else is not allowed.\n5. Do not scrape the web. Do not add sources that are not on the desk.\n${lengthRule}\n7. ${language}\n8. If the verse text alone cannot answer the inquiry, say so plainly in one or two sentences and suggest gathering commentaries for this verse.\n9. If the inquiry is not about this verse or its immediate passage context, do NOT answer it from training data. Reply in one or two sentences explaining that this question box only answers questions about the referenced verse, and suggest gathering commentaries or using Search for broader topics.\n10. Return valid JSON only:\n{\n  \"answer\": string,\n  \"cited\": string[],\n  \"quotes\": [{ \"voice\": string, \"quote\": string }]\n}`;
  }

  return `You are a desk librarian for Theos Logos. You synthesize ONLY from the source cards already on the desk. You are not a preacher and you do not invent theology.\n\nSTRICT RULES:\n1. ZERO EXTERNAL MEMORY. Use only the cards in DESK CARDS. Do not recall Church Fathers, Reformers, or doctrines from training data.\n2. Do not claim \"most theologians\" or \"the church teaches\" unless the provided cards actually converge on that point. If they disagree, say they disagree and name the voices.\n3. Every material claim must name at least one card voice from DESK CARDS.\n4. If you include a quotation, it MUST be an exact substring of that card's quote field, or of the verse text given above. Ellipses may only bridge clauses inside that same quote. Quoting the verse under discussion is allowed and often clearest; quoting anything neither on a card nor in the verse is not.\n5. Do not scrape the web. Do not add sources that are not on the desk.\n${lengthRule}\n7. ${language}\n8. If the inquiry is not about this verse or its immediate passage context, do NOT answer it. Reply in one or two sentences explaining that this question box only answers questions about the referenced verse, and suggest gathering commentaries or using Search for broader topics.\n9. Return valid JSON only:\n{\n  \"answer\": string,\n  \"cited\": string[],\n  \"quotes\": [{ \"voice\": string, \"quote\": string }]\n}`;
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
    opts.cards.length ? corpusFromCards(opts.cards) : "(none — answer from the verse text only)",
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
    const grounds = [...cards.map((c) => c.quote), verseText ?? ""]
      .filter(Boolean)
      .join(" \n\n ");

    // What the reader actually sees is `answer`. It was never checked: a
    // fabricated quotation inside the prose passed as long as the model left
    // it out of the `quotes` array. Every attributable span in the answer now
    // has to be found on the desk or in the verse.
    const badSpan = firstUnverifiableSpan(answer, cards, verseText);
    if (badSpan != null) {
      console.warn(
        `[reception] synthesis rejected: unverifiable quoted span ${JSON.stringify(badSpan.slice(0, 160))}`,
      );
      return null;
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

/**
 * Remove the quotation marks wrapping the first quoted occurrence of `span`,
 * leaving the inner text in place. Used as a last resort when the gate
 * rejects a synthesis: the words read as the model's paraphrase instead of
 * a verbatim quotation, so no fabricated quotation is ever shown.
 */
function unquoteFirst(answer: string, span: string): string {
  const esc = span.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const quoted = new RegExp(`["\u201C\u201D]\\s*${esc}\\s*["\u201C\u201D]`);
  return answer.replace(quoted, (m) =>
    m.replace(/^["\u201C\u201D]\s*/, "").replace(/\s*["\u201C\u201D]$/, ""),
  );
}

/**
 * Strip the quotation marks around every span the gate cannot verify, then
 * report whether any attributable span remains. Exported for tests.
 */
export function dropUnverifiableQuotes(
  answer: string,
  cards: SourceCard[],
  verseText = "",
): string {
  let out = answer;
  for (let i = 0; i < 8; i++) {
    const span = firstUnverifiableSpan(out, cards, verseText);
    if (span == null) break;
    const next = unquoteFirst(out, span);
    if (next === out) break;
    out = next;
  }
  return out;
}

export async function synthesizeFromDesk(opts: {
  reference: string;
  verseText: string;
  question: string;
  cards: SourceCard[];
  locale: Locale;
}): Promise<SynthesisResult> {
  const locale: Locale = opts.locale === "es" ? "es" : "en";
  const isExplicitQuestion = opts.question.trim().length > 0;
  const question =
    opts.question.trim() ||
    (locale === "es"
      ? "¿Qué dicen estas fuentes que significa este versículo?"
      : "What do these sources say this verse means?");

  if (!opts.cards.length && !isExplicitQuestion) {
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
    const noCards = opts.cards.length === 0;
    const system = synthesistSystem(locale, {
      brief: isExplicitQuestion,
      noCards,
    });
    const userMessage = synthesistUser({ ...opts, question, locale });
    const tokenBudget = isExplicitQuestion ? 350 : 1400;
    const raw = await generateGeminiJson({
      system,
      user: userMessage,
      temperature: 0.1,
      maxOutputTokens: tokenBudget,
    });
    const parsed = parseSynthesis(raw, opts.cards, question, opts.verseText);
    if (parsed) {
      return {
        ...parsed,
        caution:
          locale === "es"
            ? "Síntesis a partir de las fichas ya reunidas en este escritorio. No es una búsqueda en la red ni un recuerdo paramétrico."
            : "Synthesized from the cards already gathered on this desk. Not a web search and not parametric recall.",
      };
    }
    // One retry: the model sometimes paraphrases inside quotation marks or
    // mangles a span. Name the offending span when it can be identified so
    // the correction is precise. The gate stays strict on the second pass.
    let failedSpan: string | null = null;
    try {
      const first = JSON.parse(raw) as { answer?: unknown };
      const firstAnswer = String(first.answer ?? "").trim();
      if (firstAnswer) {
        failedSpan = firstUnverifiableSpan(
          firstAnswer,
          opts.cards,
          opts.verseText,
        );
      }
    } catch {
      failedSpan = null;
    }
    const sourcePhrase = noCards ? "the verse text" : "the desk cards or the verse text";
    const nudge = failedSpan
      ? `\n\nCORRECTION: your previous answer was rejected because the quotation ${JSON.stringify(failedSpan.slice(0, 200))} is not an exact substring of ${sourcePhrase}. Regenerate the answer now, quoting ONLY exact substrings from ${sourcePhrase}, or paraphrase without quotation marks where you are unsure.`
      : `\n\nCORRECTION: your previous answer was rejected because it contained a quotation that is not an exact substring of ${sourcePhrase}, or it was not valid JSON. Regenerate the answer now, quoting ONLY exact substrings from ${sourcePhrase}, or paraphrase without quotation marks where you are unsure.`;
    const retryRaw = await generateGeminiJson({
      system,
      user: userMessage + nudge,
      temperature: 0.1,
      maxOutputTokens: tokenBudget,
    });
    const retried = parseSynthesis(retryRaw, opts.cards, question, opts.verseText);
    if (retried) {
      return {
        ...retried,
        caution:
          locale === "es"
            ? "Síntesis a partir de las fichas ya reunidas en este escritorio. No es una búsqueda en la red ni un recuerdo paramétrico."
            : "Synthesized from the cards already gathered on this desk. Not a web search and not parametric recall.",
      };
    }
    // Last resort: the model paraphrased inside quotation marks and even the
    // retry could not produce a verifiable span. Rather than blanking the
    // panel, drop the quotation marks around the offending spans so they read
    // as the model's paraphrase, then run the gate again. A fabricated
    // verbatim quotation is never shown; the words stay attributed to the
    // cited voices as synthesis.
    try {
      const retryParsed = JSON.parse(
        retryRaw.slice(retryRaw.indexOf("{"), retryRaw.lastIndexOf("}") + 1),
      ) as { answer?: unknown; cited?: unknown };
      const retryAnswer = String(retryParsed.answer ?? "").trim();
      if (retryAnswer) {
        const salvaged = dropUnverifiableQuotes(
          retryAnswer,
          opts.cards,
          opts.verseText,
        );
        const final = parseSynthesis(
          JSON.stringify({
            answer: salvaged,
            cited: retryParsed.cited,
            quotes: [],
          }),
          opts.cards,
          question,
          opts.verseText,
        );
        if (final) {
          return {
            ...final,
            caution:
              locale === "es"
                ? "Síntesis a partir de las fichas ya reunidas en este escritorio. No es una búsqueda en la red ni un recuerdo paramétrico."
                : "Synthesized from the cards already gathered on this desk. Not a web search and not parametric recall.",
          };
        }
      }
    } catch {
      // fall through to the verification-failure message
    }
    return {
      question,
      answer: "",
      cited: opts.cards.map((c) => c.voice),
      caution:
        locale === "es"
          ? "La síntesis no pudo verificarse contra las fichas. No se muestra un texto no fundamentado."
          : "The synthesis could not be verified against the desk cards. Ungrounded text is not shown.",
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
