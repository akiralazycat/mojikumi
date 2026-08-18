---
"@mojikumi/dom": minor
"@mojikumi/css": minor
"@mojikumi/react": minor
"mojikumi": minor
---

Let a page choose the paragraph indent and the justification

Whether paragraphs are indented is a decision about the book being designed, not
about Japanese typography, and `book` was deciding it for everyone. So the two
presentational choices in the presets — the indent and the justification — are
now modifiers that override whichever preset is in use, `indent` and `justify`,
with `data-indent` and `data-justify` on the script tag and props of the same
names on the React component. Leave them out and the preset decides, which is
not the same as passing `false`: on a book, an absent `data-indent` keeps the
indent and `data-indent="false"` drops it.

Modifiers are folded into the resolved preset rather than carried beside it, so
nothing downstream can consult the preset and miss the override. That matters
for `justify`, which has to take line-end trimming with it: trimming the half-em
after a line-final comma only shows in a justified line, so `justify: false` on a
book stops the fallback wrapping line ends at all — on a browser whose only
missing piece was `text-spacing-trim: trim-both`, it stands the fallback down
entirely and hands the paragraph back to native CSS.

A modifier only puts a class on the root where it disagrees with the preset. The
alternative was to state the agreement too, and `text-align: start` on every
ragged root would take a centred pull quote inside an article with it.

The indent amount is now `--mjk-paragraph-indent` rather than a hard-coded 1em,
so a stylesheet can change it without rewriting the rule.
