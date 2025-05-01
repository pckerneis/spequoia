import {computed, Injectable, signal} from '@angular/core';
import {ParsedExample, ParsedViewNode} from 'spequoia-core/dist/model/parsed-document.model';
import {DocumentService} from './document.service';

@Injectable()
export class WireframePlayerService {

  readonly currentView = signal<ParsedViewNode | undefined>(undefined);
  readonly currentStep = signal<number>(0);
  readonly example = signal<ParsedExample | null>(null);
  readonly progressPercent = computed(() => {
    const example = this.example();

    if (!example || !example.steps || example.steps.length === 0) {
      return 0;
    }

    return ((this.currentStep() + 1) / example.steps.length) * 100;
  })

  constructor(private readonly documentService: DocumentService) { }

  initialise(example: ParsedExample) {
    this.example.set(example);
    this.currentView.set(undefined);

    if (!example || !example.steps || example.steps.length === 0) {
      return;
    }

    const document = this.documentService.document();

    console.log(document);

    for (let step of example.steps) {
      if (step.fragments[0].type === "keyword" && step.fragments[0].value === "visit") {
        const viewName = step.fragments[1].value.trim();
        const view = document?.views?.find(view => view.name === viewName);
        this.currentView.set(view);

        console.log(`Current view set to: ${viewName}`, view);
        break;
      }
    }
  }

  next(): void {
    const example = this.example();

    if (example && example.steps) {
      if (this.currentStep() < example.steps.length - 1) {
        this.currentStep.update(step => step + 1);
      }
    }
  }

  previous(): void {
    const example = this.example();

    if (example && example.steps) {
      if (this.currentStep() > 0) {
        this.currentStep.update(step => step - 1);
      }
    }
  }

  setStep(index: number): void {
    const example = this.example();

    if (example?.steps && index >= 0 && index < example.steps.length) {
      this.currentStep.set(index);
    }
  }
}
