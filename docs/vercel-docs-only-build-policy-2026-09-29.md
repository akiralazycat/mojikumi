# Vercel docs-only build policy

Date: 2026-09-29
Repository: `mojikumi`

## Goal

Prevent Vercel builds when a Git commit changes documentation only, while preserving builds for every change that can affect the deployed artifact.

This is part of the Sphere-wide Vercel cost-control policy and is intentionally implemented through Vercel `ignoreCommand` / Ignored Build Step semantics:

- exit 0 = ignore the deployment build
- exit 1 = continue the build

## Documentation-only definition

A commit is documentation-only when every changed path is one of:

- `docs/**`
- a repository-root `*.md` or `*.mdx` file such as `README.md`, `AGENTS.md`, `HANDOFF.md`, or `DEPLOYMENT.md`

Markdown/MDX below application/content directories is **not** globally ignored because it may be runtime content.

If `VERCEL_GIT_PREVIOUS_SHA` is unavailable, the rule fails open and builds.

## Vercel targets

- apps/web
- apps/cdn
- apps/chem
- apps/math

Every Vercel target attached to this repository must receive the docs-only rule so a documentation commit cannot fan out into multiple linked builds.

## Implementation

1. Add or normalize `ignoreCommand` in each Vercel root's `vercel.json`.
2. Preserve existing framework, build, cron, deployment-branch, and project-specific path-scope behavior.
3. Do not rely on commit-message markers such as `[skip vercel]`; path classification is the source of truth.
4. Keep automatic non-main deployment policy unchanged.
5. Verify the final diff and record completion below.

## Progress

- [x] 2026-09-29 — Repository/Vercel target inventory completed.
- [x] 2026-09-29 — Policy documented before implementation.
- [x] 2026-09-29 — `ignoreCommand` normalized for every target.
- [x] 2026-09-29 — Existing contradictory deployment guidance reconciled where present.
- [x] 2026-09-29 — Final diff verified.
- [x] 2026-09-29 — Merged to `main`.

## Change history

### 2026-09-29

Initial cross-project policy document created before implementation.

### Verification probe

Verification PASS. Probe commit `8a3cd915771594162cfd72b0771a2b4ce7543351` was observed as `CANCELED` by Vercel for: mojikumi, mojikumi-cdn, mojikumi-chem, mojikumi-math. This confirms the Ignored Build Step stopped before build compute.
