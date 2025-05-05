import {
  Component,
  computed,
  ElementRef,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { ParsedExample } from 'spequoia-core/dist';
import { HttpClient } from '@angular/common/http';

const FRAME_DURATION = 100;

@Component({
  selector: 'app-test-player',
  imports: [],
  templateUrl: './test-player.component.html',
  styleUrl: './test-player.component.scss',
})
export class TestPlayerComponent implements OnInit {
  @Input()
  example!: ParsedExample;

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

  private sections: Section[] = [];
  private allFrames: number[] = [];
  private playInterval?: number;

  constructor(
    public readonly http: HttpClient,
    private elementRef: ElementRef,
  ) {}

  public ngOnInit(): void {
    if (this.example) {
      this.screenshotSrc.set(`player-data/${this.example.id}/0.png`);

      this.http
        .get<Manifest>(
          `player-data/${this.example.id}/screenshot-manifest.json`,
        )
        .subscribe((manifest) => {
          this.sections = manifest.sections;

          this.allFrames = [];
          for (let i = 0; i < manifest.frameCount; i++) {
            this.allFrames.push(i);
          }

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
        });
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
    this.$playing.set(true);
    this.playInterval = window.setInterval(() => {
      if (this.$currentFrame() < this.allFrames.length - 1) {
        this.showFrame(this.$currentFrame() + 1);
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

  showFrame(frameIdx: number) {
    if (frameIdx < 0 || frameIdx >= this.allFrames.length) return;
    this.$currentFrame.set(frameIdx);
    this.screenshotSrc.set(`player-data/${this.example.id}/${frameIdx}.png`);
    this.updateTimeline();
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
}

interface Section {
  name: string;
  startFrame: number;
  endFrame: number;
}

interface Manifest {
  sections: Section[];
  frameCount: number;
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
