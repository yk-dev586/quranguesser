# QCF local asset slot

The QuranGuessr quiz UI supports the Quran Foundation QCF V2 per-page fonts.
The application does **not** fetch them from the Internet at runtime.

Expected files:

- `woff2/p1.woff2` … `woff2/p604.woff2`
- `layout/verse-map.json` (verse key -> page + line spans)

A hydration helper is provided at:

`scripts/hydrate-qcf-assets.mjs`

It downloads the documented QCF V2 fonts and the 604-page Mushaf layout when you explicitly run it on a machine that has Internet access.

Until those files are present, the main Quran reader and the text-based quiz modes use the local Quran text and local fallback font. The exact page/line quiz is disabled instead of inventing page or line numbers.
