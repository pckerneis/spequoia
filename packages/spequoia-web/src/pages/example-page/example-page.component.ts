import { Component, computed, signal } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { ParsedExample } from 'spequoia-core/dist/model/parsed-document.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { WireframePlayerComponent } from '../../components/wireframe-player/wireframe-player.component';
import { HeaderComponent } from '../../components/header/header.component';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-example-page',
  imports: [
    MarkdownPipe,
    WireframePlayerComponent,
    RouterLink,
    HeaderComponent,
  ],
  templateUrl: './example-page.component.html',
  styleUrl: './example-page.component.scss',
})
export class ExamplePageComponent {
  example: ParsedExample | undefined;

  hasTestResults = signal(false);

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
    this.activatedRoute.params
      .pipe(
        map((params) => params['exampleId']),
        switchMap((exampleId) => this.documentService.getExample(exampleId)),
      )
      .subscribe((example) => {
        if (example) {
          this.example = example;
          this.hasTestResults.set(example.manifest != null);
        }
      });
  }
}
