import StraightLine from "./StraightLine";

export default class Point implements Serializable {
  x: number;
  y: number;

  lines = new Set<StraightLine>();
  public serialize: () => string

  constructor(x: number, y: number, serialize: () => string) {
    this.x = x;
    this.y = y;
    this.serialize = serialize;
  }


  /**
   * 计算关于给定点的对称点。
   *
   * @param xOrPoint 如果为`Point`对象，则直接使用该点的坐标；如果为数字，则假定为x坐标，需要传入y参数。
   * @param y 当xOrPoint为数字时，此参数为y坐标。
   * @returns 对称点的`Point`对象。
   */
  symmetry(x: number, y: number): Point;
  symmetry(point: Point): Point;
  symmetry(xOrPoint: any, y?: any): Point {
    // 如果y存在，则xOrPoint是x坐标
    if (typeof xOrPoint === 'number' && typeof y === 'number') {
      return this._symmetry(xOrPoint, y);
    } else {
      const { x, y } = xOrPoint;
      return this._symmetry(x, y);
    }
  }
  private _symmetry(x: number, y: number) {
    this.x = 2 * x - this.x;
    this.y = 2 * y - this.y;
    return this;
  }

  // 计算两点之间的距离
  distanceTo(x: number, y: number): number;
  distanceTo(point: Point): number;
  distanceTo(xOrPoint: number | Point, y?: number): number {
    if (typeof xOrPoint === 'number') {
      return this._distanceTo(xOrPoint, y!);
    } else {
      const { x, y } = xOrPoint;
      return this._distanceTo(x, y);
    }
  }
  private _distanceTo(x: number, y: number) {
    return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
  }

  // 沿k方向移动l距离
  move(k: number, l: number) {
    const t = Math.atan(k);
    this.x += l * Math.cos(t);
    this.y += l * Math.sin(t);
    return this;
  }

  moveRelaX(l: number) {
    this.x += l;
    return this;
  }
  moveRelaY(l: number) {
    this.y += l;
    return this;
  }
  moveRela(x: number, y: number) {
    this.moveRelaX(x);
    this.moveRelaY(y);
    return this;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  rotate(point: Point, deg: number);
  rotate(cx: number, cy: number, deg: number);
  rotate(cxOrPoint: number | Point, cyOrDeg: number, deg?: number) {
    if (typeof cxOrPoint === 'number') {
      return this._rotate(cxOrPoint, cyOrDeg, deg!);
    } else {
      const { x, y } = cxOrPoint;
      return this._rotate(x, y, cyOrDeg);
    }
  }
  private _rotate(cx: number, cy: number, deg: number) {
    const t = (Math.PI / 180) * deg;
    const x = this.x,
      y = this.y;
    this.x = (x - cx) * Math.cos(t) - (y - cy) * Math.sin(t) + cx;
    this.y = (x - cx) * Math.sin(t) + (y - cy) * Math.cos(t) + cy;
    return this;
  }
}
// document.createElement;
