import { Component, computed } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { ParsedExample } from 'spequoia-core/dist/model/parsed-document.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { WireframePlayerComponent } from '../../components/wireframe-player/wireframe-player.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-example-page',
  imports: [MarkdownPipe, WireframePlayerComponent, RouterLink, JsonPipe],
  templateUrl: './example-page.component.html',
  styleUrl: './example-page.component.scss',
})
export class ExamplePageComponent {
  example: ParsedExample | undefined;

  hasExecutor = computed(() => {
    if (this.example?.executors?.length) {
      return true;
    }

    return this.documentService.document()?.defaultExecutor != null;
  });

  constructor(
    public readonly documentService: DocumentService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      const exampleId = params['exampleId'];
      if (exampleId) {
        this.example = this.documentService.getExample(exampleId);
      }
    });
  }
}
