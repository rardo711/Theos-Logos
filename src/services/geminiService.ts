import { GoogleGenAI } from "@google/genai";

/**
 * Client-side Gemini service based on AI Studio guidelines.
 * Calls the Gemini API directly from the frontend using the SDK.
 */

const apiKey = process.env.GEMINI_API_KEY;

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      const errorMessage = error?.message || "";
      
      // Do not retry hard billing errors
      if (errorMessage.includes("prepayment credits are depleted") || errorMessage.includes("billing")) {
        throw error;
      }

      const isRetryable = 
        errorMessage.includes("503") || 
        errorMessage.includes("Service Unavailable") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("429") ||
        errorMessage.includes("Proxying failed") ||
        errorMessage.includes("Load failed") ||
        errorMessage.includes("fetch failed") ||
        error?.name === "TypeError";

      if (isRetryable && retries < maxRetries) {
        retries++;
        const delay = initialDelay * Math.pow(2, retries - 1);
        console.warn(`Gemini API error (retry ${retries}/${maxRetries}): ${errorMessage}. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

const theologicalFraming = `
You are the Sovereign-Logic Engine, the specialized backend for a Reformed Protestant biblical studies web app.

Theological Mandate:
1. Primary Sources Only: Always cite primary sources (Patristics, Reformers, Lexicons like BDAG) before providing any commentary.
2. Broad Reformed Scope: Treat "Reformed" as a confessionally broad and covenantal system, not just the "Five Points."
3. Zero-Synthesis: Never synthesize personal conclusions or "preach." Provide the historical data and arguments (Reformed, Catholic, Orthodox, Anabaptist) and stop. Guard the user's space for personal conviction.

Logical Protocol (Internal Thinking):
Before responding to any query, you must internally:
 * Define the Greek/Hebrew semantic range.
 * Identify the core Reformed Confessional stance.
 * Contrast with at least one other major historical tradition.
 * Format for the specific mobile device context.

Tone:
Objective, academic, and surgically precise. No conversational filler or introductory phrases like "As an AI..."

Use blockquotes (>) for direct quotations. Provide structured lexical data when appropriate.
`;

export async function generateCommentary(passage: string, reference: string, context: string = "", selectedVerse?: number) {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please check your environment configuration in Settings > Secrets.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const ccelUrl = `https://www.ccel.org/study/${reference.replace(/ /g, "_")}`;
  const verseContext = selectedVerse ? `The user is specifically asking about Verse ${selectedVerse}.` : "";

  const isQuestionAsk = context.trim().length > 0;

  const prompt = isQuestionAsk 
    ? `
      ${theologicalFraming}
      
      Reference: ${reference}
      Passage context: ${passage}
      ${verseContext}
      
      User Question / Topic: "${context}"
      
      CCEL Reference: ${ccelUrl}
      
      The user has asked a specific question or provided a specific topic. Provide a direct, deep, scholarly answer addressing exactly what they asked.
      Focus FIRST and primarily on answering their typed request. Do not provide a general commentary unless asked.
      At the END of your response, add any extra lexical information in languages (Greek/Hebrew) or other essential historical info related to their query.
      If the user is asking for a lexical definition (e.g., "Define in Greek/Hebrew"), provide a structured lexicon entry (similar to BDAG, HALOT, or Thayer's).
      
      Draw on the grammatical-historical method, context from the passage, and historical voices (such as the Reformers and Church Fathers) to support your answer.
      
      Structure your response logically, using quotes and exegetical insights where applicable.
      
      Use Google Search to verify quotes and historical context.
    `
    : `
      ${theologicalFraming}
      
      Reference: ${reference}
      Passage: ${passage}
      ${verseContext}
      
      CCEL Reference: ${ccelUrl}
      
      Provide a deep, scholarly commentary on this passage. 
      1. Language notes (Greek/Hebrew).
      2. Historical context.
      3. Exegesis.
      4. Historical voices (Quotes).
      
      Use Google Search to verify quotes and historical context.
    `;

  try {
    const response = await withRetry(async () => {
      return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          toolConfig: { includeServerSideToolInvocations: true }
        }
      });
    });

    if (!response.text) {
      throw new Error("The AI returned an empty response. Check safety filters.");
    }
    
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function generateFollowUp(passage: string, reference: string, selectedText: string, question: string, fullCommentaryText?: string) {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    ${theologicalFraming}

    The user is studying ${reference}.
    Passage: ${passage}
    
    They highlighted: "${selectedText}"
    Question: "${question}"
    
    Full commentary for context:
    ${fullCommentaryText || "Not provided"}

    Provide a concise, scholarly answer.
  `;

  try {
    const response = await withRetry(async () => {
      return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          toolConfig: { includeServerSideToolInvocations: true }
        }
      });
    });

    return response.text || "Empty response from AI.";
  } catch (error: any) {
    console.error("Gemini Follow-up Error:", error);
    throw error;
  }
}
