type Formula = string;

interface Serializable {
  serialize(): string
}

interface Point extends Serializable {
  x: number
  y: number
}

interface StraightLine extends Serializable {
  A: number
  B: number
  C: number
}

type Auxiliary = StraightLine;

interface SegmentLine {
  p1: Point
  p2: Point
}

interface Circle {
  cx: number
  cy: number
  r: number
}