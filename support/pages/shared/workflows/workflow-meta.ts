export type WorkflowMetadata = {
  id: string;
  intent: string;
  targetPathnames: string[];
  pages: string[];
  components: {
    shared: string[];
    inner: string[];
  };
};

export function defineWorkflowMetadata(meta: WorkflowMetadata): WorkflowMetadata {
  return meta;
}
