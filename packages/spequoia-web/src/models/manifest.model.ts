export interface Section {
  name: string;
  startFrame: number;
  endFrame: number;
}

export interface Manifest {
  sections: Section[];
  frameCount: number;
  startTime: number;
}
