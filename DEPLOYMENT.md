# Deployment policy

Mojikumi is a monorepo with separate Vercel projects. Build only the project affected by a change.

## Default behavior

- Do not add automatic GitHub Actions CI/deploy workflows for routine pushes or pull requests unless the user explicitly changes this policy.
- Vercel Git deployment is production-only from `main`; automatic non-main Preview deployments remain disabled.
- Project-aware Ignored Build Steps scope production builds to `apps/web`, `apps/math`, `apps/chem`, or `apps/cdn` plus shared `packages`, root dependency/build inputs, and shared scripts.
- Documentation-only and unrelated app changes are skipped.
- Use `[skip vercel]` for deployment-policy/documentation-only commits that should not produce a production build.

## Explicit Preview exception

A Preview may be created only when the user explicitly asks for one, normally for a major UI change, a new feature, or a shareable demo. This is the only normal exception to the no-non-main-build rule.

Use the connected Vercel integration/API or the matching CLI command from the intended checkout:

```bash
vercel deploy --yes --cwd apps/web --project mojikumi
vercel deploy --yes --cwd apps/math --project mojikumi-math
vercel deploy --yes --cwd apps/chem --project mojikumi-chem
vercel deploy --yes --cwd apps/cdn --project mojikumi-cdn
```

Run only the one explicitly requested target. Do not re-enable automatic branch previews and do not use GitHub Actions for Preview creation. Never add `--prod` for a Preview.

## Production

Production remains `main`-driven. Shared package or root build-input changes may correctly rebuild multiple projects. If changed-path detection cannot safely determine whether a build is needed, it falls back to building.
