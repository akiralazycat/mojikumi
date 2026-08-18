---
"@mojikumi/css": patch
"@mojikumi/dom": patch
---

Give the line-final stops to hanging punctuation, where the browser has it

`book` asked for `hanging-punctuation: first allow-end` while the DOM fallback
trimmed line ends on its own measurements, and on WebKit the two split the
page three ways: stops that hung, stops the trim caught, and stops the trim
had withdrawn sitting a half-em short of the margin. The hang is now forced
rather than conditional, and where the browser supports it the fallback stops
wrapping stops and commas altogether — hanging takes every one of them, takes
no space in the line, and so cannot re-break anything — while the closing
brackets, which hanging-punctuation has no value for, stay with the trim.
`precision: "full"` still rehearses a browser with no native features, so
there hanging is disabled and the trims play every part.
