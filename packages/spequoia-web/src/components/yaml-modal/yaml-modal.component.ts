import {
  Component,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('yaml', yaml);

@Component({
  selector: 'app-yaml-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-button" (click)="close()">×</button>
        <button class="raw-button" (click)="showRaw()">Show raw</button>
        <pre><code #codeBlock class="yaml"></code></pre>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: var(--background);
        padding: 0.5rem;
        border-radius: 4px;
        min-width: 50%;
        min-height: 50%;
        max-width: 90%;
        max-height: 90vh;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
      }

      .close-button {
        border: none;
        background: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-left: auto;
      }

      .raw-button {
        margin: 0.5rem auto;
        background: var(--background);
        border: 1px solid var(--accent);
        color: var(--accent);
        cursor: pointer;

        &:hover {
          background: var(--background-50);
        }
      }

      .close-button:hover {
        background: rgba(0, 0, 0, 0.1);
      }

      pre {
        margin: 0;
        padding: 0.5rem;
        background: var(--darker-30);
        overflow: auto;
      }

      code {
        font-family: 'Consolas', 'Monaco', monospace;
      }
    `,
  ],
})
export class YamlModalComponent implements AfterViewInit, OnChanges {
  @ViewChild('codeBlock') codeBlock!: ElementRef;
  @Output() closeModal = new EventEmitter<void>();
  @Input() content: string = '';

  ngAfterViewInit() {
    this.applyContent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && !changes['content'].firstChange) {
      this.applyContent();
    }
  }

  private applyContent() {
    if (!this.codeBlock) {
      return;
    }
    const codeElement = this.codeBlock.nativeElement;
    codeElement.innerHTML = hljs.highlight(this.content, {
      language: 'yaml',
    }).value;
  }

  close() {
    this.closeModal.emit();
  }

  public showRaw(): void {
    const a = document.createElement('a');
    a.href = 'example.yaml';
    a.target = '_blank';
    a.click();
  }
}
