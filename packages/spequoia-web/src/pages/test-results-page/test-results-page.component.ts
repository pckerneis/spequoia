import { Component, computed } from '@angular/core';
import { TestPlayerComponent } from '../../components/test-player/test-player.component';
import { DocumentService } from '../../services/document.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { HeaderComponent } from '../../components/header/header.component';
import { DatePipe } from '@angular/common';
import { ExampleWithManifest } from '../../models/processed-document.model';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-test-results-page',
  imports: [
    TestPlayerComponent,
    RouterLink,
    MarkdownPipe,
    HeaderComponent,
    DatePipe,
  ],
  templateUrl: './test-results-page.component.html',
  styleUrl: './test-results-page.component.scss',
})
export class TestResultsPageComponent {
  example: ExampleWithManifest | undefined;

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
        }
      });
  }
}
