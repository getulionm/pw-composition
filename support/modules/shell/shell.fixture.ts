import { test as base } from "@playwright/test";
import { HeaderComponent } from "./components/header.component";
import { NavDrawerComponent } from "./components/nav-drawer.component";
import { ToastComponent } from "./components/toast.component";
import { HomePage } from "./pages/home.page";
import { MembershipWorkflow } from "./workflows/membership.workflow";
import { ShellWorkflow } from "./workflows/shell.workflow";

export type ShellFixtures = {
  header: HeaderComponent;
  navDrawer: NavDrawerComponent;
  toast: ToastComponent;
  homePage: HomePage;
  shellWorkflow: ShellWorkflow;
  membershipWorkflow: MembershipWorkflow;
};

/**
 * Shell-team-owned fixture surface. Anything cross-cutting that other modules
 * may also want (header, toast, nav) is exposed here so module fixtures don't
 * have to duplicate it.
 */
export const test = base.extend<ShellFixtures>({
  header: async ({ page }, use) => use(new HeaderComponent(page)),
  navDrawer: async ({ page }, use) => use(new NavDrawerComponent(page)),
  toast: async ({ page }, use) => use(new ToastComponent(page)),

  homePage: async ({ page }, use) => use(new HomePage(page)),

  shellWorkflow: async ({ page }, use) => use(new ShellWorkflow(page)),
  membershipWorkflow: async ({ page }, use) => use(new MembershipWorkflow(page)),
});
