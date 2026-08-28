# Mojikumi Chem release checklist

## Automated verification

- `npm ci`
- `npm run assets --workspace @mojikumi/chem-web`
- `npm run typecheck --workspace @mojikumi/chem-web`
- `npx vitest run apps/chem`
- `npm run build:chem`
- `npm run test:chem:e2e`

## Chemical behavior

- A single formula reports its recognized elemental composition.
- Invalid element symbols and unmatched groups produce a specific diagnostic without rewriting the source.
- A balanced reaction reports conservation of both atoms and total charge.
- An unbalanced reaction shows element deltas and offers integer coefficients when a positive solution exists.
- Ionic equations use explicit charges such as `Fe^2+` and conserve charge during balancing.
- States `(s)`, `(l)`, `(g)`, `(aq)`, hydrates, nested groups, and reaction conditions survive every output format.
- Undo and redo restore both the equation and its reaction condition.
- Version 1 local drafts open correctly as version 2 drafts.

## Outputs

- Unicode text, mhchem, LaTeX, Markdown, HTML, JSON, and AI prompts represent the same expression.
- HTML escapes user input.
- JSON contains a versioned reaction and species structure.
- Reaction conditions are attached to the arrow in visual, mhchem, LaTeX, HTML, and AI outputs.

## Manual release checks

- Verify keyboard, touch, and 320 px layout behavior.
- Verify output tabs with arrow keys, Home, and End.
- Verify clipboard behavior in Safari and Chromium.
- Install the PWA and confirm a cached session works offline.
- Check the generated manifest, icons, social card, robots file, and sitemap on the production hostname.
- Confirm `chem.mojikumi.jp` resolves to the independent Chem deployment rather than the Math project.
