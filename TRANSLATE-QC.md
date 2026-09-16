# Spanish NMT QC — Reception commentary cards

**Scope:** Inquire / reception **generated** cards **and** curated/catalog card bodies (Gill/Calvin **quote** + note / contextBridge) when `locale=es`. Voice names, work titles, and citations stay via `notranslate` + `i18n-sources` localizeCard (chrome only — **not** quote bodies). Do **not** NMT Scripture when Spanish Bible (RV1960) is already on the desk.

**Client gap fixed:** Opening a curated verse loads English `quote` from `getCurated` until the server NMT round-trip. Reception sheet auto-calls `askReception` when `locale=es` and there is no locale-keyed desk cache; gather merge prefers server bodies for the same voice+citation so EN curated quotes are replaced.

**Engine:** Google Cloud Translation NMT (`google-nmt`). Env (server only):

- `GOOGLE_TRANSLATE_API_KEY` (preferred on Vercel)
- `GOOGLE_APPLICATION_CREDENTIALS` (optional service-account JSON path)

If both missing, cards remain English (graceful skip). Never ship these as `VITE_*`.

**Cache:** Memory + `.data/translation-cache/` filesystem + Neon table `translation_cache` when DATABASE_URL is set, key = `sha256(text) + engine + target_locale`.

**Locale switch:** Client desk cache is keyed by verse **and** locale (`theos-logos-reception-v2`). Open sheet reloads on locale change — English must show English source text (no sticky ES UI).

## Sample EN vs ES fidelity (manual)

1. Open preview → Appearance → **Español**.
2. Mark a verse with curated Gill/Calvin **and** gather generated cards.
3. Confirm curated quote/note bodies are Spanish (faithful MT); voice/work may also show Spanish chrome via phrase map.
4. Switch Appearance → **English**: open sheet must show English quote bodies again (re-fetch / locale-keyed desk).
5. Verse refs, Greek/Hebrew, Strong’s, URLs, author names unchanged inside MT text.
6. Scripture column stays **RV1960** when locale=es — do not expect NMT on the reader verse.
7. Strong gold pills open Midvash ES (`/es/concordancia-strong/griego/g{n}`), not BibleHub.

## Automated

```bash
npm test -- src/lib/translate/ src/lib/reception/locale-switch.test.ts src/lib/reception/merge-cards.test.ts src/lib/lexicon/midvash.test.ts
```

Mocks the Translate API; no live billing in CI.
