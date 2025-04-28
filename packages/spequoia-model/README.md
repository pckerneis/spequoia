
## Interfaces

- [SpequoiaDocument](#spequoiadocument)
- [SpequoiaFeature](#spequoiafeature)
- [SpequoiaExample](#spequoiaexample)
- [SpequoiaViewNodeObjectMetadata](#spequoiaviewnodeobjectmetadata)
- [SpequoiaViewNodeObject](#spequoiaviewnodeobject)
- [SpequoiaExecutor](#spequoiaexecutor)

### SpequoiaDocument

The Spequoia document model.

This model is used to define the structure of a Spequoia document.

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `title` | `string` | Name of the described system. |
| `version` | `string or undefined` | Version of the document. |
| `description` | `string or undefined` | Markdown description of the system. |
| `features` | `SpequoiaFeature[]` | List of features of the system. |
| `views` | `Record<string, SpequoiaViewNode> or undefined` | Dictionary of views for the system. |
| `executors` | `Record<string, SpequoiaExecutor> or undefined` | Dictionary of configured executors for the feature examples. |
| `defaultExecutor` | `string or undefined` | The default executor to be used for the feature examples. |


### SpequoiaFeature

A feature of the system.

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `id` | `string` | Unique identifier for the feature. |
| `name` | `string` | The name of the feature. |
| `description` | `string or undefined` | A markdown description of the feature. |
| `examples` | `SpequoiaExample[] or undefined` | A list of examples demonstrating the feature. |
| `tags` | `string[] or undefined` | A list of tags associated with the feature. |


### SpequoiaExample

An example demonstrating a feature.

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `id` | `string` | Unique identifier for the example. |
| `name` | `string or undefined` | The name of the example. |
| `description` | `string or undefined` | A markdown description of the example. |
| `steps` | `string[] or undefined` | A list of steps to execute the example. |
| `executors` | `string[] or undefined` | A list of executors to be used for the example. |


### SpequoiaViewNodeObjectMetadata



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `$selector` | `string` | CSS selector used to find the node in the DOM. |
| `$direction` | `"row" or "column"` | Direction of the node, either "row" or "column". |
| `$text` | `string` | Text content of the node. |


### SpequoiaViewNodeObject

A view node in the document. It can be a string (a selector) or an object
that can contain other view nodes and metadata such as `$selector` (the
CSS selector to be used to find the node in the DOM), `$direction` (the
direction of the node, either "row" or "column") and `$text` (the text
content of the node).

| Property | Type | Description |
| ---------- | ---------- | ---------- |


### SpequoiaExecutor

An executor is a tool or library that can be used to execute the steps.

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `name` | `string` | The name of the executor. |
| `kind` | `string` | The type of the executor. |
| `description` | `string or undefined` | A markdown description of the executor. |
| `params` | `Record<string, string or number or boolean> or undefined` | Additional parameters for the executor. |


## Types

- [SpequoiaViewNode](#spequoiaviewnode)

### SpequoiaViewNode

Represents a node in a view, which can be either a string selector
or a complex node object with nested structure.

| Type | Type |
| ---------- | ---------- |
| `SpequoiaViewNode` | `string or SpequoiaViewNodeObject` |

