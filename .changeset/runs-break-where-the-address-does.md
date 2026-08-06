---
"@mojikumi/core": patch
"@mojikumi/css": patch
"@mojikumi/dom": patch
---

Break a long run where the address breaks, not wherever the line ends

A URL or an identifier is the one thing in a Japanese paragraph that cannot be
broken, so Mojikumi wrapped it and let `word-break: break-all` divide it
anywhere rather than let it stretch the justified line in front of it. That
bought the line at the cost of the address: `cdn.mojikumi.jp/v1/mojikumi.min.js`
came apart as `…/v1/mojikumi.` / `min.js`, and on a narrower measure inside the
domain itself, where a reader cannot tell a break from a name that really does
read that way.

The marks that identify a run — `/`, `:`, `_`, `=`, `&`, `?`, `#`, `@`, `~` —
are also the only positions in it that mean anything, so the run now carries a
`<wbr>` just past each of them and the line fills to the last one that fits.
`%` is excluded: the two hex digits after it are one escape (RFC 3986 §2.1),
and dividing them divides a character rather than an address. `<wbr>` is an
element, so nothing is added to `textContent`, to what a reader copies, or to
what is read out. `overflow-wrap: anywhere` remains as the last resort, for a
segment between two marks that will not fit on a line of its own.

The same paragraph at a 22em measure now breaks after `…/v1/` instead of
inside the filename, and a percent-encoded query stays whole.
