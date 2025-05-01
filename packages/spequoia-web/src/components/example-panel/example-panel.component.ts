import { Component, Input } from '@angular/core';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { ParsedExample } from 'spequoia-core/dist/model/parsed-document.model';
import {WireframePlayerComponent} from '../wireframe-player/wireframe-player.component';

@Component({
  selector: 'app-example-panel',
  imports: [MarkdownPipe, WireframePlayerComponent],
  templateUrl: './example-panel.component.html',
  styleUrl: './example-panel.component.scss',
})
export class ExamplePanelComponent {
  @Input()
  example: ParsedExample | undefined;
}
