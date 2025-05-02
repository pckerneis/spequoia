import { computed, Injectable, signal } from '@angular/core';
import {
  ParsedExample,
  ParsedStep,
  ParsedViewNode,
} from 'spequoia-core/dist/model/parsed-document.model';
import { DocumentService } from './document.service';
import { Subject } from 'rxjs';

@Injectable()
export class WireframePlayerService {
  readonly currentView = signal<ParsedViewNode | undefined>(undefined);
  readonly currentStep = signal<number>(0);
  readonly example = signal<ParsedExample | null>(null);
  readonly computedNodeStates = signal<Record<
    string,
    ComputedNodeState
  > | null>(null);

  readonly progressPercent = computed(() => {
    const example = this.example();

    if (!example || !example.steps || example.steps.length === 0) {
      return 0;
    }

    return ((this.currentStep() + 1) / example.steps.length) * 100;
  });

  readonly currentTargets = computed<string[]>(() => {
    const example = this.example();

    if (!example || !example.steps || example.steps.length === 0) {
      return [];
    }

    const step = example.steps[this.currentStep()];

    if (!step) {
      return [];
    }

    return step.fragments
      .filter((fragment) => fragment.type === 'variable')
      .map((fragment) => fragment.value.trim());
  });

  readonly computedViewChanged$ = new Subject<void>();
  readonly stepChanged$ = new Subject<void>();

  constructor(private readonly documentService: DocumentService) {}

  initialise(example: ParsedExample) {
    this.example.set(example);
    this.currentView.set(undefined);

    if (!example || !example.steps || example.steps.length === 0) {
      return;
    }

    this.computeViewState();
  }

  next(): void {
    const example = this.example();

    if (example && example.steps) {
      if (this.currentStep() < example.steps.length - 1) {
        this.currentStep.update((step) => step + 1);
      }
    }

    this.computeViewState();
    this.stepChanged$.next();
  }

  previous(): void {
    const example = this.example();

    if (example && example.steps) {
      if (this.currentStep() > 0) {
        this.currentStep.update((step) => step - 1);
      }
    }

    this.computeViewState();
    this.stepChanged$.next();
  }

  setStep(index: number): void {
    const example = this.example();

    if (example?.steps && index >= 0 && index < example.steps.length) {
      this.currentStep.set(index);
    }

    this.computeViewState();
    this.stepChanged$.next();
  }

  private computeViewState() {
    const example = this.example();
    const document = this.documentService.document();

    if (!example || !example.steps || example.steps.length === 0) {
      return;
    }

    let currentViewStep = -1;

    for (let i = 0; i <= this.currentStep(); i++) {
      const step = example.steps[i];

      if (
        step.fragments[0].type === 'keyword' &&
        step.fragments[0].value === 'visit'
      ) {
        const viewName = step.fragments[1].value.trim();
        const view = document?.views?.find((view) => view.name === viewName);
        this.currentView.set(view);
        currentViewStep = i;
        break;
      }
    }

    const computedNodeStates: Record<string, ComputedNodeState> = {};

    if (currentViewStep >= 0) {
      for (let i = currentViewStep + 1; i < example?.steps.length; i++) {
        const step = example.steps[i] as ParsedStep;

        if (
          step.fragments[0].type === 'keyword' &&
          step.fragments[0].value === 'expect'
        ) {
          const nodeName = step.fragments[1].value;
          const computedNodeState: ComputedNodeState =
            computedNodeStates[nodeName] || {};

          const assertion = step.fragments[2].value.trim();

          switch (assertion) {
            case 'to have text':
              computedNodeState.text = step.fragments[3].value.trim();
              break;
            case 'to be empty':
              computedNodeState.empty = true;
              break;
            case 'not to be empty':
              computedNodeState.empty = false;
              break;
            case 'to be hidden':
              computedNodeState.hidden = true;
              break;
            case 'to be visible':
              computedNodeState.hidden = false;
              break;
            case 'not to be visible':
              computedNodeState.hidden = true;
              break;
            case 'to have placeholder':
              computedNodeState.placeholder = step.fragments[3].value.trim();
              break;
            case 'not to have text':
              computedNodeState.text = '';
              break;
          }

          computedNodeStates[nodeName] = computedNodeState;
        } else if (i > this.currentStep()) {
          break;
        }
      }
    }

    console.log('Computed node states:', computedNodeStates);
    this.computedNodeStates.set(computedNodeStates);
    this.computedViewChanged$.next();
  }
}

export interface ComputedNodeState {
  text?: string;
  placeholder?: string;
  hidden?: boolean;
  empty?: boolean;
}
