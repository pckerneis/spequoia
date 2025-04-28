*path: #*

&#36;schema: [http://json-schema.org/draft-07/schema#](http://json-schema.org/draft-07/schema#)

&#36;ref: [#/definitions/SpequoiaDocument](#/definitions/SpequoiaDocument)

# definitions

***SpequoiaDocument***

- *The Spequoia document model.<br>
  This model is used to define the structure of a Spequoia document.*
- Type: `object`
- <i id="definitionsspequoiadocument">path: #/definitions/SpequoiaDocument</i>
- ***Properties***
    - <b id="definitionsspequoiadocumentpropertiesdefaultexecutor">defaultExecutor</b>
        - *The default executor to be used for the feature examples.*
        - Type: `string`
        - <i id="definitionsspequoiadocumentpropertiesdefaultexecutor">path: #/definitions/SpequoiaDocument/properties/defaultExecutor</i>
    - <b id="definitionsspequoiadocumentpropertiesdescription">description</b>
        - *Markdown description of the system.*
        - Type: `string`
        - <i id="definitionsspequoiadocumentpropertiesdescription">path: #/definitions/SpequoiaDocument/properties/description</i>
    - <b id="definitionsspequoiadocumentpropertiesexecutors">executors</b>
        - *Dictionary of configured executors for the feature examples.*
        - Type: `object`
        - <i id="definitionsspequoiadocumentpropertiesexecutors">path: #/definitions/SpequoiaDocument/properties/executors</i>
        - This schema accepts additional properties.
        - ***Properties***
    - <b id="definitionsspequoiadocumentpropertiesfeatures">features</b> `required`
        - *List of features of the system.*
        - Type: `array`
        - <i id="definitionsspequoiadocumentpropertiesfeatures">path: #/definitions/SpequoiaDocument/properties/features</i>
            - ***Items***
            - <i id="definitionsspequoiadocumentpropertiesfeaturesitems">path: #/definitions/SpequoiaDocument/properties/features/items</i>
            - &#36;ref: [#/definitions/SpequoiaFeature](#/definitions/SpequoiaFeature)
    - <b id="definitionsspequoiadocumentpropertiestitle">title</b> `required`
        - *Name of the described system.*
        - Type: `string`
        - <i id="definitionsspequoiadocumentpropertiestitle">path: #/definitions/SpequoiaDocument/properties/title</i>
    - <b id="definitionsspequoiadocumentpropertiesversion">version</b>
        - *Version of the document.*
        - Type: `string`
        - <i id="definitionsspequoiadocumentpropertiesversion">path: #/definitions/SpequoiaDocument/properties/version</i>
    - <b id="definitionsspequoiadocumentpropertiesviews">views</b>
        - *Dictionary of views for the system.*
        - Type: `object`
        - <i id="definitionsspequoiadocumentpropertiesviews">path: #/definitions/SpequoiaDocument/properties/views</i>
        - This schema accepts additional properties.
        - ***Properties***
          ***SpequoiaExample***

- *An example demonstrating a feature.*
- Type: `object`
- <i id="definitionsspequoiaexample">path: #/definitions/SpequoiaExample</i>
- ***Properties***
    - <b id="definitionsspequoiaexamplepropertiesdescription">description</b>
        - *A markdown description of the example.*
        - Type: `string`
        - <i id="definitionsspequoiaexamplepropertiesdescription">path: #/definitions/SpequoiaExample/properties/description</i>
    - <b id="definitionsspequoiaexamplepropertiesexecutors">executors</b>
        - *A list of executors to be used for the example.*
        - Type: `array`
        - <i id="definitionsspequoiaexamplepropertiesexecutors">path: #/definitions/SpequoiaExample/properties/executors</i>
            - ***Items***
            - Type: `string`
            - <i id="definitionsspequoiaexamplepropertiesexecutorsitems">path: #/definitions/SpequoiaExample/properties/executors/items</i>
    - <b id="definitionsspequoiaexamplepropertiesid">id</b> `required`
        - *Unique identifier for the example.*
        - Type: `string`
        - <i id="definitionsspequoiaexamplepropertiesid">path: #/definitions/SpequoiaExample/properties/id</i>
    - <b id="definitionsspequoiaexamplepropertiesname">name</b>
        - *The name of the example.*
        - Type: `string`
        - <i id="definitionsspequoiaexamplepropertiesname">path: #/definitions/SpequoiaExample/properties/name</i>
    - <b id="definitionsspequoiaexamplepropertiessteps">steps</b>
        - *A list of steps to execute the example.*
        - Type: `array`
        - <i id="definitionsspequoiaexamplepropertiessteps">path: #/definitions/SpequoiaExample/properties/steps</i>
            - ***Items***
            - Type: `string`
            - <i id="definitionsspequoiaexamplepropertiesstepsitems">path: #/definitions/SpequoiaExample/properties/steps/items</i>
              ***SpequoiaExecutor***

