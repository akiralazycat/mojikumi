# @mojikumi/css

## 0.2.1

## 0.2.0

### Patch Changes

- 9f8920b: Close up a closing bracket that lands at the end of a line

  Line-end detection compared a character against the next one anywhere under
  the mounted root, so it read across a paragraph boundary. The following
  paragraph always renders on another line, which made every paragraph-final
  closing bracket look like it sat at the end of a line and pulled it half a
  character to the left wherever it actually was. The search now stays inside
  the character's own block, matching how line starts were already decided.

  The `web` preset also asked the browser only for `text-spacing-trim:
trim-start`, so the line-end trimming its own spec promises never happened in
  browsers that could do it for free. It now takes `trim-both` where that is
  supported, alongside `book`, `editorial` and `native`. What stays conditional
  about `web` is that it will not start the JS fallback just to trim line ends.

## 0.1.1

### Patch Changes

- Prepare the first automated release through npm Trusted Publishing, with synchronized package versions, verified package contents, and repository metadata that publishes without normalization warnings.
