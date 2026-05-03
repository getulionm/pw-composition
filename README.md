# Playwright Framework Example

Teaching repo: static `mock-app/` + Playwright. One app at `mock-app/control-center/`; **ADMIN** / **USER** via masthead (`localStorage`: `pw-mock-workspace`).

## Run

1. `npm install`
2. `npm test` — `webServer` + `baseURL` `http://127.0.0.1:4173/control-center/`

`npm run start:mock` · `npm run test:headed` · `npm run test:ui` · outlines: `npm run start:mock:outlined` or `?pom=1` (toggle = `pw-pom-visual`; not the welcome modal). Test helper: `POM_VISUAL=1`. Files: [mock-app/shared/mock-shell.css](mock-app/shared/mock-shell.css), [mock-app/shared/pom-outline-config.json](mock-app/shared/pom-outline-config.json), [support/helpers/pom-visual.ts](support/helpers/pom-visual.ts).

**CI / artifacts:** [playwright.config.ts](playwright.config.ts) uses `trace: retain-on-failure` and `screenshot: only-on-failure`. For HTML report or extra reporters, extend that config (see [Playwright reporters](https://playwright.dev/docs/test-reporters)).

## Usage (fixtures)

Pick one pattern per test; details live in [support/fixtures/app.fixture.ts](support/fixtures/app.fixture.ts).

| Fixture | Use when |
|---------|----------|
| **`controlCenter`** | Default for screen-level tests: route pages (`home`, `records`, `recordDetails`, `viewTools`, `createTool`) share the same browser tab. |
| **`masthead`** / **`navigationDrawer`** | Shell layout: workspace select, user menu, side nav / tools flyout. Same `page` as `controlCenter`; use instead of reaching through a `shell` object. |
| **`userHomeWorkflow`** / **`adminHomeWorkflow`** | Role-scoped **`openHome()`** and **`workflow.home`** for extra asserts on the home route without repeating workspace wiring. |
| **`recordWorkflow`** | A journey already modeled as **records list → record details** (or `createRecord`). |


**Spec folders:** [tests/admin](tests/admin) and [tests/user](tests/user) mostly use `controlCenter`. [tests/workflows](tests/workflows) mix named workflows with direct `controlCenter.*` when a single page method is enough (see comments in those specs).

## Composition


| Thing         | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Page** | One route under `support/pages/control-center/`; constructor **`(page)`** only. Import `*Component` classes; **private** helpers return `new …Component(this.page)`. **Public API = façade methods** — do not expose components to tests. Shell chrome: `new …` inside page methods, or **`masthead`** / **`navigationDrawer`** fixtures in specs. **Do not** import another route `*Page` or any workflow. |
| **Workflow**  | Plain class in `shared/workflows/`. Injects `controlCenter.*` pages only; **does not** import components — call page methods. **Pages never call workflows.**                                                                                                                                                                                                                                                                                          |
| **Component** | `shared/components/`. **Do not** import sibling components there; wire on the page (or workflow). No `extends` between pages or between components.                                                                                                                                                                                                                                                                                                    |
| **BasePage**  | Thin shared goto / URL / title — [support/pages/shared/base.page.ts](support/pages/shared/base.page.ts).                                                                                                                                                                                                                                                                                                                                               |


**Reuse:** composition on pages + workflows, not `class RecordsPage extends SomethingBig`. **Promotion:** move a widget to `shared/components/` when several routes share the same contract.

**Fixtures:** [support/fixtures/app.fixture.ts](support/fixtures/app.fixture.ts) — see **Usage (fixtures)** above.

**Selectors:** `getByRole` → `getByLabel` → `getByText` → `data-testid`. **Names:** `*Page`, `*Component`, `*Workflow`; `screenId` on pages.

## Teaching scope

- Patterns are **illustrative**, not a full production harness.
- **Route pages** own screen verbs; **masthead** / **navigationDrawer** fixtures (or `new …` inside pages) cover shell chrome in tests. **Workflows** orchestrate multiple pages; pages never call workflows.
- **`mock-app/`** + `webServer` give real navigation without auth/DB; keep POM routes and mock HTML aligned so the small suite stays green.

## Test map


| Spec                                                                               |                |
| ---------------------------------------------------------------------------------- | -------------- |
| [tests/workflows/admin.workflows.spec.ts](tests/workflows/admin.workflows.spec.ts) | ADMIN journeys |
| [tests/workflows/user.workflows.spec.ts](tests/workflows/user.workflows.spec.ts)   | USER journeys  |
| [tests/admin/admin.functional.spec.ts](tests/admin/admin.functional.spec.ts)       | ADMIN screens  |
| [tests/user/user.functional.spec.ts](tests/user/user.functional.spec.ts)           | USER screens   |
