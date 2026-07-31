---
"mojikumi": patch
---

Point `mojikumi/browser` at the module, not the bundle

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
