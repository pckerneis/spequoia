import {
  Component,
  computed,
  ElementRef,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExampleWithManifest } from '../../models/processed-document.model';
import { OverlayRendering, Section } from '../../models/manifest.model';

const FRAME_DURATION = 100;

@Component({
  selector: 'app-test-player',
  imports: [],
  templateUrl: './test-player.component.html',
  styleUrl: './test-player.component.scss',
})
export class TestPlayerComponent implements OnInit {
  @Input()
  example!: ExampleWithManifest;

  screenshotSrc = signal('');

  $playing = signal(false);
  $currentFrame = signal(0);
  $sectionByFrame = signal([] as (Section | null)[]);
  $currentStep = computed(() => {
    return this.$sectionByFrame()[this.$currentFrame()];
  });
  $indicatorLeft = signal('0');
  $sections = signal<TimelineSection[]>([]);
  $currentSectionName = computed(() => {
    const section = this.$currentStep();
    return section ? section.name : '';
  });

  $previewVisible = signal(false);
  $previewLeft = signal('0px');
  $previewFrame = signal('');
  $previewSectionName = signal('');
  $isDragging = signal(false);

  $currentOverlay = computed(() => {
    const frame = this.$currentFrame();
    return this.overlays[frame + 1] || null;
  });
  $targetBox = computed(() => {
    const overlay = this.$currentOverlay();
    if (overlay) {
      return overlay.targetBounds;
    }
    return null;
  });
  $overlayPosition = computed(() => {
    const bounds = this.$targetBox();

    if (bounds) {
      return {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height + 5,
      };
    }

    return null;
  });

  private sections: Section[] = [];
  private allFrames: number[] = [];
  private overlays: OverlayRendering[] = [];
  private playInterval?: number;
  private preloadedImages: Map<number, HTMLImageElement> = new Map();

  constructor(
    public readonly http: HttpClient,
    private elementRef: ElementRef,
  ) {}

  public ngOnInit(): void {
    if (this.example?.manifest) {
      const manifest = this.example.manifest;
      this.sections = manifest.sections;
      this.overlays = manifest.overlays;

      this.allFrames = [];
      for (let i = 0; i < manifest.frameCount; i++) {
        this.allFrames.push(i);
      }

      this.preloadImages();

      // Map each frame to the closest previous step index
      this.$sectionByFrame.set(
        this.allFrames.map((f) => {
          for (let i = this.sections.length - 1; i >= 0; i--) {
            if (f >= this.sections[i].startFrame) return this.sections[i];
          }

          return null;
        }),
      );

      this.showFrame(0);
      this.renderTimeline();
    }
  }

  togglePlayState() {
    if (this.$playing()) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.$playing()) return;

    if (this.playInterval) {
      clearInterval(this.playInterval);
    }

    if (this.$currentFrame() >= this.allFrames.length - 1) {
      this.showFrame(0);
    }

    this.$playing.set(true);

