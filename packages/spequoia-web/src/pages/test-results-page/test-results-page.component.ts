import { Component, computed } from '@angular/core';
import { TestPlayerComponent } from '../../components/test-player/test-player.component';
import { ParsedExample } from 'spequoia-core/dist';
import { DocumentService } from '../../services/document.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-test-results-page',
  imports: [TestPlayerComponent, RouterLink, MarkdownPipe, HeaderComponent],
  templateUrl: './test-results-page.component.html',
  styleUrl: './test-results-page.component.scss',
})
export class TestResultsPageComponent {
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
