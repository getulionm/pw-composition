import { test } from "../../support/fixtures/app.fixture";

test.describe("Home", () => {
  test("admin opens home in admin workspace", async ({ adminHomeWorkflow }) => {
    await adminHomeWorkflow.openHome();
    await adminHomeWorkflow.home.expectBodyWorkspace("ADMIN");
  });

  test("user opens home in user workspace", async ({ userHomeWorkflow }) => {
    await userHomeWorkflow.openHome();
    await userHomeWorkflow.home.expectBodyWorkspace("USER");
  });

  test("admin opens the welcome modal", async ({ adminHomeWorkflow }) => {
    await adminHomeWorkflow.openWelcomeModal();
  });

  test("user opens the welcome modal", async ({ userHomeWorkflow }) => {
    await userHomeWorkflow.openWelcomeModal();
  });
});
