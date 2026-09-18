import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const target = process.argv[2] ?? "web";
const ref = process.env.VERCEL_GIT_COMMIT_REF ?? "";
const message = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "";
const current = process.env.VERCEL_GIT_COMMIT_SHA ?? "HEAD";
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Vercel Ignored Build Step: exit 0 skips, exit 1 builds.
// Git-connected deployments stay main-only. Explicit manual CLI/API previews
// have no Git ref in this step and are intentionally allowed to build.
if (message.includes("[skip vercel]")) process.exit(0);
if (!ref) process.exit(1);
if (ref !== "main") process.exit(0);

// Keep deployment scope aligned with the files each target actually consumes.
// In particular, a generic scripts/ change must not rebuild every sibling app.
const targetPaths = {
  web: [
    "apps/web",
    "packages",
    "scripts/clean.mjs",
    "scripts/build-css.mjs",
  ],
  math: ["apps/math"],
  chem: ["apps/chem"],
  cdn: [
    "apps/cdn",
    "packages",
    "scripts/clean.mjs",
    "scripts/build-css.mjs",
    "scripts/build-browser.mjs",
  ],
};

const selected = targetPaths[target];
if (!selected) process.exit(1);

const sharedPaths = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "tsconfig.base.json",
  "turbo.json",
];

// Raw design sources and their explicit generators do not affect a deployment
// until generated public assets are committed. This keeps asset authoring out
// of the production build contract for Math/Chem.
const excludedPaths = {
  math: ["apps/math/assets", "apps/math/scripts/generate-assets.mjs"],
  chem: ["apps/chem/assets", "apps/chem/scripts/generate-assets.mjs"],
};

const exclusions = (excludedPaths[target] ?? []).map(
  (path) => `:(exclude)${path}`,
);

// Scope the decision to this commit only. Vercel runs ignoreCommand from each
// project's root directory, so run Git from the repository root before using
// repository-relative pathspecs.
const diff = spawnSync(
  "git",
  [
    "diff",
    "--quiet",
    `${current}^`,
    current,
    "--",
    ...selected,
    ...sharedPaths,
    ...exclusions,
  ],
  { cwd: repositoryRoot, stdio: "ignore" },
);

// Unknown Git failures fail open to a build; only a proven no-op is skipped.
if (diff.status === 0) process.exit(0);
process.exit(1);
