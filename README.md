# Playwright Framework Example

Static `mock-app/` + Playwright teaching repo for composition-first Page Objects.

## Quick start

1. `npm install`
2. `npm test`

Useful variants:

- `npm run test:ui` (Playwright UI mode)
- `npm run test:headed` (headed browser runs)
- `npm run start:mock` (run mock app manually)
- `npm run start:mock:outlined` (run mock app with POM outlines enabled)

`playwright.config.ts` auto-starts `mock-app` on `http://127.0.0.1:4173/control-center/` during test runs.

## Use case: inspect the POM

To inspect page/component layering visually:

1. Run `npm run start:mock:outlined`
2. Open `http://127.0.0.1:4173/control-center/`
3. Use the floating **POM Inspector** widget

What the widget shows:

- **POM outlines** toggle: on/off state (`localStorage` key `pw-pom-visual`)
- **PAGE**: current route page object (for example `HomePage`)
- **COMPONENTS (SHELL)**: app-wide shell components (`MastheadComponent`, `NavigationDrawerComponent`)
- **WIDGETS (GREEN)**: route-level inner widgets/components (`SearchBoxComponent`, `TableComponent`, `ModalComponent`)

This is a runtime teaching/debug aid for checking `Page` facade boundaries vs shell and inner widgets.

## Usage (fixtures)

Use one fixture style per test. Details: `[support/fixtures/app.fixture.ts](support/fixtures/app.fixture.ts)`.


| Fixture                                          | Use when                                                                                                                           |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `**controlCenter`**                              | Default for screen-level tests. Route pages (`home`, `records`, `recordDetails`, `viewTools`, `createTool`) share one browser tab. |
| `**masthead`** / `**navigationDrawer**`          | App-wide shell checks: workspace switch, account/user menu, nav menu state, lock/unlock indicators, shell-link navigation.         |
| `**userHomeWorkflow**` / `**adminHomeWorkflow**` | Role-scoped reusable home journeys; exposes `workflow.home` for extra assertions.                                                  |
| `**recordWorkflow**`                             | Reusable multi-route record journey (list -> details, create record).                                                              |


Spec layout:

- `[tests/admin](tests/admin)`, `[tests/user](tests/user)`: mostly direct `controlCenter.*` usage.
- `[tests/workflows](tests/workflows)`: named workflows where multi-step reuse is useful.

## Which abstraction should I use?

- Use `**controlCenter.*Page**` for route-level actions/assertions.
- Use `**masthead**` / `**navigationDrawer**` for shell behavior checks.
- Use a `***Workflow**` when a step spans multiple pages and is reused.
- If behavior is one-off and route-local, add a page method instead of a workflow.

## Composition rules

Dependency direction is strict: `workflow -> page -> component`.

- No sideways imports: route `*Page` must not import another route `*Page`; `*Component` must not import sibling components.
- No reverse imports: pages do not call workflows; workflows do not import components.

Layer responsibilities:

- **Page** (`support/pages/control-center/`): one route facade; composes components privately; exposes stable test verbs.
- **Workflow** (`support/pages/shared/workflows/`): reusable journey class injected with `controlCenter.`* pages; orchestrates page methods.
- **Component** (`support/pages/shared/components/`): widget-level selectors/interactions.
- **BasePage** (`support/pages/shared/base.page.ts`): shared URL/title/navigation helpers only.

## Facade-like reasoning

Each route `*Page` is a facade: callers (specs/workflows) use stable verbs while DOM/selector detail stays hidden behind components and private helpers.

- Specs/workflows call page methods (`searchRecords`, `openRecord`) instead of raw selectors.
- UI churn mostly stays inside pages/components, reducing test rewrite pressure.
- `BasePage` is shared plumbing, not the screen facade itself.
- Workflows coordinate multiple page facades for reusable journeys.

```ts
// Good: spec uses facade API
await controlCenter.records.searchRecords("Example Record 1");
await controlCenter.records.expectRowVisible("Example Record 1");

// Anti-pattern: spec reaches into component internals directly
const search = new SearchBoxComponent(page);
await search.search("Example Record 1");
```

