import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class TagComponent {
  @Input() tagName!: string;
  @Input() deletable: boolean = false;
  @Input() clickable: boolean = false;

  @Output()
  onDelete = new EventEmitter<string>();

  @Output()
  onClick = new EventEmitter<string>();

  deleteTag() {
    this.onDelete.emit(this.tagName);
  }

  public handleClick(): void {
    this.onClick.emit(this.tagName);
  }
}
