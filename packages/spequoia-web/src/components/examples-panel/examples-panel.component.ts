import { Component, Input } from '@angular/core';
import { ParsedExample } from 'spequoia-core/dist/model/parsed-document.model';
import {MarkdownPipe} from '../../pipes/markdown.pipe';
import {ViewNodeComponent} from '../view-node/view-node.component';
import {ExamplePanelComponent} from '../example-panel/example-panel.component';

@Component({
  selector: 'app-examples-panel',
  imports: [
    ExamplePanelComponent
  ],
  templateUrl: './examples-panel.component.html',
  styleUrl: './examples-panel.component.scss',
})
export class ExamplesPanelComponent {
  @Input() examples: ParsedExample[] | undefined;
}
