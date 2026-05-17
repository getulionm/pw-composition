import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const destDir = join(root, "mock-app", "readme");
const dest = join(destDir, "README.md");

mkdirSync(destDir, { recursive: true });
copyFileSync(join(root, "README.md"), dest);
console.log("Copied README.md → mock-app/readme/README.md");
