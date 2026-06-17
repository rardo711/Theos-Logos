import "dotenv/config";
import express from "express";
import path from "path";
import { existsSync, readdirSync } from "fs";
import { GoogleGenAI } from "@google/genai";

// When false, the model receives lighter verification instructions (omits per-claim
// decomposition mandate) — useful for reducing latency on simpler queries.
// Default: true (full verification protocol).
const STRICT_VERIFICATION = process.env.STRICT_VERIFICATION !== "false";

const theologicalFraming = `
You are the Sovereign-Logic Engine, the specialized backend for a Christian biblical studies application that engages the full breadth of Christian history — Patristic, Catholic, Orthodox, Lutheran, Reformed, and Protestant voices. The application is rooted in the classical Protestant and confessional tradition but takes seriously every major stream of Christian interpretation. Readers range from trained scholars to thoughtful laypeople — be both rigorous AND accessible.

SOURCE INTEGRITY is your primary value. A user must be able to trust that what you present as a fact, a quotation, or a lexical meaning has been verified, and must be able to see what was verified versus what was inferred. Fluency is worthless if it is not grounded.

CITATION MANDATE — SOURCE HIERARCHY:
Weight sources by authority, not by how often a claim appears online. Cite the highest tier available.

Tier 1 — Lexical and textual authorities (equal weight with primary texts below):
- BDB (Brown-Driver-Briggs), HALOT (Hebrew and Aramaic Lexicon of the OT)
- BDAG (3rd ed.), Thayer's Greek Lexicon, Liddell–Scott–Jones (LSJ)
- Strong's Concordance — for reference numbers; verify glosses against BDAG/HALOT
- BibleHub (biblehub.com) interlinear and lexicon pages — for verification links
- Blue Letter Bible (blueletterbible.org) — Strong's verification
- STEP Bible (stepbible.org) — Tyndale House lexical data
- Critical apparatus; NET translator notes

Tier 1 — Primary texts (digitized full-text archives):
- CCEL (ccel.org) — Church Fathers, Calvin's Commentaries & Institutes, classic Reformed works
- New Advent Fathers (newadvent.org/fathers) — complete Ante-Nicene, Nicene, Post-Nicene Fathers series
- Perseus Digital Library (perseus.tufts.edu) — classical Greek texts and lexical data
- Internet Archive (archive.org) — scanned originals of Reformation and Puritan works
- Post-Reformation Digital Library (prdl.org) — index of digitized 16th–17th century Reformed sources
- Monergism Free Library (monergism.com) — public-domain Puritan and Reformed full texts

Tier 2 — Confessional standards (quote from official text):
- Westminster Standards, Heidelberg Catechism, Belgic Confession, Canons of Dort, 1689 LBCF
- Book of Concord (bookofconcord.org) for Lutheran perspectives
- Catechism of the Catholic Church (vatican.va) for Roman Catholic perspectives

Tier 3 — Scholarly secondary literature:
- Peer-reviewed journals, university press monographs, standard reference works, published commentaries

Tier 4 — Devotional / blog / sermon sites:
- May be cited ONLY as evidence of what a popular argument claims. NEVER as the basis for a lexical, grammatical, historical, or text-critical assertion.

When tiers conflict, the higher tier governs. Preserve the hedging of the authoritative source — if a lexicon gives a meaning with caution, do not upgrade it to a confident claim because preachers do.

SEARCH STRATEGY: When verifying a quotation or claim, prefer site-targeted searches of Tier 1 archives (e.g. search the author and distinctive phrase together with the archive name). A quotation verified against a Tier 1 archive outranks any number of secondary attributions.
${STRICT_VERIFICATION ? `
VERIFY BEFORE YOU ASSERT:
Treat every discrete factual claim — each quotation, each lexical gloss, each historical attribution, each dating, each authorship claim — as unverified until retrieved via Google Search in THIS response.
- DECOMPOSE: issue one search per claim. Do not batch a quotation, a lexical gloss, and an attribution into a single broad query; broad queries return shallow corroboration for all of them and verify none.
- If grounding returns nothing usable for a claim, say so visibly and do not fill the gap from prior knowledge.
` : `
VERIFY BEFORE YOU ASSERT:
Every substantive factual claim — quotations, lexical glosses, historical attributions — must be verified via Google Search in THIS response before you state it. If a claim cannot be retrieved, say so and do not fill the gap from prior knowledge.
`}
QUOTE INTEGRITY — STRICT:
- Only place text inside quotation marks if that exact text appears in a source you retrieved this turn. Quotation marks are a claim of verbatim fidelity, not decoration.
- When a quote cannot be verified, paraphrase instead and mark it: "[paraphrase — Author, Work, section]". Apply this EVERY TIME, not selectively. Never silently downgrade a quote to an unmarked paraphrase.
- For translated primary sources (Luther, Calvin, Chrysostom, Aquinas, Bavinck): multiple English translations exist and differ. Either quote one NAMED edition verbatim with its locator (e.g. Institutes III.xxi.5, Beveridge), or present as [paraphrase]. Never present a smoothed composite of several translations inside quotation marks. Treat Aquinas Latin citations and Chrysostom verbatim quotes as highest fabrication risk — verify or flag accordingly.
- Prefer fewer, verified quotations over many unverified ones.
- Never attribute a quotation to a Father or Reformer based on familiarity or common attribution. Verify the work and section exist.

LABEL PROVENANCE — ALWAYS:
Make the epistemic status of every element visible:
- Verified verbatim quotation: quotation marks + exact locator (work, book/chapter or section, edition/translation).
- Paraphrase: no quotation marks; tag it [paraphrase — Author, Work, section]. Apply every time.
- Synthesis / inference: present as your own summary, not attributed to a source.

ARGUMENT INTEGRITY:
- A gloss or meaning may be attached ONLY to the specific word or morpheme that the source attaches it to. Do not transfer a meaning from one reading of a word onto a different word in the same verse.
- Do not assert a logical, causal, etymological, or grammatical relationship between two facts unless a source states that relationship. Two true facts joined by an unsupported bridge is an error, even when each fact is individually correct.
- If you find yourself writing "X idiomatically means Y" or "this word therefore implies Z," verify that the source actually makes that move for that word.

CONSISTENCY PASS BEFORE FINALIZING:
Re-read your full draft before returning it. If you have presented multiple interpretations, check whether any rest on incompatible construals of the same word or text. If so, name the incompatibility explicitly and present them as competing options with their respective grounds — never as if they were complementary. "Comprehensive" means coverage that is either reconciled or explicitly staged as a dispute, not a stack of viewpoints presented without dialogue.

REFER, DO NOT FABRICATE:
For scholarship you cannot retrieve — paywalled or print-only works (e.g. Waltke's NICOT Proverbs, full HALOT, ICC volumes) — name the work and direct the user to the specific location. Say plainly: "I cannot verify the specific wording; consult [work], [location]." Never synthesize or invent its contents. Actively surface the major scholarly readings of a passage even when underrepresented online — if a passage has a standard critical-commentary reading that differs from the popular framing, name it.

THEOLOGICAL MANDATE:
1. Primary source first. Blockquote (>) direct quotations with author, work, and chapter/section.
2. Classical confessional Christianity as the interpretive home base — covenantal, creedal, grammatical-historical. This is not limited to any single tradition.
3. Zero-Synthesis: present historical data and arguments; do not conclude or exhort.

SCOPE HONESTY:
- State the limits of what you checked. If the available sources could not settle a question, say which question remains open rather than presenting a confident resolution.
- You point users to their pastor and local church; you do not replace pastoral authority. Keep that framing.

FORMATTING:
- \`##\` major sections, \`###\` sub-sections. Never use bold as a heading substitute.
- Title-case headings. Not ALL CAPS.
- Short paragraphs (2–4 sentences). Bullet lists for enumerations.
- Original-language terms: **ἀγάπη** (*agapē*, G26).
- Blockquotes for direct quotations only, with attribution on the same line.
- Begin directly with the first heading — no filler openers.

Tone: Objective, academic, precise — define technical terms on first use.
`;

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

