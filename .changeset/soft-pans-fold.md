---
"@mojikumi/core": minor
"@mojikumi/dom": minor
"@mojikumi/css": minor
"mojikumi": minor
---

Keep a justified line from stretching around something it cannot break

A Japanese line may break between almost any two characters, so a long run of
Latin is the one thing in a paragraph that cannot be broken. When it will not
fit in what is left of a line the browser moves the whole of it down, and
justification then stretches the four or five characters left behind across the
whole measure. Measured on Chromium 148 at a 24em measure, a URL left the line
in front of it setting its characters 4.4em apart, and an environment variable
7.3em. `overflow-wrap: anywhere`, `text-justify: inter-character` and
`text-wrap: pretty` each changed nothing; the run has to be allowed to break.

So a justified preset now wraps those runs and lets them break anywhere: 4.4em
becomes 1.21em and 7.3em becomes 1.22em, both a line shorter than before. Only
machine-written runs qualify — the run has to be at least sixteen characters and
contain one of `/:_=&?#%@~`, which is what a URL, a path, an identifier or a
query string has and a sentence does not. A long English word keeps its
spelling; prose has spaces to break at, and a word broken mid-syllable reads
worse than the gap it saves.

What that misses, a second pass catches. After the layout settles, a block whose
emptiest line fills less than 70% of the measure has its justification taken
back and keeps a ragged right edge. The threshold sits in a wide empty gap:
across widths from 12em to 30em, ordinary Japanese filled every line to 95% or
more, while the lines justification wrecked filled about a quarter. A ragged
edge is a smaller loss than a line set at four times its natural spacing.

Line-end trimming now also checks that the block really is justified rather than
trusting the preset. Mojikumi asks for justified text with a zero-specificity
rule inside a cascade layer, so a theme's `p { text-align: left }` wins — and
there the trim moves nothing while still being able to talk the browser into a
different line break.
