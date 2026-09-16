# Spanish NMT QC — AI-generated commentary cards

**Scope:** Inquire / reception **generated** drafts only. Catalog PD voices (Gill, Calvin curated, etc.) stay English extracts with title/voice localization via `i18n-sources` — never machine-translated.

**Engine:** Google Cloud Translation NMT (`google-nmt`). Env (server only):

- `GOOGLE_TRANSLATE_API_KEY` (preferred on Vercel)
- `GOOGLE_APPLICATION_CREDENTIALS` (optional service-account JSON path)

If both missing, cards remain English (graceful skip). Never ship these as `VITE_*`.

**Cache:** Memory + `.data/translation-cache/` filesystem + Neon table `translation_cache` when DATABASE_URL is set, key = `sha256(text) + engine + target_locale`.

## Sample EN vs ES fidelity (manual)

1. Open preview → Appearance → **Español**.
2. Mark an NT verse with weak/no curated desk (e.g. a lesser-indexed chapter).
3. Tap **Commentaries** / gather so **Generated** badges appear.
4. For 2–3 generated slips, copy EN (switch locale to English and re-gather, or compare citation URL source) vs ES quote + context bridge:
   - Meaning faithful (formal/literary), not paraphrase drift.
   - Verse refs (`Romans 9:11`), Greek/Hebrew, Strong’s (`G1589`), author name, URLs unchanged.
5. Confirm a **Curated** Gill/Calvin slip still shows English quotation body (titles may be Spanish via phrase map).
6. Scripture column stays **RV1960** — do not expect NMT on the reader verse.

## Automated

```bash
npm test -- src/lib/translate/
```

Mocks the Translate API; no live billing in CI.
