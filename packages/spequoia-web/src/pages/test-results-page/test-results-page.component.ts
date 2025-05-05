import {Component, computed} from '@angular/core';
import {TestPlayerComponent} from '../../components/test-player/test-player.component';
import {ParsedExample} from 'spequoia-core/dist';
import {DocumentService} from '../../services/document.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MarkdownPipe} from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-test-results-page',
  imports: [
    TestPlayerComponent,
    RouterLink,
    MarkdownPipe
  ],
  templateUrl: './test-results-page.component.html',
  styleUrl: './test-results-page.component.scss'
})
export class TestResultsPageComponent {
  example: ParsedExample | undefined;

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
