_path: #_

&#36;schema: [http://json-schema.org/draft-07/schema#](http://json-schema.org/draft-07/schema#)

&#36;ref: [#/definitions/SpequoiaDocument](#/definitions/SpequoiaDocument)

# definitions

**_SpequoiaDocument_**

- _The Spequoia document model.<br>
  This model is used to define the structure of a Spequoia document._
- Type: `object`
- <i id="definitionsspequoiadocument">path: #/definitions/SpequoiaDocument</i>
- **_Properties_**

  - <b id="definitionsspequoiadocumentpropertiesdefaultexecutor">defaultExecutor</b>
    - _The default executor to be used for the feature examples._
    - Type: `string`
    - <i id="definitionsspequoiadocumentpropertiesdefaultexecutor">path: #/definitions/SpequoiaDocument/properties/defaultExecutor</i>
  - <b id="definitionsspequoiadocumentpropertiesdescription">description</b>
    - _Markdown description of the system._
    - Type: `string`
    - <i id="definitionsspequoiadocumentpropertiesdescription">path: #/definitions/SpequoiaDocument/properties/description</i>
  - <b id="definitionsspequoiadocumentpropertiesexecutors">executors</b>
    - _Dictionary of configured executors for the feature examples._
    - Type: `object`
    - <i id="definitionsspequoiadocumentpropertiesexecutors">path: #/definitions/SpequoiaDocument/properties/executors</i>
    - This schema accepts additional properties.
    - **_Properties_**
  - <b id="definitionsspequoiadocumentpropertiesfeatures">features</b> `required`
    - _List of features of the system._
    - Type: `array`
    - <i id="definitionsspequoiadocumentpropertiesfeatures">path: #/definitions/SpequoiaDocument/properties/features</i>
      - **_Items_**
      - <i id="definitionsspequoiadocumentpropertiesfeaturesitems">path: #/definitions/SpequoiaDocument/properties/features/items</i>
      - &#36;ref: [#/definitions/SpequoiaFeature](#/definitions/SpequoiaFeature)
  - <b id="definitionsspequoiadocumentpropertiestitle">title</b> `required`
    - _Name of the described system._
    - Type: `string`
    - <i id="definitionsspequoiadocumentpropertiestitle">path: #/definitions/SpequoiaDocument/properties/title</i>
  - <b id="definitionsspequoiadocumentpropertiesversion">version</b>
    - _Version of the document._
    - Type: `string`
    - <i id="definitionsspequoiadocumentpropertiesversion">path: #/definitions/SpequoiaDocument/properties/version</i>
  - <b id="definitionsspequoiadocumentpropertiesviews">views</b>
    - _Dictionary of views for the system._
    - Type: `object`
    - <i id="definitionsspequoiadocumentpropertiesviews">path: #/definitions/SpequoiaDocument/properties/views</i>
    - This schema accepts additional properties.
    - **_Properties_**
      **_SpequoiaExample_**

- _An example demonstrating a feature._
- Type: `object`
- <i id="definitionsspequoiaexample">path: #/definitions/SpequoiaExample</i>
- **_Properties_**

  - <b id="definitionsspequoiaexamplepropertiesdescription">description</b>
    - _A markdown description of the example._
    - Type: `string`
    - <i id="definitionsspequoiaexamplepropertiesdescription">path: #/definitions/SpequoiaExample/properties/description</i>
  - <b id="definitionsspequoiaexamplepropertiesexecutors">executors</b>
    - _A list of executors to be used for the example._
    - Type: `array`
    - <i id="definitionsspequoiaexamplepropertiesexecutors">path: #/definitions/SpequoiaExample/properties/executors</i>
      - **_Items_**
      - Type: `string`
      - <i id="definitionsspequoiaexamplepropertiesexecutorsitems">path: #/definitions/SpequoiaExample/properties/executors/items</i>
  - <b id="definitionsspequoiaexamplepropertiesid">id</b> `required`
    - _Unique identifier for the example._
    - Type: `string`
    - <i id="definitionsspequoiaexamplepropertiesid">path: #/definitions/SpequoiaExample/properties/id</i>
  - <b id="definitionsspequoiaexamplepropertiesname">name</b>
    - _The name of the example._
    - Type: `string`
    - <i id="definitionsspequoiaexamplepropertiesname">path: #/definitions/SpequoiaExample/properties/name</i>
  - <b id="definitionsspequoiaexamplepropertiessteps">steps</b>
    - _A list of steps to execute the example._
    - Type: `array`
    - <i id="definitionsspequoiaexamplepropertiessteps">path: #/definitions/SpequoiaExample/properties/steps</i>
      - **_Items_**
      - Type: `string`
      - <i id="definitionsspequoiaexamplepropertiesstepsitems">path: #/definitions/SpequoiaExample/properties/steps/items</i>
        **_SpequoiaExecutor_**

