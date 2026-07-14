# CLAUDE.md — ShabadSwar.com

Operating instructions for AI sessions in this repo. Keep this file lean and stable.

## Read first

Project state, people, open decisions, and history live in **`SHABADSWAR-CONTEXT.md`**.
Read it when a task needs project context (it is not auto-imported, to save tokens).
Notation spec lives in **`SARGAM.md`**.

## What this is

A Gurbani kirtan notation & search site (Astro static site, no backend), built as a
*seva* project. Sacred musical content — **wrong notation is worse than no notation.**

## Commands

- `npm run dev` — local dev (auto-builds the search index)
- `npm run build` — production build (auto-builds the search index)
- `npm run fetch-base` / `fetch-notation` / `fetch-data` — data crawls
- `npm run publish-notation` — publish reviewed notation
- `npm run build-search-index` — rebuild search index

## Workflow rules

- **One feature at a time. Merge before starting the next.**
- **All code changes go through a branch off `main` → review → merge.** No direct
  commits to `main` for code. Data-only notation publishes may go direct-to-main
  after review.
- **Never guess notation.** Human-gated decisions (e.g. the Ma swar convention)
  must be confirmed by Ustaad ji before encoding — leave them open, don't invent.
- Keep the crawl (infrequent) decoupled from notation merging, with a
  diff-and-confirm checkpoint.

## Maintenance

At the end of any session where project state changes (branch merged, decision
resolved, PDFs received), update `SHABADSWAR-CONTEXT.md` and its `Last updated` date.
