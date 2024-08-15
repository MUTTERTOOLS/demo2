import Rectangle, { RectangleSlots } from './Rectangle';
// import { RadiusPositon } from './Rectangle';
import type { LineGeneratorList, LineGenerator } from './Face';
import SegmentLine from './SegmentLine';
import Arc from './Arc';

export default class RoundedRectangle extends Rectangle {
  lt: number = 0;
  lb: number = 0;
  rt: number = 0;
  rb: number = 0;
  slots: RectangleSlots = {
    leftTop: {
      width: this.lt,
      height: this.lt,
      list: () => {
        return [
          (pre, idx, arr) =>
            new SegmentLine(pre, pre.clone().moveRelaY(this.lt).setReposition(true)),
          (pre, idx, arr) =>
            new Arc(pre, pre.clone().moveRela(this.lt, -this.lt), this.lt, this.lt, 0, 0, 1)
        ];
      }
    },

    rightTop: {
      width: this.rt,
      height: this.rt,
      list: () => {
        return [
          (pre, idx, arr) =>
            new Arc(pre, pre.clone().moveRela(this.rt, this.rt), this.rt, this.rt, 0, 0, 1)
        ];
      }
    },

    rightBottom: {
      width: this.rb,
      height: this.rb,
      list: () => {
        return [
          (pre, idx, arr) =>
            new Arc(pre, pre.clone().moveRela(-this.rb, this.rb), this.rb, this.rb, 0, 0, 1)
        ];
      }
    },

    leftBottom: {
      width: this.lb,
      height: this.lb,
      list: () => {
        return [
          (pre, idx, arr) =>
            new Arc(pre, pre.clone().moveRela(-this.lb, -this.lb), this.lb, this.lb, 0, 0, 1)
        ];
      }
    }
  };
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
  setRadius(lt: number, rt?: number, rb?: number, lb?: number) {
    this.lt = lt;
    this.slots.leftTop!.width = this.lt;
    this.slots.leftTop!.height = this.lt;

    this.rt = rt || 0;
    this.slots.rightTop!.width = this.rt;
    this.slots.rightTop!.height = this.rt;

    this.rb = rb || 0;
    this.slots.rightBottom!.width = this.rb;
    this.slots.rightBottom!.height = this.rb;

    this.lb = lb || 0;
    this.slots.leftBottom!.width = this.lb;
    this.slots.leftBottom!.height = this.lb;

    return this;
  }
}

// this.radius?.leftTop !== undefined
//       ? (pre, idx, arr) =>
//           new Arc(
//             pre,
//             pre.clone().moveRelative(this.radius!.leftTop, this.radius!.leftTop),
//             this.radius!.leftTop,
//             this.radius!.leftTop,
//             0,
//             0,
//             0
//           )
//       : undefined,
