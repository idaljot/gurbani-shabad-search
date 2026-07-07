# Gurbani Kirtan Swar Notation

A searchable database of Shabads from Sri Guru Granth Sahib Ji, Sri Dasam
Granth, Vaaran Bhai Gurdas Ji, and Bhai Nand Lal Ji's works, with sur/taal
notation for kirtan. Type the first letters of each word to search (in the
style of SikhiToTheMax), or browse and filter by Source, Raag, Writer, and
Taal.

Built with Astro as a fully static site and deployed to Cloudflare Pages.

## Features

- **First-letter search** — type first letters of each word; matches from
  the start of any line in a shabad, not just the opening line.
- **Filters** on the homepage and browse page: Source, Raag, Writer, Taal,
  and "only shabads with sur/taal notation."
- **Sur/taal notation** — Taal, Tempo, Key, Sthayi, Antara, and Alaap for
  shabads that have been notated, submitted through a class Google Form.
- **Raag reference pages** — mood, traditional time of day (with a note that
  raags express mood rather than being bound to a clock time), thaat, jati,
  aroh/avroh, vadi/samvadi, komal/teevra/varjit swars, and a linked YouTube
  playlist, where available. Each raag's entry is marked either compiled
  from public sources (pending review) or reviewed and confirmed by
  Bhai Jaspal Singh Ji, so visitors can see what's been verified.
- **Built-in tabla player** (Tone.js) with the taal patterns used across the
  site, adjustable tempo, and a fullscreen practice view.
- **No runtime third-party dependencies** — fonts, the tabla player library,
  and the license badge are all self-hosted; nothing is fetched from an
  external CDN when a visitor loads the site.

## How the data works

The data pipeline is split into two parts with very different update
frequencies:

- **Base shabad text** (Ang, Raag, Writer, the Gurmukhi lines themselves)
  comes from the public **GurbaniNow API**, covering four sources: Sri Guru
  Granth Sahib Ji, Sri Dasam Granth, Vaaran Bhai Gurdas Ji, and four of
  Bhai Nand Lal Ji's works (Ghazals, Zindagi Nama, Ganj Nama, Jot Bigas).
  This text doesn't change, so it's only re-crawled rarely — `npm run
  fetch-base` — producing `src/data/shabads-base.json`.
- **Sur/taal notation** (Taal, Tempo, Key, Sthayi, Antara, Alaap) comes from
  a class Google Form, which writes to a published Sheet. This changes
  often as new notation is submitted, so it's kept separate from the rare
  full crawl — merging it back in is a single fast CSV fetch, matched by
  column header name (not position) so reordering the form's fields
  doesn't break anything.
- The merged result, `src/data/shabads.json`, is committed to the repo —
  the live site reads this file directly at build time. No API calls
  happen when a visitor loads a page, so the site stays fast and doesn't
  depend on any third party being online.
- A build step (`build-search-index`, runs automatically before `dev` and
  `build`) derives a lean search index from `shabads.json` for the
  homepage and browse page. The browser fetches this separately after the
  page shell has already rendered, rather than it being embedded inline,
  which keeps the initial page load small even with a large dataset.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server (`localhost:4321`) |
| `npm run build` | Production build to `dist/` |
| `npm run fetch-base` | **Rare.** Re-crawls all four sources for shabad text (~2,900 pages; takes a few minutes) |
| `npm run fetch-notation` | Merges notation from the Sheet into `shabads.json` — no crawl, fast |
| `npm run fetch-data` | `fetch-base` + `fetch-notation` in sequence, for first-time setup |
| `npm run publish-notation` | **Routine.** Interactive: fetches notation, prints a diff of what changed, asks for confirmation, then commits and pushes |

## First-time setup

```zsh
npm install
npm run fetch-data   # full crawl + notation merge — takes a few minutes
npm run dev           # preview at localhost:4321
```

## Publishing new sur/taal notation (routine)

1. Notation is submitted through the class Google Form, which writes to a
   published Sheet.
2. Run `npm run publish-notation`.
3. Review the printed summary — it lists every shabad whose notation
   changed and what changed, and prominently flags any **overwrite** of
   previously-submitted notation (since a resubmission for the same shabad
   ID otherwise replaces it silently).
4. Confirm with `y` to commit and push (Cloudflare then auto-deploys), or
   `n` to leave the regenerated file as an uncommitted local change to
   inspect or discard.

This command only ever touches `src/data/shabads.json` — nothing else is
staged, committed, or pushed.

## Refreshing the base text, or adding a source (rare)

1. Add or adjust an entry in the `SOURCES` list in `scripts/fetch-base.mjs`.
2. Run `npm run fetch-base`, then `npm run publish-notation` (or
   `fetch-notation`) to re-merge notation on top of the refreshed text.
3. Review and publish as above.

## Raag reference data

`src/data/raags.js` holds the mood/time/thaat/etc. content shown on each
raag's page, keyed to match `shabads.json`'s `raag` field exactly — the
GurbaniNow API's transliteration doesn't always match common spellings
(e.g. `"Raag Gauree"`, not `"Gauri"`). Every entry defaults to
`status: 'draft'` (compiled from public sources or class notes) until
Bhai Jaspal Singh Ji confirms it and it's flipped to `'approved'` — the
raag page shows a badge reflecting whichever is current.

## Deploying

Hosted on Cloudflare Pages, connected to this repo on GitHub:

| Field | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |

Every push to `main` auto-deploys. The data pipeline is **not** part of the
Cloudflare build — `shabads.json` must already be committed with whatever
notation it should ship with (via `publish-notation`, or `fetch-data` for a
full rebuild) before pushing. This keeps deploys fast and independent of
the GurbaniNow API's or the Sheet's uptime.

## Licensing

Sur/taal notation and the compilation on this site are licensed
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) (see the
site footer) — free for non-commercial use with attribution. Gurbani text
itself is in the public domain. Third-party assets bundled in this repo
(fonts, Tone.js, tabla samples, the license badge) are credited with their
individual licenses in `CREDITS.md`.

## If `fetch-base` errors out

GurbaniNow's exact JSON field names have shifted slightly over the years
across different forks that document the API. If the script fails on the
very first page, it prints the raw API response — that, together with
`scripts/fetch-base.mjs`'s `extractLines()` function, is usually enough to
fix the field mapping.
