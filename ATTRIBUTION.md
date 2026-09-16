# Attribution

## English NT lexicon (UBS)

English gloss data in `src/lib/lexicon/data/english.json` is derived from the
**UBS Greek New Testament Dictionary (English)** published by the
United Bible Societies under **CC BY-SA 4.0**.

- Source: https://github.com/ubsicap/ubs-open-license
- Dictionary JSON: `dictionaries/greek/JSON/UBSGreekNTDic-v1.1-en.JSON`
- Domains companion (reference): `UBSGreekNTDicLexicalDomains-v1.1-en.JSON`

This work is a compressed Strong’s-keyed lookup for study on Theos Logos.
Share-alike and attribution requirements of CC BY-SA 4.0 apply to the UBS
material. Rebuild via `node scripts/import-ubs-en-lexicon.mjs` (local only —
not at Vercel build).

## Spanish NT lexicon (UBS)

Spanish gloss data in `src/lib/lexicon/data/spanish.json` is derived from the
**UBS Greek New Testament Dictionary (Spanish)** published by the
United Bible Societies under **CC BY-SA 4.0**.

- Source: https://github.com/ubsicap/ubs-open-license
- Dictionary JSON: `dictionaries/greek/JSON/UBSGreekNTDic-v1.0-es.JSON`
- Domains companion (reference): `UBSGreekNTDicLexicalDomains-v1.0-es.JSON`

This work is a compressed Strong’s-keyed lookup for study on Theos Logos.
Share-alike and attribution requirements of CC BY-SA 4.0 apply to the UBS
material. Rebuild via `node scripts/import-ubs-es-lexicon.mjs` (local only —
not at Vercel build).

## Secondary short glosses

Filtered rows from [bcv-commons/strongs](https://huggingface.co/datasets/bcv-commons/strongs)
`glosses/eng.tsv` (English) and `glosses/spa.tsv` (Spanish) where `methods`
contains `lexicon` **or** `sources` contains `ubs-dict`. LLM-only rows are
**not** shipped in v1.

## English lexicon

STEPBible / Tyndale House compact JSON — CC BY 4.0 (see `src/lib/lexicon/data/desk.ts`).