    this.playInterval = window.setInterval(() => {
      if (this.$currentFrame() < this.allFrames.length - 1) {
        this.showFrame(this.$currentFrame() + 1);

        const overlay = this.$currentOverlay();
        if (overlay) {
          this.pause();
        }
      } else {
        this.pause();
      }
    }, FRAME_DURATION);
  }

  pause() {
    this.$playing.set(false);

    if (this.playInterval) {
      clearInterval(this.playInterval);
    }
  }

  private getFrameFromMouseEvent(event: MouseEvent): number {
    const timeline =
      this.elementRef.nativeElement.querySelector('.timeline-bar');
    const rect = timeline.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const percentage = relativeX / rect.width;
    return Math.floor(percentage * this.allFrames.length);
  }

  private updatePreviewFromMouseEvent(event: MouseEvent) {
    const frame = this.getFrameFromMouseEvent(event);

    if (frame >= 0 && frame < this.allFrames.length) {
      const section = this.$sectionByFrame()[frame];
      if (section) {
        this.$previewVisible.set(true);
        const timeline =
          this.elementRef.nativeElement.querySelector('.timeline');
        if (timeline) {
          this.$previewLeft.set(
            `${event.clientX - timeline.getBoundingClientRect().left}px`,
          );
        }
        this.$previewFrame.set(`player-data/${this.example.id}/${frame}.png`);
        this.$previewSectionName.set(section.name);
      }
    }
  }

  onTimelineHover(event: MouseEvent) {
    if (!this.$isDragging()) {
      this.updatePreviewFromMouseEvent(event);
    }
  }

  onTimelineMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.$isDragging.set(true);
    this.pause();
    this.updateFrameFromMouseEvent(event);

    // Add global mouse event listeners
    window.addEventListener('mousemove', this.onGlobalMouseMove);
    window.addEventListener('mouseup', this.onGlobalMouseUp);
  }

  private onGlobalMouseMove = (event: MouseEvent) => {
    if (this.$isDragging()) {
      this.updateFrameFromMouseEvent(event);
      this.updatePreviewFromMouseEvent(event);
    }
  };

  private onGlobalMouseUp = () => {
    if (this.$isDragging()) {
      this.onTimelineMouseUp();
    }
  };

  onTimelineMouseMove(event: MouseEvent) {
    if (!this.$isDragging()) {
      this.onTimelineHover(event);
    }
  }

  onTimelineMouseUp() {
    this.$isDragging.set(false);
    this.$previewVisible.set(false);
    window.removeEventListener('mousemove', this.onGlobalMouseMove);
    window.removeEventListener('mouseup', this.onGlobalMouseUp);
  }

  private updateFrameFromMouseEvent(event: MouseEvent) {
    const timeline =
      this.elementRef.nativeElement.querySelector('.timeline-bar');
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const relativeX = Math.max(
      0,
      Math.min(event.clientX - rect.left, rect.width),
    );
    const percentage = relativeX / rect.width;
    const frame = Math.floor(percentage * this.allFrames.length);

    if (frame >= 0 && frame < this.allFrames.length) {
      this.showFrame(frame);
    }
  }

  hidePreview() {
    this.$previewVisible.set(false);
  }

  private renderTimeline() {
    const timelineSections: TimelineSection[] = [];

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];

      const sectionLength =
        Math.min(section.endFrame, this.allFrames.length - 1) -
        section.startFrame;
      const sectionRelativeWidth =
        (sectionLength / (this.allFrames.length - 1)) * 100;
      const width =
        section.endFrame < this.allFrames.length
          ? `calc(${sectionRelativeWidth}% - 2px)`
          : `${sectionRelativeWidth}%`;

      const relativePosition =
        (section.startFrame / (this.allFrames.length - 1)) * 100;
      const left = `${relativePosition}%`;

      timelineSections.push({
        name: section.name,
        width: width,
        left: left,
        sectionIndex: i,
        progressWidth: '0%',
        startFrame: section.startFrame,
        endFrame: section.endFrame,
      });
    }

    this.$sections.set(timelineSections);

    this.updateTimeline();
  }

  updateTimeline() {
    if (this.allFrames.length > 1) {
      const percent = this.$currentFrame() / (this.allFrames.length - 1);
      this.$indicatorLeft.set(percent * 100 + '%');
    }

    const timelineSections = this.$sections();
    const currentFrame = this.$currentFrame();

    for (const section of timelineSections) {
      if (currentFrame >= section.endFrame) {
        section.progressWidth = '100%';
      } else if (currentFrame < section.startFrame) {
        section.progressWidth = '0%';
      } else {
        const sectionLength =
          Math.min(this.allFrames.length - 1, section.endFrame) -
          section.startFrame;
        const sectionProgress =
          (currentFrame - section.startFrame) / sectionLength;
        section.progressWidth = sectionProgress * 100 + '%';
      }
    }

    this.$sections.set(timelineSections);
  }

  private preloadImages(): void {
    this.allFrames.forEach((frame) => {
      const img = new Image();
      img.src = `player-data/${this.example.id}/${frame}.png`;
      img.onload = () => {
        this.preloadedImages.set(frame, img);
      };
    });
  }

  private showFrame(frame: number): void {
    if (frame < 0 || frame >= this.allFrames.length) return;
    this.$currentFrame.set(frame);
    // Use preloaded image if available, otherwise fall back to direct URL
    const preloadedImage = this.preloadedImages.get(frame);
    this.screenshotSrc.set(
      preloadedImage?.src || `player-data/${this.example.id}/${frame}.png`,
    );
    this.$indicatorLeft.set(`${(frame / (this.allFrames.length - 1)) * 100}%`);
  }

  next() {
    for (let i = 0; i < this.sections.length; i++) {
      if (this.$currentFrame() < this.sections[i].startFrame) {
        this.showFrame(this.sections[i].startFrame);
        return;
      }
    }

    this.showFrame(this.allFrames.length - 1);
  }

  prev() {
    for (let i = this.sections.length - 1; i >= 0; i--) {
      if (this.$currentFrame() > this.sections[i].endFrame) {
        this.showFrame(this.sections[i].endFrame);
        return;
      }
    }

    this.showFrame(0);
  }

  public handleOverlayButtonClicked(): void {
    this.play();
  }
}

interface TimelineSection {
  name: string;
  width: string;
  left: string;
  endFrame: number;
  startFrame: number;
  sectionIndex: number;
  progressWidth: string;
}
