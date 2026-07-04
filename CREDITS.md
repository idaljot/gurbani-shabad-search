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

The `Tone.MembraneSynth` synthesized placeholder in
`src/components/TablaPlayer.astro` is still used as an automatic fallback for
any bol whose sample file is missing, so the player degrades gracefully
rather than going silent.

## Available but unused

`sample-sources/8162__mmiron__tabla-bols/` — a CC0 ("Creative Commons 0", no
attribution required) pack by **mmiron**
([Freesound](https://freesound.org/people/mmiron/packs/8162/)) with more
variety (multiple takes per bol, plus `ghe`/`na`/`ke`/`te`/`tun`/`tas`/`re`
strokes) but no direct hit for `dha`, `dhin`, or `tin`. Kept in the repo (not
under `public/`, so it isn't shipped to the live site) in case a future pass
wants to blend in round-robin variation or fill different bols. msarkar's
original pack is kept alongside it at `sample-sources/3571__msarkar__tabla/`
for reference/license provenance.
