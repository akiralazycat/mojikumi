---
"@mojikumi/core": minor
"@mojikumi/presets": minor
"@mojikumi/dom": minor
"@mojikumi/css": minor
"mojikumi": minor
---

Split the presets into a justified print mode and ragged screen modes

Trimming the half-em after a line-final comma is what lets a printed line reach
the margin. On the web it was doing nothing, and the reason is that the web is
ragged-right: with no glyph to the right of that comma, removing its space moves
nothing. Measured on Chromium 148 over a 219-character paragraph at seventeen
widths from 18em to 34em, the adjustment moved a glyph at two of them when the
text was left-aligned — and at both of those the browser had re-broken the line,
which is the one thing the adjustment can still do when it cannot tighten
anything. Justified, it moved a glyph at seven.

So the two now travel together. `book` justifies and trims line ends; `web`,
`editorial` and `minimal` stay ragged and leave line ends to the browser. Presets
carry a `justify` flag, and the fallback only takes on line ends where it is set.

This also stops `book` and `editorial` from falling back for no gain. Chromium
implements `text-spacing-trim: normal` and `trim-start` but not `trim-both`, so
both presets were failing the line-end check on every current Chromium, switching
native punctuation spacing off with `text-spacing-trim: space-all` and
recomputing all of it in JavaScript — around 45ms and 1,242 generated elements at
10,000 characters, against 5.5ms and none for the native path. `editorial` is
ragged, so it no longer asks. `book` still does, and now gets a visible result
for it.

Line context is measured in phases — clear, read, write — instead of one token
at a time, and every adjustment is then checked against the layout it produced.
An adjustment can invalidate its own reason: pulling a line-final bracket in by
half an em can leave room for the next character, the browser takes it, and the
bracket that was measured as line-final is now mid-line carrying a negative
margin, overlapping the character that moved up. In the JLREQ specimen on the
site this landed on `「『またあした』」の`, where the `の` sat half an em inside
the `」`. Dropping the adjustment puts the character back, so the two states
alternate and no amount of re-measuring settles them. Verification therefore only
ever withdraws an adjustment, never re-applies one: it terminates, and it ends on
the safe state — no adjustment, and the line as the browser composed it.
