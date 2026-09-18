# Deployment policy

Mojikumi is a monorepo with separate Vercel projects.

## Default behavior

- Vercel Git deployment is production-only from `main`; automatic non-main Preview deployments remain disabled.
- Do not configure custom Ignored Build Steps, changed-path skip scripts, or `[skip vercel]`.
- Main-branch changes must be allowed through to Vercel. Vercel may still avoid or cancel genuinely unaffected sibling projects using its native monorepo behavior.
- GitHub Actions CI/deploy remains explicit-only unless the user explicitly changes that policy.

## Explicit Preview exception

A Preview may be created only when the user explicitly asks for one. Do not re-enable automatic non-main previews.

## Production

Production is `main`-driven. App assets, icons, images, metadata, shared packages, build configuration, and code changes must never be hidden from Vercel by repository-side skip logic.
