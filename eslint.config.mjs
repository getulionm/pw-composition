// ============================================================================
// Composition-first Playwright framework: minor enforcement layer.
//
// TWO rules, both intentionally small. Either is deletable in one edit.
//
//   1. Only `BasePage` may be extended in `support/modules/**`.
//      The entire "no inheritance pyramids" promise lives in ~6 lines of config.
//
//   2. Module isolation via `eslint-plugin-boundaries`.
//      Each feature module is its own element type. A module may import from
//      `framework/`, `shared/`, `helpers/`, the shell module, or itself.
//      A sibling feature module is never importable. Adding a new module is
//      three lines: one element-type entry + one allow rule + an entry in
//      everyone-else's allow list.
//
// Customisation: an org fork may add `overrides` blocks (e.g. forbid
// `page.locator(` in workflow-style specs, ban barrels, restrict file names,
// etc.) without touching the framework code. Stricter rules belong here, not
// in custom guardrail spec.ts files. See README "Customizing the contract layer".
// ============================================================================

import tsParser from "@typescript-eslint/parser";
import boundaries from "eslint-plugin-boundaries";

export default [
  {
    ignores: [
      "node_modules/**",
      "test-results/**",
      "playwright-report/**",
      "mock-app/**",
      "*.config.js",
      "*.config.mjs",
    ],
  },

  // Rule 1: only `BasePage` may be extended inside support/modules/**.
  // Deleting this block removes the constraint entirely.
  {
    files: ["support/modules/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: "module" },
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ClassDeclaration[superClass.name][superClass.name!='BasePage']",
          message:
            "Only BasePage may be extended. Use composition (instantiate components/pages in the constructor) instead of inheritance.",
        },
      ],
    },
  },

  // Rule 2: module boundaries.
  // Catalog/Cart/Checkout are independent element types. Each may import
  // from framework, shared, helpers, shell, and itself only.
  {
    files: ["support/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: "module" },
    },
    plugins: { boundaries },
    settings: {
      "boundaries/include": ["support/**/*.ts", "tests/**/*.ts"],
      "boundaries/elements": [
        { type: "framework", pattern: "support/framework/**" },
        { type: "shared", pattern: "support/shared/**" },
        { type: "helpers", pattern: "support/helpers/**" },
        { type: "users", pattern: "support/modules/users/**" },
        { type: "shell", pattern: "support/modules/shell/**" },
        { type: "catalog", pattern: "support/modules/catalog/**" },
        { type: "cart", pattern: "support/modules/cart/**" },
        { type: "checkout", pattern: "support/modules/checkout/**" },
        { type: "fixtures-root", pattern: "support/fixtures/**" },
        { type: "test", pattern: "tests/**" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "framework", allow: ["framework"] },
            { from: "shared", allow: ["framework", "shared"] },
            { from: "helpers", allow: ["framework", "shared", "helpers"] },
            { from: "users", allow: ["framework", "shared", "helpers", "users"] },
            { from: "shell", allow: ["framework", "shared", "helpers", "users", "shell"] },
            { from: "catalog", allow: ["framework", "shared", "helpers", "users", "shell", "catalog"] },
            { from: "cart", allow: ["framework", "shared", "helpers", "users", "shell", "cart"] },
            {
              from: "checkout",
              allow: ["framework", "shared", "helpers", "users", "shell", "checkout"],
            },
            {
              from: "fixtures-root",
              allow: [
                "framework",
                "shared",
                "helpers",
                "users",
                "shell",
                "catalog",
                "cart",
                "checkout",
              ],
            },
            {
              from: "test",
              allow: [
                "framework",
                "shared",
                "helpers",
                "users",
                "shell",
                "catalog",
                "cart",
                "checkout",
                "fixtures-root",
              ],
            },
          ],
        },
      ],
    },
  },
];
