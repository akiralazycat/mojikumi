---
"@mojikumi/css": patch
"mojikumi": patch
---

Let the fallback spacing survive a theme's `* { margin: 0 }`

The JS fallback wraps punctuation, measures every line, and then asks CSS to
pull the characters together with a negative inline margin. Those four rules
sat inside `@layer mojikumi`, and an unlayered declaration beats a layered one
whatever its specificity, so the `* { margin: 0 }` that resets and CMS themes
almost all ship was silently winning. Every adjustment computed to `0px`. The
fallback did all of its work and moved nothing.

Nowhere with native `text-spacing-trim` noticed, because there the fallback
never starts. Safari and Firefox got the whole of it: on a WordPress theme with
such a reset, a paragraph came out fractionally wider than with no Mojikumi at
all, since the one hook that did survive was the autospace pseudo-element,
which adds space rather than removing it.

The four hooks now sit outside the layer. Everything else stays in it. The
distinction is who owns the element: the layered rules style the page's own
elements, where losing to the page is the point, while these reach only spans
Mojikumi generated a moment earlier, which no author has written a rule for.
