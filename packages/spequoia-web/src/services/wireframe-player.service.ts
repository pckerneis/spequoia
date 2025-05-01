import {Injectable, signal} from '@angular/core';
import {ParsedExample, ParsedViewNode} from 'spequoia-core/dist/model/parsed-document.model';
import {DocumentService} from './document.service';

@Injectable()
export class WireframePlayerService {

  readonly currentView = signal<ParsedViewNode | undefined>(undefined);

  constructor(private readonly documentService: DocumentService) { }

  initialise(example: ParsedExample) {
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
}
