import {Component, Input} from '@angular/core';
import {ParsedExample, ParsedFeature} from 'spequoia-core/dist/model/parsed-document.model';

@Component({
  selector: 'app-examples-panel',
  imports: [],
  templateUrl: './examples-panel.component.html',
  styleUrl: './examples-panel.component.scss'
})
export class ExamplesPanelComponent {
  @Input() examples: ParsedExample[] | undefined;

}
