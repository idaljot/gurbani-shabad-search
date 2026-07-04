# Credits

## Tabla player audio

`public/tabla/dha.wav`, `dhin.wav`, `ge.wav`, `ke.wav`, `na.wav`, `ta.wav`, `tin.wav`
are single tabla bol recordings by **msarkar** (Freesound pack
["Tabla"](https://freesound.org/people/msarkar/packs/3571/)), converted from the
original AIFF to WAV. Freesound lists that pack under the Creative Commons
Sampling+ 1.0 license, which is narrower than a typical CC-BY grant (it's
oriented around transformative sampling rather than embedding sounds
unaltered) — the site owner (idaljot) contacted msarkar directly and got
explicit permission to use these recordings as-is in this project.

`public/tabla/tun.wav` and `te.wav` are single tabla bol recordings by
**mmiron** (Freesound pack
["tabla bols"](https://freesound.org/people/mmiron/packs/8162/), files
[130416](https://freesound.org/s/130416/) and
[130429](https://freesound.org/s/130429/) respectively), added 2026-07-04
when new taals (Chartaal, Jhaptaal, Tilwada, Dhamaar, Sooltaal — see
`src/data/taals.js`) made `Tun` and `Te` referenced bols in their own right
rather than just approximation targets for other syllables. Freesound lists
this pack under **Creative Commons 0** (CC0 — public domain, no attribution
legally required), credited here anyway as good practice.

The `Tone.MembraneSynth` synthesized placeholder in
`src/components/TablaPlayer.astro` is still used as an automatic fallback for
any bol whose sample file is missing, so the player degrades gracefully
rather than going silent.

`public/tabla/bell.wav` (the optional "Bell on beat 1" sam sound) is **not**
from either pack above and has no documented source — see
`public/tabla/README.md`. Confirm its license before treating it as covered
by the credits on this page.

## Available but unused

The rest of `sample-sources/8162__mmiron__tabla-bols/` (mmiron, CC0, same
pack as above) has more variety (multiple takes per bol, plus
`ghe`/`na`/`ke`/`tas`/`re` strokes) not currently referenced by any taal in
`taals.js`. Kept in the repo (not under `public/`, so it isn't shipped to the
live site) in case a future taal needs one of these — only the bols an
actual theka references get copied into `public/tabla/`, to avoid shipping
unused audio. msarkar's original pack is kept alongside it at
`sample-sources/3571__msarkar__tabla/` for reference/license provenance.
