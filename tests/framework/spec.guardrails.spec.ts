import { expect, test } from "../../support/fixtures/app.fixture";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const FEATURE_SPEC_DIRS = ["tests/home", "tests/records", "tests/tools"];

function listSpecFilesRecursive(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...listSpecFilesRecursive(full));
      continue;
    }
    if (entry.endsWith(".spec.ts")) {
      files.push(full);
    }
  }
  return files;
}

function extractTestBodies(source: string): string[] {
  const bodies: string[] = [];
  const re = /test\([^,]+,\s*async\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\n\s*\}\);/g;
  let match: RegExpExecArray | null = re.exec(source);
  while (match) {
    bodies.push(match[1]);
    match = re.exec(source);
  }
  return bodies;
}

test.describe("Feature spec guardrails", () => {
  test("feature specs avoid direct expect()/locator() and call workflows", async () => {
    const repoRoot = path.resolve(__dirname, "..", "..");
    const specFiles = FEATURE_SPEC_DIRS.flatMap((d) =>
      listSpecFilesRecursive(path.join(repoRoot, d.replaceAll("/", path.sep)))
    );

    for (const filePath of specFiles) {
      const source = readFileSync(filePath, "utf-8");
      const relPath = path.relative(repoRoot, filePath).replaceAll("\\", "/");

      expect(source).not.toMatch(/\blocator\s*\(/);
      expect(source).not.toMatch(/\bexpect\s*\(/);

      const testBodies = extractTestBodies(source);
      expect(testBodies.length, `${relPath} must contain at least one test`).toBeGreaterThan(0);

      for (const body of testBodies) {
        expect(
          body,
          `${relPath} has a test without workflow method call`
        ).toMatch(/\b\w+Workflow\.\w+\(/);
      }
    }
  });
});
