import {
  AfterViewInit,
  Component,
  computed,
  Input,
  Optional,
  signal,
} from '@angular/core';
import { ParsedViewNode } from 'spequoia-core/dist/model/parsed-document.model';
import { NgClass } from '@angular/common';
import { WireframePlayerService } from '../../services/wireframe-player.service';

@Component({
  selector: 'app-view-node',
  imports: [NgClass],
  templateUrl: './view-node.component.html',
  styleUrl: './view-node.component.scss',
})
export class ViewNodeComponent implements AfterViewInit {
  @Input()
  set viewNode(parsedViewNode: ParsedViewNode) {
    this._viewNode = parsedViewNode;
    this.updateText();
  }

  get viewNode(): ParsedViewNode {
    return this._viewNode;
  }

  private _viewNode!: ParsedViewNode;

  @Input() showSelector: boolean = false;

  $text = signal('');

  $active = computed(() => {
    if (!this.wireframePlayerService) {
      return false;
    }

    return this.wireframePlayerService
      .currentTargets()
      .includes(this.viewNode.name);
  });

  $roleClass = computed(() => {
    const role = this.viewNode.role;

    if (role) {
      return 'role-' + role;
    }

    return '';
  })

  constructor(
    @Optional()
    private readonly wireframePlayerService?: WireframePlayerService,
  ) {}

  ngAfterViewInit(): void {
    this.updateText();
  }

  updateText() {
    const text = this.viewNode.text;

    if (!text) {
      return;
    }

    if (this.viewNode.typing) {
      this.$text.set(this.viewNode.placeholder || '');

      setTimeout(() => {
        let i = 0;

        const interval = setInterval(() => {
          if (i < text.length) {
            const currentText = text.substring(0, i);
            this.$text.set(currentText);
            i++;
          } else {
            this.$text.set(text);
            clearInterval(interval);
          }
        }, 80);
      }, 100);
    } else {
      this.$text.set(text);
    }
  }

  get cssClass(): string {
    if (this.viewNode?.role === 'row') {
      return 'row';
    } else {
      return 'column';
    }
  }
}