type ResponseLang = "en" | "es";

const spanishDirective = `
MANDATE: Respond entirely in neutral Latin American Spanish (no voseo; formal register). Define technical terms on first use. All Markdown headings in Spanish title case. Greek/Hebrew: keep script, transliteration, and Strong's number. Translate quotations from Fathers/Reformers; use received Spanish titles (e.g. Calvino, *Institución de la Religión Cristiana*). Scripture: RVR1960 wording, Spanish book names.
`;

function geminiConfigFor(lang: ResponseLang, opts: { grounded?: boolean } = {}) {
  const { grounded = true } = opts;
  const base = {
    systemInstruction:
      lang === "es" ? theologicalFraming + spanishDirective : theologicalFraming,
  };
  if (!grounded) return base;
  return { ...base, tools: [{ googleSearch: {} }], toolConfig: { includeServerSideToolInvocations: true } };
}

// When a specific verse is selected, send only a ±5-verse window instead of
// the full chapter — saves 1000–3000 tokens on long chapters.
//
// Smoke test (expected behavior for the [n] marker format):
//   verseWindow("[1] In the beginning... [2] And the earth... ... [31] And God saw...", 16)
//     → "[11] ... [21] ..." (verses 11–21, the ±5 window around v16)
//   verseWindow("[1] Short. [2] Chapter.", 1)
//     → full text (≤ 2×radius markers, windowing not worth it)
//   verseWindow("Text with no markers at all", 3)
//     → full text + console warning (format change detector)
function verseWindow(fullText: string, centerVerse: number, radius = 5): string {
  // Primary: [n] markers. Fallback: <sup>n</sup> or {n} markers.
  let matches = [...fullText.matchAll(/\[(\d+)\][^\[]+/g)];
  if (matches.length === 0) {
    matches = [...fullText.matchAll(/(?:<sup>|\{)(\d+)(?:<\/sup>|\})[^<{]+/g)];
  }
  if (matches.length === 0) {
    console.warn("[verseWindow] No verse markers found — sending full passage. First 80 chars:", fullText.slice(0, 80));
    return fullText;
  }
  if (matches.length <= radius * 2) return fullText;
  const idx = Math.max(0, centerVerse - 1); // convert to 0-based
  const start = Math.max(0, idx - radius);
  const end = Math.min(matches.length, idx + radius + 1);
  return matches.slice(start, end).map(m => m[0].trimEnd()).join(" ");
}

function parseLang(value: unknown): ResponseLang {
  return value === "es" ? "es" : "en";
}

/* Section headings the model must emit, per response language */
const HEADINGS = {
  en: {
    directAnswer: "Direct Answer",
    scholarlyBasis: "Scholarly Basis",
    acrossTraditions: "Across the Traditions",
    overview: "Overview",
    languageNotes: "Language Notes",
    historicalContext: "Historical Context",
    exegesis: "Exegesis",
    historicalReception: "Historical Reception",
    traditionExample: "Reformed Perspective",
    originalLanguage: "Original Language",
    definition: "Definition",
    keyUsages: "Key Usages",
    semanticRange: "Semantic Range",
    usage: "Usage in Scripture",
    etymology: "Etymology & Cognates",
    sources: "Sources",
    keyDifferences: "Key Differences",
    sourcesConsulted: "Sources Consulted",
  },
  es: {
    directAnswer: "Respuesta Directa",
    scholarlyBasis: "Fundamento Académico",
    acrossTraditions: "Entre las Tradiciones",
    overview: "Panorama General",
    languageNotes: "Notas Lingüísticas",
    historicalContext: "Contexto Histórico",
    exegesis: "Exégesis",
    historicalReception: "Recepción Histórica",
    traditionExample: "Perspectiva Reformada",
    originalLanguage: "Lengua Original",
    definition: "Definición",
    keyUsages: "Usos Clave",
    semanticRange: "Rango Semántico",
    usage: "Uso en las Escrituras",
    etymology: "Etimología y Cognados",
    sources: "Fuentes",
    keyDifferences: "Diferencias Clave",
    sourcesConsulted: "Fuentes Consultadas",
  },
} as const;

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      const msg = error?.message || "";
      if (msg.includes("prepayment credits are depleted") || msg.includes("billing")) throw error;
      const isRetryable =
        msg.includes("503") || msg.includes("Service Unavailable") ||
        msg.includes("quota") || msg.includes("429") ||
        msg.includes("fetch failed") || error?.name === "TypeError";
      if (isRetryable && retries < maxRetries) {
        retries++;
        await new Promise(r => setTimeout(r, initialDelay * Math.pow(2, retries - 1)));
        continue;
      }
      throw error;
    }
  }
}

