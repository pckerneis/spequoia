import { Component, computed, Input, Optional } from '@angular/core';
import { ParsedViewNode } from 'spequoia-core/dist/model/parsed-document.model';
import { NgClass } from '@angular/common';
import { WireframePlayerService } from '../../services/wireframe-player.service';

@Component({
  selector: 'app-view-node',
  imports: [NgClass],
  templateUrl: './view-node.component.html',
  styleUrl: './view-node.component.scss',
})
export class ViewNodeComponent {
  @Input() viewNode!: ParsedViewNode;
  @Input() showSelector: boolean = false;

  active = computed(() => {
    if (!this.wireframePlayerService) {
      return false;
    }

    console.log(
      'active',
      this.wireframePlayerService.currentTargets(),
      this.viewNode.name,
    );

    return this.wireframePlayerService
      .currentTargets()
      .includes(this.viewNode.name);
  });

  constructor(
    @Optional()
    private readonly wireframePlayerService?: WireframePlayerService,
  ) {}

  get cssClass(): string {
    if (this.viewNode?.direction === 'row') {
      return 'row';
    } else {
      return 'column';
    }
  }
}
