export interface SpequoiaDocument {
  title: string;
  description?: string;
  features: SpequoiaFeature[];
  views?: Record<string, any>;
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
