import { Page, test } from "@playwright/test";
import {
  ClickAction,
  ParsedStep,
  ParsedViewNode,
  parseSpec,
  PressKeyAction,
  TypeAction,
} from "spequoia-core/dist";
import path from "path";
import fs from "fs";

interface ScreenshotSection {
  name: string;
  startFrame: number;
  endFrame?: number;
}

const SCREENSHOT_DIRECTORY = "player-data";

let frameCounter = 0;
const sections: ScreenshotSection[] = [];

function beginSection(name: string) {
  if (sections.length === 0 && frameCounter > 0) {
    sections.push({
      name: "",
      startFrame: 0,
    });
  }

  sections.push({
    name,
    startFrame: frameCounter,
  });
}

function saveManifest(exampleId: string) {
  const sectionsWithEndFrames = sections
    .map((section, index) => {
      const nextSection = sections[index + 1];
      return {
        ...section,
        endFrame: nextSection ? nextSection.startFrame : frameCounter,
      };
    })
    .filter((section) => section.endFrame - section.startFrame > 0);

  const json = JSON.stringify(
    {
      sections: sectionsWithEndFrames,
      frameCount: frameCounter,
    },
    null,
    2,
  );

  const manifestPath = path.join(
    __dirname,
    "..",
    SCREENSHOT_DIRECTORY,
    exampleId,
    "screenshot-manifest.json",
  );
  const folder = path.dirname(manifestPath);

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  fs.writeFileSync(manifestPath, json);
  console.log(`Manifest saved to ${manifestPath}`);

  sections.length = 0;
  frameCounter = 0;
}

async function screenshot(page: Page, exampleId: string) {
  await page.screenshot({
    path: path.join(SCREENSHOT_DIRECTORY, exampleId, `${frameCounter++}.png`),
  });
}

async function slowType(page: Page, text: string, exampleId: string) {
  for (let i = 0; i < text.length; i++) {
    const chr = text[i];
    await page.keyboard.type(chr);
    await screenshot(page, exampleId);
  }
}

