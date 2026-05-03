import { test } from "../../support/fixtures/app.fixture";

test.describe("Admin workflows", () => {
  test("ADMIN goes home", async ({ adminHomeWorkflow }) => {
    // Use a workflow: composed steps + reach the page object via `adminHomeWorkflow.home` for extra asserts.
    await adminHomeWorkflow.openHome();
    await adminHomeWorkflow.home.expectBodyWorkspace("ADMIN");
  });

  test("ADMIN opens welcome modal", async ({ controlCenter }) => {
    // Use a page directly: one `HomePage` call is enough — no workflow wrapper.
    await controlCenter.home.openWelcomeModalExpectLoaded("ADMIN");
  });

  test("ADMIN opens existing record", async ({ recordWorkflow }) => {
    // Use a workflow: spans more than one route (records list → details).
    await recordWorkflow.openExistingRecord("Example Record 1");
  });
});
