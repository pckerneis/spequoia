import {Component, computed, Input} from '@angular/core';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { ParsedExample } from 'spequoia-core/dist/model/parsed-document.model';
import {WireframePlayerComponent} from '../wireframe-player/wireframe-player.component';
import {DocumentService} from '../../services/document.service';

@Component({
  selector: 'app-example-panel',
  imports: [MarkdownPipe, WireframePlayerComponent],
  templateUrl: './example-panel.component.html',
  styleUrl: './example-panel.component.scss',
})
export class ExamplePanelComponent {
  @Input()
  example: ParsedExample | undefined;

  hasExecutor = computed(() => {
    if (this.example?.executors?.length) {
      return true;
    }

    return this.documentService.document()?.defaultExecutor != null;
  });

  constructor(private readonly documentService: DocumentService) {}
}
