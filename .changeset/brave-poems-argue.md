---
"@mojikumi/css": patch
---

Let the Playground show what the preset actually does

The site set its sample cards justified in its own stylesheet, unlayered, which
beats anything Mojikumi asks for from inside a cascade layer — including the
rule that takes justification back from a line it wrecked. Choosing a preset in
the Playground would have changed nothing anyone could see. The cards now follow
the preset being demonstrated: the three comparison cards inline the alignment
so they stay comparable, and the Mojikumi card is left to decide for itself.
