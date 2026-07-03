# Gurbani Shabad Search

A searchable, filterable database of Shabads for your music class — filter by Raag, Writer, and Taal.

Built with Astro, deployed with the same pipeline as your personal site:

```
VS Code → git push → GitHub → Cloudflare Pages
```

## How the data works

- Shabad text, Raag, and Writer come from the free **GurbaniNow API**, which
  covers all of Sri Guru Granth Sahib Ji.
- **Taal is not tagged in any public Gurbani database** (it's a Gurmat
  Sangeet convention, not a database field), so you supply it yourself in
  `data/taal-mapping.json` — just `"shabadId": "TaalName"` pairs for the
  shabads you teach.
- A build script (`scripts/fetch-shabads.mjs`) walks all 1430 Angs once,
  merges in your Taal mapping, and writes everything to
  `src/data/shabads.json`. That file is what the live site actually reads —
  no API calls happen when a student visits, so the site is fast and never
  depends on a third party being online.

## First-time setup

```zsh
npm install
npm run fetch-data     # pulls the full Shabad dataset — takes a few minutes
npm run dev            # preview at localhost:4321
```

## Adding Taal tags

1. Look up a shabad on the site (search box shows its Ang/Raag/Writer).
2. Open the browser dev tools or check `src/data/shabads.json` after a fetch
   to find its `shabadId`.
3. Add a line to `data/taal-mapping.json`:
   ```json
   "3589": "Teentaal"
   ```
4. Re-run `npm run fetch-data` to bake it into `shabads.json`.
5. Commit and push — Cloudflare rebuilds automatically.

## Deploying (same steps as idaljot.pages.dev)

1. `gh repo create` (or create on github.com), then `git push`.
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**,
   select this repo.
3. Build settings:

   | Field | Value |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

   Note: the **fetch-data step is NOT part of the Cloudflare build** —
   run `npm run fetch-data` locally and commit the resulting
   `src/data/shabads.json` before pushing. This keeps deploys fast and
   independent of the third-party API's uptime.

4. Save and deploy. Every future `git push` (after you've re-run
   `fetch-data` if the data changed) auto-deploys.

## If the fetch script errors out

GurbaniNow's exact JSON field names have shifted slightly across the years
and forks that document it. If `npm run fetch-data` fails on the very first
Ang, it will print the raw API response — paste that into a chat with
Claude along with `scripts/fetch-shabads.mjs` and the field mapping in
`extractLines()` can be fixed in a couple of minutes.
