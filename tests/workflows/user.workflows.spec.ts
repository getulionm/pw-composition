import { test } from "../../support/fixtures/app.fixture";

test.describe("User workflows", () => {
  test("USER goes home", async ({ userHomeWorkflow }) => {
    // Use a workflow: composed steps + reach the page object via `userHomeWorkflow.home` for extra asserts.
    await userHomeWorkflow.openHome();
    await userHomeWorkflow.home.expectBodyWorkspace("USER");
  });

  test("USER opens welcome modal", async ({ controlCenter }) => {
    // Use a page directly: one `HomePage` call is enough — no workflow wrapper.
    await controlCenter.home.openWelcomeModalExpectLoaded("USER");
  });

  test("USER opens existing record", async ({ recordWorkflow }) => {
    // Use a workflow: spans more than one route (records list → details).
    await recordWorkflow.openExistingRecord("Example Record 2");
  });
});
