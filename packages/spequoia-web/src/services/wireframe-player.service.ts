import { computed, Injectable, signal } from '@angular/core';
import {
  ParsedExample,
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

    const step = example.steps[this.currentStep()];

    if (!step) {
      return undefined;
    }

    return step.computedView;
  });
  readonly currentStep = signal<number>(0);
  readonly example = signal<ParsedExample | null>(null);
  readonly playing = signal<boolean>(false);

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

  public togglePlayState(): void {
    this.playing.update((state) => !state);

    if (this.playing()) {
      this.play();
    } else {
      this.stop();
    }
  }

  private play(): void {
    const example = this.example();
    const steps = example?.steps;

    if (!steps || steps.length === 0) {
      return;
    }

    const showNext = () => {
      if (this.currentStep() < steps.length - 1) {
        const step = steps[this.currentStep()];

        this._playTimeout = window.setTimeout(() => {
          this.next();
          if (this.playing()) {
            showNext();
          }
        }, step.duration ?? 50);
      } else {
        this.stop();
      }
    };

    if (this.currentStep() >= steps.length - 1) {
      this.setStep(0);
    }

    showNext();
  }

  private stop(): void {
    this.playing.set(false);
    clearTimeout(this._playTimeout);
  }

  public setStepAndStop($index: number): void {
    this.setStep($index);
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
