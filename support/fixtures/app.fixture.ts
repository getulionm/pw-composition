import { test as base, expect } from "@playwright/test";
import { registerPomVisualOnPage } from "../helpers/pom-visual";
import { CreateToolPage } from "../pages/control-center/create-tool.page";
import { HomePage } from "../pages/control-center/home.page";
import { RecordDetailsPage } from "../pages/control-center/record-details.page";
import { RecordsPage } from "../pages/control-center/records.page";
import { ViewToolsPage } from "../pages/control-center/view-tools.page";
import { MastheadComponent } from "../pages/shared/components/masthead.component";
import { NavigationDrawerComponent } from "../pages/shared/components/navigation-drawer.component";
import { AdminHomeWorkflow, UserHomeWorkflow } from "../pages/shared/workflows/home.workflow";
import { RecordWorkflow } from "../pages/shared/workflows/record.workflow";

/**
 * Playwright fixtures for the control-center teaching mock: one browser tab, shared `page`.
 *
 * - **`controlCenter`**, **`masthead`**, **`navigationDrawer`** — shape `PagesAndShellFixtures` (routes + shell chrome on one tab).
 * - **`*Workflow`** — multi-step helpers that only receive pages (`WorkflowFixtures`).
 *
 * Which fixture to use in a test: README → **Usage (fixtures)**.
 */
export type ControlCenterPages = {
  home: HomePage;
  records: RecordsPage;
  recordDetails: RecordDetailsPage;
  viewTools: ViewToolsPage;
  createTool: CreateToolPage;
};

/** Route `*Page` bundle plus shell layout entry points (`masthead`, `navigationDrawer`) on the same tab. */
export type PagesAndShellFixtures = {
  controlCenter: ControlCenterPages;
  masthead: MastheadComponent;
  navigationDrawer: NavigationDrawerComponent;
};

/** Named journeys; each workflow is built from `controlCenter` pages only (no component imports). */
export type WorkflowFixtures = {
  userHomeWorkflow: UserHomeWorkflow;
  adminHomeWorkflow: AdminHomeWorkflow;
  recordWorkflow: RecordWorkflow;
};

type AppFixtures = PagesAndShellFixtures & WorkflowFixtures;

const test = base.extend<AppFixtures>({
  /** Optional POM outline helper for local debugging (`POM_VISUAL=1`). */
  page: async ({ page }, use) => {
    if (process.env.POM_VISUAL === "1") {
      await registerPomVisualOnPage(page);
    }
    await use(page);
  },

  masthead: async ({ page }, use) => {
    await use(new MastheadComponent(page));
  },

  navigationDrawer: async ({ page }, use) => {
    await use(new NavigationDrawerComponent(page));
  },

  controlCenter: async ({ page }, use) => {
    await use({
      home: new HomePage(page),
      records: new RecordsPage(page),
      recordDetails: new RecordDetailsPage(page),
      viewTools: new ViewToolsPage(page),
      createTool: new CreateToolPage(page),
    });
  },

  userHomeWorkflow: async ({ controlCenter }, use) => {
    await use(new UserHomeWorkflow(controlCenter.home));
  },

  adminHomeWorkflow: async ({ controlCenter }, use) => {
    await use(new AdminHomeWorkflow(controlCenter.home));
  },

  recordWorkflow: async ({ controlCenter }, use) => {
    await use(new RecordWorkflow(controlCenter.records, controlCenter.recordDetails));
  },
});

export { test, expect };
