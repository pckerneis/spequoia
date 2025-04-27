export interface SpequoiaDocument {
  title: string;
  description?: string;
  features: SpequoiaFeature[];
  views?: Record<string, SpequoiaViewNode>;
  executors?: Record<string, SpequoiaExecutor>;
  defaultExecutor?: string;
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
  steps?: string[];
  executors?: string[];
}

export type SpequoiaViewNode = string | SpequoiaViewNodeObject;

interface SpequoiaViewNodeObject {
  [key: string]: SpequoiaViewNode;
}

export interface SpequoiaExecutor {
  name: string;
  kind: string;
  description?: string;
  params?: Record<string, string | number | boolean>;
}
