import {
  ParsedStep,
  ParsedStepFragment,
  ParsedViewNode,
} from "../model/parsed-document.model";
import { resolveTarget } from "./target-resolver";

export function parseRawSteps(
  steps: string[] | undefined,
  views: ParsedViewNode[],
): ParsedStep[] {
  if (!steps) {
    return [];
  }

  const parsedSteps: ParsedStep[] = [];
  let currentView: ParsedViewNode | undefined;
  let currentTarget: ParsedViewNode | undefined;
  let currentTargetName: string | undefined;
  let mergedViews: ParsedViewNode[] = [];
  let currentViewTemplate: ParsedViewNode | undefined;

  for (const step of steps) {
    const parsedStep = parseRawStep(step);
    parsedSteps.push(parsedStep);

    if (currentView) {
      currentView = JSON.parse(JSON.stringify(currentView));
      resetOneTimeState(currentView);
    }

    if (parsedStep.action?.type === "visit") {
      const viewName = parsedStep.fragments[1].value.trim();
      currentViewTemplate = views.find((view) => view.name === viewName);
      currentView = JSON.parse(JSON.stringify(currentViewTemplate));
      currentTarget = currentView;
      currentTargetName = viewName;

      if (currentView) {
        mergedViews = [currentView];
      }
    }

    if (!currentView || !currentViewTemplate) {
      continue;
    }

    if (parsedStep.action?.type === "click") {
      const targetName = parsedStep.fragments[1].value.trim();
      currentTargetName = targetName;
      const resolvedTarget = resolveTarget(
        currentView,
        targetName,
        currentViewTemplate,
      );

      if (resolvedTarget) {
        currentTarget = resolvedTarget.node;
        currentTarget.target = true;
        currentTarget.clicked = true;
      }

      mergedViews = [currentView];
    }

    if (parsedStep.action?.type === "type") {
      const resolvedTarget = resolveTarget(
        currentView,
        currentTargetName,
        currentViewTemplate,
      );
      currentTarget = resolvedTarget?.node;

      if (currentTarget) {
        currentTarget.target = true;
        currentTarget.text = parsedStep.action.text;
        currentTarget.typing = true;
      }

      mergedViews = [currentView];
    }

    if (parsedStep.action?.type === "press_key") {
      if (currentTarget) {
        currentTarget.target = true;
      }

      mergedViews = [currentView];
    }

    if (
      parsedStep.fragments[0].type === "keyword" &&
      parsedStep.fragments[0].value === "expect"
    ) {
      mergedViews.push(currentView);

      for (const view of mergedViews) {
        const targetName = parsedStep.fragments[1].value;
        const assertion = parsedStep.fragments[2].value.trim();
        const resolvedTarget = resolveTarget(
          view,
          targetName,
          currentViewTemplate,
        );

        if (resolvedTarget) {
          resolvedTarget.node.target = true;

          switch (assertion) {
            case "to have text":
              resolvedTarget.node.text =
                parsedStep.fragments[3]?.value?.trim() ?? "";
              break;
            case "to be empty":
              resolvedTarget.node.children = [];
              break;
            case "to be hidden":
              resolvedTarget.node.hidden = true;
              break;
            case "to be visible":
              resolvedTarget.node.hidden = false;
              makeAllParentsVisible(resolvedTarget.node, currentView);
              break;
            case "not to be visible":
              resolvedTarget.node.hidden = true;
              break;
            case "to have placeholder":
              resolvedTarget.node.placeholder =
                parsedStep.fragments[3].value.trim();
              break;
            case "not to have text":
              resolvedTarget.node.text = "";
              break;
          }
        }
      }
    }

    parsedStep.computedView = currentView;
  }

  return parsedSteps;
}

function resetOneTimeState(currentView: ParsedViewNode | undefined): void {
  if (currentView) {
    currentView.clicked = false;
    currentView.typing = false;
    currentView.target = false;
  }

  if (currentView?.children) {
    for (const child of currentView.children) {
      resetOneTimeState(child);
    }
  }
}

const assertionPatterns = [
  // "expect" keyword followed by a variable and "to have text" keyword
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(not to have text)\s+"([^"]*)"/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to have text)\s+"([^"]*)"/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(not to have class)\s+"([^"]+)"/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to have class)\s+"([^"]+)"/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(not to be visible)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to be visible)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to be hidden)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(not to exist)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to exist)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(not to be checked)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to be checked)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(not to be disabled)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to be disabled)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(not to be enabled)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to be enabled)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to be empty)/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(not to have placeholder)\s+"([^"]+)"/,
  /expect\s+([a-zA-Z0-9_\-\s()]+)\s+(to have placeholder)\s+"([^"]+)"/,
];

