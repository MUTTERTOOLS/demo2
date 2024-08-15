import Point from './Point';
import StraightLine from './StraightLine';
import SegmentLine from './SegmentLine';
import Arc from './Arc';
import Line from './Line';

export type LineGenerator = (prePoint: Point, index: number, array: Line[]) => Line;
export type LineGeneratorList = Array<LineGenerator | undefined | LineGeneratorList>;

export default class Face {
  x: number;
  y: number;
  slots?: Record<any, any>;

  public getLineGeneratorList(): LineGeneratorList {
    return [];
  }

  generate() {
    const list: Line[] = [];
    const start = new Point(this.x, this.y);
    _gen.call(this, this.getLineGeneratorList());
    return list;

    function _gen(lineList: LineGeneratorList) {
      for (let i = 0; i < lineList.length; i++) {
        const fn = lineList[i];
        if (fn) {
          if (Array.isArray(fn)) {
            _gen(fn);
          } else {
            const pre = list.length === 0 ? start : list[list.length - 1].p2;
            list.push(fn(pre, list.length, list));
          }
        }
      }
    }
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
