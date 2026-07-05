/**
 * build-search-index.mjs
 * -----------------------
 * Derives three files from src/data/shabads.json:
 *
 *   - src/data/search-index.json — full lean index, imported at BUILD TIME
 *     by index.astro/browse.astro for the static shell (filter option
 *     lists, Recently Notated, raag chip counts). None of this ships to
 *     the browser as-is; Astro bakes it into static HTML.
 *   - public/search-index.json — the subset the homepage's client-side
 *     search actually reads (id/source/raag/writer/preview/taal/
 *     hasNotation + per-line fl/t), fetched by the browser after the page
 *     shell has already rendered instead of being embedded inline.
 *   - public/browse-index.json — the subset the browse page's client-side
 *     filter/list actually reads (no free-text search there, so no
 *     per-line fl/t needed at all), fetched the same way.
 *
 * Splitting the client-fetched data out of the HTML document is the fix
 * for the homepage's ~23s FCP/LCP: previously this same data was inlined
 * into a <script type="application/json"> tag, so the browser couldn't
 * paint anything until the whole ~19MB document had arrived. Now the
 * shell (header, search box, filters, Recently Notated, Browse by Raag)
 * renders immediately, and the search data streams in afterward via
 * fetch().
 *
 * None of these three files are committed to git — all three regenerate
 * from shabads.json (which IS committed) via the `prebuild`/`predev` npm
 * hooks below, same as a `dist/` build artifact.
 *
 * Run via `npm run build-search-index` (also runs automatically before
 * `npm run build`/`npm run dev` — see package.json).
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const IN_FILE = path.join('src', 'data', 'shabads.json');
const FULL_INDEX_FILE = path.join('src', 'data', 'search-index.json');
const PUBLIC_SEARCH_FILE = path.join('public', 'search-index.json');
const PUBLIC_BROWSE_FILE = path.join('public', 'browse-index.json');

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

await mkdir('public', { recursive: true });

await writeFile(FULL_INDEX_FILE, JSON.stringify(index), 'utf8');

const searchClient = index.map(
  ({ id, source, raag, writer, preview, taal, hasNotation, lines }) => (
    { id, source, raag, writer, preview, taal, hasNotation, lines }
  ),
);
await writeFile(PUBLIC_SEARCH_FILE, JSON.stringify(searchClient), 'utf8');

const browseClient = index.map(
  ({ id, source, ang, raag, writer, preview, taal, hasNotation }) => (
    { id, source, ang, raag, writer, preview, taal, hasNotation }
  ),
);
await writeFile(PUBLIC_BROWSE_FILE, JSON.stringify(browseClient), 'utf8');

console.log(
  `Wrote ${index.length} shabads to ${FULL_INDEX_FILE}, ${PUBLIC_SEARCH_FILE}, ${PUBLIC_BROWSE_FILE}`,
);