## How to expand this framework

### Step by step

#### 1) Create a component

1. Add a class in `[support/pages/shared/components/](support/pages/shared/components/)`, with `Page` in constructor.
2. Keep it widget-focused (selectors + small interactions only).
3. Do not import sibling components inside a component.

```ts
import { Page } from "@playwright/test";

export class MyWidgetComponent {
  constructor(private readonly page: Page) {}

  async submit() {
    await this.page.getByRole("button", { name: "Submit" }).click();
  }
}
```

#### 2) Create/update a page

1. Add/update route page in `[support/pages/control-center/](support/pages/control-center/)` extending `BasePage`.
2. In constructor, keep `page` as input and call `super(page, { screenId, pathname, documentTitle? })`.
3. Import components only in the page and wrap them in private helpers.
4. Expose only public facade methods for tests/workflows.
5. For POM Inspector, align mock markup:
  - set `data-pom="<RoutePageName>"` on route `<main>`
  - set `data-pom="<ComponentClassName>"` on widget roots
  - add `data-pom-composition="widgetA,widgetB"` when page composes inner widgets
6. Update `[mock-app/shared/pom-outline-config.json](mock-app/shared/pom-outline-config.json)` (`dataPomToTier`) when required.

```ts
import { Page } from "@playwright/test";
import { BasePage } from "../shared/base.page";
import { MyWidgetComponent } from "../shared/components/my-widget.component";

export class MyScreenPage extends BasePage {
  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.myScreen",
      pathname: "/control-center/my-screen",
      documentTitle: "My screen",
    });
  }

  private myWidget() {
    return new MyWidgetComponent(this.page);
  }

  async doSomethingUsersCareAbout() {
    await this.myWidget().submit();
  }
}
```

#### 3) Create a workflow

1. Add class in `[support/pages/shared/workflows/](support/pages/shared/workflows/)`.
2. Inject only `controlCenter.*` pages in constructor.
3. Implement journey methods by calling page facade methods only.

```ts
export class MyJourneyWorkflow {
  constructor(
    private readonly records: RecordsPage,
    private readonly details: RecordDetailsPage
  ) {}

  async openExampleRecord() {
    await this.records.openRecord("Example Record 1");
    await this.details.expectLoaded("Example Record 1");
  }
}
```

#### 4) Hook it into fixtures/tests

1. Register route pages/workflows in `[support/fixtures/app.fixture.ts](support/fixtures/app.fixture.ts)`:
  - `controlCenter`: route `*Page` instances only
  - workflow fixtures: instantiate with `controlCenter.*` pages
2. Keep fixture typings aligned (`PagesAndShellFixtures`, `WorkflowFixtures`, `AppFixtures`).
3. Keep `page` fixture overrides thin and always call `await use(page)` exactly once.
4. In specs, use `test.beforeEach`/`test.describe` hooks for setup (for example open workspace/home once per test) and call workflow/page methods in tests.

Conventions:

- **Selectors preference:** `getByRole` -> `getByLabel` -> `getByText` -> `data-testid`
- **Naming:** `*Page`, `*Component`, `*Workflow`, plus `screenId` on pages (`PageScreenMeta`)

## Teaching scope

- Teaching-oriented architecture, not a full production harness.
- Route pages own screen verbs; shell fixtures own app-wide chrome checks.
- Workflows model reusable cross-route journeys.
- `mock-app/` + Playwright `webServer` keeps navigation realistic without backend/auth setup.

## Test map


| Spec                                                                                 | Focus          |
| ------------------------------------------------------------------------------------ | -------------- |
| `[tests/workflows/admin.workflows.spec.ts](tests/workflows/admin.workflows.spec.ts)` | Admin journeys |
| `[tests/workflows/user.workflows.spec.ts](tests/workflows/user.workflows.spec.ts)`   | User journeys  |
| `[tests/admin/admin.functional.spec.ts](tests/admin/admin.functional.spec.ts)`       | Admin screens  |
| `[tests/user/user.functional.spec.ts](tests/user/user.functional.spec.ts)`           | User screens   |


