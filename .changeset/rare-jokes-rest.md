---
"@mojikumi/css": patch
---

Stop overriding the page's scroll behaviour

The stylesheet turned `scroll-behavior: auto` on inside a reduced-motion query.
Mojikumi never sets `scroll-behavior`, so there was nothing of its own to undo —
all the rule could do was take back a `scroll-behavior: smooth` the page had
chosen for that element, on a preference the page is at least as able to read.
