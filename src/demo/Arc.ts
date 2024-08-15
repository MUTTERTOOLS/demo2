import Line from './Line';
import Point from './Point';

export default class Arc implements Line {
  p1: Point;
  p2: Point;
  rx: number;
  ry: number;
  ang: number;
  arc: number;
  dir: number;

  constructor(
    p1: Point,
    p2: Point,
    rx: number,
    ry: number,
    ang?: number,
    arc?: number,
    dir?: number
  ) {
    this.p1 = p1;
    this.p2 = p2;
    this.rx = rx;
    this.ry = ry;
    this.ang = ang || 0;
    this.arc = arc || 0;
    this.dir = dir || 0;
  }
}
