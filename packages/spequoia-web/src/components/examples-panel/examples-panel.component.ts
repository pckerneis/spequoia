import { Component, Input } from '@angular/core';
import { ParsedExample } from 'spequoia-core/dist/model/parsed-document.model';
import {MarkdownPipe} from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-examples-panel',
  imports: [
    MarkdownPipe
  ],
  templateUrl: './examples-panel.component.html',
  styleUrl: './examples-panel.component.scss',
})
export class ExamplesPanelComponent {
  @Input() examples: ParsedExample[] | undefined;
}
