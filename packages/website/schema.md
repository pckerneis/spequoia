# Spequoia Schema

This document describes the schema of a Spequoia YAML document. It includes the
types and interfaces used in the schema, as well as the properties and their types.

<!-- TSDOC_START -->


## Interfaces

- [SpequoiaDocument](#spequoiadocument)
- [SpequoiaFeature](#spequoiafeature)
- [SpequoiaExample](#spequoiaexample)
- [HotSpotOverlay](#hotspotoverlay)
- [SpequoiaViewNodeObjectMetadata](#spequoiaviewnodeobjectmetadata)
- [SpequoiaViewNodeObject](#spequoiaviewnodeobject)
- [SpequoiaExecutor](#spequoiaexecutor)
- [SpequoiaAction](#spequoiaaction)
- [SpequoiaTag](#spequoiatag)

### SpequoiaDocument

The Spequoia document model.

This model is used to define the structure of a Spequoia document.

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `title` | `string` | Name of the described system. |
| `version` | `string` | Version of the specification. |
| `description` | `string or undefined` | Markdown description of the system. |
| `features` | `SpequoiaFeature[]` | List of features of the system. |
| `views` | `Record<string, SpequoiaView> or undefined` | Dictionary of views for the system. |
| `executors` | `Record<string, SpequoiaExecutor> or undefined` | Dictionary of configured executors for the feature examples. |
| `defaultExecutor` | `string or undefined` | The default executor to be used for the feature examples. |
| `actions` | `Record<string, SpequoiaAction> or undefined` | A dictionary of actions that can be used in any example of the document. |
| `tags` | `SpequoiaTag[] or undefined` | A list of tags that can be used to categorize features. |


### SpequoiaFeature

A feature of the system.

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `id` | `string or undefined` | Unique identifier for the feature. |
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
| `steps` | `(string or HotSpotOverlay)[] or undefined` | A list of steps to execute the example. |
| `executors` | `string[] or undefined` | A list of executors to be used for the example. |


### HotSpotOverlay



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `kind` | `"hotspot"` |  |
| `target` | `string` |  |
| `text` | `string` |  |


### SpequoiaViewNodeObjectMetadata



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `$selector` | `string or undefined` | CSS selector used to find the node in the DOM. |
| `$direction` | `"row" or "column" or undefined` | Direction of the node, either "row" or "column". |
| `$text` | `string or undefined` | Text content of the node. |


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
| `kind` | `string` | The type of the executor. |
| `description` | `string or undefined` | A markdown description of the executor. |
| `configuration` | `Record<string, string or number or boolean> or undefined` | Additional parameters for the executor. |


### SpequoiaAction



| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `description` | `string or undefined` | A markdown description of the action. |
| `steps` | `string[]` | List of steps to execute the action. |


### SpequoiaTag

A tag is a label that can be associated with features.

| Property | Type | Description |
| ---------- | ---------- | ---------- |
| `name` | `string` | The name of the tag. |
| `color` | `string` | A CSS color for the tag. |


## Types

- [SpequoiaExampleOverlay](#spequoiaexampleoverlay)
- [SpequoiaViewNode](#spequoiaviewnode)
- [SpequoiaView](#spequoiaview)

### SpequoiaExampleOverlay

| Type | Type |
| ---------- | ---------- |
| `SpequoiaExampleOverlay` | `HotSpotOverlay` |

### SpequoiaViewNode

Represents a node in a view, which can be either a string selector
or a complex node object with nested structure.

| Type | Type |
| ---------- | ---------- |
| `SpequoiaViewNode` | `string or SpequoiaViewNodeObject` |

### SpequoiaView

| Type | Type |
| ---------- | ---------- |
| `SpequoiaView` | `SpequoiaViewNode and { /** * Route attached to the view. */ $route?: string; }` |


<!-- TSDOC_END -->


## Raw schema

<!-- RAW_SCHEMA_START -->

```json
{
  "$ref": "#/definitions/SpequoiaDocument",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "HotSpotOverlay": {
      "properties": {
        "kind": {
          "const": "hotspot",
          "type": "string"
        },
        "target": {
          "type": "string"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "kind",
        "target",
        "text"
      ],
      "type": "object"
    },
    "SpequoiaAction": {
      "properties": {
        "description": {
          "description": "A markdown description of the action.",
          "type": "string"
        },
        "steps": {
          "description": "List of steps to execute the action.",
          "items": {
            "type": "string"
          },
          "type": "array"
        }
      },
      "required": [
        "steps"
      ],
      "type": "object"
    },
    "SpequoiaDocument": {
      "description": "The Spequoia document model.\n\nThis model is used to define the structure of a Spequoia document.",
      "properties": {
        "actions": {
          "additionalProperties": {
            "$ref": "#/definitions/SpequoiaAction"
          },
          "description": "A dictionary of actions that can be used in any example of the document.",
          "type": "object"
        },
        "defaultExecutor": {
          "description": "The default executor to be used for the feature examples.",
          "type": "string"
        },
        "description": {
          "description": "Markdown description of the system.",
          "type": "string"
        },
        "executors": {
          "additionalProperties": {
            "$ref": "#/definitions/SpequoiaExecutor"
          },
          "description": "Dictionary of configured executors for the feature examples.",
          "type": "object"
        },
        "features": {
          "description": "List of features of the system.",
          "items": {
            "$ref": "#/definitions/SpequoiaFeature"
          },
          "type": "array"
        },
        "tags": {
          "description": "A list of tags that can be used to categorize features.",
          "items": {
            "$ref": "#/definitions/SpequoiaTag"
          },
          "type": "array"
        },
        "title": {
          "description": "Name of the described system.",
          "type": "string"
        },
        "version": {
          "description": "Version of the specification.",
          "type": "string"
        },
        "views": {
          "additionalProperties": {
            "$ref": "#/definitions/SpequoiaView"
          },
          "description": "Dictionary of views for the system.",
          "type": "object"
        }
      },
      "required": [
        "title",
        "version",
        "features"
      ],
      "type": "object"
    },
    "SpequoiaExample": {
      "description": "An example demonstrating a feature.",
      "properties": {
        "description": {
          "description": "A markdown description of the example.",
          "type": "string"
        },
        "executors": {
          "description": "A list of executors to be used for the example.",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "id": {
          "description": "Unique identifier for the example.",
          "type": "string"
        },
        "name": {
          "description": "The name of the example.",
          "type": "string"
        },
        "steps": {
          "description": "A list of steps to execute the example.",
          "items": {
            "anyOf": [
              {
                "$ref": "#/definitions/SpequoiaExampleOverlay"
              },
              {
                "type": "string"
              }
            ]
          },
          "type": "array"
        }
      },
      "required": [
        "id"
      ],
      "type": "object"
    },
    "SpequoiaExampleOverlay": {
      "$ref": "#/definitions/HotSpotOverlay"
    },
    "SpequoiaExecutor": {
      "description": "An executor is a tool or library that can be used to execute the steps.",
      "properties": {
        "configuration": {
          "additionalProperties": {
            "type": [
              "string",
              "number",
              "boolean"
            ]
          },
          "description": "Additional parameters for the executor.",
          "type": "object"
        },
        "description": {
          "description": "A markdown description of the executor.",
          "type": "string"
        },
        "kind": {
          "description": "The type of the executor.",
          "type": "string"
        }
      },
      "required": [
        "kind"
      ],
      "type": "object"
    },
    "SpequoiaFeature": {
      "description": "A feature of the system.",
      "properties": {
        "description": {
          "description": "A markdown description of the feature.",
          "type": "string"
        },
        "examples": {
          "description": "A list of examples demonstrating the feature.",
          "items": {
            "$ref": "#/definitions/SpequoiaExample"
          },
          "type": "array"
        },
        "id": {
          "description": "Unique identifier for the feature.",
          "type": "string"
        },
        "name": {
          "description": "The name of the feature.",
          "type": "string"
        },
        "tags": {
          "description": "A list of tags associated with the feature.",
          "items": {
            "type": "string"
          },
          "type": "array"
        }
      },
      "required": [
        "name"
      ],
      "type": "object"
    },
    "SpequoiaTag": {
      "description": "A tag is a label that can be associated with features.",
      "properties": {
        "color": {
          "description": "A CSS color for the tag.",
          "type": "string"
        },
        "name": {
          "description": "The name of the tag.",
          "type": "string"
        }
      },
      "required": [
        "name",
        "color"
      ],
      "type": "object"
    },
    "SpequoiaView": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "additionalProperties": {
            "anyOf": [
              {
                "$ref": "#/definitions/SpequoiaViewNode"
              },
              {
                "not": {}
              },
              {
                "type": "string"
              }
            ]
          },
          "properties": {
            "$direction": {
              "description": "Direction of the node, either \"row\" or \"column\".",
              "enum": [
                "row",
                "column"
              ],
              "type": "string"
            },
            "$route": {
              "description": "Route attached to the view.",
              "type": "string"
            },
            "$selector": {
              "description": "CSS selector used to find the node in the DOM.",
              "type": "string"
            },
            "$text": {
              "description": "Text content of the node.",
              "type": "string"
            }
          },
          "type": "object"
        }
      ]
    },
    "SpequoiaViewNode": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "$ref": "#/definitions/SpequoiaViewNodeObject"
        }
      ],
      "description": "Represents a node in a view, which can be either a string selector or a complex node object with nested structure."
    },
    "SpequoiaViewNodeObject": {
      "additionalProperties": {
        "anyOf": [
          {
            "$ref": "#/definitions/SpequoiaViewNode"
          },
          {
            "const": "string",
            "type": "string"
          },
          {
            "not": {}
          }
        ],
        "description": "Additional properties representing nested view nodes. Keys are arbitrary strings except for the metadata properties that start with \"$\"."
      },
      "description": "A view node in the document. It can be a string (a selector) or an object that can contain other view nodes and metadata such as `$selector` (the CSS selector to be used to find the node in the DOM), `$direction` (the direction of the node, either \"row\" or \"column\") and `$text` (the text content of the node).",
      "properties": {
        "$direction": {
          "description": "Direction of the node, either \"row\" or \"column\".",
          "enum": [
            "row",
            "column"
          ],
          "type": "string"
        },
        "$selector": {
          "description": "CSS selector used to find the node in the DOM.",
          "type": "string"
        },
        "$text": {
          "description": "Text content of the node.",
          "type": "string"
        }
      },
      "type": "object"
    }
  }
}
```
<!-- RAW_SCHEMA_END -->
