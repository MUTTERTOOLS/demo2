import Line from './Line';
import Point from './Point';
import StraightLine from './StraightLine';

export default class SegmentLine implements Line {
  public line: StraightLine;
  public p1: Point;
  public p2: Point;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
    // const k = (p1.y - p2.y) / (p1.x - p1.x)
    this.line = StraightLine.createByPoints(p1, p2);
  }

  get k() {
    return this.line.k;
  }
  get b() {
    return this.line.b;
  }
}

