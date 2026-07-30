import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const packageNames = [
  "@mojikumi/core",
  "@mojikumi/css",
  "@mojikumi/presets",
  "@mojikumi/dom",
  "@mojikumi/react",
  "@mojikumi/rehype",
  "mojikumi"
];

const cacheDirectory = await mkdtemp(join(tmpdir(), "mojikumi-npm-cache-"));

try {
  for (const packageName of packageNames) {
    const result = spawnSync(
      "npm",
      [
        "pack",
        "--dry-run",
        "--json",
        "--workspace",
        packageName,
        "--cache",
        cacheDirectory
      ],
      { encoding: "utf8" }
    );

    if (result.status !== 0) {
      throw new Error(
        `Package check failed for ${packageName}\n${result.stderr}`
      );
    }

    if (result.stderr.includes("npm warn publish")) {
      throw new Error(
        `${packageName} requires package.json normalization\n${result.stderr}`
      );
    }

    const [pack] = JSON.parse(result.stdout);
    const paths = new Set(pack.files.map(({ path }) => path));
    const requiredPaths = ["package.json", "README.md", "LICENSE", "CHANGELOG.md"];

    for (const requiredPath of requiredPaths) {
      if (!paths.has(requiredPath)) {
        throw new Error(`${packageName} is missing ${requiredPath}`);
      }
    }

    if (![...paths].some((path) => path.startsWith("dist/"))) {
      throw new Error(`${packageName} has no dist output`);
    }

    const testArtifact = [...paths].find((path) => /\.test\./u.test(path));
    if (testArtifact) {
      throw new Error(`${packageName} includes test artifact ${testArtifact}`);
    }

    console.log(
      `${packageName}@${pack.version}: ${pack.entryCount} files, ${pack.size} bytes`
    );
  }
} finally {
  await rm(cacheDirectory, { recursive: true, force: true });
}
