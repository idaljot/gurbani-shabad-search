# Tabla bol samples

`dha.wav`, `dhin.wav`, `na.wav`, `tin.wav`, `ta.wav`, `ge.wav`, `ke.wav` are
the 7 bols the player loads. See `CREDITS.md` at the repo root for sourcing
and licensing.

The player checks for these at page load and automatically uses whichever
ones it finds — any bol without a matching file falls back to a synthesized
placeholder, so files can be replaced or added one at a time with no code
changes needed.
