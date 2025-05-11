import { Component, Input } from '@angular/core';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { ExamplesPanelComponent } from '../examples-panel/examples-panel.component';
import { ProcessedFeature } from '../../models/processed-document.model';
import { TagComponent } from '../tag/tag.component';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-feature-panel',
  imports: [MarkdownPipe, ExamplesPanelComponent, TagComponent],
  templateUrl: './feature-panel.component.html',
  styleUrl: './feature-panel.component.scss',
})
export class FeaturePanelComponent {
  @Input() feature: ProcessedFeature | undefined;

  constructor(private readonly documentService: DocumentService) {}

  public handleTagClicked(tagName: string): void {
    this.documentService.setTagFilter(tagName);
  }
}
