import { ParsedOverlay } from 'spequoia-core/dist';

export interface Section {
  name: string;
  startFrame: number;
  endFrame: number;
}

export interface Manifest {
  sections: Section[];
  frameCount: number;
  startTime: number;
  overlays: OverlayRendering[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OverlayRendering {
  targetBounds: BoundingBox;
  overlay: ParsedOverlay;
}
