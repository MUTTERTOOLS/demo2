import Arc from './Arc';
import Face from './Face';
import type { LineGeneratorList, LineGenerator } from './Face';
import Point from './Point';
import SegmentLine from './SegmentLine';
export type SlotsPositon =
  | 'leftTop'
  | 'rightTop'
  | 'rightBottom'
  | 'leftBottom'
  | 'topCenter'
  | 'bottomCenter'
  | 'leftCenter'
  | 'rightCenter';
// export type RectangleOption = {
//   radius?: Record<SlotsPositon, number>;
// };
export type RectangleSlots = Partial<
  Record<
    SlotsPositon,
    {
      width: number;
      height: number;
      list: () => LineGeneratorList | LineGenerator;
    }
  >
>;
export default class Rectangle extends Face {
  width: number;
  height: number;
  // option?: RectangleOption;
  slots: RectangleSlots = {};

  // get radius() {
  //   return this.option?.radius;
  // }

  getLineGeneratorList(): LineGeneratorList {
    debugger;
    return [
      this.slots['leftTop']?.list?.(),
      (pre, idx, arr) =>
        new SegmentLine(
          pre,
          pre
            .clone()
            .moveRelaX(
              this.width / 2 -
                withDefault(this.slots['topCenter']?.width, 0) -
                withDefault(this.slots['leftTop']?.width, 0)
            )
        ),
      this.slots['topCenter']?.list?.(),

      (pre, idx, arr) =>
        new SegmentLine(
          pre,
          pre
            .clone()
            .moveRelaX(
              this.width / 2 -
                withDefault(this.slots['topCenter']?.width, 0) -
                withDefault(this.slots['rightTop']?.width, 0)
            )
        ),
      this.slots['rightTop']?.list?.(),

      (pre, idx, arr) =>
        new SegmentLine(
          pre,
          pre
            .clone()
            .moveRelaY(
              this.height / 2 -
                withDefault(this.slots['rightCenter']?.height, 0) -
                withDefault(this.slots['rightTop']?.height, 0)
            )
        ),
      this.slots['rightCenter']?.list?.(),

      (pre, idx, arr) =>
        new SegmentLine(
          pre,
          pre
            .clone()
            .moveRelaY(
              this.height / 2 -
                withDefault(this.slots['rightCenter']?.height, 0) -
                withDefault(this.slots['rightBottom']?.height, 0)
            )
        ),
      this.slots['rightBottom']?.list?.(),

      (pre, idx, arr) =>
        new SegmentLine(
          pre,
          pre
            .clone()
            .moveRelaX(
              -(
                this.width / 2 -
                withDefault(this.slots['bottomCenter']?.width, 0) -
                withDefault(this.slots['rightBottom']?.width, 0)
              )
            )
        ),
      this.slots['bottomCenter']?.list?.(),

      (pre, idx, arr) =>
        new SegmentLine(
          pre,
          pre
            .clone()
            .moveRelaX(
              -(
                this.width / 2 -
                withDefault(this.slots['bottomCenter']?.width, 0) -
                withDefault(this.slots['leftBottom']?.width, 0)
              )
            )
        ),
      this.slots['leftBottom']?.list?.(),

      (pre, idx, arr) =>
        new SegmentLine(
          pre,
          pre
            .clone()
            .moveRelaY(
              -(
                this.height / 2 -
                withDefault(this.slots['leftCenter']?.height, 0) -
                withDefault(this.slots['leftBottom']?.height, 0)
              )
            )
        ),
      this.slots['leftCenter']?.list?.(),

      (pre, idx, arr) =>
        new SegmentLine(
          pre,
          pre
            .clone()
            .moveRelaY(
              -(
                this.height / 2 -
                withDefault(this.slots['leftCenter']?.height, 0) -
                withDefault(this.slots['leftTop']?.height, 0)
              )
            )
        )
    ];
  }
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
  // setSlot(slotName: SlotsPositon, fn: LineGeneratorList | LineGenerator) {
  //   this.slots[slotName] = fn;
  // }
  // getSlot(slotName: RadiusPositon) {
  //   const slot = this.slots[slotName];
  //   if (slot === undefined) return;
  //   if (Array.isArray(slot)) {
  //     return function (prePoint, index, array) {
  //       let list: LineGeneratorList = [];
  //       return slot.reduce((pre, curr) => {
  //         if(curr !== undefined) pre.push(curr(prePoint, index, array));
  //       }, list);
  //     };
  //   }
  //   if (slot) {
  //     return [slot];
  //   }
  //   return [];
  // }
  // return this.slots[slotName];
  // }
  // setSlots(slots: Partial<Record<RadiusPositon, LineGeneratorList>>) {
  //   for (const key in slots) {
  //     this.setSlot(key as RadiusPositon, slots[key]);
  //   }
  // }
}

// function createArc() {
//   return new Arc();
// }
type NoNullAndUndefined<T> = T extends undefined | null ? never : T;
function withDefault<T>(value: T, defaultVal: NonNullable<T>) {
  return value ?? defaultVal;
}
