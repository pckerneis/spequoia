import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { getContrastingTextColor } from '../../utils/color-utils';

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

  color = computed(() => {
    return this.documentService.getTagColor(this.tagName) ?? 'var(--tag-bg)';
  });

  textColor = computed(() => {
    return getContrastingTextColor(this.color(), 0.8);
  });

  @Output()
  onDelete = new EventEmitter<string>();

  @Output()
  onClick = new EventEmitter<string>();

  constructor(private readonly documentService: DocumentService) {}

  deleteTag() {
    this.onDelete.emit(this.tagName);
  }

  public handleClick(): void {
    this.onClick.emit(this.tagName);
  }
}
