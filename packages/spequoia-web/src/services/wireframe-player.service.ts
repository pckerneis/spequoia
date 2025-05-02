import { computed, Injectable, signal } from '@angular/core';
import {
  ParsedExample,
  ParsedViewNode,
} from 'spequoia-core/dist/model/parsed-document.model';
import { DocumentService } from './document.service';
import { Subject } from 'rxjs';

@Injectable()
export class WireframePlayerService {
  readonly currentView = computed<ParsedViewNode | undefined>(() => {
    const example = this.example();

    if (!example || !example.steps || example.steps.length === 0) {
      return undefined;
    }

    const step = example.steps[this.currentStep()];

    if (!step) {
      return undefined;
    }

    return step.computedView;
  });
  readonly currentStep = signal<number>(0);
  readonly example = signal<ParsedExample | null>(null);

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

  readonly stepChanged$ = new Subject<void>();

  constructor(private readonly documentService: DocumentService) {}

  initialise(example: ParsedExample) {
    this.example.set(example);

    if (!example || !example.steps || example.steps.length === 0) {
      return;
    }
  }

  next(): void {
    const example = this.example();

    if (example && example.steps) {
      if (this.currentStep() < example.steps.length - 1) {
        this.currentStep.update((step) => step + 1);
      }
    }

    this.stepChanged$.next();
  }

  previous(): void {
    const example = this.example();

    if (example && example.steps) {
      if (this.currentStep() > 0) {
        this.currentStep.update((step) => step - 1);
      }
    }

    this.stepChanged$.next();
  }

  setStep(index: number): void {
    const example = this.example();

    if (example?.steps && index >= 0 && index < example.steps.length) {
      this.currentStep.set(index);
    }

    this.stepChanged$.next();
  }
}
