import {
  Action,
  ClickAction,
  ParsedStep, ParsedStepFragment,
  ParsedViewNode,
  PressKeyAction,
  TypeAction,
  VisitAction
} from '../model/parsed-document.model';
import {resolveTarget} from './target-resolver';

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
  let currentTargetPath: string[] = [];

  for (const step of steps) {
    const parsedStep = parseRawStep(step);
    parsedSteps.push(parsedStep);

    if (parsedStep.action?.type === "visit") {
      const viewName = parsedStep.fragments[1].value.trim();
      currentView = JSON.parse(
          JSON.stringify(views.find((view) => view.name === viewName) || null),
      );
      currentTargetPath = [];
      currentTarget = currentView;
      currentTargetName = viewName;
    }

    if (parsedStep.action?.type === "click") {
      const targetName = parsedStep.fragments[1].value.trim();
      currentTargetName = targetName;
      currentView = JSON.parse(JSON.stringify(currentView));
      const resolvedTarget = resolveTarget(
          currentView,
          targetName,
          currentTargetPath,
      );

      if (resolvedTarget) {
        currentTargetPath = resolvedTarget.path;
        currentTarget = resolvedTarget.node;
        currentTarget.target = true;
        currentTarget.clicked = true;
      }
    }

    if (parsedStep.action?.type === "type") {
      currentView = JSON.parse(JSON.stringify(currentView));
      const resolvedTarget = resolveTarget(
          currentView,
          currentTargetName,
          currentTargetPath,
      );
      currentTarget = resolvedTarget?.node;

      if (currentTarget) {
        currentTarget.target = true;
        currentTarget.text = parsedStep.action.text;
      }
    }

    if (parsedStep.action?.type === "press_key") {
      currentView = JSON.parse(JSON.stringify(currentView));

      if (currentTarget) {
        currentTarget.target = true;
      }
    }

    if (
        parsedStep.fragments[0].type === "keyword" &&
        parsedStep.fragments[0].value === "expect"
    ) {
      const targetName = parsedStep.fragments[1].value;
      const assertion = parsedStep.fragments[2].value.trim();
      const resolvedTarget = resolveTarget(
          currentView,
          targetName,
          currentTargetPath,
      );

      if (resolvedTarget) {
        currentTargetPath = resolvedTarget.path;
        resolvedTarget.node.target = true;

        switch (assertion) {
          case "to have text":
            resolvedTarget.node.text =
                parsedStep.fragments[3]?.value?.trim() ?? "";
            break;
          case "to be empty":
            resolvedTarget.node.empty = true;
            break;
          case "not to be empty":
            resolvedTarget.node.empty = false;
            break;
          case "to be hidden":
            resolvedTarget.node.hidden = true;
            break;
          case "to be visible":
            resolvedTarget.node.hidden = false;
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

    parsedStep.computedView = currentView;
  }

  return parsedSteps;
}

const actionOnElementPatterns = [
  // action keyword (click) followed by a variable
  /^(click)\s+([\w\s]+)/,
  /^(visit)\s+([\w\s]+)/,
];

const actionWithQuotedTextPatterns = [
  // action keyword (type) followed by quoted text
  /^(type)\s+"([^"]+)"/,
  /^(press key)\s+"([^"]+)"/,
];

const assertionPatterns = [
  // "expect" keyword followed by a variable and "to have text" keyword
  /expect\s+([\w\s]+)\s+(not to have text)\s+"([^"]*)"/,
  /expect\s+([\w\s]+)\s+(to have text)\s+"([^"]*)"/,
  /expect\s+([\w\s]+)\s+(not to have class)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(to have class)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(not to be visible)/,
  /expect\s+([\w\s]+)\s+(to be visible)/,
  /expect\s+([\w\s]+)\s+(to be hidden)/,
  /expect\s+([\w\s]+)\s+(not to exist)/,
  /expect\s+([\w\s]+)\s+(to exist)/,
  /expect\s+([\w\s]+)\s+(not to be checked)/,
  /expect\s+([\w\s]+)\s+(to be checked)/,
  /expect\s+([\w\s]+)\s+(not to be disabled)/,
  /expect\s+([\w\s]+)\s+(to be disabled)/,
  /expect\s+([\w\s]+)\s+(not to be enabled)/,
  /expect\s+([\w\s]+)\s+(to be enabled)/,
  /expect\s+([\w\s]+)\s+(not to be empty)/,
  /expect\s+([\w\s]+)\s+(to be empty)/,
  /expect\s+([\w\s]+)\s+(not to have placeholder)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(to have placeholder)\s+"([^"]+)"/,
];

function parseRawStep(step: string): ParsedStep {
  const fragments = parseStepFragments(step);
  let action: Action | undefined;

  if (fragments[0].type === "keyword") {
    switch (fragments[0].value) {
      case "visit":
        action = {
          type: "visit",
          selector: fragments[1].value,
        } satisfies VisitAction;
        break;
      case "click":
        action = {
          type: "click",
          selector: fragments[1].value,
        } satisfies ClickAction;
        break;
      case "type":
        action = {
          type: "type",
          text: fragments[1].value,
        } satisfies TypeAction;
        break;
      case "press key":
        action = {
          type: "press_key",
          key: fragments[1].value,
        } satisfies PressKeyAction;
        break;
    }
  }

  return {
    raw: step,
    fragments,
    action,
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

  // Check for action on element patterns
  const actionOnElementPattern = actionOnElementPatterns.find((pattern) =>
      pattern.test(step),
  );

  if (actionOnElementPattern) {
    const matches = step.match(actionOnElementPattern);
    if (matches) {
      const action = matches[1];
      const variable = matches[2];

      return [
        { type: "keyword", value: action },
        { type: "variable", value: variable },
      ];
    }
  }

  // Check for action with quoted text patterns
  const actionWithQuotedTextPattern = actionWithQuotedTextPatterns.find(
      (pattern) => pattern.test(step),
  );

  if (actionWithQuotedTextPattern) {
    const matches = step.match(actionWithQuotedTextPattern);
    if (matches) {
      const action = matches[1];
      const quotedText = matches[2];

      return [
        { type: "keyword", value: action },
        { type: "quoted", value: quotedText },
      ];
    }
  }

  // If no patterns matched, return the step as a text fragment
  return [{ type: "text", value: step }];
}
