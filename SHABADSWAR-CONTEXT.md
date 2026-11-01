# ShabadNotes.com — Project Context Anchor

> Portable source-of-truth for the Gurbani kirtan notation & search site.
> This file is version-controlled and independent of any chat or project memory.
> Update the relevant section at the end of any session where something meaningful
> changes. Point new chats at this file instead of re-pasting history.

_Last updated: 2026-11-01_

---

## Purpose

A Gurbani kirtan notation and search website, built as a *seva* project for
Daljot's music class. It makes Ustaad Bhai Jaspal Singh Ji's raag and sargam
notation searchable and accessible to the kirtan community.

Domain decision: **shabadnotes.com** (bought 2026-11-01 via Cloudflare Registrar,
live on Cloudflare Pages; `www` 301-redirects to the apex). Site renamed
"Gurbani Kirtan Swar Notation" → **Shabad Notes**. This reverses the earlier
choice of ShabadSwar.com (which Ustaad ji's son had confirmed; Daljot chose not
to re-consult since the project had been dormant for months), mainly for
spelling/memorability ("swar" vs svar/sur) and because "notes" is the everyday
word students search. shabadswar.com was never bought.
The old `gurbani-shabad-search.pages.dev` address 301-redirects to
shabadnotes.com (Cloudflare Bulk Redirect, path + query preserved, subdomains
**not** included so PR preview URLs keep working). Every page also carries a
canonical link to shabadnotes.com (`site` set in `astro.config.mjs`).

## People

- **Ustaad Bhai Jaspal Singh Ji** — musical authority; source of raag/notation.
- **Ustaad ji's son** — collaborative; confirmed the domain, promised notation
  PDFs; runs the related project **kirtan.education** (shabad-ranked videos with
  verse-level ID mapping; potential data-sharing partner).
- **Baljeet** — developer classmate who practices kirtan; gates notation review.

## Stack

- **Framework:** Astro (static site, no backend) — v5
- **Deploy:** VS Code → GitHub → Cloudflare Pages (project `gurbani-shabad-search`;
  `main` = production at shabadnotes.com). Each PR gets a preview at
  `https://<branch>.gurbani-shabad-search.pages.dev` — the branch alias is
  truncated to 28 characters, so long branch names get cut off.
- **Data source:** GurbaniNow API — four sources, ~12,000 shabads total
  (Guru Granth Sahib Ji, Sri Dasam Granth, Vaaran Bhai Gurdas Ji, Bhai Nand
  Lal Ji)
- **Search reference:** SikhiToTheMax conventions; GurbaniAkhar keyset
- **Audio:** Tone.js tabla player + synthesized tanpura, all runtime assets self-hosted
- **Typography:** Fraunces serif (display), self-hosted Google Fonts

### Key scripts (package.json)

- `npm run dev` / `npm run build` — Astro (both auto-run `build-search-index` first)
- `npm run fetch-base` — crawl base shabad text
- `npm run fetch-notation` — fetch notation data
- `npm run publish-notation` — publish reviewed notation
- `npm run build-search-index` — rebuild the search index

---

## Current state (built)

- Gurmukhi first-letter search (GurbaniAkhar keyset, Roman→Gurmukhi
  conversion), matching from line start rather than anywhere in the line
- Per-shabad detail pages, now with next/previous shabad navigation
- Tabla player (Tone.js + self-hosted CC0 samples), rotating between takes of
  a bol with slight per-stroke variation; synthesized tanpura drone whose Sa
  follows the shabad's Key (first string Pa/Ma/Ni selectable; controls in both
  normal and fullscreen views). Beat-1 bell played 10 dB down and cut after
  ~1.1 s. Extra takes are listed in `SAMPLE_TAKES` (`taals.js`) and must come
  from the same tabla as take 1. Naad's sample library (MIT) was evaluated
  2026-11-01 but not used: its takes come from tablas tuned to different pitches.
- Raag reference pages with YouTube playlists from @GurmatSangeetTutorials,
  including an "About this Raag" section (time-period disclaimer + review
  badge) and reconciled seed data
- Fourth source added: **Bhai Nand Lal Ji** (alongside Guru Granth Sahib Ji,
  Sri Dasam Granth, Vaaran Bhai Gurdas Ji) — Source filter ordered by
  crawl-add order, not alphabetically, so the largest/oldest source still
  reads as primary
- Data pipeline split into independent stages with a review checkpoint:
  `fetch-base` (GurbaniNow crawl) → `fetch-notation` (Google Sheet merge,
  now including **Key** and **Alaap** fields) → `publish-notation`
  (pre-publish review gate) → `build-search-index` (runs automatically
  before `dev`/`build`)
- All runtime third-party dependencies self-hosted — Tone.js, fonts (DM
  Sans, Fraunces, Noto Sans Gurmukhi), CC BY-NC badge — no CDN/Google Fonts
  calls at runtime; see `CREDITS.md`
- Performance/a11y pass: lean search index shipped via `fetch()` on both
  homepage and browse page (was blocking first paint), Tone.js deferred,
  detail-page layout-shift fixes, favicon fix, accessibility/SEO sweep
- 2026-11-01: 20 more shabads published from Daljot's notation doc + Gaund/
  Dhanasari xlsx (28 notated total). Published as-is with known open items:
  "or" alternatives in JL4/MKT/UKQ, suspected typos in QSM/ET9/MFC, not yet
  reviewed by Baljeet/Ustaad ji. Held back: Chilmil, Murda Hoye Murid (incomplete).
- 2026-11-01: `notatedAt` now parsed day-first (sheet locale), fixing the
  "recently notated" order; raag notes no longer leak developer comments;
  unique per-shabad page titles; notation shown before text on mobile
