import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-yaml-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-button" (click)="close()">×</button>
        <button class="raw-button" (click)="download()">Download</button>
        <pre><code #codeBlock class="yaml">{{ content }}</code></pre>
      </div>
    </div>
  `,
  styleUrls: ['./yaml-modal.component.scss'],
})
export class YamlModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Input() content: string = '';

  close() {
    this.closeModal.emit();
  }

  public download(): void {
    const blob = new Blob([this.content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'example.yaml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
