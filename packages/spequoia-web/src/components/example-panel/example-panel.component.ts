import {Component, Input} from '@angular/core';
import {MarkdownPipe} from '../../pipes/markdown.pipe';
import {ParsedExample} from 'spequoia-core/dist/model/parsed-document.model';
import {ExamplesPanelComponent} from '../examples-panel/examples-panel.component';

@Component({
  selector: 'app-example-panel',
  imports: [
    MarkdownPipe,
  ],
  templateUrl: './example-panel.component.html',
  styleUrl: './example-panel.component.scss'
})
export class ExamplePanelComponent {
  @Input()
  example: ParsedExample | undefined;
}