- *An executor is a tool or library that can be used to execute the steps.*
- Type: `object`
- <i id="definitionsspequoiaexecutor">path: #/definitions/SpequoiaExecutor</i>
- ***Properties***
    - <b id="definitionsspequoiaexecutorpropertiesdescription">description</b>
        - *A markdown description of the executor.*
        - Type: `string`
        - <i id="definitionsspequoiaexecutorpropertiesdescription">path: #/definitions/SpequoiaExecutor/properties/description</i>
    - <b id="definitionsspequoiaexecutorpropertieskind">kind</b> `required`
        - *The type of the executor.*
        - Type: `string`
        - <i id="definitionsspequoiaexecutorpropertieskind">path: #/definitions/SpequoiaExecutor/properties/kind</i>
    - <b id="definitionsspequoiaexecutorpropertiesname">name</b> `required`
        - *The name of the executor.*
        - Type: `string`
        - <i id="definitionsspequoiaexecutorpropertiesname">path: #/definitions/SpequoiaExecutor/properties/name</i>
    - <b id="definitionsspequoiaexecutorpropertiesparams">params</b>
        - *Additional parameters for the executor.*
        - Type: `object`
        - <i id="definitionsspequoiaexecutorpropertiesparams">path: #/definitions/SpequoiaExecutor/properties/params</i>
        - This schema accepts additional properties.
        - ***Properties***
          ***SpequoiaFeature***

- *A feature of the system.*
- Type: `object`
- <i id="definitionsspequoiafeature">path: #/definitions/SpequoiaFeature</i>
- ***Properties***
    - <b id="definitionsspequoiafeaturepropertiesdescription">description</b>
        - *A markdown description of the feature.*
        - Type: `string`
        - <i id="definitionsspequoiafeaturepropertiesdescription">path: #/definitions/SpequoiaFeature/properties/description</i>
    - <b id="definitionsspequoiafeaturepropertiesexamples">examples</b>
        - *A list of examples demonstrating the feature.*
        - Type: `array`
        - <i id="definitionsspequoiafeaturepropertiesexamples">path: #/definitions/SpequoiaFeature/properties/examples</i>
            - ***Items***
            - <i id="definitionsspequoiafeaturepropertiesexamplesitems">path: #/definitions/SpequoiaFeature/properties/examples/items</i>
            - &#36;ref: [#/definitions/SpequoiaExample](#/definitions/SpequoiaExample)
    - <b id="definitionsspequoiafeaturepropertiesid">id</b> `required`
        - *Unique identifier for the feature.*
        - Type: `string`
        - <i id="definitionsspequoiafeaturepropertiesid">path: #/definitions/SpequoiaFeature/properties/id</i>
    - <b id="definitionsspequoiafeaturepropertiesname">name</b> `required`
        - *The name of the feature.*
        - Type: `string`
        - <i id="definitionsspequoiafeaturepropertiesname">path: #/definitions/SpequoiaFeature/properties/name</i>
    - <b id="definitionsspequoiafeaturepropertiestags">tags</b>
        - *A list of tags associated with the feature.*
        - Type: `array`
        - <i id="definitionsspequoiafeaturepropertiestags">path: #/definitions/SpequoiaFeature/properties/tags</i>
            - ***Items***
            - Type: `string`
            - <i id="definitionsspequoiafeaturepropertiestagsitems">path: #/definitions/SpequoiaFeature/properties/tags/items</i>
              ***SpequoiaViewNode***

- *Represents a node in a view, which can be either a string selector or a complex node object with nested structure.*
- <i id="definitionsspequoiaviewnode">path: #/definitions/SpequoiaViewNode</i>
  ***SpequoiaViewNodeObject***

- *A view node in the document. It can be a string (a selector) or an object that can contain other view nodes and metadata such as `$selector` (the CSS selector to be used to find the node in the DOM), `$direction` (the direction of the node, either "row" or "column") and `$text` (the text content of the node).*
- Type: `object`
- <i id="definitionsspequoiaviewnodeobject">path: #/definitions/SpequoiaViewNodeObject</i>
- This schema accepts additional properties.
- ***Properties***
    - <b id="definitionsspequoiaviewnodeobjectpropertiesdirection">$direction</b> `required`
        - *Direction of the node, either "row" or "column".*
        - Type: `string`
        - <i id="definitionsspequoiaviewnodeobjectpropertiesdirection">path: #/definitions/SpequoiaViewNodeObject/properties/$direction</i>
        - The value is restricted to the following:
            1. *"row"*
            2. *"column"*
    - <b id="definitionsspequoiaviewnodeobjectpropertiesselector">$selector</b> `required`
        - *CSS selector used to find the node in the DOM.*
        - Type: `string`
        - <i id="definitionsspequoiaviewnodeobjectpropertiesselector">path: #/definitions/SpequoiaViewNodeObject/properties/$selector</i>
    - <b id="definitionsspequoiaviewnodeobjectpropertiestext">$text</b> `required`
        - *Text content of the node.*
        - Type: `string`
        - <i id="definitionsspequoiaviewnodeobjectpropertiestext">path: #/definitions/SpequoiaViewNodeObject/properties/$text</i>

*Generated with [json-schema-md-doc](https://brianwendt.github.io/json-schema-md-doc/)*
*Mon Apr 28 2025 08:58:26 GMT+0200 (heure d’été d’Europe centrale)*