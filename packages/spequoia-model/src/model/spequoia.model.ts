export interface SpequoiaDocument {
  title: string;
  description?: string;
  features: SpequoiaFeature[];
}

export interface SpequoiaFeature {
  id: string;
  name: string;
  description?: string;
  examples?: SpequoiaExample[];
  tags?: string[];
}

export interface SpequoiaExample {
  id: string;
  name?: string;
  description?: string;
  steps?: Array<string>;
}
