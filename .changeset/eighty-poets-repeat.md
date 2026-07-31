---
"mojikumi": minor
---

Add a browser bundle that works from a single script tag

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
