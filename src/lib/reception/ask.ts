import { createServerFn } from "@tanstack/react-start";
import { geminiApiKey, generateGeminiJson } from "@/lib/ai/gemini";
import { getCurated } from "./curated";
import type { ReceptionResult, SourceCard, Tradition } from "@/lib/bible/types";

const TRADITIONS = new Set<Tradition>([
  "patristic",
  "reformed",
  "lutheran",
  "catholic",
  "orthodox",
  "confession",
]);

function parseCards(raw: string): SourceCard[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return [];
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      cards?: Array<Partial<SourceCard>>;
    };
    if (!Array.isArray(parsed.cards)) return [];
    const cards: SourceCard[] = [];
    for (const c of parsed.cards) {
      if (!c.voice || !c.quote || !c.citation) continue;
      const tradition = TRADITIONS.has(c.tradition as Tradition)
        ? (c.tradition as Tradition)
        : "patristic";
      cards.push({
        voice: String(c.voice).slice(0, 80),
        work: String(c.work ?? "").slice(0, 120),
        tradition,
        quote: String(c.quote).slice(0, 600),
        note: c.note ? String(c.note).slice(0, 280) : undefined,
        citation: String(c.citation).slice(0, 160),
        paraphrased: Boolean(c.paraphrased),
      });
      if (cards.length >= 5) break;
    }
    return cards;
  } catch {
    return [];
  }
}

const SYSTEM = `You are a research librarian for Theos Logos, a grammatical-historical Bible study desk.
You are not a preacher, chaplain, or chatbot. You retrieve how the Church has received a text.

Rules:
- Return JSON only: {"cards":[{voice,work,tradition,quote,note,citation,paraphrased}],"caution":string}
- tradition must be one of: patristic, reformed, lutheran, catholic, orthodox, confession
- Prefer primary voices: Church Fathers, Reformers, Puritans, historic confessions (Nicene, Chalcedon, WCF, Heidelberg, 39 Articles, Canons of Dort, Council of Trent only as a Catholic voice).
- Never invent a quotation. If you cannot recall a wording with confidence, paraphrase and set paraphrased=true.
- 3 to 4 cards, different voices. Short quotes (1–3 sentences).
- Include a real citation (work + locus). If unsure of a page/section, say so in citation.
- No homily. No "application for your life." No modern celebrity pastors.
- If a reader question is present, gather ADDITIONAL historic voices aimed at that question. Do not repeat a generic Augustine/Chrysostom/Calvin/Westminster stack unless a quote uniquely answers the question.`;

export const askReception = createServerFn({ method: "POST" })
  .validator(
    (input: {
      bookId: string;
      bookName: string;
      chapter: number;
      verse: number | null;
      verseText: string;
      passage: string;
      question?: string;
      mode: "reception" | "traditions";
    }) => input,
  )
  .handler(async ({ data }): Promise<ReceptionResult> => {
    const question = data.question?.trim() ?? "";
    const ready = getCurated(data.bookId, data.chapter, data.verse);

    if (data.mode === "reception" && !question && ready) return ready;

    if (!geminiApiKey()) {
      if (ready) return ready;
      return {
        source: "generated",
        cards: [],
        caution:
          "Inquire needs GEMINI_API_KEY on the host. Desk notes still work without it.",
      };
    }

    const ref =
      data.verse != null
        ? `${data.bookName} ${data.chapter}:${data.verse}`
        : `${data.bookName} ${data.chapter}`;

    const focus =
      data.mode === "traditions"
        ? "Compare how distinct historic traditions received this text. Include at least one patristic, one Reformation (reformed or lutheran), and one catholic or orthodox voice. Fair, sourced, not polemical."
        : question
          ? "Gather ADDITIONAL historic voices aimed at the reader's question. Do not repeat a generic Augustine/Chrysostom/Calvin/Westminster stack unless a quote uniquely answers the question."
          : "Gather the historic reception of this verse.";

    const user = [
      focus,
      `Reference: ${ref}`,
      data.verseText ? `Verse: ${data.verseText}` : "",
      data.passage ? `Context:\n${data.passage.slice(0, 1800)}` : "",
      question
        ? `Reader's question (do not preach; let it aim the sources): ${question}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    let text: string;
    try {
      text = await generateGeminiJson({
        system: SYSTEM,
        user,
        maxOutputTokens: 1600,
      });
    } catch (err) {
      if (ready && !question) return ready;
      throw err instanceof Error ? err : new Error("Reception request failed.");
    }

    const cards = parseCards(text);
    if (!cards.length) {
      if (ready && !question) return ready;
      throw new Error("No sourced cards could be assembled.");
    }

    return {
      source: "generated",
      cards,
      caution:
        "Generated from memory of public-domain sources. Verify against the printed works before citing.",
    };
  });