- _An executor is a tool or library that can be used to execute the steps._
- Type: `object`
- <i id="definitionsspequoiaexecutor">path: #/definitions/SpequoiaExecutor</i>
- **_Properties_**

  - <b id="definitionsspequoiaexecutorpropertiesdescription">description</b>
    - _A markdown description of the executor._
    - Type: `string`
    - <i id="definitionsspequoiaexecutorpropertiesdescription">path: #/definitions/SpequoiaExecutor/properties/description</i>
  - <b id="definitionsspequoiaexecutorpropertieskind">kind</b> `required`
    - _The type of the executor._
    - Type: `string`
    - <i id="definitionsspequoiaexecutorpropertieskind">path: #/definitions/SpequoiaExecutor/properties/kind</i>
  - <b id="definitionsspequoiaexecutorpropertiesname">name</b> `required`
    - _The name of the executor._
    - Type: `string`
    - <i id="definitionsspequoiaexecutorpropertiesname">path: #/definitions/SpequoiaExecutor/properties/name</i>
  - <b id="definitionsspequoiaexecutorpropertiesparams">params</b>
    - _Additional parameters for the executor._
    - Type: `object`
    - <i id="definitionsspequoiaexecutorpropertiesparams">path: #/definitions/SpequoiaExecutor/properties/params</i>
    - This schema accepts additional properties.
    - **_Properties_**
      **_SpequoiaFeature_**

- _A feature of the system._
- Type: `object`
- <i id="definitionsspequoiafeature">path: #/definitions/SpequoiaFeature</i>
- **_Properties_**

  - <b id="definitionsspequoiafeaturepropertiesdescription">description</b>
    - _A markdown description of the feature._
    - Type: `string`
    - <i id="definitionsspequoiafeaturepropertiesdescription">path: #/definitions/SpequoiaFeature/properties/description</i>
  - <b id="definitionsspequoiafeaturepropertiesexamples">examples</b>
    - _A list of examples demonstrating the feature._
    - Type: `array`
    - <i id="definitionsspequoiafeaturepropertiesexamples">path: #/definitions/SpequoiaFeature/properties/examples</i>
      - **_Items_**
      - <i id="definitionsspequoiafeaturepropertiesexamplesitems">path: #/definitions/SpequoiaFeature/properties/examples/items</i>
      - &#36;ref: [#/definitions/SpequoiaExample](#/definitions/SpequoiaExample)
  - <b id="definitionsspequoiafeaturepropertiesid">id</b> `required`
    - _Unique identifier for the feature._
    - Type: `string`
    - <i id="definitionsspequoiafeaturepropertiesid">path: #/definitions/SpequoiaFeature/properties/id</i>
  - <b id="definitionsspequoiafeaturepropertiesname">name</b> `required`
    - _The name of the feature._
    - Type: `string`
    - <i id="definitionsspequoiafeaturepropertiesname">path: #/definitions/SpequoiaFeature/properties/name</i>
  - <b id="definitionsspequoiafeaturepropertiestags">tags</b>
    - _A list of tags associated with the feature._
    - Type: `array`
    - <i id="definitionsspequoiafeaturepropertiestags">path: #/definitions/SpequoiaFeature/properties/tags</i>
      - **_Items_**
      - Type: `string`
      - <i id="definitionsspequoiafeaturepropertiestagsitems">path: #/definitions/SpequoiaFeature/properties/tags/items</i>
        **_SpequoiaViewNode_**

- _Represents a node in a view, which can be either a string selector or a complex node object with nested structure._
- <i id="definitionsspequoiaviewnode">path: #/definitions/SpequoiaViewNode</i>
  **_SpequoiaViewNodeObject_**

- _A view node in the document. It can be a string (a selector) or an object that can contain other view nodes and metadata such as `$selector` (the CSS selector to be used to find the node in the DOM), `$direction` (the direction of the node, either "row" or "column") and `$text` (the text content of the node)._
- Type: `object`
- <i id="definitionsspequoiaviewnodeobject">path: #/definitions/SpequoiaViewNodeObject</i>
- This schema accepts additional properties.
- **_Properties_**
  - <b id="definitionsspequoiaviewnodeobjectpropertiesdirection">$direction</b> `required`
    - _Direction of the node, either "row" or "column"._
    - Type: `string`
    - <i id="definitionsspequoiaviewnodeobjectpropertiesdirection">path: #/definitions/SpequoiaViewNodeObject/properties/$direction</i>
    - The value is restricted to the following:
      1. _"row"_
      2. _"column"_
  - <b id="definitionsspequoiaviewnodeobjectpropertiesselector">$selector</b> `required`
    - _CSS selector used to find the node in the DOM._
    - Type: `string`
    - <i id="definitionsspequoiaviewnodeobjectpropertiesselector">path: #/definitions/SpequoiaViewNodeObject/properties/$selector</i>
  - <b id="definitionsspequoiaviewnodeobjectpropertiestext">$text</b> `required`
    - _Text content of the node._
    - Type: `string`
    - <i id="definitionsspequoiaviewnodeobjectpropertiestext">path: #/definitions/SpequoiaViewNodeObject/properties/$text</i>

_Generated with [json-schema-md-doc](https://brianwendt.github.io/json-schema-md-doc/)_
_Mon Apr 28 2025 08:58:26 GMT+0200 (heure d’été d’Europe centrale)_
