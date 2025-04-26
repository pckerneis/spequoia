import {Component, Input} from '@angular/core';
import {ParsedFeature} from 'spequoia-core/dist/model/parsed-document.model';
import {MarkdownPipe} from '../../pipes/markdown.pipe';
import {ExamplesPanelComponent} from '../examples-panel/examples-panel.component';

@Component({
  selector: 'app-feature-panel',
  imports: [
    MarkdownPipe,
    ExamplesPanelComponent
  ],
  templateUrl: './feature-panel.component.html',
  styleUrl: './feature-panel.component.scss'
})
export class FeaturePanelComponent {
  @Input() feature: ParsedFeature | undefined;

}