- Fixed: concurrency race condition in the base-text crawl (~800 shabads had
  out-of-order lines) — see `crawl-ordering-fix-2026-07-06.md`

## In progress — `feat-sargam-notation` branch (UNMERGED, 23 commits behind `main`)

Substantially further along than "spec + parser" — notation actually renders
on shabad pages now, gated only on review:

- Canonical ASCII spec: `SARGAM.md`; zero-dependency ES-module parser:
  `sargam.js`; legacy sur data migrated onto the new format
  (`legacy-notation.mjs`)
- Renders live on shabad detail pages via `NotationView.astro`, with a
  Roman / Bhatkhande / Gurmukhi script toggle
- Notation wraps at each taal cycle boundary with vibhag (clap-division)
  marks within a cycle; taal markers simplified to X/O; site widened to
  1280px with responsive-grid result lists to make room for notation beside
  the shabad text
- Gurmukhi marks rendered via CSS/SVG (the proposed 2013 Unicode chars were
  never encoded); mark spacing has been tightened on both Gurmukhi and
  Bhatkhande scripts so komal/octave marks read as attached rather than
  floating
- **Blocked on:** Baljeet's review of notation presentation, cycles-per-line
  display, and data-entry conventions
- **Needs a rebase before merging** — its last commit is 2026-07-08; `main`
  is 23 commits ahead as of 2026-11-01 (incl. the Shabad Notes rename, page
  titles, mobile notation order and tabla/tanpura changes to `[id].astro` and
  `TablaPlayer.astro`), so expect conflicts

## Resolved / recent

- **Ma swar convention — SETTLED (shuddha-set):** `M` = shuddh madhyam, `m` = teevra.
  Uniform rule: uppercase = shuddh, lowercase = altered (`r g d n` komal, `m` teevra).
  Notation scripts reduced to **Roman + Gurmukhi** (Bhatkhande dropped). `SARGAM.md` (dataset
  copy) already updated. **Pending on `feat-sargam-notation`:** flip `m`/`M` in `sargam.js`,
  drop Bhatkhande in `NotationView.astro`, sync the branch's `SARGAM.md`, and **audit +
  migrate any already-encoded ma notation** (e.g. `legacy-notation.mjs`) — old convention had
  `m`=shuddh, so meaning inverts if not migrated.
- **Ustaad ji's notation PDFs received** (via Anmol) — extraction underway in the separate
  `gurmat-sangeet-data` repo (see that repo's `CLAUDE.md`).

## Notation intake from local files (workflow used 2026-11-01)

`publish-notation` only reads the Google Sheet (it rebuilds `shabads.json` from
it every run), so local notation files go **into the Sheet**, never straight
into `shabads.json`:

1. Read the files; match each shabad to its ID by searching Gurmukhi text in
   `src/data/shabads-base.json` (title transliterations are loose — confirm
   ambiguous matches with Daljot rather than guessing).
2. Write a TSV in the Sheet's column order — `Timestamp` (day-first,
   `dd/mm/yyyy hh:mm:ss`), `Shabad ID`, `Sthayi notation`, `Antara notation`,
   `Alaap notation`, `Pitch/Key`, `Taal` (use the spellings in `taals.js`, e.g.
   `Kaherva`), `Tempo` — plus a review-notes file listing typos, "or"
   alternatives and anything left out.
3. Daljot imports it: Sheet → File → Import → Append, tab-separated.
4. Dry run: `echo n | npm run publish-notation` shows the diff. **Then discard
   the regenerated file** (`git checkout -- src/data/shabads.json`), otherwise
   the real run sees "no changes" and won't commit.
5. Real run with `y` commits `shabads.json` and pushes to `main` (allowed for
   reviewed data).

The 2026-11-01 source files and `prepared/REVIEW-NOTES.md` are in
`~/Downloads/notations/` on Daljot's machine.

## Known data issues / follow-ups

- Published with open items (2026-11-01 batch): "or" alternatives in JL4, MKT,
  UKQ; suspected typos `GGGGGGG` (QSM), `S'N'S'` + `PPPPP` (ET9), `S'S''S'S'`
  (MFC); `*`/`**`/`->` markers unexplained; Shant Payi (2D9) has no taal
  ("Kehrwa/teentaal" in source). Satgur Sacha Patsaho mapped to `9M6`
  (Vaar 11) by Daljot.
- Kavan Bani (JK3): live taal is Kaherva, Daljot's notation doc says Rupak.
- Naam Na Janeya notation sits on `BT3` (end of Bachittar Natak ch. 5) —
  confirm that's the intended shabad.
- `public/tabla/bell.wav` has no documented source/license (see `CREDITS.md`);
  could be replaced by a synthesized bell.

## Open decisions (need a human — do not guess)

- Other notation calls pending Ustaad ji's input.
- Dataset governance + licensing (proposed CC BY-NC 4.0) — pending Ustaad ji's family's blessing.

## On the horizon

- Merge `feat-sargam-notation` after classmate review.
- **Canonical public dataset repo:** a separate public repo of Ustaad ji's raag
  and notation data that any project (incl. kirtan.education) could consume.
  Daljot designs the format first, then invites others to adopt it.

---

## Working conventions / principles

- **Automate tedium, keep human judgment as the gate** — for sacred musical
  content, wrong notation is worse than no notation.
- **Merge-before-next** — one feature at a time; preview-branch → review → merge
  for all code. Data-only notation publishes may go direct-to-main after review.
- **Content before build.**
- **Static-first** — no backend. Crawl (yearly) is decoupled from notation
  merging (weekly) with a diff-and-confirm checkpoint.
- Two Claude surfaces: chat for architecture/planning/prompt design; Claude in
  VS Code ("CVS") for execution.
- Prefers honest assessments over reassurance.
