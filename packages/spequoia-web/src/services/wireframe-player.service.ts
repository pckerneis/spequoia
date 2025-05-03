import { computed, Injectable, signal } from '@angular/core';
import {
  ParsedExample,
  ParsedStep,
  ParsedViewNode,
} from 'spequoia-core/dist/model/parsed-document.model';
import { Subject } from 'rxjs';

@Injectable()
export class WireframePlayerService {
  readonly currentView = computed<ParsedViewNode | undefined>(() => {
    const example = this.example();

    if (!example || !example.steps || example.steps.length === 0) {
      return undefined;
    }

    const step = this.currentStep();

    if (!step) {
      return undefined;
    }

    return step.computedView;
  });

  readonly flattenSteps = computed(() => {
    const example = this.example();

    if (!example || !example.steps || example.steps.length === 0) {
      return [];
    }

    const steps: ParsedStep[] = [];

    for (const step of example.steps) {
      if (step.composite) {
        steps.push(...step.steps!);
      } else {
        steps.push(step);
      }
    }

    return steps;
  });

  readonly currentStepIndex = signal<number>(0);
  readonly currentStep = computed(() => {
    return this.flattenSteps()[this.currentStepIndex()];
  });
  readonly example = signal<ParsedExample | null>(null);
  readonly playing = signal<boolean>(false);

  readonly progressPercent = computed(() => {
    const example = this.example();

    if (!example || !example.steps || this.flattenSteps().length === 0) {
      return 0;
    }

    return ((this.currentStepIndex() + 1) / this.flattenSteps().length) * 100;
  });

  readonly currentTargets = computed<string[]>(() => {
    const example = this.example();

    if (!example || !example.steps || example.steps.length === 0) {
      return [];
    }

    const step = this.currentStep();

    if (!step) {
      return [];
    }

    return step.fragments
      .filter((fragment) => fragment.type === 'variable')
      .map((fragment) => fragment.value.trim());
  });

  readonly stepChanged$ = new Subject<void>();

  private _playTimeout?: number;

  initialise(example: ParsedExample) {
    this.example.set(example);

    if (!example || !example.steps || example.steps.length === 0) {
      return;
    }
  }

  next(): void {
    const example = this.example();

    if (example && example.steps) {
      if (this.currentStepIndex() < this.flattenSteps().length - 1) {
        this.currentStepIndex.update((step) => step + 1);
      }
    }

    this.stepChanged$.next();
  }

  previous(): void {
    const example = this.example();

    if (example && example.steps) {
      if (this.currentStepIndex() > 0) {
        this.currentStepIndex.update((step) => step - 1);
      }
    }

    this.stepChanged$.next();
  }

  setStepIndex(index: number): void {
    if (index >= 0 && index < this.flattenSteps().length) {
      this.currentStepIndex.set(index);
    }

    this.stepChanged$.next();
  }

  public togglePlayState(): void {
    this.playing.update((state) => !state);

    if (this.playing()) {
      this.play();
    } else {
      this.stop();
    }
  }

  private play(): void {
    if (this.flattenSteps().length === 0) {
      return;
    }

    const showNext = () => {
      if (this.currentStepIndex() < this.flattenSteps().length - 1) {
        const step = this.currentStep();

        this._playTimeout = window.setTimeout(() => {
          this.next();
          if (this.playing()) {
            showNext();
          }
        }, step.duration);
      } else {
        this.stop();
      }
    };

    if (this.currentStepIndex() >= this.flattenSteps().length - 1) {
      this.setStepIndex(0);
    }

    showNext();
  }

  private stop(): void {
    this.playing.set(false);
    clearTimeout(this._playTimeout);
  }

  public setStepAndStop(step: ParsedStep): void {
    for (let i = 0; i < this.flattenSteps().length; i++) {
      if (this.flattenSteps()[i] === step) {
        this.setStepIndex(i);
        break;
      }
    }

    this.stop();
  }

  public previousAndStop(): void {
    this.previous();
    this.stop();
  }

  public nextAndStop(): void {
    this.next();
    this.stop();
  }
}
