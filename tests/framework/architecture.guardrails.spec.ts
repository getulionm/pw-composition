import { expect, test } from "../../support/fixtures/app.fixture";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

function listFilesRecursive(dir: string, extFilter?: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...listFilesRecursive(full, extFilter));
      continue;
    }
    if (!extFilter || full.endsWith(extFilter)) {
      files.push(full);
    }
  }
  return files;
}

function read(relPath: string): string {
  const repoRoot = path.resolve(__dirname, "..", "..");
  return readFileSync(path.join(repoRoot, relPath), "utf-8");
}

function publicAsyncMethodBodies(source: string): Array<{ name: string; body: string }> {
  const out: Array<{ name: string; body: string }> = [];
  const re = /(?:^|\n)\s*async\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}/g;
  let m = re.exec(source);
  while (m) {
    out.push({ name: m[1], body: m[2] });
    m = re.exec(source);
  }
  return out;
}

test.describe("Architecture guardrails", () => {
  test("import boundaries are respected", async () => {
    const repoRoot = path.resolve(__dirname, "..", "..");
    const workflowFiles = listFilesRecursive(
      path.join(repoRoot, "support/pages/shared/workflows"),
      ".ts"
    ).filter((f) => !f.endsWith("workflow-meta.ts"));
    const pageFiles = listFilesRecursive(path.join(repoRoot, "support/pages/control-center"), ".ts");
    const componentFiles = listFilesRecursive(path.join(repoRoot, "support/pages/shared/components"), ".ts");

    for (const wf of workflowFiles) {
      const src = readFileSync(wf, "utf-8");
      const rel = path.relative(repoRoot, wf).replaceAll("\\", "/");
      expect(src, `${rel} must not import tests`).not.toMatch(/from\s+["'][^"']*tests\//);
      expect(src, `${rel} must not import other workflows`).not.toMatch(
        /from\s+["'][^"']*\/workflows\/(?!workflow-meta)/
      );
    }

    for (const p of pageFiles) {
      const src = readFileSync(p, "utf-8");
      const rel = path.relative(repoRoot, p).replaceAll("\\", "/");
      expect(src, `${rel} must not import workflows`).not.toMatch(/from\s+["'][^"']*\/workflows\//);
      expect(src, `${rel} must not import other control-center pages`).not.toMatch(
        /from\s+["'][.]{1,2}\/[^"']*control-center\/(?!.*\.d\.ts)/
      );
    }

    for (const c of componentFiles) {
      const src = readFileSync(c, "utf-8");
      const rel = path.relative(repoRoot, c).replaceAll("\\", "/");
      expect(src, `${rel} must not import workflows`).not.toMatch(/from\s+["'][^"']*\/workflows\//);
      expect(src, `${rel} must not import pages`).not.toMatch(/from\s+["'][^"']*\/control-center\//);
    }
  });

  test("workflows have meaningful assertion-like outcome lines", async () => {
    const repoRoot = path.resolve(__dirname, "..", "..");
    const workflowFiles = listFilesRecursive(
      path.join(repoRoot, "support/pages/shared/workflows"),
      ".ts"
    ).filter((f) => !f.endsWith("workflow-meta.ts"));

    for (const wf of workflowFiles) {
      const src = readFileSync(wf, "utf-8");
      const rel = path.relative(repoRoot, wf).replaceAll("\\", "/");
      const methods = publicAsyncMethodBodies(src);
      expect(methods.length, `${rel} should define async public methods`).toBeGreaterThan(0);

      for (const method of methods) {
        const nonEmptyLines = method.body
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && !l.startsWith("//"));
        expect(nonEmptyLines.length, `${rel}#${method.name} should not be empty`).toBeGreaterThan(0);

        const lastLine = nonEmptyLines[nonEmptyLines.length - 1];
        expect(
          lastLine,
          `${rel}#${method.name} last line should be assertion-like (expect*/expect...)`
        ).toMatch(/expect|Expect|assert/i);
      }
    }
  });

  test("feature fixtures and composition contracts remain intact", async () => {
    const fixtureSource = read("support/fixtures/app.fixture.ts");
    expect(fixtureSource).not.toContain("controlCenter:");
    expect(fixtureSource).toContain("workspaceWorkflow");
    expect(fixtureSource).toMatch(/new\s+\w+Workflow\(page\)/);

    const pageFiles = [
      "support/pages/control-center/home.page.ts",
      "support/pages/control-center/records.page.ts",
      "support/pages/control-center/record-details.page.ts",
      "support/pages/control-center/view-tools.page.ts",
      "support/pages/control-center/create-tool.page.ts",
    ];

    for (const pagePath of pageFiles) {
      const src = read(pagePath);
      expect(src, `${pagePath} should compose shell components in constructor`).toMatch(
        /readonly\s+masthead:\s+MastheadComponent/
      );
      expect(src, `${pagePath} should compose shell components in constructor`).toMatch(
        /readonly\s+nav:\s+NavigationDrawerComponent/
      );
      expect(src, `${pagePath} should initialize masthead in constructor`).toMatch(
        /this\.masthead\s*=\s*new\s+MastheadComponent\(page\)/
      );
      expect(src, `${pagePath} should initialize nav in constructor`).toMatch(
        /this\.nav\s*=\s*new\s+NavigationDrawerComponent\(page\)/
      );
    }
  });
});
