import { Component, Input } from '@angular/core';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { ExamplesPanelComponent } from '../examples-panel/examples-panel.component';
import { ProcessedFeature } from '../../models/processed-document.model';

@Component({
  selector: 'app-feature-panel',
  imports: [MarkdownPipe, ExamplesPanelComponent],
  templateUrl: './feature-panel.component.html',
  styleUrl: './feature-panel.component.scss',
})
export class FeaturePanelComponent {
  @Input() feature: ProcessedFeature | undefined;
}