const visitActionParser = (str: string): ParsedStep | null => {
  const visitPattern = /^(visit)\s+([a-zA-Z0-9_\-\s()]+)/;
  const match = str.match(visitPattern);

  if (match) {
    return {
      action: {
        type: "visit",
        selector: match[2],
      },
      fragments: [
        { type: "keyword", value: match[1] },
        { type: "variable", value: match[2] },
      ],
      raw: str,
      duration: 1000,
    };
  }
  return null;
};

const clickActionParser = (str: string): ParsedStep | null => {
  const clickPattern = /^(click)\s+([a-zA-Z0-9_\-\s()]+)/;
  const match = str.match(clickPattern);

  if (match) {
    return {
      action: {
        type: "click",
        selector: match[2],
      },
      fragments: [
        { type: "keyword", value: match[1] },
        { type: "variable", value: match[2] },
      ],
      raw: str,
      duration: 1000,
    };
  }
  return null;
};

const typeActionParser = (str: string): ParsedStep | null => {
  const typePattern = /^(type)\s+"([^"]+)"/;
  const match = str.match(typePattern);

  if (match) {
    return {
      action: {
        type: "type",
        text: match[2],
      },
      fragments: [
        { type: "keyword", value: match[1] },
        { type: "quoted", value: match[2] },
      ],
      raw: str,
      duration: 2000,
    };
  }
  return null;
};

const pressKeyActionParser = (str: string): ParsedStep | null => {
  const pressKeyPattern = /^(press key)\s+"([^"]+)"/;
  const match = str.match(pressKeyPattern);

  if (match) {
    return {
      action: {
        type: "press_key",
        key: match[2],
      },
      fragments: [
        { type: "keyword", value: match[1] },
        { type: "quoted", value: match[2] },
      ],
      raw: str,
      duration: 1000,
    };
  }
  return null;
};

const hoverActionParser = (str: string): ParsedStep | null => {
  const hoverPattern = /^(hover over)\s+([a-zA-Z0-9_\-\s()]+)/;
  const match = str.match(hoverPattern);

  if (match) {
    return {
      action: {
        type: "hover",
        selector: match[2],
      },
      fragments: [
        { type: "keyword", value: match[1] },
        { type: "variable", value: match[2] },
      ],
      raw: str,
      duration: 1000,
    };
  }
  return null;
};

const actionParsers = [
  visitActionParser,
  clickActionParser,
  typeActionParser,
  pressKeyActionParser,
  hoverActionParser,
];

function parseRawStep(step: string): ParsedStep {
  for (const parser of actionParsers) {
    const parsedStep = parser(step);

    if (parsedStep) {
      return parsedStep;
    }
  }

  const fragments = parseStepFragments(step);

  return {
    raw: step,
    fragments,
    duration: 500,
  };
}

function parseStepFragments(step: string): ParsedStepFragment[] {
  // Check for assertion patterns
  const assertionPattern = assertionPatterns.find((pattern) =>
    pattern.test(step),
  );

  if (assertionPattern) {
    const matches = step.match(assertionPattern);
    if (matches) {
      const variable = matches[1];
      const assertion = matches[2];
      const value = matches[3];

      const fragments: ParsedStepFragment[] = [
        { type: "keyword", value: "expect" },
        { type: "variable", value: variable },
        { type: "keyword", value: assertion },
      ];

      if (value) {
        fragments.push({ type: "quoted", value });
      }

      return fragments;
    }
  }

  // If no patterns matched, return the step as a text fragment
  return [{ type: "text", value: step }];
}

function findParent(
  node: ParsedViewNode,
  currentNode: ParsedViewNode,
): ParsedViewNode | undefined {
  for (const child of currentNode.children || []) {
    if (child.name === node.name) {
      return currentNode;
    }

    const found = findParent(node, child);
    if (found) {
      return found;
    }
  }

  return undefined;
}

function findAncestors(
  node: ParsedViewNode,
  currentView: ParsedViewNode,
): ParsedViewNode[] {
  const ancestors: ParsedViewNode[] = [];
  let currentNode: ParsedViewNode | undefined = node;

  while (currentNode) {
    const parent = findParent(currentNode, currentView);
    if (parent) {
      ancestors.push(parent);
      currentNode = parent;
    } else {
      break;
    }
  }

  return ancestors;
}

function makeAllParentsVisible(
  node: ParsedViewNode,
  currentView: ParsedViewNode,
): void {
  const ancestors = findAncestors(node, currentView);
  for (const ancestor of ancestors) {
    ancestor.hidden = false;
  }
}
