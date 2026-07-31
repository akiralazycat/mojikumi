---
"mojikumi": patch
---

Allow `mojikumi/package.json` to be imported

The docs page reads the published version at build time so the pinned CDN URL
it shows cannot fall behind a release. Under an exports map that subpath has
to be declared, and declaring it costs nothing else.
