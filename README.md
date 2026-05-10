# Playwright Composition Framework Example

This repo is a small Playwright architecture example.

The point is not to show another generic test framework.

The point is to show a simple default I prefer for modular UI automation:

> Tests should describe user workflows. Pages and components should support those workflows. Framework structure should not become the thing the test is about.

## The idea

A lot of Playwright projects start clean and slowly become hard to reason about.

The problem is usually not Playwright. The problem is the shape of the abstraction.

When the framework is built mostly around inheritance or large technical wrapper objects, the test writer often has to think about framework structure before thinking about user behaviour.

This repo takes a different default:

```txt
spec
  -> workflow fixture
    -> page
      -> component
```

The spec uses a workflow fixture.
The workflow uses pages.
The page composes components.
The component owns the lower-level UI details.

That keeps the test close to the user journey while still giving the framework a clear structure underneath.

## Why workflow fixtures?

The most important object in this repo is not a base page.
It is the workflow fixture.

A workflow fixture gives the test a user journey directly:

```ts
test("admin can create a tool and see it in the tools list", async ({
  createToolWorkflow,
  viewToolsWorkflow,
}) => {
  const toolName = await createToolWorkflow.createTool();

  await viewToolsWorkflow.open();
  await viewToolsWorkflow.expectToolListed(toolName);
});
```

The test does not need to know which menu, table, modal, route, or selector is involved.

Those details still exist, but they live in the right layer.

## Preferred model

### Workflow

A workflow represents a user journey.

Examples:

- open a workspace
- create a tool
- view tools
- open records
- inspect a record

A workflow can compose one or more pages, but it should call page APIs rather than reaching into component internals.

### Page

A page represents a screen or route.

A page exposes user-facing actions for that screen and composes the UI pieces it needs:

```ts
export class RecordsPage extends BasePage {
  readonly masthead: MastheadComponent;
  readonly navigationDrawer: NavigationDrawerComponent;
  readonly table: TableComponent;

  constructor(page: Page) {
    super(page);

    this.masthead = new MastheadComponent(page);
    this.navigationDrawer = new NavigationDrawerComponent(page);
    this.table = new TableComponent(page);
  }
}
```

The page is not treated as a special kind of parent page.
It is a screen that contains reusable parts.

That is the core composition idea.

### Component

A component represents reusable UI.

Examples:

- masthead
- navigation drawer
- table
- search box
- modal

Components should hide locator details and expose behaviour that makes sense for that UI part.

### BasePage

A base page is still allowed, but it should stay boring.

In this repo, `BasePage` is only for small shared convenience such as navigation and basic screen expectations.

It should not become the main place where product behaviour lives.

## Prefer this shape

```txt
Test asks for a workflow
Workflow coordinates pages
Page composes components
Component handles UI detail
```

Prefer this over making every new screen fit into a parent class hierarchy.

Inheritance can still be useful when there is a real `is-a` relationship.
For page objects, the more common relationship is `has-a`:

- a page has a masthead
- a page has a drawer
- a page has a table
- a page has a modal

That maps naturally to composition.

## Fixture usage

Workflow fixtures are the main entry point for tests.

See [`support/fixtures/app.fixture.ts`](support/fixtures/app.fixture.ts).

| Fixture | Use when |
| --- | --- |
| `workspaceWorkflow` | Workspace switching and workspace-level behaviour |
| `userHomeWorkflow` / `adminHomeWorkflow` | Home journeys for different roles |
| `recordWorkflow` | Records list and record details journeys |
| `createToolWorkflow` | Create tool journey |
| `viewToolsWorkflow` | Open View tools and assert the tools list |
| `masthead` / `navigationDrawer` | Shell-only behaviour that is not a full user journey |

There is no large `controlCenter` fixture that bundles everything together.

Tests should ask for the workflow they need.

## Assertion ownership

Keep assertions close to the layer that owns the behaviour.

| Layer | Owns |
| --- | --- |
| Workflow | Journey outcomes |
| Page | Screen-level expectations |
| Component | Local UI state and widget behaviour |
| Spec | Scenario orchestration |

A spec should mostly read as a scenario.

It should not be full of raw locators, table parsing, modal internals, or navigation mechanics.

## Selector and marker contract

Selector preference in support-side code:

1. `getByRole`
2. `getByLabel`
3. `getByText`
4. `data-pom`
5. `data-testid` as a last resort

DOM marker convention:

| Type | Example |
| --- | --- |
| Page root | `data-pom="pages/controlCenter.records"` |
| Shell component | `data-pom="components/shell/navigationDrawer"` |
| Widget component | `data-pom="components/widgets/searchBox"` |

The marker convention exists to make page/component boundaries visible and testable without turning selectors into the main design.

## POM inspector

The mock app includes a small visual helper for seeing page-object boundaries in the browser.

Run:

```bash
npm run start:mock:outlined
```

Then open:

```txt
http://127.0.0.1:4173/control-center/
```

The floating inspector shows page, shell component, and widget boundaries.

This is mainly a teaching/debugging aid. It helps connect the code structure to what is visible on screen.

## How to add a new use case

1. Start with the user scenario.
2. Add or adjust page methods for the relevant screen.
3. Extract reusable UI into a component only when it earns its place.
4. Add a workflow when the behaviour spans a journey or is repeated across tests.
5. Expose the workflow through a fixture.
6. Keep the spec focused on the scenario, not the plumbing.

## Import rules

The dependency direction should stay simple:

- Tests use fixtures.
- Workflow fixtures compose workflows.
- Workflows import pages.
- Pages compose components.
- Components do not import pages or workflows.

## Quick start

```bash
npm install
npm test
```

Useful commands:

```bash
npm run test:ui
npm run test:headed
npm run start:mock
npm run start:mock:outlined
```

`playwright.config.ts` starts the mock app on `http://127.0.0.1:4173/control-center/` during test runs.

## Test map

| Spec | Focus |
| --- | --- |
| [`tests/records/records.spec.ts`](tests/records/records.spec.ts) | Records journeys |
| [`tests/tools/tools.spec.ts`](tests/tools/tools.spec.ts) | Tool creation and viewing journeys |
| [`tests/home/home.spec.ts`](tests/home/home.spec.ts) | Home and welcome modal behaviour |
| [`tests/framework/workflow.contract.spec.ts`](tests/framework/workflow.contract.spec.ts) | Workflow metadata and fixture wiring |

## North star

A good Playwright framework should make the important test easy to read.

For this repo, that means:

> workflow fixtures first, composed pages underneath, reusable components at the edges.
