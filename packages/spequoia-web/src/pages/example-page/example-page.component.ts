import { Component, computed, signal } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { ParsedExample } from 'spequoia-core/dist/model/parsed-document.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { WireframePlayerComponent } from '../../components/wireframe-player/wireframe-player.component';
import { HttpClient } from '@angular/common/http';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-example-page',
  imports: [MarkdownPipe, WireframePlayerComponent, RouterLink, HeaderComponent],
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
    private readonly http: HttpClient,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      const exampleId = params['exampleId'];
      if (exampleId) {
        this.example = this.documentService.getExample(exampleId);
      }

      if (this.example) {
        this.http
          .get(`player-data/${this.example.id}/screenshot-manifest.json`)
          .subscribe((manifest) => {
            this.hasTestResults.set(manifest != null);
          });
      }
    });
  }
}
