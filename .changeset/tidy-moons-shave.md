---
"@mojikumi/core": minor
"@mojikumi/presets": minor
"@mojikumi/dom": minor
"@mojikumi/css": minor
"@mojikumi/react": minor
"@mojikumi/rehype": minor
"mojikumi": minor
---

Cut the presets down to three steps towards print composition

Five presets carried nine flags between them, and three of the flags never
reached the browser: `hanging` and `headingPhraseBreak` were read by nobody, the
stylesheet keying off the preset's class name instead, and `lineEndTrim`'s
`"when-needed"` was collapsed by a `Boolean()` before anything looked at it. A
fourth, `fallback`, existed only to spell `native`, which is what `precision`
already says. And two naming systems ran in parallel: `article`/`book`/`headline`
on the script tag against `web`/`book`/`editorial`/`minimal`/`native` in the API,
with no reader-facing name for two of the five.

So there are three now, on one axis — how far towards print to go.

`article` justifies the text and trims the line ends, which is what Mojikumi is
for: Japanese fills a measure evenly, so justification costs it nothing, and it
is what makes trimming a line-final comma visible at all. `book` adds the
paragraph indent and hanging punctuation of a printed page, and is otherwise the
same. `minimal` is the compromise, named for it: the punctuation, the line starts
and the space between Japanese and Latin, with the line ends given up.

`minimal` is the default, for one reason. Line ends need justification, and
justification needs the DOM fallback until browsers ship `text-spacing-trim:
trim-both` — measured at 45ms and 1,242 generated elements against 5.5ms and none
for 10,000 characters. A page that said nothing should not be signed up for that.
When the browsers catch up, `article` becomes free and takes the default with it.

`web`, `editorial` and `native` still resolve, as does `headline`, so a page that
pasted one of them keeps its typography, and their class names stay in the
stylesheet. `editorial` differed from `web` by turning off the space between
Japanese and Latin, which nothing recorded a reason for, and by a heading
treatment that has always been available on its own as `mjk-heading`.

Hanging punctuation and heading phrase breaks join the indent and the
justification as modifiers, so `hanging` and `headingBreak` can be set on any
preset, from the API, from `data-hanging` and `data-heading-break`, or as props.
The preset type now reads in two halves: what has to happen for the Japanese to
be set correctly, and how this particular page is laid out.
