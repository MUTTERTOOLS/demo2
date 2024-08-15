import Face from './Face';
import SegmentLine from './SegmentLine';
import Arc from './Arc';
import { PathItem } from './../knifes/PathItem';
// import { useRequest } from 'vue-request';
// function fn() {
//   return new Promise<number>(resolve => {
//     setTimeout(() => resolve(1000), 2000);
//     return 1000;
//   });
// }
// const { data, run } = useRequest(fn);
// run();
// console.log(data);
// console.log(run);

export default class Adapter {
  static transformToPathItem(face: Face) {
    // const points = face.generate().map(segLine => segLine.p2);
    const lines = face.generate();
    const result = [
      new PathItem({
        mtd: 'M',
        x: face.x,
        y: face.y
      })
    ];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const point = line.p2;
      const { x, y } = point;
      if (point.reposition) {
        result.push(
          new PathItem({
            mtd: 'M',
            x: x,
            y: y
          })
        );
      } else if (line instanceof SegmentLine) {
        result.push(
          new PathItem({
            mtd: 'L',
            x: x,
            y: y
          })
        );
      } else if (line instanceof Arc) {
        result.push(
          new PathItem({
            mtd: 'A',
            x: x,
            y: y,
            rx: line.rx,
            ry: line.ry,
            ang: line.ang,
            arc: line.arc,
            dir: line.dir
          })
        );
      }
    }
    result.push(new PathItem({ mtd: 'Z', x: 0, y: 0 }));
    return result;
  }
}
