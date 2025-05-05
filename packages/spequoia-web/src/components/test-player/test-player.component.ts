import {Component, computed, Input, OnInit, signal} from '@angular/core';
import {ParsedExample} from 'spequoia-core/dist';
import {HttpClient} from '@angular/common/http';

const FRAME_DURATION = 100;

@Component({
  selector: 'app-test-player',
  imports: [],
  templateUrl: './test-player.component.html',
  styleUrl: './test-player.component.scss'
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

  private sections: Section[] = [];
  private allFrames: any[] = [];
  private playInterval?: number;

  constructor(public readonly http: HttpClient) {
  }

  public ngOnInit(): void {
    if (this.example) {
      this.screenshotSrc.set(`player-data/${this.example.id}/0.png`);

      this.http.get<Manifest>(`player-data/${this.example.id}/screenshot-manifest.json`).subscribe(manifest => {
        console.log(manifest);

        this.sections = manifest.sections;

        this.allFrames = [];
        for (let i = 0; i < manifest.frameCount; i++) {
          this.allFrames.push(i);
        }

        // Map each frame to the closest previous step index
        this.$sectionByFrame.set(this.allFrames.map(f => {
          for (let i = this.sections.length - 1; i >= 0; i--) {
            if (f >= this.sections[i].startFrame) return this.sections[i];
          }

          return null;
        }));

        this.showFrame(0);
        this.renderTimeline();
      })
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
      clearInterval(this.playInterval)
    }
  }

  private renderTimeline() {
    const timelineSections: TimelineSection[] = [];

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];

      const sectionLength = Math.min(section.endFrame, this.allFrames.length - 1) - section.startFrame;
      const sectionRelativeWidth = (sectionLength / (this.allFrames.length - 1)) * 100;
      const width = section.endFrame < this.allFrames.length ? `calc(${sectionRelativeWidth}% - 2px)` : `${sectionRelativeWidth}%`;

      const relativePosition = (section.startFrame / (this.allFrames.length - 1)) * 100;
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

    console.log(timelineSections);

    this.$sections.set(timelineSections);

    this.updateTimeline();
  }

  updateTimeline() {
    if (this.allFrames.length > 1) {
      const percent = this.$currentFrame() / (this.allFrames.length - 1);
      this.$indicatorLeft.set((percent * 100) + '%');
    }

    const timelineSections = this.$sections();
    const currentFrame = this.$currentFrame();

    for (const section of timelineSections) {
      if (currentFrame >= section.endFrame) {
        section.progressWidth = '100%';
      } else if (currentFrame < section.startFrame) {
        section.progressWidth = '0%';
      } else {
        const sectionLength = Math.min(this.allFrames.length - 1, section.endFrame) - section.startFrame;
        const sectionProgress = (currentFrame - section.startFrame) / sectionLength;
        section.progressWidth = (sectionProgress * 100) + '%';
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
