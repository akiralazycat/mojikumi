---
"@mojikumi/core": minor
"mojikumi": minor
---

Put the prolonged sound mark back with the kana, and leave fullwidth forms alone

`ー` is Script=Common, so a Script test dropped it into the catch-all class and
every katakana word ending in one lost the space before what followed:
`コーヒーAPI`, `メニュー100円`. Chromium puts 0.125em at those boundaries, so the
fallback was disagreeing with the browser it is meant to stand in for. Character
classes now go by Script_Extensions, which is where the prolonged sound mark and
the halfwidth voiced marks actually live.

The other direction was wrong too. `Ａ` and `１` are Latin and Number to Unicode,
and the fallback was spacing them away from the Japanese around them — but CSS
Text 4 leaves fullwidth forms out of the alphanumeric side, and Chromium
measurably adds nothing there. Fullwidth forms are now excluded, so the two
paths agree.

`〝` and `〟` join the bracket classes. Measured on Chromium, `text-spacing-trim`
trims both to 0.5em next to another bracket, exactly as it does `『』`.

Three characters that were on the list to fix turned out not to want fixing.
`〜`, `…`, `―` and the halfwidth forms `｡｢｣､･` stay in the catch-all class on
purpose: measured, none of them is ever trimmed, and the halfwidth forms are
already 0.5em wide. Taking half an em off a glyph that has none to give would
close it up against its neighbour. Everything the Unicode tables call punctuation
or a symbol, and that the table does not name, is now explicitly left alone —
which also stops Script_Extensions from reading `｢` as a katakana letter.