const document = `
version: 1.0.0-it1
title: TodoMVC
description: |
  # TodoMVC

  This document is an example **Spequoia** specification for a TODO app.

  It's based on the [TodoMVC](https://todomvc.com/) project, which provides a
  consistent way to implement a simple TODO app using various JavaScript frameworks.

  The goal of this document is to show how to use **Spequoia** to specify the
  behavior of a web application. It includes the following sections:
  - **Views**: The user interface of the application, including the layout and
      elements used.
  - **Features**: The features of the application.
  - **Examples**: The examples of the features, including the expected
      behavior and the steps to reproduce it.

  These sections are used to generate wireframes, test cases, and documentation.

executors:
  default:
    kind: spequoia-playwright
    description: |
      This executor uses Playwright to run the tests. It uses the Playwright
      API to interact with the web application and verify the expected behavior.
    configuration:
      baseUrl: "https://todomvc.com/examples/javascript-es5/dist/"

defaultExecutor: default

views:
  main_page:
    header:
      title:
        $selector: h1
        $text: todos
      input: input.new-todo
    todo_list:
      $selector: .todo-list
      task_row(n):
        $selector: '[data-id="\${n}"]'
        $direction: row
        done_checkbox: input[type="checkbox"].toggle
        label: label
        input: input.edit
        delete_button: button.destroy
    footer:
      $selector: .footer
      $direction: row
      todo_count:
        $selector: .todo-count
        $text: 0 items left
      filters:
        $selector: .filters
        $direction: row
        all_filter:
          $selector: a[href="#/"]
          $text: All
        active_filter:
          $selector: a[href="#/active"]
          $text: Active
        completed_filter:
          $selector: a[href="#/completed"]
          $text: Completed
      clear_completed_button:
        $selector: .clear-completed
        $text: Clear completed

actions:
  visit_main_page:
    description: |
      Visit the main page of the TodoMVC app.
      The page is loaded and the header, input, and task list are displayed.
    steps:
      - visit main_page
      - expect todo_list to be empty
      - expect footer to be hidden
      - expect input to have placeholder "What needs to be done?"

  add_first_task:
    description: |
      Add a task named "New task".
      The input field is clicked, and the task name is typed.
      The task is added to the task list and displayed as active.
    steps:
      - click input
      - type "New task"
      - press key "Enter"
      - expect input to have text ""
      - expect task_row(1) to be visible
      - expect label to have text "New task"
      - expect done_checkbox to be visible
      - expect footer to be visible
      - expect todo_count to have text "1 items left"
      - expect clear_completed_button to be hidden

features:
  - name: Initial state of the app
    description: |
      The web app title "*todos*" is displayed in the header. It's shown in the header element
      in a \`h1\` tag.
      The app starts with an empty task list, and the user is prompted to add tasks.
    tags: [ui, layout]
    examples:
      - id: EX-001
        name: The web app shows a header with the app title "todos", a text input, and an empty task list
        description: |
          The app title is prominently displayed in the header, making the purpose
          of the application immediately clear to users.

          The input field is always visible, allowing users to quickly add tasks. The input placeholder
          is "What needs to be done?" to guide users on what to enter.

          The task list is empty at the start, indicating that no tasks have been added yet.
        steps:
          - visit_main_page
          - expect title to have text "todos"
          - expect input to be visible
          - expect input to have placeholder "What needs to be done?"
          - expect todo_list to be empty
          - expect footer not to be visible

  - name: Create new tasks
    description: |
      The text input allows to add new tasks by typing the task name and hitting \`Enter\`.

      Newly created tasks are displayed in the task list as active.

    examples:
      - id: EX-002
        name: Create a new task
        steps:
          - visit_main_page
          - add_first_task

  - name: Mark tasks as done
    description: |
      The user can mark tasks as done by clicking the checkbox next to the task name.

      When a task is marked as done, it is visually indicated as completed and removed from the active
      task count.

      The user can also uncheck the checkbox to mark the task as not done again.

    examples:
      - id: EX-003
        name: Mark a task as done
        steps:
          - visit_main_page
          - add_first_task
          - click done_checkbox
          - expect done_checkbox to be checked
          - expect todo_count to have text "0 items left"
          - expect clear_completed_button to be visible
      - id: EX-004
        name: Unmark a task as done
        steps:
          - visit_main_page
          - add_first_task
          - click done_checkbox
          - expect done_checkbox to be checked
          - expect todo_count to have text "0 items left"
          - click done_checkbox
          - expect done_checkbox not to be checked
          - expect todo_count to have text "1 items left"
          - expect clear_completed_button to be hidden

  - name: Clear completed tasks
    description: |
      The user can clear completed tasks by clicking the "Clear completed" button.

      When the button is clicked, all completed tasks are removed from the task list.

      The button is only visible when there are completed tasks.

    examples:
      - id: EX-005
        name: Clear completed tasks
        steps:
          - visit_main_page
          - add_first_task
          - click done_checkbox
          - expect done_checkbox to be checked
          - expect todo_count to have text "0 items left"
          - expect clear_completed_button to be visible
          - click clear_completed_button
          - expect todo_list to be empty
          - expect footer not to be visible

  - name: Delete tasks
    description: |
      The user can delete tasks by clicking the "Delete" button next to the task name.

      When the button is clicked, the task is removed from the task list.

      The button is only visible when the task is hovered.

    examples:
      - id: EX-006
        name: Delete a task
        steps:
          - visit_main_page
          - add_first_task
          - hover over task_row(1)
          - expect task_row(1) delete_button to be visible
          - click delete_button
          - expect todo_list to be empty

  - name: Filter tasks
    description: |
      The user can filter tasks by clicking the "All", "Active", or "Completed" links in the footer.

      When a link is clicked, only the tasks that match the filter are displayed in the task list.

      The active_filter is visually indicated by a different style.

    examples:
      - id: EX-007
        name: Filter tasks
        steps:
          - visit_main_page
          - click input
          - type "Active task"
          - press key "Enter"
          - expect task_row(1) to be visible
          - expect task_row(1) label to have text "Active task"
          - expect footer to be visible
          - type "Completed task"
          - press key "Enter"
          - expect task_row(2) to be visible
          - expect task_row(2) label to have text "Completed task"
          - click task_row(2) done_checkbox
          - expect input to have text ""
          - click active_filter
          - expect task_row(1) to be visible
          - expect task_row(2) to be hidden
          - click completed_filter
          - expect task_row(1) to be hidden
          - expect task_row(2) to be visible
          - click all_filter
          - expect task_row(1) to be visible
          - expect task_row(2) to be visible

  - name: Edit tasks
    description: |
      The user can edit tasks by double-clicking the task name.

      When the task is in edit mode, the user can change the task name and hit \`Enter\` to save
      the changes or hit \`Esc\` to cancel the changes.

      The task is visually indicated as being edited.

    examples:
      - id: EX-008
        name: Edit a task
        steps:
          - visit_main_page
          - add_first_task
          - double-click task_row(1)
          - press key "ControlOrMeta+A"
          - type "Edited task"
          - press key "Enter"
          - expect label to have text "Edited task"
      - id: EX-009
        name: Cancel editing a task
        steps:
          - visit_main_page
          - add_first_task
          - double-click task_row(1)
          - press key "ControlOrMeta+A"
          - type "Edited task"
          - press key "Escape"
          - expect label to have text "New task"
`;

