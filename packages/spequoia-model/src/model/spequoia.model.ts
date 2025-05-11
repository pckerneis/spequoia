/**
 * The Spequoia document model.
 *
 * This model is used to define the structure of a Spequoia document.
 */
export interface SpequoiaDocument {
  /**
   * Name of the described system.
   */
  title: string;

  /**
   * Version of the specification.
   */
  version: string;

  /**
   * Markdown description of the system.
   */
  description?: string;

  /**
   * List of features of the system.
   */
  features: SpequoiaFeature[];

  /**
   * Dictionary of views for the system.
   */
  views?: Record<string, SpequoiaView>;

  /**
   * Dictionary of configured executors for the feature examples.
   */
  executors?: Record<string, SpequoiaExecutor>;

  /**
   * The default executor to be used for the feature examples.
   */
  defaultExecutor?: string;

  /**
   * A dictionary of actions that can be used in any example of the document.
   */
  actions?: Record<string, SpequoiaAction>;

  /**
   * A list of tags that can be used to categorize features.
   */
  tags?: SpequoiaTag[];
}

/**
 * A feature of the system.
 */
export interface SpequoiaFeature {
  /**
   * Unique identifier for the feature.
   */
  id?: string;

  /**
   * The name of the feature.
   */
  name: string;

  /**
   * A markdown description of the feature.
   */
  description?: string;

  /**
   * A list of examples demonstrating the feature.
   */
  examples?: SpequoiaExample[];

  /**
   * A list of tags associated with the feature.
   */
  tags?: string[];
}

/**
 * An example demonstrating a feature.
 */
export interface SpequoiaExample {
  /**
   * Unique identifier for the example.
   */
  id: string;

  /**
   * The name of the example.
   */
  name?: string;

  /**
   * A markdown description of the example.
   */
  description?: string;

  /**
   * A list of steps to execute the example.
   */
  steps?: string[];

  /**
   * A list of executors to be used for the example.
   */
  executors?: string[];
}

/**
 * Represents a node in a view, which can be either a string selector
 * or a complex node object with nested structure.
 */
export type SpequoiaViewNode = string | SpequoiaViewNodeObject;

export interface SpequoiaViewNodeObjectMetadata {
  /**
   * CSS selector used to find the node in the DOM.
   */
  $selector?: string;

  /**
   * Direction of the node, either "row" or "column".
   */
  $direction?: "row" | "column";

  /**
   * Text content of the node.
   */
  $text?: string;
}

export type SpequoiaView = SpequoiaViewNode & {
  /**
   * Route attached to the view.
   */
  $route?: string;
};

/**
 * A view node in the document. It can be a string (a selector) or an object
 * that can contain other view nodes and metadata such as `$selector` (the
 * CSS selector to be used to find the node in the DOM), `$direction` (the
 * direction of the node, either "row" or "column") and `$text` (the text
 * content of the node).
 */
export interface SpequoiaViewNodeObject extends SpequoiaViewNodeObjectMetadata {
  /**
   * Additional properties representing nested view nodes.
   * Keys are arbitrary strings except for the metadata properties
   * that start with "$".
   */
  [key: string]: SpequoiaViewNode | "string" | undefined;
}

/**
 * An executor is a tool or library that can be used to execute the steps.
 */
export interface SpequoiaExecutor {
  /**
   * The type of the executor.
   */
  kind: string;

  /**
   * A markdown description of the executor.
   */
  description?: string;

  /**
   * Additional parameters for the executor.
   */
  configuration?: Record<string, string | number | boolean>;
}

export interface SpequoiaAction {
  /**
   * A markdown description of the action.
   */
  description?: string;

  /**
   * List of steps to execute the action.
   */
  steps: string[];
}

/**
 * A tag is a label that can be associated with features.
 */
export interface SpequoiaTag {
  /**
   * The name of the tag.
   */
  name: string;

  /**
   * A CSS color for the tag.
   */
  color: string;
}
