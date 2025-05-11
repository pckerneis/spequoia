import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tag-dropdown',
  standalone: true,
  imports: [CommonModule, TagComponent],
  templateUrl: './tag-dropdown.component.html',
  styleUrl: './tag-dropdown.component.scss',
})
export class TagDropdownComponent {
  @Input() availableTags: string[] = [];
  @Input() selectedTags: string[] = [];
  @Output() tagToggled = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.closed.emit();
    }
  }

  toggleTag(tag: string) {
    this.tagToggled.emit(tag);
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.closed.emit();
    }
  }

  isSelected(tag: string): boolean {
    return this.selectedTags.includes(tag);
  }
}
