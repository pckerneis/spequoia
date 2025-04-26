export interface SpequoiaDocument {
  features: SpequoiaFeature[];
}

export interface SpequoiaFeature {
  id: string;
  description: string;
  examples?: SpequoiaExample[];
}

export interface SpequoiaExample {
  id: string;
  description: string;
  steps?: Array<string | Record<string, unknown>>;
}
