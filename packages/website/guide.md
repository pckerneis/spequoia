# Why Spequoia?

Spequoia is a specification format for web applications that aims to bridge the gap between design, development, and testing.

It provides a human-readable format for describing the behavior of web applications, making it easier for designers,
developers, and testers to collaborate.

It is also machine-readable, allowing for automatic generation of documentation, wireframes, and end-to-end tests.

The goal of Spequoia is to provide a single source of truth for your application that can be used throughout the
software development lifecycle. This reduces the duplication of knowledge and facilitates the synchronization between
your specifications, your code and your documentation.

## Spequoia and the software development lifecycle

Spequoia is designed to be used throughout the software development lifecycle, from design to regression testing.

### Design

- Describe your application's features and behavior using standard Markdown syntax.
- Describe your application's user interfaces.
- Add example user interactions to your specifications to illustrate how your application should behave.

Spequoia's wireframe generator allows you to create animated wireframes that can be used to visualize your
application's user interface before it is built. You can use these animated wireframes to gather feedback from
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