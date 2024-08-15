import Line from './Line';
import Point from './Point';
import { boxAttributes } from '../params'
import { parseToFunc } from '../parser/parser2';
export default class StraightLine implements Serializable {
  // 当A=0，直线是水平的。
  // 当B=0，直线是垂直的。
  A: number;
  B: number;
  C: number;

  formula: string
  public serialize: () => string


  get k() {
    // if(this.B === 0) throw new Error('斜率不存在');
    return (-this.A / this.B);
  }
  get b() {
    // if(this.B === 0) throw new Error('斜率不存在');
    return (-this.C / this.B);
  }

  constructor(A: number, B: number, formula: string, serialize: () => string) {
    this.A = A;
    this.B = B;
    this.formula = formula;
    this.serialize = serialize;

    const C = parseToFunc(formula)(boxAttributes.value);
    this.C = -C;  // 此处变号
  }
  static createByPoints(p1: Point, p2: Point) {
    if(p1.x === p2.x) {
      return new StraightLine(1, 0, p1.x);
    }

    const A = p2.y - p1.y;
    const B = p1.x - p2.x;
    const C = A * p1.x + B * p1.y;
    return new StraightLine(A, B, C);
  }
  
  static createByKAndPoint(k: number, p: Point) {

  }

  isPointOnStraightLine(point: Point): boolean {
    return this.k * point.x + this.b === point.y;
  }

  /**
   *
   * @param p 对称点
   * @returns
   */
  // symmetryByPoint(p: Point): Line {
  //   // 因为斜率不变，只需计算新的截距b'
  //   const b = p.y - this.k * p.x;
  //   return new Line(this.k, b);
  // }

  // symmetryByLine() { }

  // translateX(x: number) {
  //   const b = this.b - this.k * x;
  //   return new StraightLine(this.k, b);
  // }
  // translateY(y: number) {
  //   return new StraightLine(this.k, this.b + y);
  // }

  distanceToPoint(point: Point): number;
  distanceToPoint(x: number, y: number): number;
  distanceToPoint(xOrPoint: number | Point, y?: number) {
    let x = 0;
    if (typeof xOrPoint === 'number') {
      x = xOrPoint;
    } else {
      x = xOrPoint.x;
      y = xOrPoint.y;
    }
    return Math.abs(this.k * x - y! + this.b) / Math.sqrt(this.k ** 2 + 1);
  }
}
