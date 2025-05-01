import { Component, computed, Input, Optional } from '@angular/core';
import { ParsedViewNode } from 'spequoia-core/dist/model/parsed-document.model';
import { NgClass } from '@angular/common';
import {
  ComputedNodeState,
  WireframePlayerService,
} from '../../services/wireframe-player.service';

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

    return this.wireframePlayerService
      .currentTargets()
      .includes(this.viewNode.name);
  });

  computedNodeState = computed<ComputedNodeState | undefined>(() => {
    if (this.wireframePlayerService) {
      return this.wireframePlayerService.computedNodeStates()?.[
        this.viewNode.name
      ];
    }

    return undefined;
  });

  computedText = computed(() => {
    return this.computedNodeState()?.text ?? this.viewNode.text;
  });

  computedPlaceholder = computed(() => {
    return this.computedNodeState()?.placeholder;
  });

  computedEmpty = computed(() => {
    return this.computedNodeState()?.empty;
  });

  computedHidden = computed(() => {
    return this.computedNodeState()?.hidden;
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
