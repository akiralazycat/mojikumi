# Mojikumi Math — product and implementation plan

Status: Public MVP implementation complete; release validation in progress / August 2026
Target: `https://math.mojikumi.jp`

## 1. Product definition

Mojikumi Math is not a calculator, CAS, notebook, or AI answer service. It is a
**mathematical input and conversion layer**: users construct a typeset expression
once, then carry it to an AI, LaTeX, Markdown, MathML, or the Web.

> 数式を、思ったまま入力する。書いた数式を、どこへでも持ち出す。

The first version optimizes one loop:

1. Open without signing in.
2. Tap a structured math key and complete its placeholders.
3. Choose the destination format.
4. Copy.

Success means this loop feels materially faster than typing LaTeX on a phone.

## 2. Scope

### MVP

- Direct, typeset expression editing with MathLive
- Mojikumi-designed touch keyboard: Basic, Algebra, Calculus, Greek
- Structural insertion for fraction, root, power, integral, limit, and sum
- Undo/redo and physical-keyboard support inherited from the mathfield
- Ask AI, readable plain text, LaTeX, Markdown, MathML, and Embed outputs
- One-tap copy, light/dark appearance, local draft recovery, PWA shell
- Japanese-first interface; no login and no server-side user data

### Explicitly out of scope

- Solving, simplification, graphing, AI chat, cloud sync, notebooks, documents,
  symbolic programming, or a marketplace of formulas
- Claiming semantic certainty when notation is ambiguous
- Public Embed API before the underlying expression and serializer contracts are stable

## 3. Information architecture

The product surface remains deliberately small.

```text
math.mojikumi.jp/
├── /                 input canvas + converters
├── /guide/           interaction and export guide (MVP+)
├── /accessibility/   reading, intent, and MathML policy (MVP+)
└── /about/           product boundary and open-source relationship (MVP+)
```

The editor is the home page. There is no dashboard before user accounts or
durable documents exist. As of August 2026 the three MVP+ routes are still
covered by sections of the home page (`#use-cases`, `#privacy`); they become
separate routes when their content outgrows that.

## 4. Repository shape

The app is an independent workspace inside the existing monorepo:

```text
apps/
├── web/                    mojikumi.jp — existing site
├── playground/             existing package playground
├── cdn/                    existing CDN build
└── math/                   math.mojikumi.jp — independent Next.js app
    ├── app/                routes, metadata, app-local design tokens
    └── components/         product UI

packages/                   existing Mojikumi packages, unchanged
└── math-*                  added only after an API earns reuse
```

Rules that keep collisions low:

- Deploy `apps/math` as its own Vercel project and attach only
  `math.mojikumi.jp`; keep `apps/web` attached to `mojikumi.jp`.
- Use the unique workspace name `@mojikumi/math-web` and app-scoped scripts
  (`dev:math`, `build:math`).
- Do not import from `apps/web`. Match its design language through documented
  principles and local blue tokens, not cross-app relative paths.
- Prefix browser state and events with `mojikumi.math.*`.
- Keep output static while the MVP has no account or server data.
- Add `packages/math-core` only when both the Web app and Embed consume the same
  semantic contract. Premature extraction would increase maintenance today.

Repository decision (August 2026): keep Mojikumi Math in this monorepo for the
MVP. A separate `mojikumi-math` repository becomes worthwhile only when the Math
packages need an independent release cadence, maintainer group, or issue/roadmap
surface. The Vercel project and `math.mojikumi.jp` domain remain independent in
either arrangement.

Vercel should be configured with repository root access and `apps/math` as the
project Root Directory, using Node.js 22 or newer as required by the current
MathLive/Compute Engine dependency chain. Separate projects allow independent
domains, deploys, rollbacks, and environment settings from the same monorepo.

## 5. Technical boundaries

```text
MathLive mathfield
       ↓
MojikumiExpression adapter
       ↓
├── readable / spoken plain
├── strict plain
├── AI prompt
├── LaTeX / Markdown
├── MathML
└── Web Component embed
```

The current implementation keeps MathLive behind this app-local internal seam:

```ts
type MojikumiExpression = {
  version: 1;
  engine: "mathlive";
  isComplete: boolean;
  latex: string;
  plainText: string;
  strictText: string;
  spokenText: string;
  mathMl: string;
};
```

MathJSON is an engine detail, not Mojikumi Math's public API. Serializer tests
must use fixtures at the `MojikumiExpression` boundary so MathLive or the Compute
Engine can later be replaced without breaking Embed users.

## 6. Design direction

Mojikumi Math shares the parent brand's restrained, editorial UI:

