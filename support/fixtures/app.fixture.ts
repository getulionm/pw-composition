import { test as base, expect } from "@playwright/test";
import { registerPomVisualOnPage } from "../helpers/pom-visual";
import { MastheadComponent } from "../pages/shared/components/shell/masthead.component";
import { NavigationDrawerComponent } from "../pages/shared/components/shell/navigation-drawer.component";
import { AdminHomeWorkflow, UserHomeWorkflow } from "../pages/shared/workflows/home.workflow";
import { RecordWorkflow } from "../pages/shared/workflows/record.workflow";
import { CreateToolWorkflow } from "../pages/shared/workflows/create-tool.workflow";
import { ViewToolsWorkflow } from "../pages/shared/workflows/view-tools.workflow";
import { WorkspaceWorkflow } from "../pages/shared/workflows/workspace.workflow";

/**
 * Playwright fixtures for the control-center teaching mock: one browser tab, shared `page`.
 *
 * - **`masthead`**, **`navigationDrawer`** — shell chrome on the same tab.
 * - **`*Workflow`** — user journeys; each workflow is constructed with `page` only (no `controlCenter` bundle).
 *
 * Which fixture to use in a test: README → **Usage (fixtures)**.
 */
export type ShellFixtures = {
  masthead: MastheadComponent;
  navigationDrawer: NavigationDrawerComponent;
};

export type WorkflowFixtures = {
  userHomeWorkflow: UserHomeWorkflow;
  adminHomeWorkflow: AdminHomeWorkflow;
  recordWorkflow: RecordWorkflow;
  createToolWorkflow: CreateToolWorkflow;
  viewToolsWorkflow: ViewToolsWorkflow;
  workspaceWorkflow: WorkspaceWorkflow;
};

type AppFixtures = ShellFixtures & WorkflowFixtures;

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

  userHomeWorkflow: async ({ page }, use) => {
    await use(new UserHomeWorkflow(page));
  },

  adminHomeWorkflow: async ({ page }, use) => {
    await use(new AdminHomeWorkflow(page));
  },

  recordWorkflow: async ({ page }, use) => {
    await use(new RecordWorkflow(page));
  },

  createToolWorkflow: async ({ page }, use) => {
    await use(new CreateToolWorkflow(page));
  },

  viewToolsWorkflow: async ({ page }, use) => {
    await use(new ViewToolsWorkflow(page));
  },

  workspaceWorkflow: async ({ page }, use) => {
    await use(new WorkspaceWorkflow(page));
  },
});

export { test, expect };
