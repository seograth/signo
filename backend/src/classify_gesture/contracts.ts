export class ClassifyGestureResponse {
  gesture: string;

  constructor(gesture: string) {
    this.gesture = gesture;
  }
}

export type ClassifyGestureRequest = {
  hands: Hand[];
}

type Hand = {
  handedness: "Left" | "Right";
  landmarks: Landmark[];
}

type Landmark = {
  x: number;
  y: number;
  z: number;
}
