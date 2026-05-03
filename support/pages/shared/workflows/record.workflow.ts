import { RecordsPage } from "../../control-center/records.page";
import { RecordDetailsPage } from "../../control-center/record-details.page";

export class RecordWorkflow {
  constructor(
    private readonly recordsPage: RecordsPage,
    private readonly recordDetailsPage: RecordDetailsPage
  ) {}

  async openExistingRecord(name: string) {
    await this.recordsPage.goto();
    await this.recordsPage.openRecord(name);
    await this.recordDetailsPage.expectLoaded(name);
  }

  async createRecord() {
    await this.recordsPage.goto();
    await this.recordsPage.createRecord();
    await this.recordsPage.expectRowVisible("New record 100");
  }
}
