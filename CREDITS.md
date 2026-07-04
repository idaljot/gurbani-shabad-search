# Credits

## Tabla player audio (placeholder — no samples licensed yet)

The tabla taal player (`src/components/TablaPlayer.astro`) currently synthesizes
its 7 bols (`dha`, `dhin`, `na`, `tin`, `ta`, `ge`, `ke`) with `Tone.MembraneSynth`
instead of using real tabla recordings.

**Why:** a quick pass over Freesound.org and ragajunglism.org (2026-07-03) turned
up no complete, confidently-licensed set of clean single-bol tabla samples:

- ragajunglism.org has good theka references but states no reuse license for its
  audio/content.
- Freesound packs (e.g. `mmiron`'s "tabla bols" pack) have partial coverage
  (missing clean `dha`/`dhin`/`tin`/`ta` hits) and licensing isn't shown at the
  pack level — each individual sound's page would need to be checked one by one.
- Commercial libraries (Noiiz, SampleFocus, Looperman) aren't clearly
  redistributable in a public git repo.

**To swap in real samples later:**

1. Source one clean, confirmed-license WAV per bol and drop them in `public/tabla/`
   named exactly: `dha.wav`, `dhin.wav`, `na.wav`, `tin.wav`, `ta.wav`, `ge.wav`, `ke.wav`.
2. If any are CC-BY (not CC0), add attribution here, e.g.:
   `- "dha.wav" by <author> (Freesound.org, CC-BY 4.0) — <link>`
3. In `src/components/TablaPlayer.astro`, swap the `getSynthFor()` membrane-synth
   fallback for a `Tone.Player` loading `/tabla/<bol>.wav` (Tone.Players with a
   URLs map is the simplest option).

No attribution currently required — everything audible is synthesized, not sampled.
