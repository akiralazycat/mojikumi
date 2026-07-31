# mojikumi

## 0.2.1

### Patch Changes

- 7303580: Point `mojikumi/browser` at the module, not the bundle

  The subpath resolved to the IIFE file built for script tags, which has no
  exports and no types: `import { start } from "mojikumi/browser"` could not
  work, and a project that also imported `mojikumi` ended up with a second copy
  of the core, DOM and preset code inside the bundle. It now resolves to the ESM
  build with its type definitions, and the bundle keeps a path of its own for
  anyone serving it themselves.

  Auto-start now requires the script tag that carried the configuration. An
  import has no tag behind it, so the module no longer applies Mojikumi to a
  page whose author only asked for the module; call `start()` when you want it.
  Loading the bundle from a script tag is unaffected.

  - @mojikumi/core@0.2.1
  - @mojikumi/css@0.2.1
  - @mojikumi/presets@0.2.1
  - @mojikumi/dom@0.2.1

## 0.2.0

### Minor Changes

- 0b2649f: Add a browser bundle that works from a single script tag

  Everything Mojikumi shipped so far assumed a build step, which left out the
  people whose sites need the typography most: a WordPress theme, a Shopify
  storefront, anything edited through an admin screen. `mojikumi/browser` is the
  same DOM layer with its dependencies and its stylesheet bundled in, published
  as `dist/mojikumi.browser.js` and served from `cdn.mojikumi.jp`.

  The tag carries its own configuration, so nothing else has to be written:

  ```html
  <script
    src="https://cdn.mojikumi.jp/v1/mojikumi.min.js"
    data-target=".entry-content"
    data-style="article"
  ></script>
  ```

  `data-style` names what the reader gets — `article`, `book`, `headline` —
  rather than which preset it maps to, and preset names still work for anyone
  who wants them. The stylesheet goes in during evaluation so it lands before
  the page is painted; the DOM pass waits for the document.

  Pasting the snippet twice mounts nothing twice, articles that arrive after
  load are picked up, and roots inside an admin bar, a block editor, or anything
  being typed into are left alone. Nothing in the entry point is allowed to
  throw into the page: an unparseable selector, a missing target, or a root that
  will not mount costs that site its typography, never its text.

### Patch Changes

- Updated dependencies [9f8920b]
  - @mojikumi/dom@0.2.0
  - @mojikumi/css@0.2.0
  - @mojikumi/core@0.2.0
  - @mojikumi/presets@0.2.0

## 0.1.1

### Patch Changes

- Prepare the first automated release through npm Trusted Publishing, with synchronized package versions, verified package contents, and repository metadata that publishes without normalization warnings.
- Updated dependencies
  - @mojikumi/core@0.1.1
  - @mojikumi/css@0.1.1
  - @mojikumi/presets@0.1.1
  - @mojikumi/dom@0.1.1