- soft paper-like background and faint texture
- mincho display type, calm rounded/system gothic controls
- translucent elevated surfaces, generous whitespace, quiet labels
- the product surface before marketing chrome

The Math branch replaces enji with a blue family:

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#f1f5f8` | `#07121d` |
| Primary | `#245b87` | `#79afd0` |
| Strong | `#174568` | `#4385ae` |
| Cyan accent | `#4d8ea8` | `#6eb5c9` |

Avoid calculator grids, IDE chrome, education mascots, and generic Bootstrap
blue. Keyboard density should stay below the visual expression, not compete with it.

## 7. Delivery plan

### Current implementation

- Versioned, app-local `MojikumiExpression` adapter; engine payload stays private
- Plain text, Strict β-derived Unicode Readable, Strict β, AI prompt, LaTeX,
  Markdown, MathML, and Embed serializers
- Unfilled input slots kept visible in every output (`\square` / `□`) rather
  than dropped, and outputs withheld until the converter they derive from exists
- AI prompts built from the visible text plus LaTeX, never from a guessed reading
- Incomplete-placeholder detection and safe HTML/MathML fallback escaping
- Visual and LaTeX source editing, Undo/Redo, placeholder movement
- Namespaced, versioned, device-local draft recovery with malformed-data guards
- AI action presets without becoming an AI answer service
- Long-press/disclosure variants for roots, relations, integrals, sums, and arrows
- Pure fixture coverage for conversion and draft persistence, including 30
  representative formulas across five categories and 17 ambiguity fixtures for
  Unicode Readable
- Light/dark appearance saved under `mojikumi.math.theme`
- Installable PWA shell with network-first HTML, cache-first static assets,
  offline editing/conversion, and versioned cache cleanup
- Accessible output tabs, managed variant-tray focus, and separate live regions
  for save state and for the result of an action
- Playwright/axe coverage at 320 px, 390 px, and desktop widths

### Milestone 0 — interaction skeleton (now)

- Independent app, product page, live MathLive canvas
- Four compact keyboard groups and all seven target-output tabs
- Responsive blue visual system consistent with Mojikumi
- Static export and app-specific build command

Exit: recognisable on phone and desktop; an expression can be changed and copied.

### Milestone 1 — usable MVP (implemented; release validation remains)

- Placeholder navigation, long-press variants, keyboard haptics where available
- Undo/redo controls, LaTeX source mode, clear/new expression
- Local draft and preference recovery; installable PWA
- Serializer fixtures for 30 representative formulas
- Accessible names, focus order, screen-reader output, reduced motion

Exit: median time from open to copied quadratic/integral expression is under
30 seconds in a five-person mobile usability test.

### Milestone 2 — conversion quality (2–3 weeks)

- Versioned `MojikumiExpression` adapter
- Expand the conservative Unicode Readable allowlist only alongside ambiguity fixtures
- Define and version the Mojikumi-owned Strict grammar before removing β
- AI action presets: Explain, Solve, Prove, Simplify, Differentiate, Integrate
- Japanese and English spoken/readable output review (a generated Japanese
  reading is deliberately out of scope; see `MOJIKUMI-MATH-REFINEMENT.md` §1.3)
- Import from LaTeX and share-by-URL with explicit length/privacy limits

Exit: golden fixtures round-trip without structural loss for the supported set;
no unsupported construct silently claims a valid strict conversion.

### Milestone 3 — Embed and packages

- Extract `packages/math-core` after the second real consumer exists
- Publish a versioned `<mojikumi-math>` Web Component
- CSP, SSR, performance, and accessible MathML documentation
- Pilot in one blog/CMS and one educational surface before public API stability

Exit: Embed stays below 50 kB compressed excluding the chosen renderer, passes
its fixture suite, and has a documented compatibility policy.

## 8. Quality and measurement

Primary metrics:

- time from first interaction to successful copy
- expressions completed without switching to raw LaTeX
- copy completion rate by output type
- correction count per expression and placeholder abandonment

Guardrails:

- no formula content analytics by default
- clipboard contents never leave the device
- no account prompt in the core flow
- p75 interaction latency below 100 ms on a mid-range phone
- keyboard usable from 320 px width and with keyboard-only navigation

## 9. Open decisions before public beta

1. Whether Strict Plain uses a Mojikumi-owned grammar or a documented external one.
2. Which MathML semantics Mojikumi can safely infer versus ask the user to declare.
3. Whether shareable URLs are purely client-encoded or use expiring server storage.
4. The public package name: `@mojikumi/math` for Embed and
   `@mojikumi/math-core` for conversion is the current recommendation.

These decisions should not block the input-and-copy MVP.
