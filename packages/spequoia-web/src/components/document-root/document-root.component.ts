import { AfterViewInit, Component, computed, ElementRef, Input, NgZone, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FeaturePanelComponent } from '../feature-panel/feature-panel.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ProcessedDocument } from '../../models/processed-document.model';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-document-root',
  standalone: true,
  imports: [FeaturePanelComponent],
  templateUrl: './document-root.component.html',
  styleUrls: ['./document-root.component.scss']
})
export class DocumentRootComponent implements AfterViewInit, OnDestroy {
  @Input() processedDocument!: ProcessedDocument | null;

  @ViewChild('mainContainer')
  mainContainer?: ElementRef<HTMLElement>;

  private scrollSubscription?: Subscription;

  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly ngZone: NgZone
  ) {}

  activeHeadingId = signal('');

  safeProcessedDescription = computed(() => {
    const description = this.processedDocument?.processedDescription;

    if (!description) {
      return '';
    }

    return this.domSanitizer.bypassSecurityTrustHtml(description);
  });

  ngAfterViewInit(): void {
    this.scrollToHashHeading();
    this.setupScrollListener();
  }

  private scrollToHashHeading(): void {
    if (!this.mainContainer?.nativeElement || !this.processedDocument) {
      return;
    }

    const hash = window.location.hash.slice(1); // Remove the # symbol
    if (!hash) {
      return;
    }

    const headingElement = this.mainContainer.nativeElement.querySelector(`#${hash}`);
    if (headingElement) {
      this.activeHeadingId.set(hash);

      const container = this.mainContainer.nativeElement;
      const containerRect = container.getBoundingClientRect();
      const headingRect = headingElement.getBoundingClientRect();
      const scrollTop = headingRect.top - containerRect.top + container.scrollTop - 10;

      container.scrollTo({
        top: scrollTop,
      });
    }
  }

  private setupScrollListener(): void {
    if (!this.mainContainer?.nativeElement) {
      return;
    }

    this.scrollSubscription?.unsubscribe();
    this.scrollSubscription = fromEvent(this.mainContainer.nativeElement, 'scroll')
      .pipe(debounceTime(10))
      .subscribe(() => {
        this.ngZone.run(() => {
          this.updateActiveHeading();
        });
      });

    this.updateActiveHeading();
  }

  private updateActiveHeading(): void {
    if (!this.mainContainer?.nativeElement || !this.processedDocument?.headings.length) {
      return;
    }

    const container = this.mainContainer.nativeElement;
    const headings = Array.from(container.querySelectorAll('[id]'))
      .filter(el => this.processedDocument?.headings.some(h => h.id === el.id));

    if (!headings.length) {
      return;
    }

    const containerHeight = container.clientHeight;
    const buffer = 50; // Buffer zone to consider a heading "active"

    // Find the first heading that's within the viewport with a buffer
    for (const heading of headings) {
      const rect = heading.getBoundingClientRect();
      const headingTop = rect.top - container.getBoundingClientRect().top;

      if (headingTop >= -buffer && headingTop <= containerHeight / 2) {
        this.activeHeadingId.set(heading.id);
        window.history.replaceState(null, '', `#${heading.id}`);
        return;
      }
    }

    // If no heading is in the viewport's top half, use the last heading before viewport
    let lastHeadingBeforeViewport = headings[0];
    for (const heading of headings) {
      const rect = heading.getBoundingClientRect();
      const headingTop = rect.top - container.getBoundingClientRect().top;

      if (headingTop <= 0) {
        lastHeadingBeforeViewport = heading;
      } else {
        break;
      }
    }

    window.history.replaceState(null, '', `#${lastHeadingBeforeViewport.id}`);
    this.activeHeadingId.set(lastHeadingBeforeViewport.id);
  }

  public onHeadingClick(id: string): void {
    this.activeHeadingId.set(id);
    const headingElement = document.getElementById(id);

    if (headingElement && this.mainContainer?.nativeElement) {
      const container = this.mainContainer.nativeElement;
      const containerRect = container.getBoundingClientRect();
      const headingRect = headingElement.getBoundingClientRect();
      const scrollTop = headingRect.top - containerRect.top + container.scrollTop - 20;

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
