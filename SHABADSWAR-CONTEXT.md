# ShabadSwar.com — Project Context Anchor

> Portable source-of-truth for the Gurbani kirtan notation & search site.
> This file is version-controlled and independent of any chat or project memory.
> Update the relevant section at the end of any session where something meaningful
> changes. Point new chats at this file instead of re-pasting history.

_Last updated: 2026-07-14_

---

## Purpose

A Gurbani kirtan notation and search website, built as a *seva* project for
Daljot's music class. It makes Ustaad Bhai Jaspal Singh Ji's raag and sargam
notation searchable and accessible to the kirtan community.

Domain decision: **ShabadSwar.com** was kept despite the "swar"-over-the-phone
concern (mishearing/misspelling). Considered and set aside: ShabadSur, ShabadNotes,
ShabadSargam, GurbaniSargam.

## People

- **Ustaad Bhai Jaspal Singh Ji** — musical authority; source of raag/notation.
- **Ustaad ji's son** — collaborative; confirmed the domain, promised notation
  PDFs; runs the related project **kirtan.education** (shabad-ranked videos with
  verse-level ID mapping; potential data-sharing partner).
- **Baljeet** — developer classmate who practices kirtan; gates notation review.

## Stack

- **Framework:** Astro (static site, no backend) — v5
- **Deploy:** VS Code → GitHub → Cloudflare Pages
- **Data source:** GurbaniNow API — four sources, ~12,000 shabads total
  (Guru Granth Sahib Ji, Sri Dasam Granth, Vaaran Bhai Gurdas Ji, Bhai Nand
  Lal Ji)
- **Search reference:** SikhiToTheMax conventions; GurbaniAkhar keyset
- **Audio:** Tone.js tabla player, CC0 samples, all runtime assets self-hosted
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
- Tabla player (Tone.js + self-hosted CC0 samples)
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
- Fixed: concurrency race condition in the base-text crawl (~800 shabads had
  out-of-order lines) — see `crawl-ordering-fix-2026-07-06.md`

## In progress — `feat-sargam-notation` branch (UNMERGED, 1 commit behind `main`)

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
  has since moved 1 commit ahead (next/previous shabad navigation)

## Open decisions (need a human — do not guess)

- **Ma swar convention:** m = shuddh vs. m = teevra — needs Ustaad ji's
  ear-confirmation before encoding.
- Other notation calls pending Ustaad ji's input.
- Awaiting Ustaad ji's notation PDFs.

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
