import "dotenv/config";
import express from "express";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy route for ESV Bible API (via Bolls Life to avoid API key requirement)
  app.get("/api/bible/esv", async (req, res) => {
    const { bookId, chapter } = req.query;
    if (!bookId || !chapter) {
      return res.status(400).json({ error: "Missing 'bookId' or 'chapter'" });
    }

    try {
      const url = `https://bolls.life/get-text/ESV/${bookId}/${chapter}/`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: "ESV API Error", details: errorText });
      }

      const data = await response.json();
      return res.json(data);
    } catch (error: any) {
      console.error("[Server] ESV Proxy Error:", error);
      return res.status(500).json({ error: "Failed to fetch from ESV API", message: error.message });
    }
  });

  // Vite middleware for development
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
    // For Express 4.x
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