function extractGeminiError(error: any, lang: ResponseLang = "en"): string {
  const raw: string = error?.message || "";
  // The Gemini SDK sometimes nests the HTTP response body as a JSON string inside error.message
  try {
    const outer = JSON.parse(raw);
    const inner = outer?.error?.message;
    if (typeof inner === "string") {
      // May be double-nested in some SDK versions
      try {
        const nested = JSON.parse(inner);
        const msg = nested?.error?.message;
        if (msg) return String(msg);
      } catch {}
      return inner;
    }
  } catch {}
  // Keyword-based fallback with localized messages
  if (raw.includes("503") || raw.includes("Service Unavailable") || raw.includes("high demand") || raw.includes("UNAVAILABLE")) {
    return lang === "es"
      ? "El servicio de IA no está disponible en este momento debido a alta demanda. Por favor, inténtelo de nuevo en unos instantes."
      : "The AI service is temporarily unavailable due to high demand. Please try again in a moment.";
  }
  if (raw.includes("429") || raw.includes("quota") || raw.includes("RESOURCE_EXHAUSTED")) {
    return lang === "es"
      ? "Se ha alcanzado el límite de solicitudes. Por favor, espere un momento e inténtelo de nuevo."
      : "Request quota reached. Please wait a moment and try again.";
  }
  return raw || (lang === "es" ? "Error al generar la respuesta de IA." : "Failed to generate AI response.");
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Deployment diagnostics — reports what the server sees on disk so blank-page
  // issues can be debugged from any device without log access.
  app.get("/api/debug", (_req, res) => {
    const dist = path.join(process.cwd(), "dist");
    let distFiles: string[] = [];
    let assetFiles: string[] = [];
    try { distFiles = readdirSync(dist); } catch {}
    try { assetFiles = readdirSync(path.join(dist, "assets")); } catch {}
    res.json({
      nodeEnv: process.env.NODE_ENV ?? null,
      nodeVersion: process.version,
      cwd: process.cwd(),
      distIndexExists: existsSync(path.join(dist, "index.html")),
      distFiles,
      assetFiles,
      geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Bible text proxy (Bolls Life — no key required).
  // ESV (English) and RVR1960 (Spanish, Reina-Valera 1960 — the scholarly
  // standard in the Spanish-speaking church). Extend the allowlist to add
  // more translations (e.g. LBLA).
  const BIBLE_TRANSLATIONS = new Set(["ESV", "RV1960"]);

  // Bible full-text keyword search proxy (Bolls Life v2 find API).
  // MUST be registered before /api/bible/:translation — otherwise Express
  // matches "search" as a translation name and this route is unreachable.
  app.get("/api/bible/search", async (req, res) => {
    const { q, translation = "ESV" } = req.query;
    const tx = String(translation).toUpperCase();

    if (!q || String(q).trim().length < 2) {
      return res.status(400).json({ error: "Query too short." });
    }
    if (!BIBLE_TRANSLATIONS.has(tx)) {
      return res.status(400).json({ error: `Unsupported translation '${tx}'` });
    }

    try {
      const url = `https://bolls.life/v2/find/${tx}?search=${encodeURIComponent(String(q).trim())}&match_case=false&match_whole=false&limit=50&page=1`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) {
        return res.status(response.status).json({ error: "Search API error." });
      }
      const data = await response.json();
      // v2/find wraps results: { exact_matches, total, results: [{ pk, translation, book, chapter, verse, text }] }
      const results = Array.isArray(data) ? data : (data?.results ?? []);
      return res.json(results.slice(0, 50));
    } catch (error: any) {
      console.error("[Server] Bible search error:", error);
      return res.status(500).json({ error: "Failed to search Bible.", message: error.message });
    }
  });

  app.get("/api/bible/:translation", async (req, res) => {
    const translation = String(req.params.translation).toUpperCase();
    if (!BIBLE_TRANSLATIONS.has(translation)) {
      return res.status(400).json({ error: `Unsupported translation '${translation}'` });
    }
    const { bookId, chapter } = req.query;
    if (!bookId || !chapter) {
      return res.status(400).json({ error: "Missing 'bookId' or 'chapter'" });
    }
    try {
      const url = `https://bolls.life/get-text/${translation}/${bookId}/${chapter}/`;
      const response = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: "Bible API Error", details: errorText });
      }
      return res.json(await response.json());
    } catch (error: any) {
      console.error("[Server] Bible Proxy Error:", error);
      return res.status(500).json({ error: "Failed to fetch Bible text", message: error.message });
    }
  });

  // Gemini commentary — server-side, API key never sent to client.
  // Streams the response as Server-Sent Events (generation with search
  // grounding takes 15–30s; streaming lets the client render as it arrives).
  app.post("/api/commentary", async (req, res) => {
    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "AI commentary is not configured on this server." });
    }
    const { passage, reference, selectedVerse, question = "" } = req.body;
    if (!passage || !reference) {
      return res.status(400).json({ error: "Missing 'passage' or 'reference'" });
    }

    const lang = parseLang(req.body.lang);
    const H = HEADINGS[lang];
    const ccelUrl = `https://ccel.org/search?q=${encodeURIComponent(reference)}`;
    const verseContext = selectedVerse ? `The user is specifically asking about Verse ${selectedVerse}.` : "";
    const trimmedQuestion = typeof question === "string" ? question.trim() : "";
    const isQuestion = trimmedQuestion.length >= 10;
    const topicHint = !isQuestion && trimmedQuestion
      ? `\nThe user flagged a topic of interest: "${trimmedQuestion}". Give it particular attention where the passage warrants.`
      : "";

    // For single-verse focus send only the surrounding context — saves tokens on long chapters
    const passageForPrompt = (selectedVerse && typeof selectedVerse === "number")
      ? verseWindow(passage, selectedVerse)
      : passage;

    const prompt = isQuestion
      ? `Reference: ${reference}
Passage context: ${passageForPrompt}
${verseContext}
CCEL Reference: ${ccelUrl}

THE USER'S QUESTION (this is your sole assignment — answer THIS, nothing else):
"${trimmedQuestion}"

Rules for this response:
- Answer the user's exact question directly. Do NOT produce a general verse-by-verse commentary unless the question explicitly asks for one.
- Open with a \`## ${H.directAnswer}\` section (2–4 sentences) that a layperson can understand.
- Then a \`## ${H.scholarlyBasis}\` section with the supporting evidence: cited primary sources, exegetical reasoning, and any relevant original-language terms.
- If, and only if, the question touches a disputed point, add a \`## ${H.acrossTraditions}\` section with \`###\` sub-headings per tradition. Represent each tradition from its own authoritative sources (e.g. Catechism of the Catholic Church for Rome, Book of Concord for Lutherans, official confessions for Reformed) — never characterize a tradition solely through its critics.
- Only include lexical detail that bears on the question. Stay on topic.
- Use Google Search to verify every quote and historical claim.
- End with a \`## ${H.sourcesConsulted}\` section listing every Tier-1 source retrieved and verified this turn (by name and location). If a claim could not be verified, note it there.`
      : `Reference: ${reference}
Passage: ${passageForPrompt}
${verseContext}${topicHint}
CCEL Reference: ${ccelUrl}

Produce a structured commentary on this passage using EXACTLY these sections in this order:

## ${H.overview}
A 2–4 sentence plain-language summary of what the passage says and why it matters. Written for a layperson.

## ${H.languageNotes}
Key Greek/Hebrew terms with script, transliteration, and Strong's number. Skip if not relevant.

## ${H.historicalContext}
The setting, audience, and occasion — with sources.

## ${H.exegesis}
Verse-flow analysis using the grammatical-historical method.

## ${H.historicalReception}
Cited quotations from the Church Fathers and Reformers only (use blockquotes with attribution). Focus on Patristic writers (up to the 5th century) and the Reformers (Calvin, Luther, Owen, Westminster divines, etc.). Do NOT include Catholic, Orthodox, or Lutheran comparative sub-sections here.

After your final section, on its own line with no surrounding text, emit EXACTLY ONE of these markers:
\`<!--TRADITIONS:DISPUTED-->\` — if Catholic, Orthodox, or Lutheran readings meaningfully diverge from the Protestant/confessional interpretation on this passage.
\`<!--TRADITIONS:NONE-->\` — if the traditions read this passage in substantial agreement.

Use Google Search to verify every quote and historical claim.

End with a \`## ${H.sourcesConsulted}\` section listing every Tier-1 source retrieved and verified this turn (by name and location). If a claim could not be verified, note it there.`;

    // Set SSE headers before streaming begins
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
      const stream = await withRetry(() =>
        ai.models.generateContentStream({
          model: GEMINI_MODEL,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: geminiConfigFor(lang),
        })
      );

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("[Server] Gemini commentary error:", error);
      res.write(`data: ${JSON.stringify({ error: extractGeminiError(error, lang) })}\n\n`);
      res.end();
    }
  });

  // Gemini follow-up — streams as SSE, same pattern as commentary
  app.post("/api/followup", async (req, res) => {
    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "AI commentary is not configured on this server." });
    }
    const { passage, reference, selectedText, question, fullCommentaryText, selectedVerse } = req.body;
    if (!passage || !reference || !selectedText || !question) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const lang = parseLang(req.body.lang);
    const H = HEADINGS[lang];

    // Same windowing as /api/commentary — follow-ups are anchored to a
    // highlighted excerpt, so the full chapter is rarely needed.
    const passageForPrompt = (selectedVerse && typeof selectedVerse === "number")
      ? verseWindow(passage, selectedVerse)
      : passage;

    const prompt = `
The user is studying ${reference}.
Passage: ${passageForPrompt}

They highlighted: "${selectedText}"
Question: "${question}"

Full commentary for context (excerpt):
${fullCommentaryText ? fullCommentaryText.slice(0, 2000) : "Not provided"}

Respond using this structure:

## ${H.directAnswer}
2–4 sentences a layperson can understand.

## ${H.scholarlyBasis}
Supporting primary sources, exegetical reasoning, and any relevant original-language
terms (script, transliteration, Strong's number). Cite CCEL, Perseus, archive.org first.

## ${H.acrossTraditions} (only if the question touches a disputed point)
Use ### sub-headings per tradition. Omit this section if not applicable. Represent each tradition from its own authoritative sources (e.g. Catechism of the Catholic Church for Rome, Book of Concord for Lutherans, official confessions for Reformed) — never characterize a tradition solely through its critics.

## ${H.sourcesConsulted}
List every Tier-1 source retrieved and verified this turn (by name and location). Note any claim that could not be verified.

Use Google Search to verify every quote and source.
`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
      const stream = await withRetry(() =>
        ai.models.generateContentStream({
          model: GEMINI_MODEL,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: geminiConfigFor(lang),
        })
      );
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("[Server] Gemini follow-up error:", error);
      res.write(`data: ${JSON.stringify({ error: extractGeminiError(error, lang) })}\n\n`);
      res.end();
    }
  });

  // Word Study — dedicated lexical analysis; streams as SSE; no search grounding
  // (Greek/Hebrew lexicons are static knowledge — grounding adds latency with no benefit)
  app.post("/api/wordstudy", async (req, res) => {
    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "AI word study is not configured on this server." });
    }
    const { word, reference = "" } = req.body;
    if (!word || typeof word !== "string" || !word.trim()) {
      return res.status(400).json({ error: "Missing 'word' to study." });
    }
    const lang = parseLang(req.body.lang);
    const H = HEADINGS[lang];

    const refContext = reference
      ? `The user is studying this word in the context of ${reference}. Anchor the analysis to how it is used there.`
      : `No specific verse was given. Treat this as a general lexical study and cite the most representative biblical occurrences.`;

    const prompt = `You are performing a WORD STUDY — QUICK REFERENCE. Give a fast, readable overview.

Word to study: "${word.trim()}"
${refContext}

Respond using EXACTLY this structure. If the word maps to more than one original-language term, handle the most common one.

## ${word.trim()}

### ${H.originalLanguage}
The original word in its script, transliteration in italics, Strong's number, and language. Example: **λόγος** (*logos*, G3056) — Greek.

### ${H.definition}
A concise 1–2 sentence gloss a layperson can understand, followed by the core formal definition from BDAG (Greek) or HALOT (Hebrew) in one sentence.

### ${H.keyUsages}
The 2 most representative occurrences. Format: reference (real, verifiable) + one-sentence note on the sense used.

Be concise. This is a quick reference — omit etymology and semantic range. The user can expand for the full analysis.
Draw on BDAG, HALOT, Thayer, and Strong's. Never invent a Strong's number or a verse.`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
      const stream = await withRetry(() =>
        ai.models.generateContentStream({
          model: GEMINI_MODEL,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: geminiConfigFor(lang, { grounded: false }),
        })
      );
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("[Server] Gemini word study error:", error);
      res.write(`data: ${JSON.stringify({ error: extractGeminiError(error, lang) })}\n\n`);
      res.end();
    }
  });

  // Word Study Expand — full scholarly analysis; streams as SSE; no search grounding
  app.post("/api/wordstudy/expand", async (req, res) => {
    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "AI word study is not configured on this server." });
    }
    const { word, reference = "" } = req.body;
    if (!word || typeof word !== "string" || !word.trim()) {
      return res.status(400).json({ error: "Missing 'word' to study." });
    }
    const lang = parseLang(req.body.lang);
    const H = HEADINGS[lang];

    const refContext = reference
      ? `The user is studying this word in the context of ${reference}. Anchor the analysis to how it is used there.`
      : `No specific verse was given. Treat this as a general lexical study and cite the most representative biblical occurrences.`;

    const prompt = `You are completing a WORD STUDY — FULL SCHOLARLY ANALYSIS. The user has already seen the quick reference (Original Language, Definition, 2 Key Usages). Provide the deeper academic layers only.

Word: "${word.trim()}"
${refContext}

Do NOT restate the Original Language or Definition. Begin directly with Semantic Range.

### ${H.semanticRange}
All distinct senses this word can carry, as a bullet list with a one-line gloss each.

### ${H.usage}
4–6 representative occurrences. Format: reference (real, verifiable) + note on sense used. Real verses only.

### ${H.etymology}
Root, parent language, related forms, cognates. 2–3 sentences.

### ${H.sources}
Bullet list: lexicons consulted (BDAG 3rd ed., Thayer's Greek Lexicon, LSJ, HALOT, Strong's Concordance) with verification links to CCEL (ccel.org), Perseus (perseus.tufts.edu), or Bible Hub where available.

Draw on BDAG, HALOT, Thayer, and Strong's. Never invent a Strong's number or a verse.`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
      const stream = await withRetry(() =>
        ai.models.generateContentStream({
          model: GEMINI_MODEL,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: geminiConfigFor(lang, { grounded: false }),
        })
      );
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("[Server] Gemini word study expand error:", error);
      res.write(`data: ${JSON.stringify({ error: extractGeminiError(error, lang) })}\n\n`);
      res.end();
    }
  });

  // Other Traditions — on-demand comparative survey (Catholic / Orthodox / Lutheran)
  app.post("/api/traditions", async (req, res) => {
    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "AI commentary is not configured on this server." });
    }
    const { passage, reference, selectedVerse, commentaryExcerpt } = req.body;
    if (!passage || !reference) {
      return res.status(400).json({ error: "Missing 'passage' or 'reference'" });
    }

    const lang = parseLang(req.body.lang);
    const H = HEADINGS[lang];

    const passageForPrompt = (selectedVerse && typeof selectedVerse === "number")
      ? verseWindow(passage, selectedVerse)
      : passage;

    const verseContext = selectedVerse ? `Focus verse: ${selectedVerse}.\n` : "";
    const contextBlock = commentaryExcerpt
      ? `\nReformed commentary excerpt (for context — do not repeat it):\n${String(commentaryExcerpt).slice(0, 800)}\n`
      : "";

    const prompt = `Reference: ${reference}
Passage: ${passageForPrompt}
${verseContext}${contextBlock}
Produce a comparative survey of how three traditions interpret this passage. Draw ONLY from each tradition's own authoritative sources — never characterize a tradition through its critics.

## Roman Catholic Perspective
Draw from: Catechism of the Catholic Church (cite paragraph numbers), Church Fathers as received by Rome, and official magisterial commentaries.

## Eastern Orthodox Perspective
Draw from: Patristic consensus as received by Orthodoxy — John Chrysostom, Athanasius, the Cappadocians. Emphasize theosis/deification where relevant to this passage.

## Lutheran Perspective
Draw from: The Book of Concord (Augsburg Confession, Luther's Large and Small Catechisms, Formula of Concord), Luther's own biblical commentaries, and confessional Lutheran exegesis.

## ${H.keyDifferences}
A concise bullet list of the most significant interpretive divergences across these three traditions regarding this passage. Note briefly where the Protestant/confessional reading (already given in the main commentary) agrees or diverges from each.

## ${H.sourcesConsulted}
List every Tier-1 source retrieved and verified this turn (by name and location). Note any claim that could not be verified.

Use Google Search to verify all quotations and source references.`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
      const stream = await withRetry(() =>
        ai.models.generateContentStream({
          model: GEMINI_MODEL,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: geminiConfigFor(lang),
        })
      );
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("[Server] Gemini traditions error:", error);
      res.write(`data: ${JSON.stringify({ error: extractGeminiError(error, lang) })}\n\n`);
      res.end();
    }
  });

  // Serve from dist/ if it exists (production build); otherwise start Vite dev middleware.
  // Checking dist/ existence directly avoids a blank screen when NODE_ENV is not set.
  const distPath = path.join(process.cwd(), "dist");
  if (existsSync(path.join(distPath, "index.html"))) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.get("*", (_req, res) => {
      res.status(503).send("App not built. Run: npm run build");
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
