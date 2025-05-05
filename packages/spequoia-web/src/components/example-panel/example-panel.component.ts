import {Component, computed, Input, OnInit, signal} from '@angular/core';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { ParsedExample } from 'spequoia-core/dist/model/parsed-document.model';
import { WireframePlayerComponent } from '../wireframe-player/wireframe-player.component';
import { DocumentService } from '../../services/document.service';
import { RouterLink } from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-example-panel',
  imports: [MarkdownPipe, RouterLink],
  templateUrl: './example-panel.component.html',
  styleUrl: './example-panel.component.scss',
})
export class ExamplePanelComponent implements OnInit {
  @Input()
  example: ParsedExample | undefined;

  hasExecutor = computed(() => {
    if (this.example?.executors?.length) {
      return true;
    }

    return this.documentService.document()?.defaultExecutor != null;
  });

  hasTestResults = signal(false);

  constructor(private readonly documentService: DocumentService, private readonly http: HttpClient) {}

  ngOnInit(): void {
    if (this.example) {
      this.http.get(`player-data/${this.example.id}/screenshot-manifest.json`).subscribe(manifest => {
        this.hasTestResults.set(manifest != null);
      });
    }
  }
}
