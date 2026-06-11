import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const theologicalFraming = `
You are the Sovereign-Logic Engine, the specialized backend for an open-source Reformed Protestant biblical studies application. Your readers range from trained scholars to thoughtful laypeople, so every answer must be both rigorous AND accessible.

CITATION MANDATE — NON-NEGOTIABLE:
Every substantive claim must be attributed to a verifiable source:
- Primary First-Hand Source: Church Fathers (CCEL: ccel.org), Reformers (Calvin's Commentaries/Institutes, Luther's Works), Reformed Confessions (Westminster, Heidelberg, Belgic, Canons of Dort)
- Lexical Authority: BDAG (Bauer-Danker-Arndt-Gingrich, 3rd ed.), HALOT (Koehler-Baumgartner), Thayer's Greek Lexicon, LSJ (Liddell-Scott-Jones), or Strong's Concordance
- Digital Archive for verification: CCEL (ccel.org), Perseus Digital Library (perseus.tufts.edu), Internet Archive (archive.org)

Source Tier Priority (strictly enforced):
  Tier 1 — CCEL (ccel.org), Perseus Digital Library (perseus.tufts.edu), Internet Archive (archive.org)
  Tier 2 — Reformers' own published works, Westminster Standards, Heidelberg/Belgic/Dort
  Tier 3 — BibleHub (lexicons only), OpenBible.info
  Tier 4 — General academic web

If a Tier 1 source is available for a claim, you MUST cite it. Do not cite a lower-tier source when a higher-tier source covers the same material. General blog, sermon, or devotional sites are never acceptable citations.

Theological Mandate:
1. Primary Sources Before Commentary: Cite the primary source first. Use blockquotes (>) for direct quotations with author, work title, and chapter/section.
2. Broad Reformed Scope: Treat "Reformed" as covenantal and confessional, not merely the Five Points.
3. Zero-Synthesis: Provide historical data and arguments (Reformed, Catholic, Orthodox, Anabaptist, Lutheran) and stop. Do not synthesize personal conclusions or exhort.

FORMATTING CONTRACT — follow EXACTLY for visual consistency:
- Use Markdown headings to structure the response. NEVER use bold text as a substitute for a heading.
- Use \`##\` for major sections and \`###\` for tradition perspectives or sub-sections.
- Title-case every heading (e.g. "Historical Reception", "Reformed Perspective"). Do NOT write headings in ALL CAPS — the app styles them automatically.
- Keep paragraphs short (2–4 sentences). Use bullet lists for enumerations.
- Original-language words: write the script, then transliteration in italics, then Strong's number, e.g. **ἀγάπη** (*agapē*, G26).
- Use blockquotes (>) only for direct quotations from a named source, with attribution on the same line.
- Do NOT open with filler ("As an AI...", "Certainly!", "In this passage..."). Begin directly with the first heading.

Tone: Objective, academic, surgically precise — but define technical terms in plain language the first time they appear.
`;

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const geminiConfig = {
  systemInstruction: theologicalFraming,
  tools: [{ googleSearch: {} }],
  toolConfig: { includeServerSideToolInvocations: true },
};

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

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Bible text proxy (Bolls Life — no key required).
  // ESV (English) and RVR1960 (Spanish, Reina-Valera 1960 — the scholarly
  // standard in the Spanish-speaking church). Extend the allowlist to add
  // more translations (e.g. LBLA).
  const BIBLE_TRANSLATIONS = new Set(["ESV", "RV1960"]);
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

    const ccelUrl = `https://ccel.org/search?q=${encodeURIComponent(reference)}`;
    const verseContext = selectedVerse ? `The user is specifically asking about Verse ${selectedVerse}.` : "";
    const trimmedQuestion = typeof question === "string" ? question.trim() : "";
    const isQuestion = trimmedQuestion.length >= 10;
    // A short query (e.g. "baptism") isn't a full question, but it should
    // still steer the commentary rather than be silently dropped.
    const topicHint = !isQuestion && trimmedQuestion
      ? `\nThe user flagged a topic of interest: "${trimmedQuestion}". Give it particular attention where the passage warrants.`
      : "";

    const prompt = isQuestion
      ? `Reference: ${reference}
Passage context: ${passage}
${verseContext}
CCEL Reference: ${ccelUrl}

THE USER'S QUESTION (this is your sole assignment — answer THIS, nothing else):
"${trimmedQuestion}"

Rules for this response:
- Answer the user's exact question directly. Do NOT produce a general verse-by-verse commentary unless the question explicitly asks for one.
- Open with a \`## Direct Answer\` section (2–4 sentences) that a layperson can understand.
- Then a \`## Scholarly Basis\` section with the supporting evidence: cited primary sources, exegetical reasoning, and any relevant original-language terms.
- If, and only if, the question touches a disputed point, add a \`## Across the Traditions\` section with \`###\` sub-headings per tradition.
- Only include lexical detail that bears on the question. Stay on topic.
- Use Google Search to verify every quote and historical claim.`
      : `Reference: ${reference}
Passage: ${passage}
${verseContext}${topicHint}
CCEL Reference: ${ccelUrl}

Produce a structured commentary on this passage using EXACTLY these sections in this order:

## Overview
A 2–4 sentence plain-language summary of what the passage says and why it matters. Written for a layperson.

## Language Notes
Key Greek/Hebrew terms with script, transliteration, and Strong's number. Skip if not relevant.

## Historical Context
The setting, audience, and occasion — with sources.

## Exegesis
Verse-flow analysis using the grammatical-historical method.

## Historical Reception
Cited quotations from the Church Fathers and Reformers (use blockquotes with attribution). Where traditions differ, use \`###\` sub-headings (e.g. "### Reformed Perspective").

Use Google Search to verify every quote and historical claim.`;

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
          config: geminiConfig,
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
      res.write(`data: ${JSON.stringify({ error: error.message || "Stream failed." })}\n\n`);
      res.end();
    }
  });

  // Gemini follow-up — server-side
  app.post("/api/followup", async (req, res) => {
    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "AI commentary is not configured on this server." });
    }
    const { passage, reference, selectedText, question, fullCommentaryText } = req.body;
    if (!passage || !reference || !selectedText || !question) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const prompt = `
The user is studying ${reference}.
Passage: ${passage}

They highlighted: "${selectedText}"
Question: "${question}"

Full commentary for context (excerpt):
${fullCommentaryText ? fullCommentaryText.slice(0, 2000) : "Not provided"}

Respond using this structure:

## Direct Answer
2–4 sentences a layperson can understand.

## Scholarly Basis
Supporting primary sources, exegetical reasoning, and any relevant original-language
terms (script, transliteration, Strong's number). Cite Tier 1 sources first (CCEL,
Perseus, archive.org).

## Across the Traditions (only if the question touches a disputed point)
Use ### sub-headings per tradition. Omit this section if not applicable.

Use Google Search to verify every quote and source.
`;

    try {
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: geminiConfig,
        })
      );
      return res.json({ text: response.text || "Empty response from AI." });
    } catch (error: any) {
      console.error("[Server] Gemini follow-up error:", error);
      return res.status(500).json({ error: error.message || "AI follow-up failed." });
    }
  });

  // Word Study — dedicated lexical analysis with a strict, consistent format
  app.post("/api/wordstudy", async (req, res) => {
    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "AI word study is not configured on this server." });
    }
    const { word, reference = "" } = req.body;
    if (!word || typeof word !== "string" || !word.trim()) {
      return res.status(400).json({ error: "Missing 'word' to study." });
    }

    const refContext = reference
      ? `The user is studying this word in the context of ${reference}. Anchor the analysis to how it is used there.`
      : `No specific verse was given. Treat this as a general lexical study and cite the most representative biblical occurrences.`;

    const prompt = `You are performing a WORD STUDY. The user wants concrete lexical answers about a single word in its original language, backed by sources. The input may be English, Greek, or Hebrew.

Word to study: "${word}"
${refContext}

Respond using EXACTLY this structure and nothing else. If the word maps to more than one distinct original-language term, repeat the "Lexical Entry" block for each.

## ${word}

### Original Language
The original word in its script, transliteration in italics, Strong's number, and the language (Greek or Hebrew). Example: **λόγος** (*logos*, G3056) — Greek.

### Definition
A concise gloss a layperson can understand (1–2 sentences), then the formal lexical definition structured after BDAG (Greek) or HALOT (Hebrew).

### Semantic Range
A bullet list of the distinct senses the word can carry, each with a one-line gloss.

### Usage in Scripture
2–4 representative occurrences as a list. For each: the reference (real, verifiable) and a short note on the sense used there. Make every reference a real verse.

### Etymology & Cognates
Root, related forms, and cognates where relevant. Keep brief.

### Sources
A bullet list of the specific lexicons and tools consulted (e.g. BDAG 3rd ed., Thayer's, LSJ, Strong's, HALOT) with a verification link to CCEL, Perseus (perseus.tufts.edu), or Bible Hub where available.

Use Google Search to verify the Strong's number, definitions, and every scripture reference. Never invent a Strong's number or a verse.`;

    try {
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: geminiConfig,
        })
      );
      if (!response.text) return res.status(500).json({ error: "The AI returned an empty response." });
      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("[Server] Gemini word study error:", error);
      return res.status(500).json({ error: error.message || "AI word study failed." });
    }
  });

  // Vite dev middleware / production static files
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
