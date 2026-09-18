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

const appPaths = {
  web: ["apps/web"],
  math: ["apps/math"],
  chem: ["apps/chem"],
  cdn: ["apps/cdn"],
};

const selected = appPaths[target];
if (!selected) process.exit(1);

const sharedPaths = [
  "packages",
  "scripts",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "tsconfig.base.json",
  "turbo.json",
];

// Scope the decision to this commit only. Vercel runs ignoreCommand from each
// project's root directory, so run Git from the repository root before using
// repository-relative pathspecs.
const diff = spawnSync(
  "git",
  ["diff", "--quiet", `${current}^`, current, "--", ...selected, ...sharedPaths],
  { cwd: repositoryRoot, stdio: "ignore" },
);

// Unknown Git failures fail open to a build; only a proven no-op is skipped.
if (diff.status === 0) process.exit(0);
process.exit(1);
