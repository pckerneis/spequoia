# What is Spequoia?

Spequoia is a specification format for web applications that aims to bridge the gap between design, development, and testing.

It provides a human-readable format for describing the behavior of web applications, making it easier for designers,
developers, and testers to collaborate.

It is also machine-readable, allowing for automatic generation of documentation, mockups, and end-to-end tests.

The goal of Spequoia is to provide a single source of truth for your application that can be used throughout the
software development lifecycle. This reduces the duplication of knowledge and facilitates the synchronization between
your specifications, your code and your documentation.

## Spequoia in the software development lifecycle

Spequoia is designed to be used throughout the software development lifecycle, from design to regression testing.

### Design

- Describe your application's features and behavior using standard Markdown syntax.
- Describe your application's user interfaces.
- Add example user interactions to your specifications to illustrate how your application should behave.

Spequoia's wireframe generator allows you to create animated mockups that can be used to visualize your
application's user interface before it is built. You can use these animated mockups to gather feedback from
stakeholders and make design decisions before writing any code.

![Wireframe example](/wireframe-player.gif)

### Development

The Spequoia documents are designed to be used as a single source of truth for your application. You can host them
in your repository and use them to generate code and tests.

This reduces the duplication of knowledge and facilitates the synchronization between your specifications and your code.

### Testing

Spequoia's example user interactions are designed to be used as end-to-end tests. You can use Spequoia's test runner to
generate end-to-end tests from your specifications and run them against your application.

This ensures that your application behaves as expected and that your specifications are up to date.

![Test player example](/test-player.gif)

### Documentation

Spequoia's built-in documentation generator allows you to generate documentation from your specifications. You can
use this documentation to communicate your application's features and behavior to stakeholders, developers, and testers.

Example user interactions covered by end-to-end tests are automatically included in the documentation, allowing you to
quickly generate interactive demos of your application that are always up to date.

![Documentation example](/spequoia-web.gif)

Take a look at the [example Spequoia web documentation](https://spequoia.github.io/spequoia/example-todomvc/index.html)
for the TodoMVC application to see Spequoia in action.

## Benefits of using Spequoia

- **Single source of truth**: Spequoia centralizes requirements in one place—easier to track than scattered tickets or
  docs, especially in fast-moving Agile teams.
- **Align teams**: Designers, developers, and testers share a common language, improving collaboration and reducing
  miscommunication.
- **Build with confidence**: Define behavior once and generate end-to-end tests from the same source, so everyone knows
  what's implemented is what's intended.
- **Save time**: Generate docs, mockups, and tests from the same source, reducing manual work and keeping everything in sync.
- **Prevent drift**: Version-controlled specs stay aligned with your codebase over time.
- **Speed up onboarding**: Human-readable specs and auto-generated docs help new team members ramp up fast.
- **Engage stakeholders**: Interactive mockups and clear documentation keep everyone aligned and involved.

## Extensibility

While Spequoia comes with built-in tools, it's designed to be extensible through its well-documented schema. Third-party
developers can create additional tooling to enhance or customize Spequoia's capabilities:

- Alternative test runners (e.g., Selenium, Cypress, TestCafe)
- Custom documentation generators
- Different mockup rendering engines
- Integrations with design tools (e.g., Figma, Sketch)
- IDE plugins and extensions
- CI/CD integrations
- Design tool exporters/importers
- Analytics and reporting tools

## Example specification

Here is a simple example of a Spequoia specification for a counter application:

```yaml
version: 1.0.0
title: Simple Counter
description: A minimalistic counter application specification.

views:
  counter:
    count_display:
      $selector: .counter-value
      $text: "0"
    buttons:
      $direction: row
      decrement:
        $selector: '[data-testid="decrement"]'
        $text: "-"
      increment:
        $selector: '[data-testid="increment"]'
        $text: "+"
    reset:
      $selector: '[data-testid="reset"]'
      $text: "Reset"

actions:
  visit_counter:
    steps:
      - visit counter
      - expect count_display to have text "0"

features:
  - name: Increment Counter
    description: Counter value increases by 1 when the increment button is clicked.
    examples:
      - id: EX-001
        name: Increment Value
        steps:
          - visit_counter
          - click increment
          - expect count_display to have text "1"
          - click increment
          - expect count_display to have text "2"

  - name: Reset Counter
    description: Counter value resets to 0 when the reset button is clicked.
    examples:
      - id: EX-002
        name: Reset Value
        steps:
          - visit_counter
          - click increment
          - click increment
          - expect count_display to have text "2"
          - click reset
          - expect count_display to have text "0"
```

This specification gets rendered like this:

![Counter example](/counter-example.png)

A more complete example can be found in the [TodoMVC Spequoia web documentation](https://spequoia.github.io/spequoia/example-todomvc/index.html).
