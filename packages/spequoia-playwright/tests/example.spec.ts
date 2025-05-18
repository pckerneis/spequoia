import { Page, test } from "@playwright/test";
import {
  ClickAction, ParsedOverlay,
  ParsedStep,
  ParsedViewNode,
  parseSpec,
  PressKeyAction,
  TypeAction,
} from 'spequoia-core/dist';
import path from "path";
import fs from "fs";

interface ScreenshotSection {
  name: string;
  startFrame: number;
  endFrame?: number;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface OverlayRendering {
  targetBounds: BoundingBox;
  overlay: ParsedOverlay;
}

const SCREENSHOT_DIRECTORY = "player-data";

let startTime = 0;

let frameCounter = 0;
const sections: ScreenshotSection[] = [];
let currentOverlay: OverlayRendering | null = null;
const overlays: (OverlayRendering | null)[] = [];

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
      startTime: startTime,
      overlays,
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

  overlays.push(currentOverlay);
  currentOverlay = null;
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

  ![TodoMVC](player-data/EX-007/32.png "TodoMVC")

  The goal of this document is to show how to use **Spequoia** to specify the
  behavior of a web application. It includes the following sections:
  - **Views**: The user interface of the application, including the layout and
      elements used.
  - **Features**: The features of the application.
  - **Examples**: The examples of the features, including the expected
      behavior and the steps to reproduce it.

  These sections are used to generate wireframes, test cases, and documentation.

tags:
  - name: ui
    color: rgb(245 164 105)
  - name: layout
    color: rgb(170 150 245)

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
        name: Initial state
        description: Check the initial state of the app.
        steps:
          - visit_main_page
          - expect title to have text "todos"
          - expect input to be visible
          - expect input to have placeholder "What needs to be done?"
          - expect todo_list to be empty
          - expect footer not to be visible

  - name: Create new tasks
    tags: [ui, state]
    description: |
      The text input allows to add new tasks by typing the task name and hitting \`Enter\`.

      Newly created tasks are displayed in the task list as active.

    examples:
      - id: EX-002
        name: Create a new task
        description: Create a new task by typing in the input field and hitting \`Enter\`.
        steps:
          - visit_main_page
          - kind: hotspot
            text: Click here and type a task name.
            target: input
          - click input
          - type "New task"
          - press key "Enter"
          - kind: hotspot
            text: Your new task is added here.
            target: task_row(1)
          - expect task_row(1) to be visible
          - expect label to have text "New task"

  - name: Mark tasks as done
    tags: [ui, state]
    description: |
      The user can mark tasks as done by clicking the checkbox next to the task name.

      When a task is marked as done, it is visually indicated as completed and removed from the active
      task count.

      The user can also uncheck the checkbox to mark the task as not done again.

    examples:
      - id: EX-003
        description: Mark a task as done by clicking the checkbox.
        name: Mark a task as done
        steps:
          - visit_main_page
          - add_first_task
          - kind: hotspot
            text: Click the checkbox to mark the task as done.
            target: task_row(1) done_checkbox
          - click done_checkbox
          - expect done_checkbox to be checked
          - expect todo_count to have text "0 items left"
          - expect clear_completed_button to be visible
      - id: EX-004
        name: Unmark a task as done
        description: Unmark a task as done by clicking the checkbox twice.
        steps:
          - visit_main_page
          - add_first_task
          - kind: hotspot
            text: Click the checkbox to mark the task as done.
            target: task_row(1) done_checkbox
          - click done_checkbox
          - expect done_checkbox to be checked
          - expect todo_count to have text "0 items left"
          - kind: hotspot
            text: Click again to unmark the task as done.
            target: task_row(1) done_checkbox
          - click done_checkbox
          - expect done_checkbox not to be checked
          - expect todo_count to have text "1 items left"
          - expect clear_completed_button to be hidden

  - name: Clear completed tasks
    tags: [ui, state]
    description: |
      The user can clear completed tasks by clicking the "Clear completed" button.

      When the button is clicked, all completed tasks are removed from the task list.

      The button is only visible when there are completed tasks.

    examples:
      - id: EX-005
        name: Clear completed tasks
        description: Clear completed tasks by clicking the "Clear completed" button.
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
    tags: [ui, state]
    description: |
      The user can delete tasks by clicking the "Delete" button next to the task name.

      When the button is clicked, the task is removed from the task list.

      The button is only visible when the task is hovered.

    examples:
      - id: EX-006
        description: Click the "Delete" button and check task is removed from the list.
        name: Delete a task
        steps:
          - visit_main_page
          - add_first_task
          - hover over task_row(1)
          - expect task_row(1) delete_button to be visible
          - click task_row(1) delete_button
          - expect todo_list to be empty

  - name: Filter tasks
    tags: [ui]
    description: |
      The user can filter tasks by clicking the "All", "Active", or "Completed" links in the footer.

      When a link is clicked, only the tasks that match the filter are displayed in the task list.

      The active filter is visually indicated by a different style.

    examples:
      - id: EX-007
        name: Filter tasks
        description: Checks the behavior of "All", "Active", or "Completed" links in the footer.
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
          - expect task_row(2) done_checkbox to be checked
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
    tags: [ui, state]
    description: |
      The user can edit tasks by double-clicking the task name.

      When the task is in edit mode, the user can change the task name and hit \`Enter\` to save
      the changes or hit \`Esc\` to cancel the changes.

      The task is visually indicated as being edited.

    examples:
      - id: EX-008
        name: Edit a task
        description: Double-click a task to edit it.
        steps:
          - visit_main_page
          - add_first_task
          - double-click task_row(1) label
          - type "Edited task"
          - press key "Enter"
          - expect label to have text "Edited task"
      - id: EX-009
        name: Cancel editing a task
        description: Cancel editing a task by pressing \`Esc\`.
        steps:
          - visit_main_page
          - add_first_task
          - double-click task_row(1) label
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

function findByUuid(targetUuid: string, computedViewBefore: ParsedViewNode | undefined): ParsedViewNode {
  if (!computedViewBefore) {
    throw new Error(`Computed view before is undefined`);
  }

  const found = findByUuidRecursive(targetUuid, computedViewBefore);

  if (!found) {
    throw new Error(`Node with UUID ${targetUuid} not found`);
  }

  return found;
}

function findByUuidRecursive(
  targetUuid: string,
  node: ParsedViewNode | undefined,
): ParsedViewNode | null {
  if (!node) {
    return null;
  }

  if (node.uuid === targetUuid) {
    return node;
  }

  for (const child of node.children || []) {
    const found = findByUuidRecursive(targetUuid, child);
    if (found) {
      return found;
    }
  }

  return null;
}

async function runStep(step: ParsedStep, page: Page, exampleId: string) {
  const action = step.action;

  if (!action) {
    return;
  }

  if (step.overlay) {
    const overlay = step.overlay;
    const overlaySelector = findByUuid(
        overlay.targetUuid,
        step.computedViewBefore,
    );

    if (!overlaySelector?.selector) {
      throw new Error(`Overlay selector for ${overlay.targetUuid} not found`);
    }

    const boundingBox = await page.locator(overlaySelector.selector).boundingBox();

    if (!boundingBox) {
      throw new Error(`Bounding box for ${overlay.targetUuid} not found`);
    }

    currentOverlay = {
      targetBounds: boundingBox,
      overlay: overlay,
    };
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
      startTime = Date.now();

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
