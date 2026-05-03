import { test } from "../../support/fixtures/app.fixture";

test.describe("User capabilities", () => {
  test.beforeEach(async ({ userHomeWorkflow }) => {
    await userHomeWorkflow.openHome();
  });

  test.describe("Records", () => {
    test("can browse the full record list", async ({ controlCenter }) => {
      await controlCenter.records.goto();
      await controlCenter.records.expectDefaultTwoRecords();
    });

    test("can add a new record", async ({ controlCenter }) => {
      await controlCenter.records.goto();
      await controlCenter.records.createRecord();
      await controlCenter.records.expectRowVisible("New record 100");
    });

    test("can search and find a record", async ({ controlCenter }) => {
      await controlCenter.records.goto();
      await controlCenter.records.searchRecords("Example Record 2");
      await controlCenter.records.expectRowVisible("Example Record 2");
      await controlCenter.records.expectRowNotVisible("Example Record 1");
    });

    test("can clear search and see the full list again", async ({ controlCenter }) => {
      await controlCenter.records.goto();
      await controlCenter.records.searchRecords("Example Record 2");
      await controlCenter.records.clearRecordSearch();
      await controlCenter.records.expectSearchInputEmpty();
      await controlCenter.records.expectDefaultTwoRecords();
    });

    test("can open a record and read its details", async ({ controlCenter }) => {
      await controlCenter.records.goto();
      await controlCenter.records.clickViewOnRecord("Example Record 2");
      await controlCenter.recordDetails.expectLoaded("Example Record 2");
    });
  });

  test.describe("Tools", () => {
    test("sees Create tool in nav disabled with padlock", async ({ navigationDrawer }) => {
      await navigationDrawer.ensureToolsMenuOpen();
      await navigationDrawer.expectCreateToolNavLocked();
    });

    test("cannot create tools", async ({ controlCenter }) => {
      await controlCenter.createTool.goto();
      await controlCenter.createTool.expectFunctionalityHidden();
    });

    test("can view tools", async ({ controlCenter }) => {
      await controlCenter.viewTools.goto();
      await controlCenter.viewTools.expectBuiltToolsTableVisible();
    });
  });
});
