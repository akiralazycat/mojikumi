import { readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

for (const parent of ["packages", "apps"]) {
  for (const entry of await readdir(parent, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      await rm(resolve(parent, entry.name, "dist"), {
        recursive: true,
        force: true
      });
      await rm(resolve(parent, entry.name, "tsconfig.tsbuildinfo"), {
        force: true
      });
    }
  }
}
