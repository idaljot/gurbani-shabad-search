/**
 * build-search-index.mjs
 * -----------------------
 * Derives src/data/search-index.json from src/data/shabads.json.
 *
 * shabads.json carries the full scraped record for every shabad (raw
 * textLines, sthayi/antara notation bodies, per-line repeat flags, etc.) —
 * fields the homepage/browse pages never read but that Astro still has to
 * parse and (for index.astro) serialize into the page for the client-side
 * search. That's the entire cause of the homepage's oversized payload.
 *
 * This script strips each shabad down to exactly what index.astro and
 * browse.astro consume: identity/filter fields plus, per line, only `t`
 * (display text) and `fl` (first-letters used for matching) — the `r`
 * repeat flag and the raw textLines/sthayi/antara bodies are dropped since
 * no page reads them.
 *
 * Run via `npm run build-search-index` (also runs automatically before
 * `npm run build` — see package.json's `prebuild` script).
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const IN_FILE = path.join('src', 'data', 'shabads.json');
const OUT_FILE = path.join('src', 'data', 'search-index.json');

const shabads = JSON.parse(await readFile(IN_FILE, 'utf8'));

const index = shabads.map((s) => ({
  id: s.shabadId,
  source: s.source || 'Guru Granth Sahib Ji',
  ang: s.ang,
  raag: s.raag,
  writer: s.writer,
  preview: s.previewLine || s.firstLine || '',
  taal: s.taal || null,
  hasNotation: Boolean(s.sthayi || s.antara || s.taal),
  notatedAt: s.notatedAt || null,
  lines: s.lines.map((l) => ({ t: l.t, fl: l.fl })),
}));

await writeFile(OUT_FILE, JSON.stringify(index), 'utf8');
console.log(`Wrote ${index.length} shabads to ${OUT_FILE}`);
