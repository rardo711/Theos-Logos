import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const theologicalFraming = `
You are the Sovereign-Logic Engine, the specialized backend for an open-source Reformed Protestant biblical studies application.

CITATION MANDATE — NON-NEGOTIABLE:
Every substantive claim must be attributed to a verifiable source:
- Primary First-Hand Source: Church Fathers (CCEL: ccel.org), Reformers (Calvin's Commentaries/Institutes, Luther's Works), Reformed Confessions (Westminster, Heidelberg, Belgic, Canons of Dort)
- Lexical Authority: BDAG (Bauer-Danker-Arndt-Gingrich, 3rd ed.), HALOT (Koehler-Baumgartner), Thayer's Greek Lexicon, LSJ (Liddell-Scott-Jones), or Strong's Concordance
- Digital Archive for verification: CCEL (ccel.org), Perseus Digital Library (perseus.tufts.edu), Internet Archive (archive.org)

Theological Mandate:
1. Primary Sources Before Commentary: Cite the primary source first. Use blockquotes (>) for direct quotations with author, work title, and chapter/section.
2. Broad Reformed Scope: Treat "Reformed" as covenantal and confessional, not merely the Five Points.
3. Zero-Synthesis: Provide historical data and arguments (Reformed, Catholic, Orthodox, Anabaptist, Lutheran) and stop. Do not synthesize personal conclusions.
4. Lexical Precision: For Greek/Hebrew words, provide: original script, transliteration, Strong's number, and a definition structured after BDAG or HALOT methodology.

Citation Format:
- Patristic: > "Quote" — Author, *Work Title*, Book X, Chapter Y (CCEL: link)
- Reformers: > "Quote" — Calvin, *Commentary on [Book]*, [ch]:[v] (CCEL: link)
- Confessional: Westminster Confession of Faith, Chapter X, Section Y
- Lexical: **[word]** ([transliteration], Strong's #NNNN): [definition per BDAG/Thayer's]

Tone: Objective, academic, surgically precise. No conversational filler. No "As an AI...".
`;

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

  // ESV Bible proxy (Bolls Life — no key required)
  app.get("/api/bible/esv", async (req, res) => {
    const { bookId, chapter } = req.query;
    if (!bookId || !chapter) {
      return res.status(400).json({ error: "Missing 'bookId' or 'chapter'" });
    }
    try {
      const url = `https://bolls.life/get-text/ESV/${bookId}/${chapter}/`;
      const response = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: "ESV API Error", details: errorText });
      }
      return res.json(await response.json());
    } catch (error: any) {
      console.error("[Server] ESV Proxy Error:", error);
      return res.status(500).json({ error: "Failed to fetch from ESV API", message: error.message });
    }
  });

  // Gemini commentary — server-side, API key never sent to client
  app.post("/api/commentary", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "AI commentary is not configured on this server." });
    }
    const { passage, reference, context = "", selectedVerse } = req.body;
    if (!passage || !reference) {
      return res.status(400).json({ error: "Missing 'passage' or 'reference'" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const ccelUrl = `https://www.ccel.org/study/${reference.replace(/ /g, "_")}`;
    const verseContext = selectedVerse ? `The user is specifically asking about Verse ${selectedVerse}.` : "";
    const isQuestion = (context as string).trim().length > 0;

    const prompt = isQuestion
      ? `${theologicalFraming}\n\nReference: ${reference}\nPassage context: ${passage}\n${verseContext}\n\nUser Question / Topic: "${context}"\n\nCCEL Reference: ${ccelUrl}\n\nAnswer the user's question directly and deeply. Cite primary sources first. Add lexical (Greek/Hebrew) notes at the end. Use Google Search to verify quotes.\n`
      : `${theologicalFraming}\n\nReference: ${reference}\nPassage: ${passage}\n${verseContext}\n\nCCEL Reference: ${ccelUrl}\n\nProvide a deep, scholarly commentary:\n1. Language notes (Greek/Hebrew with Strong's numbers)\n2. Historical context\n3. Exegesis\n4. Historical voices (cited quotes from Fathers/Reformers)\n\nUse Google Search to verify quotes.\n`;

    try {
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            toolConfig: { includeServerSideToolInvocations: true },
          },
        })
      );
      if (!response.text) return res.status(500).json({ error: "The AI returned an empty response." });
      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("[Server] Gemini commentary error:", error);
      return res.status(500).json({ error: error.message || "AI commentary failed." });
    }
  });

  // Gemini follow-up — server-side
  app.post("/api/followup", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "AI commentary is not configured on this server." });
    }
    const { passage, reference, selectedText, question, fullCommentaryText } = req.body;
    if (!passage || !reference || !selectedText || !question) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `${theologicalFraming}\n\nThe user is studying ${reference}.\nPassage: ${passage}\n\nThey highlighted: "${selectedText}"\nQuestion: "${question}"\n\nFull commentary for context:\n${fullCommentaryText || "Not provided"}\n\nProvide a concise, scholarly answer with source citations.\n`;

    try {
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            toolConfig: { includeServerSideToolInvocations: true },
          },
        })
      );
      return res.json({ text: response.text || "Empty response from AI." });
    } catch (error: any) {
      console.error("[Server] Gemini follow-up error:", error);
      return res.status(500).json({ error: error.message || "AI follow-up failed." });
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