const parseResult = parseSpec(document);

if (!parseResult.parsedDocument) {
  throw new Error("Failed to parse the document");
}

const foundExecutor = Object.entries(parseResult.parsedDocument!.executors)
  .map(([name, executor]) => ({ name, executor }))
  .find(({ executor }) => executor.kind === "spequoia-playwright");

if (!foundExecutor) {
  throw new Error("No executor found");
}

const { name, executor } = foundExecutor;

console.log(`Running tests with executor: ${name}`);

function resolveSelector(
  target: string,
  view: ParsedViewNode | undefined,
): string | null {
  if (!view) {
    return null;
  }

  const parts = target
    .split(" ")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  let currentNode: ParsedViewNode | null = view;
  let resolvedSelector: string | null = null;

  for (const part of parts) {
    const res = resolveNode(part, currentNode);
    if (!res) {
      console.error(
        `Node '${part}' not found in '${target}'`,
        JSON.stringify(view),
      );
      throw new Error(`Node '${part}' not found in '${target}'`);
    }

    if (res.selector) {
      if (resolvedSelector) {
        resolvedSelector += " " + res.selector;
      } else {
        resolvedSelector = res.selector;
      }
    }

    currentNode = res;
  }

  return resolvedSelector;
}

function resolveNode(
  target: string,
  node: ParsedViewNode | null,
): ParsedViewNode | null {
  if (!node) {
    return null;
  }

  const name = node.name;
  const children = node.children;

  if (target === name) {
    return node;
  }

  if (!children?.length) {
    return null;
  }

  for (const child of children) {
    const resolvedSelector = resolveNode(target, child);
    if (resolvedSelector) {
      return resolvedSelector;
    }
  }

  return null;
}

async function runStep(step: ParsedStep, page: Page, exampleId: string) {
  const action = step.action;

  if (!action) {
    return;
  }

  const { type } = action;

  switch (type) {
    case "visit": {
      const view = parseResult.parsedDocument!.views.find(
        (v) => v.name === action.view,
      );

      if (!view) {
        throw new Error(`View ${action.view} not found`);
      }

      let url = executor!.configuration!.baseUrl as string;

      if (view?.route) {
        url += view.route;
      }

      await page.goto(url);
      await screenshot(page, exampleId);
      break;
    }
    case "click": {
      const target = (step.action as ClickAction).target;
      const selector = resolveSelector(target, step.computedViewBefore);

      if (!selector) {
        console.error(
          `Selector for ${target} not found`,
          step.computedViewBefore,
        );
        throw new Error(`Selector for ${target} not found`);
      }

      await page.locator(selector).click();
      await screenshot(page, exampleId);

      break;
    }
    case "type": {
      const text = (step.action as TypeAction).text;
      await slowType(page, text, exampleId);
      break;
    }
    case "press_key": {
      const key = (step.action as PressKeyAction).key;
      await page.keyboard.press(key);
      await screenshot(page, exampleId);
      break;
    }
    case "hover": {
      const hoverTarget = (step.action as ClickAction).target;
      const hoverSelector = resolveSelector(
        hoverTarget,
        step.computedViewBefore,
      );

      if (!hoverSelector) {
        throw new Error(`Selector for ${hoverTarget} not found`);
      }

      await page.locator(hoverSelector).hover({ trial: true, force: false });
      await page.waitForTimeout(100); // Small wait for hover effects
      await screenshot(page, exampleId);
      break;
    }
    case "double_click": {
      const doubleClickTarget = (step.action as ClickAction).target;
      const doubleClickSelector = resolveSelector(
        doubleClickTarget,
        step.computedViewBefore,
      );

      if (!doubleClickSelector) {
        throw new Error(`Selector for ${doubleClickTarget} not found`);
      }

      await page.locator(doubleClickSelector).dblclick();
      await screenshot(page, exampleId);
      break;
    }
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
}

for (const feature of parseResult.parsedDocument!.features) {
  for (const example of feature.examples!) {
    test(example.name!, async ({ page }) => {
      for (const step of example.steps!) {
        if (step.composite) {
          for (const subStep of step.steps!) {
            beginSection(step.raw + " - " + subStep.raw);
            await runStep(subStep, page, example.id);
          }
        } else {
          beginSection(step.raw);
          await runStep(step, page, example.id);
        }
      }

      saveManifest(example.id);
    });
  }
}
