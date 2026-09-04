import { spawnSync } from "node:child_process";

const target = process.argv[2] ?? "web";
const ref = process.env.VERCEL_GIT_COMMIT_REF ?? "";
const message = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "";
const current = process.env.VERCEL_GIT_COMMIT_SHA ?? "HEAD";

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

// Scope the decision to this commit only. Comparing against the prior
// deployment would make a rarely-built sibling catch up on old changes.
const diff = spawnSync(
  "git",
  ["diff", "--quiet", `${current}^`, current, "--", ...selected, ...sharedPaths],
  { stdio: "ignore" },
);

// Unknown Git failures fail open to a build; only a proven no-op is skipped.
if (diff.status === 0) process.exit(0);
process.exit(1);
