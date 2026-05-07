# Playwright Framework Example

Static `mock-app/` + Playwright teaching repo for composition-first E2E testing.

## Quick start

1. `npm install`
2. `npm test`

Useful variants:

- `npm run test:ui`
- `npm run test:headed`
- `npm run start:mock`
- `npm run start:mock:outlined`

`playwright.config.ts` auto-starts `mock-app` on `http://127.0.0.1:4173/control-center/` during test runs.

## Architecture north star

- Tests stay declarative and business-readable.
- **Specs are workflow-first**: use `*Workflow` fixtures for user journeys; use `masthead` / `navigationDrawer` only for shell-only checks.
- Dependency direction is strict: `workflow -> page -> component`.
- POM/selector complexity stays in support-side code, not specs.
- **Composition over inheritance**: each **Page** is a screen; it **contains** shell and widget parts assigned in the constructor (for example `this.nav = new NavigationDrawerComponent(page)`), not a fake “is-a” hierarchy.

## Layer definitions

- **Shell components** (`support/pages/shared/components/shell/`): cross-route chrome (`MastheadComponent`, `NavigationDrawerComponent`).
- **Widget components** (`support/pages/shared/components/widgets/`): route-local reusable UI (`SearchBoxComponent`, `TableComponent`, `ModalComponent`).
- **Page** (`support/pages/control-center/`): one route/screen; composes shell/widgets in the constructor; exposes user-facing verbs and screen `expect*` helpers.
- **Workflow** (`support/pages/shared/workflows/`): a user journey; composes pages in the constructor; calls only page APIs; declares static `meta` for test writers.
- **BasePage** (`support/pages/shared/base.page.ts`): tiny convenience only — `screen` meta, `marker`, `gotoPath`, `expectUrl`, `expectDocumentTitle`, `expectScreen` (marker + URL + title).

## Selector and marker contract

Selector priority in support-side POM code:

1. `getByRole`
2. `getByLabel`
3. `getByText`
4. `data-pom`
5. `data-testid` (last resort)

DOM marker contract:

- Page roots: `data-pom="pages/<screenId>"`
- Shell component roots: `data-pom="components/shell/<componentName>"`
- Widget component roots: `data-pom="components/widgets/<componentName>"`

Examples:

- `pages/controlCenter.records`
- `components/shell/navigationDrawer`
- `components/widgets/searchBox`

## Where do assertions live?

- **Workflow**: journey outcomes (e.g. `viewToolsWorkflow.expectToolListed("New item #1")`).
- **Page**: screen invariants after navigation (e.g. `expectScreen`, `expectRowVisible` on the page facade).
- **Component**: widget state (e.g. `expectCreateToolNavLocked`, marker visibility).
- **Spec**: orchestration only — call workflow (and occasionally shell fixtures); avoid raw `locator(...)` and avoid duplicating assertions already owned by a workflow/page.

## Workflow authoring (test-writer feature)

Each workflow class declares static `meta` via `defineWorkflowMetadata` in [`support/pages/shared/workflows/workflow-meta.ts`](support/pages/shared/workflows/workflow-meta.ts):

- `intent`, `targetPathnames`, `pages`, and `components.shell` / `components.widgets`.

This is documentation for readers, not a UI feature.

## Fixture usage

See [`support/fixtures/app.fixture.ts`](support/fixtures/app.fixture.ts).

| Fixture | Use when |
| --- | --- |
| `masthead` / `navigationDrawer` | Shell-only behavior (nav lock, workspace, etc.) |
| `userHomeWorkflow` / `adminHomeWorkflow` | Home + role workspace |
| `recordWorkflow` | Records list and record details journeys |
| `createToolWorkflow` | Create tool journey (ADMIN or USER guard) |
| `viewToolsWorkflow` | Open View tools and assert built tools list |

There is **no** `controlCenter` bundle in fixtures — pages live inside workflows (and inside page constructors for composition).

## Choose the simplest layer

- Single-screen behavior: add or extend a **Page** method.
- Reusable dense UI: extract a **widget** (or **shell**) component.
- Multi-screen or repeated journey: add a **Workflow**.

## How to add a new use case

1. Name the user scenario (end-user test title).
2. Add/adjust **Page** methods and constructor composition if needed.
3. Add/adjust **shell** / **widget** components under `components/shell` or `components/widgets`.
4. Add/adjust **Workflow** with `meta` and wire a fixture in `app.fixture.ts`.
5. Add a spec under the right **feature folder** (`tests/records`, `tests/tools`, `tests/home`, or `tests/framework`).
6. Keep specs free of raw locators.

## Composition and import rules

- Workflows import pages only.
- Pages compose shell/widget components; components do not import workflows or pages.
- Tests use fixtures; no `locator(...)` in `tests/**`.

## POM inspector

1. `npm run start:mock:outlined`
2. Open `http://127.0.0.1:4173/control-center/`
3. Use the floating **POM inspector**

Sections map to **Page**, **Components (shell)**, and **Widgets**.

## Test map (feature folders)

| Spec | Focus |
| --- | --- |
| [`tests/records/records.spec.ts`](tests/records/records.spec.ts) | Records (`admin` / `user` describes) |
| [`tests/tools/tools.spec.ts`](tests/tools/tools.spec.ts) | Tools + multi-workflow create-then-view |
| [`tests/home/home.spec.ts`](tests/home/home.spec.ts) | Home and welcome modal |
| [`tests/framework/workflow.contract.spec.ts`](tests/framework/workflow.contract.spec.ts) | Framework metadata / wiring smoke |
